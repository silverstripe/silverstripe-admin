webpackJsonp([2],[function(t,n,e){"use strict"
function i(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(n,"__esModule",{value:!0})
var o=Object.assign||function(t){for(var n=1;n<arguments.length;n++){var e=arguments[n]
for(var i in e)Object.prototype.hasOwnProperty.call(e,i)&&(t[i]=e[i])}return t},r=e(2),a=i(r),s=e(3),c=i(s),l=e(4),u=i(l),d=e(5),f=i(d),h={init:function t(n){function e(){var t=tinymce.activeEditor.selection.getNode()


if(t.href){var e="sslinkexternal";/^mailto:/.test(t.href)?e="sslinkemail":/^\[sitetree/.test(t.href)?e="sslinkpage":/^\[file_link/.test(t.href)&&(e="sslinkfile"),n.execCommand(e)}}var i=a.default.getActions("sslink").map(function(t){
return o({},t,{onclick:function e(){return t.onclick(n)}})})
n.addButton("sslink",{icon:"link",title:"Insert Link",type:"menubutton",menu:i}),n.addMenuItem("sslink",{icon:"link",text:"Insert Link",menu:i})
var r=(0,f.default)(n,[{type:"button",onClick:e,tooltip:"Edit link",icon:"link"},{type:"button",onClick:function t(){return n.execCommand("unlink")},tooltip:"Unlink",icon:"unlink"}])}}
u.default.entwine("ss",function(t){t(".insert-link__dialog-wrapper").entwine({Element:null,Data:{},onunmatch:function t(){this._clearModal()},_clearModal:function t(){c.default.unmountComponentAtNode(this[0])

},open:function t(){this.renderModal(!0)},close:function t(){this.setData({}),this.renderModal(!1)},renderModal:function t(){},handleInsert:function t(n){var e=this.buildAttributes(n)
this.insertLinkInEditor(e),this.close()},buildAttributes:function t(n){var e=n.Anchor&&n.Anchor.length?"#"+n.Anchor:"",i=""+n.Link+e
return{href:i,target:n.TargetBlank?"_blank":"",title:n.Description}},insertLinkInEditor:function t(n){var e=this.getElement().getEditor()
e.insertLink(n),e.addUndo(),e.repaint()},getOriginalAttributes:function n(){var e=this.getElement().getEditor(),i=t(e.getSelectedNode()),o=(i.attr("href")||"").split("#")
return{Link:o[0]||"",Anchor:o[1]||"",Description:i.attr("title"),TargetBlank:!!i.attr("target")}}})}),tinymce.PluginManager.add("sslink",function(t){return h.init(t)}),n.default=h},,function(t,n){"use strict"


function e(t,n){if(!(t instanceof n))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(n,"__esModule",{value:!0})
var i=function(){function t(t,n){for(var e=0;e<n.length;e++){var i=n[e]
i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}return function(n,e,i){return e&&t(n.prototype,e),i&&t(n,i),n}}(),o=function(){function t(){
e(this,t),this.actions={}}return i(t,[{key:"addAction",value:function t(n,e){this.actions[n]=this.getActions(n).concat([e])}},{key:"getActions",value:function t(n){return this.actions[n]||[]}}]),t}()
window.ss=window.ss||{},window.ss.tinymceactions=window.ss.tinymceactions||new o,n.default=window.ss.tinymceactions},,,function(t,n){"use strict"
function e(t,n){var e=tinymce.ui.Factory.create({type:"panel",classes:"inline-toolbar",layout:"stack",items:[{type:"toolbar",items:n}]}).hide().renderTo(window.document.body)
return tinymce.DOM.setStyles(e.getEl(),{position:"absolute",top:100,left:500}),t.on("remove",function(){e.remove()}),t.on("nodechange",function(t){"A"===t.element.tagName?e.show():e.hide()}),t.on("blur",function(){
e.hide()}),e}Object.defineProperty(n,"__esModule",{value:!0}),n.default=e}])
