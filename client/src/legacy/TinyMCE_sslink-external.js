/* global tinymce, window */
import i18n from 'i18n';
import TinyMCEActionRegistrar from 'lib/TinyMCEActionRegistrar';
import React from 'react';
import { createRoot } from 'react-dom/client';
import jQuery from 'jquery';
import { createInsertLinkModal } from 'containers/InsertLinkModal/InsertLinkModal';
import { loadComponent } from 'lib/Injector';

const plugin = {
  init(editor) {
    // Add "Link to external url" to link menu for this editor
    TinyMCEActionRegistrar.addAction('sslink', {
      text: i18n._t('Admin.LINKLABEL_EXTERNALURL', 'Link to external URL'),
      onAction: (editorInst) => editorInst.execCommand('sslinkexternal'),
      priority: 70,
    }, editor.getParam('editorIdentifier'));

    // Add a command that corresponds with the above menu item
    editor.addCommand('sslinkexternal', () => {
      const field = window.jQuery(`#${editor.id}`).entwine('ss');

      field.openLinkExternalDialog();
    });
  },
};

const modalId = 'insert-link__dialog-wrapper--external';
const sectionConfigKey = 'SilverStripe\\Admin\\LeftAndMain';
const formName = 'EditorExternalLink';
const InsertLinkExternalModal = loadComponent(createInsertLinkModal(sectionConfigKey, formName));

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
    ReactRoot: null,

    renderModal(isOpen) {
      const handleHide = () => this.close();
      const handleInsert = (...args) => this.handleInsert(...args);
      const attrs = this.getOriginalAttributes();
      const requireLinkText = this.getRequireLinkText();

      // create/update the react component
      let root = this.getReactRoot();
      if (!root) {
        root = createRoot(this[0]);
        this.setReactRoot(root);
      }
      root.render(
        <InsertLinkExternalModal
          isOpen={isOpen}
          onInsert={handleInsert}
          onClosed={handleHide}
          title={i18n._t('Admin.LINK_EXTERNAL', 'Insert external link')}
          bodyClassName="modal__dialog"
          className="insert-link__dialog-wrapper--external"
          fileAttributes={attrs}
          identifier="Admin.InsertLinkExternalModal"
          requireLinkText={requireLinkText}
        />
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
      href = href.replace(/.*:\/\/(#.*)$/, '$1');

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
