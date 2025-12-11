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
    updateNodes: jest.fn(),
  });
});

afterEach(() => {
  jest.restoreAllMocks();
});

test('onShowAsList callback is called with correct parameters', async () => {
  const onShowAsList = jest.fn();
  const { container } = render(
    <ComplexTreeView
      apiEndpoint="/admin/pages/tree/jsonview"
      listUrlPattern="/admin/pages?ParentID=%s"
      onShowAsList={onShowAsList}
    />
  );
  expect(container).not.toBeNull();
  const component = container.querySelector('.complex-tree-view');
  expect(component).not.toBeNull();
  await waitFor(() => {
    const items = container.querySelectorAll('[role="treeitem"]');
    expect(items.length).toBeGreaterThan(0);
  });
  const ComplexTreeViewInstance = container.querySelector('.complex-tree-view').__reactProps$;
  if (ComplexTreeViewInstance) {
    const handleMenuAction = ComplexTreeViewInstance.children.props.children.props.onMenuAction;
    if (handleMenuAction) {
      await handleMenuAction('showAsList', 1);
      expect(onShowAsList).toHaveBeenCalledWith(1);
    }
  }
});

test('onShowAsList callback called from limited indicator click', async () => {
  const onShowAsList = jest.fn();
  const limitedTreeData = {
    items: {
      root: {
        index: 'root',
        data: 'Root',
        children: [1, -1],
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
      '-1': {
        index: -1,
        data: {
          id: 1,
          title: 'Too many records',
          isLimitedIndicator: true,
          linkUrl: '/admin/pages?ParentID=1',
        },
        children: [],
        isFolder: false,
        canMove: false,
        canRename: false,
      },
    },
  };
  useComplexTreeViewApi.mockReturnValue({
    data: limitedTreeData,
    dataProvider: {
      async getTreeItem(itemId) {
        return limitedTreeData.items[itemId];
      },
    },
    error: null,
    initialViewState: { 'tree-1': {} },
    loading: false,
    rootId: 'root',
    loadSubtree: jest.fn(),
    mergeSubtree: jest.fn(),
    saveNode: jest.fn(),
    updateNodes: jest.fn(),
  });
  const { container } = render(
    <ComplexTreeView
      apiEndpoint="/admin/pages/tree/jsonview"
      listUrlPattern="/admin/pages?ParentID=%s"
      onShowAsList={onShowAsList}
    />
  );
  expect(container).not.toBeNull();
  await waitFor(() => {
    const limitedNode = container.querySelector('.complex-tree-view__item-link--limited');
    expect(limitedNode).not.toBeNull();
  });
  const limitedNode = container.querySelector('.complex-tree-view__item-link--limited');
  limitedNode.click();
  expect(onShowAsList).toHaveBeenCalledWith(1);
});

test('default show as list behavior sets localStorage and navigates when no callback', async () => {
  const { container } = render(
    <ComplexTreeView
      apiEndpoint="/admin/pages/tree/jsonview"
      listUrlPattern="/admin/pages?ParentID=%s"
    />
  );
  expect(container).not.toBeNull();
  await waitFor(() => {
    const items = container.querySelectorAll('[role="treeitem"]');
    expect(items.length).toBeGreaterThan(0);
  });
  const ComplexTreeViewInstance = container.querySelector('.complex-tree-view').__reactProps$;
  if (ComplexTreeViewInstance) {
    const handleMenuAction = ComplexTreeViewInstance.children.props.children.props.onMenuAction;
    if (handleMenuAction) {
      await handleMenuAction('showAsList', 1);
      expect(localStorage.setItem).toHaveBeenCalledWith('ss.pages-view-type', 'listview');
      expect(window.location.assign).toHaveBeenCalledWith('/admin/pages?ParentID=1');
    }
  }
});

test('default show as list behavior skipped when callback provided', async () => {
  const onShowAsList = jest.fn();
  const { container } = render(
    <ComplexTreeView
      apiEndpoint="/admin/pages/tree/jsonview"
      listUrlPattern="/admin/pages?ParentID=%s"
      onShowAsList={onShowAsList}
    />
  );
  expect(container).not.toBeNull();
  await waitFor(() => {
    const items = container.querySelectorAll('[role="treeitem"]');
    expect(items.length).toBeGreaterThan(0);
  });
  const ComplexTreeViewInstance = container.querySelector('.complex-tree-view').__reactProps$;
  if (ComplexTreeViewInstance) {
    const handleMenuAction = ComplexTreeViewInstance.children.props.children.props.onMenuAction;
    if (handleMenuAction) {
      await handleMenuAction('showAsList', 1);
      expect(onShowAsList).toHaveBeenCalledWith(1);
      expect(window.location.assign).not.toHaveBeenCalled();
    }
  }
});

test('onShowAsList sets localStorage flag even with callback', async () => {
  const onShowAsList = jest.fn();
  const { container } = render(
    <ComplexTreeView
      apiEndpoint="/admin/pages/tree/jsonview"
      listUrlPattern="/admin/pages?ParentID=%s"
      onShowAsList={onShowAsList}
    />
  );
  expect(container).not.toBeNull();
  await waitFor(() => {
    const items = container.querySelectorAll('[role="treeitem"]');
    expect(items.length).toBeGreaterThan(0);
  });
  const ComplexTreeViewInstance = container.querySelector('.complex-tree-view').__reactProps$;
  if (ComplexTreeViewInstance) {
    const handleMenuAction = ComplexTreeViewInstance.children.props.children.props.onMenuAction;
    if (handleMenuAction) {
      await handleMenuAction('showAsList', 1);
      expect(onShowAsList).toHaveBeenCalledWith(1);
    }
  }
});
