/* global jest, test, expect, beforeEach */

import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import fetch from 'isomorphic-fetch';
import ListboxField, { Component as ListboxFieldComponent } from '../ListboxField';

const selectProps = {};

const createSelectComponent = (type) => (props) => {
  selectProps[type] = props;
  return (
    <div>
      <div data-testid={`select-${type}`}>{type}</div>
      <button
        type="button"
        onClick={() => props.onChange({ Title: 'Changed', Value: 'changed' })}
      >
        {`trigger-${type}`}
      </button>
    </div>
  );
};

jest.mock('react-select', () => createSelectComponent('default'));
jest.mock('react-select/async', () => createSelectComponent('async'));
jest.mock('react-select/async-creatable', () => createSelectComponent('async-creatable'));
jest.mock('react-select/creatable', () => createSelectComponent('creatable'));
jest.mock('isomorphic-fetch', () => jest.fn());
jest.mock('debounce-promise', () => jest.fn((fn) => fn));
jest.mock('i18n', () => ({
  _t: (key, fallback) => fallback,
}));
jest.mock('containers/EmotionCssCacheProvider/EmotionCssCacheProvider', () => (props) => props.children);

function makeProps(obj = {}) {
  return {
    id: 'listbox-field',
    name: 'ListboxField',
    labelKey: 'Title',
    valueKey: 'Value',
    lazyLoad: false,
    creatable: false,
    multi: false,
    disabled: false,
    options: [],
    optionUrl: '/options',
    value: null,
    ...obj,
  };
}

beforeEach(() => {
  Object.keys(selectProps).forEach((key) => delete selectProps[key]);
  fetch.mockReset();
});

test('ListboxField renders default select component', () => {
  render(<ListboxFieldComponent {...makeProps()} />);
  expect(screen.getByTestId('select-default')).not.toBeNull();
  expect(selectProps.default.isMulti).toBe(false);
  expect(selectProps.default.isDisabled).toBe(false);
  expect(selectProps.default.classNamePrefix).toBe('ss-listbox-field');
});

test('ListboxField renders async-creatable select when lazy loading and creatable', () => {
  render(<ListboxFieldComponent {...makeProps({ lazyLoad: true, creatable: true })} />);
  expect(screen.getByTestId('select-async-creatable')).not.toBeNull();
  expect(typeof selectProps['async-creatable'].loadOptions).toBe('function');
});

test('ListboxField renders async select when lazy loading without creatable', () => {
  render(<ListboxFieldComponent {...makeProps({ lazyLoad: true, creatable: false })} />);
  expect(screen.getByTestId('select-async')).not.toBeNull();
  expect(typeof selectProps.async.loadOptions).toBe('function');
});

test('ListboxField renders creatable select when creatable without lazy loading', () => {
  render(<ListboxFieldComponent {...makeProps({ lazyLoad: false, creatable: true })} />);
  expect(screen.getByTestId('select-creatable')).not.toBeNull();
  expect(selectProps.creatable.options).toEqual([]);
});

test('ListboxField calls onChange in controlled mode', () => {
  const onChange = jest.fn();
  render(<ListboxFieldComponent {...makeProps({ onChange })} />);
  fireEvent.click(screen.getByRole('button', { name: 'trigger-default' }));
  expect(onChange).toHaveBeenCalledWith({ Title: 'Changed', Value: 'changed' });
});

test('ListboxField updates internal state in uncontrolled mode', async () => {
  render(<ListboxFieldComponent {...makeProps({ multi: true, value: [] })} />);
  fireEvent.click(screen.getByRole('button', { name: 'trigger-default' }));
  await waitFor(() => {
    expect(selectProps.default.value).toEqual({ Title: 'Changed', Value: 'changed' });
  });
});

test('ListboxField does not call external onBlur handler', () => {
  const onBlur = jest.fn();
  render(<ListboxFieldComponent {...makeProps({ onBlur })} />);
  selectProps.default.onBlur();
  expect(onBlur).not.toHaveBeenCalled();
});

test('ListboxField provides static options when lazy loading is disabled', () => {
  const options = [{ Title: 'One', Value: '1' }];
  render(<ListboxFieldComponent {...makeProps({ options })} />);
  expect(selectProps.default.options).toEqual(options);
  expect(selectProps.default.loadOptions).toBeUndefined();
});

test('ListboxField loadOptions returns empty list for empty lazy input', async () => {
  render(<ListboxFieldComponent {...makeProps({ lazyLoad: true })} />);
  const result = await selectProps.async.loadOptions('');
  expect(result).toEqual([]);
});

test('ListboxField loadOptions fetches and maps remote results for lazy mode', async () => {
  fetch.mockResolvedValue({
    json: () => Promise.resolve({
      items: [
        { Title: 'First', Value: 'first', Selected: true },
      ],
    }),
  });
  render(<ListboxFieldComponent {...makeProps({ lazyLoad: true, optionUrl: '/options?foo=bar' })} />);
  const result = await selectProps.async.loadOptions('term');
  expect(fetch).toHaveBeenCalledWith('/options?foo=bar', { credentials: 'same-origin' });
  expect(result).toEqual([{ Title: 'First', Value: 'first', Selected: true }]);
});

test('ListboxField normalises single select object value shape', () => {
  const value = {
    ListboxField: { Title: 'One', Value: '1' },
  };
  render(<ListboxFieldComponent {...makeProps({ value, onChange: jest.fn() })} />);
  expect(selectProps.default.value).toEqual(value.ListboxField);
});

test('ListboxField noOptionsMessage changes based on user input', () => {
  render(<ListboxFieldComponent {...makeProps()} />);
  expect(selectProps.default.noOptionsMessage({ inputValue: '' })).toBe('Type to search');
  expect(selectProps.default.noOptionsMessage({ inputValue: 'new value' })).toBe('No options');
});

test('ListboxField validates new options against selected and existing values', () => {
  render(<ListboxFieldComponent {...makeProps({ onChange: jest.fn(), value: [{ Value: '1' }] })} />);
  const isValidNewOption = selectProps.default.isValidNewOption;
  expect(isValidNewOption('', [{ Value: '1' }], [{ Value: '2' }])).toBe(false);
  expect(isValidNewOption('1', [{ Value: '1' }], [{ Value: '2' }])).toBe(false);
  expect(isValidNewOption('2', [{ Value: '1' }], [{ Value: '2' }])).toBe(false);
  expect(isValidNewOption('3', [{ Value: '1' }], [{ Value: '2' }])).toBe(true);
  expect(isValidNewOption('3', { Value: '3' }, [{ Value: '2' }])).toBe(false);
});

test('ListboxField default export works with fieldHolder wrapper', () => {
  render(<ListboxField {...makeProps({ noHolder: true })} />);
  expect(screen.getByTestId('select-default')).not.toBeNull();
});
