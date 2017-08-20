<<<<<<< HEAD
<<<<<<< HEAD
webpackJsonp([1],{125:function(e,t){e.exports=ReactApollo},179:function(e,t){e.exports=InsertLinkModal},24:function(e,t){e.exports=i18n},41:function(e,t){e.exports=Injector},930:function(e,t,n){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var r=n(24),o=i(r),a=n(99),l=i(a),s=n(0),d=i(s),u=n(25),c=i(u),f=n(125),p=n(28),m=i(p),x=n(179),k=n(41);l.default.addAction("sslink",{text:o.default._t("Admin.LINKLABEL_EXTERNALURL","Link to external URL"),onclick:function(e){return e.execCommand("sslinkexternal")},priority:52});var L={init:function(e){e.addCommand("sslinkexternal",function(){window.jQuery("#"+e.id).entwine("ss").openLinkExternalDialog()})}},_="insert-link__dialog-wrapper--external",A=(0,k.provideInjector)((0,x.createInsertLinkModal)("SilverStripe\\Admin\\LeftAndMain","EditorExternalLink"));m.default.entwine("ss",function(e){e("textarea.htmleditor").entwine({openLinkExternalDialog:function(){var t=e("#"+_);t.length||(t=e('<div id="'+_+'" />'),e("body").append(t)),t.addClass("insert-link__dialog-wrapper"),t.setElement(this),t.open()}}),e("#"+_).entwine({renderModal:function(e){var t=this,n=ss.store,i=ss.apolloClient,r=function(){return t.close()},a=function(){return t.handleInsert.apply(t,arguments)},l=this.getOriginalAttributes(),s=tinymce.activeEditor.selection,u=s.getContent()||"",p=s.getNode().tagName,m="A"!==p&&""===u.trim();c.default.render(d.default.createElement(f.ApolloProvider,{store:n,client:i},d.default.createElement(A,{show:e,onInsert:a,onHide:r,title:o.default._t("Admin.LINK_EXTERNAL","Insert external link"),bodyClassName:"modal__dialog",className:"insert-link__dialog-wrapper--external",fileAttributes:l,identifier:"Admin.InsertLinkExternalModal",requireLinkText:m})),this[0])},buildAttributes:function(e){var t=this._super(e),n=t.href;return n.match(/:\/\//)||(n=window.location.protocol+"//"+n),n=n.replace(/:\/\/(#.*)$/,"$2"),n.match(/:\/\/$/)&&(n=""),t.href=n,t}})}),tinymce.PluginManager.add("sslinkexternal",function(e){return L.init(e)}),t.default=L},99:function(e,t){e.exports=TinyMCEActionRegistrar}},[930]);
=======
<<<<<<< HEAD
webpackJsonp([1],{125:function(e,t){e.exports=ReactApollo},179:function(e,t){e.exports=InsertLinkModal},24:function(e,t){e.exports=i18n},41:function(e,t){e.exports=Injector},930:function(e,t,n){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var r=n(24),o=i(r),a=n(99),l=i(a),s=n(0),d=i(s),u=n(25),c=i(u),f=n(125),p=n(28),m=i(p),x=n(179),k=n(41);l.default.addAction("sslink",{text:o.default._t("Admin.LINKLABEL_EXTERNALURL","Link to external URL"),onclick:function(e){return e.execCommand("sslinkexternal")}});var L={init:function(e){e.addCommand("sslinkexternal",function(){window.jQuery("#"+e.id).entwine("ss").openLinkExternalDialog()})}},_="insert-link__dialog-wrapper--external",A=(0,k.provideInjector)((0,x.createInsertLinkModal)("SilverStripe\\Admin\\LeftAndMain","EditorExternalLink"));m.default.entwine("ss",function(e){e("textarea.htmleditor").entwine({openLinkExternalDialog:function(){var t=e("#"+_);t.length||(t=e('<div id="'+_+'" />'),e("body").append(t)),t.addClass("insert-link__dialog-wrapper"),t.setElement(this),t.open()}}),e("#"+_).entwine({renderModal:function(e){var t=this,n=ss.store,i=ss.apolloClient,r=function(){return t.close()},a=function(){return t.handleInsert.apply(t,arguments)},l=this.getOriginalAttributes(),s=tinymce.activeEditor.selection,u=s.getContent()||"",p=s.getNode().tagName,m="A"!==p&&""===u.trim();c.default.render(d.default.createElement(f.ApolloProvider,{store:n,client:i},d.default.createElement(A,{show:e,onInsert:a,onHide:r,title:o.default._t("Admin.LINK_EXTERNAL","Insert external link"),bodyClassName:"modal__dialog",className:"insert-link__dialog-wrapper--external",fileAttributes:l,identifier:"Admin.InsertLinkExternalModal",requireLinkText:m})),this[0])},buildAttributes:function(e){var t=this._super(e),n=t.href;return n.match(/:\/\//)||(n=window.location.protocol+"//"+n),n=n.replace(/:\/\/(#.*)$/,"$2"),n.match(/:\/\/$/)&&(n=""),t.href=n,t}})}),tinymce.PluginManager.add("sslinkexternal",function(e){return L.init(e)}),t.default=L},99:function(e,t){e.exports=TinyMCEActionRegistrar}},[930]);
=======
webpackJsonp([1],{100:function(e,t){e.exports=TinyMCEActionRegistrar},125:function(e,t){e.exports=ReactApollo},180:function(e,t){e.exports=InsertLinkModal},24:function(e,t){e.exports=i18n},43:function(e,t){e.exports=Injector},935:function(e,t,n){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var r=n(24),o=i(r),a=n(100),l=i(a),s=n(0),d=i(s),u=n(25),c=i(u),f=n(125),p=n(28),m=i(p),x=n(180),k=n(43);l.default.addAction("sslink",{text:o.default._t("Admin.LINKLABEL_EXTERNALURL","Link to external URL"),onclick:function(e){return e.execCommand("sslinkexternal")}});var L={init:function(e){e.addCommand("sslinkexternal",function(){window.jQuery("#"+e.id).entwine("ss").openLinkExternalDialog()})}},_="insert-link__dialog-wrapper--external",A=(0,k.provideInjector)((0,x.createInsertLinkModal)("SilverStripe\\Admin\\LeftAndMain","EditorExternalLink"));m.default.entwine("ss",function(e){e("textarea.htmleditor").entwine({openLinkExternalDialog:function(){var t=e("#"+_);t.length||(t=e('<div id="'+_+'" />'),e("body").append(t)),t.addClass("insert-link__dialog-wrapper"),t.setElement(this),t.open()}}),e("#"+_).entwine({renderModal:function(e){var t=this,n=ss.store,i=ss.apolloClient,r=function(){return t.close()},a=function(){return t.handleInsert.apply(t,arguments)},l=this.getOriginalAttributes(),s=tinymce.activeEditor.selection,u=s.getContent()||"",p=s.getNode().tagName,m="A"!==p&&""===u.trim();c.default.render(d.default.createElement(f.ApolloProvider,{store:n,client:i},d.default.createElement(A,{show:e,onInsert:a,onHide:r,title:o.default._t("Admin.LINK_EXTERNAL","Insert external link"),bodyClassName:"modal__dialog",className:"insert-link__dialog-wrapper--external",fileAttributes:l,identifier:"Admin.InsertLinkExternalModal",requireLinkText:m})),this[0])},buildAttributes:function(e){var t=this._super(e),n=t.href;return n.match(/:\/\//)||(n=window.location.protocol+"//"+n),n=n.replace(/:\/\/(#.*)$/,"$2"),n.match(/:\/\/$/)&&(n=""),t.href=n,t}})}),tinymce.PluginManager.add("sslinkexternal",function(e){return L.init(e)}),t.default=L}},[935]);
>>>>>>> Extract utility methods into separate file and nd expose as exports. New findTreeByPath prop
>>>>>>> Extract utility methods into separate file and nd expose as exports. New findTreeByPath prop
=======
webpackJsonp([1],{

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

/***/ 946:
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
      var selection = tinymce.activeEditor.selection;
      var selectionContent = selection.getContent() || '';
      var tagName = selection.getNode().tagName;
      var requireLinkText = tagName !== 'A' && selectionContent.trim() === '';

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
          fileAttributes: attrs,
          identifier: 'Admin.InsertLinkExternalModal',
          requireLinkText: requireLinkText
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

/***/ })

},[946]);
//# sourceMappingURL=TinyMCE_sslink-external.js.map
>>>>>>> i18n
