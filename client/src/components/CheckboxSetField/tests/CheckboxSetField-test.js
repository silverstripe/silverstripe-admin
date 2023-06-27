/* global jest, test, describe, beforeEach, it, expect, Event */

import React from 'react';
import { render, fireEvent } from '@testing-library/react';
// get non-default because it uses FieldHolder by default
import { Component as CheckboxSetField } from '../CheckboxSetField';

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
