/* global jest, test, describe, it, expect */

import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Tab from '../Tab';

const onToggle = jest.fn();

function makeProps(obj = {}) {
  return {
    title: 'Foo bar',
    tabClassName: 'special',
    onToggle,
    ...obj
  };
}

test('Tab onToggle', () => {
  const { container } = render(<Tab {...makeProps()}/>);
  const link = container.querySelector('.nav-item .special');
  fireEvent.click(link, {});
  expect(onToggle).toBeCalled();
});

test('Tab active', () => {
  const { container } = render(
    <Tab {...makeProps({
      active: true,
    })}
    />
  );
  expect(container.querySelectorAll('.nav-item .special.active')).toHaveLength(1);
});

test('Tab inactive', () => {
  const { container } = render(
    <Tab {...makeProps({
      active: false,
    })}
    />
  );
  expect(container.querySelectorAll('.nav-item .special.active')).toHaveLength(0);
});

test('Tab disabled', () => {
  const { container } = render(
    <Tab {...makeProps({
      disabled: true,
    })}
    />
  );
  expect(container.querySelector('.nav-item .special.disabled').hasAttribute('disabled')).toBeTruthy();
});

test('Tab no title', () => {
  const { container } = render(
    <Tab {...makeProps({
      title: null,
    })}
    />
  );
  expect(container.querySelectorAll('a')).toHaveLength(0);
});
