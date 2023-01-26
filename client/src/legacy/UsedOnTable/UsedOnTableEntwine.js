/* global window */
import jQuery from 'jquery';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { schemaMerge } from 'lib/schemaFieldValues';
import { loadComponent } from 'lib/Injector';

jQuery.entwine('ss', ($) => {
  $('.js-injector-boot .used-on__polyfill-holder').entwine({
    Timer: null,
    Component: null,
    ReactRoot: null,

    onmatch() {
      this._super();

      const cmsContent = this.closest('.cms-content').attr('id');
      const context = (cmsContent)
        ? { context: cmsContent }
        : {};

      const UsedOnTable = loadComponent('UsedOnTable', context);
      this.setComponent(UsedOnTable);

      this.refresh();
    },

    onunmatch() {
      this._super();
      const root = this.getReactRoot();
      if (root) {
        root.unmount();
        this.setReactRoot(null);
      }
    },

    refresh() {
      const props = this.getAttributes();

      const UsedOnTable = this.getComponent();

      // TODO: rework entwine so that react has control of holder
      let root = this.getReactRoot();
      if (!root) {
        root = createRoot(this[0]);
      }
      root.render(<UsedOnTable {...props} />);
      this.setReactRoot(root);
    },

    getAttributes() {
      const state = this.data('state');
      const schema = this.data('schema');
      return schemaMerge(schema, state);
    },
  });
});
