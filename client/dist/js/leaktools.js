webpackJsonp([5],{

/***/ "./client/src/legacy/leaktools.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _jquery = __webpack_require__(1);

var _jquery2 = _interopRequireDefault(_jquery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getHTML = function getHTML(el) {
  var clone = el.cloneNode(true);

  var div = (0, _jquery2.default)('<div></div>');
  div.append(clone);

  return div.html();
};

_jquery2.default.leaktools = {

  logDuplicateElements: function logDuplicateElements() {
    var els = (0, _jquery2.default)('*');
    var dirty = false;

    els.each(function (i, a) {
      els.not(a).each(function (j, b) {
        if (getHTML(a) == getHTML(b)) {
          dirty = true;
          console.log(a, b);
        }
      });
    });

    if (!dirty) console.log('No duplicates found');
  },

  logUncleanedElements: function logUncleanedElements(clean) {
    _jquery2.default.each(_jquery2.default.cache, function () {
      var source = this.handle && this.handle.elem;
      if (!source) return;

      var parent = source;
      while (parent && parent.nodeType == 1) {
        parent = parent.parentNode;
      }if (!parent) {
        console.log('Unattached', source);
        console.log(this.events);
        if (clean) (0, _jquery2.default)(source).unbind().remove();
      } else if (parent !== document) console.log('Attached, but to', parent, 'not our document', source);
    });
  }
};

/***/ })

},["./client/src/legacy/leaktools.js"]);
//# sourceMappingURL=leaktools.js.map