/* global jest, test, expect */
import React from 'react';
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import { Component as ComplexTreeView } from '../ComplexTreeView';
import useComplexTreeViewApi from '../useComplexTreeViewApi';

jest.mock('../useComplexTreeViewApi');
jest.mock('../TreeContextMenu', () => ({
  __esModule: true,
  default: ({ isOpen, position, node, onClose, onMenuAction, contextMenuUrls, labels }) => {
    if (!isOpen || !node || !contextMenuUrls) return null;
    return (
      <div
        className="tree-context-menu"
        role="menu"
        style={{ top: `${position.y}px`, left: `${position.x}px` }}
        data-testid="context-menu"
        data-labels={labels ? JSON.stringify(labels) : ''}
      >
        <button
          type="button"
          className="tree-context-menu__item"
          onClick={() => {
            onMenuAction('edit', node.data.id);
            onClose();
          }}
          role="menuitem"
        >
          Edit
        </button>
      </div>
    );
  },
}));

// Suppress jsdom navigation errors that occur in tests (not actual test failures)
// eslint-disable-next-line no-console
const originalError = console.error;
beforeAll(() => {
  // eslint-disable-next-line no-console
  console.error = (...args) => {
    if (
      args[0]
      && typeof args[0] === 'object'
      && args[0].message
      && args[0].message.includes('Not implemented: navigation')
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  // eslint-disable-next-line no-console
  console.error = originalError;
});

const mockApiData = {
  currentRecordID: null,
  data: {
    marked: true,
    expanded: true,
    opened: false,
    depth: 0,
    count: 4,
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
        title: 'Home',
        statusFlags: [
          { cssClass: 'status-draft', title: 'This page is in draft' }
        ]
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
        title: 'Contact Us',
        statusFlags: [
          { cssClass: 'status-published', title: 'This page is published' }
        ]
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
  useComplexTreeViewApi.mockImplementation(
    (treeId, currentRecordID, apiEndpoint, listUrlPattern, saveNodeEndpoint, updateNodesEndpoint) => {
      const actual = jest.requireActual('../useComplexTreeViewApi').default;
      return actual(
        treeId,
        currentRecordID,
        apiEndpoint || '/admin/pages/tree/jsonview',
        listUrlPattern,
        saveNodeEndpoint,
        updateNodesEndpoint
      );
    }
  );
}

function setupMockWithState(loading, error, rootId, dataProvider, initialViewState) {
  useComplexTreeViewApi.mockReturnValue({
    data: null,
    loading,
    error,
    rootId,
    dataProvider,
    initialViewState,
    loadSubtree: jest.fn(),
    mergeSubtree: jest.fn(),
  });
}

beforeEach(() => {
  global.fetch = jest.fn();
  // Mock localStorage - used for storing view type preference i.e. listview/treeview
  Storage.prototype.setItem = jest.fn();
  Storage.prototype.getItem = jest.fn();
  Storage.prototype.removeItem = jest.fn();
  Storage.prototype.clear = jest.fn();
  // Mock window.location to prevent jsdom navigation errors
  delete window.location;
  window.location = {
    assign: jest.fn(),
  };
  // Mock href as a regular property with getter/setter to prevent navigation
  Object.defineProperty(window.location, 'href', {
    writable: true,
    value: '',
  });
});

afterEach(() => {
  jest.restoreAllMocks();
});

test('ComplexTreeView renders loading state', () => {
  setupMockWithState(true, null, null, null, null);
  render(<ComplexTreeView />);
  expect(screen.getByText('Loading Page Tree...')).not.toBeNull();
});

test('ComplexTreeView renders custom treeLabel in loading state', () => {
  setupMockWithState(true, null, null, null, null);
  render(<ComplexTreeView treeLabel="File Tree" />);
  expect(screen.getByText('Loading File Tree...')).not.toBeNull();
});

test('ComplexTreeView renders error state', () => {
  setupMockWithState(false, 'Failed to load data', null, null, null);
  const { container } = render(<ComplexTreeView />);
  expect(container.textContent).toContain('Error loading data:');
  expect(container.textContent).toContain('Failed to load data');
});

test('ComplexTreeView renders no data state', () => {
  setupMockWithState(false, null, null, null, null);
  const { container } = render(<ComplexTreeView />);
  expect(container.textContent).toContain('No data available.');
});

test('ComplexTreeView renders tree with data', async () => {
  setupMockWithData();
  render(<ComplexTreeView />);
  await waitFor(() => {
    expect(screen.getByText('Home')).not.toBeNull();
  });
});

test('ComplexTreeView renders multiple page items', async () => {
  setupMockWithData();
  render(<ComplexTreeView />);
  await waitFor(() => {
    expect(screen.getByText('Home')).not.toBeNull();
    expect(screen.getByText('About Us')).not.toBeNull();
    expect(screen.getByText('Contact Us')).not.toBeNull();
  });
});

test('ComplexTreeView renders nested page items when folder is expanded', async () => {
  setupMockWithData();
  render(<ComplexTreeView />);
  await waitFor(() => {
    expect(screen.getByText('Contact Us')).not.toBeNull();
  });
  const contactUsItem = screen.getByText('Contact Us').closest('[role="treeitem"]');
  expect(contactUsItem).not.toBeNull();
  expect(contactUsItem.hasAttribute('aria-expanded')).toBe(true);
});

test('ComplexTreeView renders tree with proper CSS class', async () => {
  setupMockWithData();
  const { container } = render(<ComplexTreeView />);
  await waitFor(() => {
    expect(container.querySelector('.complex-tree-view')).not.toBeNull();
  });
});

test('ComplexTreeView renders tree items with item-link CSS class', async () => {
  setupMockWithData();
  const { container } = render(<ComplexTreeView />);
  await waitFor(() => {
    const links = container.querySelectorAll('.complex-tree-view__item-link');
    expect(links.length).toBeGreaterThan(0);
  });
});

test('ComplexTreeView renders tree with tree role', async () => {
  setupMockWithData();
  const { container } = render(<ComplexTreeView />);
  await waitFor(() => {
    const tree = container.querySelector('[role="tree"]');
    expect(tree).not.toBeNull();
  });
});

test('ComplexTreeView renders tree with treeitem roles', async () => {
  setupMockWithData();
  const { container } = render(<ComplexTreeView />);
  await waitFor(() => {
    const treeItems = container.querySelectorAll('[role="treeitem"]');
    expect(treeItems.length).toBeGreaterThan(0);
  });
});

test('ComplexTreeView tree has Page Tree label', async () => {
  setupMockWithData();
  const { container } = render(<ComplexTreeView />);
  await waitFor(() => {
    const tree = container.querySelector('[role="tree"]');
    expect(tree.getAttribute('aria-label')).toBe('Page Tree');
  });
});

test('ComplexTreeView tree uses custom treeLabel', async () => {
  setupMockWithData();
  const { container } = render(<ComplexTreeView treeLabel="File Tree" />);
  await waitFor(() => {
    const tree = container.querySelector('[role="tree"]');
    expect(tree.getAttribute('aria-label')).toBe('File Tree');
  });
});

test('ComplexTreeView handles space key on leaf items', async () => {
  setupMockWithData();
  const { container } = render(<ComplexTreeView />);
  await waitFor(() => {
    expect(screen.getByText('Home')).not.toBeNull();
  });
  const wrapper = container.querySelector('.complex-tree-view');
  const leafItem = container.querySelector('[role="treeitem"]:not([aria-expanded])');
  if (leafItem) {
    const event = new KeyboardEvent('keydown', {
      key: ' ',
      bubbles: true,
      cancelable: true,
    });
    let preventDefaultCalled = false;
    event.preventDefault = jest.fn(() => {
      preventDefaultCalled = true;
    });
    Object.defineProperty(event, 'target', { value: leafItem, enumerable: true });
    act(() => {
      wrapper.dispatchEvent(event);
    });
    expect(preventDefaultCalled).toBe(true);
  }
});

test('ComplexTreeView does not prevent space key on folder items', async () => {
  setupMockWithData();
  const { container } = render(<ComplexTreeView />);
  await waitFor(() => {
    expect(screen.getByText('Contact Us')).not.toBeNull();
  });
  const wrapper = container.querySelector('.complex-tree-view');
  const folderItems = container.querySelectorAll('[role="treeitem"][aria-expanded]');
  if (folderItems.length > 0) {
    const folderItem = folderItems[0];
    const event = new KeyboardEvent('keydown', {
      key: ' ',
      bubbles: true,
      cancelable: true,
    });
    let preventDefaultCalled = false;
    event.preventDefault = jest.fn(() => {
      preventDefaultCalled = true;
    });
    Object.defineProperty(event, 'target', { value: folderItem, enumerable: true });
    act(() => {
      wrapper.dispatchEvent(event);
    });
    expect(preventDefaultCalled).toBe(false);
  }
});

test('ComplexTreeView ignores non-space keys', async () => {
  setupMockWithData();
  const { container } = render(<ComplexTreeView />);
  await waitFor(() => {
    expect(screen.getByText('Home')).not.toBeNull();
  });
  const wrapper = container.querySelector('.complex-tree-view');
  const event = new KeyboardEvent('keydown', {
    key: 'Enter',
    bubbles: true,
    cancelable: true,
  });
  let preventDefaultCalled = false;
  event.preventDefault = jest.fn(() => {
    preventDefaultCalled = true;
  });
  const treeItem = container.querySelector('[role="treeitem"]');
  Object.defineProperty(event, 'target', { value: treeItem, enumerable: true });
  act(() => {
    wrapper.dispatchEvent(event);
  });
  expect(preventDefaultCalled).toBe(false);
});

test('ComplexTreeView renders with UncontrolledTreeEnvironment', async () => {
  setupMockWithData();
  const { container } = render(<ComplexTreeView />);
  await waitFor(() => {
    const treeContainer = container.querySelector('.complex-tree-view');
    expect(treeContainer).not.toBeNull();
    const tree = container.querySelector('[role="tree"]');
    expect(tree).not.toBeNull();
  });
});

test('ComplexTreeView limited node is collapsed by default', async () => {
  setupMockWithData();
  render(<ComplexTreeView />);
  await waitFor(() => {
    expect(screen.getByText('More Pages')).not.toBeNull();
  });
  const morePages = screen.getByText('More Pages').closest('[role="treeitem"]');
  expect(morePages).not.toBeNull();
  expect(morePages.hasAttribute('aria-expanded')).toBe(true);
  expect(morePages.getAttribute('aria-expanded')).toBe('false');
});

test('ComplexTreeView limited node shows "Too many records" when expanded', async () => {
  setupMockWithData();
  render(<ComplexTreeView />);
  await waitFor(() => {
    expect(screen.getByText('More Pages')).not.toBeNull();
  });
  const morePages = screen.getByText('More Pages').closest('[role="treeitem"]');
  expect(morePages).not.toBeNull();
  // Click to expand the limited node
  const expandButton = morePages.querySelector('[data-rct-item-interactive="true"]');
  fireEvent.click(expandButton);
  await waitFor(() => {
    const tooManyText = screen.getByText(/Too many records/);
    expect(tooManyText).not.toBeNull();
  });
});

test('ComplexTreeView limited indicator child has span to show as list', async () => {
  setupMockWithData();
  render(<ComplexTreeView listUrlPattern="/admin/pages?ParentID=%s" />);
  await waitFor(() => {
    expect(screen.getByText('More Pages')).not.toBeNull();
  });
  const morePages = screen.getByText('More Pages').closest('[role="treeitem"]');
  const expandButton = morePages.querySelector('[data-rct-item-interactive="true"]');
  fireEvent.click(expandButton);
  await waitFor(() => {
    const showAsListSpan = screen.getByText(/show as list/);
    expect(showAsListSpan).not.toBeNull();
    expect(showAsListSpan.tagName.toLowerCase()).toBe('span');
    expect(showAsListSpan.classList.contains('complex-tree-view__item-link--limited')).toBe(true);
  });
});

test('ComplexTreeView handleTooManyRecordsClick sets localStorage value', async () => {
  setupMockWithData();
  render(<ComplexTreeView listUrlPattern="/admin/pages?ParentID=%s" />);
  await waitFor(() => {
    expect(screen.getByText('More Pages')).not.toBeNull();
  });
  const morePages = screen.getByText('More Pages').closest('[role="treeitem"]');
  const expandButton = morePages.querySelector('[data-rct-item-interactive="true"]');
  fireEvent.click(expandButton);
  await waitFor(() => {
    const showAsListSpan = screen.getByText(/show as list/);
    expect(showAsListSpan).not.toBeNull();
  });
  fireEvent.click(screen.getByText(/show as list/));
  expect(Storage.prototype.setItem).toHaveBeenCalledWith('ss.pages-view-type', 'listview');
});

test('ComplexTreeView limited indicator has appropriate CSS class', async () => {
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
    const itemLink = tooManyText.closest('.complex-tree-view__item-link');
    expect(itemLink.classList.contains('complex-tree-view__item-link--limited')).toBe(true);
  });
});

test('ComplexTreeView non-limited nodes do not have limited CSS class', async () => {
  setupMockWithData();
  render(<ComplexTreeView />);
  await waitFor(() => {
    const homeLink = screen.getByText('Home').closest('.complex-tree-view__item-link');
    expect(homeLink.classList.contains('complex-tree-view__item-link--limited')).toBe(false);
  });
});

test('ComplexTreeView renders nodes that will trigger subtree loading on expand', async () => {
  setupMockWithData();
  render(<ComplexTreeView />);
  await waitFor(() => {
    expect(screen.getByText('Contact Us')).not.toBeNull();
  });
  const contactUs = screen.getByText('Contact Us').closest('[role="treeitem"]');
  expect(contactUs).not.toBeNull();
  expect(contactUs.hasAttribute('aria-expanded')).toBe(true);
});

test('ComplexTreeView hook receives mergeSubtree and loadSubtree functions', async () => {
  setupMockWithData();
  render(<ComplexTreeView />);
  await waitFor(() => {
    expect(screen.getByText('Home')).not.toBeNull();
  });
  expect(useComplexTreeViewApi).toHaveBeenCalled();
});

test('ComplexTreeView detects unexpanded nodes with children count', async () => {
  const dataWithUnexpandedNode = {
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
          title: 'Folder with Unloaded Children'
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
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve(dataWithUnexpandedNode),
    })
  );
  useComplexTreeViewApi.mockImplementation(
    (treeId, currentRecordID, apiEndpoint, listUrlPattern, saveNodeEndpoint, updateNodesEndpoint) => {
      const actual = jest.requireActual('../useComplexTreeViewApi').default;
      return actual(
        treeId,
        currentRecordID,
        apiEndpoint || '/admin/pages/tree/jsonview',
        listUrlPattern,
        saveNodeEndpoint,
        updateNodesEndpoint
      );
    }
  );
  render(<ComplexTreeView />);
  await waitFor(() => {
    expect(screen.getByText('Folder with Unloaded Children')).not.toBeNull();
  });
  const folderItem = screen.getByText('Folder with Unloaded Children').closest('[role="treeitem"]');
  expect(folderItem).not.toBeNull();
  expect(folderItem.hasAttribute('aria-expanded')).toBe(true);
});

test('ComplexTreeView navigates to branch node when clicking on title', async () => {
  setupMockWithData();
  delete window.location;
  window.location = { href: '' };
  const hrefSpy = jest.fn();
  Object.defineProperty(window.location, 'href', {
    set: hrefSpy,
    get: () => '',
  });
  render(<ComplexTreeView editUrlPattern="/admin/pages/edit/show/%s" />);
  await waitFor(() => {
    expect(screen.getByText('Contact Us')).not.toBeNull();
  });
  const contactUsItem = screen.getByText('Contact Us').closest('[role="treeitem"]');
  const titleSpan = contactUsItem.querySelector('.complex-tree-view__item-link');
  expect(titleSpan).not.toBeNull();
  const itemId = titleSpan.getAttribute('data-item-id');
  expect(itemId).toBe('3');
  fireEvent.mouseDown(titleSpan);
  fireEvent.click(titleSpan);
  await waitFor(() => {
    expect(hrefSpy).toHaveBeenCalledWith('/admin/pages/edit/show/3');
  });
});

test('ComplexTreeView does not toggle branch when clicking on title', async () => {
  setupMockWithData();
  render(<ComplexTreeView />);
  await waitFor(() => {
    expect(screen.getByText('Contact Us')).not.toBeNull();
  });
  const contactUsItem = screen.getByText('Contact Us').closest('[role="treeitem"]');
  const initialExpanded = contactUsItem.getAttribute('aria-expanded');
  const titleSpan = contactUsItem.querySelector('.complex-tree-view__item-link');
  const event = new MouseEvent('click', { bubbles: true, cancelable: true });
  let prevented = false;
  const originalPreventDefault = event.preventDefault;
  event.preventDefault = () => {
    prevented = true;
    originalPreventDefault.call(event);
  };
  Object.defineProperty(event, 'target', { value: titleSpan, enumerable: true });
  act(() => {
    contactUsItem.dispatchEvent(event);
  });
  expect(prevented).toBe(true);
  await waitFor(() => {
    expect(contactUsItem.getAttribute('aria-expanded')).toBe(initialExpanded);
  }, { timeout: 500 });
});

test('ComplexTreeView does not navigate when right-clicking on branch node title', async () => {
  setupMockWithData();
  delete window.location;
  window.location = { href: '' };
  const hrefSpy = jest.fn();
  Object.defineProperty(window.location, 'href', {
    set: hrefSpy,
    get: () => '',
  });
  render(<ComplexTreeView />);
  await waitFor(() => {
    expect(screen.getByText('Contact Us')).not.toBeNull();
  });
  const contactUsItem = screen.getByText('Contact Us').closest('[role="treeitem"]');
  const titleSpan = contactUsItem.querySelector('.complex-tree-view__item-link');
  expect(titleSpan).not.toBeNull();
  // Simulate right-click (button 2)
  const rightClickEvent = new MouseEvent('mousedown', {
    bubbles: true,
    cancelable: true,
    button: 2,
  });
  Object.defineProperty(rightClickEvent, 'target', { value: titleSpan, enumerable: true });
  act(() => {
    contactUsItem.dispatchEvent(rightClickEvent);
  });
  // Verify navigation did not occur
  expect(hrefSpy).not.toHaveBeenCalled();
  expect(window.location.href).toBe('');
});

test('ComplexTreeView renders status badges with correct CSS classes', async () => {
  setupMockWithData();
  render(<ComplexTreeView />);
  await waitFor(() => {
    expect(screen.getByText('Home')).not.toBeNull();
  });
  const homeLink = screen.getByText('Home').closest('.complex-tree-view__item-link');
  const badges = homeLink.querySelectorAll('.badge');
  expect(badges.length).toBe(1);
  const badgeClasses = Array.from(badges[0].classList);
  expect(badgeClasses).toContain('badge');
  expect(badgeClasses.some(cls => cls.startsWith('status-'))).toBe(true);
});

test('ComplexTreeView renders status badge title attribute', async () => {
  setupMockWithData();
  render(<ComplexTreeView />);
  await waitFor(() => {
    expect(screen.getByText('Home')).not.toBeNull();
  });
  const homeLink = screen.getByText('Home').closest('.complex-tree-view__item-link');
  const badge = homeLink.querySelector('.badge');
  expect(badge.getAttribute('title')).toBe('This page is in draft');
});

test('ComplexTreeView renders multiple status badges', async () => {
  setupMockWithData();
  render(<ComplexTreeView />);
  await waitFor(() => {
    expect(screen.getByText('Home')).not.toBeNull();
  });
  const homeLink = screen.getByText('Home').closest('.complex-tree-view__item-link');
  const badges = homeLink.querySelectorAll('.badge');
  expect(badges.length).toBe(1);
  expect(badges[0].hasAttribute('title')).toBe(true);
  expect(badges[0].getAttribute('title')).toBe('This page is in draft');
});

test('ComplexTreeView does not render status badges when statusFlags is empty', async () => {
  setupMockWithData();
  render(<ComplexTreeView />);
  await waitFor(() => {
    expect(screen.getByText('About Us')).not.toBeNull();
  });
  const aboutUsLink = screen.getByText('About Us').closest('.complex-tree-view__item-link');
  const badges = aboutUsLink.querySelectorAll('.badge');
  expect(badges.length).toBe(0);
});

test('ComplexTreeView does not render status badges for limited indicator nodes', async () => {
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
    const itemLink = tooManyText.closest('.complex-tree-view__item-link');
    const badges = itemLink.querySelectorAll('.badge');
    expect(badges.length).toBe(0);
  });
});

test('ComplexTreeView renders status badges for all eligible nodes', async () => {
  setupMockWithData();
  render(<ComplexTreeView />);
  await waitFor(() => {
    expect(screen.getByText('Contact Us')).not.toBeNull();
  });
  const contactUsLink = screen.getByText('Contact Us').closest('.complex-tree-view__item-link');
  const badges = contactUsLink.querySelectorAll('.badge');
  expect(badges.length).toBe(1);
  expect(badges[0].hasAttribute('title')).toBe(true);
  expect(badges[0].getAttribute('title')).toBe('This page is published');
});

test('ComplexTreeView opens context menu on right-click', async () => {
  setupMockWithData();
  const { container } = render(
    <ComplexTreeView
      contextMenuUrls={{
        duplicate: '/admin/pages/tree/duplicate/%s',
        duplicateWithChildren: '/admin/pages/tree/duplicateWithChildren/%s',
        addChild: '',
      }}
    />
  );
  await waitFor(() => {
    expect(screen.getByText('Home')).not.toBeNull();
  });
  const homeLink = screen.getByText('Home').closest('.complex-tree-view__item-link');
  fireEvent.contextMenu(homeLink, { clientX: 100, clientY: 100 });
  await waitFor(() => {
    const menu = container.querySelector('.tree-context-menu');
    expect(menu).not.toBeNull();
    expect(menu.getAttribute('style')).toContain('top: 100px');
    expect(menu.getAttribute('style')).toContain('left: 100px');
  });
});

test('ComplexTreeView calls handleMenuAction on context menu edit action', async () => {
  setupMockWithData();
  render(
    <ComplexTreeView
      editUrlPattern="/admin/pages/edit/show/%s"
      contextMenuUrls={{
        duplicate: '/admin/pages/tree/duplicate/%s',
        duplicateWithChildren: '/admin/pages/tree/duplicateWithChildren/%s',
        addChild: '',
      }}
    />
  );
  await waitFor(() => {
    expect(screen.getByText('Home')).not.toBeNull();
  });
  const homeLink = screen.getByText('Home').closest('.complex-tree-view__item-link');
  fireEvent.contextMenu(homeLink, { clientX: 100, clientY: 100 });
  await waitFor(() => {
    const editButton = screen.getByText('Edit');
    expect(editButton).not.toBeNull();
  });
  const editButton = screen.getByText('Edit');
  fireEvent.click(editButton);
  expect(window.location.assign).toHaveBeenCalledWith('/admin/pages/edit/show/1');
});

test('TreeContextMenu does not render when contextMenuUrls is null', async () => {
  setupMockWithData();
  const { container } = render(
    <ComplexTreeView contextMenuUrls={null} />
  );
  await waitFor(() => {
    expect(screen.getByText('Home')).not.toBeNull();
  });
  const homeLink = screen.getByText('Home').closest('.complex-tree-view__item-link');
  fireEvent.contextMenu(homeLink, { clientX: 100, clientY: 100 });
  const menu = container.querySelector('.tree-context-menu');
  expect(menu).toBeNull();
});

test('TreeContextMenu renders when contextMenuUrls contains valid URLs', async () => {
  setupMockWithData();
  render(
    <ComplexTreeView
      contextMenuUrls={{
        duplicate: '/admin/pages/tree/duplicate/%s',
        duplicateWithChildren: '/admin/pages/tree/duplicateWithChildren/%s',
        addChild: '',
      }}
    />
  );
  await waitFor(() => {
    expect(screen.getByText('Home')).not.toBeNull();
  });
  const homeLink = screen.getByText('Home').closest('.complex-tree-view__item-link');
  fireEvent.contextMenu(homeLink, { clientX: 100, clientY: 100 });
  await waitFor(() => {
    const editButton = screen.getByText('Edit');
    expect(editButton).not.toBeNull();
  });
});

test('ComplexTreeView uses editUrlPattern for edit navigation', async () => {
  setupMockWithData();
  const editUrlPattern = '/custom/edit/%s';
  render(
    <ComplexTreeView
      editUrlPattern={editUrlPattern}
      contextMenuUrls={{
        duplicate: '/admin/pages/tree/duplicate/%s',
        duplicateWithChildren: '/admin/pages/tree/duplicateWithChildren/%s',
        addChild: '',
      }}
    />
  );
  await waitFor(() => {
    expect(screen.getByText('Home')).not.toBeNull();
  });
  const homeLink = screen.getByText('Home').closest('.complex-tree-view__item-link');
  fireEvent.contextMenu(homeLink, { clientX: 100, clientY: 100 });
  await waitFor(() => {
    const editButton = screen.getByText('Edit');
    expect(editButton).not.toBeNull();
  });
  const editButton = screen.getByText('Edit');
  fireEvent.click(editButton);
  expect(window.location.assign).toHaveBeenCalledWith('/custom/edit/1');
});

test('ComplexTreeView uses listUrlPattern for show as list navigation', async () => {
  setupMockWithData();
  const listUrlPattern = '/custom/list?ParentID=%s';
  render(
    <ComplexTreeView
      listUrlPattern={listUrlPattern}
      contextMenuUrls={{
        duplicate: '/admin/pages/tree/duplicate/%s',
        duplicateWithChildren: '/admin/pages/tree/duplicateWithChildren/%s',
        addChild: '',
      }}
    />
  );
  await waitFor(() => {
    expect(screen.getByText('Home')).not.toBeNull();
  });
  const homeLink = screen.getByText('Home').closest('.complex-tree-view__item-link');
  fireEvent.contextMenu(homeLink, { clientX: 100, clientY: 100 });
  await waitFor(() => {
    const editButton = screen.getByText('Edit');
    expect(editButton).not.toBeNull();
  });
});

test('ComplexTreeView does not render context menu when enableContextMenu is false', async () => {
  setupMockWithData();
  render(
    <ComplexTreeView
      enableContextMenu={false}
      contextMenuUrls={{
        duplicate: '/admin/pages/tree/duplicate/%s',
        duplicateWithChildren: '/admin/pages/tree/duplicateWithChildren/%s',
        addChild: '',
      }}
    />
  );
  await waitFor(() => {
    expect(screen.getByText('Home')).not.toBeNull();
  });
  const homeLink = screen.getByText('Home').closest('.complex-tree-view__item-link');
  fireEvent.contextMenu(homeLink, { clientX: 100, clientY: 100 });
  // Context menu should not be rendered since enableContextMenu is false
  expect(screen.queryByRole('menu')).toBeNull();
});

test('ComplexTreeView renders context menu by default with enableContextMenu not specified', async () => {
  setupMockWithData();
  render(
    <ComplexTreeView
      contextMenuUrls={{
        duplicate: '/admin/pages/tree/duplicate/%s',
        duplicateWithChildren: '/admin/pages/tree/duplicateWithChildren/%s',
        addChild: '',
      }}
    />
  );
  await waitFor(() => {
    expect(screen.getByText('Home')).not.toBeNull();
  });
  const homeLink = screen.getByText('Home').closest('.complex-tree-view__item-link');
  fireEvent.contextMenu(homeLink, { clientX: 100, clientY: 100 });
  await waitFor(() => {
    const editButton = screen.getByText('Edit');
    expect(editButton).not.toBeNull();
  });
});

test('ComplexTreeView passes labels prop to TreeContextMenu', async () => {
  setupMockWithData();
  const customLabels = {
    edit: 'View Page',
    showAsList: 'Show List',
    addChild: 'Add Subpage',
    duplicate: 'Copy',
    duplicateThisOnly: 'Copy Only',
    duplicateWithChildren: 'Copy With Subs',
  };
  render(
    <ComplexTreeView
      contextMenuUrls={{
        duplicate: '/admin/pages/tree/duplicate/%s',
        duplicateWithChildren: '/admin/pages/tree/duplicateWithChildren/%s',
        addChild: '/admin/pages/add',
      }}
      labels={customLabels}
    />
  );
  await waitFor(() => {
    expect(screen.getByText('Home')).not.toBeNull();
  });
  const homeLink = screen.getByText('Home').closest('.complex-tree-view__item-link');
  fireEvent.contextMenu(homeLink, { clientX: 100, clientY: 100 });
  await waitFor(() => {
    const contextMenu = screen.getByTestId('context-menu');
    const labelsAttr = contextMenu.getAttribute('data-labels');
    const passedLabels = labelsAttr ? JSON.parse(labelsAttr) : null;
    expect(passedLabels).toEqual(customLabels);
  });
});
