/* global window */
import jQuery from 'jquery';
import React from 'react';
import ReactDOM from 'react-dom';
import { schemaMerge } from 'lib/schemaFieldValues';
import { loadComponent } from 'lib/Injector';

jQuery.entwine('ss', ($) => {
  $('.js-injector-boot .used-on__polyfill-holder').entwine({
    Timer: null,
    Component: null,

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
      // solves errors given by ReactDOM "no matched root found" error.
      const container = this[0];
      if (container) {
        ReactDOM.unmountComponentAtNode(container);
      }
    },

    refresh() {
      const props = this.getAttributes();

      const UsedOnTable = this.getComponent();

      // TODO: rework entwine so that react has control of holder
      ReactDOM.render(
        <UsedOnTable {...props} />,
        this[0]
      );
    },

    getAttributes() {
      const state = this.data('state');
      const schema = this.data('schema');
      return schemaMerge(schema, state);
    },
  });
});
