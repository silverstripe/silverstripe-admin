import i18n from 'i18n';

/**
 * The following is Copyright (c) 2012, Ernesto Méndez (der@der-design.com)
 * Licensed under the MIT License
 * https://github.com/mendezcode/shortcode-parser/blob/master/lib/shortcode-parser.js
 * Differences in SS shortcodes:
 *  - SS shortcodes do not use `/]` to close shortcodes
 *  - Properties may be `,` separated instead of space separated, in order to
 *  prevent urlencoding issues
 *  - Shortcodes cannot have spaces between opening brace and name. i.e. `[name`
 */
// Used to match outer regexp and get attrs as a string
// All attrs extracted into matches[1]
// eslint-disable-next-line max-len
const stringifyRegex = (regexp) => (regexp.toString().slice(1, -1));
const SHORTCODE_ATTRS = stringifyRegex(
  /((?:[,\s]+(?:[a-z0-9\-_]+)=(?:(?:[a-z0-9\-_]+)|(?:\d+\.\d+)|(?:'[^']*')|(?:"[^"]*")))*)/
);
// Used to extract individual items from above regexp
// Each item matches[1] is key, and matches[2] || matches[3] || matches[4] || matches[5] is value
// eslint-disable-next-line max-len
const SHORTCODE_ATTR = /[,\s]+([a-z0-9\-_]+)=(?:([a-z0-9\-_]+)|(\d+\.\d+)|(?:'([^']*)')|(?:"([^"]*)"))/;
const SHORTCODE_OPEN = stringifyRegex(/\[%s/);
const SHORTCODE_RIGHT_BRACKET = '\\]';
const SHORTCODE_CLOSE = stringifyRegex(/\[\s*\/\s*%s\s*]/);
const SHORTCODE_CONTENT = stringifyRegex(/((?:.|\n|)*?)/);
const SHORTCODE_SPACE = stringifyRegex(/\s*/);
/**
 * End
 */

const ShortcodeSerialiser = {

  /**
   * Matches the next occurance of a shortcode in a string.
   *
   * Returns object with keys:
   *  - name (tag name)
   *  - original (original matched string)
   *  - properties (key-value pair of properties)
   *  - content (between open / close tags)
   *  - wrapped (bool flag)
   *
   * @param {String} name - shortcode tag
   * @param {Boolean} wrapped - Expect a closing tag? ([tag][/tag]) or simple tag ([tag])
   * @param {String} content - string to parse
   * @return {Object} Object, or null if not found
   */
  match(name, wrapped, content) {
    // Build matching regexp
    const open = i18n.sprintf(SHORTCODE_OPEN, name);
    let pattern = `${open}${SHORTCODE_ATTRS}${SHORTCODE_SPACE}${SHORTCODE_RIGHT_BRACKET}`;
    if (wrapped) {
      pattern = `${pattern}${SHORTCODE_CONTENT}${i18n.sprintf(SHORTCODE_CLOSE, name)}`;
    }

    // Get next match
    const regex = new RegExp(pattern, 'i');
    const match = regex.exec(content);
    if (!match) {
      return null;
    }

    // parse attributes
    const properties = this.parseProperties(match[1]);
    return {
      name,
      wrapped,
      properties,
      original: match[0],
      content: wrapped ? match[2] : null,
    };
  },

  /**
   * Parse shortcode props from string
   *
   * @param {String} input
   * @return {Object}
   */
  parseProperties(input) {
    let unmatched = input;
    const result = {};
    let match = unmatched.match(SHORTCODE_ATTR);
    while (match) {
      // Save key / value
      const key = match[1] || '';
      const value = match[2] || match[3] || match[4] || match[5] || '';
      if (key) {
        result[key] = value;
      }

      // Trim off matched content from unmatched and continue parsing
      const idx = unmatched.indexOf(match[0]);
      unmatched = unmatched.substr(idx + match[0].length);
      match = unmatched.match(SHORTCODE_ATTR);
    }
    return result;
  },

  /**
   * Turn shortcode object into string.
   * Note that if a shortcode is placed into a html attribute, use attributesafe to true to
   * use attribute protected characters. For example:
   *  - [sitetree_link id="3"] (attributesafe = false)
   *  - [sitetree_link,id='3'] (attributesafe = true)
   *
   * Note that special characters (e.g. quotes) will be stripped if they would otherwise
   * break the shortcode.
   *
   * @param {Object} object - Object in same format as match() (original ignored)
   * @param {Boolean} attributesafe - Set to true to encode in attribute safety mode
   * @return {String}
   */
  serialise(object, attributesafe = false) {
    // attributesafe can only encode alphanumeric characters
    const rule = attributesafe
      ? { sep: ',', quote: '', replacer: /[^a-z0-9\-_.]/gi }
      : { sep: ' ', quote: '"', replacer: /"/g };
    const attrs = Object.entries(object.properties)
      .map(([name, value]) => ((value)
        ? `${rule.sep}${name}=${rule.quote}${`${value}`.replace(rule.replacer, '')}${rule.quote}`
        : null
      ))
      .filter((attr) => attr !== null)
      .join('');

    if (object.wrapped) {
      return `[${object.name}${attrs}]${object.content}[/${object.name}]`;
    }
    return `[${object.name}${attrs}]`;
  },
};

const createHTMLSanitiser = () => {
  const div = document.createElement('div');
  return (str) => {
    if (str === undefined) {
      return '';
    }

    div.textContent = str;

    return div.innerHTML;
  };
};

const sanitiseShortCodeProperties = (rawProperties) => {
  const sanitise = createHTMLSanitiser();
  return Object.entries(rawProperties).reduce((props, [name, value]) => ({
    ...props,
    [name]: sanitise(value)
  }), {});
};

export {
  sanitiseShortCodeProperties,
  createHTMLSanitiser,
};

export default ShortcodeSerialiser;
