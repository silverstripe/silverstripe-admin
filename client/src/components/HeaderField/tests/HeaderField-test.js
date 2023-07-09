/* global jest, test, describe, it, expect */

import React from 'react';
import { render } from '@testing-library/react';
import HeaderField from '../HeaderField';

test('HeaderField minimal render', () => {
  const { container } = render(
    <HeaderField {...{
      data: { title: 'test' }
    }}
    />
  );
  expect(container.querySelectorAll('h3')).toHaveLength(1);
});

test('HeaderField render with all options', () => {
  const { container } = render(
    <HeaderField {...{
      data: { title: 'test', headingLevel: 1 },
      className: 'a',
      extraClass: 'b',
      id: 'testID'
    }}
    />
  );
  const h1 = container.querySelector('h1');
  expect(h1.classList).toContain('a');
  expect(h1.classList).toContain('b');
  expect(h1.id).toBe('testID');
  expect(h1.innerHTML).toBe('test');
});
