/* global tinymce */
import TinyMCEActionRegistrar from 'lib/TinyMCEActionRegistrar';

const plugin = {
  init(editor) {
    // Link to email
    TinyMCEActionRegistrar.addAction('sslink', {
      text: 'Link to an email address',
      // eslint-disable-next-line no-console
      onclick: (e) => console.log('email', e),
    });
  }
};

// Adds the plugin class to the list of available TinyMCE plugins
tinymce.PluginManager.add('sslinkemail', (editor) => plugin.init(editor));
export default plugin;
