/* global test, expect */

import React from 'react';
import { render } from '@testing-library/react';
import HiddenField from '../HiddenField';

const makeProps = (overrides = {}) => ({
  name: 'MyName',
  ...overrides,
});

test('HiddenField renders a hidden input with the required name by default', () => {
  const { container } = render(<HiddenField {...makeProps()} />);
  const input = container.querySelector('input');

  expect(input).not.toBeNull();
  expect(input.getAttribute('type')).toBe('hidden');
  expect(input.getAttribute('name')).toBe('MyName');
  expect(input.value).toBe('');
  expect(input.hasAttribute('id')).toBe(false);
});

test('HiddenField merges className and extraClass onto the input element', () => {
  const { container } = render(
    <HiddenField
      {...makeProps({
        className: 'base-class',
        extraClass: 'extra-class',
      })}
    />
  );
  const input = container.querySelector('input');

  expect(input.classList.contains('base-class')).toBe(true);
  expect(input.classList.contains('extra-class')).toBe(true);
});

test('HiddenField passes through the provided id and value props', () => {
  const { container } = render(
    <HiddenField
      {...makeProps({
        id: 'hidden-field-id',
        value: 'MyValue',
      })}
    />
  );
  const input = container.querySelector('input');

  expect(input.getAttribute('id')).toBe('hidden-field-id');
  expect(input.value).toBe('MyValue');
});

test('HiddenField coerces falsey values to an empty string', () => {
  const { container } = render(
    <HiddenField
      {...makeProps({
        value: 0,
      })}
    />
  );
  const input = container.querySelector('input');

  expect(input.value).toBe('');
});
