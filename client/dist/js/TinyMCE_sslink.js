/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./client/src/components/TinymceInlineToolbar/TinymceInlineToolbar.js":
/*!****************************************************************************!*\
  !*** ./client/src/components/TinymceInlineToolbar/TinymceInlineToolbar.js ***!
  \****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   "setupTinyMceInlineToolbar": () => (/* binding */ setupTinyMceInlineToolbar),
/* harmony export */   "shouldShowToolbar": () => (/* binding */ shouldShowToolbar)
/* harmony export */ });
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

var TinymceInlineToolbar = function () {
  function TinymceInlineToolbar(editor, buttons) {
    _classCallCheck(this, TinymceInlineToolbar);

    this.mceIframe = document.getElementById("".concat(editor.id, "_ifr"));
    this.container = editor.getContainer();
    this.mceToolbar = null;
    this.mceStatusbar = null;

    if (this.container) {
      this.mceToolbar = this.container.querySelector('.mce-toolbar-grp');
      this.mceStatusbar = this.container.querySelector('.mce-statusbar');
    }

    this.control = tinymce.ui.Factory.create({
      type: 'panel',
      classes: 'inline-toolbar',
      layout: 'stack',
      items: [{
        type: 'toolbar',
        items: buttons
      }]
    });
  }

  _createClass(TinymceInlineToolbar, [{
    key: "remove",
    value: function remove() {
      this.control.remove();
      return this;
    }
  }, {
    key: "hide",
    value: function hide() {
      this.control.hide();
      return this;
    }
  }, {
    key: "show",
    value: function show() {
      this.control.show();
      return this;
    }
  }, {
    key: "renderTo",
    value: function renderTo(dom) {
      this.control.renderTo(dom);
      return this;
    }
  }, {
    key: "setStyles",
    value: function setStyles(styles) {
      tinymce.DOM.setStyles(this.control.getEl(), styles);
      return this;
    }
  }, {
    key: "reposition",
    value: function reposition(currSelection) {
      if (!currSelection) {
        return this;
      }

      var scrollX = window.pageXOffset || document.documentElement.scrollLeft;
      var scrollY = window.pageYOffset || document.documentElement.scrollTop;
      var windowWidth = window.innerWidth;
      var windowHeight = window.innerHeight;
      var iframeRect = this.mceIframe ? this.mceIframe.getBoundingClientRect() : {
        top: 0,
        right: windowWidth,
        bottom: windowHeight,
        left: 0,
        width: windowWidth,
        height: windowHeight
      };
      var toolbarEl = this.control.getEl();
      var toolbarWidth = toolbarEl.offsetWidth;
      var toolbarHeight = toolbarEl.offsetHeight;
      var selection = currSelection.getBoundingClientRect();
      var selectionMiddle = (selection.left + selection.right) / 2;
      var buffer = 5;
      var margin = 8;
      var spaceNeeded = toolbarHeight + margin + buffer;
      var mceToolbarBottom = this.mceToolbar ? this.mceToolbar.getBoundingClientRect().bottom : 0;
      var mceStatusbarTop = this.mceStatusbar ? windowHeight - this.mceStatusbar.getBoundingClientRect().top : 0;
      var blockedTop = Math.max(0, mceToolbarBottom, iframeRect.top);
      var blockedBottom = Math.max(0, mceStatusbarTop, windowHeight - iframeRect.bottom);
      var spaceTop = selection.top + iframeRect.top - blockedTop;
      var spaceBottom = windowHeight - iframeRect.top - selection.bottom - blockedBottom;
      var editorHeight = windowHeight - blockedTop - blockedBottom;
      var topOffset = 10;
      var className = '';
      var top = 0;
      var left = 0;

      if (spaceTop >= editorHeight || spaceBottom >= editorHeight) {
        return this.hide();
      }

      if (this.bottom) {
        if (spaceBottom >= spaceNeeded) {
          className = ' mce-arrow-up';
          top = selection.bottom + iframeRect.top + scrollY + topOffset;
        } else if (spaceTop >= spaceNeeded) {
          className = ' mce-arrow-down';
          top = selection.top + iframeRect.top + scrollY - toolbarHeight - margin;
        }
      } else if (spaceTop >= spaceNeeded) {
        className = ' mce-arrow-down';
        top = selection.top + iframeRect.top + scrollY - toolbarHeight - margin;
      } else if (spaceBottom >= spaceNeeded && editorHeight / 2 > selection.bottom + iframeRect.top - blockedTop) {
        className = ' mce-arrow-up';
        top = selection.bottom + iframeRect.top + scrollY + topOffset;
      }

      if (top === 0) {
        top = scrollY + blockedTop + buffer;
      }

      left = selectionMiddle - toolbarWidth / 2 + iframeRect.left + scrollX;

      if (selection.left < 0 || selection.right > iframeRect.width) {
        left = iframeRect.left + scrollX + (iframeRect.width - toolbarWidth) / 2;
      } else if (toolbarWidth >= windowWidth) {
        className += ' mce-arrow-full';
        left = 0;
      } else if (left < 0 && selection.left + toolbarWidth > windowWidth || left + toolbarWidth > windowWidth && selection.right - toolbarWidth < 0) {
        left = (windowWidth - toolbarWidth) / 2;
      } else if (left < iframeRect.left + scrollX) {
        className += ' mce-arrow-left';
        left = selection.left + iframeRect.left + scrollX;
      } else if (left + toolbarWidth > iframeRect.width + iframeRect.left + scrollX) {
        className += ' mce-arrow-right';
        left = selection.right - toolbarWidth + iframeRect.left + scrollX;
      }

      toolbarEl.className = toolbarEl.className.replace(/ ?mce-arrow-[\w]+/g, '') + className;
      this.setStyles({
        left: left,
        top: top
      });
      return this;
    }
  }]);

  return TinymceInlineToolbar;
}();

function shouldShowToolbar(selection, isEditorFocused, tagTypes) {
  var tags = Array.isArray(tagTypes) ? tagTypes : [tagTypes || ''];

  if (selection && isEditorFocused) {
    tags = tags.map(function (tag) {
      return String(tag);
    }).map(function (tag) {
      return tag.toLowerCase();
    });
    var matching = tags.filter(function (t) {
      if (t.indexOf('[') > -1 && t.indexOf(']') > -1) {
        var tTag = t.substring(0, t.indexOf('['));
        var tAttr = t.substring(t.indexOf('[') + 1, t.indexOf(']'));

        if (tTag === selection.tagName.toLowerCase()) {
          if (selection.getAttribute(tAttr)) {
            return true;
          }
        }
      } else if (selection.tagName && t === selection.tagName.toLowerCase()) {
        return true;
      }

      return false;
    });
    return matching.length > 0;
  }

  return false;
}

function setupTinyMceInlineToolbar(editor, buttons) {
  var tagTypes = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : ['a'];
  var toolbar = new TinymceInlineToolbar(editor, buttons);
  var currentSelection = null;
  var scrollTimeoutId = null;
  var focused = false;
  toolbar.hide().renderTo(window.document.body);
  editor.on('remove', function () {
    toolbar.remove();
  });
  editor.on('focus', function () {
    focused = true;
  });
  editor.on('blur hide', function () {
    toolbar.hide();
    focused = false;
  });
  editor.on('nodechange', function (event) {
    var args = {
      element: event.element,
      parents: event.parents,
      collapsed: editor.selection.isCollapsed()
    };
    currentSelection = args.selection || args.element;

    if (shouldShowToolbar(currentSelection, focused, tagTypes)) {
      toolbar.show();
      toolbar.reposition(currentSelection);
    } else {
      toolbar.hide();
    }
  });

  function handleScroll() {
    if (shouldShowToolbar(currentSelection, focused, tagTypes)) {
      toolbar.hide();
      clearTimeout(scrollTimeoutId);
      scrollTimeoutId = setTimeout(function () {
        toolbar.show();
        toolbar.reposition(currentSelection);
      }, 300);
    }
  }

  window.addEventListener('scroll', function (e) {
    if (e.target.contains(document.querySelector("#".concat(editor.id)))) {
      handleScroll();
    }
  }, true);
  editor.contentDocument.addEventListener('scroll', handleScroll);
  return toolbar;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (TinymceInlineToolbar);


/***/ }),

/***/ "react-dom":
/*!***************************!*\
  !*** external "ReactDom" ***!
  \***************************/
/***/ ((module) => {

module.exports = ReactDom;

/***/ }),

/***/ "lib/ShortcodeSerialiser":
/*!**************************************!*\
  !*** external "ShortcodeSerialiser" ***!
  \**************************************/
/***/ ((module) => {

module.exports = ShortcodeSerialiser;

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
/*!*********************************************!*\
  !*** ./client/src/legacy/TinyMCE_sslink.js ***!
  \*********************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var lib_TinyMCEActionRegistrar__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lib/TinyMCEActionRegistrar */ "lib/TinyMCEActionRegistrar");
/* harmony import */ var lib_TinyMCEActionRegistrar__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lib_TinyMCEActionRegistrar__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-dom */ "react-dom");
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_dom__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! jquery */ "jquery");
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(jquery__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var components_TinymceInlineToolbar_TinymceInlineToolbar__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! components/TinymceInlineToolbar/TinymceInlineToolbar */ "./client/src/components/TinymceInlineToolbar/TinymceInlineToolbar.js");
/* harmony import */ var lib_ShortcodeSerialiser__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! lib/ShortcodeSerialiser */ "lib/ShortcodeSerialiser");
/* harmony import */ var lib_ShortcodeSerialiser__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(lib_ShortcodeSerialiser__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var i18n__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! i18n */ "i18n");
/* harmony import */ var i18n__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(i18n__WEBPACK_IMPORTED_MODULE_5__);






var plugin = {
  init: function init(editor) {
    var _this = this;

    var metaKey = navigator.platform.toUpperCase().includes('MAC') ? '⌘' : 'Ctrl';

    var title = i18n__WEBPACK_IMPORTED_MODULE_5___default()._t('Admin.INSERT_LINK', 'Insert link');

    var titleWithShortcut = i18n__WEBPACK_IMPORTED_MODULE_5___default().inject(i18n__WEBPACK_IMPORTED_MODULE_5___default()._t('Admin.INSERT_LINK_WITH_SHORTCUT', 'Insert link {shortcut}'), {
      shortcut: "[".concat(metaKey, "+K]")
    });
    var actions = lib_TinyMCEActionRegistrar__WEBPACK_IMPORTED_MODULE_0___default().getSortedActions('sslink', editor.settings.editorIdentifier, true).map(function (action) {
      return Object.assign({}, action, {
        onclick: function onclick() {
          return action.onclick(editor);
        }
      });
    });
    editor.addButton('sslink', {
      icon: 'link',
      title: titleWithShortcut,
      type: 'menubutton',
      menu: actions
    });
    editor.addMenuItem('sslink', {
      icon: 'link',
      text: title,
      menu: actions
    });
    editor.addShortcut('Meta+k', 'Open link menu', function () {
      jquery__WEBPACK_IMPORTED_MODULE_2___default()("[aria-label^=\"".concat(title, "\"] > button"), editor.container).first().click();
    });

    function openLinkDialog() {
      var node = tinymce.activeEditor.selection.getNode();
      var href = node.getAttribute('href');

      if (href) {
        editor.execCommand(lib_TinyMCEActionRegistrar__WEBPACK_IMPORTED_MODULE_0___default().getEditorCommandFromUrl(href));
      }
    }

    editor.on('preinit', function () {
      (0,components_TinymceInlineToolbar_TinymceInlineToolbar__WEBPACK_IMPORTED_MODULE_3__.setupTinyMceInlineToolbar)(editor, [{
        type: 'button',
        onClick: openLinkDialog,
        text: i18n__WEBPACK_IMPORTED_MODULE_5___default()._t('Admin.EDIT_LINK', 'Edit link')
      }, {
        type: 'button',
        onClick: function onClick() {
          return _this.handleRemoveLinkClick(editor);
        },
        text: i18n__WEBPACK_IMPORTED_MODULE_5___default()._t('Admin.REMOVE_LINK', 'Remove link')
      }], ['a[href]']);
    });
  },
  handleRemoveLinkClick: function handleRemoveLinkClick(editor) {
    var result = editor.execCommand('unlink');
    var node = editor.selection.getNode();

    if (node && typeof node.normalize !== 'undefined') {
      node.normalize();
    }

    return result;
  }
};
jquery__WEBPACK_IMPORTED_MODULE_2___default().entwine('ss', function ($) {
  $('.insert-link__dialog-wrapper').entwine({
    Element: null,
    Data: {},
    Bookmark: null,
    onunmatch: function onunmatch() {
      this._clearModal();
    },
    _clearModal: function _clearModal() {
      react_dom__WEBPACK_IMPORTED_MODULE_1___default().unmountComponentAtNode(this[0]);
    },
    open: function open() {
      var editor = this.getElement().getEditor().getInstance();
      this.setBookmark(editor.selection.getBookmark(2, true));
      this.renderModal(true);
    },
    close: function close() {
      this.setData({});
      this.renderModal(false);
    },
    renderModal: function renderModal() {},
    handleInsert: function handleInsert(data) {
      var editor = this.getElement().getEditor().getInstance();
      editor.selection.moveToBookmark(this.getBookmark());
      var attributes = this.buildAttributes(data);
      var sanitise = (0,lib_ShortcodeSerialiser__WEBPACK_IMPORTED_MODULE_4__.createHTMLSanitiser)();
      var linkText = sanitise(data.Text);
      this.insertLinkInEditor(attributes, linkText);
      this.close();
      return Promise.resolve();
    },
    buildAttributes: function buildAttributes(_ref) {
      var Anchor = _ref.Anchor,
          Link = _ref.Link,
          TargetBlank = _ref.TargetBlank,
          Description = _ref.Description;
      var anchor = Anchor && Anchor.length ? "#".concat(Anchor) : '';
      anchor = anchor.replace(/^#+/, '#');
      var href = "".concat(Link).concat(anchor);
      return {
        href: href,
        target: TargetBlank ? '_blank' : '',
        title: Description
      };
    },
    insertLinkInEditor: function insertLinkInEditor(attributes, linkText) {
      var editor = this.getElement().getEditor();
      editor.insertLink(attributes, null, linkText);
      editor.addUndo();
      editor.repaint();
      var instance = editor.getInstance();
      var selection = instance.selection;
      setTimeout(function () {
        return selection && selection.collapse();
      }, 0);
    },
    getOriginalAttributes: function getOriginalAttributes() {
      var editor = this.getElement().getEditor();
      var node = $(editor.getSelectedNode());
      var hrefParts = (node.attr('href') || '').split('#');
      return {
        Link: hrefParts[0] || '',
        Anchor: hrefParts[1] || '',
        Description: node.attr('title'),
        TargetBlank: !!node.attr('target')
      };
    }
  });
});
tinymce.PluginManager.add('sslink', function (editor) {
  return plugin.init(editor);
});
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (plugin);
})();

/******/ })()
;
//# sourceMappingURL=TinyMCE_sslink.js.map