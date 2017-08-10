/* global tinymce */
import TinyMCEActionRegistrar from 'lib/TinyMCEActionRegistrar';
import ReactDOM from 'react-dom';
import jQuery from 'jquery';
import { setupTinyMceInlineToolbar } from 'components/TinymceInlineToolbar/TinymceInlineToolbar';

const plugin = {
  /**
   * Initialise this plugin, or re-initialises it if already has
   *
   * @param {Object} editor
   */
  init(editor) {
    const actions = TinyMCEActionRegistrar.getActions('sslink')
      .map(action => Object.assign(
        {},
        action,
        { onclick: () => action.onclick(editor) }
      ));

    editor.addButton('sslink', {
      icon: 'link',
      title: 'Insert Link',
      type: 'menubutton',
      menu: actions,
    });

    editor.addMenuItem('sslink', {
      icon: 'link',
      text: 'Insert Link',
      menu: actions,
    });

    function openLinkDialog() {
      const node = tinymce.activeEditor.selection.getNode();
      const href = node.getAttribute('href');
      if (href) {
        editor.execCommand(TinyMCEActionRegistrar.getEditorCommandFromUrl(href));
      }
    }

    editor.on('preinit', () => {
      setupTinyMceInlineToolbar(editor, [
        { type: 'button', onClick: openLinkDialog, text: 'Edit link' },
        { type: 'button', onClick: () => editor.execCommand('unlink'), text: 'Remove link' },
      ]);
    });
  },
};

jQuery.entwine('ss', ($) => {
  $('.insert-link__dialog-wrapper').entwine({
    Element: null,

    Data: {},

    onunmatch() {
      // solves errors given by ReactDOM "no matched root found" error.
      this._clearModal();
    },

    _clearModal() {
      ReactDOM.unmountComponentAtNode(this[0]);
      // this.empty();
    },

    open() {
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
      const attributes = this.buildAttributes(data);

      this.insertLinkInEditor(attributes, data.Text);
      this.close();

      return Promise.resolve();
    },

    buildAttributes(data) {
      const anchor = data.Anchor && data.Anchor.length ? `#${data.Anchor}` : '';
      const href = `${data.Link}${anchor}`;

      return {
        href,
        target: data.TargetBlank ? '_blank' : '',
        title: data.Description,
      };
    },

    insertLinkInEditor(attributes, linkText) {
      const editor = this.getElement().getEditor();
      editor.insertLink(attributes, null, linkText);
      editor.addUndo();
      editor.repaint();

      // Workaround to editing a link that is just inserted issue.
      // What it does here is deselecting the link text in the editor
      setTimeout(() => tinymce.activeEditor.selection.collapse(), 0);
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
