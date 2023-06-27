/* global jest, test, describe, it, expect */

import React from 'react';
import { render } from '@testing-library/react';
import NotFoundComponent from '../NotFoundComponent';

test('NotFoundComponent render() renders', () => {
  const { container } = render(
    <NotFoundComponent {...{
      itemName: 'MyItemName',
      name: 'MyName',
      value: 'My value'
    }}
    />
  );
  expect(container.querySelectorAll('div.not-found-component')).toHaveLength(1);
});
