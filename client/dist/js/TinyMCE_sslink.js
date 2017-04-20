webpackJsonp([2],[function(t,n,e){"use strict"
function i(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(n,"__esModule",{value:!0})
var r=Object.assign||function(t){for(var n=1;n<arguments.length;n++){var e=arguments[n]
for(var i in e)Object.prototype.hasOwnProperty.call(e,i)&&(t[i]=e[i])}return t},o=e(2),a=i(o),s=e(3),c=i(s),u=e(4),l=i(u),d={init:function t(n){var e=a.default.getActions("sslink").map(function(t){return r({},t,{
onclick:function e(){return t.onclick(n)}})})
n.addButton("sslink",{icon:"link",title:"Insert Link",type:"menubutton",menu:e}),n.addMenuItem("sslink",{icon:"link",text:"Insert Link",menu:e})}}
l.default.entwine("ss",function(t){t(".insert-link__dialog-wrapper").entwine({Element:null,Data:{},onunmatch:function t(){this._clearModal()},_clearModal:function t(){c.default.unmountComponentAtNode(this[0])

},open:function t(){this.renderModal(!0)},close:function t(){this.setData({}),this.renderModal(!1)},renderModal:function t(){},handleInsert:function t(n){var e=this.buildAttributes(n)
this.insertLinkInEditor(e),this.close()},buildAttributes:function t(n){var e=n.Anchor.length?"#"+n.Anchor:"",i=""+n.Link+e
return{href:i,target:n.TargetBlank?"_blank":"",title:n.Description}},insertLinkInEditor:function t(n){var e=this.getElement().getEditor()
e.insertLink(n)},getOriginalAttributes:function n(){var e=this.getElement().getEditor(),i=t(e.getSelectedNode()),r=(i.attr("href")||"").split("#")
return{Link:r[0]||"",Anchor:r[1]||"",Description:i.attr("title"),TargetBlank:!!i.attr("target")}}})}),tinymce.PluginManager.add("sslink",function(t){return d.init(t)}),n.default=d},,function(t,n){"use strict"


function e(t,n){if(!(t instanceof n))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(n,"__esModule",{value:!0})
var i=function(){function t(t,n){for(var e=0;e<n.length;e++){var i=n[e]
i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}return function(n,e,i){return e&&t(n.prototype,e),i&&t(n,i),n}}(),r=function(){function t(){
e(this,t),this.actions={}}return i(t,[{key:"addAction",value:function t(n,e){this.actions[n]=this.getActions(n).concat([e])}},{key:"getActions",value:function t(n){return this.actions[n]||[]}}]),t}()
window.ss=window.ss||{},window.ss.tinymceactions=window.ss.tinymceactions||new r,n.default=window.ss.tinymceactions}])
