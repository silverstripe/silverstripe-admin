webpackJsonp([4],{15:function(e,n,o){"use strict";var t=void 0!==window.jQuery?window.jQuery:null;e.exports=t},938:function(e,n,o){"use strict";var t=o(15),l=function(e){return e&&e.__esModule?e:{default:e}}(t),u=function(e){var n=e.cloneNode(!0),o=(0,l.default)("<div></div>");return o.append(n),o.html()};l.default.leaktools={logDuplicateElements:function(){var e=(0,l.default)("*"),n=!1;e.each(function(o,t){e.not(t).each(function(e,o){u(t)==u(o)&&(n=!0,console.log(t,o))})}),n||console.log("No duplicates found")},logUncleanedElements:function(e){l.default.each(l.default.cache,function(){var n=this.handle&&this.handle.elem;if(n){for(var o=n;o&&1==o.nodeType;)o=o.parentNode;o?o!==document&&console.log("Attached, but to",o,"not our document",n):(console.log("Unattached",n),console.log(this.events),e&&(0,l.default)(n).unbind().remove())}})}}}},[938]);