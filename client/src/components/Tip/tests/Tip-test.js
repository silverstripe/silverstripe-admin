/* global jest, test, describe, beforeEach, afterEach, it, expect */

import React from 'react';
import { render } from '@testing-library/react';
import Tip, { TIP_IMPORTANCE_LEVELS, TIP_TYPES } from '../Tip';

function makeProps(obj = {}) {
  return {
    content: 'Test content',
    fieldTitle: 'Test',
    id: 'test',
    ...obj
  };
}

/**
 * NOTE: Due to the Popover component expecting to find its target in the DOM, these tests render
 * the component there. This isn't great, but aside from dropping the Popover component or hacking
 * it, the developer was unable to find a solution for testing purposes in the time they had.
 */

test('Tip render() should display a button with a lamp icon by default', () => {
  const { container } = render(<Tip {...makeProps()} />);
  expect(container.querySelectorAll('.btn .font-icon-lamp')).toHaveLength(1);
});

test('Tip render() should display a button with a different icon if specified', () => {
  const { container } = render(
    <Tip {...makeProps({
      icon: 'white-question'
    })}
    />
  );
  expect(container.querySelectorAll('.btn .font-icon-white-question')).toHaveLength(1);
});

test('Tip render() should not display the popover by default', () => {
  const { container } = render(<Tip {...makeProps()} />);
  expect(container.querySelectorAll('.popover')).toHaveLength(0);
});

test('Tip render() display a grey icon by default (when importance is set to `normal`)', () => {
  const { container } = render(<Tip {...makeProps()} />);
  expect(container.querySelectorAll('.btn.text-muted')).toHaveLength(1);
});

test('Tip render() should display a red icon when the importance is bumped to `high`', () => {
  const { container } = render(
    <Tip {...makeProps({
      importance: TIP_IMPORTANCE_LEVELS.HIGH
    })}
    />
  );
  expect(container.querySelectorAll('.btn.text-danger')).toHaveLength(1);
});

test('Tip render() should render an input group tip by default', () => {
  const { container } = render(<Tip {...makeProps()} />);
  expect(container.querySelectorAll('.tip')).toHaveLength(1);
  expect(container.querySelectorAll('.tip--title')).toHaveLength(0);
  expect(container.querySelectorAll('.tip--input-group')).toHaveLength(1);
});

test('Tip render() should render a title tip if specified', () => {
  const { container } = render(
    <Tip {...makeProps({
      type: TIP_TYPES.TITLE
    })}
    />
  );
  expect(container.querySelectorAll('.tip')).toHaveLength(1);
  expect(container.querySelectorAll('.tip--title')).toHaveLength(1);
  expect(container.querySelectorAll('.tip--input-group')).toHaveLength(0);
});
