/* global jest, test, expect */

import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import PopoverField from '../PopoverField';

const mockPopover = jest.fn();

jest.mock('reactstrap', () => ({
  ...jest.requireActual('reactstrap'),
  Popover: (props) => {
    mockPopover(props);
    return props.isOpen ? <div data-testid="popover">{props.children}</div> : null;
  },
  PopoverHeader: ({ children }) => <h3>{children}</h3>,
  PopoverBody: ({ children }) => <div>{children}</div>,
}));

const makeProps = (obj = {}) => ({
  id: 'MyPopover',
  ...obj,
});

const lastPopoverProps = () => mockPopover.mock.calls[mockPopover.mock.calls.length - 1][0];

const clickButton = (container) => {
  fireEvent.click(container.querySelector('button'));
  act(() => {
    jest.runAllTimers();
  });
};

beforeEach(() => {
  jest.useFakeTimers();
  mockPopover.mockClear();
});

afterEach(() => {
  jest.useRealTimers();
});

test('PopoverField renders closed with default props', () => {
  const { container, queryByTestId } = render(<PopoverField {...makeProps()} />);
  const wrapper = container.querySelector('.popover-field');
  expect(wrapper.classList.contains('popover-container')).toBe(true);
  expect(container.querySelector('button').id).toBe('MyPopover');
  expect(queryByTestId('popover')).toBeNull();
  expect(lastPopoverProps().isOpen).toBe(false);
  expect(lastPopoverProps().id).toBe('MyPopover_Popover');
  expect(lastPopoverProps().target).toBe('MyPopover');
  expect(lastPopoverProps().placement).toBe('bottom');
});

test('PopoverField uses the placement from data', () => {
  render(<PopoverField {...makeProps({ data: { placement: 'left' } })} />);
  expect(lastPopoverProps().placement).toBe('left');
});

test('PopoverField without title renders an icon-only button', () => {
  const { container } = render(<PopoverField {...makeProps()} />);
  const button = container.querySelector('button');
  expect(button.classList.contains('btn--no-text')).toBe(true);
  expect(button.classList.contains('btn--icon-xl')).toBe(true);
  expect(button.querySelector('.font-icon-dot-3')).not.toBeNull();
});

test('PopoverField with title renders a text button without icon classes', () => {
  const { container } = render(<PopoverField {...makeProps({ title: 'Open me' })} />);
  const button = container.querySelector('button');
  expect(button.textContent).toContain('Open me');
  expect(button.classList.contains('btn--no-text')).toBe(false);
  expect(button.classList.contains('btn--icon-xl')).toBe(false);
  expect(button.querySelector('.btn__icon')).toBeNull();
});

test('PopoverField applies buttonSize, buttonIcon and class names', () => {
  const props = makeProps({
    buttonSize: 'sm',
    buttonIcon: 'plus',
    className: 'my-class',
    buttonClassName: 'my-button-class',
    popoverClassName: 'my-popover-class',
  });
  const { container } = render(<PopoverField {...props} />);
  const button = container.querySelector('button');
  expect(button.classList.contains('btn--icon-sm')).toBe(true);
  expect(button.querySelector('.font-icon-plus')).not.toBeNull();
  expect(button.classList.contains('my-class')).toBe(true);
  expect(button.classList.contains('my-button-class')).toBe(true);
  expect(container.querySelector('.popover-field').classList.contains('my-class')).toBe(true);
  expect(lastPopoverProps().className).toBe('my-popover-class');
});

test('PopoverField passes the button tooltip as the button title', () => {
  const { container } = render(<PopoverField {...makeProps({ data: { buttonTooltip: 'Tip' } })} />);
  expect(container.querySelector('button').getAttribute('title')).toBe('Tip');
});

test('PopoverField opens on button click and renders title and children', () => {
  const props = makeProps({ data: { popoverTitle: 'Popover title' } });
  const { container, getByTestId, getByText } = render(
    <PopoverField {...props}><p>Body content</p></PopoverField>
  );
  fireEvent.click(container.querySelector('button'));
  // State change is deferred to the end of the execution queue
  expect(lastPopoverProps().isOpen).toBe(false);
  act(() => {
    jest.runAllTimers();
  });
  expect(getByTestId('popover')).not.toBeNull();
  expect(getByText('Popover title')).not.toBeNull();
  expect(getByText('Body content')).not.toBeNull();
  expect(lastPopoverProps().isOpen).toBe(true);
});

test('PopoverField closes when clicked again and when the popover toggle is called', () => {
  const { container } = render(<PopoverField {...makeProps()} />);
  clickButton(container);
  expect(lastPopoverProps().isOpen).toBe(true);
  clickButton(container);
  expect(lastPopoverProps().isOpen).toBe(false);
  clickButton(container);
  expect(lastPopoverProps().isOpen).toBe(true);
  act(() => {
    lastPopoverProps().toggle();
    jest.runAllTimers();
  });
  expect(lastPopoverProps().isOpen).toBe(false);
});

test('PopoverField calls toggleCallback after each toggle but not on mount', () => {
  const toggleCallback = jest.fn();
  const { container } = render(<PopoverField {...makeProps({ toggleCallback })} />);
  expect(toggleCallback).not.toHaveBeenCalled();
  clickButton(container);
  expect(toggleCallback).toHaveBeenCalledTimes(1);
  clickButton(container);
  expect(toggleCallback).toHaveBeenCalledTimes(2);
});

test('PopoverField uses the container prop for the popover when given', () => {
  render(<PopoverField {...makeProps({ container: '#my-container' })} />);
  expect(lastPopoverProps().container).toBe('#my-container');
});

test('PopoverField uses its wrapper element as the popover container by default', () => {
  const { container } = render(<PopoverField {...makeProps()} />);
  clickButton(container);
  expect(lastPopoverProps().container).toBe(container.querySelector('.popover-field'));
});
