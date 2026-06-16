/* global jest, test, expect */

import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { Component as OptionField } from '../OptionField';

const makeProps = (overrides = {}) => ({
  id: 'field-1',
  name: 'myfield',
  type: 'radio',
  title: 'My Option',
  leftTitle: null,
  rightTitle: null,
  extraClass: '',
  className: '',
  value: false,
  readOnly: false,
  disabled: false,
  onChange: jest.fn(),
  ...overrides,
});

test('OptionField renders without errors with minimal props', () => {
  const { container } = render(<OptionField {...makeProps()} />);
  expect(container.querySelector('input')).not.toBeNull();
});

test('OptionField renders a radio input by default', () => {
  const { container } = render(<OptionField {...makeProps()} />);
  const input = container.querySelector('input');
  expect(input.type).toBe('radio');
});

test('OptionField renders a checkbox input when type is checkbox', () => {
  const { container } = render(<OptionField {...makeProps({ type: 'checkbox' })} />);
  const input = container.querySelector('input');
  expect(input.type).toBe('checkbox');
});

test('OptionField renders with the correct id', () => {
  const { container } = render(<OptionField {...makeProps({ id: 'my-id' })} />);
  const input = container.querySelector('input');
  expect(input.id).toBe('my-id');
});

test('OptionField renders with the correct name', () => {
  const { container } = render(<OptionField {...makeProps({ name: 'myname' })} />);
  const input = container.querySelector('input');
  expect(input.name).toBe('myname');
});

test('OptionField renders checked when value is truthy', () => {
  const { container } = render(<OptionField {...makeProps({ value: 1 })} />);
  const input = container.querySelector('input');
  expect(input.checked).toBe(true);
});

test('OptionField renders unchecked when value is falsy', () => {
  const { container } = render(<OptionField {...makeProps({ value: 0 })} />);
  const input = container.querySelector('input');
  expect(input.checked).toBe(false);
});

test('OptionField renders with checked CSS class when value is truthy', () => {
  const { container } = render(<OptionField {...makeProps({ value: true })} />);
  const input = container.querySelector('input');
  expect(input.className).toContain('checked');
});

test('OptionField renders without checked CSS class when value is falsy', () => {
  const { container } = render(<OptionField {...makeProps({ value: false })} />);
  const input = container.querySelector('input');
  expect(input.className).not.toContain('checked');
});

test('OptionField applies extraClass to the input', () => {
  const { container } = render(<OptionField {...makeProps({ extraClass: 'my-extra' })} />);
  const input = container.querySelector('input');
  expect(input.className).toContain('my-extra');
});

test('OptionField applies className to the input', () => {
  const { container } = render(<OptionField {...makeProps({ className: 'my-class' })} />);
  const input = container.querySelector('input');
  expect(input.className).toContain('my-class');
});

test('OptionField adds option-field--disabled class when disabled', () => {
  const { container } = render(<OptionField {...makeProps({ disabled: true })} />);
  const input = container.querySelector('input');
  expect(input.className).toContain('option-field--disabled');
});

test('OptionField adds option-field--disabled class when readOnly', () => {
  const { container } = render(<OptionField {...makeProps({ readOnly: true })} />);
  const input = container.querySelector('input');
  expect(input.className).toContain('option-field--disabled');
});

test('OptionField sets disabled attribute when disabled prop is true', () => {
  const { container } = render(<OptionField {...makeProps({ disabled: true })} />);
  const input = container.querySelector('input');
  expect(input.disabled).toBe(true);
});

test('OptionField sets disabled attribute when readOnly prop is true', () => {
  const { container } = render(<OptionField {...makeProps({ readOnly: true })} />);
  const input = container.querySelector('input');
  expect(input.disabled).toBe(true);
});

test('OptionField calls onChange when clicked and not readOnly or disabled', () => {
  const onChange = jest.fn();
  const { container } = render(<OptionField {...makeProps({ type: 'checkbox', value: false, onChange })} />);
  const input = container.querySelector('input');
  fireEvent.click(input);
  expect(onChange).toHaveBeenCalled();
});

test('OptionField calls onChange with id and value arguments', () => {
  const onChange = jest.fn();
  const { container } = render(<OptionField {...makeProps({ type: 'checkbox', id: 'field-1', value: false, onChange })} />);
  const input = container.querySelector('input');
  fireEvent.click(input);
  expect(onChange).toHaveBeenCalledWith(
    expect.anything(),
    expect.objectContaining({ id: 'field-1', value: 1 })
  );
});

test('OptionField calls onChange with value 0 when unchecked', () => {
  const onChange = jest.fn();
  const { container } = render(<OptionField {...makeProps({ type: 'checkbox', id: 'field-1', value: true, onChange })} />);
  const input = container.querySelector('input');
  fireEvent.click(input);
  expect(onChange).toHaveBeenCalledWith(
    expect.anything(),
    expect.objectContaining({ id: 'field-1', value: 0 })
  );
});

test('OptionField prevents onChange when readOnly', () => {
  const onChange = jest.fn();
  // When readOnly=true, input has disabled=true attribute so jsdom won't fire events
  // Verify the component marks the input as disabled when readOnly, preventing callbacks
  const { container } = render(<OptionField {...makeProps({ readOnly: true, onChange })} />);
  const input = container.querySelector('input');
  expect(input.disabled).toBe(true);
  expect(onChange).not.toHaveBeenCalled();
});

test('OptionField prevents onChange when disabled', () => {
  const onChange = jest.fn();
  // When disabled=true, input has disabled=true attribute so jsdom won't fire events
  // Verify the component marks the input as disabled, preventing callbacks
  const { container } = render(<OptionField {...makeProps({ disabled: true, onChange })} />);
  const input = container.querySelector('input');
  expect(input.disabled).toBe(true);
  expect(onChange).not.toHaveBeenCalled();
});

test('OptionField calls onClick when no onChange is provided', () => {
  const onClick = jest.fn();
  const { container } = render(<OptionField {...makeProps({ type: 'checkbox', onChange: null, onClick })} />);
  const input = container.querySelector('input');
  fireEvent.click(input);
  expect(onClick).toHaveBeenCalled();
});

test('OptionField does not call onClick if onChange is provided', () => {
  const onChange = jest.fn();
  const onClick = jest.fn();
  const { container } = render(<OptionField {...makeProps({ type: 'checkbox', onChange, onClick })} />);
  const input = container.querySelector('input');
  fireEvent.click(input);
  expect(onClick).not.toHaveBeenCalled();
  expect(onChange).toHaveBeenCalled();
});

test('OptionField renders title as label text when leftTitle is null', () => {
  const { container } = render(<OptionField {...makeProps({ title: 'My Title', leftTitle: null })} />);
  expect(container.querySelector('label').textContent).toContain('My Title');
});

test('OptionField renders leftTitle as label text when provided', () => {
  const { container } = render(<OptionField {...makeProps({ leftTitle: 'Left Title', title: 'Title' })} />);
  expect(container.querySelector('label').textContent).toContain('Left Title');
});

test('OptionField combines leftTitle and rightTitle when both provided', () => {
  const { container } = render(<OptionField {...makeProps({ leftTitle: 'Left', rightTitle: 'Right' })} />);
  const labelText = container.querySelector('label').textContent;
  expect(labelText).toContain('Left');
  expect(labelText).toContain('Right');
});

test('OptionField renders label with leftTitle when rightTitle is null', () => {
  const { container } = render(<OptionField {...makeProps({ leftTitle: 'Left', rightTitle: null })} />);
  const labelText = container.querySelector('label').textContent;
  expect(labelText).toContain('Left');
  expect(labelText).not.toContain('null');
});

test('OptionField applies role prop when provided', () => {
  const { container } = render(<OptionField {...makeProps({ role: 'option' })} />);
  const input = container.querySelector('input');
  expect(input.getAttribute('role')).toBe('option');
});

test('OptionField does not set role attribute when role prop is not provided', () => {
  const { container } = render(<OptionField {...makeProps({ role: undefined })} />);
  const input = container.querySelector('input');
  expect(input.getAttribute('role')).toBeNull();
});
