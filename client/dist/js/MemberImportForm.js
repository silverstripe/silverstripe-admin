webpackJsonp([2],{

/***/ "./client/src/legacy/MemberImportForm.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _jquery = __webpack_require__(2);

var _jquery2 = _interopRequireDefault(_jquery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_jquery2.default.entwine('ss', function ($) {
  $('.import-form .advanced').entwine({
    onmatch: function onmatch() {
      this._super();

      this.hide();
    },
    onunmatch: function onunmatch() {
      this._super();
    }
  });

  $('.import-form a.toggle-advanced').entwine({
    onclick: function onclick(e) {
      this.parents('form:eq(0)').find('.advanced').toggle();
      return false;
    }
  });
});

/***/ })

},["./client/src/legacy/MemberImportForm.js"]);
//# sourceMappingURL=MemberImportForm.js.map