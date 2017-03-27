webpackJsonp([2],[function(n,t,i){"use strict"
function e(n){return n&&n.__esModule?n:{default:n}}var s=i(2),o=e(s)
!function(){var n={init:function n(t){t.addButton("sslink",{icon:"link",title:"Insert Link",type:"menubutton",menu:o.default.getActions("sslink")}),t.addMenuItem("sslink",{icon:"link",text:"Insert Link",
menu:o.default.getActions("sslink")})}}
tinymce.PluginManager.add("sslink",function(t){return n.init(t)})}()},,function(n,t){"use strict"
function i(n,t){if(!(n instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(t,"__esModule",{value:!0})
var e=function(){function n(n,t){for(var i=0;i<t.length;i++){var e=t[i]
e.enumerable=e.enumerable||!1,e.configurable=!0,"value"in e&&(e.writable=!0),Object.defineProperty(n,e.key,e)}}return function(t,i,e){return i&&n(t.prototype,i),e&&n(t,e),t}}(),s=function(){function n(){
i(this,n),this.actions={}}return e(n,[{key:"addAction",value:function n(t,i){this.initMenu(t),this.actions[t].push(i)}},{key:"getActions",value:function n(t){return this.initMenu(t),this.actions[t]}},{
key:"initMenu",value:function n(t){"undefined"==typeof this.actions[t]&&(this.actions[t]=[])}}]),n}()
window.ss=window.ss||{},window.ss.tinymceactions=window.ss.tinymceactions||new s,t.default=window.ss.tinymceactions}])
