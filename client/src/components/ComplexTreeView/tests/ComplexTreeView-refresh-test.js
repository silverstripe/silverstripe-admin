/* global jest, test, expect, beforeEach, afterEach */
import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { Component as ComplexTreeView } from '../ComplexTreeView';
import useComplexTreeViewApi from '../useComplexTreeViewApi';

jest.mock('../useComplexTreeViewApi');
jest.mock('../TreeContextMenu', () => ({
  __esModule: true,
  default: () => null,
}));

let mockUpdateNodes;

beforeEach(() => {
  global.fetch = jest.fn();
  Storage.prototype.setItem = jest.fn();
  Storage.prototype.getItem = jest.fn();
  delete window.location;
  window.location = {
    assign: jest.fn(),
    href: '',
  };
  Object.defineProperty(window.location, 'href', {
    writable: true,
    value: '',
  });

  mockUpdateNodes = jest.fn().mockResolvedValue({ success: true });

  useComplexTreeViewApi.mockReturnValue({
    data: {
      items: {
        root: {
          index: 'root',
          isFolder: true,
          children: ['1'],
          data: 'Root',
        },
        1: {
          index: '1',
          isFolder: false,
          children: [],
          data: {
            id: 1,
            title: 'Page 1',
            parentID: 0,
          },
        },
      },
      rootId: 'root',
    },
    dataProvider: {
      getTreeItem: jest.fn((itemId) => ({
        index: itemId,
        isFolder: itemId === 'root',
        children: itemId === 'root' ? ['1'] : [],
        data: itemId === 'root' ? 'Root' : { id: 1, title: 'Page 1' },
      })),
    },
    error: null,
    initialViewState: {
      'tree-1': {
        expandedItems: ['root'],
        focusedItem: 1,
        selectedItems: [1],
      },
    },
    loading: false,
    rootId: 'root',
    loadSubtree: jest.fn(),
    mergeSubtree: jest.fn(),
    saveNode: jest.fn(),
    updateNodes: mockUpdateNodes,
  });
});

afterEach(() => {
  jest.restoreAllMocks();
});

test('ComplexTreeView accepts onRefreshNodes callback prop', () => {
  const onRefreshNodes = jest.fn();
  const { container } = render(
    <ComplexTreeView
      apiEndpoint="/admin/pages/tree/jsonview"
      editUrlPattern="/admin/pages/edit/%s"
      onRefreshNodes={onRefreshNodes}
    />
  );
  expect(container).not.toBeNull();
  expect(onRefreshNodes).toHaveBeenCalledWith(expect.any(Function));
});

test('onRefreshNodes callback receives a function that can refresh nodes', async () => {
  let refreshFunction = null;
  const onRefreshNodes = jest.fn((fn) => {
    refreshFunction = fn;
  });

  render(
    <ComplexTreeView
      apiEndpoint="/admin/pages/tree/jsonview"
      editUrlPattern="/admin/pages/edit/%s"
      onRefreshNodes={onRefreshNodes}
    />
  );

  expect(onRefreshNodes).toHaveBeenCalled();
  expect(refreshFunction).toBeInstanceOf(Function);

  // Call the refresh function
  await refreshFunction(1);

  // Verify updateNodes was called with correct node ID
  expect(mockUpdateNodes).toHaveBeenCalledWith([1]);
});

test('refresh function handles errors gracefully', async () => {
  const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
  mockUpdateNodes.mockRejectedValue(new Error('Network error'));

  let refreshFunction = null;
  const onRefreshNodes = jest.fn((fn) => {
    refreshFunction = fn;
  });

  render(
    <ComplexTreeView
      apiEndpoint="/admin/pages/tree/jsonview"
      editUrlPattern="/admin/pages/edit/%s"
      onRefreshNodes={onRefreshNodes}
    />
  );

  // Call the refresh function
  await refreshFunction(1);

  // Verify error was logged
  await waitFor(() => {
    expect(consoleError).toHaveBeenCalledWith('Error refreshing nodes:', expect.any(Error));
  });

  consoleError.mockRestore();
});

test('refresh function does nothing if nodeId is null', async () => {
  let refreshFunction = null;
  const onRefreshNodes = jest.fn((fn) => {
    refreshFunction = fn;
  });

  render(
    <ComplexTreeView
      apiEndpoint="/admin/pages/tree/jsonview"
      editUrlPattern="/admin/pages/edit/%s"
      onRefreshNodes={onRefreshNodes}
    />
  );

  // Call the refresh function with null
  await refreshFunction(null);

  // Verify updateNodes was NOT called
  expect(mockUpdateNodes).not.toHaveBeenCalled();
});

test('refresh function does nothing if updateNodes is not available', async () => {
  useComplexTreeViewApi.mockReturnValue({
    data: null,
    dataProvider: null,
    error: null,
    initialViewState: null,
    loading: true,
    rootId: null,
    loadSubtree: jest.fn(),
    mergeSubtree: jest.fn(),
    saveNode: jest.fn(),
    updateNodes: null, // No updateNodes function
  });

  let refreshFunction = null;
  const onRefreshNodes = jest.fn((fn) => {
    refreshFunction = fn;
  });

  render(
    <ComplexTreeView
      apiEndpoint="/admin/pages/tree/jsonview"
      editUrlPattern="/admin/pages/edit/%s"
      onRefreshNodes={onRefreshNodes}
    />
  );

  // Call the refresh function
  await refreshFunction(1);

  // Verify updateNodes was NOT called (it doesn't exist)
  expect(mockUpdateNodes).not.toHaveBeenCalled();
});

test('ComplexTreeView works without onRefreshNodes callback (backwards compatible)', () => {
  const { container } = render(
    <ComplexTreeView
      apiEndpoint="/admin/pages/tree/jsonview"
      editUrlPattern="/admin/pages/edit/%s"
    />
  );

  expect(container).not.toBeNull();
});
