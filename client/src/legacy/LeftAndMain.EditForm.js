/**
 * File: LeftAndMain.EditForm.js
 */
import $ from 'jquery';
import i18n from 'i18n';

const currBeforeUnload = window.onbeforeunload;
// Can't bind this through jQuery
window.onbeforeunload = function(e) {
  var form = $('.cms-edit-form');
  form.trigger('beforesubmitform');
  if(form.is('.changed') && ! form.is('.discardchanges')) {
    return i18n._t('Admin.CONFIRMUNSAVEDSHORT');
  }

  if (typeof currBeforeUnload === 'function') {
    return currBeforeUnload();
  }

  return undefined;
};

$.entwine('ss', function($){

  /**
   * Class: .cms-edit-form
   *
   * Base edit form, provides ajaxified saving
   * and reloading itself through the ajax return values.
   * Takes care of resizing tabsets within the layout container.
   *
   * Change tracking is enabled on all fields within the form. If you want
   * to disable change tracking for a specific field, add a "no-change-track"
   * class to it.
   *
   * @name ss.Form_EditForm
   * @require jquery.changetracker
   *
   * Events:
   *  ajaxsubmit - Form is about to be submitted through ajax
   *  validate - Contains validation result
   *  load - Form is about to be loaded through ajax
   */
  $('.cms-edit-form').entwine(/** @lends ss.Form_EditForm */{
    /**
     * Variable: PlaceholderHtml
     * (String_ HTML text to show when no form content is chosen.
     * Will show inside the <form> tag.
     */
    PlaceholderHtml: '',

    /**
     * This can be customised to change settings for the change tracker.
     * See jquery.changetracker.js
     */
    ChangeTrackerOptions: {
      ignoreFieldSelector: '',
    },

    /**
     * Boolean for tracking whether a validation error has been already been shown. Used because tabs can
     * sometimes be inadvertently initialised multiple times, but we don't want duplicate messages.
     */
    getValidationErrorShown: function() {
      return Boolean(this.data('_validationErrorShown'));
    },
    setValidationErrorShown: function(value) {
      this.data('_validationErrorShown', value);
    },

    /**
     * Constructor: onmatch
     */
    onadd: function() {
      var self = this;

      // Turn off autocomplete to fix the access tab randomly switching radio buttons in Firefox
      // when refresh the page with an anchor tag in the URL. E.g: /admin#Root_Access.
      // Autocomplete in the CMS also causes strangeness in other browsers,
      // filling out sections of the form that the user does not want to be filled out,
      // so this turns it off for all browsers.
      // See the following page for demo and explanation of the Firefox bug:
      //  http://www.ryancramer.com/journal/entries/radio_buttons_firefox/
      this.attr("autocomplete", "off");

      this._setupChangeTracker();

      // Catch navigation events before they reach handleStateChange(),
      // in order to avoid changing the menu state if the action is cancelled by the user
      // $('.cms-menu')

      // Optionally get the form attributes from embedded fields
      for(var overrideAttr in {'action':true,'method':true,'enctype':true,'name':true}) {
        var el = this.find(':input[name='+ '_form_' + overrideAttr + ']');
        if(el) {
          this.attr(overrideAttr, el.val());
          el.remove();
        }
      }

      this._super();
    },

    'from .cms-tabset': {
      onafterredrawtabs: function () {

        // This function will:
        // - Add an invalid icon on each tab that contains form fields than failed validation
        // - Set an alert message in the edit form error banner
        const iconClass = 'font-icon-attention-1 tab-attention';
        const iconTitle = ss.i18n._t(
          'Admin.VALIDATION_ERRORS_IN_TAB',
          'This tab contains validation errors.'
        );
        const iconScreenReaderText = ss.i18n._t(
          'Admin.VALIDATION_ERRORS_IN_TAB_SCREEN_READER',
          '(Has validation errors)'
        );
        const alertMessageText = ss.i18n._t(
          'Admin.VALIDATION_ERRORS_ON_PAGE',
          'There are validation errors on this page, please fix them before saving or publishing.'
        );

        const $editFormErrorBanner = $("#Form_EditForm_error, #Form_ItemEditForm_error");

        // Remove any existing invalid tab icons and screen-reader text
        this.find('.tab-attention, .tab-validation-error-sr').remove();

        // Check if there are any form validation errors
        let validationErrorExists = false;

        // Validation errors from the form validator
        if (this.hasClass('validationerror')) {
          validationErrorExists = true;
        }

        // Validation errors from DataObject::validate() .. ValidationResult::addError();
        if ($editFormErrorBanner.html() !== '') {
          validationErrorExists = true;
        }

        // Validation errors from DataObject::validate() .. ValidationResult::addFieldError()
        if (this.find('.alert.error').length > 0) {
          validationErrorExists = true;
        }

        // If there are no validation errors then hide any old messages and exit
        if (!validationErrorExists) {
          $editFormErrorBanner.hide();
          return;
        }

        // Find tab-pane's with decedent validation .alert's
        const $invalidTabPanes = this.find('.tab-pane .alert-danger, .tab-pane .alert.error').closest('.tab-pane');
        if (!$invalidTabPanes.length) {
          // If we are at this point it's probably a failed DataObject::validate()
          // where there was a general (non-field) error added via ValidationResult::addError()
          return;
        }

        // Get the tabs for this form
        const $gridfieldTabs = this.find('.cms-content-header-tabs.cms-tabset-nav-primary li[role="tab"]');
        const $ssTabSet = $invalidTabPanes.closest('.tab-content').closest('.ss-tabset');
        let getTabLi = null;
        if ($gridfieldTabs.length > 1) {
          // GridField logic
          getTabLi = (invalidTabPaneId) => $gridfieldTabs.filter(`[aria-controls="${invalidTabPaneId}"]`);
        } else if ($ssTabSet.length) {
          // SiteTree logic
          getTabLi = (invalidTabPaneId) => $ssTabSet.find(`#tab-${invalidTabPaneId}`).closest('li');
        }

        if (getTabLi !== null) {
          // Add invalid icons to tabs
          $invalidTabPanes.each((i) => {
            const invalidTabPaneId = $invalidTabPanes.eq(i).attr('id');
            const $tabLi = getTabLi(invalidTabPaneId);
            const $icon = $(`<span class="${iconClass}" title="${iconTitle}" aria-hidden="true"></span>`);
            const $screenReaderSpan = $(`<span class="tab-validation-error-sr visually-hidden">${iconScreenReaderText}</span>`);
            $tabLi.append($icon);
            $tabLi.append($screenReaderSpan);
          });
          // Set an alert message in the edit form error banner
          $editFormErrorBanner.attr('class', 'alert alert-danger');
          $editFormErrorBanner.html(alertMessageText);
          $editFormErrorBanner.show();
        }

        // Ensure the class "validationerror" is set for the scenario where
        // the error came from validate() .. ValidationResult::addFieldError()
        // so that css styles are applied to tab icons
        this.addClass('validationerror');
      }
    },
    onremove: function() {
      this.changetracker('destroy');
      this._super();
    },
    onmatch: function() {
      this._super();
    },
    onunmatch: function() {
      this._super();
    },
    redraw: function() {
      if(window.debug) console.log('redraw', this.attr('class'), this.get(0));

      if (!this.getValidationErrorShown() && this.hasClass('validationerror')) {
        const toastNotificationMessage = ss.i18n._t(
          'Admin.VALIDATIONERROR',
          'Validation Error'
        );

        errorMessage(toastNotificationMessage);
        // Ensure that this error message popup won't be added more than once
        this.setValidationErrorShown(true);
      }

      // Force initialization of tabsets to avoid layout glitches
      this.add(this.find('.cms-tabset')).redrawTabs();
      this.find('.cms-content-header').redraw();
    },

    /**
     * Function: _setupChangeTracker
     */
    _setupChangeTracker: function() {
      // Don't bind any events here, as we dont replace the
      // full <form> tag by any ajax updates they won't automatically reapply
      this.changetracker(this.getChangeTrackerOptions());
    },

    /**
     * Function: confirmUnsavedChanges
     *
     * Checks the jquery.changetracker plugin status for this form,
     * and asks the user for confirmation via a browser dialog if changes are detected.
     * Doesn't cancel any unload or form removal events, you'll need to implement this based on the return
     * value of this message.
     *
     * If changes are confirmed for discard, the 'changed' flag is reset.
     *
     * Returns:
     *  (Boolean) FALSE if the user wants to abort with changes present, TRUE if no changes are detected
     *  or the user wants to discard them.
     */
    confirmUnsavedChanges: function() {
      this.trigger('beforesubmitform');
      if(!this.is('.changed') || this.is('.discardchanges')) {
        return true;
      }
      if (this.find('.btn-toolbar :submit.btn--loading.loading').length > 0) {
        return true;
      }
      var confirmed = confirm(i18n._t('Admin.CONFIRMUNSAVED'));
      if(confirmed) {
        // Ensures that once a form is confirmed, subsequent
        // changes to the underlying form don't trigger
        // additional change confirmation requests
        this.addClass('discardchanges');
      }
      return confirmed;
    },

    /**
     * Function: onsubmit
     *
     * Suppress submission unless it is handled through ajaxSubmit().
     */
    onsubmit: function(e, button) {
      // If the submit button a child of on an element with a .bypass-entwine-submission class on it then
      // skip handling. Usually the element in question will be used by react e.g. FormBuilder
      if ($(e.target.activeElement).closest('.bypass-entwine-submission').length) {
        return true;
      }
      // Only submit if a button is present.
      // This supressed submits from ENTER keys in input fields,
      // which means the browser auto-selects the first available form button.
      // This might be an unrelated button of the form field,
      // or a destructive action (if "save" is not available, or not on first position).
      if(this.prop("target") != "_blank") {
        if(button) this.closest('.cms-container').submitForm(this, button);
        return false;
      }
    },

    /**
     * Function: validate
     *
     * Hook in (optional) validation routines.
     * Currently clientside validation is not supported out of the box in the CMS.
     *
     *
     * Returns:
     *  {boolean}
     */
    validate: function() {
      var isValid = true;
      this.trigger('validate', {isValid: isValid});

      return isValid;
    },

    /*
     * Track focus on inputs
     */
    'from .cms-edit-form :input:not(:submit)': {
      onclick: function(e){
        this.saveFieldFocus($(e.target).attr('id'));
      },
      onfocus: function(e){
        this.saveFieldFocus($(e.target).attr('id'));
      }
    },
    /*
     * Track focus on treedropdownfields.
     */
    'from .cms-edit-form .treedropdown *': {
      onfocusin: function(e){
        var field = $(e.target).closest('.field.treedropdown');
        this.saveFieldFocus(field.attr('id'));
      }
    },
    /*
     * Track focus on chosen selects
     */
    'from .cms-edit-form .dropdown .chosen-container a': {
      onfocusin: function(e){
        var field = $(e.target).closest('.field.dropdown');
        this.saveFieldFocus(field.attr('id'));
      }
    },
    /*
     * Restore fields after each tab's state is restored
     */
    'from .cms-container': {
      ontabstaterestored: function(e){
        this.restoreFieldFocus();
      }
    },
    /*
     * Saves focus in Window session storage so it that can be restored on page load
     */
    saveFieldFocus: function(selected){
      if(typeof(window.sessionStorage)=="undefined" || window.sessionStorage === null) return;

      var id = $(this).attr('id'),
        focusElements = [];

      focusElements.push({
        id:id,
        selected:selected
      });

      if(focusElements) {
        try {
          window.sessionStorage.setItem(id, JSON.stringify(focusElements));
        } catch(err) {
          if (err.code === DOMException.QUOTA_EXCEEDED_ERR && window.sessionStorage.length === 0) {
            // If this fails we ignore the error as the only issue is that it
            // does not remember the focus state.
            // This is a Safari bug which happens when private browsing is enabled.
            return;
          } else {
            throw err;
          }
        }
      }
    },
    /**
     * Set focus or window to previously saved fields.
     * Requires HTML5 sessionStorage support.
     *
     * Must follow tab restoration, as reliant on active tab
     */
    restoreFieldFocus: function(){
      if(typeof(window.sessionStorage)=="undefined" || window.sessionStorage === null) return;

      var self = this,
        hasSessionStorage = (typeof(window.sessionStorage)!=="undefined" && window.sessionStorage),
        sessionData = hasSessionStorage ? window.sessionStorage.getItem(this.attr('id')) : null,
        sessionStates = sessionData ? JSON.parse(sessionData) : false,
        elementID,
        tabbed = (this.find('.ss-tabset').length !== 0),
        activeTab,
        elementTab,
        toggleComposite,
        scrollY;

      if(hasSessionStorage && sessionStates.length > 0){
        $.each(sessionStates, function(i, sessionState) {
          if(self.is('#' + sessionState.id)){
            elementID = $('#' + sessionState.selected);
          }
        });

        // If the element IDs saved in session states don't match up to anything in this particular form
        // that probably means we haven't encountered this form yet, so focus on the first input
        if($(elementID).length < 1){
          this.focusFirstInput();
          return;
        }

        activeTab = $(elementID).closest('.ss-tabset').find('.ui-tabs-nav .ui-tabs-active .ui-tabs-anchor').attr('id');
        elementTab  = 'tab-' + $(elementID).closest('.ss-tabset .ui-tabs-panel').attr('id');

        // Last focussed element differs to last selected tab, do nothing
        if(tabbed && elementTab !== activeTab){
          return;
        }

        toggleComposite = $(elementID).closest('.togglecomposite');

        //Reopen toggle fields
        if(toggleComposite.length > 0){
          toggleComposite.accordion('option', 'active', toggleComposite.find('.ui-accordion-header'));
        }

        //Calculate position for scroll
        scrollY = $(elementID).position().top;

        //Fall back to nearest visible element if hidden (for select type fields)
        if(!$(elementID).is(':visible')){
          elementID = '#' + $(elementID).closest('.field').attr('id');
          scrollY = $(elementID).position().top;
        }

        //set focus to focus variable if element focusable
        $(elementID).focus();

        // Scroll fallback when element is not focusable
        // Only scroll if element at least half way down window
        if(scrollY > $(window).height() / 2){
          self.find('.cms-content-fields').scrollTop(scrollY);
        }

      } else {
        // If session storage is not supported or there is nothing stored yet, focus on the first input
        this.focusFirstInput();
      }
    },
    /**
     * Skip if an element in the form is already focused. Exclude elements which specifically
     * opt-out of this behaviour via "data-skip-autofocus". This opt-out is useful if the
     * first visible field is shown far down a scrollable area, for example for the pagination
     * input field after a long GridField listing.
     */
    focusFirstInput: function() {
      this.find(':input:not(:submit)[data-skip-autofocus!="true"]').filter(':visible:first').focus();
    }
  });

  /**
   * Class: .cms-edit-form .btn-toolbar :submit
   *
   * All buttons in the right CMS form go through here by default.
   * We need this onclick overloading because we can't get to the
   * clicked button from a form.onsubmit event.
   */
  $('.cms-edit-form .btn-toolbar input.action[type=submit], .cms-edit-form .btn-toolbar button.action').entwine({
    /**
     * Function: onclick
     */
    onclick: function(e) {
      if(this.is(':disabled')) {
        e.preventDefault();
        return false;
      }

      // only run submit if other handlers didn't preventDefault
      if (this._super(e) !== false && !e.defaultPrevented && !e.isDefaultPrevented()) {
        this.parents('form').trigger('submit', [this]);
        e.preventDefault();
        return false;
      }
    }
  });

  /**
   * If we've a history state to go back to, go back, otherwise fall back to
   * submitting the form with the 'doCancel' action.
   */
  $('.cms-edit-form .btn-toolbar input.action[type=submit].ss-ui-action-cancel, .cms-edit-form .btn-toolbar button.action.ss-ui-action-cancel').entwine({
    onclick: function(e) {
      if (window.history.length > 1) {
        window.history.back();
      } else {
        this.parents('form').trigger('submit', [this]);
      }
      e.preventDefault();
    }
  });

  // Hack: silverstripe/versioned coupling
  $('.cms-edit-form .btn-toolbar button[name=action_doUnpublish].btn.action').entwine({
    onclick: function(e) {
      var owners = this.data('owners');
      if (owners && parseInt(owners) > 0) {
        var message = [
          i18n.inject(
            i18n._t(
              'Admin.OWNED_WARNING_1',
              'You are unpublishing content that is being used in {count} other published section(s).'
            ),
            { count: owners }
          ),
          i18n._t(
            'Admin.OWNED_WARNING_2',
            'This could cause a published page to have missing components on the live site.'
          ),
          i18n._t(
            'Admin.OWNED_WARNING_3',
            'Do you want to unpublish anyway?'
          )
        ];
        if (window.confirm(message.join('\n\n'))) {
          this._super();
        } else {
          e.preventDefault();
        }
      } else {
        this._super();
      }
    }
  });

  /**
   * Hide tabs when only one is available.
   * Special case is actiontabs - tabs between buttons, where we want to have
   * extra options hidden within a tab (even if only one) by default.
   */
  $('.cms-edit-form .ss-tabset').entwine({
    onmatch: function() {
      if (!this.hasClass('ss-ui-action-tabset')) {
        var tabs = this.find("> ul:first");

        if(tabs.children("li").length == 1) {
          tabs.hide().parent().addClass("ss-tabset-tabshidden");
        }
      }

      this._super();
    },
    onunmatch: function() {
      this._super();
    }
  });

  /**
   * Class: .cms-edit-form #CanViewType, .cms-edit-form #CanEditType
   *
   * Toggle display of group dropdown in "access" tab,
   * based on selection of radiobuttons.
   */
  $('.cms-edit-form [name="CanViewType"], ' +
    '.cms-edit-form [name="CanEditType"], ' +
    '.cms-edit-form [name="CanCreateTopLevelType"]').entwine({
    onmatch: function () {
      if (this.is(':checked')) {
        this.toggleListDisplay(this.val(), true);
      }
    },
    onchange: function (e) {
      this.toggleListDisplay(e.target.value, window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    },
    checkIfHoldsField(candidate, type) {
      let fieldName = '';
      switch (this.attr('name')) {
        case 'CanViewType':
          fieldName = `Viewer${type}`;
          break;
        case 'CanEditType':
          fieldName = `Editor${type}`;
          break;
        case 'CanCreateTopLevelType':
          fieldName = `CreateTopLevel${type}`;
          break;
      }
      const jCandidate = jQuery(candidate);
      return jCandidate.find(`[name="${fieldName}"],[name="${fieldName}[]"]`).length > 0 && jCandidate.attr('id').endsWith('_Holder');
    },
    toggleListDisplay: function(checkedTarget, instant) {
      if (checkedTarget === 'OnlyTheseUsers') {
        this.showGroupsList(instant);
        this.hideMembersList(instant);
      } else {
        this.hideGroupsList(instant);
      }
      if (checkedTarget === 'OnlyTheseMembers') {
        this.showMembersList(instant);
        this.hideGroupsList(instant);
      } else {
        this.hideMembersList(instant);
      }
    },
    showGroupsList: function (instant) {
      const holder = this.closest('.field');
      this.showListElement(holder, holder.parent().find('.form-group, .field').filter((_, candidate) => this.checkIfHoldsField(candidate, 'Groups')), instant);
    },
    hideGroupsList: function (instant) {
      const holder = this.closest('.field');
      this.hideListElement(holder, holder.parent().find('.form-group, .field').filter((_, candidate) => this.checkIfHoldsField(candidate, 'Groups')), instant);
    },
    showMembersList: function (instant) {
      const holder = this.closest('.field');
      this.showListElement(holder, holder.parent().find('.form-group, .field').filter((_, candidate) => this.checkIfHoldsField(candidate, 'Members')), instant);
    },
    hideMembersList: function (instant) {
      const holder = this.closest('.field');
      this.hideListElement(holder, holder.parent().find('.form-group, .field').filter((_, candidate) => this.checkIfHoldsField(candidate, 'Members')), instant);
    },
    showListElement: function (holder, list, instant) {
      holder.addClass('field--merge-below');
      if (instant) {
        list.show().css('overflow', 'visible');
      } else {
        list.slideDown(() => {
          // jquery adding overflow:hidden in hide, this will break listbox display
          list.css('overflow', 'visible');
        });
      }
    },
    hideListElement: function (holder, list, instant) {
      list.css('overflow', 'hidden');
      if (instant) {
        list.hide().css('display', 'none');
        holder.removeClass('field--merge-below');
      } else {
        list.slideUp(() => {
          holder.removeClass('field--merge-below');
        });
      }
    }
  });

});

var errorMessage = function(text) {
  jQuery.noticeAdd({text: text, type: 'error', stayTime: 5000, inEffect: {left: '0', opacity: 'show'}});
};
