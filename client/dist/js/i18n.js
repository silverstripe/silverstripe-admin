/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./client/src/i18n.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./client/src/i18n.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var i18n = function () {
  function i18n() {
    _classCallCheck(this, i18n);

    this.defaultLocale = 'en_US';
    this.currentLocale = this.detectLocale();
    this.lang = {};
  }

  _createClass(i18n, [{
    key: 'setLocale',
    value: function setLocale(locale) {
      this.currentLocale = locale;
    }
  }, {
    key: 'getLocale',
    value: function getLocale() {
      return this.currentLocale !== null ? this.currentLocale : this.defaultLocale;
    }
  }, {
    key: '_t',
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
    key: 'addDictionary',
    value: function addDictionary(locale, dict) {
      if (typeof this.lang[locale] === 'undefined') {
        this.lang[locale] = {};
      }

      for (var entity in dict) {
        this.lang[locale][entity] = dict[entity];
      }
    }
  }, {
    key: 'getDictionary',
    value: function getDictionary(locale) {
      return this.lang[locale];
    }
  }, {
    key: 'stripStr',
    value: function stripStr(str) {
      return str.replace(/^\s*/, '').replace(/\s*$/, '');
    }
  }, {
    key: 'stripStrML',
    value: function stripStrML(str) {
      var parts = str.split('\n');

      for (var i = 0; i < parts.length; i += 1) {
        parts[i] = stripStr(parts[i]);
      }

      return stripStr(parts.join(' '));
    }
  }, {
    key: 'sprintf',
    value: function sprintf(s) {
      for (var _len = arguments.length, params = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
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
    key: 'inject',
    value: function inject(s, map) {
      var regx = new RegExp('\{([A-Za-z0-9_]*)\}', 'g');

      return s.replace(regx, function (match, key, offset, string) {
        return map[key] ? map[key] : match;
      });
    }
  }, {
    key: 'detectLocale',
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
    key: 'addEvent',
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

exports.default = _i18n;

/***/ })

/******/ });
//# sourceMappingURL=i18n.js.map