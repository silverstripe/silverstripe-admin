<<<<<<< HEAD
webpackJsonp([1],{"./client/src/legacy/TinyMCE_sslink-external.js":function(e,n,t){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(n,"__esModule",{value:!0});var r=t(3),a=i(r),l=t(14),o=i(l),s=t(0),d=i(s),c=t(8),u=i(c),f=t(2),p=i(f),m=t(20),x=t(7);o.default.addAction("sslink",{text:a.default._t("Admin.LINKLABEL_EXTERNALURL","Link to external URL"),onclick:function(e){return e.execCommand("sslinkexternal")},priority:52});var k={init:function(e){e.addCommand("sslinkexternal",function(){window.jQuery("#"+e.id).entwine("ss").openLinkExternalDialog()})}},_="insert-link__dialog-wrapper--external",g=(0,x.loadComponent)((0,m.createInsertLinkModal)("SilverStripe\\Admin\\LeftAndMain","EditorExternalLink"));p.default.entwine("ss",function(e){e("textarea.htmleditor").entwine({openLinkExternalDialog:function(){var n=e("#"+_);n.length||(n=e('<div id="'+_+'" />'),e("body").append(n)),n.addClass("insert-link__dialog-wrapper"),n.setElement(this),n.open()}}),e("#"+_).entwine({renderModal:function(e){var n=this,t=function(){return n.close()},i=function(){return n.handleInsert.apply(n,arguments)},r=this.getOriginalAttributes(),l=tinymce.activeEditor.selection,o=l.getContent()||"",s=l.getNode().tagName,c="A"!==s&&""===o.trim();u.default.render(d.default.createElement(g,{isOpen:e,onInsert:i,onClosed:t,title:a.default._t("Admin.LINK_EXTERNAL","Insert external link"),bodyClassName:"modal__dialog",className:"insert-link__dialog-wrapper--external",fileAttributes:r,identifier:"Admin.InsertLinkExternalModal",requireLinkText:c}),this[0])},buildAttributes:function(e){var n=this._super(e),t=n.href;return t.match(/:\/\//)||(t=window.location.protocol+"//"+t),t=t.replace(/.*:\/\/(#.*)$/,"$1"),t.match(/:\/\/$/)&&(t=""),n.href=t,n}})}),tinymce.PluginManager.add("sslinkexternal",function(e){return k.init(e)}),n.default=k},14:function(e,n){e.exports=TinyMCEActionRegistrar},20:function(e,n){e.exports=InsertLinkModal},3:function(e,n){e.exports=i18n},7:function(e,n){e.exports=Injector}},["./client/src/legacy/TinyMCE_sslink-external.js"]);
=======
webpackJsonp([1],{

/***/ "./client/src/legacy/TinyMCE_sslink-external.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _i18n = __webpack_require__(2);

var _i18n2 = _interopRequireDefault(_i18n);

var _TinyMCEActionRegistrar = __webpack_require__(12);

var _TinyMCEActionRegistrar2 = _interopRequireDefault(_TinyMCEActionRegistrar);

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _reactDom = __webpack_require__(7);

var _reactDom2 = _interopRequireDefault(_reactDom);

var _jquery = __webpack_require__(1);

var _jquery2 = _interopRequireDefault(_jquery);

var _InsertLinkModal = __webpack_require__(17);

var _Injector = __webpack_require__(5);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_TinyMCEActionRegistrar2.default.addAction('sslink', {
  text: _i18n2.default._t('Admin.LINKLABEL_EXTERNALURL', 'Link to external URL'),

  onclick: function onclick(editor) {
    return editor.execCommand('sslinkexternal');
  },
  priority: 52
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
var InsertLinkExternalModal = (0, _Injector.loadComponent)((0, _InsertLinkModal.createInsertLinkModal)(sectionConfigKey, formName));

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
    renderModal: function renderModal(isOpen) {
      var _this = this;

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

      _reactDom2.default.render(_react2.default.createElement(InsertLinkExternalModal, {
        isOpen: isOpen,
        onInsert: handleInsert,
        onClosed: handleHide,
        title: _i18n2.default._t('Admin.LINK_EXTERNAL', 'Insert external link'),
        bodyClassName: 'modal__dialog',
        className: 'insert-link__dialog-wrapper--external',
        fileAttributes: attrs,
        identifier: 'Admin.InsertLinkExternalModal',
        requireLinkText: requireLinkText
      }), this[0]);
    },
    buildAttributes: function buildAttributes(data) {
      var attributes = this._super(data);

      var href = attributes.href;

      if (!href.match(/:\/\//)) {
        href = window.location.protocol + '//' + href;
      }

      href = href.replace(/.*:\/\/(#.*)$/, '$1');

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

/***/ 12:
/***/ (function(module, exports) {

module.exports = TinyMCEActionRegistrar;

/***/ }),

/***/ 17:
/***/ (function(module, exports) {

module.exports = InsertLinkModal;

/***/ }),

/***/ 2:
/***/ (function(module, exports) {

module.exports = i18n;

/***/ }),

/***/ 5:
/***/ (function(module, exports) {

module.exports = Injector;

/***/ })

},["./client/src/legacy/TinyMCE_sslink-external.js"]);
//# sourceMappingURL=TinyMCE_sslink-external.js.map
>>>>>>> New api for adding fields, args
