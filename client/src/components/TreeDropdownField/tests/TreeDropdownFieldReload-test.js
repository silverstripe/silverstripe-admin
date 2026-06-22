/* global jest, test, beforeAll, afterAll, expect */

import React from 'react';
import { render, act } from '@testing-library/react';
import { Component as TreeDropdownField } from '../TreeDropdownField';
import mockTree from './mockTree';

beforeAll(() => {
  jest.useFakeTimers();
});

afterAll(() => {
  jest.useRealTimers();
});

function makeProps(obj = {}) {
  return {
    id: 'Form_Test',
    name: 'Test',
    data: {
      urlTree: 'url-callback',
    },
    tree: mockTree,
    search: '',
    actions: {
      treeDropdownField: {
        beginTreeUpdating: () => null,
        updateTreeFailed: () => null,
        updateTree: () => null,
        setVisible: () => null,
        setSearch: () => null,
        addSelectedValues: () => null,
      },
    },
    fetch: () => Promise.resolve({ json: () => Promise.resolve({ tree: 'data' }) }),
    selectedValues: [],
    ...obj,
  };
}

const makeFetchSpy = () => jest.fn(() => Promise.resolve({ json: () => Promise.resolve({}) }));

test('TreeDropdownField should NOT reload when search prop has not changed', () => {
  const loadTreeSpy = makeFetchSpy();
  const props = makeProps({ fetch: loadTreeSpy });
  const { rerender } = render(<TreeDropdownField {...props} />);
  loadTreeSpy.mockClear();

  // Re-render with identical props — no prop changed, no reload expected
  rerender(<TreeDropdownField {...props} />);
  act(() => jest.runAllTimers());

  expect(loadTreeSpy).not.toBeCalled();
});

test('TreeDropdownField should reload when search prop changes', () => {
  const loadTreeSpy = makeFetchSpy();
  const props = makeProps({ fetch: loadTreeSpy });
  const { rerender } = render(<TreeDropdownField {...props} />);
  loadTreeSpy.mockClear();

  // Change the search prop
  rerender(<TreeDropdownField {...props} search="hello" />);
  act(() => jest.runAllTimers());

  expect(loadTreeSpy).toBeCalled();
});

test('TreeDropdownField should reload when urlTree prop changes', () => {
  const loadTreeSpy = makeFetchSpy();
  const props = makeProps({ fetch: loadTreeSpy });
  const { rerender } = render(<TreeDropdownField {...props} />);
  loadTreeSpy.mockClear();

  // Change the urlTree prop
  rerender(<TreeDropdownField {...props} data={{ ...props.data, urlTree: 'url-callback-2' }} />);
  act(() => jest.runAllTimers());

  expect(loadTreeSpy).toBeCalled();
});

test('TreeDropdownField should reload when cacheKey prop changes', () => {
  const loadTreeSpy = makeFetchSpy();
  const props = makeProps({ fetch: loadTreeSpy });
  const { rerender } = render(<TreeDropdownField {...props} />);
  loadTreeSpy.mockClear();

  // Change the cacheKey prop
  rerender(<TreeDropdownField {...props} data={{ ...props.data, cacheKey: 'new-key' }} />);
  act(() => jest.runAllTimers());

  expect(loadTreeSpy).toBeCalled();
});

test('TreeDropdownField should pass visible=[] when only urlTree changes (not search)', () => {
  const beginTreeUpdating = jest.fn();
  const props = makeProps({
    actions: {
      treeDropdownField: {
        beginTreeUpdating,
        updateTreeFailed: () => null,
        updateTree: () => null,
        setVisible: () => null,
        setSearch: () => null,
        addSelectedValues: () => null,
      },
    },
    visible: [5, 9],
  });
  const { rerender } = render(<TreeDropdownField {...props} />);
  beginTreeUpdating.mockClear();

  // Only urlTree changes — visible should NOT be passed; loadTree called with []
  rerender(<TreeDropdownField {...props} data={{ ...props.data, urlTree: 'url-callback-2' }} />);
  act(() => jest.runAllTimers());

  expect(beginTreeUpdating).toBeCalledWith('Form_Test', []);
});

test('TreeDropdownField should pass props.visible when search prop changes', () => {
  const beginTreeUpdating = jest.fn();
  const props = makeProps({
    actions: {
      treeDropdownField: {
        beginTreeUpdating,
        updateTreeFailed: () => null,
        updateTree: () => null,
        setVisible: () => null,
        setSearch: () => null,
        addSelectedValues: () => null,
      },
    },
    visible: [5, 9],
  });
  const { rerender } = render(<TreeDropdownField {...props} />);
  beginTreeUpdating.mockClear();

  // Search changes — visible should be passed as props.visible
  rerender(<TreeDropdownField {...props} search="hello" />);
  act(() => jest.runAllTimers());

  expect(beginTreeUpdating).toBeCalledWith('Form_Test', [5, 9]);
});

test('TreeDropdownField should NOT reload when readOnly and prop changes', () => {
  const loadTreeSpy = makeFetchSpy();
  const props = makeProps({ fetch: loadTreeSpy, readOnly: true });
  const { rerender } = render(<TreeDropdownField {...props} />);
  loadTreeSpy.mockClear();

  rerender(<TreeDropdownField {...props} search="hello" />);
  act(() => jest.runAllTimers());

  expect(loadTreeSpy).not.toBeCalled();
});

test('TreeDropdownField should NOT reload when disabled and prop changes', () => {
  const loadTreeSpy = makeFetchSpy();
  const props = makeProps({ fetch: loadTreeSpy, disabled: true });
  const { rerender } = render(<TreeDropdownField {...props} />);
  loadTreeSpy.mockClear();

  rerender(<TreeDropdownField {...props} search="hello" />);
  act(() => jest.runAllTimers());

  expect(loadTreeSpy).not.toBeCalled();
});
