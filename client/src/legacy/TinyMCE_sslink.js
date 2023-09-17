/* global tinymce, navigator */
import TinyMCEActionRegistrar from 'lib/TinyMCEActionRegistrar';
import jQuery from 'jquery';
import { createHTMLSanitiser } from 'lib/ShortcodeSerialiser';
import i18n from 'i18n';

const plugin = {
  /**
   * Initialise this plugin, or re-initialises it if already has
   *
   * @param {Object} editor
   */
  init(editor) {
    const metaKey = navigator.platform.toUpperCase().includes('MAC') ? '⌘' : 'Ctrl';
    const title = i18n._t('Admin.INSERT_LINK', 'Insert link');
    const titleWithShortcut = i18n.inject(
      i18n._t('Admin.INSERT_LINK_WITH_SHORTCUT', 'Insert link {shortcut}'),
      { shortcut: `[${metaKey}+K]` }
    );
    const actions = TinyMCEActionRegistrar.getSortedActions('sslink', editor.getParam('editorIdentifier'), true)
      .map(action => Object.assign(
        {},
        action,
        { onAction: () => action.onAction(editor) }
      ));

    // Button in main toolbar
    editor.ui.registry.addMenuButton('sslink', {
      icon: 'link',
      tooltip: titleWithShortcut,
      fetch: (callback) => callback(actions),
    });

    // Right click context menu item
    editor.ui.registry.addNestedMenuItem('sslink', {
      icon: 'link',
      text: title,
      getSubmenuItems: () => actions,
    });

    // Keyboard shortcut
    editor.addShortcut('Meta+k', 'Open link menu', () => {
      jQuery(`[aria-label^=\"${title}\"] > button`, editor.container).first().click();
    });

    // Callback for opening the edit link dialog form
    function openLinkDialog() {
      const node = tinymce.activeEditor.selection.getNode();
      const href = node.getAttribute('href');

      if (href) {
        editor.execCommand(TinyMCEActionRegistrar.getEditorCommandFromUrl(href));
      }
    }

    // Context menu when a link is selected
    editor.ui.registry.addButton('sslink-edit', {
      text: i18n._t('Admin.EDIT_LINK', 'Edit link'),
      onAction: openLinkDialog,
    });
    editor.ui.registry.addButton('sslink-remove', {
      text: i18n._t('Admin.REMOVE_LINK', 'Remove link'),
      onAction: () => this.handleRemoveLinkClick(editor),
    });
    editor.ui.registry.addContextToolbar('sslink', {
      predicate: (node) => editor.dom.is(node, 'a[href]'),
      position: 'node',
      scope: 'node',
      items: 'sslink-edit sslink-remove',
    });

    // getMetadata method on a returned object is used by the "help" plugin
    return {
      getMetadata() {
        return {
          name: 'Silverstripe Link',
          url: 'https://docs.silverstripe.org/en/4/developer_guides/forms/field_types/htmleditorfield',
        };
      }
    };
  },

  /**
   * @param {Object} editor
   */
  handleRemoveLinkClick(editor) {
    const result = editor.execCommand('unlink');
    // Merge adjacent textNodes after removing <a> nodes so that tinymce.js can properly
    // calculate a value for 'isCollapsed'
    const node = editor.selection.getNode();
    // IE11 normalize() compatibility is unknown
    if (node && (typeof node.normalize !== 'undefined')) {
      node.normalize();
    }
    return result;
  }
};

jQuery.entwine('ss', ($) => {
  $('.insert-link__dialog-wrapper').entwine({
    Element: null,

    Data: {},

    Bookmark: null,

    onunmatch() {
      // solves errors given by ReactDOM "no matched root found" error.
      this._clearModal();
    },

    _clearModal() {
      const root = this.getReactRoot();
      if (root) {
        root.unmount();
        this.setReactRoot(null);
      }
    },

    open() {
      // need to bookmark selection before modal opens, due to an IE11 bug where selection is lost
      const editor = this.getElement().getEditor().getInstance();
      this.setBookmark(editor.selection.getBookmark(2, true));

      this.renderModal(true);
    },

    close() {
      this.setData({});
      this.renderModal(false);
    },

    renderModal() {
      /* noop */
    },

    /**
     * Check if one node is the same as another node (or is the same as that other node's child)
     */
    checkNodeMatches(node, matchWith) {
      if (node === matchWith) {
        return true;
      }
      if (matchWith.children.length === 1) {
        // In chrome, selecting an image actually results in selecting the paragraph.
        // If there's exactly one child, treat that child as the selection to account for this scenario.
        return node === matchWith.children[0];
      }
      return false;
    },

    /**
     * @param selection The current tinyMCE selection for this WYSIWYG
     * @return {Boolean}
     */
    linkCanWrapSelection(editor, selection) {
      const selectionContent = editor.getSelection() || '';
      const node = selection.getNode();

      // If there is direct selected content other than whitespace, we can wrap it.
      if (selectionContent) {
        return selectionContent.trim() !== '';
      }

      // If the selected node type can contain text, and we didn't find selected text above,
      // then you haven't got a selection we can wrap in a link.
      const x = document.createElement(node.nodeName);
      x.textContent = 'Check the outer HTML';
      if (x.outerHTML.includes('Check the outer HTML')) {
        return false;
      }

      // Check if there is a single selected node which can be wrapped in a link.
      if (this.checkNodeMatches(node, selection.getSel().focusNode) && this.checkNodeMatches(node, selection.getSel().anchorNode)) {
        const parsed = tinymce.activeEditor.dom.createFragment(`<a>${node.outerHTML}</a>`);
        if (parsed.childNodes.length === 1) {
          return true;
        }
      }

      return false;
    },

    /**
     * Determine whether to show the link text field
     *
     * @return {Boolean}
     */
    getRequireLinkText() {
      const editor = this.getElement().getEditor();
      const selection = editor.getInstance().selection;
      const isValidSelection = this.linkCanWrapSelection(editor, selection);
      const tagName = selection.getNode().tagName;
      const requireLinkText = tagName !== 'A' && !isValidSelection;

      return requireLinkText;
    },

    /**
     * Default behaviour, recommended to overload this and sanitise where needed
     *
     * @param data
     * @private
     */
    handleInsert(data) {
      // need to move to bookmarked selection before modal inserts, due to an IE11 bug
      const editor = this.getElement().getEditor().getInstance();
      editor.selection.moveToBookmark(this.getBookmark());

      const attributes = this.buildAttributes(data);
      const sanitise = createHTMLSanitiser();
      const linkText = sanitise(data.Text);
      this.insertLinkInEditor(attributes, linkText);
      this.close();

      return Promise.resolve();
    },

    /**
     *
     * @param {string|undefined} Anchor
     * @param {string} Link
     * @param {boolean} TargetBlank
     * @param {string} Description
     * @returns {{href: string, title: string, target: string}}
     */
    buildAttributes({ Anchor, Link, TargetBlank, Description }) {
      let anchor = Anchor && Anchor.length ? `#${Anchor}` : '';
      // Make sure, there's no more than one # character at the start of the anchor
      anchor = anchor.replace(/^#+/, '#');
      const href = `${Link}${anchor}`;

      return {
        href,
        target: TargetBlank ? '_blank' : '',
        title: Description,
      };
    },

    insertLinkInEditor(attributes, linkText) {
      const editor = this.getElement().getEditor();
      editor.insertLink(attributes, null, linkText);
      editor.addUndo();
      editor.repaint();

      const instance = editor.getInstance();
      const selection = instance.selection;

      // Workaround to editing a link that is just inserted issue.
      // What it does here is deselecting the link text in the editor
      setTimeout(() => selection && selection.collapse(), 0);
    },

    getOriginalAttributes() {
      const editor = this.getElement().getEditor();
      const node = $(editor.getSelectedNode());

      const hrefParts = (node.attr('href') || '').split('#');

      return {
        Link: hrefParts[0] || '',
        Anchor: hrefParts[1] || '',
        Description: node.attr('title'),
        TargetBlank: !!node.attr('target'),
      };
    },
  });
});

// Adds the plugin class to the list of available TinyMCE plugins
tinymce.PluginManager.add('sslink', (editor) => plugin.init(editor));

export default plugin;
