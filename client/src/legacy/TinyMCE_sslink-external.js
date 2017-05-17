/* global tinymce, ss */
import i18n from 'i18n';
import TinyMCEActionRegistrar from 'lib/TinyMCEActionRegistrar';
import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider } from 'react-apollo';
import jQuery from 'jquery';
import { createInsertLinkModal } from 'containers/InsertLinkModal/InsertLinkModal';

// Link to external url
TinyMCEActionRegistrar.addAction('sslink', {
  text: i18n._t('Admin.LINKLABEL_EXTERNALURL', 'Link to external URL'),
  // eslint-disable-next-line no-console
  onclick: (editor) => editor.execCommand('sslinkexternal'),
});

const plugin = {
  init(editor) {
    editor.addCommand('sslinkexternal', () => {
      const field = window.jQuery(`#${editor.id}`).entwine('ss');

      field.openLinkExternalDialog();
    });
  },
};

const modalId = 'insert-link__dialog-wrapper--external';
const sectionConfigKey = 'SilverStripe\\Admin\\LeftAndMain';
const formName = 'EditorExternalLink';
const InsertLinkExternalModal = createInsertLinkModal(sectionConfigKey, formName);

jQuery.entwine('ss', ($) => {
  $('textarea.htmleditor').entwine({
    openLinkExternalDialog() {
      let dialog = $(`#${modalId}`);

      if (!dialog.length) {
        dialog = $(`<div id="${modalId}" />`);
        $('body').append(dialog);
      }
      dialog.addClass('insert-link__dialog-wrapper');

      dialog.setElement(this);
      dialog.open();
    },
  });

  /**
   * Assumes that $('.insert-link__dialog-wrapper').entwine({}); is defined for shared functions
   */
  $(`#${modalId}`).entwine({
    renderModal(show) {
      const store = ss.store;
      const client = ss.apolloClient;
      const handleHide = () => this.close();
      const handleInsert = (...args) => this.handleInsert(...args);
      const attrs = this.getOriginalAttributes();

      // create/update the react component
      ReactDOM.render(
        <ApolloProvider store={store} client={client}>
          <InsertLinkExternalModal
            show={show}
            onInsert={handleInsert}
            onHide={handleHide}
            title={i18n._t('Admin.LINK_EXTERNAL', 'Insert external link')}
            bodyClassName="modal__dialog"
            className="insert-link__dialog-wrapper--external"
            fileAttributes={attrs}
          />
        </ApolloProvider>,
        this[0]
      );
    },

    buildAttributes(data) {
      const attributes = this._super(data);

      let href = attributes.href;
      // Prefix the URL with "http://" if no prefix is found
      if (!href.match(/:\/\//)) {
        href = `${window.location.protocol}//${href}`;
      }
      // if it's just the hash, then remove the prefix
      href = href.replace(/:\/\/(#.*)$/, '$2');

      // if it is just the prefix, then leave it blank
      if (href.match(/:\/\/$/)) {
        href = '';
      }
      attributes.href = href;

      return attributes;
    },
  });
});

// Adds the plugin class to the list of available TinyMCE plugins
tinymce.PluginManager.add('sslinkexternal', (editor) => plugin.init(editor));

export default plugin;
