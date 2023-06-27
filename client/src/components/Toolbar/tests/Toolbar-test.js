/* global jest, test, describe, it, expect */

import React from 'react';
import { render } from '@testing-library/react';
import Toolbar from '../Toolbar';

test('Toolbar render', () => {
  const { container } = render(
    <Toolbar {...{
      onBackButtonClick: jest.fn(),
      showBackButton: false
    }}
    />
  );
  expect(container.querySelectorAll('div.toolbar')).toHaveLength(1);
  expect(container.querySelectorAll('.back-button')).toHaveLength(0);
});
