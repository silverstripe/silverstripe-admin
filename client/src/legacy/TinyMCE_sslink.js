/* global tinymce, navigator */
import TinyMCEActionRegistrar from 'lib/TinyMCEActionRegistrar';
import ReactDOM from 'react-dom';
import jQuery from 'jquery';
import { setupTinyMceInlineToolbar } from 'components/TinymceInlineToolbar/TinymceInlineToolbar';
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

    editor.addShortcut('Meta+k', 'Open link menu', () => {
      jQuery(`[aria-label^=\"${title}\"] > button`, editor.container).first().click();
    });

    function openLinkDialog() {
      const node = tinymce.activeEditor.selection.getNode();
      const href = node.getAttribute('href');

      if (href) {
        editor.execCommand(TinyMCEActionRegistrar.getEditorCommandFromUrl(href));
      }
    }

    let actions = [];

    const button = {
      icon: 'link',
      title: titleWithShortcut,
      type: 'menubutton',
      onPostRender: (data) => {
        // Fetch the actions.
        // We can't do this in the plugin's init method directly because not all actions will have
        // been registered at that stage.
        // We can't do this in the editor's preinit (or any other editor-related) event because
        // the buttons will have already been fully rendered by then, and after that we can't
        // access their state to update it.
        actions = TinyMCEActionRegistrar.getSortedActions('sslink', editor.settings.editorIdentifier, true)
        .map(action => Object.assign(
          {},
          action,
          { onclick: () => action.onclick(editor) }
        ));
        // Set the button menu to include all link actions
        // eslint-disable-next-line no-param-reassign
        data.control.state.data.menu = actions;
      },
      menu: actions,
    };

    editor.addButton('sslink', button);

    editor.on('preinit', () => {
      // Add context menu item. This happens after button rendering, so we know
      // we have the same list of actions that the main button has at this stage.
      editor.addMenuItem('sslink', {
        icon: 'link',
        text: title,
        menu: actions,
      });

      // Add toolbar for when you right click on a link
      setupTinyMceInlineToolbar(editor, [
        { type: 'button', onClick: openLinkDialog, text: i18n._t('Admin.EDIT_LINK', 'Edit link') },
        { type: 'button', onClick: () => this.handleRemoveLinkClick(editor), text: i18n._t('Admin.REMOVE_LINK', 'Remove link') },
      ], ['a[href]']);
    });
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
     * @param selection The current tinyMCE selection for this WYSIWYG
     * @return {Boolean}
     */
    linkCanWrapSelection(selection) {
      const selectionContent = selection.getContent() || '';
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
      if (node === selection.getSel().focusNode && node === selection.getSel().anchorNode) {
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
      const selection = this.getElement().getEditor().getInstance().selection;
      const isValidSelection = this.linkCanWrapSelection(selection);
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
