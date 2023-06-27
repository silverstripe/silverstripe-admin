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
