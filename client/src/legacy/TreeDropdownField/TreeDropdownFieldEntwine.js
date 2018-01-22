/* global window */
import jQuery from 'jquery';
import React from 'react';
import ReactDOM from 'react-dom';
import { schemaMerge } from 'lib/schemaFieldValues';
import { MULTI_EMPTY_VALUE } from 'components/TreeDropdownField/TreeDropdownField';
import { loadComponent } from 'lib/Injector';

jQuery.entwine('ss', ($) => {
  $('.TreeDropdownField').entwine({
    Value: null,
    Timer: null,
    Component: null,

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
      // solves errors given by ReactDOM "no matched root found" error.
      const container = this[0];
      if (container) {
        ReactDOM.unmountComponentAtNode(container);
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
      ReactDOM.render(
        <TreeDropdownField
          {...props}
          onChange={onChange}
          value={this.getValue()}
          noHolder
        />,
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
