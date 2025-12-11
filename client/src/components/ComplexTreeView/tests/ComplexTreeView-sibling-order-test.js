/* global jest, test, expect */

beforeEach(() => {
  Storage.prototype.setItem = jest.fn();
  Storage.prototype.getItem = jest.fn();
  Storage.prototype.removeItem = jest.fn();
  Storage.prototype.clear = jest.fn();
});

afterEach(() => {
  jest.restoreAllMocks();
});

test('handleDrop sends siblingIds in post-drop order when moving Child 1 to end', async () => {
  const mockSaveNode = jest.fn().mockResolvedValue({ success: true });
  const mockUpdateNodes = jest.fn().mockResolvedValue({ data: [] });
  const mockData = {
    items: {
      0: {
        data: { id: 0, parentID: null },
        children: ['1']
      },
      1: {
        data: { id: 1, parentID: 0 },
        children: ['3', '4', '2']
      },
      2: {
        data: { id: 2, parentID: 1, title: 'Child 1' },
        children: []
      },
      3: {
        data: { id: 3, parentID: 1, title: 'Child 2' },
        children: []
      },
      4: {
        data: { id: 4, parentID: 1, title: 'Child 3' },
        children: []
      }
    }
  };
  const handleDrop = async (items, target) => {
    if (!items || items.length === 0 || !target || !mockData) {
      return;
    }
    const draggedItem = items[0];
    const draggedId = draggedItem.data.id;
    let parentId = null;
    let parentItemData = null;
    if (target.targetType === 'on-item') {
      parentItemData = target.targetItem;
      parentId = parentItemData.data.id;
    } else if (target.targetType === 'between-items') {
      const parentItemId = target.parentItem;
      parentItemData = mockData.items[parentItemId];
      if (!parentItemData) {
        return;
      }
      parentId = parentItemData.data.id;
    }
    if (parentId === null || !parentItemData) {
      return;
    }
    const parentItem = mockData.items[parentId.toString()];
    if (!parentItem || !parentItem.children) {
      return;
    }
    const siblingIds = parentItem.children
      .map(childId => mockData.items[childId])
      .filter(child => child && child.data && child.data.isLimitedIndicator !== true)
      .map(child => child.data.id);
    await mockSaveNode(draggedId, parentId, siblingIds);
    await mockUpdateNodes([draggedId]);
  };
  await handleDrop(
    [{ data: { id: 2, parentID: 1 } }],
    { targetType: 'between-items', parentItem: '1', index: 2 }
  );
  expect(mockSaveNode).toHaveBeenCalledWith(2, 1, [3, 4, 2]);
  expect(mockUpdateNodes).toHaveBeenCalledWith([2]);
});

test('handleDrop sends siblingIds in post-drop order when moving Child 2 to first position', async () => {
  const mockSaveNode = jest.fn().mockResolvedValue({ success: true });
  const mockUpdateNodes = jest.fn().mockResolvedValue({ data: [] });
  const mockData = {
    items: {
      0: {
        data: { id: 0, parentID: null },
        children: ['1']
      },
      1: {
        data: { id: 1, parentID: 0 },
        children: ['3', '2', '4']
      },
      2: {
        data: { id: 2, parentID: 1, title: 'Child 1' },
        children: []
      },
      3: {
        data: { id: 3, parentID: 1, title: 'Child 2' },
        children: []
      },
      4: {
        data: { id: 4, parentID: 1, title: 'Child 3' },
        children: []
      }
    }
  };
  const handleDrop = async (items, target) => {
    if (!items || items.length === 0 || !target || !mockData) {
      return;
    }
    const draggedItem = items[0];
    const draggedId = draggedItem.data.id;
    let parentId = null;
    let parentItemData = null;
    if (target.targetType === 'on-item') {
      parentItemData = target.targetItem;
      parentId = parentItemData.data.id;
    } else if (target.targetType === 'between-items') {
      const parentItemId = target.parentItem;
      parentItemData = mockData.items[parentItemId];
      if (!parentItemData) {
        return;
      }
      parentId = parentItemData.data.id;
    }
    if (parentId === null || !parentItemData) {
      return;
    }
    const parentItem = mockData.items[parentId.toString()];
    if (!parentItem || !parentItem.children) {
      return;
    }
    const siblingIds = parentItem.children
      .map(childId => mockData.items[childId])
      .filter(child => child && child.data && child.data.isLimitedIndicator !== true)
      .map(child => child.data.id);
    await mockSaveNode(draggedId, parentId, siblingIds);
    await mockUpdateNodes([draggedId]);
  };
  await handleDrop(
    [{ data: { id: 3, parentID: 1 } }],
    { targetType: 'between-items', parentItem: '1', index: 0 }
  );
  expect(mockSaveNode).toHaveBeenCalledWith(3, 1, [3, 2, 4]);
  expect(mockUpdateNodes).toHaveBeenCalledWith([3]);
});

test('handleDrop sends siblingIds in post-drop order when moving Child 3 to middle', async () => {
  const mockSaveNode = jest.fn().mockResolvedValue({ success: true });
  const mockUpdateNodes = jest.fn().mockResolvedValue({ data: [] });
  const mockData = {
    items: {
      0: {
        data: { id: 0, parentID: null },
        children: ['1']
      },
      1: {
        data: { id: 1, parentID: 0 },
        children: ['2', '4', '3']
      },
      2: {
        data: { id: 2, parentID: 1, title: 'Child 1' },
        children: []
      },
      3: {
        data: { id: 3, parentID: 1, title: 'Child 2' },
        children: []
      },
      4: {
        data: { id: 4, parentID: 1, title: 'Child 3' },
        children: []
      }
    }
  };
  const handleDrop = async (items, target) => {
    if (!items || items.length === 0 || !target || !mockData) {
      return;
    }
    const draggedItem = items[0];
    const draggedId = draggedItem.data.id;
    let parentId = null;
    let parentItemData = null;
    if (target.targetType === 'on-item') {
      parentItemData = target.targetItem;
      parentId = parentItemData.data.id;
    } else if (target.targetType === 'between-items') {
      const parentItemId = target.parentItem;
      parentItemData = mockData.items[parentItemId];
      if (!parentItemData) {
        return;
      }
      parentId = parentItemData.data.id;
    }
    if (parentId === null || !parentItemData) {
      return;
    }
    const parentItem = mockData.items[parentId.toString()];
    if (!parentItem || !parentItem.children) {
      return;
    }
    const siblingIds = parentItem.children
      .map(childId => mockData.items[childId])
      .filter(child => child && child.data && child.data.isLimitedIndicator !== true)
      .map(child => child.data.id);
    await mockSaveNode(draggedId, parentId, siblingIds);
    await mockUpdateNodes([draggedId]);
  };
  await handleDrop(
    [{ data: { id: 4, parentID: 1 } }],
    { targetType: 'between-items', parentItem: '1', index: 1 }
  );
  expect(mockSaveNode).toHaveBeenCalledWith(4, 1, [2, 4, 3]);
  expect(mockUpdateNodes).toHaveBeenCalledWith([4]);
});

test('handleDrop filters out limited indicator nodes from siblingIds', async () => {
  const mockSaveNode = jest.fn().mockResolvedValue({ success: true });
  const mockUpdateNodes = jest.fn().mockResolvedValue({ data: [] });
  const mockData = {
    items: {
      0: {
        data: { id: 0, parentID: null },
        children: ['1']
      },
      1: {
        data: { id: 1, parentID: 0 },
        children: ['3', '2', '-1']
      },
      2: {
        data: { id: 2, parentID: 1, title: 'Child 1' },
        children: []
      },
      3: {
        data: { id: 3, parentID: 1, title: 'Child 2' },
        children: []
      },
      '-1': {
        data: { id: -1, isLimitedIndicator: true },
        children: []
      }
    }
  };
  const handleDrop = async (items, target) => {
    if (!items || items.length === 0 || !target || !mockData) {
      return;
    }
    const draggedItem = items[0];
    const draggedId = draggedItem.data.id;
    let parentId = null;
    let parentItemData = null;
    if (target.targetType === 'on-item') {
      parentItemData = target.targetItem;
      parentId = parentItemData.data.id;
    } else if (target.targetType === 'between-items') {
      const parentItemId = target.parentItem;
      parentItemData = mockData.items[parentItemId];
      if (!parentItemData) {
        return;
      }
      parentId = parentItemData.data.id;
    }
    if (parentId === null || !parentItemData) {
      return;
    }
    const parentItem = mockData.items[parentId.toString()];
    if (!parentItem || !parentItem.children) {
      return;
    }
    const siblingIds = parentItem.children
      .map(childId => mockData.items[childId])
      .filter(child => child && child.data && child.data.isLimitedIndicator !== true)
      .map(child => child.data.id);
    await mockSaveNode(draggedId, parentId, siblingIds);
    await mockUpdateNodes([draggedId]);
  };
  await handleDrop(
    [{ data: { id: 2, parentID: 1 } }],
    { targetType: 'between-items', parentItem: '1', index: 1 }
  );
  expect(mockSaveNode).toHaveBeenCalledWith(2, 1, [3, 2]);
  expect(mockUpdateNodes).toHaveBeenCalledWith([2]);
});
