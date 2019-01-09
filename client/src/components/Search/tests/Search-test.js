/* global jest, jasmine, describe, it, expect, beforeEach */

// FormBuilderLoader mock was not mocking properly
// manually override with a stateless null component
jest.mock('containers/FormBuilderLoader/FormBuilderLoader', () => () => null);

import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';
import { Component as Search, hasFilters } from '../Search';

describe('Search', () => {
  let props = null;

  beforeEach(() => {
    props = {
      formSchemaUrl: 'someUrl',
      id: 'MyForm',
      onSearch: jest.fn(),
      query: {},
      formData: {},
      actions: {
        schema: {
          setSchemaStateOverrides: jest.fn(),
        },
        reduxForm: {
          initialize: jest.fn(),
          reset: jest.fn(),
          change: jest.fn()
        }
      },
    };
  });

  describe('handleChange()', () => {
    it('update search text', () => {
      const component = ReactTestUtils.renderIntoDocument(
        <Search {...props} />
      );
      component.setState({ searchText: 'foo' });
      component.handleChange({ target: { value: 'bar' } });
      expect(component.state.searchText).toEqual('bar');
    });
  });

  describe('clearFormData()', () => {
    it('Make sure we don\'t have any data', () => {
      const component = ReactTestUtils.renderIntoDocument(
        <Search {...props} term="Foo Bar" />
      );
      const resetCount = props.actions.reduxForm.reset.mock.calls.length;
      component.clearFormData(props);
      expect(props.actions.reduxForm.reset.mock.calls).toHaveLength(resetCount + 1);
      expect(component.state.searchText).toEqual('');
      expect(component.getData()).toEqual({});
    });
  });

  describe('hide()', () => {
    it('Using the internal state', () => {
      const component = ReactTestUtils.renderIntoDocument(
        <Search {...props} display="VISIBLE" />
      );
      component.hide();
      expect(component.state.display).toEqual('NONE');
    });
    it('Using external handler', () => {
      const onHide = jest.fn();
      const component = ReactTestUtils.renderIntoDocument(
        <Search {...props} onHide={onHide} display="VISIBLE" />
      );
      component.hide();
      expect(component.state.display).toEqual('VISIBLE');
      expect(onHide.mock.calls).toHaveLength(1);
    });
  });

  describe('show()', () => {
    it('Updating internal state', () => {
      const onHide = jest.fn();
      const component = ReactTestUtils.renderIntoDocument(
        <Search {...props} onHide={onHide} display="NONE" />
      );
      component.show();
      expect(component.state.display).toEqual('VISIBLE');
    });
  });

  describe('toggle()', () => {
    it('Showing advanced search', () => {
      const component = ReactTestUtils.renderIntoDocument(
        <Search {...props} display="VISIBLE" />
      );
      component.toggle();
      expect(component.state.display).toEqual('EXPANDED');
    });
    it('Hidding advanced search', () => {
      const component = ReactTestUtils.renderIntoDocument(
        <Search {...props} display="EXPANDED" />
      );
      component.toggle();
      expect(component.state.display).toEqual('VISIBLE');
    });
  });

  describe('doSearch()', () => {
    it('includes searchText', () => {
      const component = ReactTestUtils.renderIntoDocument(
        <Search {...props} />
      );
      component.setState({ searchText: 'foo' });
      component.doSearch();
      const data = props.onSearch.mock.calls[0][0];
      expect(data.searchTerm).toEqual('foo');
      expect(component.state.initialSearchText).toEqual('foo');
    });

    it('custom name', () => {
      const component = ReactTestUtils.renderIntoDocument(
        <Search name="MySuperSpecialName" {...props} />
      );
      component.setState({ searchText: 'foo' });
      component.doSearch();
      const data = props.onSearch.mock.calls[0][0];
      expect(data.MySuperSpecialName).toEqual('foo');
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

  describe('getData()', () => {
    it('Retriving Data', () => {
      props.term = 'Hello world';
      const component = ReactTestUtils.renderIntoDocument(
        <Search {...props} />
      );
      let data = component.getData(false);
      expect(data).toEqual({ searchTerm: 'Hello world' });

      data = component.getData(true);
      expect(data).toEqual({});
    });
  });

  describe('searchTermIsDirty()', () => {
    it('Start pristine, dirty on change, pristine on search', () => {
      props.term = '';
      const component = ReactTestUtils.renderIntoDocument(
        <Search {...props} />
      );
      // Starts oof pristine
      let dirty = component.searchTermIsDirty();
      expect(dirty).toEqual(false);

      // Gets dirty after text change
      component.setState({ searchText: 'Hello world' });
      dirty = component.searchTermIsDirty();
      expect(dirty).toEqual(true);

      // Gets back to pristine after search
      component.doSearch();
      dirty = component.searchTermIsDirty();
      expect(dirty).toEqual(false);
    });

    it('Trailing space should be ignored', () => {
      props.term = ' Hello world';
      const component = ReactTestUtils.renderIntoDocument(
        <Search {...props} />
      );
      // Starts oof pristine
      let dirty = component.searchTermIsDirty();
      expect(dirty).toEqual(false);

      // Gets dirty after text change
      component.setState({ searchText: 'Hello world  ' });
      dirty = component.searchTermIsDirty();
      expect(dirty).toEqual(false);
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
