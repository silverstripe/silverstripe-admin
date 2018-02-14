<<<<<<< HEAD
webpackJsonp([5],{962:function(e,n,o){"use strict";var t=o(12),l=function(e){return e&&e.__esModule?e:{default:e}}(t),a=function(e){var n=e.cloneNode(!0),o=(0,l.default)("<div></div>");return o.append(n),o.html()};l.default.leaktools={logDuplicateElements:function(){var e=(0,l.default)("*"),n=!1;e.each(function(o,t){e.not(t).each(function(e,o){a(t)==a(o)&&(n=!0,console.log(t,o))})}),n||console.log("No duplicates found")},logUncleanedElements:function(e){l.default.each(l.default.cache,function(){var n=this.handle&&this.handle.elem;if(n){for(var o=n;o&&1==o.nodeType;)o=o.parentNode;o?o!==document&&console.log("Attached, but to",o,"not our document",n):(console.log("Unattached",n),console.log(this.events),e&&(0,l.default)(n).unbind().remove())}})}}}},[962]);
=======
webpackJsonp([5],{

/***/ 967:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _jquery = __webpack_require__(11);

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

},[967]);
//# sourceMappingURL=leaktools.js.map
>>>>>>> build
