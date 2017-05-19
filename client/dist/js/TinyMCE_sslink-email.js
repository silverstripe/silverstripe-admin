<<<<<<< HEAD
webpackJsonp([3],[function(e,t,n){"use strict"
function r(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0})
var o=n(5),i=r(o),a=n(2),u=r(a),c=n(6),s=r(c),f=n(3),l=r(f),d=n(7),p=n(4),h=r(p),y=n(8),m=n(13)
u.default.addAction("sslink",{text:i.default._t("Admin.LINKLABEL_EMAIL","Link to email address"),onclick:function e(t){return t.execCommand("sslinkemail")}})
var v={init:function e(t){t.addCommand("sslinkemail",function(){var e=window.jQuery("#"+t.id).entwine("ss")
e.openLinkEmailDialog()})}},b="insert-link__dialog-wrapper--email",w="SilverStripe\\Admin\\LeftAndMain",g="EditorEmailLink",_=(0,m.provideInjector)((0,y.createInsertLinkModal)(w,g))
h.default.entwine("ss",function(e){e("textarea.htmleditor").entwine({openLinkEmailDialog:function t(){var n=e("#"+b)
n.length||(n=e('<div id="'+b+'" />'),e("body").append(n)),n.addClass("insert-link__dialog-wrapper"),n.setElement(this),n.open()}}),e("#"+b).entwine({renderModal:function e(t){var n=this,r=ss.store,o=ss.apolloClient,a=function e(){
return n.close()},u=function e(){return n.handleInsert.apply(n,arguments)},c=this.getOriginalAttributes()
l.default.render(s.default.createElement(d.ApolloProvider,{store:r,client:o},s.default.createElement(_,{show:t,onInsert:u,onHide:a,title:i.default._t("Admin.LINK_EMAIL","Insert email link"),bodyClassName:"modal__dialog",
className:"insert-link__dialog-wrapper--email",fileAttributes:c})),this[0])},getOriginalAttributes:function t(){var n=this.getElement().getEditor(),r=e(n.getSelectedNode()),o=(r.attr("href")||"").split("?"),i=o[0].replace(/^mailto:/,"").split("?")[0]


i.match(/.+@.+\..+/)||(i="")
var a=o[1]?o[1].match(/subject=([^&]+)/):"",u=a?a[1]:""
return{Link:i,Subject:u,Description:r.attr("title")}},buildAttributes:function e(t){var n=this._super(t),r="",o=n.href.replace(/^mailto:/,"").split("?")[0]
return o.match(/.+@.+\..+/)||(o=""),o&&(r="mailto:"+o),r&&t.Subject&&(r=r+"?subject="+encodeURIComponent(t.Subject)),n.href=r,delete n.target,n}})}),tinymce.PluginManager.add("sslinkemail",function(e){
return v.init(e)}),t.default=v},,function(e,t){"use strict"
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


return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function u(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}function c(e){return{actions:{
schema:(0,h.bindActionCreators)(w,e)}}}Object.defineProperty(t,"__esModule",{value:!0}),t.createInsertLinkModal=t.InsertLinkModal=void 0
var s=function(){function e(e,t){var n=[],r=!0,o=!1,i=void 0
try{for(var a=e[Symbol.iterator](),u;!(r=(u=a.next()).done)&&(n.push(u.value),!t||n.length!==t);r=!0);}catch(e){o=!0,i=e}finally{try{!r&&a.return&&a.return()}finally{if(o)throw i}}return n}return function(t,n){
if(Array.isArray(t))return t
if(Symbol.iterator in Object(t))return e(t,n)
throw new TypeError("Invalid attempt to destructure non-iterable instance")}}(),f=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]
for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},l=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n]
r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),d=n(6),p=o(d),h=n(9),y=n(10),m=n(11),v=o(m),b=n(12),w=r(b),g=function(e){
function t(e){i(this,t)
var n=a(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e))
return n.handleSubmit=n.handleSubmit.bind(n),n.setOverrides(e.show?e:null),n}return u(t,e),l(t,[{key:"componentWillReceiveProps",value:function e(t){(t.show&&!this.props.show||!t.show&&this.props.show)&&this.setOverrides(t.show?t:null)

}},{key:"componentWillUnmount",value:function e(){this.setOverrides()}},{key:"setOverrides",value:function e(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null
if(t){if(t.schemaUrl){var n=f({},t.fileAttributes)
delete n.ID
var r={fields:Object.entries(n).map(function(e){var t=s(e,2),n=t[0],r=t[1]
return{name:n,value:r}})}
this.props.actions.schema.setSchemaStateOverrides(t.schemaUrl,r)}}else{var o=t&&t.schemaUrl||this.props.schemaUrl
o&&this.props.actions.schema.setSchemaStateOverrides(o,null)}}},{key:"getModalProps",value:function e(){var t=f({},this.props,{handleSubmit:this.handleSubmit,handleHide:this.props.onHide})
return delete t.onHide,delete t.onInsert,delete t.sectionConfig,t}},{key:"handleSubmit",value:function e(t,n){switch(n){case"action_cancel":this.props.onHide()
break
default:this.props.onInsert(t,n)}return Promise.resolve()}},{key:"render",value:function e(){var t=this.getModalProps()
return p.default.createElement(v.default,t)}}]),t}(d.Component)
g.propTypes={show:d.PropTypes.bool,schemaUrl:d.PropTypes.string,onInsert:d.PropTypes.func.isRequired,onHide:d.PropTypes.func.isRequired,actions:d.PropTypes.object},g.defaultProps={}
var _=function e(t,n){function r(e){var r=e.config.sections.find(function(e){return e.name===t}),o=""+r.form[n].schemaUrl
return{sectionConfig:r,schemaUrl:o}}return(0,y.connect)(r,c)(g)}
t.InsertLinkModal=g,t.createInsertLinkModal=_,t.default=(0,y.connect)(function(){return{}},c)(g)},,,function(e,t){e.exports=FormBuilderModal},function(e,t){e.exports=SchemaActions},function(e,t,n){"use strict"


function r(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0}),t.inject=t.withInjector=t.provideInjector=void 0
var o=n(14),i=r(o),a=n(15),u=r(a),c=n(17),s=r(c),f=n(18),l=r(f)
t.provideInjector=i.default,t.withInjector=u.default,t.inject=s.default,t.default=l.default},function(e,t,n){"use strict"
function r(e){return e&&e.__esModule?e:{default:e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")


return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function a(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}function u(e){var t=function(t){
function n(){return o(this,n),i(this,(n.__proto__||Object.getPrototypeOf(n)).apply(this,arguments))}return a(n,t),c(n,[{key:"getChildContext",value:function e(){var t=d.default.get
return{injector:{get:t}}}},{key:"render",value:function t(){return f.default.createElement(e,this.props)}}]),n}(f.default.Component)
return t.childContextTypes={injector:f.default.PropTypes.shape({get:f.default.PropTypes.func})},t}Object.defineProperty(t,"__esModule",{value:!0})
var c=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n]
r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),s=n(6),f=r(s),l=n(13),d=r(l)


t.default=u},function(e,t,n){"use strict"
function r(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0})
var o=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]
for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},i=n(16),a=r(i),u=function e(t){return t.contextTypes=o({},t.contextTypes,a.default),t.displayName="withInjector(\n    "+(t.displayName||t.name||"Component")+"\n  )",
t}
t.default=u},function(e,t,n){"use strict"
function r(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0})
var o=n(6),i=r(o)
t.default={injector:i.default.PropTypes.shape({get:i.default.PropTypes.func})}},function(e,t,n){"use strict"
function r(e){return e&&e.__esModule?e:{default:e}}function o(e){if(Array.isArray(e)){for(var t=0,n=Array(e.length);t<e.length;t++)n[t]=e[t]
return n}return Array.from(e)}function i(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function a(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")


return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function u(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{
value:!0})
var c=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]
for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},s="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e

},f=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n]
r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),l=n(6),d=r(l),p=n(16),h=r(p),y=function e(t,n,r){
var l=function(e){function l(){return i(this,l),a(this,(l.__proto__||Object.getPrototypeOf(l)).apply(this,arguments))}return u(l,e),f(l,[{key:"render",value:function e(){var i={},a=n
if(a){if(!Array.isArray(a)){if("string"!=typeof a)throw new Error("\n            withInjector() passed an argument for dependencies that is "+("undefined"==typeof a?"undefined":s(a))+". \n            Must be a string or array of named dependencies.\n          ")


a=[a]}var u=a.map(this.context.injector.get)
if(r&&"function"==typeof r){if(i=r.apply(void 0,o(u)),"object"!==("undefined"==typeof i?"undefined":s(i)))throw new Error("\n              mapDepedenciesToProps parameter passed to inject() \n              should return an object that maps prop names to dependencies\n             ")

}else for(var f=0;f<a.length;f++)i[a[f]]=u[f]}var l=c({},this.props,i)
return d.default.createElement(t,l)}}]),l}(d.default.Component)
return l.contextTypes=h.default,l.displayName="inject(\n    "+(t.displayName||t.name||"Component")+"\n  )",l}
t.default=y},function(e,t,n){"use strict"
function r(e){return e&&e.__esModule?e:{default:e}}function o(e){if(Array.isArray(e)){for(var t=0,n=Array(e.length);t<e.length;t++)n[t]=e[t]
return n}return Array.from(e)}Object.defineProperty(t,"__esModule",{value:!0})
var i=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]
for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},a=n(19),u=r(a),c=n(9),s={},f={},l="before",d="after",p="__HEAD__",h="__TAIL__",y=[l,d],m=!1,v=function e(t){y.forEach(function(e){
if("undefined"!=typeof t[e]&&"string"!=typeof t[e]&&!Array.isArray(t[e]))throw new Error("Injector.update() key "+e+" must be a string or array")})},b=function e(t){return function(){if(m)throw new Error("Cannot mutate DI container after it has been initialised")


t.apply(void 0,arguments)}},w=function e(t,n){var r=t.displayName||t.name||"Component",i=[r].concat(o(n))
return i.reduce(function(e,t){return t+"("+e+")"})},g=function e(t){return t.map(function(e){var t=i({},e)
return y.forEach(function(n){Array.isArray(e[n])?t[n]=e[n]:t[n]=e[n]?[e[n]]:[]}),y.every(function(e){return!t[e].length})&&(t[d]=[p],t[l]=[h]),t})},_=function e(t){var n=null
return y.forEach(function(e){if(t[e].includes("*")){if(t[e].length>1)throw new Error("\n          Key "+e+" on "+t.name+' should only specify one key \n          if using the "*" wildcard\n        ')
if(n)throw new Error("\n          Cannot specify a "+e+" rule on "+t.name+" if a wildcard \n          has been specified\n        ")
n=e}}),n},j=function e(t){var n=[p,h],r=[n],o=[],i=g(t)
return i.forEach(function(e){var t=e.name,n=_(e)
n===d?r.push([h,t]):n===l?r.push([t,p]):(r.push([t,h]),r.push([p,t]),e[l].forEach(function(e){r.push([t,e])}),e[d].forEach(function(e){r.push([e,t])}))}),(0,u.default)(r).filter(function(e){return!n.includes(e)

}).forEach(function(e){o=o.concat(t.filter(function(t){return t.name===e}))}),o},O=function e(t){t||console.warn("\n      Injector.__reset__() should only be used in dev mode. Using\n      this method in production will likely break.\n    "),
[s,f].forEach(function(e){Object.keys(e).forEach(function(t){return delete e[t]})}),m=!1},E=function e(t,n,r){v(t),s[n]||(s[n]=[]),s[n].push(i({},t,{factory:r}))},k=function e(t,n){var r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{}


if(f[t]&&r.force!==!0)throw new Error("\n      Tried to register service "+t+" more than once. This practice is discouraged. Consider\n      using Injector.update() to enhance the service rather than override it completely.\n      Otherwise, invoke the register() function with { force: true } as the third argument.\n     ")


f[t]=n},P=function e(t){if(!m)throw new Error("\n      Injector.get(): Attempted to access DI layer before it was initialised.\n      Did you forget to invoke Injector.load()?")
if(!f[t])throw new Error("Injector.get(): Component "+t+" does not exist")
return f[t]},A=function e(t,n){var r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{},o=i({name:t},r)
v(o),n(function(e,t,n){E(i({},o,{displayName:n}),e,t)})},I=function e(){Object.keys(s).forEach(function(e){if(s.hasOwnProperty(e)){var t=j(s[e]),n=f[e],r=t.map(function(e){return e.factory}),i=t.map(function(e){
return e.displayName||e.name}),a=c.compose.apply(void 0,o(r))(n)
a.displayName=w(n,i),f[e]=a}}),m=!0},M={get:P,load:I,transform:b(A),register:b(k)}
t.default=M},function(e,t){function n(e,t){function n(a,u,c){if(c.indexOf(a)>=0)throw new Error("Cyclic dependency: "+JSON.stringify(a))
if(!~e.indexOf(a))throw new Error("Found unknown node. Make sure to provided all involved nodes. Unknown node: "+JSON.stringify(a))
if(!i[u]){i[u]=!0
var s=t.filter(function(e){return e[0]===a})
if(u=s.length){var f=c.concat(a)
do{var l=s[--u][1]
n(l,e.indexOf(l),f)}while(u)}o[--r]=a}}for(var r=e.length,o=new Array(r),i={},a=r;a--;)i[a]||n(e[a],a,[])
return o}function r(e){for(var t=[],n=0,r=e.length;n<r;n++){var o=e[n]
t.indexOf(o[0])<0&&t.push(o[0]),t.indexOf(o[1])<0&&t.push(o[1])}return t}e.exports=t=function(e){return n(r(e),e)},t.array=n}])
=======
webpackJsonp([2],{120:function(e,t){e.exports=ReactApollo},147:function(e,t){e.exports=FormBuilderModal},148:function(e,t){e.exports=SchemaActions},176:function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function i(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function a(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}function s(e){return{actions:{schema:(0,d.bindActionCreators)(b,e)}}}Object.defineProperty(t,"__esModule",{value:!0}),t.createInsertLinkModal=t.InsertLinkModal=void 0;var l=function(){function e(e,t){var n=[],r=!0,i=!1,o=void 0;try{for(var a,s=e[Symbol.iterator]();!(r=(a=s.next()).done)&&(n.push(a.value),!t||n.length!==t);r=!0);}catch(e){i=!0,o=e}finally{try{!r&&s.return&&s.return()}finally{if(i)throw o}}return n}return function(t,n){if(Array.isArray(t))return t;if(Symbol.iterator in Object(t))return e(t,n);throw new TypeError("Invalid attempt to destructure non-iterable instance")}}(),u=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),c=n(0),f=r(c),d=n(51),p=n(43),h=n(147),m=r(h),v=n(148),b=function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n]);return t.default=e,t}(v),y=function(e){function t(e){i(this,t);var n=o(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return n.handleSubmit=n.handleSubmit.bind(n),n.setOverrides(e.show?e:null),n}return a(t,e),u(t,[{key:"componentWillReceiveProps",value:function(e){(e.show&&!this.props.show||!e.show&&this.props.show)&&this.setOverrides(e.show?e:null)}},{key:"componentWillUnmount",value:function(){this.setOverrides()}},{key:"setOverrides",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null;if(e){if(e.schemaUrl){var t=Object.assign({},e.fileAttributes);delete t.ID;var n={fields:Object.entries(t).map(function(e){var t=l(e,2);return{name:t[0],value:t[1]}})};this.props.actions.schema.setSchemaStateOverrides(e.schemaUrl,n)}}else{var r=e&&e.schemaUrl||this.props.schemaUrl;r&&this.props.actions.schema.setSchemaStateOverrides(r,null)}}},{key:"getModalProps",value:function(){var e=Object.assign({},this.props,{handleSubmit:this.handleSubmit,handleHide:this.props.onHide});return delete e.onHide,delete e.onInsert,delete e.sectionConfig,e}},{key:"handleSubmit",value:function(e,t){switch(t){case"action_cancel":this.props.onHide();break;default:this.props.onInsert(e,t)}return Promise.resolve()}},{key:"render",value:function(){var e=this.getModalProps();return f.default.createElement(m.default,e)}}]),t}(c.Component);y.propTypes={show:c.PropTypes.bool,schemaUrl:c.PropTypes.string,onInsert:c.PropTypes.func.isRequired,onHide:c.PropTypes.func.isRequired,actions:c.PropTypes.object},y.defaultProps={};var w=function(e,t){function n(n){var r=n.config.sections.find(function(t){return t.name===e});return{sectionConfig:r,schemaUrl:""+r.form[t].schemaUrl}}return(0,p.connect)(n,s)(y)};t.InsertLinkModal=y,t.createInsertLinkModal=w,t.default=(0,p.connect)(function(){return{}},s)(y)},24:function(e,t){e.exports=i18n},898:function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var i=n(24),o=r(i),a=n(97),s=r(a),l=n(0),u=r(l),c=n(28),f=r(c),d=n(120),p=n(26),h=r(p),m=n(176);s.default.addAction("sslink",{text:o.default._t("Admin.LINKLABEL_EMAIL","Link to email address"),onclick:function(e){return e.execCommand("sslinkemail")}});var v={init:function(e){e.addCommand("sslinkemail",function(){window.jQuery("#"+e.id).entwine("ss").openLinkEmailDialog()})}},b="insert-link__dialog-wrapper--email",y=(0,m.createInsertLinkModal)("SilverStripe\\Admin\\LeftAndMain","EditorEmailLink");h.default.entwine("ss",function(e){e("textarea.htmleditor").entwine({openLinkEmailDialog:function(){var t=e("#"+b);t.length||(t=e('<div id="'+b+'" />'),e("body").append(t)),t.addClass("insert-link__dialog-wrapper"),t.setElement(this),t.open()}}),e("#"+b).entwine({renderModal:function(e){var t=this,n=ss.store,r=ss.apolloClient,i=function(){return t.close()},a=function(){return t.handleInsert.apply(t,arguments)},s=this.getOriginalAttributes();f.default.render(u.default.createElement(d.ApolloProvider,{store:n,client:r},u.default.createElement(y,{show:e,onInsert:a,onHide:i,title:o.default._t("Admin.LINK_EMAIL","Insert email link"),bodyClassName:"modal__dialog",className:"insert-link__dialog-wrapper--email",fileAttributes:s})),this[0])},getOriginalAttributes:function(){var t=this.getElement().getEditor(),n=e(t.getSelectedNode()),r=(n.attr("href")||"").split("?"),i=r[0].replace(/^mailto:/,"").split("?")[0];i.match(/.+@.+\..+/)||(i="");var o=r[1]?r[1].match(/subject=([^&]+)/):"";return{Link:i,Subject:o?o[1]:"",Description:n.attr("title")}},buildAttributes:function(e){var t=this._super(e),n="",r=t.href.replace(/^mailto:/,"").split("?")[0];return r.match(/.+@.+\..+/)||(r=""),r&&(n="mailto:"+r),n&&e.Subject&&(n=n+"?subject="+encodeURIComponent(e.Subject)),t.href=n,delete t.target,t}})}),tinymce.PluginManager.add("sslinkemail",function(e){return v.init(e)}),t.default=v},97:function(e,t,n){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(t,"__esModule",{value:!0});var i=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),o=function(){function e(){r(this,e),this.actions={}}return i(e,[{key:"addAction",value:function(e,t){this.actions[e]=this.getActions(e).concat([t])}},{key:"getActions",value:function(e){return this.actions[e]||[]}}]),e}();window.ss=window.ss||{},window.ss.tinymceactions=window.ss.tinymceactions||new o,t.default=window.ss.tinymceactions}},[898]);
>>>>>>> Enhancement Upgrade to webpack2 and cleanup config file
