/* global jest, test, describe, it, expect */

import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import OptionFieldDefault, { Component as OptionField } from '../OptionField';

const makeProps = (props = {}) => ({
  id: 'my-option',
  name: 'MyOption',
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
  ...props,
});

test('OptionField renders without errors with default props', () => {
  const { container } = render(<OptionField {...makeProps()} />);
  expect(container.querySelector('input')).not.toBeNull();
});

test('OptionField renders a radio input by default', () => {
  const { container } = render(<OptionField {...makeProps()} />);
  expect(container.querySelector('input[type="radio"]')).not.toBeNull();
});

test('OptionField renders a checkbox input when type is checkbox', () => {
  const { container } = render(<OptionField {...makeProps({ type: 'checkbox' })} />);
  expect(container.querySelector('input[type="checkbox"]')).not.toBeNull();
});

test('OptionField renders with the correct id', () => {
  const { container } = render(<OptionField {...makeProps({ id: 'my-id' })} />);
  expect(container.querySelector('input#my-id')).not.toBeNull();
});

test('OptionField renders with the correct name', () => {
  const { container } = render(<OptionField {...makeProps({ name: 'my-name' })} />);
  expect(container.querySelector('input[name="my-name"]')).not.toBeNull();
});

test('OptionField renders checked when value is truthy', () => {
  const { container } = render(<OptionField {...makeProps({ value: true })} />);
  expect(container.querySelector('input').checked).toBe(true);
});

test('OptionField renders unchecked when value is falsy', () => {
  const { container } = render(<OptionField {...makeProps({ value: false })} />);
  expect(container.querySelector('input').checked).toBe(false);
});

test('OptionField applies extraClass to the input', () => {
  const { container } = render(
    <OptionField {...makeProps({ extraClass: 'my-extra-class' })} />
  );
  expect(container.querySelector('input.my-extra-class')).not.toBeNull();
});

test('OptionField applies checked CSS class when value is truthy', () => {
  const { container } = render(<OptionField {...makeProps({ value: true })} />);
  expect(container.querySelector('input.checked')).not.toBeNull();
});

test('OptionField renders as disabled when disabled prop is true', () => {
  const { container } = render(<OptionField {...makeProps({ disabled: true })} />);
  expect(container.querySelector('input').disabled).toBe(true);
});

test('OptionField applies option-field--disabled class when disabled', () => {
  const { container } = render(<OptionField {...makeProps({ disabled: true })} />);
  expect(container.querySelector('input.option-field--disabled')).not.toBeNull();
});

test('OptionField renders as disabled when readOnly prop is true', () => {
  const { container } = render(<OptionField {...makeProps({ readOnly: true })} />);
  expect(container.querySelector('input').disabled).toBe(true);
});

test('OptionField applies option-field--disabled class when readOnly', () => {
  const { container } = render(<OptionField {...makeProps({ readOnly: true })} />);
  expect(container.querySelector('input.option-field--disabled')).not.toBeNull();
});

test('OptionField applies disabled CSS class when readOnly', () => {
  const { container } = render(<OptionField {...makeProps({ readOnly: true })} />);
  expect(container.querySelector('input.disabled')).not.toBeNull();
});

test('OptionField calls onChange when changed', () => {
  const onChange = jest.fn();
  const { container } = render(<OptionField {...makeProps({ onChange })} />);
  const input = container.querySelector('input');
  fireEvent.click(input);
  expect(onChange).toHaveBeenCalled();
});

test('OptionField calls onChange with id and value when changed', () => {
  const onChange = jest.fn();
  const { container } = render(<OptionField {...makeProps({ id: 'my-option', onChange })} />);
  const input = container.querySelector('input');
  fireEvent.click(input);
  expect(onChange).toHaveBeenCalledWith(
    expect.anything(),
    expect.objectContaining({ id: 'my-option' })
  );
});

test('OptionField calls onClick if onChange is not provided', () => {
  const onClick = jest.fn();
  const { container } = render(
    <OptionField {...makeProps({ onChange: undefined, onClick })} />
  );
  const input = container.querySelector('input');
  fireEvent.click(input);
  expect(onClick).toHaveBeenCalled();
});

test('OptionField does not call onChange when readOnly', () => {
  const onChange = jest.fn();
  const { container } = render(
    <OptionField {...makeProps({ readOnly: true, onChange })} />
  );
  const input = container.querySelector('input');
  fireEvent.click(input);
  expect(onChange).not.toHaveBeenCalled();
});

test('OptionField does not call onChange when disabled', () => {
  const onChange = jest.fn();
  const { container } = render(
    <OptionField {...makeProps({ disabled: true, onChange })} />
  );
  const input = container.querySelector('input');
  fireEvent.click(input);
  expect(onChange).not.toHaveBeenCalled();
});

test('OptionField renders title as label text when leftTitle is null', () => {
  const { container } = render(
    <OptionField {...makeProps({ title: 'My Title', leftTitle: null, rightTitle: null })} />
  );
  expect(container.querySelector('label span').textContent).toBe('My Title');
});

test('OptionField renders leftTitle as label text when provided', () => {
  const { container } = render(
    <OptionField {...makeProps({ leftTitle: 'Left Title', rightTitle: null })} />
  );
  expect(container.querySelector('label span').textContent).toBe('Left Title');
});

test('OptionField renders combined leftTitle and rightTitle', () => {
  const { container } = render(
    <OptionField {...makeProps({ leftTitle: 'Left', rightTitle: 'Right' })} />
  );
  expect(container.querySelector('label span').textContent).toBe('Left Right');
});

test('OptionField renders with role attribute when provided', () => {
  const { container } = render(
    <OptionField {...makeProps({ role: 'option' })} />
  );
  expect(container.querySelector('input[role="option"]')).not.toBeNull();
});

test('OptionField does not render role attribute when not provided', () => {
  const { container } = render(<OptionField {...makeProps()} />);
  expect(container.querySelector('input[role]')).toBeNull();
});

test('OptionField default export renders correctly', () => {
  const { container } = render(
    <OptionFieldDefault {...makeProps({ title: 'Test' })} />
  );
  expect(container.querySelector('input')).not.toBeNull();
});
