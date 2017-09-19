/* global window */
import jQuery from 'jquery';
import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider } from 'react-apollo';
import { schemaMerge } from 'lib/schemaFieldValues';
import {
  ConnectedTreeDropdownField,
  MULTI_EMPTY_VALUE,
} from 'components/TreeDropdownField/TreeDropdownField';
import { provideInjector } from 'lib/Injector';

const InjectableTreeDropdownField = provideInjector(ConnectedTreeDropdownField);
jQuery.entwine('ss', ($) => {
  $('.js-react-boot .TreeDropdownField').entwine({
    Value: null,
    Timer: null,

    onmatch() {
      this._super();

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

      this.find(':input').remove();
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
      const store = window.ss.store;
      const client = window.ss.apolloClient;

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

      ReactDOM.render(
        <ApolloProvider store={store} client={client}>
          <InjectableTreeDropdownField {...props} onChange={onChange} value={this.getValue()} />
        </ApolloProvider>,
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
