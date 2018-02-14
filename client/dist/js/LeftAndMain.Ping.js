<<<<<<< HEAD
webpackJsonp([7],{956:function(n,e,t){"use strict";var i=t(12);(function(n){return n&&n.__esModule?n:{default:n}})(i).default.entwine("ss.ping",function(n){n(".cms-container").entwine({PingIntervalSeconds:300,onadd:function(){this._setupPinging(),this._super()},_setupPinging:function(){var e=null,t=null,i=function(n,i){n.status<400&&0!=n.responseText||(t&&!t.closed||(t=window.open("Security/login"))||(alert("Please enable pop-ups for this site"),clearInterval(e)),t&&t.focus())};e=setInterval(function(){n.ajax({url:"Security/ping",global:!1,type:"POST",complete:i})},1e3*this.getPingIntervalSeconds())}})})}},[956]);
=======
webpackJsonp([7],{

/***/ 961:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _jquery = __webpack_require__(11);

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

},[961]);
//# sourceMappingURL=LeftAndMain.Ping.js.map
>>>>>>> build
