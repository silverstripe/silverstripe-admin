webpackJsonp([2],{

/***/ 100:
/***/ (function(module, exports) {

module.exports = TinyMCEActionRegistrar;

/***/ }),

/***/ 126:
/***/ (function(module, exports) {

module.exports = ReactApollo;

/***/ }),

/***/ 180:
/***/ (function(module, exports) {

module.exports = InsertLinkModal;

/***/ }),

/***/ 24:
/***/ (function(module, exports) {

module.exports = i18n;

/***/ }),

/***/ 45:
/***/ (function(module, exports) {

module.exports = Injector;

/***/ }),

/***/ 948:
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

var _jquery = __webpack_require__(27);

var _jquery2 = _interopRequireDefault(_jquery);

var _InsertLinkModal = __webpack_require__(180);

var _Injector = __webpack_require__(45);

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

},[948]);
//# sourceMappingURL=TinyMCE_sslink-email.js.map