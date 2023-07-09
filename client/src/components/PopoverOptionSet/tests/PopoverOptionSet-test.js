/* global jest, test, expect */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PopoverOptionSet from '../PopoverOptionSet';

const buttonTypeA = {
  key: 'dummy-key-a',
  content: 'Hello A',
  className: 'dummy-classname-a',
  onClick: () => {},
};

const buttonTypeB = {
  key: 'dummy-key-b',
  content: 'Hello B',
  className: 'dummy-classname-b',
  onClick: () => {},
};

function makeProps(obj = {}) {
  return {
    buttons: [buttonTypeA, buttonTypeB],
    ButtonComponent: ({ className }) => <button data-testid="test-button" className={className}/>,
    PopoverComponent: ({ toggle, children }) => (
      <div data-testid="test-popover" onClick={toggle}>
        {children}
      </div>
    ),
    provideButtonClickHandler: () => null,
    container: 'div',
    extraClass: '',
    isOpen: true, // needs to be true in order to render the popover
    placement: 'auto',
    searchPlaceholder: '',
    toggle: jest.fn(),
    target: 'div',
    ...obj
  };
}

test('PopoverOptionSet handleToggle should call the toggle callback', async () => {
  const toggle = jest.fn();
  render(
    <PopoverOptionSet {...makeProps({
      toggle
    })}
    />
  );
  const popover = await screen.findByTestId('test-popover');
  fireEvent.click(popover);
  expect(toggle).toHaveBeenCalled();
});

test('PopoverOptionSet handleSearchValueClear should set the state', async () => {
  render(
    <PopoverOptionSet {...makeProps()}/>
  );
  const popover = await screen.findByTestId('test-popover');
  const input = popover.querySelector('input.popover-option-set__search-input');
  expect(screen.queryByText('No results found')).toBeNull();
  fireEvent.change(input, { target: { value: 'something' } });
  const results = await screen.findByText('No results found');
  expect(results).not.toBeNull();
});

test('PopoverOptionSet handleSearchValueClear should set the state', async () => {
  render(
    <PopoverOptionSet {...makeProps()}/>
  );
  const popover = await screen.findByTestId('test-popover');
  const input = popover.querySelector('input.popover-option-set__search-input');
  expect(screen.queryByText('Clear')).toBeNull();
  fireEvent.change(input, { target: { value: 'something' } });
  const button = await screen.findByText('Clear');
  expect(button.tagName).toBe('BUTTON');
});

test('PopoverOptionSet renderOptionButtons render all available buttons', async () => {
  render(
    <PopoverOptionSet {...makeProps({
      onSearch: () => [
        {
          key: 'a',
          content: 'A',
          className: 'dummy-classname-a',
          onClick: () => null,
        },
        {
          key: 'b',
          content: 'B',
          className: 'dummy-classname-b',
          onClick: () => null,
        }
      ]
    })}
    />
  );
  const popover = await screen.findByTestId('test-popover');
  const input = popover.querySelector('input.popover-option-set__search-input');
  fireEvent.change(input, { target: { value: 'something' } });
  const buttons = await screen.findAllByTestId('test-button');
  expect(buttons).toHaveLength(2);
  expect(buttons[0].classList).toContain('dummy-classname-a');
  expect(buttons[1].classList).toContain('dummy-classname-b');
});

test('PopoverOptionSet render should render a Popover', async () => {
  render(
    <PopoverOptionSet {...makeProps()}/>
  );
  const popover = await screen.findByTestId('test-popover');
  expect(popover.querySelector('.popover-option-set__button-container')).not.toBeNull();
});
