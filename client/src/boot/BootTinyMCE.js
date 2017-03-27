import TinyMCEActionRegistrar from 'lib/TinyMCEActionRegistrar';

/**
 * Register all default tinymce actions
 */
class BootTinyMCE {
  static start() {
    // Link to page dialog
    TinyMCEActionRegistrar.addAction('sslink', {
      text: 'Link to page',
      // eslint-disable-next-line no-alert
      onclick: () => alert('link to page'),
    });

    // Link to external url
    TinyMCEActionRegistrar.addAction('sslink', {
      text: 'Link to external URL',
      // eslint-disable-next-line no-alert
      onclick: () => alert('external url'),
    });

    // Link to email
    TinyMCEActionRegistrar.addAction('sslink', {
      text: 'Link to an email address',
      // eslint-disable-next-line no-alert
      onclick: () => alert('email'),
    });
  }
}

export default BootTinyMCE;
