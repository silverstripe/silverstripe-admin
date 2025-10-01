import $ from 'jquery';
import i18n from 'i18n';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { loadComponent } from 'lib/Injector';

import '../../../thirdparty/jquery-ui/jquery-ui.js';
import '../../../thirdparty/jquery-entwine/jquery.entwine.js';

$.entwine('ss', function($) {
  $('.grid-field').entwine({
    onmatch: function () {
      if (this.needsColumnFix()) {
        this.fixColumns();
      }

      this.fixShowFilters();

      if (this.is('.grid-field--lazy-loadable') && (
        (this.closest('.ss-tabset, .cms-tabset').length === 0) || (this.data('gridfield-lazy-load-state') === 'force') )
      ) {
        // If our GridField is not inside a tabset for an immidiate reload
        this.data('gridfield-lazy-load-state', 'ready');
        this.lazyload();
      }

      this.data('gridfield-lazy-load-state', 'ready');
    },

    fixShowFilters: function() {
      if (this.hasFilters()) {
        this.addClass('show-filter');
      } else {
        this.removeClass('show-filter');
      }
    },

    /**
     * @func Trigger a lazy load on this gridfield
     */
    lazyload: function() {
      if (this.data('gridfield-lazy-load-state') !== 'ready') {
        this.data('gridfield-lazy-load-state', 'force');
      } else {
        this.removeClass('grid-field--lazy-loadable').addClass('grid-field--lazy-loaded');
        this.reload();
      }

    },

    /**
     * @param {Object} Additional options for jQuery.ajax() call
     * @param {successCallback} callback to call after reloading succeeded.
     */
    reload: function(ajaxOpts, successCallback) {
      var self = this, form = this.closest('form'),
        focusedElName = this.find(':input:focus').attr('name'), // Save focused element for restoring after refresh
        data = form.find(':input:not(.cms-content-filters :input, .relation-search)').serializeArray(),
        tbody = this.find('tbody'),
        colspan = this.find('.grid-field__title-row th').attr('colspan');
      ;

      if(!ajaxOpts) ajaxOpts = {};
      if(!ajaxOpts.data) ajaxOpts.data = [];
      ajaxOpts.data = ajaxOpts.data.concat(data);


      // Include any GET parameters from the current URL, as the view state might depend on it.
      // For example, a list prefiltered through external search criteria might be passed to GridField.
      if(window.location.search) {
        let searchParams = window.location.search.replace(/^\?/, '').split('&');
        for (let i = 0; i < searchParams.length; i++) {
          let parts = searchParams[i].split('=');
          if (parts.length == 2) {
            ajaxOpts.data.push({name: decodeURIComponent(parts[0]), value: decodeURIComponent(parts[1])});
          }
        }
      }

      // Enable loading animation
      tbody.find('tr').remove();
      var loadingCell = $('<td />')
        .addClass('ss-gridfield-item loading')
        .attr('colspan', colspan);
      tbody.append($('<tr />').append(loadingCell));

      var request = $.ajax($.extend({}, {
        headers: {"X-Pjax" : 'CurrentField'},
        type: "POST",
        url: this.data('url'),
        dataType: 'html',
        success: function (data) {
          // Replace the grid field with response, not the form.
          // It doesn't retrigger the onmatch() on the main container.
          self.empty().append($(data).children());

          // Refocus previously focused element. Useful e.g. for finding+adding
          // multiple relationships via keyboard.
          if(focusedElName) self.find(':input[name="' + focusedElName + '"]').focus();

          if(successCallback) successCallback.apply(this, arguments);
          self.trigger('reload', self);

          // Trigger change if it's not specifically supressed
          if (ajaxOpts.data[0].triggerChange !== false) {
            self.trigger('change');
          }
        },
        error: function(e) {
          alert(i18n._t('Admin.ERRORINTRANSACTION'));
        },
        complete: function(request, status) {
          self.find('.loading').removeClass('loading');
          self.fixShowFilters();
        }
      }, ajaxOpts));
    },
    showDetailView: function(url, event) {
      this.openUrl(event, url, () => window.location.href = url);
    },
    openUrl: function(event, url, openInSameTabCallback) {
      if (event && (event.metaKey || event.ctrlKey || event.shiftKey)) {
        const newtab = window.open(url, '_blank');
        newtab.focus();
      } else {
        openInSameTabCallback();
      }
    },
    getItems: function() {
      return this.find('.ss-gridfield-item');
    },
    /**
     * @param {String}
     * @param {Mixed}
     */
    setState: function(k, v) {
      var state = this.getState();
      state[k] = v;
      this.find(':input[name="' + this.data('name') + '[GridState]"]').val(JSON.stringify(state));
    },
    /**
     * @return {Object}
     */
    getState: function() {
      const rawState = this.find(':input[name="' + this.data('name') + '[GridState]"]').val();
      if (!rawState) {
        return {};
      }
      return JSON.parse(rawState);
    },

    /**
     * @returns {Boolean}
     */
    hasFilters: function() {
      if (this.getState().GridFieldFilterHeader) {
        return true;
      }
      return false;
    },

    needsColumnFix: function() {
      return (
        this.find('.cms-content-filters').length &&
        !this.find('.grid-field__col-compact').length &&
        !this.find('th.col-Actions').length
      );
    },

    // Adds an actions column for the search action if it does not exist already
    fixColumns: function (visible) {
      this.find('.sortable-header').append('<th class="main col-Actions" />');
      this.find('tbody tr').each(function () {
        var cell = $(this).find('td:last');
        // Note we need to add 1 to the current column span, because we're going to add a new column
        var colspan = cell.attr('colspan') ?? 1;
        cell.attr('colspan', Number(colspan) + 1);
      });
    },

    /**
     * This will first retrieve state of the gridfield which is generated by PHP and sent to the
     * browser as HTML via PJAX and stored in the data-schema attribute on all of the '3 dots'
     * elements on each gridfield row
     *
     * It will then update the browser location with the new state of the gridfield using
     * window.ss.router
     *
     * This allows users to bookmark different views in the CMS
     */
    keepStateInHistory: function() {
      const newSchema = $(this).find('.gridfield-actionmenu__container').data('schema');
      const gridFieldName = $(this).data('name');
      if (newSchema && newSchema.length > 0) {
        newSchema.filter( e => {
          if (e.type === 'link') {
            const urlQueryString = this.buildUrlQueryString(e.url, gridFieldName);
            const url = window.location.pathname + urlQueryString;
            window.ss.router.replace(url, undefined, undefined, false);
          }
        })
      }
    },

    /**
     * Builds a url query string from the existing query string in window.location
     * and overrides it with the params from the query string in the pjaxUrl param
     *
     * For any query string params that relate to the gridState of the gridFieldName, only
     * take these from the pjaxUrl param
     *
     * @param {string} url
     * @returns string
     */
    buildUrlQueryString: function(pjaxUrl, gridFieldName) {
      const locationObj = {};
      for (const param of window.location.search.replace(/^\?/, '').split('&')) {
        const [key, val] = param.split('=');
        // This regex will naively match the gridfield number \-[0-9]$, so if there are multiple
        // gridfields with the same name (i.e. class) on the screen, it will be overly
        // aggressive in removing their state. This limitation is because I couldn't find an
        // easy way to extract the gridfield number from the gridfield
        if (key.match(new RegExp(`^gridState\\-${gridFieldName}\\-[0-9]$`))) {
          continue;
        }
        locationObj[key] = val;
      }
      const pjaxUrlObj = {};
      const link = [window.location.origin, pjaxUrl].join('/');
      const searchParams = (new URL(link)).searchParams;
      for (const [key, val] of searchParams.entries()) {
        pjaxUrlObj[key] = val;
      }
      const retObj = Object.assign(locationObj, pjaxUrlObj);
      const retArr = [];
      for (const key in retObj) {
        if (key === '') {
          continue;
        }
        const val = encodeURIComponent(retObj[key]);
        retArr.push([key, val].join('='));
      }
      return retArr.length === 0 ? '' : '?' + retArr.join('&');
    },

    /**
     * Update the gridstate that is stored in the URL
     * Pass in a callback that will modify the JSON object that is stored in the URL
     * for instaed to update the sort order of a MyObject gridfield:
     *
     * const callback = (obj) => obj.SortColumn = 'FirstName';
     * jQuery('#some-gridfield').updateUrlGridState(callback);
     *
     * @param {function} callback
     * @returns void
     */
    updateUrlGridState: function (callback) {
      const pairs = [];
      const searchParams = window.location.search.replace(/^\?/, '').split('&');
      for (let i = 0; i < searchParams.length; i++) {
        let pair = searchParams[i]
        const parts = pair.split('=');
        console.log(this.data('name'));
        if (parts.length === 2) {
          const key = decodeURIComponent(parts[0]);
          let value = decodeURIComponent(parts[1]);
          if (key.indexOf('gridState-' + this.data('name')) === 0) {
            const obj = JSON.parse(value);
            callback(obj);
            value = JSON.stringify(obj);
          }
          pair = encodeURIComponent(key) + '=' + encodeURIComponent(value);
        }
        pairs.push(pair)
      }
      const url = window.location.origin + window.location.pathname + '?' + pairs.join('&');
      window.ss.router.replace(url, undefined, undefined, false);
    }
  });

  $('.grid-field *').entwine({
    getGridField: function() {
      return this.closest('.grid-field');
    }
  });

  $('.gridfield-actionmenu__container').entwine({
    Timer: null,
    Component: null,
    Actions: null,
    ReactRoot: null,

    onmatch() {
      this._super();

      let actions = [];

      $('.action-menu--handled', this.parent()).each(function () {
        const action = $(this).detach();
        actions.push(action);
      });

      this.setActions(actions);

      const cmsContent = this.closest('.cms-content').attr('id');
      const context = (cmsContent)
        ? { context: cmsContent }
        : {};

      const GridFieldActions = loadComponent('GridFieldActions', context);
      this.setComponent(GridFieldActions);

      this.refresh();
    },

    onunmatch() {
      this._super();
      const root = this.getReactRoot();
      if (root) {
        root.unmount();
        this.setReactRoot(null);
      }

      const actions = this.getActions();
      const actionContainer = this.parent();
      if (actions) {
        $(actions).each(function () {
          $(this).appendTo(actionContainer);
        });
      }
    },

    refresh() {
      const schema = this.data('schema');

      const GridFieldActions = this.getComponent();

      let root = this.getReactRoot();
      if (!root) {
        root = createRoot(this[0]);
      }
      root.render(
        <GridFieldActions schema={schema} />
      );
      this.setReactRoot(root);
    },
  })

  $('.grid-field :button[name=showFilter]').entwine({
    /**
     * Overrides showHide function in LeftAndMain.js
     */
    showHide() {
      this.closest('.grid-field').toggleClass('show-filter');
      this._super();
      // `jQuery(this)` has to be used instead of `this` or `$(this)` or else it won't work for some reason
      jQuery(this).toggle();
    },
  });

  $('.grid-field .ss-gridfield-item').entwine({
    onclick: function (event) {
      if ($(event.target).closest('.action-menu__toggle').length) {
        this._super(event);
        return false;
      }

      if($(event.target).closest('.action').length) {
        this._super(event);
        return false;
      }

      var formLink = this.find('.edit-link, .view-link');
      if(formLink.length) {
        this.getGridField().showDetailView(formLink.prop('href'), event);
      }
    },
    onmouseover: function() {
      if(this.find('.edit-link, .view-link').length) this.css('cursor', 'pointer');
    },
    onmouseout: function() {
      this.css('cursor', 'default');
    }
  });

  $('.grid-field .action.action_import:button').entwine({
    onclick: function(e) {
      e.preventDefault();
      this.openmodal();
    },
    onmatch: function() {
      this._super();
      // Trigger auto-open
      if (this.data('state') === 'open') {
        this.openmodal();
      }
    },
    onunmatch: function() {
      this._super();
    },

    openmodal: function() {
      // Remove existing modal
      let modal = $(this.data('target'));
      let newModal = $(this.data('modal'));
      if (modal.length < 1) {
        // Add modal to end of body tag
        modal = newModal;
        modal.appendTo(document.body);
      } else {
        // Replace inner content
        modal.innerHTML = newModal.innerHTML;
      }

      // Apply backdrop
      let backdrop = $('.modal-backdrop');
      if(backdrop.length < 1) {
        backdrop = $('<div class="modal-backdrop fade"></div>');
        backdrop.appendTo(document.body);
      }

      function closeModal() {
        backdrop.removeClass('show');
        modal.removeClass('show');
        setTimeout(function() {
          backdrop.remove();
        }, 150) // Simulate the bootstrap out-transition period
      }

      // Set close action
      modal.find('[data-dismiss]').add('.modal-backdrop')
        .on('click', function () {
          closeModal();
        });

      $(document).on('keydown', function(e) {
        if (e.keyCode === 27) { // Escape key
          closeModal();
        }
      });

      // Fade each element in (use setTimeout to ensure initial render at opacity=0 works)
      setTimeout(function() {
        backdrop.addClass('show');
        modal.addClass('show');
      }, 0);

    }
  });

  $('.grid-field .action:button').entwine({
    onclick: function (e) {
      var filterState = 'show'; //filterstate should equal current state.
      let triggerChange = true;

      // If the button is disabled, do nothing.
      if (this.is(':disabled')) {
        e.preventDefault();
        return;
      }

      if(this.hasClass('ss-gridfield-button-close') || !(this.closest('.grid-field').hasClass('show-filter'))) {
        filterState = 'hidden';
      }

      if (this.hasClass('ss-gridfield-pagination-action') || this.hasClass('grid-field__sort')) {
        triggerChange = false;
      }

      var data = [
        {
          name: this.attr('name'),
          value: this.val(),
          filter: filterState,
          triggerChange
        },
      ];

      var actionState = this.data('action-state');
      if (actionState) {
        data.push({
          name: 'ActionState',
          value: JSON.stringify(actionState),
        });
      }

      const gridField =  $(this).getGridField();
      const successCallback = function(data, status, response) {
        gridField.keepStateInHistory();

        const messageText = response.getResponseHeader('X-Message-Text');
        const messageType = response.getResponseHeader('X-Message-Type');
        if (messageText && messageType) {
          var formEditError = $("#Form_EditForm_error");
          formEditError.addClass(messageType);
          formEditError.html(messageText);
          formEditError.show();
        }
      };

      gridField.reload({ data }, successCallback );

      e.preventDefault();
    },
    /**
     * Get the url this action should submit to
     */
    actionurl: function () {
      var btn = this.closest(':button'), grid = this.getGridField(),
        form = this.closest('form'), data = form.find(':input.gridstate').serialize(),
        csrf = form.find('input[name="SecurityID"]').val();

      // Add current button
      data += "&" + encodeURIComponent(btn.attr('name')) + '=' + encodeURIComponent(btn.val());

      // Add csrf
      if(csrf) {
        data += "&SecurityID=" + encodeURIComponent(csrf);
      }

      // Add action data
      var actionState = this.data('action-state');
      if (actionState) {
        data += '&ActionState=' + encodeURIComponent(JSON.stringify(actionState))
      }

      // Include any GET parameters from the current URL, as the view
      // state might depend on it. For example, a list pre-filtered
      // through external search criteria might be passed to GridField.
      if(window.location.search) {
        data = window.location.search.replace(/^\?/, '') + '&' + data;
      }

      // decide whether we should use ? or & to connect the URL
      var connector = grid.data('url').indexOf('?') == -1 ? '?' : '&';

      return $.path.makeUrlAbsolute(
        grid.data('url') + connector + data,
        $('base').attr('href')
      );
    }

  });

  /**
   * Don't allow users to submit empty values in grid field auto complete inputs.
   */
  $('.grid-field .add-existing-autocompleter').entwine({
    onbuttoncreate: function () {
      var self = this;

      this.toggleDisabled();

      this.find('input[type="text"]').on('keyup', function () {
        self.toggleDisabled();
      });
    },
    onunmatch: function () {
      this.find('input[type="text"]').off('keyup');
    },
    toggleDisabled: function () {
      var $button = this.find('.ss-ui-button'),
        $input = this.find('input[type="text"]'),
        inputHasValue = $input.val() !== '',
        buttonDisabled = $button.is(':disabled');

      if ((inputHasValue && buttonDisabled) || (!inputHasValue && !buttonDisabled)) {
        $button.attr("disabled", !buttonDisabled);
      }
    }
  });

  // Covers both tabular delete button, and the button on the detail form
  $('.grid-field .grid-field__col-compact .action--delete, .grid-field .grid-field__col-compact .action--archive, .cms-edit-form .btn-toolbar .action--delete, .cms-edit-form .btn-toolbar .action--archive, .grid-field__col-compact .gridfield-button-unlink, .grid-field__col-compact .action--unlink').entwine({
    onclick: function(e){
      let confirmMessage = i18n._t('Admin.DELETECONFIRMMESSAGE', 'Are you sure you want to delete this record?');
      let toastNotificationMessage = i18n._t('Admin.DELETE_CONFIRM_MESSAGE', 'Deleted');
      if ($(this).hasClass('action--archive')) {
        confirmMessage = i18n._t('Admin.ARCHIVECONFIRMMESSAGE', 'Are you sure you want to archive this record?');
        toastNotificationMessage = i18n._t('Admin.ARCHIVE_CONFIRM_MESSAGE', 'Archived');
      } else if ($(this).hasClass('action--unlink')) {
        confirmMessage = i18n._t('Admin.UNLINKCONFIRMMESSAGE', 'Are you sure you want to unlink this record?');
        toastNotificationMessage = i18n._t('Admin.UNLINK_CONFIRM_MESSAGE', 'Unlinked');
      }

      if (!confirm(confirmMessage)) {
        e.preventDefault();
        return false;
      } else {
        this._super(e);
      }

      if ($(this).hasClass('dropdown-item')) {
        jQuery.noticeAdd({text: toastNotificationMessage, type: 'success', stayTime: 5000, inEffect: {left: '0', opacity: 'show'}});
      }
    }
  });

  $('.grid-field .grid-print-button.action:button').entwine({
    UUID: null,
    onmatch: function() {
      this._super();
      this.setUUID(new Date().getTime());
    },
    onunmatch: function() {
      this._super();
    },
    onclick: function(e) {
      var url = this.actionurl();
      window.open(url);
      e.preventDefault();
      return false;
    }
  });

  $('.ss-gridfield-print-iframe').entwine({
    onmatch: function(){
      this._super();

      this.hide().on('load', function() {
        this.focus();
        var ifWin = this.contentWindow || this;
        ifWin.print();
      });
    },
    onunmatch: function() {
      this._super();
    }
  });

  /**
   * Prevents actions from causing an ajax reload of the field.
   *
   * Useful e.g. for actions which rely on HTTP response headers being
   * interpreted natively by the browser, like file download triggers.
   */
  $('.grid-field .action.no-ajax, .grid-field .no-ajax .action:button').entwine({
    onclick: function(event) {
      const url = this.actionurl();
      this.getGridField().openUrl(event, url, () => window.location.href = url);
      event.preventDefault();
      return false;
    }
  });

  $('.grid-field .action-detail').entwine({
    onclick: function(event) {
      this.getGridField().showDetailView($(this).prop('href'), event);
      return false;
    }
  });

  /**
   * Allows selection of one or more rows in the grid field.
   * Purely clientside at the moment.
   */
  $('.grid-field[data-selectable]').entwine({
    /**
     * @return {jQuery} Collection
     */
    getSelectedItems: function() {
      return this.find('.ss-gridfield-item.ui-selected');
    },
    /**
     * @return {Array} Of record IDs
     */
    getSelectedIDs: function() {
      return $.map(this.getSelectedItems(), function(el) {return $(el).data('id');});
    }
  });
  $('.grid-field[data-selectable] .ss-gridfield-items').entwine({
    onadd: function() {
      this._super();
      this.selectable();
    },
    onremove: function() {
      this._super();
      if (this.data('selectable')) this.selectable('destroy');
    }
  });

  $('.js-injector-boot .grid-field .search-holder').entwine({
    onmatch() {
      // Make sure this appears at the top of the gridfield
      const holder = this.closest('.cms-content-filters');
      holder.prependTo(holder.parent());

      // Allow LeftAndMain.js to set up the search holder
      this._super();
    },

    /**
     * Overrides close function in LeftAndMain.js
     */
    close() {
      const props = this.data('schema');

      const ajaxData = [{
        name: props.clearAction,
        value: '',
        filter: 'hidden',
        triggerChange: false
      }];

      if (props.clearActionState) {
        ajaxData.push({
          name: 'ActionState',
          value: props.clearActionState,
        });
      }

      const gridField =  $(this).getGridField();
      const successCallback = function() {
        gridField.keepStateInHistory();
      };

      gridField.reload({ data: ajaxData }, successCallback);
    },

    /**
     * Overrides search function in LeftAndMain.js
     */
    search(data) {
      const props = this.data('schema');

      const ajaxData = [{
        name: props.searchAction,
        value: '',
        filter: 'show',
        triggerChange: false
      }];

      if (props.searchActionState) {
        ajaxData.push({
          name: 'ActionState',
          value: props.searchActionState,
        });
      }

      for (const [key, value] of Object.entries(data)) {
        if (value) {
          const name = `filter[${props.gridfield}][${key}]`
          ajaxData.push({ name, value });
        }
      }

      const gridField =  $(this).getGridField();
      const successCallback = function() {
        gridField.keepStateInHistory();
      };

      gridField.reload({ data: ajaxData }, successCallback);
    },

    /**
     * Overrides getSearchID function in LeftAndMain.js
     */
    getSearchID() {
      const data = this.data('schema');
      return `${data.gridfield}Search`;
    },
  });

  /**
   * Stop enter from submitting the whole 'page form' and
   * allow the search component to handle it
   */
  $('.js-injector-boot .grid-field .search-box__content-field').entwine({
    onkeydown: function(e) {
      if(e.key === 'Enter') {
        e.preventDefault();
      }
    }
  });

  $(".grid-field .relation-search").entwine({
    onfocusin: function (event) {
      this.autocomplete({
        source: function(request, response){
          var searchField = $(this.element);
          var form = $(this.element).closest("form");
          $.ajax({
            headers: {
              "X-Pjax" : 'Partial'
            },
            dataType: 'json',
            type: "GET",
            url: $(searchField).data('searchUrl'),
            data: encodeURIComponent(searchField.attr('name'))+'='+encodeURIComponent(searchField.val()),
            success: response,
            error: function(e) {
              alert(i18n._t('Admin.ERRORINTRANSACTION', 'An error occured while fetching data from the server\n Please try again later.'));
            }
          });
        },
        select: function(event, ui) {
          var hiddenField = $('<input type="hidden" name="relationID" class="action_gridfield_relationfind no-change-track" />');
            hiddenField.val(ui.item.id);
            $(this)
              .closest(".grid-field")
              .find(".action_gridfield_relationfind")
              .replaceWith(hiddenField);
          var addbutton = $(this).closest(".grid-field").find(".action_gridfield_relationadd");

          addbutton.removeAttr('disabled');
        }
      });
    }
  });

  $(".grid-field .pagination-page-number input").entwine({
    onkeydown: function(event) {
      if(event.keyCode == 13) {
        event.preventDefault();
        var newpage = parseInt($(this).val(), 10);

        var gridfield = $(this).getGridField();
        gridfield.setState('GridFieldPaginator', {currentPage: newpage});

        const successCallback = function() {
          gridfield.keepStateInHistory();
        };

        gridfield.reload({}, successCallback);

        return false;
      }
    }
  });
});
