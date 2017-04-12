/* global tinymce, ss */
import TinyMCEActionRegistrar from 'lib/TinyMCEActionRegistrar';
import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider } from 'react-apollo';
import jQuery from 'jquery';
import InsertLinkExternalModal from 'containers/InsertLinkExternalModal/InsertLinkExternalModal';

// Link to external url
TinyMCEActionRegistrar.addAction('sslink', {
  text: 'Link to external URL',
  // eslint-disable-next-line no-console
  onclick: (editor) => editor.execCommand('sslinkexternal'),
});

const plugin = {
  init(editor) {
    editor.addCommand('sslinkexternal', () => {
      // See HtmlEditorField.js
      window.jQuery(`#${editor.id}`).entwine('ss').openLinkExternalDialog();
    });
  }
};

const modalId = 'insert-link__dialog-wrapper--external';
jQuery.entwine('ss', ($) => {
  $('textarea.htmleditor').entwine({
    openLinkExternalDialog() {
      let dialog = $(`#${modalId}`);

      if (!dialog.length) {
        dialog = $(`<div id="${modalId}" class="insert-link__dialog-wrapper" />`);
        $('body').append(dialog);
      }

      dialog.setElement(this);
      dialog.open();
      return;
    },
  });

  /**
   * Assumes that $('.insert-link__dialog-wrapper').entwine({}); is defined for shared functions
   */
  $(`#${modalId}`).entwine({
    _renderModal(show) {
      const store = ss.store;
      const client = ss.apolloClient;
      const handleHide = () => this.close();
      const handleInsert = (...args) => this._handleInsert(...args);
      const attrs = this.getOriginalAttributes();

      // create/update the react component
      ReactDOM.render(
        <ApolloProvider store={store} client={client}>
          <InsertLinkExternalModal
            show={show}
            onInsert={handleInsert}
            onHide={handleHide}
            bodyClassName="modal__dialog"
            className="insert-link__dialog-wrapper--external"
            fileAttributes={attrs}
          />
        </ApolloProvider>,
        this[0]
      );
    },

    _handleInsert(data) {

    },

    getOriginalAttributes() {
      const element = this.getElement();
      return {};
    },
  });
});

// Adds the plugin class to the list of available TinyMCE plugins
tinymce.PluginManager.add('sslinkexternal', (editor) => plugin.init(editor));

export default plugin;
