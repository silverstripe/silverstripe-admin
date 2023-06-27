/* global jest, test, describe, it, expect */
import React from 'react';
import { render } from '@testing-library/react';
import CircularLoading from '../CircularLoading';

test('CircularLoading render() can be displayed as "block"', () => {
  const { container } = render(
    <CircularLoading {...{
      block: true,
    }}
    />
  );
  expect(container.querySelectorAll('.ss-circular-loading-indicator--block')).toHaveLength(1);
});

test('CircularLoading render() allows extra classes to be provided', () => {
  const { container } = render(
    <CircularLoading {...{
      className: 'hello-world',
    }}
    />
  );
  expect(container.querySelectorAll('.ss-circular-loading-indicator.hello-world')).toHaveLength(1);
});
