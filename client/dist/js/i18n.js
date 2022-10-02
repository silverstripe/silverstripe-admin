/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
/*!****************************!*\
  !*** ./client/src/i18n.js ***!
  \****************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

var i18n = function () {
  function i18n() {
    _classCallCheck(this, i18n);

    this.defaultLocale = 'en_US';
    this.currentLocale = this.detectLocale();
    this.lang = {};
  }

  _createClass(i18n, [{
    key: "setLocale",
    value: function setLocale(locale) {
      this.currentLocale = locale;
    }
  }, {
    key: "getLocale",
    value: function getLocale() {
      return this.currentLocale !== null ? this.currentLocale : this.defaultLocale;
    }
  }, {
    key: "_t",
    value: function _t(entity, fallbackString, priority, context) {
      var fallback = fallbackString || '';

      if (!this.lang) {
        return fallback;
      }

      var locale = this.getLocale();
      var search = [locale, locale.replace(/_[\w]+/i, ''), this.defaultLocale, this.defaultLocale.replace(/_[\w]+/i, '')];

      for (var i = 0; i < search.length; i++) {
        var lang = search[i];

        if (this.lang[lang] && this.lang[lang][entity]) {
          return this.lang[lang][entity];
        }
      }

      return fallback;
    }
  }, {
    key: "addDictionary",
    value: function addDictionary(locale, dict) {
      if (typeof this.lang[locale] === 'undefined') {
        this.lang[locale] = {};
      }

      for (var entity in dict) {
        this.lang[locale][entity] = dict[entity];
      }
    }
  }, {
    key: "getDictionary",
    value: function getDictionary(locale) {
      return this.lang[locale];
    }
  }, {
    key: "stripStr",
    value: function stripStr(str) {
      return str.replace(/^\s*/, '').replace(/\s*$/, '');
    }
  }, {
    key: "stripStrML",
    value: function stripStrML(str) {
      var parts = str.split('\n');

      for (var i = 0; i < parts.length; i += 1) {
        parts[i] = stripStr(parts[i]);
      }

      return stripStr(parts.join(' '));
    }
  }, {
    key: "sprintf",
    value: function sprintf(s) {
      for (var _len = arguments.length, params = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        params[_key - 1] = arguments[_key];
      }

      if (params.length === 0) {
        return s;
      }

      var regx = new RegExp('(.?)(%s)', 'g');
      var i = 0;
      return s.replace(regx, function (match, subMatch1, subMatch2, offset, string) {
        if (subMatch1 === '%') {
          return match;
        }

        return subMatch1 + params[i++];
      });
    }
  }, {
    key: "inject",
    value: function inject(s, map) {
      var regx = new RegExp('\{([A-Za-z0-9_]*)\}', 'g');
      return s.replace(regx, function (match, key, offset, string) {
        return map[key] ? map[key] : match;
      });
    }
  }, {
    key: "detectLocale",
    value: function detectLocale() {
      var rawLocale = document.documentElement.getAttribute('lang');

      if (!rawLocale) {
        rawLocale = document.body.getAttribute('lang');
      }

      if (!rawLocale) {
        var metas = document.getElementsByTagName('meta');

        for (var i = 0; i < metas.length; i++) {
          if (metas[i].attributes['http-equiv'] && metas[i].attributes['http-equiv'].nodeValue.toLowerCase() === 'content-language') {
            rawLocale = metas[i].attributes['content'].nodeValue;
          }
        }
      }

      if (!rawLocale) {
        rawLocale = this.defaultLocale;
      }

      var detectedLocale = null;

      if (rawLocale.length === 2) {
        for (var compareLocale in i18n.lang) {
          if (compareLocale.substr(0, 2).toLowerCase() === rawLocale.toLowerCase()) {
            return compareLocale;
          }
        }
      }

      var rawLocaleParts = rawLocale.match(/([^-|_]*)[-|_](.*)/);

      if (rawLocaleParts) {
        return rawLocaleParts[1].toLowerCase() + '_' + rawLocaleParts[2].toUpperCase();
      }

      return null;
    }
  }, {
    key: "addEvent",
    value: function addEvent(obj, evType, fn, useCapture) {
      if (obj.addEventListener) {
        obj.addEventListener(evType, fn, useCapture);
        return true;
      } else if (obj.attachEvent) {
        return obj.attachEvent('on' + evType, fn);
      } else {
        console.log('Handler could not be attached');
      }
    }
  }]);

  return i18n;
}();

var _i18n = new i18n();

window.ss = typeof window.ss !== 'undefined' ? window.ss : {};
window.ss.i18n = window.i18n = _i18n;
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_i18n);
/******/ })()
;
//# sourceMappingURL=i18n.js.map