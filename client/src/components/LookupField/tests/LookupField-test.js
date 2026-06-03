/* global jest, test, describe, beforeEach, it, expect, require */

import React from 'react';
import { render } from '@testing-library/react';
import LookupFieldWrapper, { Component as LookupField } from '../LookupField';

function makeProps(obj = {}) {
  return {
    id: 'set',
    name: 'set',
    source: [
      { value: 'one', title: '1' },
      { value: 'two', title: '2' },
      { value: 'three', title: '3' },
      { value: 'four', title: '4' },
    ],
    value: null,
    ...obj
  };
}

test('LookupField getValueCSV() should return an empty string', () => {
  const { container } = render(
    <LookupField {...makeProps({
      value: [],
    })}
    />
  );
  expect(container.querySelector('p').innerHTML).toBe("('None')");
});

test('LookupField getValueCSV() should return the string value', () => {
  const { container } = render(
    <LookupField {...makeProps({
      value: 'two',
    })}
    />
  );
  expect(container.querySelector('p').innerHTML).toBe('2');
});

test('LookupField getValueCSV() should return the string values', () => {
  const { container } = render(
    <LookupField {...makeProps({
      value: ['two', 'three'],
    })}
    />
  );
  expect(container.querySelector('p').innerHTML).toBe('2, 3');
});

test('LookupField renders None when value is null', () => {
  const { container } = render(
    <LookupField {...makeProps({
      value: null,
    })}
    />
  );
  expect(container.querySelector('p').innerHTML).toBe("('None')");
});

test('LookupField renders null when source is not provided', () => {
  const { container } = render(
    <LookupField {...makeProps({
      source: undefined,
    })}
    />
  );
  expect(container.querySelector('p')).toBeNull();
});

test('LookupField getValueCSV() should return the title for a numeric value', () => {
  const { container } = render(
    <LookupField {...makeProps({
      source: [
        { value: 1, title: 'One' },
        { value: 2, title: 'Two' },
      ],
      value: 1,
    })}
    />
  );
  expect(container.querySelector('p').innerHTML).toBe('One');
});

test('LookupField getValueCSV() should show None when value is not found in source', () => {
  const { container } = render(
    <LookupField {...makeProps({
      value: 'notfound',
    })}
    />
  );
  expect(container.querySelector('p').innerHTML).toBe("('None')");
});

test('LookupField renders with className and extraClass applied', () => {
  const { container } = render(
    <LookupField {...makeProps({
      className: 'my-class',
      extraClass: 'extra-class',
    })}
    />
  );
  const p = container.querySelector('p');
  expect(p.className).toContain('my-class');
  expect(p.className).toContain('extra-class');
});

test('LookupField renders with id and name attributes', () => {
  const { container } = render(
    <LookupField {...makeProps({
      id: 'my-id',
      name: 'my-name',
      value: 'one',
    })}
    />
  );
  const p = container.querySelector('p');
  expect(p.getAttribute('id')).toBe('my-id');
  expect(p.getAttribute('name')).toBe('my-name');
});

test('LookupField fieldHolder wrapper renders a form group', () => {
  const { container } = render(
    <LookupFieldWrapper {...makeProps({
      title: 'My Field',
      value: 'one',
    })}
    />
  );
  expect(container.querySelectorAll('.form-group')).toHaveLength(1);
  expect(container.querySelector('p')).not.toBeNull();
});
