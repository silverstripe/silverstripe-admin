/* global window, document, tinymce */

/**
 * Inline / floating tinymce toolbar
 */
class TinymceInlineToolbar {
  /**
   * @param  {Object} editor Tinymce editor instance
   * @param  {Array} buttons Array of button literal object
   */
  constructor(editor, buttons) {
    this.mceIframe = document.getElementById(`${editor.id}_ifr`);
    this.container = editor.getContainer();
    this.mceToolbar = null;
    this.mceStatusbar = null;

    if (this.container) {
      this.mceToolbar = this.container.querySelector('.mce-toolbar-grp');
      this.mceStatusbar = this.container.querySelector('.mce-statusbar');
    }

    // type: tinymce.ui.Control
    this.control = tinymce.ui.Factory.create({
      type: 'panel',
      classes: 'inline-toolbar',
      layout: 'stack',
      items: [
        {
          type: 'toolbar',
          items: buttons,
        },
      ],
    });
  }

  remove() {
    this.control.remove();
    return this;
  }

  hide() {
    this.control.hide();
    return this;
  }

  show() {
    this.control.show();
    return this;
  }

  renderTo(dom) {
    this.control.renderTo(dom);
    return this;
  }

  setStyles(styles) {
    tinymce.DOM.setStyles(this.control.getEl(), styles);
    return this;
  }

  /**
   * Source: https://github.com/Automattic/wp-calypso/blob/desktop/2.6.0/client/components/tinymce/plugins/wpcom/plugin.js
   */
  reposition(currSelection) {
    if (!currSelection) {
      return this;
    }

    const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const iframeRect = this.mceIframe ? this.mceIframe.getBoundingClientRect() : {
      top: 0,
      right: windowWidth,
      bottom: windowHeight,
      left: 0,
      width: windowWidth,
      height: windowHeight,
    };
    const toolbarEl = this.control.getEl();
    const toolbarWidth = toolbarEl.offsetWidth;
    const toolbarHeight = toolbarEl.offsetHeight;
    const selection = currSelection.getBoundingClientRect();
    const selectionMiddle = (selection.left + selection.right) / 2;
    const buffer = 5;
    const margin = 8;
    const spaceNeeded = toolbarHeight + margin + buffer;
    const mceToolbarBottom = this.mceToolbar ?
      this.mceToolbar.getBoundingClientRect().bottom : 0;
    const mceStatusbarTop = this.mceStatusbar ?
      windowHeight - this.mceStatusbar.getBoundingClientRect().top : 0;
    const blockedTop = Math.max(0, mceToolbarBottom, iframeRect.top);
    const blockedBottom = Math.max(0, mceStatusbarTop, windowHeight - iframeRect.bottom);
    const spaceTop = (selection.top + iframeRect.top) - blockedTop;
    const spaceBottom = windowHeight - iframeRect.top - selection.bottom - blockedBottom;
    const editorHeight = windowHeight - blockedTop - blockedBottom;
    const topOffset = 10;
    let className = '';
    let top = 0;
    let left = 0;

    if (spaceTop >= editorHeight || spaceBottom >= editorHeight) {
      return this.hide();
    }

    if (this.bottom) {
      if (spaceBottom >= spaceNeeded) {
        className = ' mce-arrow-up';
        top = selection.bottom + iframeRect.top + scrollY + topOffset;
      } else if (spaceTop >= spaceNeeded) {
        className = ' mce-arrow-down';
        top = (selection.top + iframeRect.top + scrollY) - toolbarHeight - margin;
      }
    } else if (spaceTop >= spaceNeeded) {
      className = ' mce-arrow-down';
      top = (selection.top + iframeRect.top + scrollY) - toolbarHeight - margin;
    } else if (
      spaceBottom >= spaceNeeded &&
      editorHeight / 2 > (selection.bottom + iframeRect.top) - blockedTop
    ) {
      className = ' mce-arrow-up';
      top = selection.bottom + iframeRect.top + scrollY + topOffset;
    }

    if (typeof top === 'undefined') {
      top = scrollY + blockedTop + buffer;
    }

    left = (selectionMiddle - (toolbarWidth / 2)) + iframeRect.left + scrollX;

    if (selection.left < 0 || selection.right > iframeRect.width) {
      left = iframeRect.left + scrollX + ((iframeRect.width - toolbarWidth) / 2);
    } else if (toolbarWidth >= windowWidth) {
      className += ' mce-arrow-full';
      left = 0;
    } else if (
      (left < 0 && selection.left + toolbarWidth > windowWidth) ||
      (left + toolbarWidth > windowWidth && selection.right - toolbarWidth < 0)
    ) {
      left = (windowWidth - toolbarWidth) / 2;
    } else if (left < iframeRect.left + scrollX) {
      className += ' mce-arrow-left';
      left = selection.left + iframeRect.left + scrollX;
    } else if (left + toolbarWidth > iframeRect.width + iframeRect.left + scrollX) {
      className += ' mce-arrow-right';
      left = (selection.right - toolbarWidth) + iframeRect.left + scrollX;
    }

    toolbarEl.className = toolbarEl.className.replace(/ ?mce-arrow-[\w]+/g, '') + className;
    this.setStyles({ left, top });

    return this;
  }
}

/**
 * @param  {Object} selection Tinymce selection object
 * @param  {Boolean} isEditorFocused
 * @param  {Array} tagTypes Array of tag names - e.g. "A"
 * @return {Boolean}
 */
function shouldShowToolbar(selection, isEditorFocused, tagTypes) {
  const tags = Array.isArray(tagTypes) ? tagTypes : [tagTypes || ''];
  return Boolean(
    selection &&
    tags
      .map(tag => String(tag))
      .map(tag => tag.toLowerCase())
      .includes((selection.tagName || '').toLowerCase()) &&
    isEditorFocused);
}


/**
 * @param  {Object} editor Tinymce editor instance
 * @param  {Array} buttons Array of button literal object
 * @param  {Array} tagTypes Array of tag names - e.g. "A"
 */
function setupTinyMceInlineToolbar(editor, buttons, tagTypes = ['a']) {
  const toolbar = new TinymceInlineToolbar(editor, buttons);
  let currentSelection = null;
  let scrollTimeoutId = null;
  let focused = false;

  toolbar
    .hide()
    .renderTo(window.document.body);

  editor.on('remove', () => {
    toolbar.remove();
  });

  editor.on('focus', () => {
    focused = true;
  });

  editor.on('blur hide', () => {
    toolbar.hide();
    focused = false;
  });

  editor.on('nodechange', (event) => {
    const args = {
      element: event.element,
      parents: event.parents,
      collapsed: editor.selection.isCollapsed(),
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

      // Throttle
      clearTimeout(scrollTimeoutId);
      scrollTimeoutId = setTimeout(() => {
        toolbar.show();
        toolbar.reposition(currentSelection);
      }, 300);
    }
  }

  window.addEventListener('scroll', (e) => {
    // The element being scrolled is the parent of the editor
    if (e.target.contains(document.querySelector(`#${editor.id}`))) {
      handleScroll();
    }
  }, true);

  editor.contentDocument.addEventListener('scroll', handleScroll);

  return toolbar;
}

export default TinymceInlineToolbar;
export { setupTinyMceInlineToolbar, shouldShowToolbar };
