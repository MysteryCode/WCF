<?php

namespace wcf\system\bbcode;

use wcf\system\SingletonFactory;
use wcf\util\ArrayUtil;
use wcf\util\StringUtil;
use wcf\util\Url;

/**
 * Highlights keywords in text messages.
 *
 * @author  Marcel Werk
 * @copyright   2001-2019 WoltLab GmbH
 * @license GNU Lesser General Public License <http://opensource.org/licenses/lgpl-license.php>
 * @package WoltLabSuite\Core\System\Bbcode
 */
class KeywordHighlighter extends SingletonFactory
{
    /**
     * search keywords
     * @var string[]
     */
    protected $keywords = [];

    /**
     * search query parameters
     * @var string[]
     */
    protected static $searchQueryKeys = [
        'q',        // google, msn, altavista
        'p',        // yahoo
        'query',    // lycos, fireball
        'eingabe',  // metager
        'begriff',  // acoon.de
        'keyword',  // fixx.de
        'search',   // excite.co.jp
        // 'highlight', // burning board and other bulletin board systems ;)

        // ???:
        'ask',
        'searchfor',
        'key',
        'keywords',
        'qry',
        'searchitem',
        'kwd',
        'recherche',
        'search_text',
        'search_term',
        'term',
        'terms',
        'qq',
        'qry_str',
        'qu',
        //'s',
        //'k',
        //'t',
        'va',
    ];

    /**
     * @inheritDoc
     */
    protected function init()
    {
        // take keywords from request
        if (isset($_GET['highlight'])) {
            $this->parseKeywords($_GET['highlight']);
        } // take keywords from referer
        elseif (!empty($_SERVER['HTTP_REFERER'])) {
            $url = Url::parse($_SERVER['HTTP_REFERER']);
            if (!empty($url['query'])) {
                $query = \explode('&', $url['query']);
                foreach ($query as $element) {
                    if (\strpos($element, '=') === false) {
                        continue;
                    }
                    [$varname, $value] = \explode('=', $element, 2);

                    if (\in_array($varname, static::$searchQueryKeys)) {
                        $this->parseKeywords(\urldecode($value));
                        break;
                    }
                }
            }
        }

        if (!empty($this->keywords)) {
            $this->keywords = \array_unique($this->keywords);
            $this->keywords = \array_map('preg_quote', $this->keywords);
        }
    }

    /**
     * Parses search keywords.
     *
     * @param string $keywordString
     */
    protected function parseKeywords($keywordString)
    {
        // convert encoding if necessary
        if (!StringUtil::isUTF8($keywordString)) {
            $keywordString = \mb_convert_encoding($keywordString, 'UTF-8', 'ISO-8859-1');
        }

        // remove bad wildcards
        $keywordString = \preg_replace('/(?<!\w)\*/', '', $keywordString);

        // remove search operators
        $keywordString = \preg_replace('/[\+\-><()~]+/', ' ', $keywordString);

        if (\mb_substr($keywordString, 0, 1) == '"' && \mb_substr($keywordString, -1) == '"') {
            // phrases search
            $keywordString = StringUtil::trim(\mb_substr($keywordString, 1, -1));

            if (!empty($keywordString)) {
                $this->keywords = \array_merge($this->keywords, [StringUtil::encodeHTML($keywordString)]);
            }
        } else {
            // replace word delimiters by space
            $keywordString = \str_replace(['.', ','], ' ', $keywordString);

            $keywords = ArrayUtil::encodeHTML(ArrayUtil::trim(\explode(' ', $keywordString)));
            if (!empty($keywords)) {
                $this->keywords = \array_merge($this->keywords, $keywords);
            }
        }

        // Exclude words that are less than 3 characters, because those
        // are often times stoppwords that are not matched by the search
        // engine, but can appear a lot of times in regular text.
        $this->keywords = \array_filter($this->keywords, static function (string $keyword): bool {
            return \mb_strlen($keyword) > 2;
        });
    }

    /**
     * Highlights search keywords.
     *
     * @param string $text
     * @return  string      highlighted text
     */
    public function doHighlight($text)
    {
        if (empty($this->keywords)) {
            return $text;
        }

        $keywordPattern = '(' . \implode('|', $this->keywords) . ')';
        $keywordPattern = \str_replace('\*', '\w*', $keywordPattern);

        return \preg_replace(
            '+(?<!&|&\w{1}|&\w{2}|&\w{3}|&\w{4}|&\w{5}|&\w{6})' . $keywordPattern . '(?![^<]*>)+i',
            '<span class="highlight">\\1</span>',
            $text
        );
    }

    /**
     * Returns search keywords
     *
     * @return  string[]
     */
    public function getKeywords()
    {
        return $this->keywords;
    }
}
