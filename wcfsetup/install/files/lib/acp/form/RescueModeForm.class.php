<?php

namespace wcf\acp\form;

use Laminas\Diactoros\Response\RedirectResponse;
use wcf\data\application\Application;
use wcf\data\application\ApplicationAction;
use wcf\data\application\ApplicationEditor;
use wcf\data\application\ApplicationList;
use wcf\data\user\authentication\failure\UserAuthenticationFailure;
use wcf\data\user\authentication\failure\UserAuthenticationFailureAction;
use wcf\data\user\User;
use wcf\form\AbstractCaptchaForm;
use wcf\system\application\ApplicationHandler;
use wcf\system\exception\NamedUserException;
use wcf\system\exception\UserInputException;
use wcf\system\Regex;
use wcf\system\request\RouteHandler;
use wcf\system\user\authentication\EmailUserAuthentication;
use wcf\system\user\authentication\UserAuthenticationFactory;
use wcf\system\WCF;
use wcf\system\WCFACP;
use wcf\util\FileUtil;
use wcf\util\HeaderUtil;
use wcf\util\StringUtil;
use wcf\util\UserUtil;

/**
 * Shows the rescue mode form.
 *
 * @author  Alexander Ebert
 * @copyright   2001-2019 WoltLab GmbH
 * @license GNU Lesser General Public License <http://opensource.org/licenses/lgpl-license.php>
 * @package WoltLabSuite\Core\Acp\Form
 */
final class RescueModeForm extends AbstractCaptchaForm
{
    /**
     * @var Application[]
     */
    public $applications;

    /**
     * @var string[][]
     */
    public $applicationValues = [];

    /**
     * login password
     * @var string
     */
    public $password = '';

    /**
     * @var User
     */
    public $user;

    /**
     * login username
     * @var string
     */
    public $username = '';

    /**
     * @inheritDoc
     */
    public $useCaptcha = false;

    public $domainName = '';

    /**
     * @inheritDoc
     */
    public function __run()
    {
        if (!WCFACP::inRescueMode()) {
            // redirect to currently active application's ACP
            return new RedirectResponse(
                ApplicationHandler::getInstance()->getActiveApplication()->getPageURL() . 'acp/'
            );
        }

        return parent::__run();
    }

    /**
     * @inheritDoc
     */
    public function readParameters()
    {
        parent::readParameters();

        // check authentication failures
        if (ENABLE_USER_AUTHENTICATION_FAILURE) {
            $failures = UserAuthenticationFailure::countIPFailures(UserUtil::getIpAddress());
            if (USER_AUTHENTICATION_FAILURE_IP_BLOCK && $failures >= USER_AUTHENTICATION_FAILURE_IP_BLOCK) {
                throw new NamedUserException(WCF::getLanguage()->getDynamicVariable('wcf.user.login.blocked'));
            }
            if (USER_AUTHENTICATION_FAILURE_IP_CAPTCHA && $failures >= USER_AUTHENTICATION_FAILURE_IP_CAPTCHA) {
                $this->useCaptcha = true;
            } elseif (USER_AUTHENTICATION_FAILURE_USER_CAPTCHA) {
                if (isset($_POST['username'])) {
                    $user = User::getUserByUsername(StringUtil::trim($_POST['username']));
                    if (!$user->userID) {
                        $user = User::getUserByEmail(StringUtil::trim($_POST['username']));
                    }

                    if ($user->userID) {
                        $failures = UserAuthenticationFailure::countUserFailures($user->userID);
                        if (USER_AUTHENTICATION_FAILURE_USER_CAPTCHA && $failures >= USER_AUTHENTICATION_FAILURE_USER_CAPTCHA) {
                            $this->useCaptcha = true;
                        }
                    }
                }
            }
        }

        // read applications
        $applicationList = new ApplicationList();
        $applicationList->readObjects();
        $this->applications = $applicationList->getObjects();
    }

    /**
     * @inheritDoc
     */
    public function readFormParameters()
    {
        parent::readFormParameters();

        if (isset($_POST['username'])) {
            $this->username = StringUtil::trim($_POST['username']);
        }
        if (isset($_POST['password'])) {
            $this->password = $_POST['password'];
        }
        if (isset($_POST['domainName'])) {
            $this->domainName = StringUtil::trim($_POST['domainName']);
        }
        if (isset($_POST['applicationValues']) && \is_array($_POST['applicationValues'])) {
            $this->applicationValues = $_POST['applicationValues'];
        }
    }

    /**
     * Validates the user access data.
     */
    protected function validateUser()
    {
        try {
            $this->user = UserAuthenticationFactory::getInstance()->getUserAuthentication()->loginManually(
                $this->username,
                $this->password
            );
        } catch (UserInputException $e) {
            if ($e->getField() == 'username') {
                try {
                    $this->user = EmailUserAuthentication::getInstance()->loginManually(
                        $this->username,
                        $this->password
                    );
                } catch (UserInputException $e2) {
                    if ($e2->getField() == 'username') {
                        throw $e;
                    }
                    throw $e2;
                }
            } else {
                throw $e;
            }
        }

        // simulate login in order to access permissions
        WCF::getSession()->disableUpdate();
        WCF::getSession()->changeUser($this->user, true);

        if (!WCF::getSession()->getPermission('admin.configuration.canManageApplication')) {
            throw new UserInputException('username', 'notAuthorized');
        }
    }

    private function validateDomainName(): void
    {
        if (empty($this->domainName)) {
            throw new UserInputException('domainName');
        }

        $regex = new Regex('^https?\://');
        $this->domainName = FileUtil::removeTrailingSlash($regex->replace($this->domainName, ''));

        // domain may not contain path components
        $regex = new Regex('[/#\?&]');
        if ($regex->match($this->domainName)) {
            throw new UserInputException('domainName', 'containsPath');
        }
    }

    protected function validateApplications()
    {
        $usedPaths = [];
        foreach ($this->applications as $application) {
            $packageID = $application->packageID;

            $domainPath = FileUtil::addLeadingSlash(FileUtil::addTrailingSlash($this->applicationValues[$packageID]));

            $this->applicationValues[$packageID] = $domainPath;

            if (isset($usedPaths[$domainPath])) {
                WCF::getTPL()->assign(
                    'conflictApplication',
                    $this->applications[$usedPaths[$domainPath]]->getPackage()
                );
                throw new UserInputException("application_{$packageID}", 'conflict');
            }

            $usedPaths[$domainPath] = $packageID;
        }
    }

    /**
     * @inheritDoc
     */
    public function submit()
    {
        parent::submit();

        // save authentication failure
        if (ENABLE_USER_AUTHENTICATION_FAILURE) {
            if ($this->errorField == 'username' || $this->errorField == 'password') {
                $action = new UserAuthenticationFailureAction([], 'create', [
                    'data' => [
                        'environment' => 'admin',
                        'userID' => $this->user !== null ? $this->user->userID : null,
                        'username' => \mb_substr($this->username, 0, 100),
                        'time' => TIME_NOW,
                        'ipAddress' => UserUtil::getIpAddress(),
                        'userAgent' => UserUtil::getUserAgent(),
                        'validationError' => 'invalid' . \ucfirst($this->errorField),
                    ],
                ]);
                $action->executeAction();

                if ($this->captchaObjectType) {
                    $this->captchaObjectType->getProcessor()->reset();
                }
            }
        }
    }

    /**
     * @inheritDoc
     */
    public function validate()
    {
        // bypass security token validation
        $_POST['t'] = WCF::getSession()->getSecurityToken();

        parent::validate();

        // error handling
        if (empty($this->username)) {
            throw new UserInputException('username');
        }

        if (empty($this->password)) {
            throw new UserInputException('password');
        }

        $this->validateUser();
        $this->validateDomainName();
        $this->validateApplications();
    }

    /**
     * @inheritDoc
     */
    public function save()
    {
        parent::save();

        // strip port from cookie domain
        $regex = new Regex(':[0-9]+$');
        $cookieDomain = $regex->replace($this->domainName, '');

        foreach ($this->applications as $application) {
            (new ApplicationEditor($application))->update([
                'domainName' => $this->domainName,
                'domainPath' => $this->applicationValues[$application->packageID],
                'cookieDomain' => $cookieDomain,
            ]);
        }

        // rebuild cookie domain and paths
        $applicationAction = new ApplicationAction([], 'rebuild');
        $applicationAction->executeAction();

        // reload currently active application to avoid outdated cache data
        $application = ApplicationHandler::getInstance()->getActiveApplication();
        $application = new Application($application->packageID);

        // redirect to ACP of currently active application
        HeaderUtil::redirect($application->getPageURL() . 'acp/');

        exit;
    }

    /**
     * @inheritDoc
     */
    public function readData()
    {
        parent::readData();

        if (empty($_POST)) {
            $this->domainName = $_SERVER['HTTP_HOST'] ?? '';

            foreach ($this->applications as $application) {
                $this->applicationValues[$application->packageID] = $application->domainPath;
            }
        }
    }

    /**
     * @inheritDoc
     */
    public function assignVariables()
    {
        parent::assignVariables();

        WCF::getTPL()->assign([
            'applications' => $this->applications,
            'applicationValues' => $this->applicationValues,
            'pageURL' => WCFACP::getRescueModePageURL() . 'acp/index.php?rescue-mode/',
            'password' => $this->password,
            'username' => $this->username,
            'domainName' => $this->domainName,
            'protocol' => RouteHandler::getProtocol(),
            'assets' => [
                'woltlabSuite.png' => \sprintf(
                    'data:image/png;base64,%s',
                    \base64_encode(\file_get_contents(WCF_DIR . 'acp/images/woltlabSuite.png'))
                ),
                'WCFSetup.css' => \sprintf(
                    'data:text/css;base64,%s',
                    \base64_encode(\file_get_contents(WCF_DIR . 'acp/style/setup/WCFSetup.css'))
                ),
            ],
        ]);
    }
}
