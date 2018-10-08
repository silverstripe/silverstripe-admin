<<<<<<< HEAD
<<<<<<< HEAD
webpackJsonp([5],{"./client/src/legacy/leaktools.js":function(e,o,n){"use strict";var t=n(2),l=function(e){return e&&e.__esModule?e:{default:e}}(t),c=function(e){var o=e.cloneNode(!0),n=(0,l.default)("<div></div>");return n.append(o),n.html()};l.default.leaktools={logDuplicateElements:function(){var e=(0,l.default)("*"),o=!1;e.each(function(n,t){e.not(t).each(function(e,n){c(t)==c(n)&&(o=!0,console.log(t,n))})}),o||console.log("No duplicates found")},logUncleanedElements:function(e){l.default.each(l.default.cache,function(){var o=this.handle&&this.handle.elem;if(o){for(var n=o;n&&1==n.nodeType;)n=n.parentNode;n?n!==document&&console.log("Attached, but to",n,"not our document",o):(console.log("Unattached",o),console.log(this.events),e&&(0,l.default)(o).unbind().remove())}})}}}},["./client/src/legacy/leaktools.js"]);
=======
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
>>>>>>> New api for adding fields, args
=======
webpackJsonp([5],{"./client/src/legacy/leaktools.js":function(e,o,n){"use strict";var t=n(1),l=function(e){return e&&e.__esModule?e:{default:e}}(t),c=function(e){var o=e.cloneNode(!0),n=(0,l.default)("<div></div>");return n.append(o),n.html()};l.default.leaktools={logDuplicateElements:function(){var e=(0,l.default)("*"),o=!1;e.each(function(n,t){e.not(t).each(function(e,n){c(t)==c(n)&&(o=!0,console.log(t,n))})}),o||console.log("No duplicates found")},logUncleanedElements:function(e){l.default.each(l.default.cache,function(){var o=this.handle&&this.handle.elem;if(o){for(var n=o;n&&1==n.nodeType;)n=n.parentNode;n?n!==document&&console.log("Attached, but to",n,"not our document",o):(console.log("Unattached",o),console.log(this.events),e&&(0,l.default)(o).unbind().remove())}})}}}},["./client/src/legacy/leaktools.js"]);
>>>>>>> Build
