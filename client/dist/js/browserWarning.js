webpackJsonp([1],{

/***/ "./client/src/lib/browserWarning.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _detectBrowser = __webpack_require__("./node_modules/detect-browser/browser.js");

var _detectBrowser2 = _interopRequireDefault(_detectBrowser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

if (_detectBrowser2.default.name === 'ie' && parseInt(_detectBrowser2.default.version, 10) <= 10) {
  var warning = document.getElementById('browser-warning-wrapper');
  if (warning) {
    warning.className = warning.className + ' browser-warning-wrapper--incompatible';
  }
}

/***/ })

},["./client/src/lib/browserWarning.js"]);
//# sourceMappingURL=browserWarning.js.map