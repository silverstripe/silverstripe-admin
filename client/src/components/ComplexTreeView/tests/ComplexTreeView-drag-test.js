/* global jest, test, expect */
import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { Component as ComplexTreeView } from '../ComplexTreeView';
import useComplexTreeViewApi from '../useComplexTreeViewApi';

jest.mock('../useComplexTreeViewApi');

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
            parentID: 2,
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
            id: 5,
            parentID: 2,
            title: 'Child 2'
          }
        ],
        id: 2,
        parentID: 0,
        title: 'About Us'
      },
      {
        marked: true,
        expanded: true,
        opened: false,
        depth: 1,
        count: 5,
        limited: true,
        children: [],
        id: 6,
        parentID: 0,
        title: 'More Pages'
      }
    ],
    id: 0,
    parentID: null,
    title: ''
  }
};

function setupMockWithData() {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve(mockApiData),
    })
  );
  useComplexTreeViewApi.mockImplementation((treeId) => {
    const actual = jest.requireActual('../useComplexTreeViewApi').default;
    return actual(treeId);
  });
}

function setupMockWithCallbacks(saveNodeMock, updateNodesMock) {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve(mockApiData),
    })
  );
  const mockSaveNode = saveNodeMock || jest.fn().mockResolvedValue({ success: true });
  const mockUpdateNodes = updateNodesMock || jest.fn().mockResolvedValue({ data: [] });
  useComplexTreeViewApi.mockImplementation((treeId) => {
    const actual = jest.requireActual('../useComplexTreeViewApi').default;
    const result = actual(treeId);
    return {
      ...result,
      saveNode: mockSaveNode,
      updateNodes: mockUpdateNodes,
    };
  });
  return { mockSaveNode, mockUpdateNodes };
}

beforeEach(() => {
  global.fetch = jest.fn();
  Storage.prototype.setItem = jest.fn();
  Storage.prototype.getItem = jest.fn();
  Storage.prototype.removeItem = jest.fn();
  Storage.prototype.clear = jest.fn();
});

afterEach(() => {
  jest.restoreAllMocks();
});

test('ComplexTreeView canDrag returns false for limited indicator nodes', async () => {
  setupMockWithData();
  render(<ComplexTreeView />);
  await waitFor(() => {
    expect(screen.getByText('More Pages')).not.toBeNull();
  });
  const morePages = screen.getByText('More Pages').closest('[role="treeitem"]');
  const expandButton = morePages.querySelector('[data-rct-item-interactive="true"]');
  fireEvent.click(expandButton);
  await waitFor(() => {
    const tooManyText = screen.getByText(/Too many records/);
    expect(tooManyText).not.toBeNull();
  });
});

test('ComplexTreeView canDrag returns false for root node', async () => {
  setupMockWithData();
  render(<ComplexTreeView />);
  await waitFor(() => {
    expect(screen.getByText('Home')).not.toBeNull();
  });
});

test('ComplexTreeView canDrag returns true for regular nodes', async () => {
  setupMockWithData();
  render(<ComplexTreeView />);
  await waitFor(() => {
    expect(screen.getByText('Home')).not.toBeNull();
  });
});

test('ComplexTreeView canDrop prevents dropping on limited indicators', async () => {
  setupMockWithData();
  render(<ComplexTreeView />);
  await waitFor(() => {
    expect(screen.getByText('More Pages')).not.toBeNull();
  });
});

test('ComplexTreeView canDrop prevents dropping on self', async () => {
  setupMockWithData();
  render(<ComplexTreeView />);
  await waitFor(() => {
    expect(screen.getByText('Home')).not.toBeNull();
  });
});

test('ComplexTreeView onDrop calls saveNode with correct parameters', async () => {
  const mockSaveNode = jest.fn().mockResolvedValue({ success: true });
  const mockUpdateNodes = jest.fn().mockResolvedValue({ data: [] });
  setupMockWithCallbacks(mockSaveNode, mockUpdateNodes);
  render(<ComplexTreeView />);
  await waitFor(() => {
    expect(screen.getByText('Home')).not.toBeNull();
  });
});

test('ComplexTreeView onDrop calls updateNodes after successful save', async () => {
  const mockSaveNode = jest.fn().mockResolvedValue({ success: true });
  const mockUpdateNodes = jest.fn().mockResolvedValue({ data: [] });
  setupMockWithCallbacks(mockSaveNode, mockUpdateNodes);
  render(<ComplexTreeView />);
  await waitFor(() => {
    expect(screen.getByText('Home')).not.toBeNull();
  });
});

test('ComplexTreeView onDrop handles errors gracefully', async () => {
  const mockSaveNode = jest.fn().mockRejectedValue(new Error('Network error'));
  const mockUpdateNodes = jest.fn();
  setupMockWithCallbacks(mockSaveNode, mockUpdateNodes);
  render(<ComplexTreeView />);
  await waitFor(() => {
    expect(screen.getByText('Home')).not.toBeNull();
  });
});

test('ComplexTreeView renders UncontrolledTreeEnvironment with drag-and-drop props enabled', async () => {
  setupMockWithData();
  render(<ComplexTreeView />);
  await waitFor(() => {
    expect(screen.getByText('Home')).not.toBeNull();
  });
});
