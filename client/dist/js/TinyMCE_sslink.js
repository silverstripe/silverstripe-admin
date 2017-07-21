webpackJsonp([3],{

/***/ 100:
/***/ (function(module, exports) {

module.exports = TinyMCEActionRegistrar;

/***/ }),

/***/ 770:
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

      if (typeof top === 'undefined') {
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
  return Boolean(selection && tags.map(function (tag) {
    return String(tag);
  }).map(function (tag) {
    return tag.toLowerCase();
  }).includes((selection.tagName || '').toLowerCase()) && isEditorFocused);
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

/***/ 855:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _TinyMCEActionRegistrar = __webpack_require__(100);

var _TinyMCEActionRegistrar2 = _interopRequireDefault(_TinyMCEActionRegistrar);

var _reactDom = __webpack_require__(26);

var _reactDom2 = _interopRequireDefault(_reactDom);

var _jquery = __webpack_require__(27);

var _jquery2 = _interopRequireDefault(_jquery);

var _TinymceInlineToolbar = __webpack_require__(770);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var plugin = {
  init: function init(editor) {
    var actions = _TinyMCEActionRegistrar2.default.getActions('sslink').map(function (action) {
      return Object.assign({}, action, { onclick: function onclick() {
          return action.onclick(editor);
        } });
    });

    editor.addButton('sslink', {
      icon: 'link',
      title: 'Insert Link',
      type: 'menubutton',
      menu: actions
    });

    editor.addMenuItem('sslink', {
      icon: 'link',
      text: 'Insert Link',
      menu: actions
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
          return editor.execCommand('unlink');
        }, text: 'Remove link' }]);
    });
  }
};

_jquery2.default.entwine('ss', function ($) {
  $('.insert-link__dialog-wrapper').entwine({
    Element: null,

    Data: {},

    onunmatch: function onunmatch() {
      this._clearModal();
    },
    _clearModal: function _clearModal() {
      _reactDom2.default.unmountComponentAtNode(this[0]);
    },
    open: function open() {
      this.renderModal(true);
    },
    close: function close() {
      this.setData({});
      this.renderModal(false);
    },
    renderModal: function renderModal() {},
    handleInsert: function handleInsert(data) {
      var attributes = this.buildAttributes(data);

      this.insertLinkInEditor(attributes);
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
    insertLinkInEditor: function insertLinkInEditor(attributes) {
      var editor = this.getElement().getEditor();
      editor.insertLink(attributes);
      editor.addUndo();
      editor.repaint();
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

/***/ })

},[855]);
//# sourceMappingURL=TinyMCE_sslink.js.map