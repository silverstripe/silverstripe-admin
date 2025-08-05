/**
 * Functions for HtmlEditorFields in the back end.
 * Includes the JS for the ImageUpload forms.
 *
 * Relies on the jquery.form.js plugin to power the
 * ajax / iframe submissions
 */

import jQuery from 'jquery';
import 'events-polyfill';
import escapeRegExp from 'lodash.escaperegexp';

var ss = typeof window.ss !== 'undefined' ? window.ss : {};

/**
 * Wrapper for HTML WYSIWYG libraries, which abstracts library internals
 * from interface concerns like inserting and editing links.
 * Caution: Incomplete and unstable API.
 */
ss.editorWrappers = {};
ss.editorWrappers.tinyMCE = (function() {

  // ID of editor this is assigned to
  var editorID;

  return {
    /**
     * Initialise the editor
     *
     * @param {String} ID of parent textarea domID
     */
    init: function(ID) {
      editorID = ID;

      this.create();
    },

    /**
     * Remove the editor and cleanup
     */
    destroy: function() {
      tinymce.EditorManager.execCommand('mceRemoveEditor', false, editorID);
    },

    /**
     * Get TinyMCE Editor instance
     *
     * @returns Editor
     */
    getInstance: function() {
      return tinymce.EditorManager.get(editorID);
    },

    /**(
     * Invoked when a content-modifying UI is opened.
     */
    onopen: function() {
      // NOOP
    },

    /**(
     * Invoked when a content-modifying UI is closed.
     */
    onclose: function() {
      // NOOP
    },

    setHeight: function (event, height) {
      if (typeof height === 'undefined') {
        return;
      }
      if (event.target && event.target.iframeElement) {
        event.target.iframeElement.height = height !== '' ? 'auto' : height;
        const parentDiv = event.target.iframeElement.closest('.tox-sidebar-wrap');
        if (parentDiv) {
          parentDiv.style.height = height;
        }
      }
    },

    /**
     * Get config for this data
     *
     * @returns array
     */
    getConfig: function() {
      var selector = "#" + editorID,
        config = jQuery(selector).data('config'),
        height = config.row_height ? config.row_height : undefined,
        self = this;

      // Add instance specific data to config
      config.selector = selector;

      // Ensure save events write back to textarea
      config.setup = function(ed) {
        ed.on('dirty', function() {
          self.save();
        });
        ed.on('change', function() {
          self.save();
        });
        ed.on('init', (event) => {
          self.setHeight(event, height);
        });
        ed.on('ResizeEditor', (event) => {
          self.setHeight(event, '');
        });
      };
      return config;
    },

    /**
     * Write the HTML back to the original text area field.
     *
     * @param {object} options
     * @param {boolean} options.silent - suppress change event on the textarea
     */
    save: function(options = {}) {
      var instance = this.getInstance();
      instance.save();

      // Update change detection
      if(!options.silent) {
        jQuery(instance.getElement()).trigger("change");
        instance.getElement().dispatchEvent(new Event('input', { bubbles: true }));
      }
    },

    /**
     * Create a new instance based on a textarea field.
     */
    create: function() {
      let timeLastScrolled;
      let showAfterScrollFunc;
      let initialOffset;

      // Recalculate floatpanels (ie. image tools) absolute position then show it
      function showAfterScroll(panel, initialOffset) {
        // The position scrolled to
        const finalOffset = $(panel).scrollTop();

        // Reposition the floatpanels by length scrolled
        $('.mce-floatpanel').each((i, el) => {
          const oldPosition = parseFloat(el.style.top);
          $(el).css('top', `${oldPosition - (finalOffset - initialOffset)}px`);
        });
        $('.mce-floatpanel').css('opacity', '1');

        // Allow the floatpanels to be hidden again
        timeLastScrolled = undefined;
      };

      // Hide floatpanels (ie. image tools) while scrolling forms and
      // then recalculate position
      function hideOnScroll(e) {
        // Which element is being scrolled
        const panel = e.target;

        // If this is the first scroll event or the first one after 500ms
        if(!timeLastScrolled || ((new Date() - timeLastScrolled) / 100) > 500) {
          // Get the starting scroll position
          initialOffset = $(panel).scrollTop();
          $('.mce-floatpanel').css('opacity', '0');
        } else {
          // If this event is triggered before the 500ms timout reset the timeout
          window.clearTimeout(showAfterScrollFunc);
        }
        timeLastScrolled = new Date();
        // Set a function to trigger if no scrolling occurs within 500ms
        showAfterScrollFunc = window.setTimeout(() => showAfterScroll(panel, initialOffset), 500)
      }

      var config = this.getConfig();
      // hack to set baseURL safely
      if(typeof config.baseURL !== 'undefined') {
        tinymce.EditorManager.baseURL = config.baseURL;
      }

      config.skin = config.skin || 'silverstripe';

      // Bind the floatpanel hide and reposition listener to the closest scrollable panel
      tinymce.init(config).then((editors) => {
        if(editors.length > 0 && editors[0].container) {
          const scrollPanel = $(editors[0].container).closest('.panel--scrollable');
          scrollPanel.on('scroll', (e) => hideOnScroll(e));
        }
      });
    },

    /**
     * Request an update to editor content
     */
    repaint: function() {
      // NOOP
    },

    /**
     * @return boolean
     */
    isDirty: function() {
      return this.getInstance().isDirty();
    },

    /**
     * HTML representation of the edited content.
     *
     * Returns: {String}
     */
    getContent: function() {
      return this.getInstance().getContent();
    },

    getSelection: function() {
      const instance = this.getInstance();
      let selection = instance.selection.getSel().toString();
      return selection || '';
    },

    /**
     * DOM tree of the edited content
     *
     * Returns: DOMElement
     */
    getDOM: function() {
      return this.getInstance().getElement();
    },

    /**
     * Returns: DOMElement
     */
    getContainer: function() {
      return this.getInstance().getContainer();
    },

    /**
     * Get the closest node matching the current selection.
     *
     * Returns: {jQuery} DOMElement
     */
    getSelectedNode: function() {
      return this.getInstance().selection.getNode();
    },

    /**
     * Select the given node within the editor DOM
     *
     * Parameters: {DOMElement}
     */
    selectNode: function(node) {
      this.getInstance().selection.select(node);
    },

    /**
     * Replace entire content
     *
     * @param {String} html
     * @param {Object} opts
     */
    setContent: function(html, opts) {
      this.getInstance().setContent(html, opts);
    },

    /**
     * Insert content at the current caret position
     *
     * @param {String} html
     * @param {Object} opts
     */
    insertContent: function(html, opts) {
      this.getInstance().insertContent(html, opts);
    },
    /**
     * Replace currently selected content
     *
     * @param {String} html
     */
    replaceContent: function(html, opts) {
      this.getInstance().execCommand('mceReplaceContent', false, html, opts);
    },
    /**
     * Insert or update a link in the content area (based on current editor selection)
     *
     * Parameters: {Object} attrs
     */
    insertLink: function(attrs, opts, linkText) {
      if (linkText) {
        linkText = linkText.replaceAll('<', '&lt;').replaceAll('>', '&gt;');
        const linkEl = this.getInstance().dom.create('a', attrs, linkText);
        this.getInstance().selection.setNode(linkEl);
      } else {
        this.getInstance().execCommand("mceInsertLink", false, attrs, opts);
      }
    },
    /**
     * Remove the link from the currently selected node (if any).
     */
    removeLink: function() {
      this.getInstance().execCommand('unlink', false);
    },
    /**
     * Strip any editor-specific notation from link in order to make it presentable in the UI.
     *
     * Parameters:
     *  {Object}
     *  {DOMElement}
     */
    cleanLink: function(href, node) {
      var settings = this.getConfig,
        cb = settings['urlconverter_callback'],
        cu = tinyMCE.settings['convert_urls'];
      if(cb) href = eval(cb + "(href, node, true);");

      // Turn into relative, if set in TinyMCE config
      if(cu && href.match(new RegExp('^' + escapeRegExp(tinyMCE.settings['document_base_url']) + '(.*)$'))) {
        href = RegExp.$1;
      }

      // Get rid of TinyMCE's temporary URLs
      if(href.match(/^javascript:\s*mctmp/)) href = '';

      return href;
    },
    /**
     * Creates a bookmark for the currently selected range,
     * which can be used to reselect this range at a later point.
     * @return {mixed}
     */
    createBookmark: function() {
      return this.getInstance().selection.getBookmark();
    },
    /**
     * Selects a bookmarked range previously saved through createBookmark().
     * @param  {mixed} bookmark
     */
    moveToBookmark: function(bookmark) {
      this.getInstance().selection.moveToBookmark(bookmark);
      this.getInstance().focus();
    },
    /**
     * Removes any selection & de-focuses this editor
     */
    blur: function() {
      this.getInstance().selection.collapse();
    },
    /**
     * Add new undo point with the current DOM content.
     */
    addUndo: function() {
      this.getInstance().undoManager.add();
    }
  };
});
// Override this to switch editor wrappers
ss.editorWrappers['default'] = ss.editorWrappers.tinyMCE;

jQuery.entwine('ss', function($) {

  /**
   * Class: textarea.htmleditor
   *
   * Add tinymce to HtmlEditorFields within the CMS. Works in combination
   * with a TinyMCE.init() call which is prepopulated with the used HTMLEditorConfig settings,
   * and included in the page as an inline <script> tag.
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
