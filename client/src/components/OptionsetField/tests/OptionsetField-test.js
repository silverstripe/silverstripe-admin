/* global jest, test, describe, beforeEach, it, expect, Event */

import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { Component as OptionsetField } from '../OptionsetField';

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

test('OptionsetField renders nothing when source is not provided', () => {
  const { container } = render(<OptionsetField {...props} source={undefined} />);
  expect(container.firstChild).toBeNull();
});

test('OptionsetField renders a listbox with one radio option per source item', () => {
  const { container } = render(<OptionsetField {...props} />);
  expect(container.querySelector('[role="listbox"]')).not.toBeNull();
  const inputs = container.querySelectorAll('input');
  expect(inputs).toHaveLength(4);
  inputs.forEach((input) => {
    expect(input.type).toBe('radio');
    expect(input.name).toBe('set');
  });
});

test('OptionsetField checks only the option matching the value', () => {
  const { container } = render(<OptionsetField {...props} />);
  expect(container.querySelector('input#set-two').checked).toBe(true);
  expect(container.querySelector('input#set-one').checked).toBe(false);
});

test('OptionsetField compares value to item values as strings', () => {
  const source = [{ value: 1, title: 'one' }, { value: 2, title: 'two' }];
  const { container } = render(<OptionsetField {...props} value="2" source={source} />);
  expect(container.querySelector('input#set-2').checked).toBe(true);
  expect(container.querySelector('input#set-1').checked).toBe(false);
});

test('OptionsetField uses an empty key for items without a value', () => {
  const source = [{ value: '', title: 'none' }, { value: 'a', title: 'A' }];
  const { container } = render(<OptionsetField {...props} value="a" source={source} />);
  expect(container.querySelector('input#set-empty0')).not.toBeNull();
  expect(container.querySelector('input#set-a')).not.toBeNull();
});

test('OptionsetField applies itemClass to each option', () => {
  const { container } = render(<OptionsetField {...props} itemClass="my-item" />);
  expect(container.querySelector('input#set-one').classList.contains('my-item')).toBe(true);
  expect(container.querySelector('input#set-one').classList.contains('option-val--one')).toBe(true);
});

test('OptionsetField disables items marked as disabled', () => {
  const source = [{ value: 'a', title: 'A', disabled: true }, { value: 'b', title: 'B' }];
  const { container } = render(<OptionsetField {...props} source={source} />);
  expect(container.querySelector('input#set-a').disabled).toBe(true);
  expect(container.querySelector('input#set-b').disabled).toBe(false);
});

test('OptionsetField disables every option when disabled', () => {
  const { container } = render(<OptionsetField {...props} disabled />);
  container.querySelectorAll('input').forEach((input) => {
    expect(input.disabled).toBe(true);
  });
});

test('OptionsetField makes every option read only when readOnly', () => {
  const { container } = render(<OptionsetField {...props} readOnly />);
  container.querySelectorAll('input').forEach((input) => {
    expect(input.readOnly).toBe(true);
  });
});

test('OptionsetField handleChange() calls onChange with the field id and the selected value', () => {
  const onChange = jest.fn();
  const { container } = render(<OptionsetField {...props} onChange={onChange} />);
  fireEvent.click(container.querySelector('input#set-three'));
  expect(onChange).toHaveBeenCalledTimes(1);
  expect(onChange.mock.calls[0][1]).toEqual({ id: 'set', value: 'three' });
});

test('OptionsetField handleChange() does not throw without an onChange callback', () => {
  const { container } = render(<OptionsetField {...props} onChange={undefined} />);
  expect(() => fireEvent.click(container.querySelector('input#set-three'))).not.toThrow();
});
