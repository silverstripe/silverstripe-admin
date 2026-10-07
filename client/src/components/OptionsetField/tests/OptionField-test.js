/* global jest, test, expect */

import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import OptionFieldDefault, { Component as OptionField } from '../OptionField';

const makeProps = (obj = {}) => ({
  id: 'option',
  name: 'option',
  title: 'My option',
  ...obj,
});

test('OptionField renders a radio input with the title by default', () => {
  const { container } = render(<OptionField {...makeProps()} />);
  const input = container.querySelector('input');
  expect(input.type).toBe('radio');
  expect(input.id).toBe('option');
  expect(input.name).toBe('option');
  expect(input.checked).toBe(false);
  expect(input.disabled).toBe(false);
  expect(container.querySelector('span').textContent).toBe('My option');
});

test('OptionField renders a checkbox when type is checkbox', () => {
  const { container } = render(<OptionField {...makeProps({ type: 'checkbox' })} />);
  expect(container.querySelector('input').type).toBe('checkbox');
});

test('OptionField is checked and has checked class when value is truthy', () => {
  const { container } = render(<OptionField {...makeProps({ value: 1 })} />);
  const input = container.querySelector('input');
  expect(input.checked).toBe(true);
  expect(input.classList.contains('checked')).toBe(true);
});

test('OptionField is not checked when value is falsy', () => {
  const { container } = render(<OptionField {...makeProps({ value: 0 })} />);
  const input = container.querySelector('input');
  expect(input.checked).toBe(false);
  expect(input.classList.contains('checked')).toBe(false);
});

test('OptionField applies className and extraClass to the input', () => {
  const { container } = render(
    <OptionField {...makeProps({ className: 'foo', extraClass: 'bar' })} />
  );
  const input = container.querySelector('input');
  expect(input.classList.contains('foo')).toBe(true);
  expect(input.classList.contains('bar')).toBe(true);
});

test('OptionField is disabled with disabled class when disabled', () => {
  const { container } = render(<OptionField {...makeProps({ disabled: true })} />);
  const input = container.querySelector('input');
  expect(input.disabled).toBe(true);
  expect(input.classList.contains('option-field--disabled')).toBe(true);
  expect(input.classList.contains('disabled')).toBe(false);
});

test('OptionField is disabled and readOnly when readOnly', () => {
  const { container } = render(<OptionField {...makeProps({ readOnly: true })} />);
  const input = container.querySelector('input');
  expect(input.disabled).toBe(true);
  expect(input.readOnly).toBe(true);
  expect(input.classList.contains('option-field--disabled')).toBe(true);
  expect(input.classList.contains('disabled')).toBe(true);
});

test('OptionField sets the role attribute only when role is given', () => {
  const { container, rerender } = render(<OptionField {...makeProps()} />);
  expect(container.querySelector('input').hasAttribute('role')).toBe(false);
  rerender(<OptionField {...makeProps({ role: 'switch' })} />);
  expect(container.querySelector('input').getAttribute('role')).toBe('switch');
});

test('OptionField label combines leftTitle and rightTitle', () => {
  const { container } = render(
    <OptionField {...makeProps({ leftTitle: 'Left', rightTitle: 'Right' })} />
  );
  expect(container.querySelector('span').textContent).toBe('Left Right');
});

test('OptionField label uses title with rightTitle when leftTitle is not set', () => {
  const { container } = render(<OptionField {...makeProps({ rightTitle: 'Right' })} />);
  expect(container.querySelector('span').textContent).toBe('My option Right');
});

test('OptionField label uses leftTitle alone when rightTitle is not set', () => {
  const { container } = render(<OptionField {...makeProps({ leftTitle: 'Left' })} />);
  expect(container.querySelector('span').textContent).toBe('Left');
});

test('OptionField handleChange calls onChange with the event and id and value 1 when checked', () => {
  const onChange = jest.fn();
  const { container } = render(<OptionField {...makeProps({ onChange, type: 'checkbox' })} />);
  fireEvent.click(container.querySelector('input'));
  expect(onChange).toHaveBeenCalledTimes(1);
  expect(onChange.mock.calls[0][1]).toEqual({ id: 'option', value: 1 });
});

test('OptionField handleChange calls onChange with value 0 when unchecked', () => {
  const onChange = jest.fn();
  const { container } = render(
    <OptionField {...makeProps({ onChange, type: 'checkbox', value: 1 })} />
  );
  fireEvent.click(container.querySelector('input'));
  expect(onChange).toHaveBeenCalledTimes(1);
  expect(onChange.mock.calls[0][1]).toEqual({ id: 'option', value: 0 });
});

test('OptionField handleChange falls back to onClick when onChange is not a function', () => {
  const onClick = jest.fn();
  const { container } = render(<OptionField {...makeProps({ onClick })} />);
  fireEvent.click(container.querySelector('input'));
  expect(onClick).toHaveBeenCalledTimes(1);
  expect(onClick.mock.calls[0][1]).toEqual({ id: 'option', value: 1 });
});

test('OptionField handleChange prefers onChange over onClick', () => {
  const onChange = jest.fn();
  const onClick = jest.fn();
  const { container } = render(<OptionField {...makeProps({ onChange, onClick })} />);
  fireEvent.click(container.querySelector('input'));
  expect(onChange).toHaveBeenCalledTimes(1);
  expect(onClick).not.toHaveBeenCalled();
});

test('OptionField handleChange does not throw without any callback', () => {
  const { container } = render(<OptionField {...makeProps()} />);
  expect(() => fireEvent.click(container.querySelector('input'))).not.toThrow();
});

test('OptionField does not call onChange when disabled', () => {
  const onChange = jest.fn();
  const { container } = render(<OptionField {...makeProps({ onChange, disabled: true })} />);
  fireEvent.click(container.querySelector('input'));
  expect(onChange).not.toHaveBeenCalled();
});

test('OptionField does not call onChange when readOnly', () => {
  const onChange = jest.fn();
  const { container } = render(<OptionField {...makeProps({ onChange, readOnly: true })} />);
  fireEvent.click(container.querySelector('input'));
  expect(onChange).not.toHaveBeenCalled();
});

test('OptionField default export renders the same component', () => {
  const { container } = render(<OptionFieldDefault {...makeProps()} />);
  expect(container.querySelector('input').type).toBe('radio');
});
