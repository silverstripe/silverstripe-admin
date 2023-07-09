/* global jest, test, describe, it, expect */

import React from 'react';
import { render } from '@testing-library/react';
import InputField from '../InputField';

function makeProps(obj = {}) {
  return {
    id: 'my-id',
    name: 'MyName',
    className: 'my-classname',
    extraClass: 'my-extra-class',
    onChange: () => {},
    onBlur: () => {},
    onFocus: () => {},
    value: 'my-value',
    readOnly: false,
    disabled: false,
    placeholder: 'My placeholder',
    type: 'text',
    autoFocus: false,
    attributes: {
      'data-abc': '123',
      'data-def': '456',
    },
    title: 'My title',
    ...obj
  };
}

test('InputField render() renders', () => {
  const { container } = render(<InputField {...makeProps()}/>);
  expect(container.querySelectorAll('input')).toHaveLength(1);
});

test('InputField render() renders with a null value', () => {
  const { container } = render(
    <InputField {...makeProps({
      value: null
    })}
    />
  );
  expect(container.querySelectorAll('input')).toHaveLength(1);
});
