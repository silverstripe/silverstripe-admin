webpackJsonp([4],[function(e,t,n){"use strict"
function r(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0})
var o=n(5),i=r(o),a=n(2),s=r(a),l=n(6),u=r(l),c=n(3),f=r(c),d=n(7),p=n(4),h=r(p),v=n(8)
s.default.addAction("sslink",{text:i.default._t("Admin.LINKLABEL_EXTERNALURL","Link to external URL"),onclick:function e(t){return t.execCommand("sslinkexternal")}})
var m={init:function e(t){t.addCommand("sslinkexternal",function(){var e=window.jQuery("#"+t.id).entwine("ss")
e.openLinkExternalDialog()})}},y="insert-link__dialog-wrapper--external",b="SilverStripe\\Admin\\LeftAndMain",w="EditorExternalLink",_=(0,v.createInsertLinkModal)(b,w)
h.default.entwine("ss",function(e){e("textarea.htmleditor").entwine({openLinkExternalDialog:function t(){var n=e("#"+y)
n.length||(n=e('<div id="'+y+'" />'),e("body").append(n)),n.addClass("insert-link__dialog-wrapper"),n.setElement(this),n.open()}}),e("#"+y).entwine({renderModal:function e(t){var n=this,r=ss.store,o=ss.apolloClient,a=function e(){
return n.close()},s=function e(){return n.handleInsert.apply(n,arguments)},l=this.getOriginalAttributes()
f.default.render(u.default.createElement(d.ApolloProvider,{store:r,client:o},u.default.createElement(_,{show:t,onInsert:s,onHide:a,title:i.default._t("Admin.LINK_EXTERNAL","Insert external link"),bodyClassName:"modal__dialog",
className:"insert-link__dialog-wrapper--external",fileAttributes:l})),this[0])},buildAttributes:function e(t){var n=this._super(t),r=n.href
return r.match(/:\/\//)||(r=window.location.protocol+"//"+r),r=r.replace(/:\/\/(#.*)$/,"$2"),r.match(/:\/\/$/)&&(r=""),n.href=r,n}})}),tinymce.PluginManager.add("sslinkexternal",function(e){return m.init(e)

}),t.default=m},,function(e,t){"use strict"
function n(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(t,"__esModule",{value:!0})
var r=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n]
r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),o=function(){function e(){
n(this,e),this.actions={}}return r(e,[{key:"addAction",value:function e(t,n){this.actions[t]=this.getActions(t).concat([n])}},{key:"getActions",value:function e(t){return this.actions[t]||[]}}]),e}()
window.ss=window.ss||{},window.ss.tinymceactions=window.ss.tinymceactions||new o,t.default=window.ss.tinymceactions},,,function(e,t){e.exports=i18n},,function(e,t){e.exports=ReactApollo},function(e,t,n){
"use strict"
function r(e){if(e&&e.__esModule)return e
var t={}
if(null!=e)for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n])
return t.default=e,t}function o(e){return e&&e.__esModule?e:{default:e}}function i(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function a(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")


return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function s(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}function l(e){return{actions:{
schema:(0,h.bindActionCreators)(w,e)}}}Object.defineProperty(t,"__esModule",{value:!0}),t.createInsertLinkModal=t.InsertLinkModal=void 0
var u=function(){function e(e,t){var n=[],r=!0,o=!1,i=void 0
try{for(var a=e[Symbol.iterator](),s;!(r=(s=a.next()).done)&&(n.push(s.value),!t||n.length!==t);r=!0);}catch(e){o=!0,i=e}finally{try{!r&&a.return&&a.return()}finally{if(o)throw i}}return n}return function(t,n){
if(Array.isArray(t))return t
if(Symbol.iterator in Object(t))return e(t,n)
throw new TypeError("Invalid attempt to destructure non-iterable instance")}}(),c=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]
for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},f=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n]
r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),d=n(6),p=o(d),h=n(9),v=n(10),m=n(11),y=o(m),b=n(12),w=r(b),_=function(e){
function t(e){i(this,t)
var n=a(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e))
return n.handleSubmit=n.handleSubmit.bind(n),n.setOverrides(e.show?e:null),n}return s(t,e),f(t,[{key:"componentWillReceiveProps",value:function e(t){(t.show&&!this.props.show||!t.show&&this.props.show)&&this.setOverrides(t.show?t:null)

}},{key:"componentWillUnmount",value:function e(){this.setOverrides()}},{key:"setOverrides",value:function e(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null
if(t){if(t.schemaUrl){var n=c({},t.fileAttributes)
delete n.ID
var r={fields:Object.entries(n).map(function(e){var t=u(e,2),n=t[0],r=t[1]
return{name:n,value:r}})}
this.props.actions.schema.setSchemaStateOverrides(t.schemaUrl,r)}}else{var o=t&&t.schemaUrl||this.props.schemaUrl
o&&this.props.actions.schema.setSchemaStateOverrides(o,null)}}},{key:"getModalProps",value:function e(){var t=c({},this.props,{handleSubmit:this.handleSubmit,handleHide:this.props.onHide})
return delete t.onHide,delete t.onInsert,delete t.sectionConfig,t}},{key:"handleSubmit",value:function e(t,n){switch(n){case"action_cancel":this.props.onHide()
break
default:this.props.onInsert(t,n)}return Promise.resolve()}},{key:"render",value:function e(){var t=this.getModalProps()
return p.default.createElement(y.default,t)}}]),t}(d.Component)
_.propTypes={show:d.PropTypes.bool,schemaUrl:d.PropTypes.string,onInsert:d.PropTypes.func.isRequired,onHide:d.PropTypes.func.isRequired,actions:d.PropTypes.object},_.defaultProps={}
var k=function e(t,n){function r(e){var r=e.config.sections.find(function(e){return e.name===t}),o=""+r.form[n].schemaUrl
return{sectionConfig:r,schemaUrl:o}}return(0,v.connect)(r,l)(_)}
t.InsertLinkModal=_,t.createInsertLinkModal=k,t.default=(0,v.connect)(function(){return{}},l)(_)},,,function(e,t){e.exports=FormBuilderModal},function(e,t){e.exports=SchemaActions}])
