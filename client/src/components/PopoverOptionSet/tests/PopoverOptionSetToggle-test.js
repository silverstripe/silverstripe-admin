/* global jest, test, expect, beforeEach, afterEach */

import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { Component as PopoverOptionSetToggle } from '../PopoverOptionSetToggle';

jest.mock('lib/Injector', () => ({
  inject: () => (component) => component,
}));

jest.mock('reactstrap', () => ({
  Button: ({ id, onClick, children, ...rest }) => (
    <button data-testid="toggle-button" id={id} onClick={onClick} {...rest}>
      {children}
    </button>
  ),
}));

jest.mock('../PopoverOptionSet', () => ({
  __esModule: true,
  default: ({ isOpen, toggle, target }) => (
    <div data-testid="popover-option-set" data-is-open={isOpen ? 'true' : 'false'} data-target={target}>
      <button data-testid="popover-toggle" onClick={toggle}>popover toggle</button>
    </div>
  ),
}));

jest.mock('i18n', () => ({
  _t: (key, fallback) => fallback,
}));

function makeProps(obj = {}) {
  return {
    id: 'test-toggle-id',
    toggleText: 'Toggle',
    buttonProps: {},
    buttons: [],
    ...obj
  };
}

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});

test('PopoverOptionSetToggle renders without errors with minimal props', () => {
  render(<PopoverOptionSetToggle {...makeProps()} />);
  expect(screen.getByTestId('toggle-button')).not.toBeNull();
  expect(screen.getByTestId('popover-option-set')).not.toBeNull();
});

test('PopoverOptionSetToggle renders button with the id prop', () => {
  render(<PopoverOptionSetToggle {...makeProps({ id: 'my-unique-id' })} />);
  const button = screen.getByTestId('toggle-button');
  expect(button.id).toBe('my-unique-id');
});

test('PopoverOptionSetToggle renders button with toggleText', () => {
  render(<PopoverOptionSetToggle {...makeProps({ toggleText: 'Open Options' })} />);
  expect(screen.getByText('Open Options')).not.toBeNull();
});

test('PopoverOptionSetToggle renders button with default toggleText when not provided', () => {
  const { toggleText, ...propsWithoutToggleText } = makeProps();
  render(<PopoverOptionSetToggle {...propsWithoutToggleText} />);
  expect(screen.getByText('Toggle')).not.toBeNull();
});

test('PopoverOptionSetToggle initially renders with isOpen false', () => {
  render(<PopoverOptionSetToggle {...makeProps()} />);
  const popover = screen.getByTestId('popover-option-set');
  expect(popover.getAttribute('data-is-open')).toBe('false');
});

test('PopoverOptionSetToggle clicking the button toggles isOpen to true', () => {
  render(<PopoverOptionSetToggle {...makeProps()} />);
  const button = screen.getByTestId('toggle-button');
  fireEvent.click(button);
  act(() => {
    jest.runAllTimers();
  });
  const popover = screen.getByTestId('popover-option-set');
  expect(popover.getAttribute('data-is-open')).toBe('true');
});

test('PopoverOptionSetToggle clicking the button a second time toggles isOpen back to false', () => {
  render(<PopoverOptionSetToggle {...makeProps()} />);
  const button = screen.getByTestId('toggle-button');
  fireEvent.click(button);
  act(() => {
    jest.runAllTimers();
  });
  fireEvent.click(button);
  act(() => {
    jest.runAllTimers();
  });
  const popover = screen.getByTestId('popover-option-set');
  expect(popover.getAttribute('data-is-open')).toBe('false');
});

test('PopoverOptionSetToggle passes the id as the target to PopoverOptionSet', () => {
  render(<PopoverOptionSetToggle {...makeProps({ id: 'my-popover-target' })} />);
  const popover = screen.getByTestId('popover-option-set');
  expect(popover.getAttribute('data-target')).toBe('my-popover-target');
});

test('PopoverOptionSetToggle popover toggle callback toggles isOpen', () => {
  render(<PopoverOptionSetToggle {...makeProps()} />);
  const popoverToggle = screen.getByTestId('popover-toggle');
  fireEvent.click(popoverToggle);
  act(() => {
    jest.runAllTimers();
  });
  const popover = screen.getByTestId('popover-option-set');
  expect(popover.getAttribute('data-is-open')).toBe('true');
});

test('PopoverOptionSetToggle passes buttonProps to the Button component', () => {
  render(<PopoverOptionSetToggle {...makeProps({ buttonProps: { className: 'custom-class' } })} />);
  const button = screen.getByTestId('toggle-button');
  expect(button.classList).toContain('custom-class');
});
