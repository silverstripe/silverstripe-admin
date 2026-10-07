/* global jest, test, expect, window */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Component as PopoverOptionSetToggle } from '../PopoverOptionSetToggle';

jest.mock('../PopoverOptionSet', () => ({ toggle, isOpen, target, extra }) => (
  <div data-testid="popover" data-open={String(isOpen)} data-target={target} data-extra={extra}>
    <button type="button" onClick={toggle}>popover-toggle</button>
  </div>
));

function makeProps(obj = {}) {
  return {
    id: 'my-toggle',
    ...obj,
  };
}

test('PopoverOptionSetToggle renders a button with the default text', () => {
  render(<PopoverOptionSetToggle {...makeProps()} />);
  const button = screen.getByRole('button', { name: 'Toggle' });
  expect(button.getAttribute('id')).toBe('my-toggle');
});

test('PopoverOptionSetToggle renders custom toggleText', () => {
  render(<PopoverOptionSetToggle {...makeProps({ toggleText: 'Open me' })} />);
  expect(screen.getByRole('button', { name: 'Open me' })).not.toBeNull();
});

test('PopoverOptionSetToggle forwards buttonProps to the button', () => {
  render(<PopoverOptionSetToggle {...makeProps({ buttonProps: { className: 'custom-btn', id: 'ignored' } })} />);
  const button = screen.getByRole('button', { name: 'Toggle' });
  expect(button.classList.contains('custom-btn')).toBe(true);
  expect(button.getAttribute('id')).toBe('my-toggle');
});

test('PopoverOptionSetToggle forwards other props to the popover and sets target', () => {
  render(<PopoverOptionSetToggle {...makeProps({ extra: 'forwarded' })} />);
  const popover = screen.getByTestId('popover');
  expect(popover.getAttribute('data-extra')).toBe('forwarded');
  expect(popover.getAttribute('data-target')).toBe('my-toggle');
  expect(popover.getAttribute('data-open')).toBe('false');
});

test('PopoverOptionSetToggle opens and closes when the button is clicked', async () => {
  render(<PopoverOptionSetToggle {...makeProps()} />);
  const popover = screen.getByTestId('popover');
  fireEvent.click(screen.getByRole('button', { name: 'Toggle' }));
  await waitFor(() => expect(popover.getAttribute('data-open')).toBe('true'));
  fireEvent.click(screen.getByRole('button', { name: 'Toggle' }));
  await waitFor(() => expect(popover.getAttribute('data-open')).toBe('false'));
});

test('PopoverOptionSetToggle state change is deferred to the end of the execution queue', async () => {
  render(<PopoverOptionSetToggle {...makeProps()} />);
  const popover = screen.getByTestId('popover');
  fireEvent.click(screen.getByRole('button', { name: 'Toggle' }));
  expect(popover.getAttribute('data-open')).toBe('false');
  await waitFor(() => expect(popover.getAttribute('data-open')).toBe('true'));
});

test('PopoverOptionSetToggle popover toggle callback toggles the open state', async () => {
  render(<PopoverOptionSetToggle {...makeProps()} />);
  const popover = screen.getByTestId('popover');
  fireEvent.click(screen.getByRole('button', { name: 'popover-toggle' }));
  await waitFor(() => expect(popover.getAttribute('data-open')).toBe('true'));
});
