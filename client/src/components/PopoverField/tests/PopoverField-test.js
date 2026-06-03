/* global jest, test, expect */

import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import PopoverField from '../PopoverField';

const mockReact = React;
const mockPopoverProps = [];
const mockButtonProps = [];

function mockPopoverComponent(props) {
  mockPopoverProps.push(props);

  return (
    <div
      data-testid="popover"
      data-class-name={props.className || ''}
      data-container={typeof props.container === 'string' ? props.container : ''}
      data-is-wrapper-container={String(Boolean(props.container && props.container.classList?.contains('popover-field')))}
      data-is-open={String(props.isOpen)}
      data-placement={props.placement}
      data-target={props.target}
    >
      {props.children}
    </div>
  );
}

function mockButtonComponent(props) {
  mockButtonProps.push(props);
  const {
    children,
    icon,
    ...buttonProps
  } = props;

  return mockReact.createElement(
    'button',
    {
      ...buttonProps,
      'data-icon': icon || '',
    },
    children
  );
}

jest.mock('reactstrap', () => ({
  Popover: mockPopoverComponent,
  PopoverHeader: ({ children }) => mockReact.createElement('div', { 'data-testid': 'popover-header' }, children),
  PopoverBody: ({ children }) => mockReact.createElement('div', { 'data-testid': 'popover-body' }, children),
}));

jest.mock('components/Button/Button', () => mockButtonComponent);

function makeProps(obj = {}) {
  return {
    id: 'popover-field',
    title: 'Popover title',
    container: null,
    className: '',
    buttonClassName: '',
    buttonIcon: null,
    popoverClassName: '',
    buttonSize: 'xl',
    data: {
      popoverTitle: 'Popover heading',
      buttonTooltip: 'Button tooltip',
      placement: 'left',
    },
    toggleCallback: jest.fn(),
    children: <span>Popover body</span>,
    ...obj,
  };
}

test('PopoverField renders with default content and configured props', () => {
  mockPopoverProps.length = 0;
  mockButtonProps.length = 0;

  const { container } = render(<PopoverField {...makeProps()} />);

  const wrapper = container.querySelector('.popover-container.popover-field');
  const button = screen.getByRole('button', { name: 'Popover title' });
  const popover = screen.getByTestId('popover');

  expect(wrapper).not.toBeNull();
  expect(button.className).toContain('btn');
  expect(button.className).toContain('btn-secondary');
  expect(button.getAttribute('title')).toBe('Button tooltip');
  expect(button.getAttribute('data-icon')).toBe('');
  expect(popover.getAttribute('data-placement')).toBe('left');
  expect(popover.getAttribute('data-target')).toBe('popover-field');
  expect(popover.getAttribute('data-is-open')).toBe('false');
  expect(screen.getByTestId('popover-header').textContent).toBe('Popover heading');
  expect(screen.getByTestId('popover-body').textContent).toBe('Popover body');
});

test('PopoverField falls back to default placement, icon, and icon button classes', () => {
  mockPopoverProps.length = 0;
  mockButtonProps.length = 0;

  render(<PopoverField {...makeProps({
    title: null,
    data: {},
  })}
  />);

  const button = screen.getByRole('button');
  const popover = screen.getByTestId('popover');

  expect(button.className).toContain('btn--no-text');
  expect(button.className).toContain('btn--icon-xl');
  expect(button.getAttribute('data-icon')).toBe('dot-3');
  expect(popover.getAttribute('data-placement')).toBe('bottom');
});

test('PopoverField uses custom class names, button icon, size, and container', () => {
  mockPopoverProps.length = 0;
  mockButtonProps.length = 0;

  render(<PopoverField {...makeProps({
    className: 'custom-wrapper',
    buttonClassName: 'custom-button',
    buttonIcon: 'share',
    buttonSize: 'sm',
    popoverClassName: 'custom-popover',
    container: '#custom-container',
  })}
  />);

  const button = screen.getByRole('button', { name: 'Popover title' });
  const popover = screen.getByTestId('popover');

  expect(button.className).toContain('custom-wrapper');
  expect(button.className).toContain('custom-button');
  expect(button.className).not.toContain('btn--icon-sm');
  expect(button.getAttribute('data-icon')).toBe('share');
  expect(popover.getAttribute('data-class-name')).toBe('custom-popover');
  expect(popover.getAttribute('data-container')).toBe('#custom-container');
  expect(popover.getAttribute('data-is-wrapper-container')).toBe('false');
});

test('PopoverField toggle changes open state and runs the callback after the timeout', () => {
  jest.useFakeTimers();
  mockPopoverProps.length = 0;
  mockButtonProps.length = 0;

  const toggleCallback = jest.fn();
  render(<PopoverField {...makeProps({ toggleCallback })} />);

  const button = screen.getByRole('button', { name: 'Popover title' });

  fireEvent.click(button);
  expect(toggleCallback).not.toHaveBeenCalled();
  expect(screen.getByTestId('popover').getAttribute('data-is-open')).toBe('false');

  act(() => {
    jest.runOnlyPendingTimers();
  });

  expect(toggleCallback).toHaveBeenCalledTimes(1);
  expect(screen.getByTestId('popover').getAttribute('data-is-open')).toBe('true');
  expect(screen.getByTestId('popover').getAttribute('data-is-wrapper-container')).toBe('true');

  fireEvent.click(button);

  act(() => {
    jest.runOnlyPendingTimers();
  });

  expect(toggleCallback).toHaveBeenCalledTimes(2);
  expect(screen.getByTestId('popover').getAttribute('data-is-open')).toBe('false');
  jest.useRealTimers();
});
