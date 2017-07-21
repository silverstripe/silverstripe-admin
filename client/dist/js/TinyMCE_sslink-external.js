webpackJsonp([1],{

/***/ 100:
/***/ (function(module, exports) {

module.exports = TinyMCEActionRegistrar;

/***/ }),

/***/ 125:
/***/ (function(module, exports) {

module.exports = ReactApollo;

/***/ }),

/***/ 182:
/***/ (function(module, exports) {

module.exports = InsertLinkModal;

/***/ }),

/***/ 23:
/***/ (function(module, exports) {

module.exports = i18n;

/***/ }),

/***/ 45:
/***/ (function(module, exports) {

module.exports = Injector;

/***/ }),

/***/ 854:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _i18n = __webpack_require__(23);

var _i18n2 = _interopRequireDefault(_i18n);

var _TinyMCEActionRegistrar = __webpack_require__(100);

var _TinyMCEActionRegistrar2 = _interopRequireDefault(_TinyMCEActionRegistrar);

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _reactDom = __webpack_require__(26);

var _reactDom2 = _interopRequireDefault(_reactDom);

var _reactApollo = __webpack_require__(125);

var _jquery = __webpack_require__(27);

var _jquery2 = _interopRequireDefault(_jquery);

var _InsertLinkModal = __webpack_require__(182);

var _Injector = __webpack_require__(45);

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
          fileAttributes: attrs,
          identifier: 'Admin.InsertLinkExternalModal'
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

},[854]);
//# sourceMappingURL=TinyMCE_sslink-external.js.map