/* global tinymce */
import TinyMCEActionRegistrar from 'lib/TinyMCEActionRegistrar';

const plugin = {
  init(editor) {
    // Link to page dialog
    TinyMCEActionRegistrar.addAction('sslink', {
      text: 'Link to page',
      // eslint-disable-next-line no-console
      onclick: (e) => console.log('link to page', e),
    });

    // Replace the mceAdvLink and mceLink commands with the sslink command, and
    // the mceAdvImage and mceImage commands with the ssmedia command
    editor.on('BeforeExecCommand', (e) => {
      const cmd = e.command;
      const ui = e.ui;
      const val = e.value;
      if (cmd === 'mceAdvLink' || cmd === 'mceLink') {
        e.preventDefault();
        editor.execCommand('sslinkpage', ui, val);
      }
    });
  }
};

// Adds the plugin class to the list of available TinyMCE plugins
tinymce.PluginManager.add('sslinkpage', (editor) => plugin.init(editor));
export default plugin;
