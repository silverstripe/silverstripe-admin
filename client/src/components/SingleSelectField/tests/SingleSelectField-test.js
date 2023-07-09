/* global jest, test, describe, it, expect */

import React from 'react';
import { render } from '@testing-library/react';
import SingleSelectField from '../SingleSelectField';

function makeProps(obj = {}) {
  return {
    id: 'my-id',
    name: 'MyName',
    onChange: () => {},
    value: 'My value',
    readOnly: false,
    disabled: false,
    source: [],
    data: {
      emptyString: 'Any'
    },
    ...obj
  };
}

test('SingleSelectField render() renders', () => {
  const { container } = render(<SingleSelectField {...makeProps()}/>);
  expect(container.querySelectorAll('select')).toHaveLength(1);
});

test('SingleSelectField render() renders with a null value', () => {
  const { container } = render(
    <SingleSelectField {...makeProps({
      value: null
    })}
    />
  );
  expect(container.querySelectorAll('select')).toHaveLength(1);
});

test('SingleSelectField render() renders as a p tag when readOnly', () => {
  const { container } = render(
    <SingleSelectField {...makeProps({
      readOnly: true
    })}
    />
  );
  expect(container.querySelectorAll('p')).toHaveLength(1);
});

test('SingleSelectField render() renders as a p readOnly and a null value', () => {
  const { container } = render(
    <SingleSelectField {...makeProps({
      readOnly: true,
      value: null
    })}
    />
  );
  expect(container.querySelectorAll('p')).toHaveLength(1);
});
