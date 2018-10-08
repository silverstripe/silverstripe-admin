<<<<<<< HEAD
<<<<<<< HEAD
webpackJsonp([2],{"./client/src/legacy/TinyMCE_sslink-email.js":function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var a=i(3),r=n(a),l=i(14),o=n(l),s=i(0),d=n(s),c=i(8),u=n(c),m=i(2),p=n(m),f=i(20),g=i(7);o.default.addAction("sslink",{text:r.default._t("Admin.LINKLABEL_EMAIL","Link to email address"),onclick:function(e){return e.execCommand("sslinkemail")},priority:51}).addCommandWithUrlTest("sslinkemail",/^mailto:/);var k={init:function(e){e.addCommand("sslinkemail",function(){window.jQuery("#"+e.id).entwine("ss").openLinkEmailDialog()})}},_="insert-link__dialog-wrapper--email",h=(0,g.loadComponent)((0,f.createInsertLinkModal)("SilverStripe\\Admin\\LeftAndMain","EditorEmailLink"));p.default.entwine("ss",function(e){e("textarea.htmleditor").entwine({openLinkEmailDialog:function(){var t=e("#"+_);t.length||(t=e('<div id="'+_+'" />'),e("body").append(t)),t.addClass("insert-link__dialog-wrapper"),t.setElement(this),t.open()}}),e("#"+_).entwine({renderModal:function(e){var t=this,i=function(){return t.close()},n=function(){return t.handleInsert.apply(t,arguments)},a=this.getOriginalAttributes(),l=tinymce.activeEditor.selection,o=l.getContent()||"",s=l.getNode().tagName,c="A"!==s&&""===o.trim();u.default.render(d.default.createElement(h,{isOpen:e,onInsert:n,onClosed:i,title:r.default._t("Admin.LINK_EMAIL","Insert email link"),bodyClassName:"modal__dialog",className:"insert-link__dialog-wrapper--email",fileAttributes:a,identifier:"Admin.InsertLinkEmailModal",requireLinkText:c}),this[0])},getOriginalAttributes:function(){var t=this.getElement().getEditor(),i=e(t.getSelectedNode()),n=(i.attr("href")||"").split("?"),a=n[0].replace(/^mailto:/,"").split("?")[0];a.match(/.+@.+\..+/)||(a="");var r=n[1]?n[1].match(/subject=([^&]+)/):"";return{Link:a,Subject:r?decodeURIComponent(r[1]):"",Description:i.attr("title")}},buildAttributes:function(e){var t=this._super(e),i="",n=t.href.replace(/^mailto:/,"").split("?")[0];return n.match(/.+@.+\..+/)||(n=""),n&&(i="mailto:"+n),i&&e.Subject&&(i=i+"?subject="+encodeURIComponent(e.Subject)),t.href=i,delete t.target,t}})}),tinymce.PluginManager.add("sslinkemail",function(e){return k.init(e)}),t.default=k},14:function(e,t){e.exports=TinyMCEActionRegistrar},20:function(e,t){e.exports=InsertLinkModal},3:function(e,t){e.exports=i18n},7:function(e,t){e.exports=Injector}},["./client/src/legacy/TinyMCE_sslink-email.js"]);
=======
webpackJsonp([2],{

/***/ "./client/src/legacy/TinyMCE_sslink-email.js":
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

      _reactDom2.default.render(_react2.default.createElement(InsertLinkEmailModal, {
        isOpen: isOpen,
        onInsert: handleInsert,
        onClosed: handleHide,
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

},["./client/src/legacy/TinyMCE_sslink-email.js"]);
//# sourceMappingURL=TinyMCE_sslink-email.js.map
>>>>>>> New api for adding fields, args
=======
webpackJsonp([2],{"./client/src/legacy/TinyMCE_sslink-email.js":function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var a=i(2),r=n(a),l=i(12),o=n(l),s=i(0),d=n(s),c=i(7),u=n(c),m=i(1),p=n(m),f=i(17),g=i(5);o.default.addAction("sslink",{text:r.default._t("Admin.LINKLABEL_EMAIL","Link to email address"),onclick:function(e){return e.execCommand("sslinkemail")},priority:51}).addCommandWithUrlTest("sslinkemail",/^mailto:/);var k={init:function(e){e.addCommand("sslinkemail",function(){window.jQuery("#"+e.id).entwine("ss").openLinkEmailDialog()})}},_="insert-link__dialog-wrapper--email",h=(0,g.loadComponent)((0,f.createInsertLinkModal)("SilverStripe\\Admin\\LeftAndMain","EditorEmailLink"));p.default.entwine("ss",function(e){e("textarea.htmleditor").entwine({openLinkEmailDialog:function(){var t=e("#"+_);t.length||(t=e('<div id="'+_+'" />'),e("body").append(t)),t.addClass("insert-link__dialog-wrapper"),t.setElement(this),t.open()}}),e("#"+_).entwine({renderModal:function(e){var t=this,i=function(){return t.close()},n=function(){return t.handleInsert.apply(t,arguments)},a=this.getOriginalAttributes(),l=tinymce.activeEditor.selection,o=l.getContent()||"",s=l.getNode().tagName,c="A"!==s&&""===o.trim();u.default.render(d.default.createElement(h,{isOpen:e,onInsert:n,onClosed:i,title:r.default._t("Admin.LINK_EMAIL","Insert email link"),bodyClassName:"modal__dialog",className:"insert-link__dialog-wrapper--email",fileAttributes:a,identifier:"Admin.InsertLinkEmailModal",requireLinkText:c}),this[0])},getOriginalAttributes:function(){var t=this.getElement().getEditor(),i=e(t.getSelectedNode()),n=(i.attr("href")||"").split("?"),a=n[0].replace(/^mailto:/,"").split("?")[0];a.match(/.+@.+\..+/)||(a="");var r=n[1]?n[1].match(/subject=([^&]+)/):"";return{Link:a,Subject:r?decodeURIComponent(r[1]):"",Description:i.attr("title")}},buildAttributes:function(e){var t=this._super(e),i="",n=t.href.replace(/^mailto:/,"").split("?")[0];return n.match(/.+@.+\..+/)||(n=""),n&&(i="mailto:"+n),i&&e.Subject&&(i=i+"?subject="+encodeURIComponent(e.Subject)),t.href=i,delete t.target,t}})}),tinymce.PluginManager.add("sslinkemail",function(e){return k.init(e)}),t.default=k},12:function(e,t){e.exports=TinyMCEActionRegistrar},17:function(e,t){e.exports=InsertLinkModal},2:function(e,t){e.exports=i18n},5:function(e,t){e.exports=Injector}},["./client/src/legacy/TinyMCE_sslink-email.js"]);
>>>>>>> Build
