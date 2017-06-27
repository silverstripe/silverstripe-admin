<<<<<<< HEAD
webpackJsonp([2],{123:function(e,t){e.exports=ReactApollo},180:function(e,t){e.exports=InsertLinkModal},23:function(e,t){e.exports=i18n},45:function(e,t){e.exports=Injector},930:function(e,t,n){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var r=n(23),a=i(r),l=n(98),o=i(l),s=n(0),d=i(s),u=n(26),c=i(u),m=n(123),f=n(27),p=i(f),g=n(180),k=n(45);o.default.addAction("sslink",{text:a.default._t("Admin.LINKLABEL_EMAIL","Link to email address"),onclick:function(e){return e.execCommand("sslinkemail")}});var _={init:function(e){e.addCommand("sslinkemail",function(){window.jQuery("#"+e.id).entwine("ss").openLinkEmailDialog()})}},h="insert-link__dialog-wrapper--email",A=(0,k.provideInjector)((0,g.createInsertLinkModal)("SilverStripe\\Admin\\LeftAndMain","EditorEmailLink"));p.default.entwine("ss",function(e){e("textarea.htmleditor").entwine({openLinkEmailDialog:function(){var t=e("#"+h);t.length||(t=e('<div id="'+h+'" />'),e("body").append(t)),t.addClass("insert-link__dialog-wrapper"),t.setElement(this),t.open()}}),e("#"+h).entwine({renderModal:function(e){var t=this,n=ss.store,i=ss.apolloClient,r=function(){return t.close()},l=function(){return t.handleInsert.apply(t,arguments)},o=this.getOriginalAttributes();c.default.render(d.default.createElement(m.ApolloProvider,{store:n,client:i},d.default.createElement(A,{show:e,onInsert:l,onHide:r,title:a.default._t("Admin.LINK_EMAIL","Insert email link"),bodyClassName:"modal__dialog",className:"insert-link__dialog-wrapper--email",fileAttributes:o,identifier:"Admin.InsertLinkEmailModal"})),this[0])},getOriginalAttributes:function(){var t=this.getElement().getEditor(),n=e(t.getSelectedNode()),i=(n.attr("href")||"").split("?"),r=i[0].replace(/^mailto:/,"").split("?")[0];r.match(/.+@.+\..+/)||(r="");var a=i[1]?i[1].match(/subject=([^&]+)/):"";return{Link:r,Subject:a?a[1]:"",Description:n.attr("title")}},buildAttributes:function(e){var t=this._super(e),n="",i=t.href.replace(/^mailto:/,"").split("?")[0];return i.match(/.+@.+\..+/)||(i=""),i&&(n="mailto:"+i),n&&e.Subject&&(n=n+"?subject="+encodeURIComponent(e.Subject)),t.href=n,delete t.target,t}})}),tinymce.PluginManager.add("sslinkemail",function(e){return _.init(e)}),t.default=_},98:function(e,t){e.exports=TinyMCEActionRegistrar}},[930]);
=======
webpackJsonp([2],{

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

/***/ 944:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _i18n = __webpack_require__(23);

var _i18n2 = _interopRequireDefault(_i18n);

var _TinyMCEActionRegistrar = __webpack_require__(99);

var _TinyMCEActionRegistrar2 = _interopRequireDefault(_TinyMCEActionRegistrar);

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _reactDom = __webpack_require__(27);

var _reactDom2 = _interopRequireDefault(_reactDom);

var _reactApollo = __webpack_require__(124);

var _jquery = __webpack_require__(26);

var _jquery2 = _interopRequireDefault(_jquery);

var _InsertLinkModal = __webpack_require__(181);

var _Injector = __webpack_require__(52);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_TinyMCEActionRegistrar2.default.addAction('sslink', {
  text: _i18n2.default._t('Admin.LINKLABEL_EMAIL', 'Link to email address'),

  onclick: function onclick(editor) {
    return editor.execCommand('sslinkemail');
  }
});

var plugin = {
  init: function init(editor) {
    editor.addCommand('sslinkemail', function () {
      var field = window.jQuery('#' + editor.id).entwine('ss');

      field.openLinkEmailDialog();
    });
  }
};

var modalId = 'insert-link__dialog-wrapper--email';
var sectionConfigKey = 'SilverStripe\\Admin\\LeftAndMain';
var formName = 'EditorEmailLink';
var InsertLinkEmailModal = (0, _Injector.provideInjector)((0, _InsertLinkModal.createInsertLinkModal)(sectionConfigKey, formName));

_jquery2.default.entwine('ss', function ($) {
  $('textarea.htmleditor').entwine({
    openLinkEmailDialog: function openLinkEmailDialog() {
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
        _react2.default.createElement(InsertLinkEmailModal, {
          show: show,
          onInsert: handleInsert,
          onHide: handleHide,
          title: _i18n2.default._t('Admin.LINK_EMAIL', 'Insert email link'),
          bodyClassName: 'modal__dialog',
          className: 'insert-link__dialog-wrapper--email',
          fileAttributes: attrs,
          identifier: 'Admin.InsertLinkEmailModal'
        })
      ), this[0]);
    },
    getOriginalAttributes: function getOriginalAttributes() {
      var editor = this.getElement().getEditor();
      var node = $(editor.getSelectedNode());

      var hrefParts = (node.attr('href') || '').split('?');

      var email = hrefParts[0].replace(/^mailto:/, '').split('?')[0];

      if (!email.match(/.+@.+\..+/)) {
        email = '';
      }

      var subjectMatch = hrefParts[1] ? hrefParts[1].match(/subject=([^&]+)/) : '';
      var subject = subjectMatch ? subjectMatch[1] : '';

      return {
        Link: email,
        Subject: subject,
        Description: node.attr('title')
      };
    },
    buildAttributes: function buildAttributes(data) {
      var attributes = this._super(data);

      var href = '';

      var email = attributes.href.replace(/^mailto:/, '').split('?')[0];

      if (!email.match(/.+@.+\..+/)) {
        email = '';
      }

      if (email) {
        href = 'mailto:' + email;
      }
      if (href && data.Subject) {
        href = href + '?subject=' + encodeURIComponent(data.Subject);
      }
      attributes.href = href;

      delete attributes.target;

      return attributes;
    }
  });
});

tinymce.PluginManager.add('sslinkemail', function (editor) {
  return plugin.init(editor);
});
exports.default = plugin;

/***/ }),

/***/ 99:
/***/ (function(module, exports) {

module.exports = TinyMCEActionRegistrar;

/***/ })

},[944]);
//# sourceMappingURL=TinyMCE_sslink-email.js.map
>>>>>>> getFactory moved to containers
