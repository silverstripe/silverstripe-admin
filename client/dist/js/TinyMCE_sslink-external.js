<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
webpackJsonp([1],{124:function(e,t){e.exports=ReactApollo},151:function(e,t){e.exports=FormBuilderModal},154:function(e,t,n){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}function a(e){return{actions:{schema:(0,d.bindActionCreators)(y,e)}}}function s(e){function t(){return{Component:e}}return(0,v.connect)(t,a)(m)}Object.defineProperty(t,"__esModule",{value:!0}),t.ConnectedFileSchemaHandler=t.FileSchemaHandler=void 0;var u=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},c=function(){function e(e,t){var n=[],r=!0,o=!1,i=void 0;try{for(var a,s=e[Symbol.iterator]();!(r=(a=s.next()).done)&&(n.push(a.value),!t||n.length!==t);r=!0);}catch(e){o=!0,i=e}finally{try{!r&&s.return&&s.return()}finally{if(o)throw i}}return n}return function(t,n){if(Array.isArray(t))return t;if(Symbol.iterator in Object(t))return e(t,n);throw new TypeError("Invalid attempt to destructure non-iterable instance")}}(),l=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),f=n(0),p=function(e){return e&&e.__esModule?e:{default:e}}(f),d=n(34),h=n(76),y=function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n]);return t.default=e,t}(h),v=n(33),m=function(e){function t(e){r(this,t);var n=o(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return n.setOverrides=n.setOverrides.bind(n),n}return i(t,e),l(t,[{key:"componentWillMount",value:function(){this.setOverrides(this.props)}},{key:"componentWillUnmount",value:function(){this.setOverrides()}},{key:"setOverrides",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null;if(e){if(e.schemaUrl){var t=Object.assign({},e.fileAttributes);delete t.ID;var n={fields:Object.entries(t).map(function(e){var t=c(e,2);return{name:t[0],value:t[1]}})};this.props.actions.schema.setSchemaStateOverrides(e.schemaUrl,n)}}else{var r=this.props.schemaUrl;r&&this.props.actions.schema.setSchemaStateOverrides(r,null)}}},{key:"render",value:function(){var e=this.props.Component,t=Object.assign({},this.props);return delete t.Component,p.default.createElement(e,u({setOverrides:this.setOverrides},t))}}]),t}(f.Component);m.propTypes={fileAttributes:f.PropTypes.object,Component:f.PropTypes.oneOfType([f.PropTypes.element,f.PropTypes.func]),schemaUrl:f.PropTypes.string,actions:f.PropTypes.object};var b=(0,v.connect)(function(){return{}},a())(m);t.FileSchemaHandler=m,t.ConnectedFileSchemaHandler=b,t.default=s},181:function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function a(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}function s(e){return{actions:{schema:(0,f.bindActionCreators)(b,e)}}}Object.defineProperty(t,"__esModule",{value:!0}),t.createInsertLinkModal=t.InsertLinkModal=void 0;var u=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),c=n(0),l=r(c),f=n(34),p=n(33),d=n(151),h=r(d),y=n(154),v=r(y),m=n(76),b=function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n]);return t.default=e,t}(m),w=function(e){function t(e){o(this,t);var n=i(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return n.handleSubmit=n.handleSubmit.bind(n),e.setOverrides(e.show?e:null),n}return a(t,e),u(t,[{key:"componentWillReceiveProps",value:function(e){(e.show&&!this.props.show||!e.show&&this.props.show)&&e.setOverrides(e.show?e:null)}},{key:"getModalProps",value:function(){var e=Object.assign({},this.props,{handleSubmit:this.handleSubmit,handleHide:this.props.onHide});return delete e.onHide,delete e.onInsert,delete e.sectionConfig,e}},{key:"handleSubmit",value:function(e,t){switch(t){case"action_cancel":this.props.onHide();break;default:this.props.onInsert(e,t)}return Promise.resolve()}},{key:"render",value:function(){var e=this.getModalProps();return l.default.createElement(h.default,e)}}]),t}(c.Component);w.propTypes={show:c.PropTypes.bool,schemaUrl:c.PropTypes.string,onInsert:c.PropTypes.func.isRequired,onHide:c.PropTypes.func.isRequired,setOverrides:c.PropTypes.func.isRequired,actions:c.PropTypes.object},w.defaultProps={};var _=function(e,t){function n(n){var r=n.config.sections.find(function(t){return t.name===e});return{sectionConfig:r,schemaUrl:""+r.form[t].schemaUrl}}return(0,f.compose)((0,p.connect)(n,s),v.default)(w)};t.InsertLinkModal=w,t.createInsertLinkModal=_,t.default=(0,f.compose)((0,p.connect)(function(){return{}},s),v.default)(w)},23:function(e,t){e.exports=i18n},63:function(e,t){e.exports=Injector},76:function(e,t){e.exports=SchemaActions},910:function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var o=n(23),i=r(o),a=n(98),s=r(a),u=n(0),c=r(u),l=n(27),f=r(l),p=n(124),d=n(26),h=r(d),y=n(181),v=n(63);s.default.addAction("sslink",{text:i.default._t("Admin.LINKLABEL_EXTERNALURL","Link to external URL"),onclick:function(e){return e.execCommand("sslinkexternal")}});var m={init:function(e){e.addCommand("sslinkexternal",function(){window.jQuery("#"+e.id).entwine("ss").openLinkExternalDialog()})}},b="insert-link__dialog-wrapper--external",w=(0,v.provideInjector)((0,y.createInsertLinkModal)("SilverStripe\\Admin\\LeftAndMain","EditorExternalLink"));h.default.entwine("ss",function(e){e("textarea.htmleditor").entwine({openLinkExternalDialog:function(){var t=e("#"+b);t.length||(t=e('<div id="'+b+'" />'),e("body").append(t)),t.addClass("insert-link__dialog-wrapper"),t.setElement(this),t.open()}}),e("#"+b).entwine({renderModal:function(e){var t=this,n=ss.store,r=ss.apolloClient,o=function(){return t.close()},a=function(){return t.handleInsert.apply(t,arguments)},s=this.getOriginalAttributes();f.default.render(c.default.createElement(p.ApolloProvider,{store:n,client:r},c.default.createElement(w,{show:e,onInsert:a,onHide:o,title:i.default._t("Admin.LINK_EXTERNAL","Insert external link"),bodyClassName:"modal__dialog",className:"insert-link__dialog-wrapper--external",fileAttributes:s})),this[0])},buildAttributes:function(e){var t=this._super(e),n=t.href;return n.match(/:\/\//)||(n=window.location.protocol+"//"+n),n=n.replace(/:\/\/(#.*)$/,"$2"),n.match(/:\/\/$/)&&(n=""),t.href=n,t}})}),tinymce.PluginManager.add("sslinkexternal",function(e){return m.init(e)}),t.default=m},98:function(e,t,n){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(t,"__esModule",{value:!0});var o=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),i=function(){function e(){r(this,e),this.actions={}}return o(e,[{key:"addAction",value:function(e,t){this.actions[e]=this.getActions(e).concat([t])}},{key:"getActions",value:function(e){return this.actions[e]||[]}}]),e}();window.ss=window.ss||{},window.ss.tinymceactions=window.ss.tinymceactions||new i,t.default=window.ss.tinymceactions}},[910]);
=======
=======
>>>>>>> Enhancement Split Injector to factories, creating different instances for different parts
=======
>>>>>>> Fix bug in creating the updater callback for different services
<<<<<<< HEAD
webpackJsonp([1],{123:function(e,n){e.exports=ReactApollo},178:function(e,n){e.exports=InsertLinkModal},23:function(e,n){e.exports=i18n},63:function(e,n){e.exports=Injector},910:function(e,n,t){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(n,"__esModule",{value:!0});var r=t(23),o=i(r),a=t(97),l=i(a),s=t(0),d=i(s),u=t(27),c=i(u),f=t(123),p=t(26),x=i(p),m=t(178),_=t(63);l.default.addAction("sslink",{text:o.default._t("Admin.LINKLABEL_EXTERNALURL","Link to external URL"),onclick:function(e){return e.execCommand("sslinkexternal")}});var k={init:function(e){e.addCommand("sslinkexternal",function(){window.jQuery("#"+e.id).entwine("ss").openLinkExternalDialog()})}},L="insert-link__dialog-wrapper--external",A=(0,_.provideInjector)((0,m.createInsertLinkModal)("SilverStripe\\Admin\\LeftAndMain","EditorExternalLink"));x.default.entwine("ss",function(e){e("textarea.htmleditor").entwine({openLinkExternalDialog:function(){var n=e("#"+L);n.length||(n=e('<div id="'+L+'" />'),e("body").append(n)),n.addClass("insert-link__dialog-wrapper"),n.setElement(this),n.open()}}),e("#"+L).entwine({renderModal:function(e){var n=this,t=ss.store,i=ss.apolloClient,r=function(){return n.close()},a=function(){return n.handleInsert.apply(n,arguments)},l=this.getOriginalAttributes();c.default.render(d.default.createElement(f.ApolloProvider,{store:t,client:i},d.default.createElement(A,{show:e,onInsert:a,onHide:r,title:o.default._t("Admin.LINK_EXTERNAL","Insert external link"),bodyClassName:"modal__dialog",className:"insert-link__dialog-wrapper--external",fileAttributes:l})),this[0])},buildAttributes:function(e){var n=this._super(e),t=n.href;return t.match(/:\/\//)||(t=window.location.protocol+"//"+t),t=t.replace(/:\/\/(#.*)$/,"$2"),t.match(/:\/\/$/)&&(t=""),n.href=t,n}})}),tinymce.PluginManager.add("sslinkexternal",function(e){return k.init(e)}),n.default=k},97:function(e,n){e.exports=TinyMCEActionRegistrar}},[910]);
=======
webpackJsonp([1],{123:function(e,n){e.exports=ReactApollo},178:function(e,n){e.exports=InsertLinkModal},23:function(e,n){e.exports=i18n},63:function(e,n){e.exports=Injector},910:function(e,n,t){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(n,"__esModule",{value:!0});var r=t(23),o=i(r),a=t(97),l=i(a),s=t(0),d=i(s),u=t(28),c=i(u),f=t(123),p=t(26),x=i(p),m=t(178),_=t(63);l.default.addAction("sslink",{text:o.default._t("Admin.LINKLABEL_EXTERNALURL","Link to external URL"),onclick:function(e){return e.execCommand("sslinkexternal")}});var k={init:function(e){e.addCommand("sslinkexternal",function(){window.jQuery("#"+e.id).entwine("ss").openLinkExternalDialog()})}},L="insert-link__dialog-wrapper--external",A=(0,_.provideInjector)((0,m.createInsertLinkModal)("SilverStripe\\Admin\\LeftAndMain","EditorExternalLink"));x.default.entwine("ss",function(e){e("textarea.htmleditor").entwine({openLinkExternalDialog:function(){var n=e("#"+L);n.length||(n=e('<div id="'+L+'" />'),e("body").append(n)),n.addClass("insert-link__dialog-wrapper"),n.setElement(this),n.open()}}),e("#"+L).entwine({renderModal:function(e){var n=this,t=ss.store,i=ss.apolloClient,r=function(){return n.close()},a=function(){return n.handleInsert.apply(n,arguments)},l=this.getOriginalAttributes();c.default.render(d.default.createElement(f.ApolloProvider,{store:t,client:i},d.default.createElement(A,{show:e,onInsert:a,onHide:r,title:o.default._t("Admin.LINK_EXTERNAL","Insert external link"),bodyClassName:"modal__dialog",className:"insert-link__dialog-wrapper--external",fileAttributes:l})),this[0])},buildAttributes:function(e){var n=this._super(e),t=n.href;return t.match(/:\/\//)||(t=window.location.protocol+"//"+t),t=t.replace(/:\/\/(#.*)$/,"$2"),t.match(/:\/\/$/)&&(t=""),n.href=t,n}})}),tinymce.PluginManager.add("sslinkexternal",function(e){return k.init(e)}),n.default=k},97:function(e,n){e.exports=TinyMCEActionRegistrar}},[910]);
>>>>>>> Fix use process.env for environment check in boot
<<<<<<< HEAD
>>>>>>> Fix use process.env for environment check in boot
=======
=======
webpackJsonp([1],{123:function(e,n){e.exports=ReactApollo},178:function(e,n){e.exports=InsertLinkModal},23:function(e,n){e.exports=i18n},63:function(e,n){e.exports=Injector},911:function(e,n,t){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(n,"__esModule",{value:!0});var r=t(23),o=i(r),a=t(97),l=i(a),s=t(0),d=i(s),u=t(28),c=i(u),f=t(123),p=t(26),x=i(p),m=t(178),_=t(63);l.default.addAction("sslink",{text:o.default._t("Admin.LINKLABEL_EXTERNALURL","Link to external URL"),onclick:function(e){return e.execCommand("sslinkexternal")}});var k={init:function(e){e.addCommand("sslinkexternal",function(){window.jQuery("#"+e.id).entwine("ss").openLinkExternalDialog()})}},L="insert-link__dialog-wrapper--external",A=(0,_.provideInjector)((0,m.createInsertLinkModal)("SilverStripe\\Admin\\LeftAndMain","EditorExternalLink"));x.default.entwine("ss",function(e){e("textarea.htmleditor").entwine({openLinkExternalDialog:function(){var n=e("#"+L);n.length||(n=e('<div id="'+L+'" />'),e("body").append(n)),n.addClass("insert-link__dialog-wrapper"),n.setElement(this),n.open()}}),e("#"+L).entwine({renderModal:function(e){var n=this,t=ss.store,i=ss.apolloClient,r=function(){return n.close()},a=function(){return n.handleInsert.apply(n,arguments)},l=this.getOriginalAttributes();c.default.render(d.default.createElement(f.ApolloProvider,{store:t,client:i},d.default.createElement(A,{show:e,onInsert:a,onHide:r,title:o.default._t("Admin.LINK_EXTERNAL","Insert external link"),bodyClassName:"modal__dialog",className:"insert-link__dialog-wrapper--external",fileAttributes:l})),this[0])},buildAttributes:function(e){var n=this._super(e),t=n.href;return t.match(/:\/\//)||(t=window.location.protocol+"//"+t),t=t.replace(/:\/\/(#.*)$/,"$2"),t.match(/:\/\/$/)&&(t=""),n.href=t,n}})}),tinymce.PluginManager.add("sslinkexternal",function(e){return k.init(e)}),n.default=k},97:function(e,n){e.exports=TinyMCEActionRegistrar}},[911]);
>>>>>>> Enhancement Split Injector to factories, creating different instances for different parts
<<<<<<< HEAD
>>>>>>> Enhancement Split Injector to factories, creating different instances for different parts
=======
=======
webpackJsonp([1],{123:function(e,n){e.exports=ReactApollo},178:function(e,n){e.exports=InsertLinkModal},23:function(e,n){e.exports=i18n},63:function(e,n){e.exports=Injector},912:function(e,n,t){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(n,"__esModule",{value:!0});var r=t(23),o=i(r),a=t(97),l=i(a),s=t(0),d=i(s),u=t(28),c=i(u),f=t(123),p=t(26),x=i(p),m=t(178),_=t(63);l.default.addAction("sslink",{text:o.default._t("Admin.LINKLABEL_EXTERNALURL","Link to external URL"),onclick:function(e){return e.execCommand("sslinkexternal")}});var k={init:function(e){e.addCommand("sslinkexternal",function(){window.jQuery("#"+e.id).entwine("ss").openLinkExternalDialog()})}},L="insert-link__dialog-wrapper--external",A=(0,_.provideInjector)((0,m.createInsertLinkModal)("SilverStripe\\Admin\\LeftAndMain","EditorExternalLink"));x.default.entwine("ss",function(e){e("textarea.htmleditor").entwine({openLinkExternalDialog:function(){var n=e("#"+L);n.length||(n=e('<div id="'+L+'" />'),e("body").append(n)),n.addClass("insert-link__dialog-wrapper"),n.setElement(this),n.open()}}),e("#"+L).entwine({renderModal:function(e){var n=this,t=ss.store,i=ss.apolloClient,r=function(){return n.close()},a=function(){return n.handleInsert.apply(n,arguments)},l=this.getOriginalAttributes();c.default.render(d.default.createElement(f.ApolloProvider,{store:t,client:i},d.default.createElement(A,{show:e,onInsert:a,onHide:r,title:o.default._t("Admin.LINK_EXTERNAL","Insert external link"),bodyClassName:"modal__dialog",className:"insert-link__dialog-wrapper--external",fileAttributes:l})),this[0])},buildAttributes:function(e){var n=this._super(e),t=n.href;return t.match(/:\/\//)||(t=window.location.protocol+"//"+t),t=t.replace(/:\/\/(#.*)$/,"$2"),t.match(/:\/\/$/)&&(t=""),n.href=t,n}})}),tinymce.PluginManager.add("sslinkexternal",function(e){return k.init(e)}),n.default=k},97:function(e,n){e.exports=TinyMCEActionRegistrar}},[912]);
>>>>>>> Fix bug in creating the updater callback for different services
>>>>>>> Fix bug in creating the updater callback for different services
=======
webpackJsonp([1],{123:function(e,n){e.exports=ReactApollo},178:function(e,n){e.exports=InsertLinkModal},23:function(e,n){e.exports=i18n},63:function(e,n){e.exports=Injector},913:function(e,n,t){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(n,"__esModule",{value:!0});var r=t(23),o=i(r),a=t(97),l=i(a),s=t(0),d=i(s),u=t(27),c=i(u),f=t(123),p=t(26),x=i(p),m=t(178),_=t(63);l.default.addAction("sslink",{text:o.default._t("Admin.LINKLABEL_EXTERNALURL","Link to external URL"),onclick:function(e){return e.execCommand("sslinkexternal")}});var k={init:function(e){e.addCommand("sslinkexternal",function(){window.jQuery("#"+e.id).entwine("ss").openLinkExternalDialog()})}},L="insert-link__dialog-wrapper--external",A=(0,_.provideInjector)((0,m.createInsertLinkModal)("SilverStripe\\Admin\\LeftAndMain","EditorExternalLink"));x.default.entwine("ss",function(e){e("textarea.htmleditor").entwine({openLinkExternalDialog:function(){var n=e("#"+L);n.length||(n=e('<div id="'+L+'" />'),e("body").append(n)),n.addClass("insert-link__dialog-wrapper"),n.setElement(this),n.open()}}),e("#"+L).entwine({renderModal:function(e){var n=this,t=ss.store,i=ss.apolloClient,r=function(){return n.close()},a=function(){return n.handleInsert.apply(n,arguments)},l=this.getOriginalAttributes();c.default.render(d.default.createElement(f.ApolloProvider,{store:t,client:i},d.default.createElement(A,{show:e,onInsert:a,onHide:r,title:o.default._t("Admin.LINK_EXTERNAL","Insert external link"),bodyClassName:"modal__dialog",className:"insert-link__dialog-wrapper--external",fileAttributes:l})),this[0])},buildAttributes:function(e){var n=this._super(e),t=n.href;return t.match(/:\/\//)||(t=window.location.protocol+"//"+t),t=t.replace(/:\/\/(#.*)$/,"$2"),t.match(/:\/\/$/)&&(t=""),n.href=t,n}})}),tinymce.PluginManager.add("sslinkexternal",function(e){return k.init(e)}),n.default=k},97:function(e,n){e.exports=TinyMCEActionRegistrar}},[913]);
>>>>>>> rebase
=======
webpackJsonp([1],{

/***/ 124:
/***/ (function(module, exports) {

module.exports = ReactApollo;

/***/ }),

/***/ 181:
/***/ (function(module, exports) {

module.exports = InsertLinkModal;

/***/ }),

/***/ 23:
/***/ (function(module, exports) {

module.exports = i18n;

/***/ }),

/***/ 52:
/***/ (function(module, exports) {

module.exports = Injector;

/***/ }),

/***/ 937:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _i18n = __webpack_require__(23);

var _i18n2 = _interopRequireDefault(_i18n);

var _TinyMCEActionRegistrar = __webpack_require__(98);

var _TinyMCEActionRegistrar2 = _interopRequireDefault(_TinyMCEActionRegistrar);

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _reactDom = __webpack_require__(28);

var _reactDom2 = _interopRequireDefault(_reactDom);

var _reactApollo = __webpack_require__(124);

var _jquery = __webpack_require__(26);

var _jquery2 = _interopRequireDefault(_jquery);

var _InsertLinkModal = __webpack_require__(181);

var _Injector = __webpack_require__(52);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_TinyMCEActionRegistrar2.default.addAction('sslink', {
  text: _i18n2.default._t('Admin.LINKLABEL_EXTERNALURL', 'Link to external URL'),

  onclick: function onclick(editor) {
    return editor.execCommand('sslinkexternal');
  }
});

var plugin = {
  init: function init(editor) {
    editor.addCommand('sslinkexternal', function () {
      var field = window.jQuery('#' + editor.id).entwine('ss');

      field.openLinkExternalDialog();
    });
  }
};

var modalId = 'insert-link__dialog-wrapper--external';
var sectionConfigKey = 'SilverStripe\\Admin\\LeftAndMain';
var formName = 'EditorExternalLink';
var InsertLinkExternalModal = (0, _Injector.provideInjector)((0, _InsertLinkModal.createInsertLinkModal)(sectionConfigKey, formName));

_jquery2.default.entwine('ss', function ($) {
  $('textarea.htmleditor').entwine({
    openLinkExternalDialog: function openLinkExternalDialog() {
      var dialog = $('#' + modalId);

      if (!dialog.length) {
        dialog = $('<div id="' + modalId + '" />');
        $('body').append(dialog);
      }
      dialog.addClass('insert-link__dialog-wrapper');

      dialog.setElement(this);
      dialog.open();
    }
  });

  $('#' + modalId).entwine({
    renderModal: function renderModal(show) {
      var _this = this;

      var store = ss.store;
      var client = ss.apolloClient;
      var handleHide = function handleHide() {
        return _this.close();
      };
      var handleInsert = function handleInsert() {
        return _this.handleInsert.apply(_this, arguments);
      };
      var attrs = this.getOriginalAttributes();

      _reactDom2.default.render(_react2.default.createElement(
        _reactApollo.ApolloProvider,
        { store: store, client: client },
        _react2.default.createElement(InsertLinkExternalModal, {
          show: show,
          onInsert: handleInsert,
          onHide: handleHide,
          title: _i18n2.default._t('Admin.LINK_EXTERNAL', 'Insert external link'),
          bodyClassName: 'modal__dialog',
          className: 'insert-link__dialog-wrapper--external',
          fileAttributes: attrs
        })
      ), this[0]);
    },
    buildAttributes: function buildAttributes(data) {
      var attributes = this._super(data);

      var href = attributes.href;

      if (!href.match(/:\/\//)) {
        href = window.location.protocol + '//' + href;
      }

      href = href.replace(/:\/\/(#.*)$/, '$2');

      if (href.match(/:\/\/$/)) {
        href = '';
      }
      attributes.href = href;

      return attributes;
    }
  });
});

tinymce.PluginManager.add('sslinkexternal', function (editor) {
  return plugin.init(editor);
});

exports.default = plugin;

/***/ }),

/***/ 98:
/***/ (function(module, exports) {

module.exports = TinyMCEActionRegistrar;

/***/ })

},[937]);
//# sourceMappingURL=TinyMCE_sslink-external.js.map
>>>>>>> Merge with reducer work
=======
webpackJsonp([1],{123:function(e,n){e.exports=ReactApollo},179:function(e,n){e.exports=InsertLinkModal},23:function(e,n){e.exports=i18n},52:function(e,n){e.exports=Injector},922:function(e,n,t){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(n,"__esModule",{value:!0});var r=t(23),o=i(r),a=t(97),l=i(a),s=t(0),d=i(s),u=t(27),c=i(u),f=t(123),p=t(26),x=i(p),m=t(179),_=t(52);l.default.addAction("sslink",{text:o.default._t("Admin.LINKLABEL_EXTERNALURL","Link to external URL"),onclick:function(e){return e.execCommand("sslinkexternal")}});var k={init:function(e){e.addCommand("sslinkexternal",function(){window.jQuery("#"+e.id).entwine("ss").openLinkExternalDialog()})}},L="insert-link__dialog-wrapper--external",A=(0,_.provideInjector)((0,m.createInsertLinkModal)("SilverStripe\\Admin\\LeftAndMain","EditorExternalLink"));x.default.entwine("ss",function(e){e("textarea.htmleditor").entwine({openLinkExternalDialog:function(){var n=e("#"+L);n.length||(n=e('<div id="'+L+'" />'),e("body").append(n)),n.addClass("insert-link__dialog-wrapper"),n.setElement(this),n.open()}}),e("#"+L).entwine({renderModal:function(e){var n=this,t=ss.store,i=ss.apolloClient,r=function(){return n.close()},a=function(){return n.handleInsert.apply(n,arguments)},l=this.getOriginalAttributes();c.default.render(d.default.createElement(f.ApolloProvider,{store:t,client:i},d.default.createElement(A,{show:e,onInsert:a,onHide:r,title:o.default._t("Admin.LINK_EXTERNAL","Insert external link"),bodyClassName:"modal__dialog",className:"insert-link__dialog-wrapper--external",fileAttributes:l})),this[0])},buildAttributes:function(e){var n=this._super(e),t=n.href;return t.match(/:\/\//)||(t=window.location.protocol+"//"+t),t=t.replace(/:\/\/(#.*)$/,"$2"),t.match(/:\/\/$/)&&(t=""),n.href=t,n}})}),tinymce.PluginManager.add("sslinkexternal",function(e){return k.init(e)}),n.default=k},97:function(e,n){e.exports=TinyMCEActionRegistrar}},[922]);
>>>>>>> Fix add reserve keyword check to Injector
=======
webpackJsonp([1],{123:function(e,n){e.exports=ReactApollo},179:function(e,n){e.exports=InsertLinkModal},23:function(e,n){e.exports=i18n},52:function(e,n){e.exports=Injector},922:function(e,n,t){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(n,"__esModule",{value:!0});var r=t(23),o=i(r),a=t(97),l=i(a),s=t(0),d=i(s),u=t(27),c=i(u),f=t(123),p=t(26),x=i(p),m=t(179),k=t(52);l.default.addAction("sslink",{text:o.default._t("Admin.LINKLABEL_EXTERNALURL","Link to external URL"),onclick:function(e){return e.execCommand("sslinkexternal")}});var _={init:function(e){e.addCommand("sslinkexternal",function(){window.jQuery("#"+e.id).entwine("ss").openLinkExternalDialog()})}},L="insert-link__dialog-wrapper--external",A=(0,k.provideInjector)((0,m.createInsertLinkModal)("SilverStripe\\Admin\\LeftAndMain","EditorExternalLink"));x.default.entwine("ss",function(e){e("textarea.htmleditor").entwine({openLinkExternalDialog:function(){var n=e("#"+L);n.length||(n=e('<div id="'+L+'" />'),e("body").append(n)),n.addClass("insert-link__dialog-wrapper"),n.setElement(this),n.open()}}),e("#"+L).entwine({renderModal:function(e){var n=this,t=ss.store,i=ss.apolloClient,r=function(){return n.close()},a=function(){return n.handleInsert.apply(n,arguments)},l=this.getOriginalAttributes();c.default.render(d.default.createElement(f.ApolloProvider,{store:t,client:i},d.default.createElement(A,{show:e,onInsert:a,onHide:r,title:o.default._t("Admin.LINK_EXTERNAL","Insert external link"),bodyClassName:"modal__dialog",className:"insert-link__dialog-wrapper--external",fileAttributes:l,identifier:"Admin.InsertLinkExternalModal"})),this[0])},buildAttributes:function(e){var n=this._super(e),t=n.href;return t.match(/:\/\//)||(t=window.location.protocol+"//"+t),t=t.replace(/:\/\/(#.*)$/,"$2"),t.match(/:\/\/$/)&&(t=""),n.href=t,n}})}),tinymce.PluginManager.add("sslinkexternal",function(e){return _.init(e)}),n.default=_},97:function(e,n){e.exports=TinyMCEActionRegistrar}},[922]);
>>>>>>> Fix identifier for forms which were missing
