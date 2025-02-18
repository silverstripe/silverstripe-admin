/**
 * Functions for HtmlEditorFields in the back end.
 * Includes the JS for the ImageUpload forms.
 *
 * Relies on the jquery.form.js plugin to power the
 * ajax / iframe submissions
 */

import jQuery from 'jquery';
import 'events-polyfill';

var ss = typeof window.ss !== 'undefined' ? window.ss : {};

/**
 * Wrapper for HTML WYSIWYG libraries, which abstracts library internals
 * from interface concerns like inserting and editing links.
 * Caution: Incomplete and unstable API.
 *
 * Editors must be registered in the editorWrappers object with a stateful callback
 * which itself returns an object with the following functions:
 * - init(id) - Initialise the editor, using the textarea with the ID passed in
 * - destroy() - Remove the editor and cleanup
 * - save(options = {}) - Write the HTML back to the original text area field
 * - isDirty() - Return boolean indicating whether there are unsaved changes or not
 * - getContent() - Return the HTML content
 * - getSelection() - Get the currently selected content
 * - selectByCssSelector(cssSelector) - Select some content based on a CSS selector
 * - setContent(value) - Set HTML content into the field
 * - insertContent(value) - Append some HTML content into the field
 * - prepValueForChangeTracker(value) - Prepare a value for use in the change tracker (e.g. pass it through the editor's sanitiser to strip any disallowed elements)
 *
 * e.g. ss.editorWrappers.MyEditor = (function () {
 *   // ID of the DOM element this editor is connected to
 *   let editorID;
 *   return {
 *     init(id) {
 *       editorID = id;
 *     },
 *     // ...
 *   };
 * });
 */
ss.editorWrappers = {
  // This is the TextAreaConfig used when no additional HTML editor module is installed.
  // It just uses a regular textarea DOM element to edit the HTML as raw text.
  textarea() {
    let editorID;
    let startValue;

    return {
      init(id) {
        editorID = id;
        const editor = jQuery(`#${editorID}`);
        editor.css('visibility', 'visible');
        startValue = editor.val();
      },

      destroy() {
        // no-op
      },

      save() {
        // no-op - the textarea IS the editor.
      },

      isDirty() {
        return jQuery(`#${editorID}`).val() === startValue;
      },

      getContent() {
        return jQuery(`#${editorID}`).val();
      },

      getSelection() {
        const textarea = jQuery(`#${editorID}`);
        const content = textarea.val();
        const startOffset = textarea[0].selectionStart;
        const endOffset = textarea[0].selectionEnd;
        return content.slice(startOffset, endOffset);
      },

      selectByCssSelector(cssSelector) {
        const textarea = jQuery(`#${editorID}`);
        const contentAsDom = jQuery(`<body>${textarea.val()}</body>`);
        if (contentAsDom.length === 0) {
          return;
        }
        const selectable = contentAsDom.find(cssSelector);
        if (selectable.length === 0) {
          return;
        }
        const valueOfSelectable = selectable[0].outerHTML;
        const offsetStart = textarea.val().indexOf(valueOfSelectable);
        textarea[0].focus();
        textarea[0].setSelectionRange(offsetStart, offsetStart + valueOfSelectable.length);
      },

      setContent(value) {
        jQuery(`#${editorID}`).val(value);
      },

      insertContent(value) {
        const field = jQuery(`#${editorID}`);
        field.val(`${field.val()}${value}`);
      },

      prepValueForChangeTracker(value) {
        return value;
      },
    };
  },
};

jQuery.entwine('ss', function($) {

  /**
   * Add the relevant editor to HtmlEditorFields within the CMS. Relies on ss.editorWrappers.
   */
  $('textarea.htmleditor').entwine({

    Editor: null,

    /**
     * Constructor: onmatch
     */
    onadd: function() {
      var edClass = this.data('editor') || 'default',
        ed = ss.editorWrappers[edClass]();
      this.setEditor(ed);

      ed.init(this.attr('id'));

      this._super();
    },

    onmatch: function() {
      if (!this.getEditor()) {
        this.onadd();
      }
      this._super();
    },

    /**
     * Destructor: onunmatch
     */
    onremove: function() {
      this.getEditor().destroy();
      this._super();
    },

    onunmatch: function() {
      if (this.getEditor()) {
        this.onremove();
      }
      this._super();
    },

    /**
     * Make sure the editor has flushed all it's buffers before the form is submitted.
     */
    'from .cms-edit-form': {
      onbeforesubmitform: function() {
        this.getEditor().save({ silent: true });
        this._super();
      }
    },

    /**
     * Triggers insert-link dialog
     * See editor_plugin_src.js
     */
    openLinkDialog: function() {
      this.openDialog('link');
    },

    /**
     * Triggers insert-media dialog
     * See editor_plugin_src.js
     */
    openMediaDialog: function() {
      this.openDialog('media');
    },

    /**
     * Triggers insert-embed dialog
     * See editor_plugin_src.js
     */
    openEmbedDialog: function() {
      this.openDialog('embed');
    },

    openDialog: function(type) {
      // Note: This requires asset-admin module
      if (type === 'media' && window.InsertMediaModal) {
        let dialog = $('#insert-media-react__dialog-wrapper');

        if (!dialog.length) {
          dialog = $('<div id="insert-media-react__dialog-wrapper" class="insert-link__dialog-wrapper" />');
          $('body').append(dialog);
        }

        dialog.setElement(this);
        dialog.open();
        return;
      }

      // Note: This requires asset-admin module
      if (type === 'embed' && window.InsertEmbedModal) {
        let dialog = $('#insert-embed-react__dialog-wrapper');

        if (!dialog.length) {
          dialog = $('<div id="insert-embed-react__dialog-wrapper" />');
          $('body').append(dialog);
        }

        dialog.setElement(this);
        dialog.open();
        return;
      }

      throw new Error(`Dialog named ${type} is not available.`);
    }
  });
});
