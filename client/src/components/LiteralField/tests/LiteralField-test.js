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

test('LiteralField renders with minimal props', () => {
  const { container } = render(
    <LiteralField {...{
      name: 'MinimalField',
      value: '',
    }}
    />
  );
  const div = container.querySelector('div');
  expect(div).not.toBeNull();
  expect(div.getAttribute('name')).toBe('MinimalField');
  expect(div.getAttribute('id')).toBeNull();
  expect(div.className.trim()).toBe('');
  expect(div.innerHTML).toBe('');
});

test('LiteralField applies id and class names', () => {
  const { container } = render(
    <LiteralField {...{
      id: 'field-id',
      name: 'FieldName',
      className: 'field-class',
      extraClass: 'extra-class',
      value: 'Content',
    }}
    />
  );
  const div = container.querySelector('div');
  expect(div.getAttribute('id')).toBe('field-id');
  expect(div.getAttribute('name')).toBe('FieldName');
  expect(div.className).toBe('field-class extra-class');
  expect(div.innerHTML).toBe('Content');
});
