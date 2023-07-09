/* global jest, test, describe, it, expect */

import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { ToastActions, ToastAction } from '../ToastActions';

function makeProps(obj = {}) {
  return {
    label: 'foo bar',
    href: 'https://silverstripe.org/',
    dismissed: false,
    ...obj
  };
}

test('ToastActions link', () => {
  const { container } = render(<ToastAction {...makeProps()}/>);
  const link = container.querySelector('a');
  expect(link.getAttribute('href')).toBe('https://silverstripe.org/');
  expect(link.innerHTML).toBe('foo bar');
});

test('ToastActions button', () => {
  const onClick = jest.fn();
  const onDismiss = jest.fn();
  const { container } = render(
    <ToastAction {...makeProps({
      href: null,
      onClick,
      onDismiss
    })}
    />
  );
  const button = container.querySelector('button');
  expect(button.innerHTML).toBe('foo bar');
  fireEvent.click(button, {});
  expect(onClick).toBeCalled();
  expect(onDismiss).toBeCalled();
});

test('ToastActions button toast already dismissed', () => {
  const onClick = jest.fn();
  const onDismiss = jest.fn();
  const { container } = render(
    <ToastAction {...makeProps({
      href: null,
      dismissed: true,
      onClick,
      onDismiss
    })}
    />
  );
  const button = container.querySelector('button');
  fireEvent.click(button, {});
  expect(onClick).not.toBeCalled();
  expect(onDismiss).not.toBeCalled();
});

test('ToastActions no actions', () => {
  const onClickA = jest.fn();
  const onClickB = jest.fn();
  const onDismiss = jest.fn();
  const { container } = render(
    <ToastActions {...{
      actions: [
        {
          label: 'foo bar',
          href: 'https://silverstripe.org/',
        },
        {
          label: 'bar foo',
          onClick: onClickA,
        },
        {
          label: 'I will be truncated',
          onClick: onClickB,
        },
      ],
      dismissed: false,
      onDismiss
    }}
    />
  );
  expect(container.querySelectorAll('a')).toHaveLength(1);
  expect(container.querySelectorAll('button')).toHaveLength(1);
  expect(container.querySelector('a').innerHTML).toBe('foo bar');
  const button = container.querySelector('button');
  expect(button.innerHTML).toBe('bar foo');
  fireEvent.click(button, {});
  expect(onClickA).toBeCalled();
});
