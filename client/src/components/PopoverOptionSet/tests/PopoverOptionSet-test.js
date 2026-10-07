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

test('PopoverOptionSet should not render the search box when disableSearch is true', async () => {
  render(
    <PopoverOptionSet {...makeProps({ disableSearch: true })}/>
  );
  const popover = await screen.findByTestId('test-popover');
  expect(popover.querySelector('input')).toBeNull();
});

test('PopoverOptionSet should filter buttons using the default search handler', async () => {
  render(
    <PopoverOptionSet {...makeProps()}/>
  );
  const popover = await screen.findByTestId('test-popover');
  const input = popover.querySelector('input.popover-option-set__search-input');
  fireEvent.change(input, { target: { value: 'hello a' } });
  expect(screen.getAllByTestId('test-button')).toHaveLength(1);
  expect(input.value).toBe('hello a');
});

test('PopoverOptionSet should call onSearch with the search value and the buttons', async () => {
  const onSearch = jest.fn(() => []);
  render(
    <PopoverOptionSet {...makeProps({ onSearch })}/>
  );
  const popover = await screen.findByTestId('test-popover');
  const input = popover.querySelector('input.popover-option-set__search-input');
  fireEvent.change(input, { target: { value: 'abc' } });
  expect(onSearch).toHaveBeenCalledWith('abc', [buttonTypeA, buttonTypeB]);
});

test('PopoverOptionSet clear button should clear the search value', async () => {
  render(
    <PopoverOptionSet {...makeProps()}/>
  );
  const popover = await screen.findByTestId('test-popover');
  const input = popover.querySelector('input.popover-option-set__search-input');
  fireEvent.change(input, { target: { value: 'something' } });
  fireEvent.click(await screen.findByText('Clear'));
  expect(input.value).toBe('');
  expect(screen.queryByText('Clear')).toBeNull();
  expect(screen.queryByText('No results found')).toBeNull();
});

test('PopoverOptionSet toggle should clear the search value', async () => {
  render(
    <PopoverOptionSet {...makeProps()}/>
  );
  const popover = await screen.findByTestId('test-popover');
  const input = popover.querySelector('input.popover-option-set__search-input');
  fireEvent.change(input, { target: { value: 'something' } });
  expect(input.value).toBe('something');
  fireEvent.click(popover);
  expect(input.value).toBe('');
});

test('PopoverOptionSet pressing Escape should toggle and focus the target', async () => {
  const toggle = jest.fn();
  render(
    <button id="popover-target" type="button">Target</button>
  );
  render(
    <PopoverOptionSet {...makeProps({
      toggle,
      target: 'popover-target',
      PopoverComponent: ({ onKeyDown, children }) => (
        <div data-testid="test-popover" onKeyDown={onKeyDown}>
          {children}
        </div>
      ),
    })}
    />
  );
  const popover = await screen.findByTestId('test-popover');
  fireEvent.keyDown(popover, { key: 'Enter' });
  expect(toggle).not.toHaveBeenCalled();
  fireEvent.keyDown(popover, { key: 'Escape' });
  expect(toggle).toHaveBeenCalledTimes(1);
  expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Target' }));
});

test('PopoverOptionSet should render a message when there are no buttons', async () => {
  render(
    <PopoverOptionSet {...makeProps({ buttons: [] })}/>
  );
  expect(await screen.findByText('No results found')).not.toBeNull();
});
