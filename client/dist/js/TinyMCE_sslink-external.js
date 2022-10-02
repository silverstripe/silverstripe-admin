/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "lib/Injector":
/*!***************************!*\
  !*** external "Injector" ***!
  \***************************/
/***/ ((module) => {

module.exports = Injector;

/***/ }),

/***/ "containers/InsertLinkModal/InsertLinkModal":
/*!**********************************!*\
  !*** external "InsertLinkModal" ***!
  \**********************************/
/***/ ((module) => {

module.exports = InsertLinkModal;

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "React" ***!
  \************************/
/***/ ((module) => {

module.exports = React;

/***/ }),

/***/ "react-dom":
/*!***************************!*\
  !*** external "ReactDom" ***!
  \***************************/
/***/ ((module) => {

module.exports = ReactDom;

/***/ }),

/***/ "lib/TinyMCEActionRegistrar":
/*!*****************************************!*\
  !*** external "TinyMCEActionRegistrar" ***!
  \*****************************************/
/***/ ((module) => {

module.exports = TinyMCEActionRegistrar;

/***/ }),

/***/ "i18n":
/*!***********************!*\
  !*** external "i18n" ***!
  \***********************/
/***/ ((module) => {

module.exports = i18n;

/***/ }),

/***/ "jquery":
/*!*************************!*\
  !*** external "jQuery" ***!
  \*************************/
/***/ ((module) => {

module.exports = jQuery;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!******************************************************!*\
  !*** ./client/src/legacy/TinyMCE_sslink-external.js ***!
  \******************************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! i18n */ "i18n");
/* harmony import */ var i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var lib_TinyMCEActionRegistrar__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lib/TinyMCEActionRegistrar */ "lib/TinyMCEActionRegistrar");
/* harmony import */ var lib_TinyMCEActionRegistrar__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lib_TinyMCEActionRegistrar__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-dom */ "react-dom");
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_dom__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! jquery */ "jquery");
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(jquery__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var containers_InsertLinkModal_InsertLinkModal__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! containers/InsertLinkModal/InsertLinkModal */ "containers/InsertLinkModal/InsertLinkModal");
/* harmony import */ var containers_InsertLinkModal_InsertLinkModal__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(containers_InsertLinkModal_InsertLinkModal__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var lib_Injector__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! lib/Injector */ "lib/Injector");
/* harmony import */ var lib_Injector__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(lib_Injector__WEBPACK_IMPORTED_MODULE_6__);







lib_TinyMCEActionRegistrar__WEBPACK_IMPORTED_MODULE_1___default().addAction('sslink', {
  text: i18n__WEBPACK_IMPORTED_MODULE_0___default()._t('Admin.LINKLABEL_EXTERNALURL', 'Link to external URL'),
  onclick: function onclick(editor) {
    return editor.execCommand('sslinkexternal');
  },
  priority: 70
}, editorIdentifier);
var plugin = {
  init: function init(editor) {
    editor.addCommand('sslinkexternal', function () {
      var field = window.jQuery("#".concat(editor.id)).entwine('ss');
      field.openLinkExternalDialog();
    });
  }
};
var modalId = 'insert-link__dialog-wrapper--external';
var sectionConfigKey = 'SilverStripe\\Admin\\LeftAndMain';
var formName = 'EditorExternalLink';
var InsertLinkExternalModal = (0,lib_Injector__WEBPACK_IMPORTED_MODULE_6__.loadComponent)((0,containers_InsertLinkModal_InsertLinkModal__WEBPACK_IMPORTED_MODULE_5__.createInsertLinkModal)(sectionConfigKey, formName));
jquery__WEBPACK_IMPORTED_MODULE_4___default().entwine('ss', function ($) {
  $('textarea.htmleditor').entwine({
    openLinkExternalDialog: function openLinkExternalDialog() {
      var dialog = $("#".concat(modalId));

      if (!dialog.length) {
        dialog = $("<div id=\"".concat(modalId, "\" />"));
        $('body').append(dialog);
      }

      dialog.addClass('insert-link__dialog-wrapper');
      dialog.setElement(this);
      dialog.open();
    }
  });
  $("#".concat(modalId)).entwine({
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
      react_dom__WEBPACK_IMPORTED_MODULE_3___default().render(react__WEBPACK_IMPORTED_MODULE_2___default().createElement(InsertLinkExternalModal, {
        isOpen: isOpen,
        onInsert: handleInsert,
        onClosed: handleHide,
        title: i18n__WEBPACK_IMPORTED_MODULE_0___default()._t('Admin.LINK_EXTERNAL', 'Insert external link'),
        bodyClassName: "modal__dialog",
        className: "insert-link__dialog-wrapper--external",
        fileAttributes: attrs,
        identifier: "Admin.InsertLinkExternalModal",
        requireLinkText: requireLinkText
      }), this[0]);
    },
    buildAttributes: function buildAttributes(data) {
      var attributes = this._super(data);

      var href = attributes.href;

      if (!href.match(/:\/\//)) {
        href = "".concat(window.location.protocol, "//").concat(href);
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
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (plugin);
})();

/******/ })()
;
//# sourceMappingURL=TinyMCE_sslink-external.js.map