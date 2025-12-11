/* global jest, test, expect */
import { renderHook, waitFor } from '@testing-library/react';
import useComplexTreeViewApi from '../useComplexTreeViewApi';

const mockApiData = {
  currentRecordID: null,
  data: {
    marked: true,
    expanded: true,
    opened: false,
    depth: 0,
    count: 3,
    limited: false,
    children: [
      {
        marked: true,
        expanded: true,
        opened: false,
        depth: 1,
        count: 0,
        limited: false,
        children: [],
        id: 1,
        parentID: 0,
        title: 'Home'
      },
      {
        marked: true,
        expanded: true,
        opened: false,
        depth: 1,
        count: 0,
        limited: false,
        children: [],
        id: 2,
        parentID: 0,
        title: 'About Us'
      },
      {
        marked: true,
        expanded: true,
        opened: false,
        depth: 1,
        count: 2,
        limited: false,
        children: [
          {
            marked: true,
            expanded: true,
            opened: false,
            depth: 2,
            count: 0,
            limited: false,
            children: [],
            id: 4,
            parentID: 3,
            title: 'Contact Form'
          },
          {
            marked: true,
            expanded: true,
            opened: false,
            depth: 2,
            count: 0,
            limited: false,
            children: [],
            id: 5,
            parentID: 3,
            title: 'Map'
          }
        ],
        id: 3,
        parentID: 0,
        title: 'Contact Us'
      }
    ],
    id: 0,
    parentID: null,
    title: ''
  }
};

// Helper to mock fetch with a resolved JSON response
function mockFetchResponse(data, ok = true, status = 200) {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok,
      status,
      json: () => Promise.resolve(data),
    })
  );
}

beforeEach(() => {
  global.fetch = jest.fn();
});

afterEach(() => {
  jest.restoreAllMocks();
});

test('useComplexTreeViewApi throws error when apiEndpoint is not provided', () => {
  expect(() => {
    renderHook(() => useComplexTreeViewApi('tree-1', 0));
  }).toThrow('useComplexTreeViewApi: apiEndpoint is required');
});

test('useComplexTreeViewApi throws error when apiEndpoint is null', () => {
  expect(() => {
    renderHook(() => useComplexTreeViewApi('tree-1', 0, null));
  }).toThrow('useComplexTreeViewApi: apiEndpoint is required');
});

test('useComplexTreeViewApi throws error when apiEndpoint is empty string', () => {
  expect(() => {
    renderHook(() => useComplexTreeViewApi('tree-1', 0, ''));
  }).toThrow('useComplexTreeViewApi: apiEndpoint is required');
});

test('useComplexTreeViewApi returns initial loading state', () => {
  global.fetch = jest.fn(() =>
    new Promise(() => {}) // Never resolves
  );
  const { result } = renderHook(() => useComplexTreeViewApi('tree-1', 0, '/admin/pages/tree/jsonview'));
  expect(result.current.loading).toBe(true);
  expect(result.current.error).toBe(null);
  expect(result.current.dataProvider).toBe(null);
  expect(result.current.initialViewState).toBe(null);
});

test('useComplexTreeViewApi fetches data and transforms it correctly', async () => {
  mockFetchResponse(mockApiData);
  const { result } = renderHook(() => useComplexTreeViewApi('tree-1', 0, '/admin/pages/tree/jsonview'));
  await waitFor(() => {
    expect(result.current.loading).toBe(false);
  });
  expect(global.fetch).toHaveBeenCalledWith('/admin/pages/tree/jsonview/0/0');
  expect(result.current.error).toBe(null);
  expect(result.current.dataProvider).not.toBeNull();
  expect(result.current.rootId).toBe('root');
});

test('useComplexTreeViewApi sets initialViewState with root expanded', async () => {
  mockFetchResponse(mockApiData);
  const { result } = renderHook(() => useComplexTreeViewApi('tree-1', 0, '/admin/pages/tree/jsonview'));
  await waitFor(() => {
    expect(result.current.initialViewState).not.toBeNull();
  });
  expect(result.current.initialViewState).not.toBeNull();
  const keys = Object.keys(result.current.initialViewState);
  expect(keys.length).toBeGreaterThan(0);
  const viewState = result.current.initialViewState[keys[0]];
  expect(viewState.expandedItems.includes('root')).toBe(true);
});

test('useComplexTreeViewApi selects and focuses currentRecordID', async () => {
  const dataWithRecord = {
    ...mockApiData,
    currentRecordID: 3
  };
  mockFetchResponse(dataWithRecord);
  const { result } = renderHook(() => useComplexTreeViewApi('tree-1', 3, '/admin/pages/tree/jsonview'));
  await waitFor(() => {
    expect(result.current.initialViewState).not.toBeNull();
  });
  const keys = Object.keys(result.current.initialViewState);
  const viewState = result.current.initialViewState[keys[0]];
  expect(viewState.selectedItems.includes(3)).toBe(true);
  expect(viewState.focusedItem).toBe(3);
});

test('useComplexTreeViewApi expands parent items for selected item', async () => {
  const dataWithRecord = {
    ...mockApiData,
    currentRecordID: 4
  };
  mockFetchResponse(dataWithRecord);
  const { result } = renderHook(() => useComplexTreeViewApi('tree-1', 4, '/admin/pages/tree/jsonview'));
  await waitFor(() => {
    expect(result.current.initialViewState).not.toBeNull();
  });
  const keys = Object.keys(result.current.initialViewState);
  const viewState = result.current.initialViewState[keys[0]];
  expect(viewState.expandedItems.includes('root')).toBe(true);
  expect(viewState.expandedItems.includes('3')).toBe(true);
  expect(viewState.selectedItems.includes(4)).toBe(true);
});

test('useComplexTreeViewApi handles fetch errors', async () => {
  global.fetch = jest.fn(() =>
    Promise.reject(new Error('Network error'))
  );
  const { result } = renderHook(() => useComplexTreeViewApi('tree-1', 0, '/admin/pages/tree/jsonview'));
  await waitFor(() => {
    expect(result.current.loading).toBe(false);
  });
  expect(result.current.error).toBe('Network error');
  expect(result.current.dataProvider).toBe(null);
  expect(result.current.initialViewState).toBe(null);
});

test('useComplexTreeViewApi handles HTTP errors', async () => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: false,
      status: 404,
    })
  );
  const { result } = renderHook(() => useComplexTreeViewApi('tree-1', 0, '/admin/pages/tree/jsonview'));
  await waitFor(() => {
    expect(result.current.loading).toBe(false);
  });
  expect(result.current.error).toBe('HTTP error! status: 404');
  expect(result.current.dataProvider).toBe(null);
});

test('useComplexTreeViewApi uses custom API endpoint in fetch calls', async () => {
  mockFetchResponse(mockApiData);
  const customEndpoint = '/admin/custom-pages/tree/jsonview';
  const { result } = renderHook(() => useComplexTreeViewApi('tree-1', 0, customEndpoint));
  await waitFor(() => {
    expect(result.current.loading).toBe(false);
  });
  expect(global.fetch).toHaveBeenCalledWith(`${customEndpoint}/0/0`);
  expect(result.current.error).toBe(null);
  expect(result.current.dataProvider).not.toBeNull();
  global.fetch.mockClear();
  global.fetch.mockResolvedValue({
    ok: true,
    status: 200,
    json: () => Promise.resolve({
      currentRecordID: null,
      data: []
    }),
  });
  await result.current.loadSubtree(5);
  expect(global.fetch).toHaveBeenCalledWith(`${customEndpoint}/5/null`);
});

test('useComplexTreeViewApi handles deeply nested children', async () => {
  mockFetchResponse(mockApiData);
  const { result } = renderHook(() => useComplexTreeViewApi('tree-1', 0, '/admin/pages/tree/jsonview'));
  await waitFor(() => {
    expect(result.current.dataProvider).not.toBeNull();
  });
  expect(result.current.dataProvider).not.toBeNull();
});

test('useComplexTreeViewApi provides memoized dataProvider', async () => {
  mockFetchResponse(mockApiData);
  const { result, rerender } = renderHook(() => useComplexTreeViewApi('tree-1', 0, '/admin/pages/tree/jsonview'));
  await waitFor(() => {
    expect(result.current.dataProvider).not.toBeNull();
  });
  const firstProvider = result.current.dataProvider;
  rerender();
  expect(result.current.dataProvider).toBe(firstProvider);
});

test('useComplexTreeViewApi returns null rootId before data loads', () => {
  global.fetch = jest.fn(() =>
    new Promise(() => {})
  );
  const { result } = renderHook(() => useComplexTreeViewApi('tree-1', 0, '/admin/pages/tree/jsonview'));
  expect(result.current.rootId).toBe(null);
});

test('useComplexTreeViewApi handles limited nodes with empty children', async () => {
  const dataWithLimitedNode = {
    currentRecordID: null,
    data: {
      marked: true,
      expanded: true,
      opened: false,
      depth: 0,
      count: 2,
      limited: false,
      children: [
        {
          marked: true,
          expanded: true,
          opened: false,
          depth: 1,
          count: 5,
          limited: true,
          children: [],
          id: 1,
          parentID: 0,
          title: 'Folder with Limited Children'
        },
        {
          marked: true,
          expanded: true,
          opened: false,
          depth: 1,
          count: 0,
          limited: false,
          children: [],
          id: 2,
          parentID: 0,
          title: 'Regular Folder'
        }
      ],
      id: 0,
      parentID: null,
      title: ''
    }
  };
  mockFetchResponse(dataWithLimitedNode);
  const { result } = renderHook(() => useComplexTreeViewApi('tree-1', 0, '/admin/pages/tree/jsonview'));
  await waitFor(() => {
    expect(result.current.dataProvider).not.toBeNull();
  });
  expect(result.current.dataProvider).not.toBeNull();
  expect(result.current.error).toBe(null);
});

test('useComplexTreeViewApi retains limited and count in node data', async () => {
  const dataWithLimitedNode = {
    currentRecordID: null,
    data: {
      marked: true,
      expanded: true,
      opened: false,
      depth: 0,
      count: 1,
      limited: false,
      children: [
        {
          marked: true,
          expanded: true,
          opened: false,
          depth: 1,
          count: 10,
          limited: true,
          children: [],
          id: 1,
          parentID: 0,
          title: 'Limited Node'
        }
      ],
      id: 0,
      parentID: null,
      title: ''
    }
  };
  mockFetchResponse(dataWithLimitedNode);
  const { result } = renderHook(() => useComplexTreeViewApi('tree-1', 0, '/admin/pages/tree/jsonview'));
  await waitFor(() => {
    expect(result.current.dataProvider).not.toBeNull();
  });
  expect(result.current.dataProvider).not.toBeNull();
  expect(result.current.error).toBe(null);
});

test('useComplexTreeViewApi loadSubtree makes correct API call with node ID', async () => {
  mockFetchResponse(mockApiData);
  const { result } = renderHook(() => useComplexTreeViewApi('tree-1', 0, '/admin/pages/tree/jsonview'));
  await waitFor(() => {
    expect(result.current.dataProvider).not.toBeNull();
  });
  const subtreeData = {
    currentRecordID: null,
    data: [
      {
        marked: true,
        expanded: true,
        opened: false,
        depth: 2,
        count: 0,
        limited: false,
        children: [],
        id: 4,
        parentID: 3,
        title: 'Contact Form'
      },
      {
        marked: true,
        expanded: true,
        opened: false,
        depth: 2,
        count: 0,
        limited: false,
        children: [],
        id: 5,
        parentID: 3,
        title: 'Map'
      }
    ]
  };
  global.fetch.mockClear();
  global.fetch.mockResolvedValue({
    ok: true,
    status: 200,
    json: () => Promise.resolve(subtreeData),
  });
  const subtree = await result.current.loadSubtree(3);
  expect(global.fetch).toHaveBeenCalledWith('/admin/pages/tree/jsonview/3/null');
  expect(subtree).not.toBeNull();
  expect(subtree.items).not.toBeNull();
});

test('useComplexTreeViewApi loadSubtree correctly transforms subtree data', async () => {
  mockFetchResponse(mockApiData);
  const { result } = renderHook(() => useComplexTreeViewApi('tree-1', 0, '/admin/pages/tree/jsonview'));
  await waitFor(() => {
    expect(result.current.dataProvider).not.toBeNull();
  });
  const subtreeData = {
    currentRecordID: null,
    data: [
      {
        marked: true,
        expanded: true,
        opened: false,
        depth: 2,
        count: 0,
        limited: false,
        children: [],
        id: 4,
        parentID: 3,
        title: 'Contact Form'
      },
      {
        marked: true,
        expanded: true,
        opened: false,
        depth: 2,
        count: 0,
        limited: false,
        children: [],
        id: 5,
        parentID: 3,
        title: 'Map'
      }
    ]
  };
  global.fetch.mockClear();
  global.fetch.mockResolvedValue({
    ok: true,
    status: 200,
    json: () => Promise.resolve(subtreeData),
  });
  const subtree = await result.current.loadSubtree(3);
  expect(subtree.items['4']).toBeDefined();
  expect(subtree.items['4'].data.title).toBe('Contact Form');
  expect(subtree.items['5']).toBeDefined();
  expect(subtree.items['5'].data.title).toBe('Map');
  expect(subtree.rootId).toBeNull();
});

test('useComplexTreeViewApi loadSubtree handles errors during subtree loading', async () => {
  mockFetchResponse(mockApiData);
  const { result } = renderHook(() => useComplexTreeViewApi('tree-1', 0, '/admin/pages/tree/jsonview'));
  await waitFor(() => {
    expect(result.current.dataProvider).not.toBeNull();
  });
  global.fetch.mockClear();
  global.fetch.mockRejectedValue(new Error('Subtree fetch failed'));
  await expect(result.current.loadSubtree(3)).rejects.toThrow('Subtree fetch failed');
});

test('useComplexTreeViewApi loadSubtree handles HTTP errors', async () => {
  mockFetchResponse(mockApiData);
  const { result } = renderHook(() => useComplexTreeViewApi('tree-1', 0, '/admin/pages/tree/jsonview'));
  await waitFor(() => {
    expect(result.current.dataProvider).not.toBeNull();
  });
  global.fetch.mockClear();
  global.fetch.mockResolvedValue({
    ok: false,
    status: 404,
  });
  await expect(result.current.loadSubtree(3)).rejects.toThrow('HTTP error! status: 404');
});

test('useComplexTreeViewApi marks nodes with unloaded children as folders', async () => {
  const dataWithUnloadedChildren = {
    currentRecordID: null,
    data: {
      marked: true,
      expanded: true,
      opened: false,
      depth: 0,
      count: 1,
      limited: false,
      children: [
        {
          marked: true,
          expanded: false,
          opened: false,
          depth: 1,
          count: 4,
          limited: false,
          children: [],
          id: 1,
          parentID: 0,
          title: 'Feature Test Pages'
        }
      ],
      id: 0,
      parentID: null,
      title: ''
    }
  };
  mockFetchResponse(dataWithUnloadedChildren);
  const { result } = renderHook(() => useComplexTreeViewApi('tree-1', 0, '/admin/pages/tree/jsonview'));
  await waitFor(() => {
    expect(result.current.dataProvider).not.toBeNull();
  });
  expect(result.current.dataProvider).not.toBeNull();
  expect(result.current.error).toBe(null);
  const items = result.current.dataProvider.data.items;
  expect(items['1']).toBeDefined();
  expect(items['1'].isFolder).toBe(true);
});

test('useComplexTreeViewApi mergeSubtree updates tree data correctly', async () => {
  mockFetchResponse(mockApiData);
  const { result } = renderHook(() => useComplexTreeViewApi('tree-1', 0, '/admin/pages/tree/jsonview'));
  await waitFor(() => {
    expect(result.current.dataProvider).not.toBeNull();
  });
  const subtreeData = {
    currentRecordID: null,
    data: [
      {
        marked: true,
        expanded: true,
        opened: false,
        depth: 2,
        count: 0,
        limited: false,
        children: [],
        id: 4,
        parentID: 3,
        title: 'Contact Form'
      },
      {
        marked: true,
        expanded: true,
        opened: false,
        depth: 2,
        count: 0,
        limited: false,
        children: [],
        id: 5,
        parentID: 3,
        title: 'Map'
      }
    ]
  };
  global.fetch.mockClear();
  global.fetch.mockResolvedValue({
    ok: true,
    status: 200,
    json: () => Promise.resolve(subtreeData),
  });
  const subtree = await result.current.loadSubtree(3);
  await result.current.mergeSubtree(3, subtree.items);
  await waitFor(() => {
    expect(result.current.dataProvider).not.toBeNull();
  });
  const items = result.current.dataProvider.data.items;
  expect(items['4']).toBeDefined();
  expect(items['4'].data.title).toBe('Contact Form');
  expect(items['5']).toBeDefined();
  expect(items['5'].data.title).toBe('Map');
});

test('useComplexTreeViewApi mergeSubtree adds children to parent node', async () => {
  mockFetchResponse(mockApiData);
  const { result } = renderHook(() => useComplexTreeViewApi('tree-1', 0, '/admin/pages/tree/jsonview'));
  await waitFor(() => {
    expect(result.current.dataProvider).not.toBeNull();
  });
  const originalItem = result.current.dataProvider.data.items['3'];
  const originalChildCount = originalItem.children.length;
  const subtreeData = {
    currentRecordID: null,
    data: [
      {
        marked: true,
        expanded: true,
        opened: false,
        depth: 2,
        count: 0,
        limited: false,
        children: [],
        id: 100,
        parentID: 3,
        title: 'New Child'
      }
    ]
  };
  global.fetch.mockClear();
  global.fetch.mockResolvedValue({
    ok: true,
    status: 200,
    json: () => Promise.resolve(subtreeData),
  });
  const subtree = await result.current.loadSubtree(3);
  await result.current.mergeSubtree(3, subtree.items);
  await waitFor(() => {
    expect(result.current.dataProvider).not.toBeNull();
  });
  const updatedItem = result.current.dataProvider.data.items['3'];
  expect(updatedItem.children.length).toBeGreaterThan(originalChildCount);
  expect(updatedItem.children.includes('100')).toBe(true);
});

test('useComplexTreeViewApi mergeSubtree maintains valid tree structure', async () => {
  mockFetchResponse(mockApiData);
  const { result } = renderHook(() => useComplexTreeViewApi('tree-1', 0, '/admin/pages/tree/jsonview'));
  await waitFor(() => {
    expect(result.current.dataProvider).not.toBeNull();
  });
  const subtreeData = {
    currentRecordID: null,
    data: [
      {
        marked: true,
        expanded: true,
        opened: false,
        depth: 2,
        count: 0,
        limited: false,
        children: [],
        id: 200,
        parentID: 3,
        title: 'Valid Child'
      }
    ]
  };
  global.fetch.mockClear();
  global.fetch.mockResolvedValue({
    ok: true,
    status: 200,
    json: () => Promise.resolve(subtreeData),
  });
  const subtree = await result.current.loadSubtree(3);
  await result.current.mergeSubtree(3, subtree.items);
  await waitFor(() => {
    expect(result.current.dataProvider).not.toBeNull();
  });
  const items = result.current.dataProvider.data.items;
  const parentItem = items['3'];
  parentItem.children.forEach(childId => {
    expect(items[childId]).toBeDefined();
  });
});

test('useComplexTreeViewApi subtree load triggered for unexpanded nodes with children', async () => {
  const dataWithUnloadedChildren = {
    currentRecordID: null,
    data: {
      marked: true,
      expanded: true,
      opened: false,
      depth: 0,
      count: 1,
      limited: false,
      children: [
        {
          marked: true,
          expanded: false,
          opened: false,
          depth: 1,
          count: 4,
          limited: false,
          children: [],
          id: 1,
          parentID: 0,
          title: 'Folder with Unloaded Children'
        }
      ],
      id: 0,
      parentID: null,
      title: ''
    }
  };
  mockFetchResponse(dataWithUnloadedChildren);
  const { result } = renderHook(() => useComplexTreeViewApi('tree-1', 0, '/admin/pages/tree/jsonview'));
  await waitFor(() => {
    expect(result.current.dataProvider).not.toBeNull();
  });
  const items = result.current.dataProvider.data.items;
  const node = items['1'];
  expect(node).toBeDefined();
  expect(node.data.expanded).toBe(false);
  expect(node.data.count).toBe(4);
  expect(node.children.length).toBe(0);
  expect(node.isFolder).toBe(true);
});

test('useComplexTreeViewApi loadSubtree successfully loads children for unexpanded node', async () => {
  const initialData = {
    currentRecordID: null,
    data: {
      marked: true,
      expanded: true,
      opened: false,
      depth: 0,
      count: 1,
      limited: false,
      children: [
        {
          marked: true,
          expanded: false,
          opened: false,
          depth: 1,
          count: 2,
          limited: false,
          children: [],
          id: 1,
          parentID: 0,
          title: 'Folder with Unloaded Children'
        }
      ],
      id: 0,
      parentID: null,
      title: ''
    }
  };
  mockFetchResponse(initialData);
  const { result } = renderHook(() => useComplexTreeViewApi('tree-1', 0, '/admin/pages/tree/jsonview'));
  await waitFor(() => {
    expect(result.current.dataProvider).not.toBeNull();
  });
  const subtreeData = {
    currentRecordID: null,
    data: [
      {
        marked: true,
        expanded: true,
        opened: false,
        depth: 2,
        count: 0,
        limited: false,
        children: [],
        id: 10,
        parentID: 1,
        title: 'Child 1'
      },
      {
        marked: true,
        expanded: true,
        opened: false,
        depth: 2,
        count: 0,
        limited: false,
        children: [],
        id: 11,
        parentID: 1,
        title: 'Child 2'
      }
    ]
  };
  global.fetch.mockClear();
  global.fetch.mockResolvedValue({
    ok: true,
    status: 200,
    json: () => Promise.resolve(subtreeData),
  });
  const subtree = await result.current.loadSubtree(1);
  expect(subtree.items['10']).toBeDefined();
  expect(subtree.items['10'].data.title).toBe('Child 1');
  expect(subtree.items['11']).toBeDefined();
  expect(subtree.items['11'].data.title).toBe('Child 2');
});

test('useComplexTreeViewApi mergeSubtree updates parent children when unexpanded node is expanded', async () => {
  const initialData = {
    currentRecordID: null,
    data: {
      marked: true,
      expanded: true,
      opened: false,
      depth: 0,
      count: 1,
      limited: false,
      children: [
        {
          marked: true,
          expanded: false,
          opened: false,
          depth: 1,
          count: 2,
          limited: false,
          children: [],
          id: 1,
          parentID: 0,
          title: 'Folder with Unloaded Children'
        }
      ],
      id: 0,
      parentID: null,
      title: ''
    }
  };
  mockFetchResponse(initialData);
  const { result } = renderHook(() => useComplexTreeViewApi('tree-1', 0, '/admin/pages/tree/jsonview'));
  await waitFor(() => {
    expect(result.current.dataProvider).not.toBeNull();
  });
  const parentNode = result.current.dataProvider.data.items['1'];
  const initialChildrenCount = parentNode.children.length;
  const subtreeData = {
    currentRecordID: null,
    data: [
      {
        marked: true,
        expanded: true,
        opened: false,
        depth: 2,
        count: 0,
        limited: false,
        children: [],
        id: 10,
        parentID: 1,
        title: 'Child 1'
      },
      {
        marked: true,
        expanded: true,
        opened: false,
        depth: 2,
        count: 0,
        limited: false,
        children: [],
        id: 11,
        parentID: 1,
        title: 'Child 2'
      }
    ]
  };
  global.fetch.mockClear();
  global.fetch.mockResolvedValue({
    ok: true,
    status: 200,
    json: () => Promise.resolve(subtreeData),
  });
  const subtree = await result.current.loadSubtree(1);
  await result.current.mergeSubtree(1, subtree.items);
  await waitFor(() => {
    expect(result.current.dataProvider).not.toBeNull();
  });
  const updatedParentNode = result.current.dataProvider.data.items['1'];
  expect(updatedParentNode.children.length).toBeGreaterThan(initialChildrenCount);
  expect(updatedParentNode.children.includes('10')).toBe(true);
  expect(updatedParentNode.children.includes('11')).toBe(true);
});

test('useComplexTreeViewApi integration: limited node expansion flow', async () => {
  const initialData = {
    currentRecordID: null,
    data: {
      marked: true,
      expanded: true,
      opened: false,
      depth: 0,
      count: 1,
      limited: false,
      children: [
        {
          marked: true,
          expanded: true,
          opened: false,
          depth: 1,
          count: 5,
          limited: true,
          children: [],
          id: 1,
          parentID: 0,
          title: 'Limited Parent'
        }
      ],
      id: 0,
      parentID: null,
      title: ''
    }
  };
  mockFetchResponse(initialData);
  const { result } = renderHook(() => useComplexTreeViewApi('tree-1', 0, '/admin/pages/tree/jsonview'));
  await waitFor(() => {
    expect(result.current.dataProvider).not.toBeNull();
  });
  const limitedNode = result.current.dataProvider.data.items['1'];
  expect(limitedNode.data.limited).toBe(true);
  expect(limitedNode.children.length).toBe(1);
  expect(limitedNode.children[0]).toBe('-1');
  const syntheticChild = result.current.dataProvider.data.items['-1'];
  expect(syntheticChild.data.isLimitedIndicator).toBe(true);
  const subtreeData = {
    currentRecordID: null,
    data: [
      {
        marked: true,
        expanded: true,
        opened: false,
        depth: 2,
        count: 0,
        limited: false,
        children: [],
        id: 10,
        parentID: 1,
        title: 'Child 1'
      },
      {
        marked: true,
        expanded: true,
        opened: false,
        depth: 2,
        count: 0,
        limited: false,
        children: [],
        id: 11,
        parentID: 1,
        title: 'Child 2'
      },
      {
        marked: true,
        expanded: true,
        opened: false,
        depth: 2,
        count: 0,
        limited: false,
        children: [],
        id: 12,
        parentID: 1,
        title: 'Child 3'
      },
      {
        marked: true,
        expanded: true,
        opened: false,
        depth: 2,
        count: 0,
        limited: false,
        children: [],
        id: 13,
        parentID: 1,
        title: 'Child 4'
      },
      {
        marked: true,
        expanded: true,
        opened: false,
        depth: 2,
        count: 0,
        limited: false,
        children: [],
        id: 14,
        parentID: 1,
        title: 'Child 5'
      }
    ]
  };
  global.fetch.mockClear();
  global.fetch.mockResolvedValue({
    ok: true,
    status: 200,
    json: () => Promise.resolve(subtreeData),
  });
  const subtree = await result.current.loadSubtree(1);
  expect(Object.keys(subtree.items).length).toBeGreaterThan(0);
  await result.current.mergeSubtree(1, subtree.items);
  await waitFor(() => {
    expect(result.current.dataProvider).not.toBeNull();
  });
  const updatedLimitedNode = result.current.dataProvider.data.items['1'];
  expect(updatedLimitedNode.children.length).toBe(5);
  expect(updatedLimitedNode.children.includes('10')).toBe(true);
  expect(updatedLimitedNode.children.includes('14')).toBe(true);
  updatedLimitedNode.children.forEach(childId => {
    expect(result.current.dataProvider.data.items[childId]).toBeDefined();
  });
});

test('useComplexTreeViewApi integration: unexpanded node expansion flow', async () => {
  const initialData = {
    currentRecordID: null,
    data: {
      marked: true,
      expanded: true,
      opened: false,
      depth: 0,
      count: 1,
      limited: false,
      children: [
        {
          marked: true,
          expanded: false,
          opened: false,
          depth: 1,
          count: 3,
          limited: false,
          children: [],
          id: 1,
          parentID: 0,
          title: 'Unexpanded Parent'
        }
      ],
      id: 0,
      parentID: null,
      title: ''
    }
  };
  mockFetchResponse(initialData);
  const { result } = renderHook(() => useComplexTreeViewApi('tree-1', 0, '/admin/pages/tree/jsonview'));
  await waitFor(() => {
    expect(result.current.dataProvider).not.toBeNull();
  });
  const unexpandedNode = result.current.dataProvider.data.items['1'];
  expect(unexpandedNode.data.expanded).toBe(false);
  expect(unexpandedNode.data.count).toBe(3);
  expect(unexpandedNode.children.length).toBe(0);
  expect(unexpandedNode.isFolder).toBe(true);
  const subtreeData = {
    currentRecordID: null,
    data: [
      {
        marked: true,
        expanded: true,
        opened: false,
        depth: 2,
        count: 0,
        limited: false,
        children: [],
        id: 20,
        parentID: 1,
        title: 'Child A'
      },
      {
        marked: true,
        expanded: true,
        opened: false,
        depth: 2,
        count: 0,
        limited: false,
        children: [],
        id: 21,
        parentID: 1,
        title: 'Child B'
      },
      {
        marked: true,
        expanded: true,
        opened: false,
        depth: 2,
        count: 0,
        limited: false,
        children: [],
        id: 22,
        parentID: 1,
        title: 'Child C'
      }
    ]
  };
  global.fetch.mockClear();
  global.fetch.mockResolvedValue({
    ok: true,
    status: 200,
    json: () => Promise.resolve(subtreeData),
  });
  const subtree = await result.current.loadSubtree(1);
  expect(subtree.items['20']).toBeDefined();
  expect(subtree.items['20'].data.title).toBe('Child A');
  expect(subtree.items['22']).toBeDefined();
  await result.current.mergeSubtree(1, subtree.items);
  await waitFor(() => {
    expect(result.current.dataProvider).not.toBeNull();
  });
  const updatedNode = result.current.dataProvider.data.items['1'];
  expect(updatedNode.children.length).toBe(3);
  expect(updatedNode.children.includes('20')).toBe(true);
  expect(updatedNode.children.includes('21')).toBe(true);
  expect(updatedNode.children.includes('22')).toBe(true);
});

test('useComplexTreeViewApi integration: tree integrity after multiple subtree loads', async () => {
  const initialData = {
    currentRecordID: null,
    data: {
      marked: true,
      expanded: true,
      opened: false,
      depth: 0,
      count: 2,
      limited: false,
      children: [
        {
          marked: true,
          expanded: false,
          opened: false,
          depth: 1,
          count: 2,
          limited: false,
          children: [],
          id: 1,
          parentID: 0,
          title: 'Folder 1'
        },
        {
          marked: true,
          expanded: false,
          opened: false,
          depth: 1,
          count: 1,
          limited: false,
          children: [],
          id: 2,
          parentID: 0,
          title: 'Folder 2'
        }
      ],
      id: 0,
      parentID: null,
      title: ''
    }
  };
  mockFetchResponse(initialData);
  const { result } = renderHook(() => useComplexTreeViewApi('tree-1', 0, '/admin/pages/tree/jsonview'));
  await waitFor(() => {
    expect(result.current.dataProvider).not.toBeNull();
  });
  const subtreeData1 = {
    currentRecordID: null,
    data: [
      {
        marked: true,
        expanded: true,
        opened: false,
        depth: 2,
        count: 0,
        limited: false,
        children: [],
        id: 10,
        parentID: 1,
        title: 'Child 1A'
      },
      {
        marked: true,
        expanded: true,
        opened: false,
        depth: 2,
        count: 0,
        limited: false,
        children: [],
        id: 11,
        parentID: 1,
        title: 'Child 1B'
      }
    ]
  };
  global.fetch.mockClear();
  global.fetch.mockResolvedValue({
    ok: true,
    status: 200,
    json: () => Promise.resolve(subtreeData1),
  });
  const subtree1 = await result.current.loadSubtree(1);
  await result.current.mergeSubtree(1, subtree1.items);
  await waitFor(() => {
    expect(result.current.dataProvider.data.items['10']).toBeDefined();
  });
  const subtreeData2 = {
    currentRecordID: null,
    data: [
      {
        marked: true,
        expanded: true,
        opened: false,
        depth: 2,
        count: 0,
        limited: false,
        children: [],
        id: 20,
        parentID: 2,
        title: 'Child 2A'
      }
    ]
  };
  global.fetch.mockClear();
  global.fetch.mockResolvedValue({
    ok: true,
    status: 200,
    json: () => Promise.resolve(subtreeData2),
  });
  const subtree2 = await result.current.loadSubtree(2);
  await result.current.mergeSubtree(2, subtree2.items);
  await waitFor(() => {
    expect(result.current.dataProvider.data.items['20']).toBeDefined();
  });
  const finalItems = result.current.dataProvider.data.items;
  expect(finalItems['1'].children.includes('10')).toBe(true);
  expect(finalItems['1'].children.includes('11')).toBe(true);
  expect(finalItems['2'].children.includes('20')).toBe(true);
  expect(finalItems['10'].data.title).toBe('Child 1A');
  expect(finalItems['11'].data.title).toBe('Child 1B');
  expect(finalItems['20'].data.title).toBe('Child 2A');
  expect(finalItems['1'].isFolder).toBe(true);
  expect(finalItems['2'].isFolder).toBe(true);
  expect(finalItems['10'].isFolder).toBe(false);
  expect(finalItems['20'].isFolder).toBe(false);
});

test('useComplexTreeViewApi preserves API data order when merging subtrees', async () => {
  const initialData = {
    currentRecordID: null,
    data: {
      marked: true,
      expanded: true,
      opened: false,
      depth: 0,
      count: 1,
      limited: false,
      children: [
        {
          marked: true,
          expanded: false,
          opened: false,
          depth: 1,
          count: 3,
          limited: false,
          children: [],
          id: 2,
          parentID: 0,
          title: 'Parent Node'
        }
      ],
      id: 0,
      parentID: null,
      title: ''
    }
  };
  mockFetchResponse(initialData);
  const { result } = renderHook(() => useComplexTreeViewApi('tree-1', 0, '/admin/pages/tree/jsonview'));
  await waitFor(() => {
    expect(result.current.dataProvider).not.toBeNull();
  });
  const subtreeData = {
    currentRecordID: null,
    data: [
      {
        marked: true,
        expanded: true,
        opened: false,
        depth: 2,
        count: 0,
        limited: false,
        children: [],
        id: 17,
        parentID: 2,
        title: 'New Page 17'
      },
      {
        marked: true,
        expanded: true,
        opened: false,
        depth: 2,
        count: 0,
        limited: false,
        children: [],
        id: 15,
        parentID: 2,
        title: 'New Page 15'
      },
      {
        marked: true,
        expanded: true,
        opened: false,
        depth: 2,
        count: 0,
        limited: false,
        children: [],
        id: 16,
        parentID: 2,
        title: 'New Page 16'
      }
    ]
  };
  global.fetch.mockClear();
  global.fetch.mockResolvedValue({
    ok: true,
    status: 200,
    json: () => Promise.resolve(subtreeData),
  });
  const subtree = await result.current.loadSubtree(2);
  expect(subtree.subtreeChildIds).toEqual(['17', '15', '16']);
  await result.current.mergeSubtree(2, subtree.items, subtree.subtreeChildIds);
  await waitFor(() => {
    expect(result.current.dataProvider).not.toBeNull();
  });
  const updatedParentNode = result.current.dataProvider.data.items['2'];
  expect(updatedParentNode.children).toEqual(['17', '15', '16']);
  expect(updatedParentNode.children[0]).toBe('17');
  expect(updatedParentNode.children[1]).toBe('15');
  expect(updatedParentNode.children[2]).toBe('16');
});

test('useComplexTreeViewApi transforms statusFlags from API response', async () => {
  const dataWithStatusFlags = {
    currentRecordID: null,
    data: {
      marked: true,
      expanded: true,
      opened: false,
      depth: 0,
      count: 2,
      limited: false,
      children: [
        {
          marked: true,
          expanded: true,
          opened: false,
          depth: 1,
          count: 0,
          limited: false,
          children: [],
          id: 1,
          parentID: 0,
          title: 'Draft Page',
          statusFlags: {
            draft: 'Saved as draft'
          }
        },
        {
          marked: true,
          expanded: true,
          opened: false,
          depth: 1,
          count: 0,
          limited: false,
          children: [],
          id: 2,
          parentID: 0,
          title: 'Published Page',
          statusFlags: {
            published: {
              text: 'Published',
              title: 'This page is published to the live site'
            }
          }
        }
      ],
      id: 0,
      parentID: null,
      title: ''
    }
  };
  mockFetchResponse(dataWithStatusFlags);
  const { result } = renderHook(() => useComplexTreeViewApi('tree-1', 0, '/admin/pages/tree/jsonview'));
  await waitFor(() => {
    expect(result.current.dataProvider).not.toBeNull();
  });
  const items = result.current.dataProvider.data.items;

  // Test node with string status flag
  expect(items['1']).toBeDefined();
  expect(items['1'].data.statusFlags).toBeDefined();
  expect(Array.isArray(items['1'].data.statusFlags)).toBe(true);
  expect(items['1'].data.statusFlags.length).toBe(1);
  expect(items['1'].data.statusFlags[0]).toEqual({
    cssClass: 'status-draft',
    text: 'Saved as draft'
  });

  // Test node with object status flag
  expect(items['2']).toBeDefined();
  expect(items['2'].data.statusFlags).toBeDefined();
  expect(Array.isArray(items['2'].data.statusFlags)).toBe(true);
  expect(items['2'].data.statusFlags.length).toBe(1);
  expect(items['2'].data.statusFlags[0]).toEqual({
    cssClass: 'status-published',
    text: 'Published',
    title: 'This page is published to the live site'
  });
});

test('useComplexTreeViewApi handles multiple statusFlags per node', async () => {
  const dataWithMultipleStatusFlags = {
    currentRecordID: null,
    data: {
      marked: true,
      expanded: true,
      opened: false,
      depth: 0,
      count: 1,
      limited: false,
      children: [
        {
          marked: true,
          expanded: true,
          opened: false,
          depth: 1,
          count: 0,
          limited: false,
          children: [],
          id: 1,
          parentID: 0,
          title: 'Complex Page',
          statusFlags: {
            draft: 'Unsaved changes',
            scheduled: {
              text: 'Scheduled',
              title: 'Scheduled for 2024-01-15'
            },
            archived: 'Archived'
          }
        }
      ],
      id: 0,
      parentID: null,
      title: ''
    }
  };
  mockFetchResponse(dataWithMultipleStatusFlags);
  const { result } = renderHook(() => useComplexTreeViewApi('tree-1', 0, '/admin/pages/tree/jsonview'));
  await waitFor(() => {
    expect(result.current.dataProvider).not.toBeNull();
  });
  const items = result.current.dataProvider.data.items;
  expect(items['1'].data.statusFlags).toBeDefined();
  expect(items['1'].data.statusFlags.length).toBe(3);

  // Check that all flags are present
  const cssClasses = items['1'].data.statusFlags.map(flag => flag.cssClass);
  expect(cssClasses).toContain('status-draft');
  expect(cssClasses).toContain('status-scheduled');
  expect(cssClasses).toContain('status-archived');
});

test('useComplexTreeViewApi saveNode uses provided saveNodeEndpoint', async () => {
  mockFetchResponse(mockApiData);
  window.ss = { config: { SecurityID: 'mock-security-id' } };
  const customSaveNodeEndpoint = '/custom/endpoint/savejsonnode';
  const { result } = renderHook(() => useComplexTreeViewApi(
    'tree-1',
    0,
    '/admin/pages/tree/jsonview',
    null,
    customSaveNodeEndpoint,
    null
  ));
  await waitFor(() => {
    expect(result.current.dataProvider).not.toBeNull();
  });

  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ success: true }),
    })
  );

  await result.current.saveNode(1, 0, [2, 3]);
  expect(global.fetch).toHaveBeenCalledWith(
    customSaveNodeEndpoint,
    expect.objectContaining({
      method: 'POST',
      headers: expect.objectContaining({
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({
        ID: 1,
        ParentID: 0,
        SiblingIDs: [2, 3],
      }),
    })
  );
});

test('useComplexTreeViewApi saveNode derives endpoint from apiEndpoint when not provided', async () => {
  mockFetchResponse(mockApiData);
  window.ss = { config: { SecurityID: 'mock-security-id' } };
  const { result } = renderHook(() => useComplexTreeViewApi(
    'tree-1',
    0,
    '/admin/pages/tree/jsonview',
    null,
    null,
    null
  ));
  await waitFor(() => {
    expect(result.current.dataProvider).not.toBeNull();
  });

  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ success: true }),
    })
  );

  await result.current.saveNode(1, 0, [2, 3]);
  expect(global.fetch).toHaveBeenCalledWith(
    '/admin/pages/tree/savejsonnode',
    expect.any(Object)
  );
});

test('useComplexTreeViewApi updateNodes uses provided updateNodesEndpoint', async () => {
  mockFetchResponse(mockApiData);
  const customUpdateNodesEndpoint = '/custom/endpoint/updatejsonnodes';
  const { result } = renderHook(() => useComplexTreeViewApi(
    'tree-1',
    0,
    '/admin/pages/tree/jsonview',
    null,
    null,
    customUpdateNodesEndpoint
  ));
  await waitFor(() => {
    expect(result.current.dataProvider).not.toBeNull();
  });

  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ success: true }),
    })
  );

  await result.current.updateNodes([1, 2, 3]);
  const callArg = global.fetch.mock.calls[global.fetch.mock.calls.length - 1][0];
  expect(callArg).toContain(customUpdateNodesEndpoint);
  expect(callArg).toContain('ids=');
});

test('useComplexTreeViewApi updateNodes derives endpoint from apiEndpoint when not provided', async () => {
  mockFetchResponse(mockApiData);
  const { result } = renderHook(() => useComplexTreeViewApi(
    'tree-1',
    0,
    '/admin/pages/tree/jsonview',
    null,
    null,
    null
  ));
  await waitFor(() => {
    expect(result.current.dataProvider).not.toBeNull();
  });

  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ success: true }),
    })
  );

  await result.current.updateNodes([1, 2, 3]);
  const callArg = global.fetch.mock.calls[global.fetch.mock.calls.length - 1][0];
  expect(callArg).toContain('/admin/pages/tree/updatejsonnodes');
  expect(callArg).toContain('ids=');
});

test('useComplexTreeViewApi sets linkUrl to null when listUrlPattern is not provided', async () => {
  const dataWithLimitedNode = {
    currentRecordID: null,
    data: {
      marked: true,
      expanded: true,
      opened: false,
      depth: 0,
      count: 1,
      limited: false,
      children: [
        {
          marked: true,
          expanded: true,
          opened: false,
          depth: 1,
          count: 5,
          limited: true,
          children: [],
          id: 1,
          parentID: 0,
          title: 'Limited Node'
        }
      ],
      id: 0,
      parentID: null,
      title: ''
    }
  };
  mockFetchResponse(dataWithLimitedNode);
  // listUrlPattern is null (not provided)
  const { result } = renderHook(() => useComplexTreeViewApi('tree-1', 0, '/admin/pages/tree/jsonview'));
  await waitFor(() => {
    expect(result.current.dataProvider).not.toBeNull();
  });
  const syntheticChild = result.current.dataProvider.data.items['-1'];
  expect(syntheticChild.data.isLimitedIndicator).toBe(true);
  expect(syntheticChild.data.linkUrl).toBeNull();
});

test('useComplexTreeViewApi sets linkUrl when listUrlPattern is provided', async () => {
  const dataWithLimitedNode = {
    currentRecordID: null,
    data: {
      marked: true,
      expanded: true,
      opened: false,
      depth: 0,
      count: 1,
      limited: false,
      children: [
        {
          marked: true,
          expanded: true,
          opened: false,
          depth: 1,
          count: 5,
          limited: true,
          children: [],
          id: 1,
          parentID: 0,
          title: 'Limited Node'
        }
      ],
      id: 0,
      parentID: null,
      title: ''
    }
  };
  mockFetchResponse(dataWithLimitedNode);
  const listUrlPattern = '/admin/pages?ParentID=%s';
  const { result } = renderHook(() => useComplexTreeViewApi('tree-1', 0, '/admin/pages/tree/jsonview', listUrlPattern));
  await waitFor(() => {
    expect(result.current.dataProvider).not.toBeNull();
  });
  const syntheticChild = result.current.dataProvider.data.items['-1'];
  expect(syntheticChild.data.isLimitedIndicator).toBe(true);
  expect(syntheticChild.data.linkUrl).toBe('/admin/pages?ParentID=1');
});
