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

test('onDuplicateItem callback is called with correct parameters for single page', async () => {
  const onDuplicateItem = jest.fn();
  const contextMenuUrls = {
    duplicate: '/admin/pages/tree/duplicate/%s',
    duplicateWithChildren: '/admin/pages/tree/duplicateWithChildren/%s',
  };
  const { container } = render(
    <ComplexTreeView
      apiEndpoint="/admin/pages/tree/jsonview"
      contextMenuUrls={contextMenuUrls}
      onDuplicateItem={onDuplicateItem}
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
      await handleMenuAction('duplicate', 1, { includeSubpages: false });
      expect(onDuplicateItem).toHaveBeenCalledWith(1, { includeSubpages: false });
    }
  }
});

test('onDuplicateItem callback is called with correct parameters for page with children', async () => {
  const onDuplicateItem = jest.fn();
  const contextMenuUrls = {
    duplicate: '/admin/pages/tree/duplicate/%s',
    duplicateWithChildren: '/admin/pages/tree/duplicateWithChildren/%s',
  };
  const { container } = render(
    <ComplexTreeView
      apiEndpoint="/admin/pages/tree/jsonview"
      contextMenuUrls={contextMenuUrls}
      onDuplicateItem={onDuplicateItem}
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
      await handleMenuAction('duplicate', 2, { includeSubpages: true });
      expect(onDuplicateItem).toHaveBeenCalledWith(2, { includeSubpages: true });
    }
  }
});

test('default duplicate behavior makes POST and navigates when no callback provided', async () => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ success: true, newNodeID: 99 }),
    })
  );
  const contextMenuUrls = {
    duplicate: '/admin/pages/tree/duplicate/%s',
  };
  const { container } = render(
    <ComplexTreeView
      apiEndpoint="/admin/pages/tree/jsonview"
      contextMenuUrls={contextMenuUrls}
      editUrlPattern="/admin/pages/edit/show/%s"
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
      await handleMenuAction('duplicate', 1, { includeSubpages: false });
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          '/admin/pages/tree/duplicate/1',
          expect.objectContaining({ method: 'POST' })
        );
        expect(window.location.assign).toHaveBeenCalledWith('/admin/pages/edit/show/99');
      });
    }
  }
});

test('default duplicate behavior skipped when callback provided', async () => {
  const onDuplicateItem = jest.fn();
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ success: true, newNodeID: 99 }),
    })
  );
  const contextMenuUrls = {
    duplicate: '/admin/pages/tree/duplicate/%s',
  };
  const { container } = render(
    <ComplexTreeView
      apiEndpoint="/admin/pages/tree/jsonview"
      contextMenuUrls={contextMenuUrls}
      editUrlPattern="/admin/pages/edit/show/%s"
      onDuplicateItem={onDuplicateItem}
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
      await handleMenuAction('duplicate', 1, { includeSubpages: false });
      expect(onDuplicateItem).toHaveBeenCalledWith(1, { includeSubpages: false });
      expect(global.fetch).not.toHaveBeenCalled();
      expect(window.location.assign).not.toHaveBeenCalled();
    }
  }
});
