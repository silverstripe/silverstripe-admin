webpackJsonp([3],[function(e,t,n){"use strict"
function r(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0})
var i=n(2),o=r(i),a=n(5),l=r(a),u=n(3),s=r(u),c=n(6),f=n(4),d=r(f),p=n(7),y=r(p)
o.default.addAction("sslink",{text:"Link to external URL",onclick:function e(t){return t.execCommand("sslinkexternal")}})
var w={init:function e(t){t.addCommand("sslinkexternal",function(){window.jQuery("#"+t.id).entwine("ss").openLinkExternalDialog()})}},b="insert-link__dialog-wrapper--external"
d.default.entwine("ss",function(e){e("textarea.htmleditor").entwine({openLinkExternalDialog:function t(){var n=e("#"+b)
n.length||(n=e('<div id="'+b+'" class="insert-link__dialog-wrapper" />'),e("body").append(n)),n.setElement(this),n.open()}}),e("#"+b).entwine({_renderModal:function e(t){var n=this,r=ss.store,i=ss.apolloClient,o=function e(){
return n.close()},a=function e(){return n._handleInsert.apply(n,arguments)},u=this.getOriginalAttributes()
s.default.render(l.default.createElement(c.ApolloProvider,{store:r,client:i},l.default.createElement(y.default,{show:t,onInsert:a,onHide:o,bodyClassName:"modal__dialog",className:"insert-link__dialog-wrapper--external",
fileAttributes:u})),this[0])},_handleInsert:function e(t){},getOriginalAttributes:function e(){var t=this.getElement()
return{}}})}),tinymce.PluginManager.add("sslinkexternal",function(e){return w.init(e)}),t.default=w},,function(e,t){"use strict"
function n(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(t,"__esModule",{value:!0})
var r=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n]
r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),i=function(){function e(){
n(this,e),this.actions={}}return r(e,[{key:"addAction",value:function e(t,n){this.actions[t]=this.getActions(t).concat([n])}},{key:"getActions",value:function e(t){return this.actions[t]||[]}}]),e}()
window.ss=window.ss||{},window.ss.tinymceactions=window.ss.tinymceactions||new i,t.default=window.ss.tinymceactions},,,,function(e,t){e.exports=ReactApollo},function(e,t,n){"use strict"
function r(e){return e&&e.__esModule?e:{default:e}}function i(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")


return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function a(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}function l(e,t){var n=e.config.sections[sectionConfigKey],r=t.fileAttributes?t.fileAttributes.ID:null,i=r&&n.form.fileInsertForm.schemaUrl+"/"+r


return{sectionConfig:n,schemaUrl:i}}Object.defineProperty(t,"__esModule",{value:!0})
var u=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n]
r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),s=n(5),c=r(s),f=n(8),d=function(e){
function t(){return i(this,t),o(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return a(t,e),u(t,[{key:"render",value:function e(){return c.default.createElement("div",null,"hello!")

}}]),t}(s.Component)
d.propTypes={},d.defaultProps={},t.default=(0,f.connect)(l)(d)}])
