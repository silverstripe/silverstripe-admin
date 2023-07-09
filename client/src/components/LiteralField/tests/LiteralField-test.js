/* global jest, test, describe, it, expect */

import React from 'react';
import { render } from '@testing-library/react';
import LiteralField from '../LiteralField';

test('LiteralField render() renders', () => {
  const { container } = render(
    <LiteralField {...{
      id: 'my-id',
      name: 'MyName',
      className: 'my-classname',
      extraClass: 'my-extra-class',
      value: '<h2>My literal heading</h2><p>My literal content</p>',
    }}
    />
  );
  const h2 = container.querySelector('h2');
  const p = container.querySelector('p');
  expect(h2.innerHTML).toBe('My literal heading');
  expect(p.innerHTML).toBe('My literal content');
});
