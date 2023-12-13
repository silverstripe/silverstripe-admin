/* global window */
import React from 'react';
import { createRoot } from 'react-dom/client';
import { loadComponent } from 'lib/Injector';

window.jQuery.entwine('ss', ($) => {
  $('.js-injector-boot .ss-searchable-dropdown-field').entwine({
    // These properties need to be here for setRoot() and setComponent()  to work
    Root: null,
    Component: null,

    onmatch() {
      const cmsContent = this.closest('.cms-content').attr('id');
      const context = cmsContent ? { context: cmsContent } : {};
      const schema = this.data('schema');
      this.data('entwine-value', schema.value);
      const Root = createRoot(this[0]);
      const ReactField = loadComponent(schema.component, context);
      this.setRoot(Root);
      this.setComponent(ReactField);
      this._super();
      this.refresh();
    },

    onunmatch() {
      const Root = this.getRoot();
      Root.unmount();
    },

    getProps() {
      return {
        ...this.data('schema'),
        value: this.data('entwine-value') || '',
        onChange: this.handleChange.bind(this),
      };
    },

    refresh() {
      const Root = this.getRoot();
      const ReactField = this.getComponent();
      const props = this.getProps();
      Root.render(<ReactField {...props} noHolder/>);
    },

    handleChange(value) {
      this.data('entwine-value', value);
      this.refresh();
    },
  });

  $('.cms-edit-form').entwine({
    getChangeTrackerOptions() {
      // Figure out if we're still returning the default value
      const isDefault = (this.entwineData('ChangeTrackerOptions') === undefined);
      // Get the current options
      let opts = this._super();
      if (isDefault) {
        // If it is the default then...
        // clone the object (so we don't modify the original),
        opts = $.extend({}, opts);
        // modify it,
        opts.ignoreFieldSelector += ', .ss-searchable-dropdown-field .no-change-track :input';
        // then set the clone as the value on this element
        // (so next call to this method gets this same clone)
        this.setChangeTrackerOptions(opts);
      }
      return opts;
    }
  });
});
