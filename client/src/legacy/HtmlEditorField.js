/**
 * Functions for HtmlEditorFields in the back end.
 * Includes the JS for the ImageUpload forms.
 *
 * Relies on the jquery.form.js plugin to power the
 * ajax / iframe submissions
 */

import jQuery from 'jquery';
import i18n from 'i18n';

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

    /**
     * Get config for this data
     *
     * @returns array
     */
    getConfig: function() {
      var selector = "#" + editorID,
        config = jQuery(selector).data('config'),
        self = this;

      // Add instance specific data to config
      config.selector = selector;

      // Ensure save events write back to textarea
      config.setup = function(ed) {
        ed.on('change', function() {
          self.save();
        });
      };
      return config;
    },

    /**
     * Write the HTML back to the original text area field.
     */
    save: function() {
      var instance = this.getInstance();
      instance.save();

      // Update change detection
      jQuery(instance.getElement()).trigger("change");
    },

    /**
     * Create a new instance based on a textarea field.
     */
    create: function() {
      var config = this.getConfig();
      // hack to set baseURL safely
      if(typeof config.baseURL !== 'undefined') {
        tinymce.EditorManager.baseURL = config.baseURL;
      }
      tinymce.init(config);
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
    insertLink: function(attrs, opts) {
      this.getInstance().execCommand("mceInsertLink", false, attrs, opts);
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
      if(cu && href.match(new RegExp('^' + tinyMCE.settings['document_base_url'] + '(.*)$'))) {
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

    /**
     * Destructor: onunmatch
     */
    onremove: function() {
      this.getEditor().destroy();
      this._super();
    },

    /**
     * Make sure the editor has flushed all it's buffers before the form is submitted.
     */
    'from .cms-edit-form': {
      onbeforesubmitform: function() {
        this.getEditor().save();
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
          dialog = $('<div id="insert-media-react__dialog-wrapper" />');
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

      var capitalize = function(text) {
        return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
      };

      var self = this,
        url = $('#cms-editor-dialogs').data('url' + capitalize(type) + 'form'),
        dialog = $('.htmleditorfield-' + type + 'dialog');

      if (!url) {
        if (type === 'media') {
          throw new Error("Install silverstripe/asset-admin to use media dialog")
        }
        throw new Error(`Dialog named ${type} is not available.`);
      }

      if(dialog.length) {
        // Clean existing dialog for reload
        dialog.getForm().setElement(this);
        dialog.html('');
        dialog.addClass('loading');
        dialog.open();
      } else {
        // Show a placeholder for instant feedback. Will be replaced with actual
        // form dialog once its loaded.
        dialog = $('<div class="htmleditorfield-dialog htmleditorfield-' + type + 'dialog loading">');
        $('body').append(dialog);
      }

      $.ajax({
        url: url,
        complete: function() {
          dialog.removeClass('loading');
        },
        success: function(html) {
          dialog.html(html);
          dialog.getForm().setElement(self);
          dialog.trigger('ssdialogopen');
        }
      });
    }
  });

  $('.htmleditorfield-dialog').entwine({
    onadd: function() {

      // Create jQuery dialog
      if (!this.is('.ui-dialog-content')) {
        this.ssdialog({
          autoOpen: true,
          buttons: {
            'insert': {
              text: i18n._t(
                'Admin.INSERT',
                'Insert'
              ),
              'data-icon': 'accept',
              class: 'btn action btn-primary media-insert',
              click: function() {
                $(this).find('form').submit();
              }
            }
          }
        });
      }

      this._super();
    },

    getForm: function() {
      return this.find('form');
    },
    open: function() {
      this.ssdialog('open');
    },
    close: function() {
      this.ssdialog('close');
    },
    toggle: function(bool) {
      if(this.is(':visible')) this.close();
      else this.open();
    },
    onscroll: function () {
      this.animate({
        scrollTop: this.find('form').height()
      }, 500);
    }
  });

  /**
   * Base form implementation for interactions with an editor instance,
   * mostly geared towards modification and insertion of content.
   */
  $('form.htmleditorfield-form').entwine({
    Selection: null,

    // Implementation-dependent serialization of the current editor selection state
    Bookmark: null,

    // DOMElement pointing to the currently active textarea
    Element: null,

    setSelection: function(node) {
      return this._super($(node));
    },

    onadd: function() {
      // Move title from headline to (jQuery compatible) title attribute
      var titleEl = this.find(':header:first');
      this.getDialog().attr('title', titleEl.text());

      this._super();
    },
    onremove: function() {
      this.setSelection(null);
      this.setBookmark(null);
      this.setElement(null);

      this._super();
    },

    getDialog: function() {
      // TODO Refactor to listen to form events to remove two-way coupling
      return this.closest('.htmleditorfield-dialog');
    },

    fromDialog: {
      onssdialogopen: function(){
        var ed = this.getEditor();

        this.setSelection(ed.getSelectedNode());
        this.setBookmark(ed.createBookmark());

        ed.blur();

        this.find(':input:not(:submit)[data-skip-autofocus!="true"]')
          .filter(':visible:enabled')
          .eq(0)
          .focus();

        this.redraw();
        this.updateFromEditor();
      },

      onssdialogclose: function(){
        var ed = this.getEditor();

        ed.moveToBookmark(this.getBookmark());

        this.setSelection(null);
        this.setBookmark(null);

        this.resetFields();
      }
    },

    /**
     * @return Object ss.editorWrapper instance
     */
    getEditor: function(){
      return this.getElement().getEditor();
    },

    modifySelection: function(callback) {
      var ed = this.getEditor();

      ed.moveToBookmark(this.getBookmark());
      callback.call(this, ed);

      this.setSelection(ed.getSelectedNode());
      this.setBookmark(ed.createBookmark());

      ed.blur();
    },

    updateFromEditor: function() {
      /* NOP */
    },
    redraw: function() {
      /* NOP */
    },
    resetFields: function() {
      // Flush the tree drop down fields, as their content might get changed in other parts of the CMS, ie in Files and images
      this.find('.tree-holder').empty();
    }
  });

  /**
   * Inserts and edits links in an html editor, including internal/external web links,
   * links to files on the webserver, email addresses, and anchors in the existing html content.
   * Every variation has its own fields (e.g. a "target" attribute doesn't make sense for an email link),
   * which are toggled through a type dropdown. Variations share fields, so there's only one "title" field in the form.
   */
  $('form.htmleditorfield-linkform').entwine({

    // TODO Entwine doesn't respect submits triggered by ENTER key
    onsubmit: function(e) {
      this.insertLink();
      this.getDialog().close();
      return false;
    },
    resetFields: function() {
      this._super();

      // Reset the form using a native call. This will also correctly reset checkboxes and radio buttons.
      this[0].reset();
    },
    redraw: function() {
      this._super();

      var linkType = this.find(':input[name=LinkType]:checked').val();

      this.addAnchorSelector();

      this.resetFileField();

      // Toggle field visibility depending on the link type.
      this.find('.step2').nextAll('.field').not('.field[id$="' + linkType +'_Holder"]').hide();
      this.find('.field[id$="LinkType_Holder"]').attr('style', 'display: -webkit-flex; display: flex');
      this.find('.field[id$="' + linkType +'_Holder"]').attr('style', 'display: -webkit-flex; display: flex');

      if(linkType == 'internal' || linkType == 'anchor') {
        this.find('.field[id$="Anchor_Holder"]').attr('style', 'display: -webkit-flex; display: flex');
      }

      if(linkType == 'email') {
        this.find('.field[id$="Subject_Holder"]').attr('style', 'display: -webkit-flex; display: flex');
      } else {
        this.find('.field[id$="TargetBlank_Holder"]').attr('style', 'display: -webkit-flex; display: flex');
      }

      if(linkType == 'anchor') {
        this.find('.field[id$="AnchorSelector_Holder"]').attr('style', 'display: -webkit-flex; display: flex');
      }
      this.find('.field[id$="Description_Holder"]').attr('style', 'display: -webkit-flex; display: flex');
    },
    /**
     * @return Object Keys: 'href', 'target', 'title'
     */
    getLinkAttributes: function() {
      var href,
        target = null,
        subject = this.find(':input[name=Subject]').val(),
        anchor = this.find(':input[name=Anchor]').val();

      // Determine target
      if(this.find(':input[name=TargetBlank]').is(':checked')) {
        target = '_blank';
      }

      // All other attributes
      switch(this.find(':input[name=LinkType]:checked').val()) {
        case 'internal':
          href = '[sitetree_link,id=' + this.find(':input[name=internal]').val() + ']';

          if(anchor) {
            href += '#' + anchor;
          }

          break;

        case 'anchor':
          href = '#' + anchor;
          break;

        case 'file':
          var fileid = this.find(':input[name=file]').val();
          href = fileid ? '[file_link,id=' + fileid + ']' : '';
          break;

        case 'email':
          href = 'mailto:' + this.find(':input[name=email]').val();
          if(subject) {
            href += '?subject=' + encodeURIComponent(subject);
          }
          target = null;
          break;

        // case 'external':
        default:
          href = this.find(':input[name=external]').val();
          // Prefix the URL with "http://" if no prefix is found
          if(href.indexOf('://') == -1) href = 'http://' + href;
          break;
      }

      return {
        href : href,
        target : target,
        title : this.find(':input[name=Description]').val()
      };
    },
    insertLink: function() {
      this.modifySelection(function(ed){
        ed.insertLink(this.getLinkAttributes());
      });
    },
    removeLink: function() {
      this.modifySelection(function(ed){
        ed.removeLink();
      });

      this.resetFileField();
      this.close();
    },

    resetFileField: function() {
      // If there's an attached item, remove it
      var fileField = this.find('.ss-uploadfield[id$="file_Holder"]'),
        fileUpload = fileField.data('fileupload'),
        currentItem = fileField.find('.ss-uploadfield-item[data-fileid]');

      if(currentItem.length) {
        fileUpload._trigger('destroy', null, {context: currentItem});
        fileField.find('.ss-uploadfield-addfile').removeClass('borderTop');
      }
    },

    /**
     * Builds an anchor selector element and injects it into the DOM next to the anchor field.
     */
    addAnchorSelector: function() {
      // Avoid adding twice
      if(this.find(':input[name=AnchorSelector]').length) return;

      var self = this;
      var anchorSelector = $(
        '<select id="Form_EditorToolbarLinkForm_AnchorSelector" name="AnchorSelector"></select>'
      );
      this.find(':input[name=Anchor]').parent().append(anchorSelector);

      // Initialise the anchor dropdown.
      this.updateAnchorSelector();

      // copy the value from dropdown to the text field
      anchorSelector.change(function(e) {
        self.find(':input[name="Anchor"]').val($(this).val());
      });
    },

    /**
     * Fetch relevant anchors, depending on the link type.
     *
     * @return $.Deferred A promise of an anchor array, or an error message.
     */
    getAnchors: function() {
      var linkType = this.find(':input[name=LinkType]:checked').val();
      var dfdAnchors = $.Deferred();

      switch (linkType) {
        case 'anchor':
          // Fetch from the local editor.
          var collectedAnchors = [];
          var ed = this.getEditor();
          // name attribute is defined as CDATA, should accept all characters and entities
          // http://www.w3.org/TR/1999/REC-html401-19991224/struct/links.html#h-12.2

          if(ed) {
            var raw = ed.getContent()
              .match(/\s+(name|id)\s*=\s*(["'])([^\2\s>]*?)\2|\s+(name|id)\s*=\s*([^"']+)[\s +>]/gim);
            if (raw && raw.length) {
              for(var i = 0; i < raw.length; i++) {
                var indexStart = (raw[i].indexOf('id=') == -1) ? 7 : 5;
                collectedAnchors.push(raw[i].substr(indexStart).replace(/"$/, ''));
              }
            }
          }

          dfdAnchors.resolve(collectedAnchors);
          break;

        case 'internal':
          // Fetch available anchors from the target internal page.
          var pageId = this.find(':input[name=internal]').val();

          if (pageId) {
            $.ajax({
              url: $.path.addSearchParams(
                this.attr('action').replace('LinkForm', 'getanchors'),
                {'PageID': parseInt(pageId)}
              ),
              success: function(body, status, xhr) {
                dfdAnchors.resolve($.parseJSON(body));
              },
              error: function(xhr, status) {
                dfdAnchors.reject(xhr.responseText);
              }
            });
          } else {
            dfdAnchors.resolve([]);
          }
          break;

        default:
          // This type does not support anchors at all.
          dfdAnchors.reject(i18n._t(
            'Admin.ANCHORSNOTSUPPORTED',
            'Anchors are not supported for this link type.'
          ));
          break;
      }

      return dfdAnchors.promise();
    },

    /**
     * Update the anchor list in the dropdown.
     */
    updateAnchorSelector: function() {
      var self = this;
      var selector = this.find(':input[name=AnchorSelector]');
      var dfdAnchors = this.getAnchors();

      // Inform the user we are loading.
      selector.empty();
      selector.append($(
        '<option value="" selected="1">' +
        i18n._t('Admin.LOOKINGFORANCHORS', 'Looking for anchors...') +
        '</option>'
      ));

      dfdAnchors.done(function(anchors) {
        selector.empty();
        selector.append($(
          '<option value="" selected="1">' +
          i18n._t('Admin.SelectAnchor') +
          '</option>'
        ));

        if (anchors) {
          for (var j = 0; j < anchors.length; j++) {
            selector.append($('<option value="'+anchors[j]+'">'+anchors[j]+'</option>'));
          }
        }

      }).fail(function(message) {
        selector.empty();
        selector.append($(
          '<option value="" selected="1">' +
          message +
          '</option>'
        ));
      });

      // Poke the selector for IE8, otherwise the changes won't be noticed.
      if ($.browser.msie) selector.hide().show();
    },

    /**
     * Updates the state of the dialog inputs to match the editor selection.
     * If selection does not contain a link, resets the fields.
     */
    updateFromEditor: function() {
      var htmlTagPattern = /<\S[^><]*>/g, fieldName, data = this.getCurrentLink();

      if(data) {
        for(fieldName in data) {
          var el = this.find(':input[name=' + fieldName + ']'), selected = data[fieldName];
          // Remove html tags in the selected text that occurs on IE browsers
          if(typeof(selected) == 'string') selected = selected.replace(htmlTagPattern, '');

          // Set values and invoke the triggers (e.g. for TreeDropdownField).
          if(el.is(':checkbox')) {
            el.prop('checked', selected).change();
          } else if(el.is(':radio')) {
            el.val([selected]).change();
          } else {
            el.val(selected).change();
          }
        }
      }
    },

    /**
     * Return information about the currently selected link, suitable for population of the link form.
     *
     * Returns null if no link was currently selected.
     */
    getCurrentLink: function() {
      var selectedEl = this.getSelection(),
        href = "", target = "", title = "", action = "insert", style_class = "";

      // We use a separate field for linkDataSource from tinyMCE.linkElement.
      // If we have selected beyond the range of an <a> element, then use use that <a> element to get the link data source,
      // but we don't use it as the destination for the link insertion
      var linkDataSource = null;
      if(selectedEl.length) {
        if(selectedEl.is('a')) {
          // Element is a link
          linkDataSource = selectedEl;
        // TODO Limit to inline elements, otherwise will also apply to e.g. paragraphs which already contain one or more links
        // } else if((selectedEl.find('a').length)) {
          //   // Element contains a link
          //   var firstLinkEl = selectedEl.find('a:first');
          //   if(firstLinkEl.length) linkDataSource = firstLinkEl;
        } else {
          // Element is a child of a link
          linkDataSource = selectedEl = selectedEl.parents('a:first');
        }
      }
      if(linkDataSource && linkDataSource.length) this.modifySelection(function(ed){
        ed.selectNode(linkDataSource[0]);
      });

      // Is anchor not a link
      if (!linkDataSource.attr('href')) linkDataSource = null;

      if (linkDataSource) {
        href = linkDataSource.attr('href');
        target = linkDataSource.attr('target');
        title = linkDataSource.attr('title');
        style_class = linkDataSource.attr('class');
        href = this.getEditor().cleanLink(href, linkDataSource);
        action = "update";
      }

      if(href.match(/^mailto:(.*)$/)) {
        return {
          LinkType: 'email',
          email: RegExp.$1,
          Description: title
        };
      } else if(href.match(/^(assets\/.*)$/) || href.match(/^\[file_link\s*(?:\s*|%20|,)?id=([0-9]+)\]?(#.*)?$/)) {
        return {
          LinkType: 'file',
          file: RegExp.$1,
          Description: title,
          TargetBlank: target ? true : false
        };
      } else if(href.match(/^#(.*)$/)) {
        return {
          LinkType: 'anchor',
          Anchor: RegExp.$1,
          Description: title,
          TargetBlank: target ? true : false
        };
      } else if(href.match(/^\[sitetree_link(?:\s*|%20|,)?id=([0-9]+)\]?(#.*)?$/i)) {
        return {
          LinkType: 'internal',
          internal: RegExp.$1,
          Anchor: RegExp.$2 ? RegExp.$2.substr(1) : '',
          Description: title,
          TargetBlank: target ? true : false
        };
      } else if(href) {
        return {
          LinkType: 'external',
          external: href,
          Description: title,
          TargetBlank: target ? true : false
        };
      } else {
        // No link/invalid link selected.
        return null;
      }
    }
  });

  $('form.htmleditorfield-linkform input[name=LinkType]').entwine({
    onclick: function(e) {
      this.parents('form:first').redraw();
      this._super();
    },
    onchange: function() {
      this.parents('form:first').redraw();

      // Update if a anchor-supporting link type is selected.
      var linkType = this.parent().find(':checked').val();
      if (linkType==='anchor' || linkType==='internal') {
        this.parents('form.htmleditorfield-linkform').updateAnchorSelector();
      }
      this._super();
    }
  });

  $('form.htmleditorfield-linkform input[name=internal]').entwine({
    /**
     * Update the anchor dropdown if a different page is selected in the "internal" dropdown.
     */
    onvalueupdated: function() {
      this.parents('form.htmleditorfield-linkform').updateAnchorSelector();
      this._super();
    }
  });

  $('form.htmleditorfield-linkform :submit[name=action_remove]').entwine({
    onclick: function(e) {
      this.parents('form:first').removeLink();
      this._super();
      return false;
    }
  });
});
