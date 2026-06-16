/* global jest, test, describe, beforeEach, it, expect, Event */

import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import OptionsetFieldDefault, { Component as OptionsetField } from '../OptionsetField';

const makeProps = (overrides = {}) => ({
  id: 'set',
  title: '',
  name: 'set',
  value: 'two',
  source: [
    { value: 'one', title: '1' },
    { value: 'two', title: '2' },
    { value: 'three', title: '3' },
    { value: 'four', title: '4' },
  ],
  onChange: jest.fn(),
  ...overrides,
});

const props = {
  id: 'set',
  title: '',
  name: 'set',
  value: 'two',
  source: [
    { value: 'one', title: '1' },
    { value: 'two', title: '2' },
    { value: 'three', title: '3' },
    { value: 'four', title: '4' },
  ],
  onChange: jest.fn()
};

test('OptionsetField getItemKey() should generate a key for field', () => {
  const { container } = render(<OptionsetField {...props}/>);
  expect(container.querySelector('.option-val--one').id).toBe('set-one');
});

test('OptionsetField handleChange() should call the onChange callback', () => {
  const { container } = render(<OptionsetField {...props}/>);
  const input = container.querySelector('input#set-one');
  fireEvent.click(input, { target: { id: 'set-one', value: 1 } });
  expect(props.onChange).toBeCalled();
});

test('OptionsetField renders null when source is not provided', () => {
  const { container } = render(<OptionsetField {...makeProps({ source: null })} />);
  expect(container.firstChild).toBeNull();
});

test('OptionsetField renders a listbox div with source items', () => {
  const { container } = render(<OptionsetField {...makeProps()} />);
  const listbox = container.querySelector('[role="listbox"]');
  expect(listbox).not.toBeNull();
  expect(listbox.children).toHaveLength(4);
});

test('OptionsetField getItemKey() generates key for item with empty value', () => {
  const { container } = render(<OptionsetField {...makeProps({ source: [{ value: '', title: 'empty' }] })} />);
  const item = container.querySelector('.option-val--');
  expect(item).not.toBeNull();
  expect(item.id).toBe('set-empty0');
});

test('OptionsetField getOptionProps() sets correct className on items', () => {
  const { container } = render(<OptionsetField {...makeProps({ itemClass: 'my-item' })} />);
  expect(container.querySelector('.my-item.option-val--one')).not.toBeNull();
});

test('OptionsetField getOptionProps() marks selected item as checked', () => {
  const { container } = render(<OptionsetField {...makeProps({ value: 'one' })} />);
  const checkedInput = container.querySelector('input#set-one');
  expect(checkedInput.checked).toBe(true);
  const uncheckedInput = container.querySelector('input#set-two');
  expect(uncheckedInput.checked).toBe(false);
});

test('OptionsetField getOptionProps() disables items when disabled prop is true', () => {
  const { container } = render(<OptionsetField {...makeProps({ disabled: true })} />);
  const inputs = container.querySelectorAll('input[disabled]');
  expect(inputs).toHaveLength(4);
});

test('OptionsetField getOptionProps() disables item when source item is disabled', () => {
  const source = [
    { value: 'one', title: '1', disabled: true },
    { value: 'two', title: '2' },
  ];
  const { container } = render(<OptionsetField {...makeProps({ source })} />);
  const disabledInput = container.querySelector('input#set-one');
  expect(disabledInput.disabled).toBe(true);
  const enabledInput = container.querySelector('input#set-two');
  expect(enabledInput.disabled).toBe(false);
});

test('OptionsetField handleChange() does not call onChange when onChange is not a function', () => {
  const { container } = render(<OptionsetField {...makeProps({ onChange: null })} />);
  const input = container.querySelector('input#set-one');
  expect(() => {
    fireEvent.click(input, { target: { id: 'set-one', value: 1 } });
  }).not.toThrow();
});

test('OptionsetField handleChange() passes correct value from source to onChange', () => {
  const onChange = jest.fn();
  const { container } = render(<OptionsetField {...makeProps({ onChange })} />);
  const input = container.querySelector('input#set-one');
  fireEvent.click(input, { target: { id: 'set-one', value: 1 } });
  expect(onChange).toHaveBeenCalledWith(
    expect.anything(),
    { id: 'set', value: 'one' }
  );
});

test('OptionsetField default export is wrapped with fieldHolder', () => {
  // The default export wraps with fieldHolder; render with required props
  const { container } = render(
    <OptionsetFieldDefault
      id="test"
      name="test"
      title="Test"
      source={[{ value: 'a', title: 'A' }]}
    />
  );
  // fieldHolder renders a wrapper — the listbox should still be present
  expect(container.querySelector('[role="listbox"]')).not.toBeNull();
});
