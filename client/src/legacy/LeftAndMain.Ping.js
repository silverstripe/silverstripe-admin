/**
 * File: LeftAndMain.Ping.js
 */
import $ from 'jquery';

$.entwine('ss.ping', function($){

  $('.cms-container').entwine(/** @lends ss.Form_EditForm */{
    /**
     * Variable: PingIntervalSeconds
     * (Number) Interval in which /Security/ping will be checked for a valid login session.
     */
    PingIntervalSeconds: 5*60,

    onadd: function() {
      this._setupPinging();
      this._super();
    },

    /**
     * Function: _setupPinging
     *
     * This function is called by prototype when it receives notification that the user was logged out.
     * It uses /Security/ping for this purpose, which should return '1' if a valid user session exists.
     * It redirects back to the login form if the URL is either unreachable, or returns '0'.
     */
    _setupPinging: function() {
      var interval = null;
      var loginPopup = null;

      var onSessionLost = function(xmlhttp, status) {
        if (xmlhttp.status < 400 && xmlhttp.responseText != 0) {
          return;
        }
        // only open a new window when window doesn't exist or it was previously closed
        if (!loginPopup || loginPopup.closed) {
          loginPopup = window.open('Security/login');

          if (!loginPopup) {
            alert('Please enable pop-ups for this site');

            // stop bothering people if they don't want pop-ups...
            clearInterval(interval);
          }
        }

        if (loginPopup) {
          loginPopup.focus();
        }
      };

      // setup pinging for login expiry
      interval = setInterval(function() {
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
