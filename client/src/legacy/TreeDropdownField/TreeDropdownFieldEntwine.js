/* global window */
import jQuery from 'jquery';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { schemaMerge } from 'lib/schemaFieldValues';
import { MULTI_EMPTY_VALUE } from 'components/TreeDropdownField/TreeDropdownField';
import { loadComponent } from 'lib/Injector';

jQuery.entwine('ss', ($) => {
  $('.js-injector-boot .TreeDropdownField').entwine({
    Value: null,
    Timer: null,
    Component: null,
    ReactRoot: null,

    onmatch() {
      this._super();

      const cmsContent = this.closest('.cms-content').attr('id');
      const context = (cmsContent)
        ? { context: cmsContent }
        : {};

      const TreeDropdownField = loadComponent('TreeDropdownField', context);
      this.setComponent(TreeDropdownField);

      const state = this.data('state') || {};
      const schema = this.data('schema') || {};
      const isMultiple = schema.data && schema.data.multiple;

      if (isMultiple) {
        this.setValue(
          (state.value && state.value !== MULTI_EMPTY_VALUE)
            ? state.value.map(next => Number(next))
            : []
        );
      } else {
        this.setValue(state.value ? Number(state.value) : '');
      }

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

      const onChange = (value) => {
        this.setValue(value);

        this.refresh();
        // Trigger change detection (see jquery.changetracker.js)
        clearTimeout(this.getTimer());
        const timer = setTimeout(() => {
          this.find('input').trigger('change');
        }, 0);
        this.setTimer(timer);
      };

      const TreeDropdownField = this.getComponent();

      // TODO: rework entwine so that react has control of holder
      let root = this.getReactRoot();
      if (!root) {
        root = createRoot(this[0]);
      }
      root.render(
        <TreeDropdownField
          {...props}
          onChange={onChange}
          value={this.getValue()}
          noHolder
        />
      );
      this.setReactRoot(root);
    },

    getAttributes() {
      const state = this.data('state');
      const schema = this.data('schema');
      return schemaMerge(schema, state);
    },
  });
});
