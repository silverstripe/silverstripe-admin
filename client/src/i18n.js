/*
 * Lightweight clientside i18n implementation.
 * Caution: Only available after DOM loaded because we need to detect the language
 *
 * For non-i18n stub implementation, see framework/javascript/src/i18nx.js
 *
 * Based on jQuery i18n plugin: 1.0.0  Feb-10-2008
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 *
 * Based on 'javascript i18n that almost doesn't suck' by markos
 * http://markos.gaivo.net/blog/?p=100
 */

class i18n {
  constructor() {
    this.defaultLocale = 'en_US';
    // Give a null current locale initially to avoid "locale is undefined" errors
    this.currentLocale = null;
    this.autoDetectLocale = true;
    this.lang = {};
  }

  /**
   * Set locale in long format, e.g. "de_AT" for Austrian German.
   *
   * @param {String} locale
   */
  setLocale(locale) {
    this.currentLocale = locale;
    this.autoDetectLocale = false;
  }

  /**
   * Get locale in long format. Falls back to i18n.defaut_locale.
   *
   * @return {String}
   */
  getLocale() {
    return this.currentLocale !== null ? this.currentLocale : this.defaultLocale;
  }

  /**
   * The actual translation function. Looks the given string up in the
   * dictionary and returns the translation if one exists. If a translation
   * is not found, returns the original word.
   *
   * @param {String} entity - A "long" locale format, e.g. "de_DE" (Required)
   * @param {String} fallbackString - (Required)
   * @param {Number} priority - (not used)
   * @param {String} context - Give translators context for the string
   * @return {String} : Translated word
   */
  _t(entity, fallbackString, priority, context) {
    const fallback = fallbackString || '';

    if (!this.lang) {
      return fallback
    }
    const locale = this.getLocale();
    const search = [
      locale,
      locale.replace(/_[\w]+/i, ''),
      this.defaultLocale,
      this.defaultLocale.replace(/_[\w]+/i, '')
    ];

    for (let i = 0; i < search.length; i++) {
      const lang = search[i];
      if (this.lang[lang] && this.lang[lang][entity]) {
        return this.lang[lang][entity];
    }
  }

    return fallback;
  }

  /**
   * Add entities to a dictionary. If a dictionary doesn't
   * exist for this locale, its automatically created.
   * Existing entities are overwritten.
   *
   * @param {String} locale
   * @param {Object} dict
   */
  addDictionary(locale, dict) {
    if (typeof this.lang[locale] === 'undefined') {
      this.lang[locale] = {};
    }

    for (let entity in dict) {
      this.lang[locale][entity] = dict[entity];
    }

    // Re-set current locale in case the new dictionary provides a better match than the old locale.
    if (this.autoDetectLocale) {
      this.currentLocale = this.detectLocale();
    }
  }

  /**
   * Get dictionary for a specific locale.
   *
   * @param {String} locale
   */
  getDictionary(locale) {
    return this.lang[locale];
  }

  /**
   * @param {String} str - The string to strip.
   * @return {String} result - Stripped string.
   *
   */
  stripStr(str) {
    return str.replace(/^\s*/, '').replace(/\s*$/, '');
  }

  /**
   * @param {String} str - The multi-line string to strip.
   * @return {String} result - Stripped string.
   *
   */
  stripStrML(str) {
    // Split because m flag doesn't exist before JS1.5 and we need to
    // strip newlines anyway
    const parts = str.split('\n');

    for (let i = 0; i < parts.length; i += 1) {
      parts[i] = stripStr(parts[i]);
    }

    // Don't join with empty strings, because it "concats" words
    // And strip again
    return stripStr(parts.join(' '));
  }

  /**
   * Substitutes %s with parameters
    * given in list. %%s is used to escape %s.
    *
   * @param {String} s - The string to perform the substitutions on.
   * @return {String} - The new string with substitutions made.
   */
  sprintf(s, ...params) {
    if (params.length === 0) {
      return s;
    }

    const regx = new RegExp('(.?)(%s)', 'g');

    let i = 0;

    return s.replace(regx, function (match, subMatch1, subMatch2, offset, string) {
      // skip %%s
      if (subMatch1 === '%') {
        return match;
      }

      return subMatch1 + params[i++];
    });
  }

  /**
   * Substitutes variables with a list of injections.
   *
   * @param {String} s - The string to perform the substitutions on.
   * @param {Object} map - An object with the substitions map e.g. {var: value}.
   * @return {String} - The new string with substitutions made.
   */
  inject(s, map) {
    const regx = new RegExp('\{([A-Za-z0-9_]*)\}', 'g');

    return s.replace(regx, function (match, key, offset, string) {
      return (map[key]) ? map[key] : match;
    });
  }

  /**
   * Detect document language settings by looking at <meta> tags.
   * If no match is found, returns this.defaultLocale.
   *
   * @return {String} - Locale in mixed lowercase/uppercase format suitable
   * for usage in i18n.lang arrays (e.g. 'en_US') or in 2-character lowercase
   * format (e.g. 'en') if no mixed format is available.
   */
  detectLocale() {
    // Get by <html> tag
    let rawLocale = document.documentElement.getAttribute('lang');

    // Get by <body> tag
    if (!rawLocale) {
    rawLocale = document.body.getAttribute('lang');
    }

    // Get by meta
    if (!rawLocale) {
      const metas = document.getElementsByTagName('meta');
      for (let i = 0; i < metas.length; i++) {
        if (metas[i].attributes['http-equiv']
          && metas[i].attributes['http-equiv'].nodeValue.toLowerCase() === 'content-language'
        ) {
          rawLocale = metas[i].attributes['content'].nodeValue;
        }
      }
    }

    // Fallback to default locale
    if (!rawLocale) {
      rawLocale = this.defaultLocale;
    }

    // Get locale (e.g. 'en_US') from common name (e.g. 'en')
    // by looking at i18n.lang tables
    if (rawLocale.length === 2) {
      for (let compareLocale in this.lang) {
        if (compareLocale.substr(0, 2).toLowerCase() === rawLocale.toLowerCase()) {
          return compareLocale;
        }
      }
    }

    // Parse raw locale
    const rawLocaleParts = rawLocale.match(/([^-|_]*)[-|_](.*)/);
    if (rawLocaleParts) {
      return rawLocaleParts[1].toLowerCase() + '_' + rawLocaleParts[2].toUpperCase();
    }

    return null;
  }

  /**
   * Attach an event listener to the given object.
   * Modeled after behaviour.js, but externalized
   * to keep the i18n library standalone for now.
   */
  addEvent(obj, evType, fn, useCapture) {
    if (obj.addEventListener) {
      obj.addEventListener(evType, fn, useCapture);
      return true;
    } else if (obj.attachEvent) {
      return obj.attachEvent('on' + evType, fn);
    } else {
      console.log('Handler could not be attached');
    }
  }
}

let _i18n = new i18n();

// This module has to support legacy loading...
window.ss = typeof window.ss !== 'undefined' ? window.ss : {};
window.ss.i18n = window.i18n = _i18n;

export default _i18n;
