/* global jest, test, expect */

import React from 'react';
import { render, act } from '@testing-library/react';
import fetch from 'isomorphic-fetch';
import ListboxField, { Component as UnwrappedListboxField } from '../ListboxField';

jest.mock('isomorphic-fetch', () => jest.fn());

const makeSelect = (testId) => jest.fn(() => <div data-testid={testId} />);

const makeProps = (obj = {}) => ({
  name: 'MyField',
  options: [{ Title: 'One', Value: '1' }, { Title: 'Two', Value: '2' }],
  SelectComponent: makeSelect('select'),
  AsyncSelectComponent: makeSelect('async'),
  CreatableSelectComponent: makeSelect('creatable'),
  AsyncCreatableSelectComponent: makeSelect('async-creatable'),
  ...obj,
});

const lastProps = (mock) => mock.mock.calls[mock.mock.calls.length - 1][0];

test('ListboxField renders the plain select by default with options and keys', () => {
  const props = makeProps();
  const { getByTestId } = render(<UnwrappedListboxField {...props} />);
  expect(getByTestId('select')).not.toBeNull();
  const selectProps = lastProps(props.SelectComponent);
  expect(selectProps.options).toBe(props.options);
  expect(selectProps.isMulti).toBe(false);
  expect(selectProps.isDisabled).toBe(false);
  expect(selectProps.cacheOptions).toBe(true);
  expect(selectProps.classNamePrefix).toBe('ss-listbox-field');
  expect(selectProps.getOptionLabel({ Title: 'One', Value: '1' })).toBe('One');
  expect(selectProps.getOptionValue({ Title: 'One', Value: '1' })).toBe('1');
});

test('ListboxField uses custom labelKey and valueKey', () => {
  const props = makeProps({ labelKey: 'L', valueKey: 'V' });
  render(<UnwrappedListboxField {...props} />);
  const selectProps = lastProps(props.SelectComponent);
  expect(selectProps.getOptionLabel({ L: 'Label', V: 'val' })).toBe('Label');
  expect(selectProps.getOptionValue({ L: 'Label', V: 'val' })).toBe('val');
  expect(selectProps.getNewOptionData('abc', 'ABC')).toEqual({ L: 'ABC', V: 'abc' });
});

test('ListboxField passes multi and disabled to the select', () => {
  const props = makeProps({ multi: true, disabled: true });
  render(<UnwrappedListboxField {...props} />);
  const selectProps = lastProps(props.SelectComponent);
  expect(selectProps.isMulti).toBe(true);
  expect(selectProps.isDisabled).toBe(true);
});

test('ListboxField passes through unknown attributes and strips config props', () => {
  const props = makeProps({ name: 'Foo', placeholder: 'Pick one' });
  render(<UnwrappedListboxField {...props} />);
  const selectProps = lastProps(props.SelectComponent);
  expect(selectProps.name).toBe('Foo');
  expect(selectProps.placeholder).toBe('Pick one');
  expect(selectProps.lazyLoad).toBeUndefined();
  expect(selectProps.creatable).toBeUndefined();
  expect(selectProps.SelectComponent).toBeUndefined();
});

test('ListboxField picks the select component based on lazyLoad and creatable', () => {
  const lazy = makeProps({ lazyLoad: true });
  const { getByTestId, unmount } = render(<UnwrappedListboxField {...lazy} />);
  expect(getByTestId('async')).not.toBeNull();
  unmount();
  const creatable = makeProps({ creatable: true });
  const second = render(<UnwrappedListboxField {...creatable} />);
  expect(second.getByTestId('creatable')).not.toBeNull();
  second.unmount();
  const both = makeProps({ lazyLoad: true, creatable: true });
  const third = render(<UnwrappedListboxField {...both} />);
  expect(third.getByTestId('async-creatable')).not.toBeNull();
});

test('ListboxField gives loadOptions instead of options when lazyLoad is enabled', () => {
  const props = makeProps({ lazyLoad: true });
  render(<UnwrappedListboxField {...props} />);
  const selectProps = lastProps(props.AsyncSelectComponent);
  expect(selectProps.options).toBeUndefined();
  expect(typeof selectProps.loadOptions).toBe('function');
});

test('ListboxField loadOptions resolves to an empty array for empty input', async () => {
  const props = makeProps({ lazyLoad: true });
  render(<UnwrappedListboxField {...props} />);
  const result = await lastProps(props.AsyncSelectComponent).loadOptions('');
  expect(result).toEqual([]);
});

test('ListboxField loadOptions fetches and maps options from optionUrl', async () => {
  jest.useFakeTimers();
  fetch.mockClear();
  fetch.mockResolvedValue({
    json: () => Promise.resolve({
      items: [{ Title: 'Apple', Value: 'a', Selected: true }],
    }),
  });
  const props = makeProps({ lazyLoad: true, optionUrl: 'admin/options' });
  render(<UnwrappedListboxField {...props} />);
  const promise = lastProps(props.AsyncSelectComponent).loadOptions('app');
  await act(async () => {
    jest.advanceTimersByTime(600);
  });
  const result = await promise;
  jest.useRealTimers();
  expect(fetch).toHaveBeenCalledTimes(1);
  const [calledUrl, calledOptions] = fetch.mock.calls[0];
  expect(calledUrl).toContain('admin/options?');
  expect(calledUrl).toContain('term=app');
  expect(calledOptions).toEqual({ credentials: 'same-origin' });
  expect(result).toEqual([{ Title: 'Apple', Value: 'a', Selected: true }]);
});

test('ListboxField calls onChange with the new value when controlled', () => {
  const onChange = jest.fn();
  const props = makeProps({ onChange, value: '1' });
  render(<UnwrappedListboxField {...props} />);
  const selectProps = lastProps(props.SelectComponent);
  expect(selectProps.value).toBe('1');
  selectProps.onChange({ Title: 'Two', Value: '2' });
  expect(onChange).toHaveBeenCalledWith({ Title: 'Two', Value: '2' });
});

test('ListboxField keeps its own value in state when uncontrolled', () => {
  const props = makeProps({ value: { Title: 'One', Value: '1' } });
  render(<UnwrappedListboxField {...props} />);
  expect(lastProps(props.SelectComponent).value).toEqual({ Title: 'One', Value: '1' });
  act(() => {
    lastProps(props.SelectComponent).onChange({ Title: 'Two', Value: '2' });
  });
  expect(lastProps(props.SelectComponent).value).toEqual({ Title: 'Two', Value: '2' });
});

test('ListboxField unwraps a nested object value for single selects only', () => {
  const nested = { 0: { Title: 'One', Value: '1' } };
  const single = makeProps({ onChange: jest.fn(), value: nested });
  render(<UnwrappedListboxField {...single} />);
  expect(lastProps(single.SelectComponent).value).toEqual({ Title: 'One', Value: '1' });
  const multi = makeProps({ onChange: jest.fn(), value: nested, multi: true });
  render(<UnwrappedListboxField {...multi} />);
  expect(lastProps(multi.SelectComponent).value).toBe(nested);
});

test('ListboxField leaves a primitive first value as is for single selects', () => {
  const value = ['a', 'b'];
  const props = makeProps({ onChange: jest.fn(), value });
  render(<UnwrappedListboxField {...props} />);
  expect(lastProps(props.SelectComponent).value).toBe(value);
});

test('ListboxField provides a blur handler that does nothing', () => {
  const props = makeProps();
  render(<UnwrappedListboxField {...props} />);
  expect(lastProps(props.SelectComponent).onBlur()).toBeUndefined();
});

test('ListboxField noOptionsMessage depends on the input', () => {
  const props = makeProps();
  render(<UnwrappedListboxField {...props} />);
  const { noOptionsMessage } = lastProps(props.SelectComponent);
  expect(noOptionsMessage({ inputValue: 'abc' })).toBe('No options');
  expect(noOptionsMessage({ inputValue: '' })).toBe('Type to search');
});

test('ListboxField isValidNewOption rejects empty input', () => {
  const props = makeProps();
  render(<UnwrappedListboxField {...props} />);
  const { isValidNewOption } = lastProps(props.SelectComponent);
  expect(isValidNewOption('', [], props.options)).toBe(false);
});

test('ListboxField isValidNewOption rejects values already selected', () => {
  const props = makeProps();
  render(<UnwrappedListboxField {...props} />);
  const { isValidNewOption } = lastProps(props.SelectComponent);
  expect(isValidNewOption('x', [{ Value: 'x' }], [])).toBe(false);
  expect(isValidNewOption('x', { Value: 'x' }, [])).toBe(false);
});

test('ListboxField isValidNewOption rejects values in current options', () => {
  const props = makeProps();
  render(<UnwrappedListboxField {...props} />);
  const { isValidNewOption } = lastProps(props.SelectComponent);
  expect(isValidNewOption('1', [], props.options)).toBe(false);
});

test('ListboxField isValidNewOption accepts a new value', () => {
  const props = makeProps();
  render(<UnwrappedListboxField {...props} />);
  const { isValidNewOption } = lastProps(props.SelectComponent);
  expect(isValidNewOption('new', [{ Value: 'x' }], props.options)).toBe(true);
  expect(isValidNewOption('new', { Value: 'x' }, props.options)).toBe(true);
});

test('ListboxField wrapped export renders with a field holder', () => {
  const props = makeProps({ id: 'Form_MyField', title: 'My title' });
  const { container, getByTestId } = render(<ListboxField {...props} />);
  expect(getByTestId('select')).not.toBeNull();
  expect(container.querySelector('.form-group')).not.toBeNull();
});
