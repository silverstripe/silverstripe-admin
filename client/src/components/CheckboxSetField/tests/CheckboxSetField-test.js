/* global jest, test, expect */

import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import CheckboxSetFieldDefault, { Component as CheckboxSetField } from '../CheckboxSetField';

function makeProps(obj = {}) {
  return {
    id: 'checkbox',
    title: '',
    name: 'checkbox',
    value: '',
    source: [
      { value: 'one', title: '1' },
      { value: 'two', title: '2' },
      { value: 'three', title: '3' },
      { value: 'four', title: '4' },
    ],
    ...obj,
  };
}

test('CheckboxSetField renders with two inputs checked', () => {
  const { container } = render(
    <CheckboxSetField {...makeProps({
      value: ['one', 'three']
    })}
    />
  );
  expect(container.querySelector('input#checkbox-one').getAttribute('value')).toBe('1');
  expect(container.querySelector('input#checkbox-one').hasAttribute('checked')).toBe(true);
  expect(container.querySelector('input#checkbox-two').getAttribute('value')).toBe('1');
  expect(container.querySelector('input#checkbox-two').hasAttribute('checked')).toBe(false);
  expect(container.querySelector('input#checkbox-three').getAttribute('value')).toBe('1');
  expect(container.querySelector('input#checkbox-three').hasAttribute('checked')).toBe(true);
  expect(container.querySelector('input#checkbox-four').getAttribute('value')).toBe('1');
  expect(container.querySelector('input#checkbox-four').hasAttribute('checked')).toBe(false);
  // labels
  expect(container.querySelectorAll('span')[0].innerHTML).toBe('1');
  expect(container.querySelectorAll('span')[1].innerHTML).toBe('2');
  expect(container.querySelectorAll('span')[2].innerHTML).toBe('3');
  expect(container.querySelectorAll('span')[3].innerHTML).toBe('4');
});

test('CheckboxSetField renders with string value', () => {
  const { container } = render(
    <CheckboxSetField {...makeProps({
      value: 'two'
    })}
    />
  );
  expect(container.querySelector('input#checkbox-one').hasAttribute('checked')).toBe(false);
  expect(container.querySelector('input#checkbox-two').hasAttribute('checked')).toBe(true);
  expect(container.querySelector('input#checkbox-three').hasAttribute('checked')).toBe(false);
  expect(container.querySelector('input#checkbox-four').hasAttribute('checked')).toBe(false);
});

test('CheckboxSetField renders with no value', () => {
  const { container } = render(
    <CheckboxSetField {...makeProps({
      value: ''
    })}
    />
  );
  expect(container.querySelector('input#checkbox-one').hasAttribute('checked')).toBe(false);
  expect(container.querySelector('input#checkbox-two').hasAttribute('checked')).toBe(false);
  expect(container.querySelector('input#checkbox-three').hasAttribute('checked')).toBe(false);
  expect(container.querySelector('input#checkbox-four').hasAttribute('checked')).toBe(false);
});

test('CheckboxSetField onChange adds a value', () => {
  const onChange = jest.fn();
  const { container } = render(
    <CheckboxSetField {...makeProps({
      value: ['two', 'three'],
      onChange
    })}
    />
  );
  const input = container.querySelector('input#checkbox-one');
  fireEvent.click(input);
  expect(onChange).toBeCalledWith(
    expect.objectContaining({ _reactName: 'onChange' }),
    { id: 'checkbox', value: ['one', 'two', 'three'] }
  );
});

test('CheckboxSetField onChange removes a value', () => {
  const onChange = jest.fn();
  const { container } = render(
    <CheckboxSetField {...makeProps({
      value: ['two', 'three'],
      onChange
    })}
    />
  );
  const input = container.querySelector('input#checkbox-two');
  fireEvent.click(input);
  expect(onChange).toBeCalledWith(
    expect.objectContaining({ _reactName: 'onChange' }),
    { id: 'checkbox', value: ['three'] }
  );
});

test('CheckboxSetField renders null without a source', () => {
  const { container } = render(
    <CheckboxSetField {...makeProps({
      source: null
    })}
    />
  );
  expect(container.firstChild).toBeNull();
});

test('CheckboxSetField coerces numeric values and empty item keys', () => {
  const { container } = render(
    <CheckboxSetField {...makeProps({
      id: 'numeric-checkbox',
      value: 2,
      source: [
        { value: '', title: 'Empty' },
        { value: 2, title: '2' },
      ],
    })}
    />
  );
  expect(container.querySelector('input#numeric-checkbox-empty0')).not.toBeNull();
  expect(container.querySelector('input#numeric-checkbox-empty0').hasAttribute('checked')).toBe(false);
  expect(container.querySelector('input#numeric-checkbox-2').hasAttribute('checked')).toBe(true);
});

test('CheckboxSetField passes item classes and disabled state to options', () => {
  const { container } = render(
    <CheckboxSetField {...makeProps({
      itemClass: 'custom-item',
      readOnly: true,
      source: [
        { value: 'one', title: '1' },
        { value: 'two', title: '2', disabled: true },
      ],
    })}
    />
  );
  expect(container.querySelector('input#checkbox-one').classList.contains('custom-item')).toBe(true);
  expect(container.querySelector('input#checkbox-one').hasAttribute('disabled')).toBe(true);
  expect(container.querySelector('input#checkbox-one').hasAttribute('readonly')).toBe(true);
  expect(container.querySelector('input#checkbox-two').hasAttribute('disabled')).toBe(true);
});

test('CheckboxSetField does not call onChange when readOnly', () => {
  const onChange = jest.fn();
  const { container } = render(
    <CheckboxSetField {...makeProps({
      onChange,
      readOnly: true,
      value: ['two'],
    })}
    />
  );
  fireEvent.click(container.querySelector('input#checkbox-one'));
  expect(onChange).not.toBeCalled();
});

test('CheckboxSetField default export renders with field holder', () => {
  render(
    <CheckboxSetFieldDefault {...makeProps({
      description: 'Choose every option that applies',
      extraClass: 'extra-holder',
      title: 'Checkbox choices',
      value: ['one'],
    })}
    />
  );
  expect(screen.getByText('Checkbox choices')).not.toBeNull();
  expect(screen.getByText('Choose every option that applies')).not.toBeNull();
  expect(screen.getByRole('listbox')).not.toBeNull();
  expect(screen.getByText('Checkbox choices').closest('.field').classList.contains('extra-holder')).toBe(true);
});
