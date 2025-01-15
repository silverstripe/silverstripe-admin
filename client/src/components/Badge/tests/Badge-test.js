/* global jest, test, describe, it, expect */

import React from 'react';
import { render } from '@testing-library/react';
import Badge from '../Badge';

test('Badge render() should return null if status is empty', () => {
  const { container } = render(
    <Badge {...{
      status: null,
      message: '',
      className: ''
    }}
    />
  );
  expect(container.querySelector('.badge')).toBeNull();
});

test('Badge render() should return a Bootstrap style badge when valid', () => {
  const { container } = render(
    <Badge {...{
      status: 'success',
      message: 'Hello world',
      className: 'customclass'
    }}
    />
  );
  expect(container.querySelectorAll('.badge').length).toBe(1);
  expect(container.querySelectorAll('.text-bg-success').length).toBe(1);
  expect(container.querySelectorAll('.customclass').length).toBe(1);
  expect(container.innerHTML).toContain('Hello world');
});
