/* global jest, test, describe, it, expect */

import React from 'react';
import { render } from '@testing-library/react';
import HiddenField from '../HiddenField';

test('HiddenField render() renders', () => {
  const { container } = render(
    <HiddenField {...{
      id: 'my-id',
      extraClass: 'my-extra-class',
      name: 'MyName',
      value: 'MyValue',
    }}
    />
  );
  expect(container.querySelectorAll('input')).toHaveLength(1);
});

test('HiddenField render() renders', () => {
  const { container } = render(
    <HiddenField {...{
      id: 'my-id',
      extraClass: 'my-extra-class',
      name: 'MyName',
      value: null,
    }}
    />
  );
  expect(container.querySelectorAll('input')).toHaveLength(1);
});
