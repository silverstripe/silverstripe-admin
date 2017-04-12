webpackJsonp([2],[function(n,t,e){"use strict"
function i(n){return n&&n.__esModule?n:{default:n}}Object.defineProperty(t,"__esModule",{value:!0})
var o=Object.assign||function(n){for(var t=1;t<arguments.length;t++){var e=arguments[t]
for(var i in e)Object.prototype.hasOwnProperty.call(e,i)&&(n[i]=e[i])}return n},a=e(2),c=i(a),r=e(3),u=i(r),s=e(4),l=i(s),f={init:function n(t){var e=c.default.getActions("sslink").map(function(n){return o({},n,{
onclick:function e(){return n.onclick(t)}})})
t.addButton("sslink",{icon:"link",title:"Insert Link",type:"menubutton",menu:e}),t.addMenuItem("sslink",{icon:"link",text:"Insert Link",menu:e})}}
l.default.entwine("ss",function(n){n(".insert-link__dialog-wrapper").entwine({Element:null,Data:{},onunmatch:function n(){this._clearModal()},_clearModal:function n(){u.default.unmountComponentAtNode(this[0])

},open:function n(){this._renderModal(!0)},close:function n(){this.setData({}),this._renderModal(!1)}})}),tinymce.PluginManager.add("sslink",function(n){return f.init(n)}),t.default=f},,function(n,t){"use strict"


function e(n,t){if(!(n instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(t,"__esModule",{value:!0})
var i=function(){function n(n,t){for(var e=0;e<t.length;e++){var i=t[e]
i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(n,i.key,i)}}return function(t,e,i){return e&&n(t.prototype,e),i&&n(t,i),t}}(),o=function(){function n(){
e(this,n),this.actions={}}return i(n,[{key:"addAction",value:function n(t,e){this.actions[t]=this.getActions(t).concat([e])}},{key:"getActions",value:function n(t){return this.actions[t]||[]}}]),n}()
window.ss=window.ss||{},window.ss.tinymceactions=window.ss.tinymceactions||new o,t.default=window.ss.tinymceactions}])
