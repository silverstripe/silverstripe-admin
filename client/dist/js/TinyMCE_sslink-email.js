<<<<<<< HEAD
webpackJsonp([2],{178:function(e,t){e.exports=InsertLinkModal},22:function(e,t){e.exports=i18n},38:function(e,t){e.exports=Injector},959:function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var a=i(22),r=n(a),l=i(97),o=n(l),d=i(0),s=n(d),u=i(26),c=n(u),m=i(12),f=n(m),p=i(178),g=i(38);o.default.addAction("sslink",{text:r.default._t("Admin.LINKLABEL_EMAIL","Link to email address"),onclick:function(e){return e.execCommand("sslinkemail")},priority:51}).addCommandWithUrlTest("sslinkemail",/^mailto:/);var k={init:function(e){e.addCommand("sslinkemail",function(){window.jQuery("#"+e.id).entwine("ss").openLinkEmailDialog()})}},h="insert-link__dialog-wrapper--email",_=(0,g.loadComponent)((0,p.createInsertLinkModal)("SilverStripe\\Admin\\LeftAndMain","EditorEmailLink"));f.default.entwine("ss",function(e){e("textarea.htmleditor").entwine({openLinkEmailDialog:function(){var t=e("#"+h);t.length||(t=e('<div id="'+h+'" />'),e("body").append(t)),t.addClass("insert-link__dialog-wrapper"),t.setElement(this),t.open()}}),e("#"+h).entwine({renderModal:function(e){var t=this,i=function(){return t.close()},n=function(){return t.handleInsert.apply(t,arguments)},a=this.getOriginalAttributes(),l=tinymce.activeEditor.selection,o=l.getContent()||"",d=l.getNode().tagName,u="A"!==d&&""===o.trim();c.default.render(s.default.createElement(_,{show:e,onInsert:n,onHide:i,title:r.default._t("Admin.LINK_EMAIL","Insert email link"),bodyClassName:"modal__dialog",className:"insert-link__dialog-wrapper--email",fileAttributes:a,identifier:"Admin.InsertLinkEmailModal",requireLinkText:u}),this[0])},getOriginalAttributes:function(){var t=this.getElement().getEditor(),i=e(t.getSelectedNode()),n=(i.attr("href")||"").split("?"),a=n[0].replace(/^mailto:/,"").split("?")[0];a.match(/.+@.+\..+/)||(a="");var r=n[1]?n[1].match(/subject=([^&]+)/):"";return{Link:a,Subject:r?decodeURIComponent(r[1]):"",Description:i.attr("title")}},buildAttributes:function(e){var t=this._super(e),i="",n=t.href.replace(/^mailto:/,"").split("?")[0];return n.match(/.+@.+\..+/)||(n=""),n&&(i="mailto:"+n),i&&e.Subject&&(i=i+"?subject="+encodeURIComponent(e.Subject)),t.href=i,delete t.target,t}})}),tinymce.PluginManager.add("sslinkemail",function(e){return k.init(e)}),t.default=k},97:function(e,t){e.exports=TinyMCEActionRegistrar}},[959]);
=======
webpackJsonp([2],{

/***/ 180:
/***/ (function(module, exports) {

module.exports = InsertLinkModal;

/***/ }),

/***/ 22:
/***/ (function(module, exports) {

module.exports = i18n;

/***/ }),

/***/ 39:
/***/ (function(module, exports) {

module.exports = Injector;

/***/ }),

/***/ 964:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _i18n = __webpack_require__(22);

var _i18n2 = _interopRequireDefault(_i18n);

var _TinyMCEActionRegistrar = __webpack_require__(98);

var _TinyMCEActionRegistrar2 = _interopRequireDefault(_TinyMCEActionRegistrar);

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _reactDom = __webpack_require__(26);

var _reactDom2 = _interopRequireDefault(_reactDom);

var _jquery = __webpack_require__(11);

var _jquery2 = _interopRequireDefault(_jquery);

var _InsertLinkModal = __webpack_require__(180);

var _Injector = __webpack_require__(39);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var commandName = 'sslinkemail';

_TinyMCEActionRegistrar2.default.addAction('sslink', {
  text: _i18n2.default._t('Admin.LINKLABEL_EMAIL', 'Link to email address'),

  onclick: function onclick(editor) {
    return editor.execCommand(commandName);
  },
  priority: 51
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
var InsertLinkEmailModal = (0, _Injector.loadComponent)((0, _InsertLinkModal.createInsertLinkModal)(sectionConfigKey, formName));

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

      _reactDom2.default.render(_react2.default.createElement(InsertLinkEmailModal, {
        show: show,
        onInsert: handleInsert,
        onHide: handleHide,
        title: _i18n2.default._t('Admin.LINK_EMAIL', 'Insert email link'),
        bodyClassName: 'modal__dialog',
        className: 'insert-link__dialog-wrapper--email',
        fileAttributes: attrs,
        identifier: 'Admin.InsertLinkEmailModal',
        requireLinkText: requireLinkText
      }), this[0]);
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
      var subject = subjectMatch ? decodeURIComponent(subjectMatch[1]) : '';

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

/***/ }),

/***/ 98:
/***/ (function(module, exports) {

module.exports = TinyMCEActionRegistrar;

/***/ })

},[964]);
//# sourceMappingURL=TinyMCE_sslink-email.js.map
>>>>>>> build
