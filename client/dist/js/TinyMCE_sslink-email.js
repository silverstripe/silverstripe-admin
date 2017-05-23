webpackJsonp([3],[function(e,t,n){"use strict"
function r(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0})
var i=n(5),o=r(i),a=n(2),s=r(a),l=n(6),u=r(l),c=n(3),f=r(c),d=n(7),p=n(4),h=r(p),m=n(8)
s.default.addAction("sslink",{text:o.default._t("Admin.LINKLABEL_EMAIL","Link to email address"),onclick:function e(t){return t.execCommand("sslinkemail")}})
var v={init:function e(t){t.addCommand("sslinkemail",function(){var e=window.jQuery("#"+t.id).entwine("ss")
e.openLinkEmailDialog()})}},b="insert-link__dialog-wrapper--email",y="SilverStripe\\Admin\\LeftAndMain",w="EditorEmailLink",g=(0,m.createInsertLinkModal)(y,w)
h.default.entwine("ss",function(e){e("textarea.htmleditor").entwine({openLinkEmailDialog:function t(){var n=e("#"+b)
n.length||(n=e('<div id="'+b+'" />'),e("body").append(n)),n.addClass("insert-link__dialog-wrapper"),n.setElement(this),n.open()}}),e("#"+b).entwine({renderModal:function e(t){var n=this,r=ss.store,i=ss.apolloClient,a=function e(){
return n.close()},s=function e(){return n.handleInsert.apply(n,arguments)},l=this.getOriginalAttributes()
f.default.render(u.default.createElement(d.ApolloProvider,{store:r,client:i},u.default.createElement(g,{show:t,onInsert:s,onHide:a,title:o.default._t("Admin.LINK_EMAIL","Insert email link"),bodyClassName:"modal__dialog",
className:"insert-link__dialog-wrapper--email",fileAttributes:l})),this[0])},getOriginalAttributes:function t(){var n=this.getElement().getEditor(),r=e(n.getSelectedNode()),i=(r.attr("href")||"").split("?"),o=i[0].replace(/^mailto:/,"").split("?")[0]


o.match(/.+@.+\..+/)||(o="")
var a=i[1]?i[1].match(/subject=([^&]+)/):"",s=a?a[1]:""
return{Link:o,Subject:s,Description:r.attr("title")}},buildAttributes:function e(t){var n=this._super(t),r="",i=n.href.replace(/^mailto:/,"").split("?")[0]
return i.match(/.+@.+\..+/)||(i=""),i&&(r="mailto:"+i),r&&t.Subject&&(r=r+"?subject="+encodeURIComponent(t.Subject)),n.href=r,delete n.target,n}})}),tinymce.PluginManager.add("sslinkemail",function(e){
return v.init(e)}),t.default=v},,function(e,t){"use strict"
function n(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(t,"__esModule",{value:!0})
var r=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n]
r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),i=function(){function e(){
n(this,e),this.actions={}}return r(e,[{key:"addAction",value:function e(t,n){this.actions[t]=this.getActions(t).concat([n])}},{key:"getActions",value:function e(t){return this.actions[t]||[]}}]),e}()
window.ss=window.ss||{},window.ss.tinymceactions=window.ss.tinymceactions||new i,t.default=window.ss.tinymceactions},,,function(e,t){e.exports=i18n},,function(e,t){e.exports=ReactApollo},function(e,t,n){
"use strict"
function r(e){if(e&&e.__esModule)return e
var t={}
if(null!=e)for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n])
return t.default=e,t}function i(e){return e&&e.__esModule?e:{default:e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function a(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")


return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function s(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}function l(e){return{actions:{
schema:(0,h.bindActionCreators)(w,e)}}}Object.defineProperty(t,"__esModule",{value:!0}),t.createInsertLinkModal=t.InsertLinkModal=void 0
var u=function(){function e(e,t){var n=[],r=!0,i=!1,o=void 0
try{for(var a=e[Symbol.iterator](),s;!(r=(s=a.next()).done)&&(n.push(s.value),!t||n.length!==t);r=!0);}catch(e){i=!0,o=e}finally{try{!r&&a.return&&a.return()}finally{if(i)throw o}}return n}return function(t,n){
if(Array.isArray(t))return t
if(Symbol.iterator in Object(t))return e(t,n)
throw new TypeError("Invalid attempt to destructure non-iterable instance")}}(),c=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]
for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},f=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n]
r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),d=n(6),p=i(d),h=n(9),m=n(10),v=n(11),b=i(v),y=n(12),w=r(y),g=function(e){
function t(e){o(this,t)
var n=a(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e))
return n.handleSubmit=n.handleSubmit.bind(n),n.setOverrides(e.show?e:null),n}return s(t,e),f(t,[{key:"componentWillReceiveProps",value:function e(t){(t.show&&!this.props.show||!t.show&&this.props.show)&&this.setOverrides(t.show?t:null)

}},{key:"componentWillUnmount",value:function e(){this.setOverrides()}},{key:"setOverrides",value:function e(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null
if(t){if(t.schemaUrl){var n=c({},t.fileAttributes)
delete n.ID
var r={fields:Object.entries(n).map(function(e){var t=u(e,2),n=t[0],r=t[1]
return{name:n,value:r}})}
this.props.actions.schema.setSchemaStateOverrides(t.schemaUrl,r)}}else{var i=t&&t.schemaUrl||this.props.schemaUrl
i&&this.props.actions.schema.setSchemaStateOverrides(i,null)}}},{key:"getModalProps",value:function e(){var t=c({},this.props,{handleSubmit:this.handleSubmit,handleHide:this.props.onHide})
return delete t.onHide,delete t.onInsert,delete t.sectionConfig,t}},{key:"handleSubmit",value:function e(t,n){switch(n){case"action_cancel":this.props.onHide()
break
default:this.props.onInsert(t,n)}return Promise.resolve()}},{key:"render",value:function e(){var t=this.getModalProps()
return p.default.createElement(b.default,t)}}]),t}(d.Component)
g.propTypes={show:d.PropTypes.bool,schemaUrl:d.PropTypes.string,onInsert:d.PropTypes.func.isRequired,onHide:d.PropTypes.func.isRequired,actions:d.PropTypes.object},g.defaultProps={}
var _=function e(t,n){function r(e){var r=e.config.sections.find(function(e){return e.name===t}),i=""+r.form[n].schemaUrl
return{sectionConfig:r,schemaUrl:i}}return(0,m.connect)(r,l)(g)}
t.InsertLinkModal=g,t.createInsertLinkModal=_,t.default=(0,m.connect)(function(){return{}},l)(g)},,,function(e,t){e.exports=FormBuilderModal},function(e,t){e.exports=SchemaActions}])
