/* global jest, test, describe, it, expect */

import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Toast from '../Toast';

test('Toast render', () => {
  const onDismiss = jest.fn();
  const { container } = render(
    <Toast {...{
      type: 'notice',
      text: 'Foo bar',
      onDismiss,
      dismissed: false,
      id: 'abc123'
    }}
    />
  );
  expect(container.querySelectorAll('.toast.toast--notice')).toHaveLength(1);
  expect(container.querySelectorAll('.toast__close')).toHaveLength(1);
  const content = container.querySelector('.toast__content');
  expect(content.innerHTML).toBe('Foo bar');
  expect(content.getAttribute('aria-live')).toBe('assertive');
  expect(content.getAttribute('aria-atomic')).toBe('true');
  const close = container.querySelector('.toast__close');
  fireEvent.click(close, {});
  expect(onDismiss).toBeCalled();
});

test('Toast dismiss', () => {
  const onDismiss = jest.fn();
  const { container } = render(
    <Toast {...{
      type: 'warning',
      text: 'Foo bar',
      onDismiss,
      dismissed: true,
      id: 'abc123'
    }}
    />
  );
  expect(container.querySelectorAll('.toast--warning')).toHaveLength(1);
  expect(container.querySelectorAll('.toast--dismissing')).toHaveLength(1);
});

test('Toast type error', () => {
  const { container } = render(
    <Toast {...{
      type: 'error',
      text: 'Foo bar',
      dismissed: false,
      onDismiss: () => null,
      id: 'abc123',
    }}
    />
  );
  expect(container.querySelectorAll('.toast--error')).toHaveLength(1);
});
