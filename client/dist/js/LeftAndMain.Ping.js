webpackJsonp([7],{"./client/src/legacy/LeftAndMain.Ping.js":function(n,e,t){"use strict";var i=t(2);(function(n){return n&&n.__esModule?n:{default:n}})(i).default.entwine("ss.ping",function(n){n(".cms-container").entwine({PingIntervalSeconds:300,onadd:function(){this._setupPinging(),this._super()},_setupPinging:function(){var e=null,t=null,i=function(n,i){n.status<400&&0!=n.responseText||(t&&!t.closed||(t=window.open("Security/login"))||(alert("Please enable pop-ups for this site"),clearInterval(e)),t&&t.focus())};e=setInterval(function(){n.ajax({url:"Security/ping",global:!1,type:"POST",complete:i})},1e3*this.getPingIntervalSeconds())}})})}},["./client/src/legacy/LeftAndMain.Ping.js"]);