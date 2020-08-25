/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./client/src/legacy/TinyMCE_sslink.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./client/src/components/TinymceInlineToolbar/TinymceInlineToolbar.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TinymceInlineToolbar = function () {
  function TinymceInlineToolbar(editor, buttons) {
    _classCallCheck(this, TinymceInlineToolbar);

    this.mceIframe = document.getElementById(editor.id + '_ifr');
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
    key: 'remove',
    value: function remove() {
      this.control.remove();
      return this;
    }
  }, {
    key: 'hide',
    value: function hide() {
      this.control.hide();
      return this;
    }
  }, {
    key: 'show',
    value: function show() {
      this.control.show();
      return this;
    }
  }, {
    key: 'renderTo',
    value: function renderTo(dom) {
      this.control.renderTo(dom);
      return this;
    }
  }, {
    key: 'setStyles',
    value: function setStyles(styles) {
      tinymce.DOM.setStyles(this.control.getEl(), styles);
      return this;
    }
  }, {
    key: 'reposition',
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
      this.setStyles({ left: left, top: top });

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
    if (e.target.contains(document.querySelector('#' + editor.id))) {
      handleScroll();
    }
  }, true);

  editor.contentDocument.addEventListener('scroll', handleScroll);

  return toolbar;
}

exports.default = TinymceInlineToolbar;
exports.setupTinyMceInlineToolbar = setupTinyMceInlineToolbar;
exports.shouldShowToolbar = shouldShowToolbar;

/***/ }),

/***/ "./client/src/legacy/TinyMCE_sslink.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _TinyMCEActionRegistrar = __webpack_require__(1);

var _TinyMCEActionRegistrar2 = _interopRequireDefault(_TinyMCEActionRegistrar);

var _reactDom = __webpack_require__(0);

var _reactDom2 = _interopRequireDefault(_reactDom);

var _jquery = __webpack_require__(3);

var _jquery2 = _interopRequireDefault(_jquery);

var _TinymceInlineToolbar = __webpack_require__("./client/src/components/TinymceInlineToolbar/TinymceInlineToolbar.js");

var _ShortcodeSerialiser = __webpack_require__(7);

var _i18n = __webpack_require__(2);

var _i18n2 = _interopRequireDefault(_i18n);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var plugin = {
  init: function init(editor) {
    var _this = this;

    var metaKey = navigator.platform.toUpperCase().includes('MAC') ? '⌘' : 'Ctrl';
    var title = _i18n2.default._t('Admin.INSERT_LINK', 'Insert link');
    var titleWithShortcut = _i18n2.default.inject(_i18n2.default._t('Admin.INSERT_LINK_WITH_SHORTCUT', 'Insert link {shortcut}'), { shortcut: '[' + metaKey + '+K]' });
    var actions = _TinyMCEActionRegistrar2.default.getSortedActions('sslink', editor.settings.editorIdentifier, true).map(function (action) {
      return Object.assign({}, action, { onclick: function onclick() {
          return action.onclick(editor);
        } });
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
      (0, _jquery2.default)('[aria-label^="' + title + '"] > button', editor.container).first().click();
    });

    function openLinkDialog() {
      var node = tinymce.activeEditor.selection.getNode();
      var href = node.getAttribute('href');

      if (href) {
        editor.execCommand(_TinyMCEActionRegistrar2.default.getEditorCommandFromUrl(href));
      }
    }

    editor.on('preinit', function () {
      (0, _TinymceInlineToolbar.setupTinyMceInlineToolbar)(editor, [{ type: 'button', onClick: openLinkDialog, text: 'Edit link' }, { type: 'button', onClick: function onClick() {
          return _this.handleRemoveLinkClick(editor);
        }, text: 'Remove link' }], ['a[href]']);
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

_jquery2.default.entwine('ss', function ($) {
  $('.insert-link__dialog-wrapper').entwine({
    Element: null,

    Data: {},

    Bookmark: null,

    onunmatch: function onunmatch() {
      this._clearModal();
    },
    _clearModal: function _clearModal() {
      _reactDom2.default.unmountComponentAtNode(this[0]);
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
      var sanitise = (0, _ShortcodeSerialiser.createHTMLSanitiser)();
      var linkText = sanitise(data.Text);
      this.insertLinkInEditor(attributes, linkText);
      this.close();

      return Promise.resolve();
    },
    buildAttributes: function buildAttributes(data) {
      var anchor = data.Anchor && data.Anchor.length ? '#' + data.Anchor : '';
      var href = '' + data.Link + anchor;

      return {
        href: href,
        target: data.TargetBlank ? '_blank' : '',
        title: data.Description
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

exports.default = plugin;

/***/ }),

/***/ 0:
/***/ (function(module, exports) {

module.exports = ReactDom;

/***/ }),

/***/ 1:
/***/ (function(module, exports) {

module.exports = TinyMCEActionRegistrar;

/***/ }),

/***/ 2:
/***/ (function(module, exports) {

module.exports = i18n;

/***/ }),

/***/ 3:
/***/ (function(module, exports) {

module.exports = jQuery;

/***/ }),

/***/ 7:
/***/ (function(module, exports) {

module.exports = ShortcodeSerialiser;

/***/ })

/******/ });
//# sourceMappingURL=TinyMCE_sslink.js.map