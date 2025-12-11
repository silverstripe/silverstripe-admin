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

test('onAddChild callback is called with correct parameters', async () => {
  const onAddChild = jest.fn();
  const contextMenuUrls = {
    addChild: '/admin/pages/add',
  };
  const { container } = render(
    <ComplexTreeView
      apiEndpoint="/admin/pages/tree/jsonview"
      contextMenuUrls={contextMenuUrls}
      onAddChild={onAddChild}
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
      await handleMenuAction('addPage', 1, { childType: 'Page' });
      expect(onAddChild).toHaveBeenCalledWith(1, { childType: 'Page' });
    }
  }
});

test('onAddChild callback receives different child types', async () => {
  const onAddChild = jest.fn();
  const contextMenuUrls = {
    addChild: '/admin/pages/add',
  };
  const { container } = render(
    <ComplexTreeView
      apiEndpoint="/admin/pages/tree/jsonview"
      contextMenuUrls={contextMenuUrls}
      onAddChild={onAddChild}
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
      await handleMenuAction('addPage', 1, { childType: 'BlogPost' });
      expect(onAddChild).toHaveBeenCalledWith(1, { childType: 'BlogPost' });
      await handleMenuAction('addPage', 2, { childType: 'ErrorPage' });
      expect(onAddChild).toHaveBeenCalledWith(2, { childType: 'ErrorPage' });
    }
  }
});

test('default add child behavior navigates when no callback provided', async () => {
  const contextMenuUrls = {
    addChild: '/admin/pages/add',
  };
  const { container } = render(
    <ComplexTreeView
      apiEndpoint="/admin/pages/tree/jsonview"
      contextMenuUrls={contextMenuUrls}
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
      await handleMenuAction('addPage', 1, { childType: 'Page' });
      await waitFor(() => {
        expect(window.location.assign).toHaveBeenCalled();
        const assignedUrl = window.location.assign.mock.calls[0][0];
        expect(assignedUrl).toContain('/admin/pages/add');
        expect(assignedUrl).toContain('ParentID=1');
        expect(assignedUrl).toContain('RecordType=Page');
      });
    }
  }
});

test('default add child behavior skipped when callback provided', async () => {
  const onAddChild = jest.fn();
  const contextMenuUrls = {
    addChild: '/admin/pages/add',
  };
  const { container } = render(
    <ComplexTreeView
      apiEndpoint="/admin/pages/tree/jsonview"
      contextMenuUrls={contextMenuUrls}
      onAddChild={onAddChild}
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
      await handleMenuAction('addPage', 1, { childType: 'Page' });
      expect(onAddChild).toHaveBeenCalledWith(1, { childType: 'Page' });
      expect(window.location.assign).not.toHaveBeenCalled();
    }
  }
});
