/* global jest, test, describe, beforeEach, it, expect, require */

import React from 'react';
import { render } from '@testing-library/react';
import { Component as LookupField } from '../LookupField';

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

test('LookupField renders nothing without a source', () => {
  const { container } = render(
    <LookupField {...makeProps({
      source: undefined,
    })}
    />
  );
  expect(container.querySelector('p')).toBeNull();
});

test('LookupField getValueCSV() should return the number value', () => {
  const { container } = render(
    <LookupField {...makeProps({
      source: [{ value: 1, title: 'one' }, { value: 2, title: 'two' }],
      value: 2,
    })}
    />
  );
  expect(container.querySelector('p').innerHTML).toBe('two');
});

test('LookupField shows none when the string value is not in the source', () => {
  const { container } = render(
    <LookupField {...makeProps({
      value: 'missing',
    })}
    />
  );
  expect(container.querySelector('p').innerHTML).toBe("('None')");
});

test('LookupField leaves a blank entry for array values that are not in the source', () => {
  const { container } = render(
    <LookupField {...makeProps({
      value: ['two', 'missing', 'four'],
    })}
    />
  );
  expect(container.querySelector('p').innerHTML).toBe('2, , 4');
});

test('LookupField uses an empty array as the default value', () => {
  const props = makeProps();
  delete props.value;
  const { container } = render(<LookupField {...props} />);
  expect(container.querySelector('p').innerHTML).toBe("('None')");
});

test('LookupField applies id, name and classes to the plaintext element', () => {
  const { container } = render(
    <LookupField {...makeProps({
      className: 'base',
      extraClass: 'extra',
    })}
    />
  );
  const element = container.querySelector('p');
  expect(element.getAttribute('id')).toBe('set');
  expect(element.getAttribute('name')).toBe('set');
  expect(element.classList.contains('base')).toBe(true);
  expect(element.classList.contains('extra')).toBe(true);
  expect(element.classList.contains('form-control-plaintext')).toBe(true);
});

test('LookupField uses empty class defaults', () => {
  const { container } = render(<LookupField {...makeProps()} />);
  expect(container.querySelector('p').getAttribute('class')).toBe('  form-control-plaintext');
});

test('LookupField wrapped in fieldHolder renders the value', () => {
  const LookupFieldWithHolder = jest.requireActual('../LookupField').default;
  const { container } = render(
    <LookupFieldWithHolder {...makeProps({
      value: 'two',
    })}
    />
  );
  expect(container.querySelector('p').innerHTML).toBe('2');
});
