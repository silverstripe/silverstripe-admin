/* global jest, test, describe, beforeEach, it, expect, Event */

import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { Component as OptionsetField } from '../OptionsetField';

const props = {
  id: 'set',
  title: '',
  name: 'set',
  value: 'two',
  source: [
    { value: 'one', title: '1' },
    { value: 'two', title: '2' },
    { value: 'three', title: '3' },
    { value: 'four', title: '4' },
  ],
  onChange: jest.fn()
};

test('OptionsetField getItemKey() should generate a key for field', () => {
  const { container } = render(<OptionsetField {...props}/>);
  expect(container.querySelector('.option-val--one').id).toBe('set-one');
});

test('OptionsetField handleChange() should call the onChange callback', () => {
  const { container } = render(<OptionsetField {...props}/>);
  const input = container.querySelector('input#set-one');
  fireEvent.click(input, { target: { id: 'set-one', value: 1 } });
  expect(props.onChange).toBeCalled();
});
