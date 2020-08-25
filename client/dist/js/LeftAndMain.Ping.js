webpackJsonp([3],{

/***/ "./client/src/legacy/LeftAndMain.Ping.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _jquery = __webpack_require__(2);

var _jquery2 = _interopRequireDefault(_jquery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_jquery2.default.entwine('ss.ping', function ($) {

  $('.cms-container').entwine({
    PingIntervalSeconds: 5 * 60,

    onadd: function onadd() {
      this._setupPinging();
      this._super();
    },

    _setupPinging: function _setupPinging() {
      var interval = null;
      var loginPopup = null;

      var onSessionLost = function onSessionLost(xmlhttp, status) {
        if (xmlhttp.status < 400 && xmlhttp.responseText != 0) {
          return;
        }

        if (!loginPopup || loginPopup.closed) {
          loginPopup = window.open('Security/login');

          if (!loginPopup) {
            alert('Please enable pop-ups for this site');

            clearInterval(interval);
          }
        }

        if (loginPopup) {
          loginPopup.focus();
        }
      };

      interval = setInterval(function () {
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

},["./client/src/legacy/LeftAndMain.Ping.js"]);
//# sourceMappingURL=LeftAndMain.Ping.js.map