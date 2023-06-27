/* global tinymce, navigator */
import TinyMCEActionRegistrar from 'lib/TinyMCEActionRegistrar';
import ReactDOM from 'react-dom';
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
      ReactDOM.unmountComponentAtNode(this[0]);
      // this.empty();
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
