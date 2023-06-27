/* global jest, test, expect, beforeAll, afterAll */

import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import Toasts from '../Toasts';

// Need to use act() when using fake timers with react-testing-library
// https://kentcdodds.com/blog/fix-the-not-wrapped-in-act-warning#1-when-using-jestusefaketimers
beforeAll(() => {
  jest.useFakeTimers();
});

afterAll(() => {
  jest.useRealTimers();
});

function makeProps(obj = {}) {
  return {
    onDismiss: jest.fn(),
    onPause: jest.fn(),
    onResume: jest.fn(),
    ...obj
  };
}

const toastOne = {
  id: 'one',
  text: 'Let us toast your success',
  type: 'success',
  dismissed: false,
  onDismiss: () => null,
};

const toastTwo = {
  id: 'two',
  text: 'You have failed me for the last time',
  type: 'error',
  dismissed: false,
  onDismiss: () => null,
};

test('Toasts no toasts', () => {
  const { container } = render(
    <Toasts {...makeProps({
      toasts: []
    })}
    />
  );
  expect(container.querySelectorAll('.toast')).toHaveLength(0);
  const toasts = container.querySelector('.toasts');
  expect(toasts.classList).toContain('toasts');
  expect(toasts.getAttribute('aria-live')).toBe('polite');
  expect(toasts.getAttribute('aria-atomic')).toBe('true');
});

test('Toasts one toast', () => {
  const onDismiss = jest.fn();
  const { container } = render(
    <Toasts {...makeProps({
      toasts: [toastOne],
      onDismiss
    })}
    />
  );
  expect(container.querySelectorAll('.toast')).toHaveLength(1);
  const button = container.querySelector('.toast__close');
  fireEvent.click(button);
  expect(onDismiss).toBeCalledWith('one');
});

test('Toasts many toasts', () => {
  const onDismiss = jest.fn();
  const { container } = render(
    <Toasts {...makeProps({
      toasts: [toastOne, toastTwo],
      onDismiss
    })}
    />
  );
  expect(container.querySelectorAll('.toast')).toHaveLength(2);
  const button = container.querySelectorAll('.toast__close')[1];
  fireEvent.click(button);
  expect(onDismiss).toBeCalledWith('two');
});

test('Toasts Pause/Resuming dismissal timeout Pause on Mouse Enter', () => {
  const onPause = jest.fn();
  const { container } = render(
    <Toasts {...makeProps({
      toasts: [toastOne],
      onPause
    })}
    />
  );
  const toast = container.querySelector('.toast');
  fireEvent.mouseEnter(toast);
  expect(onPause).not.toHaveBeenCalled();
  act(() => jest.advanceTimersByTime(100));
  expect(onPause).toHaveBeenCalled();
});

test('Toasts Pause/Resuming dismissal timeout Pause on Focus', () => {
  const onPause = jest.fn();
  const { container } = render(
    <Toasts {...makeProps({
      toasts: [toastOne],
      onPause
    })}
    />
  );
  const toast = container.querySelector('.toast');
  fireEvent.focus(toast);
  expect(onPause).not.toHaveBeenCalled();
  act(() => jest.advanceTimersByTime(100));
  expect(onPause).toHaveBeenCalled();
});

test('Toasts Pause/Resuming dismissal timeout Resume on Mouse Leave', () => {
  const onResume = jest.fn();
  const { container } = render(
    <Toasts {...makeProps({
      toasts: [toastOne],
      onResume
    })}
    />
  );
  const toast = container.querySelector('.toast');
  fireEvent.mouseLeave(toast);
  expect(onResume).not.toHaveBeenCalled();
  act(() => jest.advanceTimersByTime(100));
  expect(onResume).toHaveBeenCalled();
});

test('Toasts Pause/Resuming dismissal timeout Pause on Blur', () => {
  const onResume = jest.fn();
  const { container } = render(
    <Toasts {...makeProps({
      toasts: [toastOne],
      onResume
    })}
    />
  );
  const toast = container.querySelector('.toast');
  fireEvent.blur(toast);
  expect(onResume).not.toHaveBeenCalled();
  act(() => jest.advanceTimersByTime(100));
  expect(onResume).toHaveBeenCalled();
});

test('Toasts Pause/Resuming dismissal timeout Debouncing', async () => {
  const onPause = jest.fn();
  const onResume = jest.fn();
  const { container } = render(
    <Toasts {...makeProps({
      toasts: [toastOne],
      onPause,
      onResume
    })}
    />
  );
  const toast = container.querySelector('.toast');
  fireEvent.focus(toast);
  // Nothing happens until our timeout is done
  expect(onPause).not.toHaveBeenCalled();
  expect(onResume).not.toHaveBeenCalled();
  act(() => jest.advanceTimersByTime(75));
  fireEvent.blur(toast);
  act(() => jest.advanceTimersByTime(75));
  // Timeout hasn't been reach yet
  expect(onPause).not.toHaveBeenCalled();
  expect(onResume).not.toHaveBeenCalled();
  // mouseenter will clear existing timeout and start a new one
  fireEvent.mouseEnter(toast);
  act(() => jest.advanceTimersByTime(75));
  // No timeout has been reached yet
  expect(onPause).not.toHaveBeenCalled();
  expect(onResume).not.toHaveBeenCalled();
  act(() => jest.advanceTimersByTime(75));
  // Our last mouseenter timeout should have been reached now
  expect(onPause).toHaveBeenCalled();
  expect(onResume).not.toHaveBeenCalled();
});
