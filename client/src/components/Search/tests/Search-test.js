/* global jest, jasmine, describe, it, expect, beforeEach */

// FormBuilderLoader mock was not mocking properly
// manually override with a stateless null component
jest.mock('containers/FormBuilderLoader/FormBuilderLoader', () => () => null);

import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';
import { Component as Search, hasFilters } from '../Search';

describe('Search', () => {
  let props = null;

  beforeEach(() => {
    props = {
      searchFormSchemaUrl: 'someUrl',
      id: 'MyForm',
      onSearch: jest.fn(),
      query: {},
      formData: {},
      actions: {
        schema: {
          setSchemaStateOverrides: jest.fn(),
        },
      },
    };
  });

  describe('doSearch()', () => {
    it('includes searchText', () => {
      const component = ReactTestUtils.renderIntoDocument(
        <Search {...props} />
      );
      component.setState({ searchText: 'foo' });
      component.doSearch();
      const data = props.onSearch.mock.calls[0][0];
      expect(data.name).toEqual('foo');
    });

    it('filters out empty values', () => {
      props.formData = { isEmpty: '' };
      const component = ReactTestUtils.renderIntoDocument(
        <Search {...props} />
      );
      component.setState({ searchText: 'foo' });
      component.doSearch();
      const data = props.onSearch.mock.calls[0][0];
      expect(data.isEmpty).not.toBeDefined();
    });
  });

  describe('setOverrides()', () => {
    it('converts values into name/value notation', () => {
      props.filters = { foo: true, bar: null };
      const component = ReactTestUtils.renderIntoDocument(
        <Search {...props} />
      );
      component.setOverrides(props);
      const data = props.actions.schema.setSchemaStateOverrides.mock.calls[0][1];
      expect(data.fields).toEqual([
        { name: 'foo', value: true },
        { name: 'bar', value: null },
      ]);
    });
  });

  describe('hasFilters', () => {
    it('returns false with null', () => {
      expect(hasFilters(null)).toBeFalsy();
    });
    it('returns false with empty object', () => {
      expect(hasFilters({})).toBeFalsy();
    });
    it('returns true when keyed object', () => {
      expect(hasFilters({ foo: 'bar' })).toBeTruthy();
    });
  });
});
