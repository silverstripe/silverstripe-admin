/* global jest, test, describe, it, expect */

import React from 'react';
import { render } from '@testing-library/react';
import ResizeAware from '../ResizeAware';

test('ResizeAware render() renders with children', () => {
  const { container } = render(
    <ResizeAware {...{
      component: 'div',
      onResize: () => {},
    }}
    />
  );
  expect(container.querySelectorAll('div')).toHaveLength(1);
});
