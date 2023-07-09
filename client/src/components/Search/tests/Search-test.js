/* global jest, test, describe, it, expect, beforeEach */

// FormBuilderLoader mock was not mocking properly
// manually override with a stateless null component
import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { Component as Search, hasFilters } from '../Search';

jest.mock('containers/FormBuilderLoader/FormBuilderLoader', () => () => null);

function makeProps(obj = {}) {
  return {
    formSchemaUrl: 'someUrl',
    id: 'MyForm',
    schemaName: 'mySchemaName',
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
    ...obj
  };
}

test('Search handleChange', () => {
  const reduxFormChange = jest.fn();
  let props = makeProps();
  props = {
    ...props,
    actions: {
      ...props.actions,
      reduxForm: {
        change: reduxFormChange
      }
    },
    formData: {
      searchTerm: 'foo'
    }
  };
  const { container } = render(<Search {...props}/>);
  const input = container.querySelector('.search-box__content-field');
  // handle change is called on initial render
  expect(reduxFormChange).toHaveBeenCalledWith('mySchemaName', 'searchTerm', '');
  fireEvent.change(input, { target: { value: 'foo' } });
  expect(input.value).toEqual('foo');
  expect(reduxFormChange).toHaveBeenCalledWith('mySchemaName', 'searchTerm', 'foo');
});

test('Search display NONE', () => {
  const { container } = render(<Search {...makeProps({
    display: 'NONE'
  })}
  />);
  expect(container.querySelector('.search')).toBeNull();
});

test('Search display VISIBLE', () => {
  const { container } = render(<Search {...makeProps({
    display: 'VISIBLE'
  })}
  />);
  expect(container.querySelector('.search')).not.toBeNull();
  expect(container.querySelector('.search-form').classList).toContain('collapse');
});

test('Search display EXPANDED', () => {
  const { container } = render(<Search {...makeProps({
    display: 'EXPANDED'
  })}
  />);
  expect(container.querySelector('.search')).not.toBeNull();
  expect(container.querySelector('.search-form').classList).toContain('collapsing');
  expect(container.querySelector('.search-form').getAttribute('style')).toContain('height: 0px;');
});

test('Search doSearch', () => {
  const onSearch = jest.fn();
  const { container } = render(<Search {...makeProps({
    onSearch
  })}
  />);
  const input = container.querySelector('.search-box__content-field');
  fireEvent.change(input, { target: { value: 'foo' } });
  fireEvent.click(container.querySelector('.search-form__submit'));
  expect(onSearch).toHaveBeenCalledWith({ searchTerm: 'foo' });
});

test('Search setOverrides converts values into name/value notation', () => {
  const mockSetSchemaStateOverrides = jest.fn();
  let props = makeProps({
    filters: {
      foo: true,
      bar: null
    }
  });
  props = {
    ...props,
    actions: {
      ...props.actions,
      schema: {
        ...props.actions.schema,
        setSchemaStateOverrides: mockSetSchemaStateOverrides
      }
    }
  };
  render(<Search {...props}/>);
  expect(mockSetSchemaStateOverrides).toHaveBeenCalledWith('someUrl', {
    fields: [
      { name: 'foo', value: true },
      { name: 'bar', value: null }
    ]
  });
});

test('Search clear button()', () => {
  const { container } = render(<Search {...makeProps()}/>);
  const input = container.querySelector('.search-box__content-field');
  expect(container.querySelector('.search-form__clear')).toBeNull();
  fireEvent.change(input, { target: { value: 'foo' } });
  expect(container.querySelector('.search-form__clear')).not.toBeNull();
  fireEvent.change(input, { target: { value: '' } });
  expect(container.querySelector('.search-form__clear')).toBeNull();
});

test('Search trailing space should be ignored', () => {
  const onSearch = jest.fn();
  const { container } = render(<Search {...makeProps({
    onSearch
  })}
  />);
  const input = container.querySelector('.search-box__content-field');
  fireEvent.change(input, { target: { value: 'Hello world ' } });
  fireEvent.click(container.querySelector('.search-form__submit'));
  expect(onSearch).toBeCalledWith({ searchTerm: 'Hello world' });
});

test('hasFilters returns false with null', () => {
  expect(hasFilters(null)).toBeFalsy();
});

test('hasFilters returns false with empty object', () => {
  expect(hasFilters({})).toBeFalsy();
});

test('hasFilters returns true when keyed object', () => {
  expect(hasFilters({ foo: 'bar' })).toBeTruthy();
});
