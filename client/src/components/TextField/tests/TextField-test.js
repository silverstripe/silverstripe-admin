/* global jest, test, describe, beforeEach, it, expect */

import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { Component as TextField } from '../TextField';

function makeProps(obj = {}) {
  return {
    title: '',
    name: '',
    value: '',
    ...obj
  };
}

test('TextField onChange() should call the onChange function on props', () => {
  const onChange = jest.fn();
  const { container } = render(
    <TextField {...makeProps({
      onChange
    })}
    />
  );
  const input = container.querySelector('input');
  fireEvent.change(input, { target: { value: 'x' } });
  expect(onChange).toBeCalled();
});

test('TextField multiLine() should not be multi-line for empty data', () => {
  const { container } = render(<TextField {...makeProps()}/>);
  const input = container.querySelector('input');
  expect(input.getAttribute('type')).toBe('text');
  expect(input.hasAttribute('multiline')).toBe(false);
});

test('TextField multiLine() should be multi-line for three rows', () => {
  const { container } = render(
    <TextField {...makeProps({
      data: {
        rows: 3
      }
    })}
    />
  );
  expect(container.querySelectorAll('textarea')).toHaveLength(1);
  expect(container.querySelector('textarea').getAttribute('rows')).toBe('3');
});

test('TextField attributs should assign placeholder', () => {
  const { container } = render(
    <TextField {...makeProps({
      attributes: {
        placeholder: 'txt'
      }
    })}
    />
  );
  expect(container.querySelector('input').getAttribute('placeholder')).toBe('txt');
});
