/* global tinymce */
import TinyMCEActionRegistrar from 'lib/TinyMCEActionRegistrar';

const plugin = {
  init(editor) {
    // Link to file url
    TinyMCEActionRegistrar.addAction('sslink', {
      text: 'Link to file',
      // eslint-disable-next-line no-console
      onclick: (e) => console.log('link to file', e),
    });
  }
};

// Adds the plugin class to the list of available TinyMCE plugins
tinymce.PluginManager.add('sslinkfile', (editor) => plugin.init(editor));
export default plugin;
