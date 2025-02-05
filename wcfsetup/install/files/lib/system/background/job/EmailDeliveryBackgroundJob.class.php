<?php

namespace wcf\system\background\job;

use wcf\data\email\log\entry\EmailLogEntry;
use wcf\data\email\log\entry\EmailLogEntryAction;
use wcf\system\email\Email;
use wcf\system\email\IUserMailbox;
use wcf\system\email\Mailbox;
use wcf\system\email\transport\exception\PermanentFailure;
use wcf\system\email\transport\IStatusReportingEmailTransport;
use wcf\util\StringUtil;

/**
 * Delivers the given email to the given mailbox.
 *
 * @author  Tim Duesterhus
 * @copyright   2001-2019 WoltLab GmbH
 * @license GNU Lesser General Public License <http://opensource.org/licenses/lgpl-license.php>
 * @package WoltLabSuite\Core\System\Background\Job
 * @since   3.0
 */
class EmailDeliveryBackgroundJob extends AbstractBackgroundJob
{
    /**
     * @inheritDoc
     */
    const MAX_FAILURES = 25;

    /**
     * email to send
     * @var Email
     */
    protected $email;

    /**
     * sender mailbox
     * @var Mailbox
     */
    protected $envelopeFrom;

    /**
     * recipient mailbox
     * @var Mailbox
     */
    protected $envelopeTo;

    /**
     * @var int
     */
    protected $emailLogEntryId;

    /**
     * @var string
     */
    private $lastErrorMessage = '';

    /**
     * instance of the default transport
     * @var \wcf\system\email\transport\IEmailTransport
     */
    protected static $transport;

    /**
     * Creates the job using the given the email and the destination mailbox.
     *
     * @param Email $email
     * @param Mailbox $envelopeFrom
     * @param Mailbox $envelopeTo
     * @see     \wcf\system\email\transport\IEmailTransport
     */
    public function __construct(Email $email, Mailbox $envelopeFrom, Mailbox $envelopeTo)
    {
        $this->email = $email;
        $this->envelopeFrom = $envelopeFrom;
        $this->envelopeTo = $envelopeTo;

        $this->emailLogEntryId = $this->createLog()->entryID;
    }

    /**
     * Creates the email log entry.
     */
    private function createLog(): EmailLogEntry
    {
        return (new EmailLogEntryAction([], 'create', [
            'data' => [
                'time' => \TIME_NOW,
                'messageID' => $this->email->getMessageID(),
                'subject' => StringUtil::truncate(
                    $this->email->getSubject(),
                    20,
                    StringUtil::HELLIP,
                    true
                ),
                'recipient' => $this->envelopeTo->getAddress(),
                'recipientID' => ($this->envelopeTo instanceof IUserMailbox) ? $this->envelopeTo->getUser()->userID : null,
                'status' => EmailLogEntry::STATUS_NEW,
            ],
        ]))->executeAction()['returnValues'];
    }

    /**
     * Updates the status of the log entry.
     */
    public function updateStatus(string $status, string $message = ''): void
    {
        (new EmailLogEntryAction([$this->emailLogEntryId], 'update', [
            'data' => [
                'status' => $status,
                'message' => $message,
            ],
        ]))->executeAction();
    }

    /**
     * @inheritDoc
     */
    public function onFailure()
    {
        $this->updateStatus(EmailLogEntry::STATUS_TRANSIENT_FAILURE, $this->lastErrorMessage);
    }

    /**
     * @inheritDoc
     */
    public function onFinalFailure()
    {
        $this->updateStatus(EmailLogEntry::STATUS_PERMANENT_FAILURE, $this->lastErrorMessage);
    }

    /**
     * Emails will be sent with an increasing timeout between the tries.
     *
     * @return  int between 15 minutes and 24 hours
     */
    public function retryAfter()
    {
        $lookup = [
            1 => 15,
            2 => 45,     // running total:
            3 => 1 * 60, // 2 hours
            4 => 2 * 60, // 4 hours
            5 => 4 * 60, // 8 hours
            6 => 4 * 60, // 12 hours
            7 => 6 * 60, // 18 hours
            8 => 6 * 60, // 24 hours
            9 => 6 * 60, // 30 hours
            10 => 6 * 60, // 36 hours
            11 => 6 * 60, // 42 hours
            12 => 6 * 60, // 48 hours
            13 => 12 * 60, // 60 hours
            14 => 12 * 60, // 72 hours
            15 => 24 * 60, // 4 days
            16 => 24 * 60, // 5 days
            17 => 24 * 60, // 6 days
            18 => 24 * 60, // 7 days
            19 => 24 * 60, // 8 days
            20 => 24 * 60, // 9 days
            21 => 24 * 60, // 10 days
            22 => 24 * 60, // 11 days
            23 => 24 * 60, // 12 days
            24 => 24 * 60, // 13 days
            25 => 24 * 60, // 14 days
        ];

        $result = 24 * 60;
        if (isset($lookup[$this->getFailures()])) {
            $result = $lookup[$this->getFailures()];
        }

        return $result * 60;
    }

    /**
     * @inheritDoc
     */
    public function perform()
    {
        if (self::$transport === null) {
            $name = '\wcf\system\email\transport\\' . \ucfirst(MAIL_SEND_METHOD) . 'EmailTransport';
            self::$transport = new $name();
        }

        try {
            try {
                $return = self::$transport->deliver($this->email, $this->envelopeFrom, $this->envelopeTo);
                if (self::$transport instanceof IStatusReportingEmailTransport) {
                    $successMessage = $return;
                } else {
                    $successMessage = '';
                }
            } catch (\Throwable $e) {
                // This is a hack, because we can't add additional optional parameters to on(Final)?Failure
                // in AbstractBackgroundJob for compatibility reasons.

                $this->lastErrorMessage = $e->getMessage();
                throw $e;
            }
        } catch (PermanentFailure $e) {
            // no need for retrying. Eat Exception and log the error.
            \wcf\functions\exception\logThrowable($e);
            $this->onFinalFailure();

            return;
        }

        // At this point the email delivery succeeded.

        try {
            $this->updateStatus(EmailLogEntry::STATUS_SUCCESS, $successMessage);
        } catch (\Throwable $e) {
            // Ignore all errors, otherwise we might deliver the email multiple times.
            \wcf\functions\exception\logThrowable($e);
        }
    }
}
