/* global jest, test, expect, beforeEach, afterEach */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Component as TreeContextMenu } from '../TreeContextMenu';

jest.mock('i18n', () => ({
  _t: jest.fn((key, defaultText) => defaultText),
}));

const mockNode = {
  data: {
    id: 1,
    title: 'Test Page',
    contextMenuData: {
      canEdit: true,
      canCreate: true,
      canDelete: true,
      numChildren: 2,
      allowedChildren: [
        { ClassName: 'StandardPage', Title: 'StandardPage', IconClass: 'icon-page' },
        { ClassName: 'HomePage', Title: 'HomePage', IconClass: 'icon-home' },
        { ClassName: 'BlogPage', Title: 'BlogPage', IconClass: 'icon-blog' },
      ],
    },
  },
};

const mockNodeNoChildren = {
  data: {
    id: 2,
    title: 'Leaf Page',
    contextMenuData: {
      canEdit: true,
      canCreate: true,
      canDelete: true,
      numChildren: 0,
      allowedChildren: [
        { ClassName: 'StandardPage', Title: 'StandardPage', IconClass: 'icon-page' },
      ],
    },
  },
};

const mockNodeNoEdit = {
  data: {
    id: 3,
    title: 'Locked Page',
    contextMenuData: {
      canEdit: false,
      canCreate: false,
      canDelete: false,
      numChildren: 1,
      allowedChildren: [],
    },
  },
};

beforeEach(() => {
  jest.clearAllMocks();
});

afterEach(() => {
  jest.clearAllMocks();
});

test('TreeContextMenu renders with correct items based on node permissions', () => {
  const onClose = jest.fn();
  const onMenuAction = jest.fn();
  const contextMenuUrls = {
    duplicate: '/admin/pages/tree/duplicate/%s',
    duplicateWithChildren: '/admin/pages/tree/duplicateWithChildren/%s',
    addChild: '',
  };

  render(
    <TreeContextMenu
      isOpen
      position={{ x: 100, y: 100 }}
      node={mockNode}
      onClose={onClose}
      onMenuAction={onMenuAction}
      contextMenuUrls={contextMenuUrls}
    />
  );

  expect(screen.getByText('Edit')).not.toBeNull();
  expect(screen.getByText('Show children as list')).not.toBeNull();
  expect(screen.getByText('Add child')).not.toBeNull();
  expect(screen.getByText('Duplicate')).not.toBeNull();
});

test('TreeContextMenu shows "Add child" submenu with allowedChildren', () => {
  const onClose = jest.fn();
  const onMenuAction = jest.fn();
  const contextMenuUrls = {
    duplicate: '/admin/pages/tree/duplicate/%s',
    duplicateWithChildren: '/admin/pages/tree/duplicateWithChildren/%s',
    addChild: '',
  };

  render(
    <TreeContextMenu
      isOpen
      position={{ x: 100, y: 100 }}
      node={mockNode}
      onClose={onClose}
      onMenuAction={onMenuAction}
      contextMenuUrls={contextMenuUrls}
    />
  );

  const addPageItem = screen.getByText('Add child').closest('.tree-context-menu__item--submenu');
  fireEvent.mouseEnter(addPageItem);

  expect(screen.getByText('StandardPage')).not.toBeNull();
  expect(screen.getByText('HomePage')).not.toBeNull();
  expect(screen.getByText('BlogPage')).not.toBeNull();
});

test('TreeContextMenu shows "Duplicate" submenu with two options', () => {
  const onClose = jest.fn();
  const onMenuAction = jest.fn();
  const contextMenuUrls = {
    duplicate: '/admin/pages/tree/duplicate/%s',
    duplicateWithChildren: '/admin/pages/tree/duplicateWithChildren/%s',
    addChild: '',
  };

  render(
    <TreeContextMenu
      isOpen
      position={{ x: 100, y: 100 }}
      node={mockNode}
      onClose={onClose}
      onMenuAction={onMenuAction}
      contextMenuUrls={contextMenuUrls}
    />
  );

  const duplicateItem = screen.getByText('Duplicate').closest('.tree-context-menu__item--submenu');
  fireEvent.mouseEnter(duplicateItem);

  expect(screen.getByText('This record only')).not.toBeNull();
  expect(screen.getByText('This record and children')).not.toBeNull();
});

test('TreeContextMenu closes on outside click', () => {
  const onClose = jest.fn();
  const onMenuAction = jest.fn();

  const { container } = render(
    <div>
      <TreeContextMenu
        isOpen
        position={{ x: 100, y: 100 }}
        node={mockNode}
        onClose={onClose}
        onMenuAction={onMenuAction}
      />
      <div data-testid="outside">Outside</div>
    </div>
  );

  const outside = container.querySelector('[data-testid="outside"]');
  fireEvent.mouseDown(outside);

  expect(onClose).toHaveBeenCalled();
});

test('TreeContextMenu closes on Escape key', () => {
  const onClose = jest.fn();
  const onMenuAction = jest.fn();

  render(
    <TreeContextMenu
      isOpen
      position={{ x: 100, y: 100 }}
      node={mockNode}
      onClose={onClose}
      onMenuAction={onMenuAction}
    />
  );

  fireEvent.keyDown(document, { key: 'Escape' });

  expect(onClose).toHaveBeenCalled();
});

test('TreeContextMenu calls onMenuAction with correct action and node ID', () => {
  const onClose = jest.fn();
  const onMenuAction = jest.fn();

  render(
    <TreeContextMenu
      isOpen
      position={{ x: 100, y: 100 }}
      node={mockNode}
      onClose={onClose}
      onMenuAction={onMenuAction}
    />
  );

  const editButton = screen.getByText('Edit');
  fireEvent.click(editButton);

  expect(onMenuAction).toHaveBeenCalledWith('edit', 1);
  expect(onClose).toHaveBeenCalled();
});

test('TreeContextMenu does not show "Show children as list" for leaf nodes', () => {
  const onClose = jest.fn();
  const onMenuAction = jest.fn();

  render(
    <TreeContextMenu
      isOpen
      position={{ x: 100, y: 100 }}
      node={mockNodeNoChildren}
      onClose={onClose}
      onMenuAction={onMenuAction}
    />
  );

  expect(screen.queryByText('Show children as list')).toBeNull();
});

test('TreeContextMenu hides menu items for non-editable nodes', () => {
  const onClose = jest.fn();
  const onMenuAction = jest.fn();

  render(
    <TreeContextMenu
      isOpen
      position={{ x: 100, y: 100 }}
      node={mockNodeNoEdit}
      onClose={onClose}
      onMenuAction={onMenuAction}
    />
  );

  expect(screen.queryByText('Edit')).toBeNull();
  expect(screen.queryByText('Add child')).toBeNull();
  expect(screen.queryByText('Duplicate')).toBeNull();
  expect(screen.getByText('Show children as list')).not.toBeNull();
});

test('TreeContextMenu does not render when isOpen is false', () => {
  const onClose = jest.fn();
  const onMenuAction = jest.fn();

  const { container } = render(
    <TreeContextMenu
      isOpen={false}
      position={{ x: 100, y: 100 }}
      node={mockNode}
      onClose={onClose}
      onMenuAction={onMenuAction}
    />
  );

  const menu = container.querySelector('.tree-context-menu');
  expect(menu).toBeNull();
});

test('TreeContextMenu adjusts position when near viewport edges', () => {
  const onClose = jest.fn();
  const onMenuAction = jest.fn();

  const { container } = render(
    <TreeContextMenu
      isOpen
      position={{ x: window.innerWidth - 50, y: window.innerHeight - 50 }}
      node={mockNode}
      onClose={onClose}
      onMenuAction={onMenuAction}
    />
  );

  const menu = container.querySelector('.tree-context-menu');
  const x = parseInt(menu.style.left, 10);
  const y = parseInt(menu.style.top, 10);

  expect(x).toBeLessThanOrEqual(window.innerWidth - 50);
  expect(y).toBeLessThanOrEqual(window.innerHeight - 50);
});

test('TreeContextMenu calls onMenuAction for "Show children as list" action', () => {
  const onClose = jest.fn();
  const onMenuAction = jest.fn();

  render(
    <TreeContextMenu
      isOpen
      position={{ x: 100, y: 100 }}
      node={mockNode}
      onClose={onClose}
      onMenuAction={onMenuAction}
    />
  );

  const showAsListButton = screen.getByText('Show children as list');
  fireEvent.click(showAsListButton);

  expect(onMenuAction).toHaveBeenCalledWith('showAsList', 1);
  expect(onClose).toHaveBeenCalled();
});

test('TreeContextMenu calls onMenuAction for "Add page" action', () => {
  const onClose = jest.fn();
  const onMenuAction = jest.fn();
  const contextMenuUrls = {
    duplicate: '/admin/pages/tree/duplicate/%s',
    duplicateWithChildren: '/admin/pages/tree/duplicateWithChildren/%s',
    addChild: '',
  };

  render(
    <TreeContextMenu
      isOpen
      position={{ x: 100, y: 100 }}
      node={mockNode}
      onClose={onClose}
      onMenuAction={onMenuAction}
      contextMenuUrls={contextMenuUrls}
    />
  );

  const addPageItem = screen.getByText('Add child').closest('.tree-context-menu__item--submenu');
  fireEvent.mouseEnter(addPageItem);

  const standardPageButton = screen.getByText('StandardPage');
  fireEvent.click(standardPageButton);

  expect(onMenuAction).toHaveBeenCalledWith('addPage', 1, { childType: 'StandardPage' });
  expect(onClose).toHaveBeenCalled();
});

test('TreeContextMenu calls onMenuAction for "Duplicate" actions', () => {
  const onClose = jest.fn();
  const onMenuAction = jest.fn();
  const contextMenuUrls = {
    duplicate: '/admin/pages/tree/duplicate/%s',
    duplicateWithChildren: '/admin/pages/tree/duplicateWithChildren/%s',
    addChild: '',
  };

  const { rerender } = render(
    <TreeContextMenu
      isOpen
      position={{ x: 100, y: 100 }}
      node={mockNode}
      onClose={onClose}
      onMenuAction={onMenuAction}
      contextMenuUrls={contextMenuUrls}
    />
  );

  const duplicateItem = screen.getByText('Duplicate').closest('.tree-context-menu__item--submenu');
  fireEvent.mouseEnter(duplicateItem);

  const thisPageOnlyButton = screen.getByText('This record only');
  fireEvent.click(thisPageOnlyButton);

  expect(onMenuAction).toHaveBeenCalledWith('duplicate', 1, { includeSubpages: false });
  expect(onClose).toHaveBeenCalled();

  onClose.mockClear();
  onMenuAction.mockClear();

  rerender(
    <TreeContextMenu
      isOpen
      position={{ x: 100, y: 100 }}
      node={mockNode}
      onClose={onClose}
      onMenuAction={onMenuAction}
      contextMenuUrls={contextMenuUrls}
    />
  );

  const duplicateItem2 = screen.getByText('Duplicate').closest('.tree-context-menu__item--submenu');
  fireEvent.mouseEnter(duplicateItem2);

  const thisPageAndSubpagesButton = screen.getByText('This record and children');
  fireEvent.click(thisPageAndSubpagesButton);

  expect(onMenuAction).toHaveBeenCalledWith('duplicate', 1, { includeSubpages: true });
});

test('TreeContextMenu hides duplicate menu items when contextMenuUrls is null', () => {
  const onClose = jest.fn();
  const onMenuAction = jest.fn();

  render(
    <TreeContextMenu
      isOpen
      position={{ x: 100, y: 100 }}
      node={mockNode}
      onClose={onClose}
      onMenuAction={onMenuAction}
      contextMenuUrls={null}
    />
  );

  const duplicateItem = screen.getByText('Duplicate').closest('.tree-context-menu__item--submenu');
  fireEvent.mouseEnter(duplicateItem);

  expect(screen.queryByText('This record only')).toBeNull();
  expect(screen.queryByText('This record and children')).toBeNull();
});

test('TreeContextMenu hides duplicate menu items when URLs are empty', () => {
  const onClose = jest.fn();
  const onMenuAction = jest.fn();

  const { container } = render(
    <TreeContextMenu
      isOpen
      position={{ x: 100, y: 100 }}
      node={mockNode}
      onClose={onClose}
      onMenuAction={onMenuAction}
      contextMenuUrls={{
        duplicate: '',
        duplicateWithChildren: '',
        addChild: '',
      }}
    />
  );

  const duplicateItem = screen.getByText('Duplicate').closest('.tree-context-menu__item--submenu');
  fireEvent.mouseEnter(duplicateItem);

  const submenu = container.querySelector('.tree-context-menu__submenu');
  expect(submenu).not.toBeNull();
  expect(screen.queryByText('This record only')).toBeNull();
  expect(screen.queryByText('This record and children')).toBeNull();
});

test('TreeContextMenu shows duplicate menu items when URLs are provided', () => {
  const onClose = jest.fn();
  const onMenuAction = jest.fn();

  render(
    <TreeContextMenu
      isOpen
      position={{ x: 100, y: 100 }}
      node={mockNode}
      onClose={onClose}
      onMenuAction={onMenuAction}
      contextMenuUrls={{
        duplicate: '/admin/pages/tree/duplicate/%s',
        duplicateWithChildren: '/admin/pages/tree/duplicateWithChildren/%s',
        addChild: '',
      }}
    />
  );

  const duplicateItem = screen.getByText('Duplicate').closest('.tree-context-menu__item--submenu');
  fireEvent.mouseEnter(duplicateItem);

  expect(screen.getByText('This record only')).not.toBeNull();
  expect(screen.getByText('This record and children')).not.toBeNull();
});

test('TreeContextMenu renders custom labels when provided', () => {
  const onClose = jest.fn();
  const onMenuAction = jest.fn();
  const customLabels = {
    edit: 'Edit Item',
    showAsList: 'Show as List',
    addChild: 'Add Child Item',
    duplicate: 'Copy',
    duplicateThisOnly: 'Copy This Only',
    duplicateWithChildren: 'Copy With Children',
  };

  render(
    <TreeContextMenu
      isOpen
      position={{ x: 100, y: 100 }}
      node={mockNode}
      onClose={onClose}
      onMenuAction={onMenuAction}
      labels={customLabels}
    />
  );

  expect(screen.getByText('Edit Item')).not.toBeNull();
  expect(screen.getByText('Show as List')).not.toBeNull();
  expect(screen.getByText('Copy')).not.toBeNull();
});

test('TreeContextMenu uses default i18n when labels not provided', () => {
  const onClose = jest.fn();
  const onMenuAction = jest.fn();

  render(
    <TreeContextMenu
      isOpen
      position={{ x: 100, y: 100 }}
      node={mockNode}
      onClose={onClose}
      onMenuAction={onMenuAction}
    />
  );

  expect(screen.getByText('Edit')).not.toBeNull();
  expect(screen.getByText('Show children as list')).not.toBeNull();
});

test('TreeContextMenu renders partial custom labels with i18n fallback', () => {
  const onClose = jest.fn();
  const onMenuAction = jest.fn();
  const partialLabels = {
    edit: 'Custom Edit',
  };

  render(
    <TreeContextMenu
      isOpen
      position={{ x: 100, y: 100 }}
      node={mockNode}
      onClose={onClose}
      onMenuAction={onMenuAction}
      labels={partialLabels}
    />
  );

  expect(screen.getByText('Custom Edit')).not.toBeNull();
  expect(screen.getByText('Show children as list')).not.toBeNull();
});
test('TreeContextMenu does not render add child option when enableAddChild is false', () => {
  const onClose = jest.fn();
  const onMenuAction = jest.fn();
  const contextMenuUrls = {
    duplicate: '/admin/pages/tree/duplicate/%s',
    duplicateWithChildren: '/admin/pages/tree/duplicateWithChildren/%s',
    addChild: '/admin/pages/tree/addchild/%s',
  };

  render(
    <TreeContextMenu
      isOpen
      position={{ x: 100, y: 100 }}
      node={mockNode}
      onClose={onClose}
      onMenuAction={onMenuAction}
      contextMenuUrls={contextMenuUrls}
      enableAddChild={false}
    />
  );

  expect(screen.getByText('Edit')).not.toBeNull();
  expect(screen.queryByText('Add child')).toBeNull();
  expect(screen.getByText('Duplicate')).not.toBeNull();
});

test('TreeContextMenu renders add child option by default when enableAddChild is not specified', () => {
  const onClose = jest.fn();
  const onMenuAction = jest.fn();
  const contextMenuUrls = {
    duplicate: '/admin/pages/tree/duplicate/%s',
    duplicateWithChildren: '/admin/pages/tree/duplicateWithChildren/%s',
    addChild: '/admin/pages/tree/addchild/%s',
  };

  render(
    <TreeContextMenu
      isOpen
      position={{ x: 100, y: 100 }}
      node={mockNode}
      onClose={onClose}
      onMenuAction={onMenuAction}
      contextMenuUrls={contextMenuUrls}
    />
  );

  expect(screen.getByText('Edit')).not.toBeNull();
  expect(screen.getByText('Add child')).not.toBeNull();
  expect(screen.getByText('Duplicate')).not.toBeNull();
});

test('TreeContextMenu hides add child option when allowedChildren is empty', () => {
  const onClose = jest.fn();
  const onMenuAction = jest.fn();
  const contextMenuUrls = {
    duplicate: '/admin/pages/tree/duplicate/%s',
    duplicateWithChildren: '/admin/pages/tree/duplicateWithChildren/%s',
    addChild: '/admin/pages/tree/addchild/%s',
  };
  const nodeWithNoAllowedChildren = {
    data: {
      id: 4,
      title: 'Leaf Page',
      contextMenuData: {
        canEdit: true,
        canCreate: true,
        canDelete: true,
        numChildren: 0,
        allowedChildren: [],
      },
    },
  };

  render(
    <TreeContextMenu
      isOpen
      position={{ x: 100, y: 100 }}
      node={nodeWithNoAllowedChildren}
      onClose={onClose}
      onMenuAction={onMenuAction}
      contextMenuUrls={contextMenuUrls}
      enableAddChild
    />
  );

  expect(screen.getByText('Edit')).not.toBeNull();
  expect(screen.queryByText('Add child')).toBeNull();
  expect(screen.getByText('Duplicate')).not.toBeNull();
});
