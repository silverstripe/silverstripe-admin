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

const mockTreeData = {
  items: {
    root: {
      index: 'root',
      data: 'Root',
      children: [1, 2],
      isFolder: true,
      canMove: false,
      canRename: false,
    },
    1: {
      index: 1,
      data: { id: 1, title: 'Page 1', expanded: false, count: 0 },
      children: [],
      isFolder: true,
      canMove: true,
      canRename: true,
    },
    2: {
      index: 2,
      data: { id: 2, title: 'Page 2', expanded: false, count: 0 },
      children: [],
      isFolder: true,
      canMove: true,
      canRename: true,
    },
  },
};

const mockDataProvider = {
  async getTreeItem(itemId) {
    return mockTreeData.items[itemId];
  },
};

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
});

afterEach(() => {
  jest.restoreAllMocks();
});

test('onRefreshNodes callback receives refresh handler function', async () => {
  const onRefreshNodes = jest.fn();
  const mockUpdateNodes = jest.fn().mockResolvedValue({});
  useComplexTreeViewApi.mockReturnValue({
    data: mockTreeData,
    dataProvider: mockDataProvider,
    error: null,
    initialViewState: { 'tree-1': {} },
    loading: false,
    rootId: 'root',
    loadSubtree: jest.fn(),
    mergeSubtree: jest.fn(),
    saveNode: jest.fn(),
    updateNodes: mockUpdateNodes,
  });
  const { container } = render(
    <ComplexTreeView
      apiEndpoint="/admin/pages/tree/jsonview"
      onRefreshNodes={onRefreshNodes}
    />
  );
  expect(container).not.toBeNull();
  await waitFor(() => {
    expect(onRefreshNodes).toHaveBeenCalled();
    const refreshHandler = onRefreshNodes.mock.calls[0][0];
    expect(typeof refreshHandler).toBe('function');
  });
  const refreshHandler = onRefreshNodes.mock.calls[0][0];
  await refreshHandler(1);
  expect(mockUpdateNodes).toHaveBeenCalledWith([1]);
});

test('onRefreshParentNode callback receives refresh handler function', async () => {
  const onRefreshParentNode = jest.fn();
  const mockLoadSubtree = jest.fn().mockResolvedValue({
    items: {},
    subtreeChildIds: [],
  });
  const mockMergeSubtree = jest.fn().mockResolvedValue(undefined);
  useComplexTreeViewApi.mockReturnValue({
    data: mockTreeData,
    dataProvider: mockDataProvider,
    error: null,
    initialViewState: { 'tree-1': {} },
    loading: false,
    rootId: 'root',
    loadSubtree: mockLoadSubtree,
    mergeSubtree: mockMergeSubtree,
    saveNode: jest.fn(),
    updateNodes: jest.fn(),
  });
  const { container } = render(
    <ComplexTreeView
      apiEndpoint="/admin/pages/tree/jsonview"
      onRefreshParentNode={onRefreshParentNode}
    />
  );
  expect(container).not.toBeNull();
  await waitFor(() => {
    expect(onRefreshParentNode).toHaveBeenCalled();
    const refreshHandler = onRefreshParentNode.mock.calls[0][0];
    expect(typeof refreshHandler).toBe('function');
  });
  const refreshHandler = onRefreshParentNode.mock.calls[0][0];
  await refreshHandler(1);
  expect(mockLoadSubtree).toHaveBeenCalledWith(1);
  expect(mockMergeSubtree).toHaveBeenCalled();
});

test('onRefreshNodes handler updates specific nodes without full reload', async () => {
  const onRefreshNodes = jest.fn();
  const mockUpdateNodes = jest.fn().mockResolvedValue({
    1: { id: 1, title: 'Updated Page 1', expanded: false, count: 0 },
  });
  useComplexTreeViewApi.mockReturnValue({
    data: mockTreeData,
    dataProvider: mockDataProvider,
    error: null,
    initialViewState: { 'tree-1': {} },
    loading: false,
    rootId: 'root',
    loadSubtree: jest.fn(),
    mergeSubtree: jest.fn(),
    saveNode: jest.fn(),
    updateNodes: mockUpdateNodes,
  });
  render(
    <ComplexTreeView
      apiEndpoint="/admin/pages/tree/jsonview"
      onRefreshNodes={onRefreshNodes}
    />
  );
  await waitFor(() => {
    expect(onRefreshNodes).toHaveBeenCalled();
  });
  const refreshHandler = onRefreshNodes.mock.calls[0][0];
  await refreshHandler(1);
  expect(mockUpdateNodes).toHaveBeenCalledWith([1]);
  expect(mockUpdateNodes).toHaveBeenCalledTimes(1);
});

test('onRefreshParentNode handler reloads children without full tree reload', async () => {
  const onRefreshParentNode = jest.fn();
  const mockLoadSubtree = jest.fn().mockResolvedValue({
    items: {
      3: {
        index: 3,
        data: { id: 3, title: 'New Page 3', parentID: 1 },
        children: [],
      },
    },
    subtreeChildIds: [3],
  });
  const mockMergeSubtree = jest.fn().mockResolvedValue(undefined);
  useComplexTreeViewApi.mockReturnValue({
    data: mockTreeData,
    dataProvider: mockDataProvider,
    error: null,
    initialViewState: { 'tree-1': {} },
    loading: false,
    rootId: 'root',
    loadSubtree: mockLoadSubtree,
    mergeSubtree: mockMergeSubtree,
    saveNode: jest.fn(),
    updateNodes: jest.fn(),
  });
  render(
    <ComplexTreeView
      apiEndpoint="/admin/pages/tree/jsonview"
      onRefreshParentNode={onRefreshParentNode}
    />
  );
  await waitFor(() => {
    expect(onRefreshParentNode).toHaveBeenCalled();
  });
  const refreshHandler = onRefreshParentNode.mock.calls[0][0];
  await refreshHandler(1);
  expect(mockLoadSubtree).toHaveBeenCalledWith(1);
  expect(mockMergeSubtree).toHaveBeenCalledWith(
    1,
    expect.objectContaining({
      3: expect.objectContaining({
        data: expect.objectContaining({ id: 3, title: 'New Page 3' }),
      }),
    }),
    [3]
  );
});

test('onRefreshNodes handles errors gracefully', async () => {
  const onRefreshNodes = jest.fn();
  const mockUpdateNodes = jest.fn().mockRejectedValue(new Error('Network error'));
  const consoleError = jest.spyOn(console, 'error').mockImplementation();
  useComplexTreeViewApi.mockReturnValue({
    data: mockTreeData,
    dataProvider: mockDataProvider,
    error: null,
    initialViewState: { 'tree-1': {} },
    loading: false,
    rootId: 'root',
    loadSubtree: jest.fn(),
    mergeSubtree: jest.fn(),
    saveNode: jest.fn(),
    updateNodes: mockUpdateNodes,
  });
  render(
    <ComplexTreeView
      apiEndpoint="/admin/pages/tree/jsonview"
      onRefreshNodes={onRefreshNodes}
    />
  );
  await waitFor(() => {
    expect(onRefreshNodes).toHaveBeenCalled();
  });
  const refreshHandler = onRefreshNodes.mock.calls[0][0];
  await refreshHandler(1);
  expect(consoleError).toHaveBeenCalledWith('Error refreshing nodes:', expect.any(Error));
  consoleError.mockRestore();
});

test('onRefreshParentNode handles errors gracefully', async () => {
  const onRefreshParentNode = jest.fn();
  const mockLoadSubtree = jest.fn().mockRejectedValue(new Error('Network error'));
  const consoleError = jest.spyOn(console, 'error').mockImplementation();
  useComplexTreeViewApi.mockReturnValue({
    data: mockTreeData,
    dataProvider: mockDataProvider,
    error: null,
    initialViewState: { 'tree-1': {} },
    loading: false,
    rootId: 'root',
    loadSubtree: mockLoadSubtree,
    mergeSubtree: jest.fn(),
    saveNode: jest.fn(),
    updateNodes: jest.fn(),
  });
  render(
    <ComplexTreeView
      apiEndpoint="/admin/pages/tree/jsonview"
      onRefreshParentNode={onRefreshParentNode}
    />
  );
  await waitFor(() => {
    expect(onRefreshParentNode).toHaveBeenCalled();
  });
  const refreshHandler = onRefreshParentNode.mock.calls[0][0];
  await refreshHandler(1);
  expect(consoleError).toHaveBeenCalledWith('Error refreshing parent node:', expect.any(Error));
  consoleError.mockRestore();
});
