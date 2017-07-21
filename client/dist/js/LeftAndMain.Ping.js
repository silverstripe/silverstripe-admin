webpackJsonp([6],{

/***/ 16:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var jQuery = typeof window.jQuery !== 'undefined' ? window.jQuery : null;

module.exports = jQuery;

/***/ }),

/***/ 843:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _jQuery = __webpack_require__(16);

var _jQuery2 = _interopRequireDefault(_jQuery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_jQuery2.default.entwine('ss.ping', function ($) {

  $('.cms-container').entwine({
    PingIntervalSeconds: 5 * 60,

    onadd: function onadd() {
      this._setupPinging();
      this._super();
    },

    _setupPinging: function _setupPinging() {
      var onSessionLost = function onSessionLost(xmlhttp, status) {
        if (xmlhttp.status > 400 || xmlhttp.responseText == 0) {
          if (window.open('Security/login')) {
            alert('Please log in and then try again');
          } else {
            alert('Please enable pop-ups for this site');
          }
        }
      };

      setInterval(function () {
        $.ajax({
          url: 'Security/ping',
          global: false,
          type: 'POST',
          complete: onSessionLost
        });
      }, this.getPingIntervalSeconds() * 1000);
    }
  });
});

/***/ })

},[843]);
//# sourceMappingURL=LeftAndMain.Ping.js.map