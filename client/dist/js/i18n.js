<<<<<<< HEAD
!function(e){function t(r){if(n[r])return n[r].exports;var a=n[r]={i:r,l:!1,exports:{}};return e[r].call(a.exports,a,a.exports,t),a.l=!0,a.exports}var n={};t.m=e,t.c=n,t.i=function(e){return e},t.d=function(e,n,r){t.o(e,n)||Object.defineProperty(e,n,{configurable:!1,enumerable:!0,get:r})},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="",t(t.s="./client/src/i18n.js")}({"./client/src/i18n.js":function(e,t,n){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(t,"__esModule",{value:!0});var a=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),i=function(){function e(){r(this,e),this.defaultLocale="en_US",this.currentLocale=this.detectLocale(),this.lang={}}return a(e,[{key:"setLocale",value:function(e){this.currentLocale=e}},{key:"getLocale",value:function(){return null!==this.currentLocale?this.currentLocale:this.defaultLocale}},{key:"_t",value:function(e,t,n,r){var a=t||"";if(!this.lang)return a;for(var i=this.getLocale(),o=[i,i.replace(/_[\w]+/i,""),this.defaultLocale,this.defaultLocale.replace(/_[\w]+/i,"")],u=0;u<o.length;u++){var l=o[u];if(this.lang[l]&&this.lang[l][e])return this.lang[l][e]}return a}},{key:"addDictionary",value:function(e,t){void 0===this.lang[e]&&(this.lang[e]={});for(var n in t)this.lang[e][n]=t[n]}},{key:"getDictionary",value:function(e){return this.lang[e]}},{key:"stripStr",value:function(e){return e.replace(/^\s*/,"").replace(/\s*$/,"")}},{key:"stripStrML",value:function(e){for(var t=e.split("\n"),n=0;n<t.length;n+=1)t[n]=stripStr(t[n]);return stripStr(t.join(" "))}},{key:"sprintf",value:function(e){for(var t=arguments.length,n=Array(t>1?t-1:0),r=1;r<t;r++)n[r-1]=arguments[r];if(0===n.length)return e;var a=new RegExp("(.?)(%s)","g"),i=0;return e.replace(a,function(e,t,r,a,o){return"%"===t?e:t+n[i++]})}},{key:"inject",value:function(e,t){var n=new RegExp("{([A-Za-z0-9_]*)}","g");return e.replace(n,function(e,n,r,a){return t[n]?t[n]:e})}},{key:"detectLocale",value:function(){var t=document.documentElement.getAttribute("lang");if(t||(t=document.body.getAttribute("lang")),!t)for(var n=document.getElementsByTagName("meta"),r=0;r<n.length;r++)n[r].attributes["http-equiv"]&&"content-language"===n[r].attributes["http-equiv"].nodeValue.toLowerCase()&&(t=n[r].attributes.content.nodeValue);if(t||(t=this.defaultLocale),2===t.length)for(var a in e.lang)if(a.substr(0,2).toLowerCase()===t.toLowerCase())return a;var i=t.match(/([^-|_]*)[-|_](.*)/);return i?i[1].toLowerCase()+"_"+i[2].toUpperCase():null}},{key:"addEvent",value:function(e,t,n,r){return e.addEventListener?(e.addEventListener(t,n,r),!0):e.attachEvent?e.attachEvent("on"+t,n):void console.log("Handler could not be attached")}}]),e}(),o=new i;window.ss=void 0!==window.ss?window.ss:{},window.ss.i18n=window.i18n=o,t.default=o}});
=======
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
			var rawLocale;
			var detectedLocale;

			rawLocale = document.body.getAttribute('lang');

			if (!rawLocale) {
				var metas = document.getElementsByTagName('meta');

				for (var i = 0; i < metas.length; i++) {
					if (metas[i].attributes['http-equiv'] && metas[i].attributes['http-equiv'].nodeValue.toLowerCase() == 'content-language') {
						rawLocale = metas[i].attributes['content'].nodeValue;
					}
				}
			}

			if (!rawLocale) {
				rawLocale = this.defaultLocale;
			}

			var rawLocaleParts = rawLocale.match(/([^-|_]*)[-|_](.*)/);

			if (rawLocale.length == 2) {
				for (var compareLocale in i18n.lang) {
					if (compareLocale.substr(0, 2).toLowerCase() == rawLocale.toLowerCase()) {
						detectedLocale = compareLocale;
						break;
					}
				}
			} else if (rawLocaleParts) {
				detectedLocale = rawLocaleParts[1].toLowerCase() + '_' + rawLocaleParts[2].toUpperCase();
			}

			return detectedLocale;
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
>>>>>>> Refactor to use template constants
