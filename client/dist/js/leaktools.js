<<<<<<< HEAD
webpackJsonp([6],[function(e,n,o){"use strict"
function t(e){return e&&e.__esModule?e:{default:e}}var l=o(1),a=t(l),c=function e(n){var o=n.cloneNode(!0),t=(0,a.default)("<div></div>")
return t.append(o),t.html()}
a.default.leaktools={logDuplicateElements:function e(){var n=(0,a.default)("*"),o=!1
n.each(function(e,t){n.not(t).each(function(e,n){c(t)==c(n)&&(o=!0,console.log(t,n))})}),o||console.log("No duplicates found")},logUncleanedElements:function e(n){a.default.each(a.default.cache,function(){
var e=this.handle&&this.handle.elem
if(e){for(var o=e;o&&1==o.nodeType;)o=o.parentNode
o?o!==document&&console.log("Attached, but to",o,"not our document",e):(console.log("Unattached",e),console.log(this.events),n&&(0,a.default)(e).unbind().remove())}})}}}])
=======
webpackJsonp([4],[
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var _jQuery = __webpack_require__(1);
	
	var _jQuery2 = _interopRequireDefault(_jQuery);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var getHTML = function getHTML(el) {
	  var clone = el.cloneNode(true);
	
	  var div = (0, _jQuery2.default)('<div></div>');
	  div.append(clone);
	
	  return div.html();
	};
	
	_jQuery2.default.leaktools = {
	
	  logDuplicateElements: function logDuplicateElements() {
	    var els = (0, _jQuery2.default)('*');
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
	    _jQuery2.default.each(_jQuery2.default.cache, function () {
	      var source = this.handle && this.handle.elem;
	      if (!source) return;
	
	      var parent = source;
	      while (parent && parent.nodeType == 1) {
	        parent = parent.parentNode;
	      }if (!parent) {
	        console.log('Unattached', source);
	        console.log(this.events);
	        if (clean) (0, _jQuery2.default)(source).unbind().remove();
	      } else if (parent !== document) console.log('Attached, but to', parent, 'not our document', source);
	    });
	  }
	};

/***/ })
]);
//# sourceMappingURL=leaktools.js.map
>>>>>>> provide injector
