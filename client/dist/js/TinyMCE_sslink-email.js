<<<<<<< HEAD
<<<<<<< HEAD
webpackJsonp([2],{125:function(e,t){e.exports=ReactApollo},179:function(e,t){e.exports=InsertLinkModal},24:function(e,t){e.exports=i18n},41:function(e,t){e.exports=Injector},929:function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var r=i(24),a=n(r),l=i(99),o=n(l),s=i(0),d=n(s),c=i(25),u=n(c),m=i(125),p=i(28),f=n(p),g=i(179),k=i(41);o.default.addAction("sslink",{text:a.default._t("Admin.LINKLABEL_EMAIL","Link to email address"),onclick:function(e){return e.execCommand("sslinkemail")},priority:51}).addCommandWithUrlTest("sslinkemail",/^mailto:/);var h={init:function(e){e.addCommand("sslinkemail",function(){window.jQuery("#"+e.id).entwine("ss").openLinkEmailDialog()})}},A="insert-link__dialog-wrapper--email",_=(0,k.provideInjector)((0,g.createInsertLinkModal)("SilverStripe\\Admin\\LeftAndMain","EditorEmailLink"));f.default.entwine("ss",function(e){e("textarea.htmleditor").entwine({openLinkEmailDialog:function(){var t=e("#"+A);t.length||(t=e('<div id="'+A+'" />'),e("body").append(t)),t.addClass("insert-link__dialog-wrapper"),t.setElement(this),t.open()}}),e("#"+A).entwine({renderModal:function(e){var t=this,i=ss.store,n=ss.apolloClient,r=function(){return t.close()},l=function(){return t.handleInsert.apply(t,arguments)},o=this.getOriginalAttributes(),s=tinymce.activeEditor.selection,c=s.getContent()||"",p=s.getNode().tagName,f="A"!==p&&""===c.trim();u.default.render(d.default.createElement(m.ApolloProvider,{store:i,client:n},d.default.createElement(_,{show:e,onInsert:l,onHide:r,title:a.default._t("Admin.LINK_EMAIL","Insert email link"),bodyClassName:"modal__dialog",className:"insert-link__dialog-wrapper--email",fileAttributes:o,identifier:"Admin.InsertLinkEmailModal",requireLinkText:f})),this[0])},getOriginalAttributes:function(){var t=this.getElement().getEditor(),i=e(t.getSelectedNode()),n=(i.attr("href")||"").split("?"),r=n[0].replace(/^mailto:/,"").split("?")[0];r.match(/.+@.+\..+/)||(r="");var a=n[1]?n[1].match(/subject=([^&]+)/):"";return{Link:r,Subject:a?a[1]:"",Description:i.attr("title")}},buildAttributes:function(e){var t=this._super(e),i="",n=t.href.replace(/^mailto:/,"").split("?")[0];return n.match(/.+@.+\..+/)||(n=""),n&&(i="mailto:"+n),i&&e.Subject&&(i=i+"?subject="+encodeURIComponent(e.Subject)),t.href=i,delete t.target,t}})}),tinymce.PluginManager.add("sslinkemail",function(e){return h.init(e)}),t.default=h},99:function(e,t){e.exports=TinyMCEActionRegistrar}},[929]);
=======
<<<<<<< HEAD
webpackJsonp([2],{125:function(e,t){e.exports=ReactApollo},179:function(e,t){e.exports=InsertLinkModal},24:function(e,t){e.exports=i18n},41:function(e,t){e.exports=Injector},929:function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var r=i(24),a=n(r),l=i(99),o=n(l),s=i(0),d=n(s),c=i(25),u=n(c),m=i(125),f=i(28),p=n(f),g=i(179),k=i(41);o.default.addAction("sslink",{text:a.default._t("Admin.LINKLABEL_EMAIL","Link to email address"),onclick:function(e){return e.execCommand("sslinkemail")}}).addCommandWithUrlTest("sslinkemail",/^mailto:/);var h={init:function(e){e.addCommand("sslinkemail",function(){window.jQuery("#"+e.id).entwine("ss").openLinkEmailDialog()})}},A="insert-link__dialog-wrapper--email",_=(0,k.provideInjector)((0,g.createInsertLinkModal)("SilverStripe\\Admin\\LeftAndMain","EditorEmailLink"));p.default.entwine("ss",function(e){e("textarea.htmleditor").entwine({openLinkEmailDialog:function(){var t=e("#"+A);t.length||(t=e('<div id="'+A+'" />'),e("body").append(t)),t.addClass("insert-link__dialog-wrapper"),t.setElement(this),t.open()}}),e("#"+A).entwine({renderModal:function(e){var t=this,i=ss.store,n=ss.apolloClient,r=function(){return t.close()},l=function(){return t.handleInsert.apply(t,arguments)},o=this.getOriginalAttributes(),s=tinymce.activeEditor.selection,c=s.getContent()||"",f=s.getNode().tagName,p="A"!==f&&""===c.trim();u.default.render(d.default.createElement(m.ApolloProvider,{store:i,client:n},d.default.createElement(_,{show:e,onInsert:l,onHide:r,title:a.default._t("Admin.LINK_EMAIL","Insert email link"),bodyClassName:"modal__dialog",className:"insert-link__dialog-wrapper--email",fileAttributes:o,identifier:"Admin.InsertLinkEmailModal",requireLinkText:p})),this[0])},getOriginalAttributes:function(){var t=this.getElement().getEditor(),i=e(t.getSelectedNode()),n=(i.attr("href")||"").split("?"),r=n[0].replace(/^mailto:/,"").split("?")[0];r.match(/.+@.+\..+/)||(r="");var a=n[1]?n[1].match(/subject=([^&]+)/):"";return{Link:r,Subject:a?a[1]:"",Description:i.attr("title")}},buildAttributes:function(e){var t=this._super(e),i="",n=t.href.replace(/^mailto:/,"").split("?")[0];return n.match(/.+@.+\..+/)||(n=""),n&&(i="mailto:"+n),i&&e.Subject&&(i=i+"?subject="+encodeURIComponent(e.Subject)),t.href=i,delete t.target,t}})}),tinymce.PluginManager.add("sslinkemail",function(e){return h.init(e)}),t.default=h},99:function(e,t){e.exports=TinyMCEActionRegistrar}},[929]);
=======
webpackJsonp([2],{100:function(e,t){e.exports=TinyMCEActionRegistrar},125:function(e,t){e.exports=ReactApollo},180:function(e,t){e.exports=InsertLinkModal},24:function(e,t){e.exports=i18n},43:function(e,t){e.exports=Injector},934:function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var r=i(24),a=n(r),l=i(100),o=n(l),s=i(0),d=n(s),c=i(25),u=n(c),m=i(125),f=i(28),p=n(f),g=i(180),k=i(43);o.default.addAction("sslink",{text:a.default._t("Admin.LINKLABEL_EMAIL","Link to email address"),onclick:function(e){return e.execCommand("sslinkemail")}}).addCommandWithUrlTest("sslinkemail",/^mailto:/);var h={init:function(e){e.addCommand("sslinkemail",function(){window.jQuery("#"+e.id).entwine("ss").openLinkEmailDialog()})}},A="insert-link__dialog-wrapper--email",_=(0,k.provideInjector)((0,g.createInsertLinkModal)("SilverStripe\\Admin\\LeftAndMain","EditorEmailLink"));p.default.entwine("ss",function(e){e("textarea.htmleditor").entwine({openLinkEmailDialog:function(){var t=e("#"+A);t.length||(t=e('<div id="'+A+'" />'),e("body").append(t)),t.addClass("insert-link__dialog-wrapper"),t.setElement(this),t.open()}}),e("#"+A).entwine({renderModal:function(e){var t=this,i=ss.store,n=ss.apolloClient,r=function(){return t.close()},l=function(){return t.handleInsert.apply(t,arguments)},o=this.getOriginalAttributes(),s=tinymce.activeEditor.selection,c=s.getContent()||"",f=s.getNode().tagName,p="A"!==f&&""===c.trim();u.default.render(d.default.createElement(m.ApolloProvider,{store:i,client:n},d.default.createElement(_,{show:e,onInsert:l,onHide:r,title:a.default._t("Admin.LINK_EMAIL","Insert email link"),bodyClassName:"modal__dialog",className:"insert-link__dialog-wrapper--email",fileAttributes:o,identifier:"Admin.InsertLinkEmailModal",requireLinkText:p})),this[0])},getOriginalAttributes:function(){var t=this.getElement().getEditor(),i=e(t.getSelectedNode()),n=(i.attr("href")||"").split("?"),r=n[0].replace(/^mailto:/,"").split("?")[0];r.match(/.+@.+\..+/)||(r="");var a=n[1]?n[1].match(/subject=([^&]+)/):"";return{Link:r,Subject:a?a[1]:"",Description:i.attr("title")}},buildAttributes:function(e){var t=this._super(e),i="",n=t.href.replace(/^mailto:/,"").split("?")[0];return n.match(/.+@.+\..+/)||(n=""),n&&(i="mailto:"+n),i&&e.Subject&&(i=i+"?subject="+encodeURIComponent(e.Subject)),t.href=i,delete t.target,t}})}),tinymce.PluginManager.add("sslinkemail",function(e){return h.init(e)}),t.default=h}},[934]);
>>>>>>> Extract utility methods into separate file and nd expose as exports. New findTreeByPath prop
>>>>>>> Extract utility methods into separate file and nd expose as exports. New findTreeByPath prop
=======
webpackJsonp([2],{

/***/ 100:
/***/ (function(module, exports) {

module.exports = TinyMCEActionRegistrar;

/***/ }),

/***/ 126:
/***/ (function(module, exports) {

module.exports = ReactApollo;

/***/ }),

/***/ 181:
/***/ (function(module, exports) {

module.exports = InsertLinkModal;

/***/ }),

/***/ 24:
/***/ (function(module, exports) {

module.exports = i18n;

/***/ }),

/***/ 41:
/***/ (function(module, exports) {

module.exports = Injector;

/***/ }),

/***/ 945:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _i18n = __webpack_require__(24);

var _i18n2 = _interopRequireDefault(_i18n);

var _TinyMCEActionRegistrar = __webpack_require__(100);

var _TinyMCEActionRegistrar2 = _interopRequireDefault(_TinyMCEActionRegistrar);

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _reactDom = __webpack_require__(26);

var _reactDom2 = _interopRequireDefault(_reactDom);

var _reactApollo = __webpack_require__(126);

var _jquery = __webpack_require__(28);

var _jquery2 = _interopRequireDefault(_jquery);

var _InsertLinkModal = __webpack_require__(181);

var _Injector = __webpack_require__(41);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var commandName = 'sslinkemail';

_TinyMCEActionRegistrar2.default.addAction('sslink', {
  text: _i18n2.default._t('Admin.LINKLABEL_EMAIL', 'Link to email address'),

  onclick: function onclick(editor) {
    return editor.execCommand(commandName);
  }
}).addCommandWithUrlTest(commandName, /^mailto:/);

var plugin = {
  init: function init(editor) {
    editor.addCommand(commandName, function () {
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
      var selection = tinymce.activeEditor.selection;
      var selectionContent = selection.getContent() || '';
      var tagName = selection.getNode().tagName;
      var requireLinkText = tagName !== 'A' && selectionContent.trim() === '';

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
          identifier: 'Admin.InsertLinkEmailModal',
          requireLinkText: requireLinkText
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

tinymce.PluginManager.add(commandName, function (editor) {
  return plugin.init(editor);
});
exports.default = plugin;

/***/ })

},[945]);
//# sourceMappingURL=TinyMCE_sslink-email.js.map
>>>>>>> i18n
