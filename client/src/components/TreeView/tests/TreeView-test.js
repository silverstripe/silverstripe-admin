/* global jest, test, expect, beforeEach */
import React from 'react';
import { render, screen, fireEvent, act, within, waitFor } from '@testing-library/react';
import i18n from 'i18n';
import ACTION_TYPES from '../TreeViewActionTypes';
import { getTreeStore, treeStores } from '../treeViewStore';
import TreeView from '../TreeView';
import { deferred, getChildren, getItem, getPath, loadActions, makePage } from './mockTree';

const TREE_ID = 'pages';

function seedTree(actions) {
  const store = getTreeStore(TREE_ID);
  actions.forEach(store.dispatch);
}

// Store a tree with each parent in `expandedIds` loaded from the mock tree and expanded. An earlier mount can leave a
// tree in this state.
function saveTree({ expandedIds = [], storedCurrentId = null, actions = [] } = {}) {
  seedTree([
    ...[0, ...expandedIds].flatMap((parentId) => loadActions(parentId, getChildren(parentId))),
    ...expandedIds.map((id) => ({ type: ACTION_TYPES.EXPAND_ITEM, id })),
    ...actions,
    ...(storedCurrentId === null ? [] : [{ type: ACTION_TYPES.REVEAL_REQUEST, id: storedCurrentId }]),
  ]);
}

function makeProps(overrides = {}) {
  return {
    treeId: TREE_ID,
    label: 'Site pages',
    titleRowText: 'My site',
    fetchChildren: jest.fn((parentId) => Promise.resolve(getChildren(parentId))),
    ...overrides,
  };
}

// Render the tree inside an element that scrolls it, as the CMS panel does.
function renderTree(props) {
  const inScrollContainer = (treeProps) => <div className="scroll-container" style={{ overflowY: 'auto' }}><TreeView {...treeProps} /></div>;
  const result = render(inScrollContainer(props));
  const rerender = (newProps) => result.rerender(inScrollContainer(newProps));
  return { ...result, rerender };
}

function flush() {
  return act(() => new Promise((resolve) => setTimeout(resolve, 0)));
}

function getLink(name) {
  return screen.getByRole('link', { name });
}

function queryLink(name) {
  return screen.queryByRole('link', { name });
}

function findLink(name) {
  return screen.findByRole('link', { name });
}

function getTopList() {
  return document.querySelector('.tree-view__list');
}

// Get the group below the item whose link is named `name`, or null when the item is not expanded.
function getGroup(name) {
  return getLink(name).parentElement.querySelector(':scope > .tree-view__group');
}

function isItemExpanded(link) {
  return link.parentElement.classList.contains('tree-view__item--expanded');
}

function hasItemToggle(link) {
  return Boolean(link.parentElement.querySelector(':scope > .tree-view__toggle'));
}

function getToggle(name) {
  return getLink(name).parentElement.querySelector('.tree-view__toggle');
}

function getTitleRowToggle() {
  return document.querySelector('.tree-view__title-row > .tree-view__toggle');
}

// Run `callback` and wait for the navigation. Silence only the jsdom error for a link that jsdom cannot follow.
async function withoutNavigationReport(callback) {
  // eslint-disable-next-line no-console
  const originalConsoleError = console.error;
  const spy = jest.spyOn(console, 'error').mockImplementation((...args) => {
    if (!String(args[0] && args[0].message).startsWith('Not implemented: navigation')) {
      originalConsoleError(...args);
    }
  });
  try {
    callback();
    await flush();
  } finally {
    spy.mockRestore();
  }
}

function withTooManyText(text, callback) {
  const translate = i18n._t;
  const spy = jest.spyOn(i18n, '_t').mockImplementation((key, fallback) => (
    key === 'Admin.TREEVIEW_TOO_MANY' ? text : translate.call(i18n, key, fallback)
  ));
  try {
    callback();
  } finally {
    spy.mockRestore();
  }
}

function getHighlightedTitles() {
  return [...document.querySelectorAll('.tree-view__link--current')].map((link) => link.querySelector('.tree-view__title').textContent);
}

function getCurrentTitles() {
  return [...document.querySelectorAll('[aria-current=page]')].map((link) => link.querySelector('.tree-view__title').textContent);
}

const alpha = makePage(20, 0, 'Alpha', { hasChildren: true });
const beta = makePage(21, 0, 'Beta', { hasChildren: true });
const moved = makePage(22, 20, 'Moved');
const added = makePage(23, 20, 'Added');
const movedUnderBeta = { ...moved, parentId: 21 };
// The children by parent id on the server after the move.
const movedServer = { 0: [alpha, beta], 20: [added], 21: [movedUnderBeta] };

// Save a tree with Alpha expanded and Moved under it. The server has since moved Moved under Beta and added Added
// under Alpha.
function saveMovedItemTree({ actions = [], storedCurrentId = null } = {}) {
  seedTree([
    ...loadActions(0, [alpha, beta]),
    ...loadActions(20, [moved]),
    { type: ACTION_TYPES.EXPAND_ITEM, id: 20 },
    ...actions,
    ...(storedCurrentId === null ? [] : [{ type: ACTION_TYPES.REVEAL_REQUEST, id: storedCurrentId }]),
  ]);
}

// Return a `fetchChildren` mock that gives each request a deferred response. `respond()` resolves the oldest request
// for a parent id.
function deferredServer() {
  const pendingRequests = [];
  const fetchChildren = jest.fn((parentId) => {
    const response = deferred();
    pendingRequests.push({ parentId, response });
    return response.promise;
  });
  const respond = (parentId, value) => {
    const index = pendingRequests.findIndex((request) => request.parentId === parentId);
    const [{ response }] = pendingRequests.splice(index, 1);
    response.resolve(value);
  };
  return { fetchChildren, respond };
}

beforeEach(() => {
  treeStores.clear();
  Element.prototype.scrollIntoView = jest.fn();
});

test('TreeView has the side-panel class only when `isSidePanel` is true', () => {
  saveTree();
  const { unmount } = renderTree(makeProps({ isSidePanel: true }));
  expect([...screen.getByRole('navigation').classList]).toEqual(['tree-view', 'tree-view--side-panel']);
  unmount();

  renderTree(makeProps());
  expect([...screen.getByRole('navigation').classList]).toEqual(['tree-view']);
});

test('TreeView renders the stored items with the tree markup and makes no request', () => {
  saveTree({ expandedIds: [2], storedCurrentId: 6, actions: loadActions(5, getChildren(5)) });
  const props = makeProps({ currentId: 6 });
  renderTree(props);

  const nav = screen.getByRole('navigation', { name: 'Site pages' });
  expect([...nav.classList]).toEqual(['tree-view']);
  const titleRow = nav.querySelector(':scope > .tree-view__title-row');
  expect([...titleRow.classList]).toEqual(['tree-view__title-row', 'tree-view__title-row--expanded']);
  expect(titleRow.textContent).toBe('My site');
  const topList = getTopList();
  expect(topList.parentElement).toBe(nav);
  expect([...topList.classList]).toEqual(['tree-view__list']);

  const leaf = getLink('Contact us Modified');
  const item = leaf.parentElement;
  expect(item.tagName).toBe('LI');
  expect(item.getAttribute('data-id')).toBe('4');
  expect(item.getAttribute('data-recordtype')).toBe('Page');
  expect([...item.classList]).toEqual(['tree-view__item', 'class-Page', 'status-modified']);
  expect(item.querySelector('.tree-view__toggle')).toBeNull();
  expect(leaf.className).toBe('tree-view__link tree-view__link--status-modified');
  expect(leaf.getAttribute('href')).toBe('admin/pages/edit/show/4');
  expect(leaf.getAttribute('title')).toBe('(Record type: Page) Contact us');
  expect(hasItemToggle(leaf)).toBe(false);
  expect(leaf.hasAttribute('aria-current')).toBe(false);
  const [icon, title, badge] = leaf.children;
  expect(icon.className).toBe('tree-view__icon record-icon font-icon-page class-Page');
  expect(icon.getAttribute('aria-hidden')).toBe('true');
  expect(title.className).toBe('tree-view__title');
  expect(title.textContent).toBe('Contact us');
  expect(badge.className).toBe('status-badge status-badge--modified');
  expect(badge.textContent).toBe('Modified');

  const parent = getLink('About us');
  expect(isItemExpanded(parent)).toBe(true);
  expect([...parent.parentElement.classList]).toEqual(['tree-view__item', 'tree-view__item--expanded', 'class-Page']);
  expect(getToggle('About us').firstChild.getAttribute('aria-hidden')).toBe('true');
  const group = getGroup('About us');
  expect(group.parentElement).toBe(parent.parentElement);
  expect([...group.classList]).toEqual(['tree-view__group']);
  expect(getLink('History Draft').getAttribute('aria-current')).toBe('page');
  expect(isItemExpanded(getLink('Our team'))).toBe(false);
  expect([...getLink('Our team').parentElement.classList]).toEqual(['tree-view__item', 'class-Page']);
  expect(queryLink('Jane Doe')).toBeNull();

  fireEvent.click(getToggle('Our team'));
  const externalBadge = within(getLink('Staff intranet External')).getByText('External');
  expect(externalBadge.className).toBe('status-badge');
  expect(within(getLink('History Draft')).getByText('Draft').className).toBe('status-badge status-badge--draft');

  expect(props.fetchChildren).not.toHaveBeenCalled();
});

test('TreeView marks the links of status flags and of items the member cannot view or edit', () => {
  seedTree(loadActions(0, [
    makePage(1, 0, 'Both', {
      classes: 'class-Page status-modified status-externallink',
      statusFlags: [
        { key: 'modified', text: 'Modified', title: null },
        { key: 'externallink', text: 'External', title: null },
      ],
    }),
    makePage(2, 0, 'Read only', { classes: 'class-Page edit-disabled', canEdit: false }),
    makePage(3, 0, 'Hidden', { classes: 'class-Page disabled', canView: false, canEdit: false }),
    // The `disabled` and `edit-disabled` class names disable nothing. Only `canView` and `canEdit` do.
    makePage(4, 0, 'Plain', { classes: 'class-Page disabled edit-disabled' }),
  ]));
  renderTree(makeProps());

  const both = getLink('Both Modified External');
  expect([...both.classList]).toEqual([
    'tree-view__link',
    'tree-view__link--status-modified',
    'tree-view__link--status-externallink',
  ]);

  expect([...getLink('Read only').classList]).toEqual(['tree-view__link', 'tree-view__link--disabled']);
  expect([...getLink('Hidden').classList]).toEqual(['tree-view__link', 'tree-view__link--disabled']);
  expect([...getLink('Plain').classList]).toEqual(['tree-view__link']);
});

test('TreeView renders an item whose status flags are not an array with no status flag and a prop type warning', () => {
  const keyedFlags = { statusFlags: { modified: 'Modified' } };
  seedTree([
    ...loadActions(0, [makePage(1, 0, 'Keyed flags', { ...keyedFlags, hasChildren: true })]),
    ...loadActions(1, [makePage(2, 1, 'Child')]),
    { type: ACTION_TYPES.EXPAND_ITEM, id: 1 },
  ]);
  const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
  renderTree(makeProps());

  expect([...getLink('Keyed flags').classList]).toEqual(['tree-view__link']);
  expect(getLink('Child')).toBeTruthy();
  expect(consoleError).toHaveBeenCalledWith(expect.stringContaining('Failed %s type'), expect.anything(), expect.stringContaining('statusFlags'), expect.anything());
  consoleError.mockRestore();
});

test('TreeView collapses and expands the whole tree from the title row', () => {
  saveTree();
  const { container } = renderTree(makeProps());
  const titleRow = container.querySelector('.tree-view__title-row');
  expect(getTitleRowToggle().firstChild.getAttribute('aria-hidden')).toBe('true');
  expect(screen.getByRole('button', { name: 'Toggle children of My site' })).toBe(getTitleRowToggle());
  expect(getTitleRowToggle().getAttribute('aria-expanded')).toBe('true');

  fireEvent.click(getTitleRowToggle());
  expect(getTitleRowToggle().getAttribute('aria-expanded')).toBe('false');
  expect([...titleRow.classList]).toEqual(['tree-view__title-row']);
  expect(getTopList()).toBeNull();

  fireEvent.click(getTitleRowToggle());
  expect([...titleRow.classList]).toEqual(['tree-view__title-row', 'tree-view__title-row--expanded']);
  expect(screen.getAllByRole('link')).toHaveLength(4);
});

test('TreeView shows the top level without a title row when there is no `titleRowText`', () => {
  saveTree({ actions: [{ type: ACTION_TYPES.COLLAPSE_ITEM, id: 0 }] });
  const { container } = renderTree(makeProps({ titleRowText: '' }));

  expect(container.querySelector('.tree-view__title-row')).toBeNull();
  expect(screen.getAllByRole('link')).toHaveLength(4);
});

test('TreeView loads the top level on its first mount and shows a loading item meanwhile', async () => {
  const response = deferred();
  const fetchChildren = jest.fn(() => response.promise);
  const { container } = renderTree(makeProps({ fetchChildren }));

  expect(fetchChildren.mock.calls).toEqual([[0]]);
  const loading = container.querySelector('.tree-view__item--loading');
  expect(loading.textContent).toBe('Loading...');
  expect(screen.queryAllByRole('link')).toEqual([]);

  response.resolve(getChildren(0));
  await flush();
  expect(container.querySelector('.tree-view__item--loading')).toBeNull();
  expect(screen.getAllByRole('link')).toHaveLength(4);
});

test('TreeView loads children on the first expand only, showing a loading item meanwhile', async () => {
  saveTree();
  const response = deferred();
  const props = makeProps({ fetchChildren: jest.fn(() => response.promise) });
  renderTree(props);

  fireEvent.click(getToggle('About us'));
  expect(props.fetchChildren.mock.calls).toEqual([[2]]);
  expect(isItemExpanded(getLink('About us'))).toBe(true);
  const group = getGroup('About us');
  expect(group.querySelector('.tree-view__item--loading').textContent).toBe('Loading...');

  response.resolve(getChildren(2));
  await flush();
  expect(getLink('Our team')).not.toBeNull();

  fireEvent.click(getToggle('About us'));
  expect(isItemExpanded(getLink('About us'))).toBe(false);
  expect(queryLink('Our team')).toBeNull();
  fireEvent.click(getToggle('About us'));
  await flush();

  expect(props.fetchChildren).toHaveBeenCalledTimes(1);
  expect(getLink('Our team')).not.toBeNull();
});

test('TreeView loads the children of an expanded item the server sent as a leaf', async () => {
  saveTree({ actions: [{ type: ACTION_TYPES.EXPAND_ITEM, id: 4 }] });
  const props = makeProps({ fetchChildren: jest.fn(() => Promise.resolve([makePage(10, 4, 'Directions')])) });
  renderTree(props);

  expect(isItemExpanded(getLink('Contact us Modified'))).toBe(true);
  expect(props.fetchChildren.mock.calls).toEqual([[4]]);
  await flush();
  expect(getLink('Directions')).not.toBeNull();
});

test('TreeView shows a parent whose children turn out empty as a leaf', async () => {
  saveTree();
  renderTree(makeProps({ fetchChildren: jest.fn(() => Promise.resolve([])) }));

  fireEvent.click(getToggle('About us'));
  await flush();

  const parent = getLink('About us');
  expect(hasItemToggle(parent)).toBe(false);
  expect(getToggle('About us')).toBeNull();
  expect(parent.parentElement.classList.contains('tree-view__item--expanded')).toBe(false);
  expect(document.querySelector('.tree-view__group')).toBeNull();
});

test('TreeView shows a failed item that retries only when activated', async () => {
  saveTree();
  const fetchChildren = jest.fn()
    .mockImplementationOnce(() => Promise.reject(new Error('Server error')))
    .mockImplementation((parentId) => Promise.resolve(getChildren(parentId)));
  renderTree(makeProps({ fetchChildren }));

  fireEvent.click(getToggle('About us'));
  await flush();

  const failed = screen.getByRole('button', { name: 'Failed to load. Try again' });
  expect(failed.tagName).toBe('BUTTON');
  expect(failed.parentElement.className).toBe('tree-view__item tree-view__item--failed');

  fireEvent.click(getToggle('About us'));
  fireEvent.click(getToggle('About us'));
  await flush();
  expect(fetchChildren).toHaveBeenCalledTimes(1);

  fireEvent.click(screen.getByRole('button', { name: 'Failed to load. Try again' }));
  await flush();

  expect(fetchChildren.mock.calls).toEqual([[2], [2]]);
  expect(getLink('Our team')).not.toBeNull();
  expect(screen.queryByRole('button', { name: 'Failed to load. Try again' })).toBeNull();
});

test('TreeView shows a too-many item under a limited parent, which calls onShowAsList and loads no children', async () => {
  saveTree();
  const onShowAsList = jest.fn();
  const props = makeProps({ onShowAsList });
  const { rerender } = renderTree(props);

  fireEvent.click(getToggle('News'));

  expect(props.fetchChildren).not.toHaveBeenCalled();
  const parent = getLink('News');
  expect(isItemExpanded(parent)).toBe(true);
  const link = getLink('show as list');
  expect(link.parentElement.className).toBe('tree-view__item tree-view__item--too-many');
  expect(link.parentElement.textContent).toBe('Too many records (show as list)');
  expect(link.getAttribute('href')).toBe('admin/pages?ParentID=3');

  await withoutNavigationReport(() => {
    expect(fireEvent.click(link, { ctrlKey: true })).toBe(true);
  });
  expect(onShowAsList).not.toHaveBeenCalled();

  expect(fireEvent.click(link)).toBe(false);
  expect(onShowAsList).toHaveBeenCalledTimes(1);
  expect(onShowAsList.mock.calls[0][0]).toEqual(getItem(3));
  expect(onShowAsList.mock.calls[0][1].type).toBe('click');

  rerender({ ...props, onShowAsList: null });
  await withoutNavigationReport(() => {
    expect(fireEvent.click(getLink('show as list'))).toBe(true);
  });
});

test('TreeView places the show as list link in a translation with one placeholder, none or two', () => {
  [
    ['{link} first', 'show as list first'],
    ['Too many records', 'Too many records show as list'],
    ['A {link} B {link} C', 'A show as list B  C'],
  ].forEach(([text, shown]) => {
    withTooManyText(text, () => {
      treeStores.clear();
      saveTree({ actions: [{ type: ACTION_TYPES.EXPAND_ITEM, id: 3 }] });
      const { unmount } = renderTree(makeProps());
      expect(getLink('show as list').parentElement.textContent).toBe(shown);
      unmount();
    });
  });
});

test('TreeView calls onOpen on a plain click only, and leaves other clicks to the browser', async () => {
  saveTree();
  const onOpen = jest.fn();
  const props = makeProps({ onOpen });
  const { rerender } = renderTree(props);
  const link = getLink('Contact us Modified');

  fireEvent.keyDown(link, { key: 'Enter' });
  fireEvent.click(getToggle('About us'));
  await withoutNavigationReport(() => {
    [{ ctrlKey: true }, { metaKey: true }, { shiftKey: true }, { altKey: true }, { button: 1 }].forEach((modifier) => {
      expect(fireEvent.click(link, modifier)).toBe(true);
    });
  });
  expect(onOpen).not.toHaveBeenCalled();

  expect(fireEvent.click(link)).toBe(false);
  expect(onOpen).toHaveBeenCalledTimes(1);
  expect(onOpen.mock.calls[0][0]).toEqual(getItem(4));
  expect(onOpen.mock.calls[0][1].type).toBe('click');

  rerender({ ...props, onOpen: null });
  await withoutNavigationReport(() => {
    expect(fireEvent.click(getLink('Contact us Modified'))).toBe(true);
  });
});

test('TreeView stops a plain click on a disabled item and does nothing else', async () => {
  saveTree({ expandedIds: [2, 5] });
  const onOpen = jest.fn();
  const { rerender } = renderTree(makeProps({ onOpen }));
  const link = getLink('Private profile');
  expect(link.getAttribute('href')).toBe('admin/pages/edit/show/9');
  expect(link.classList.contains('tree-view__link--disabled')).toBe(true);

  expect(fireEvent.click(link)).toBe(false);
  await withoutNavigationReport(() => {
    expect(fireEvent.click(link, { ctrlKey: true })).toBe(true);
  });
  expect(onOpen).not.toHaveBeenCalled();

  rerender(makeProps());
  expect(fireEvent.click(getLink('Private profile'))).toBe(false);
});

test('TreeView highlights one item, moving it to the clicked item until the current item changes', async () => {
  saveTree();
  const props = makeProps({ onOpen: jest.fn(), currentId: 1 });
  const { rerender } = renderTree(props);
  expect(getHighlightedTitles()).toEqual(['Home']);

  fireEvent.click(getLink('Contact us Modified'));
  expect(getHighlightedTitles()).toEqual(['Contact us']);
  expect(getCurrentTitles()).toEqual(['Home']);
  // The `tree-view__link--status-modified` modifier colours the highlight.
  expect(getLink('Contact us Modified').classList.contains('tree-view__link--status-modified')).toBe(true);

  fireEvent.click(getLink('About us'));
  expect(getHighlightedTitles()).toEqual(['About us']);

  rerender({ ...props, onOpen: jest.fn() });
  expect(getHighlightedTitles()).toEqual(['About us']);

  rerender({ ...props, currentId: 2 });
  expect(getHighlightedTitles()).toEqual(['About us']);
  expect(getCurrentTitles()).toEqual(['About us']);

  // A return to the earlier current item does not bring back the old pending item.
  rerender({ ...props, currentId: 1 });
  expect(getHighlightedTitles()).toEqual(['Home']);

  await withoutNavigationReport(() => {
    fireEvent.click(getLink('Contact us Modified'), { ctrlKey: true });
  });
  expect(getHighlightedTitles()).toEqual(['Home']);
});

test('TreeView leaves the highlight on the current item when onOpen returns false or is absent', async () => {
  saveTree();
  const props = makeProps({ onOpen: jest.fn(() => false), currentId: 1 });
  const { rerender } = renderTree(props);

  fireEvent.click(getLink('Contact us Modified'));
  expect(getHighlightedTitles()).toEqual(['Home']);

  rerender({ ...props, onOpen: null });
  await withoutNavigationReport(() => {
    fireEvent.click(getLink('Contact us Modified'));
  });
  expect(getHighlightedTitles()).toEqual(['Home']);
});

test('TreeView clears the pending item when the latest open request fails, and not for an earlier one', async () => {
  saveTree();
  const opens = [];
  const onOpen = jest.fn(() => new Promise((resolve, reject) => {
    opens.push({ resolve, reject });
  }));
  renderTree(makeProps({ onOpen, currentId: 1 }));

  fireEvent.click(getLink('Contact us Modified'));
  expect(getHighlightedTitles()).toEqual(['Contact us']);
  await act(async () => opens[0].reject(new Error('Internal Server Error')));
  expect(getHighlightedTitles()).toEqual(['Home']);

  fireEvent.click(getLink('Contact us Modified'));
  await act(async () => opens[1].resolve(false));
  expect(getHighlightedTitles()).toEqual(['Home']);

  // The second click aborts the first open request. The rejection of the first open request arrives after the click.
  fireEvent.click(getLink('Contact us Modified'));
  fireEvent.click(getLink('About us'));
  await act(async () => opens[2].reject(new Error('abort')));
  expect(getHighlightedTitles()).toEqual(['About us']);
  await act(async () => opens[3].resolve({}));
  expect(getHighlightedTitles()).toEqual(['About us']);
});

test('TreeView keeps the pending item across a remount on the same current item', () => {
  saveTree();
  const props = makeProps({ onOpen: jest.fn(), currentId: 1 });
  const { unmount } = renderTree(props);
  fireEvent.click(getLink('About us'));
  unmount();

  renderTree(props);
  expect(getHighlightedTitles()).toEqual(['About us']);
  expect(getCurrentTitles()).toEqual(['Home']);
});

test('TreeView calls the latest callbacks', async () => {
  saveTree();
  const firstOnOpen = jest.fn();
  const latest = jest.fn();
  const props = makeProps({ onOpen: firstOnOpen });
  const { rerender } = renderTree(props);

  rerender({ ...props, onOpen: latest });
  fireEvent.click(getLink('Contact us Modified'));
  expect(firstOnOpen).not.toHaveBeenCalled();
  expect(latest).toHaveBeenCalledTimes(1);

  const fetchChildren = jest.fn((parentId) => Promise.resolve(getChildren(parentId)));
  rerender({ ...props, onOpen: latest, fetchChildren });
  fireEvent.click(getToggle('About us'));
  await flush();
  expect(props.fetchChildren).not.toHaveBeenCalled();
  expect(fetchChildren.mock.calls).toEqual([[2]]);
});

test('TreeView marks the current item from the prop, given as a number or a string', () => {
  saveTree({ expandedIds: [2] });
  const { rerender } = renderTree(makeProps({ currentId: 6 }));
  expect(getLink('History Draft').getAttribute('aria-current')).toBe('page');
  expect(document.querySelectorAll('[aria-current]')).toHaveLength(1);

  rerender(makeProps({ currentId: '4' }));
  expect(getLink('Contact us Modified').getAttribute('aria-current')).toBe('page');
  expect(document.querySelectorAll('[aria-current]')).toHaveLength(1);

  rerender(makeProps({ currentId: null }));
  expect(document.querySelectorAll('[aria-current]')).toHaveLength(0);

  const fetchPath = jest.fn(() => Promise.resolve([]));
  rerender(makeProps({ currentId: 0, fetchPath }));
  rerender(makeProps({ currentId: '0', fetchPath }));
  expect(document.querySelectorAll('[aria-current]')).toHaveLength(0);
  expect(fetchPath).not.toHaveBeenCalled();
});

test('TreeView expands the collapsed ancestors of a stored current item without fetchPath', () => {
  saveTree({ expandedIds: [2, 5] });
  const fetchPath = jest.fn(() => Promise.resolve([]));
  const { rerender } = renderTree(makeProps({ fetchPath }));
  fireEvent.click(getToggle('About us'));
  fireEvent.click(getTitleRowToggle());

  rerender(makeProps({ currentId: 7, fetchPath }));

  expect(getLink('Jane Doe').getAttribute('aria-current')).toBe('page');
  expect(fetchPath).not.toHaveBeenCalled();
});

test('TreeView reveals a current item that is not stored', async () => {
  const fetchPath = jest.fn((id) => Promise.resolve(getPath(id)));
  const props = makeProps({ currentId: 8, fetchPath });
  renderTree(props);
  const link = await findLink('Sam Smith');

  expect(fetchPath.mock.calls).toEqual([[8]]);
  expect(props.fetchChildren.mock.calls).toEqual([[0], [2], [5]]);
  expect(link.getAttribute('aria-current')).toBe('page');
  expect(Element.prototype.scrollIntoView).toHaveBeenCalledTimes(1);
  expect(Element.prototype.scrollIntoView.mock.instances[0]).toBe(link);
  expect(Element.prototype.scrollIntoView).toHaveBeenCalledWith({ block: 'nearest' });
});

test('TreeView asks again for a path that failed on a reload and on the next mount, and not on a render', async () => {
  saveTree();
  const fetchPath = jest.fn(() => Promise.reject(new Error('Server error')));
  const props = makeProps({ currentId: 8, fetchPath });
  const { rerender, unmount } = renderTree(props);
  await flush();
  rerender({ ...props, fetchPath: (id) => fetchPath(id) });
  await flush();
  expect(fetchPath).toHaveBeenCalledTimes(1);

  rerender({ ...props, reloadKey: 1 });
  await flush();
  expect(fetchPath).toHaveBeenCalledTimes(2);

  unmount();
  renderTree({ ...props, reloadKey: 1 });
  await flush();
  expect(fetchPath).toHaveBeenCalledTimes(3);
});

test('TreeView does not reveal again for a new fetchPath', async () => {
  const fetchPath = jest.fn((id) => Promise.resolve(getPath(id)));
  const props = makeProps({ currentId: 8, fetchPath });
  const { rerender } = renderTree(props);
  await findLink('Sam Smith');
  fireEvent.click(getToggle('About us'));

  const nextFetchPath = jest.fn((id) => Promise.resolve(getPath(id)));
  rerender({ ...props, fetchPath: nextFetchPath });
  await flush();

  expect(fetchPath).toHaveBeenCalledTimes(1);
  expect(nextFetchPath).not.toHaveBeenCalled();
  expect(isItemExpanded(getLink('About us'))).toBe(false);
});

test('TreeView repeats no request, reveal or reload when it is given new functions on every render', async () => {
  const requestedParentIds = [];
  const requestedPathIds = [];
  const withNewFunctions = (props) => ({
    ...props,
    fetchChildren: (parentId) => {
      requestedParentIds.push(parentId);
      return Promise.resolve(getChildren(parentId));
    },
    fetchPath: (id) => {
      requestedPathIds.push(id);
      return Promise.resolve(getPath(id));
    },
    onOpen: () => {},
    onShowAsList: () => {},
  });
  const props = makeProps({ currentId: 8, reloadKey: 1 });
  const { rerender, container } = renderTree(withNewFunctions(props));
  rerender(withNewFunctions(props));
  await findLink('Sam Smith');
  fireEvent.click(getToggle('About us'));
  container.querySelector('.scroll-container').scrollTop = 40;

  rerender(withNewFunctions(props));
  rerender(withNewFunctions(props));
  await flush();

  expect(requestedParentIds).toEqual([0, 2, 5]);
  expect(requestedPathIds).toEqual([8]);
  expect(isItemExpanded(getLink('About us'))).toBe(false);
  expect(container.querySelector('.scroll-container').scrollTop).toBe(40);
});

test('TreeView ignores the path of a current item that changed while it was fetched', async () => {
  const path = deferred();
  const fetchPath = jest.fn((id) => (id === 8 ? path.promise : Promise.resolve(getPath(id))));
  const props = makeProps({ currentId: 8, fetchPath });
  const { rerender } = renderTree(props);
  await flush();

  rerender({ ...props, currentId: 4 });
  await flush();
  path.resolve([2, 5]);
  await flush();

  expect(isItemExpanded(getLink('About us'))).toBe(false);
  expect(props.fetchChildren.mock.calls).toEqual([[0]]);
  expect(getLink('Contact us Modified').getAttribute('aria-current')).toBe('page');
});

test('TreeView reloads the children on the chain of the current item that lack the next item down', async () => {
  saveTree({ expandedIds: [2] });
  const server = {
    2: [...getChildren(2), makePage(10, 2, 'Careers', { hasChildren: true })],
    10: [makePage(11, 10, 'Vacancies')],
  };
  const fetchChildren = jest.fn((parentId) => Promise.resolve(server[parentId] || getChildren(parentId)));
  const fetchPath = jest.fn(() => Promise.resolve([2, 10]));
  renderTree(makeProps({ currentId: 11, fetchChildren, fetchPath }));
  const link = await findLink('Vacancies');

  expect(fetchChildren.mock.calls).toEqual([[2], [10]]);
  expect(isItemExpanded(getLink('Careers'))).toBe(true);
  expect(link.getAttribute('aria-current')).toBe('page');
});

test('TreeView asks for the path of a current item its stored parent no longer holds', async () => {
  saveMovedItemTree();
  const fetchChildren = jest.fn((parentId) => Promise.resolve(movedServer[parentId]));
  const fetchPath = jest.fn((id) => Promise.resolve(id === 23 ? [20] : [21]));
  const props = makeProps({ currentId: 23, fetchChildren, fetchPath });
  const { rerender } = renderTree(props);
  expect((await findLink('Added')).getAttribute('aria-current')).toBe('page');
  expect(queryLink('Moved')).toBeNull();

  rerender({ ...props, currentId: 22 });
  const link = await findLink('Moved');

  expect(fetchPath.mock.calls).toEqual([[23], [22]]);
  expect(fetchChildren.mock.calls).toEqual([[20], [21]]);
  expect(isItemExpanded(getLink('Beta'))).toBe(true);
  expect(link.getAttribute('aria-current')).toBe('page');
});

test('TreeView keeps the children that a reveal loads again until the response is in', async () => {
  saveMovedItemTree();
  const response = deferred();
  const fetchChildren = jest.fn(() => response.promise);
  const fetchPath = jest.fn(() => Promise.resolve([20]));
  renderTree(makeProps({ currentId: 23, fetchChildren, fetchPath }));
  await flush();

  expect(fetchChildren.mock.calls).toEqual([[20]]);
  expect(queryLink('Moved')).not.toBeNull();
  expect(queryLink('Added')).toBeNull();

  await act(async () => response.resolve([added]));
  expect(getLink('Added').getAttribute('aria-current')).toBe('page');
  expect(queryLink('Moved')).toBeNull();
});

test('TreeView does not treat a current item missing from the reloaded children of its parent as shown', async () => {
  saveMovedItemTree({ actions: loadActions(20, [added]), storedCurrentId: 22 });
  const fetchChildren = jest.fn(() => Promise.resolve([movedUnderBeta]));
  renderTree(makeProps({ currentId: 22, fetchChildren }));

  expect(document.querySelectorAll('[aria-current]')).toHaveLength(0);
  expect(Element.prototype.scrollIntoView).not.toHaveBeenCalled();

  fireEvent.click(getToggle('Beta'));
  await flush();

  expect(getLink('Moved').getAttribute('aria-current')).toBe('page');
  expect(Element.prototype.scrollIntoView).toHaveBeenCalledTimes(1);
  expect(Element.prototype.scrollIntoView.mock.instances[0]).toBe(getLink('Moved'));
});

test('TreeView scrolls the current item into view again when it returns after no item was current', () => {
  saveTree({ expandedIds: [2], storedCurrentId: 6 });
  const { rerender } = renderTree(makeProps({ currentId: 6 }));
  expect(Element.prototype.scrollIntoView).toHaveBeenCalledTimes(1);

  rerender(makeProps({ currentId: null }));
  rerender(makeProps({ currentId: 6 }));

  expect(Element.prototype.scrollIntoView).toHaveBeenCalledTimes(2);
  expect(Element.prototype.scrollIntoView.mock.instances[1]).toBe(getLink('History Draft'));
});

test('TreeView scrolls the current item into view once per current item, not each time it is shown', () => {
  saveTree({ expandedIds: [2], storedCurrentId: 6, actions: [{ type: ACTION_TYPES.COLLAPSE_ITEM, id: 0 }] });
  const { rerender } = renderTree(makeProps({ currentId: 6 }));
  expect(Element.prototype.scrollIntoView).not.toHaveBeenCalled();

  fireEvent.click(getTitleRowToggle());
  expect(Element.prototype.scrollIntoView).toHaveBeenCalledTimes(1);
  expect(Element.prototype.scrollIntoView.mock.instances[0]).toBe(getLink('History Draft'));

  fireEvent.click(getToggle('About us'));
  fireEvent.click(getToggle('About us'));
  fireEvent.click(getTitleRowToggle());
  fireEvent.click(getTitleRowToggle());
  expect(Element.prototype.scrollIntoView).toHaveBeenCalledTimes(1);

  rerender(makeProps({ currentId: 4 }));
  expect(Element.prototype.scrollIntoView).toHaveBeenCalledTimes(2);
  expect(Element.prototype.scrollIntoView.mock.instances[1]).toBe(getLink('Contact us Modified'));
});

test('TreeView renders a remount from the saved state at once, as the user left it, with no request', async () => {
  const fetchPath = jest.fn((id) => Promise.resolve(getPath(id)));
  const props = makeProps({ currentId: 7, fetchPath });
  const first = renderTree(props);
  expect((await findLink('Jane Doe')).getAttribute('aria-current')).toBe('page');
  fireEvent.click(getToggle('Our team'));
  fireEvent.click(getTitleRowToggle());
  first.unmount();
  Element.prototype.scrollIntoView.mockClear();

  const secondProps = makeProps({ currentId: '7', fetchPath: jest.fn(() => Promise.resolve([])) });
  renderTree(secondProps);

  expect(screen.queryAllByRole('link')).toEqual([]);
  fireEvent.click(getTitleRowToggle());
  expect(screen.getAllByRole('link')).toHaveLength(6);
  expect(isItemExpanded(getLink('Our team'))).toBe(false);
  await flush();
  expect(secondProps.fetchPath).not.toHaveBeenCalled();
  expect(secondProps.fetchChildren).not.toHaveBeenCalled();
  expect(Element.prototype.scrollIntoView).not.toHaveBeenCalled();
});

test('TreeView keeps the scroll offset across a remount, then brings the current item into view', () => {
  saveTree({ expandedIds: [2], storedCurrentId: 6 });
  const first = renderTree(makeProps({ currentId: 6 }));
  first.container.querySelector('.scroll-container').scrollTop = 120;
  first.unmount();

  let offsetWhenScrolled = null;
  Element.prototype.scrollIntoView = jest.fn(function scrollIntoView() {
    offsetWhenScrolled = this.closest('.scroll-container').scrollTop;
  });
  const { container } = renderTree(makeProps({ currentId: 6 }));

  expect(container.querySelector('.scroll-container').scrollTop).toBe(120);
  expect(Element.prototype.scrollIntoView).toHaveBeenCalledTimes(1);
  expect(Element.prototype.scrollIntoView.mock.instances[0]).toBe(getLink('History Draft'));
  expect(offsetWhenScrolled).toBe(120);
});

test('TreeView leaves the page scroll alone when no element around the tree scrolls', () => {
  saveTree({ actions: [{ type: ACTION_TYPES.SET_SCROLL, scrollTop: 120 }] });
  // jsdom has no `document.scrollingElement`. A browser returns the root element.
  Object.defineProperty(document, 'scrollingElement', { configurable: true, value: document.documentElement });
  try {
    document.documentElement.scrollTop = 300;
    const { unmount } = render(<TreeView {...makeProps()} />);
    expect(document.documentElement.scrollTop).toBe(300);

    document.documentElement.scrollTop = 750;
    unmount();
    expect(getTreeStore(TREE_ID).getState().scrollTop).toBe(120);
  } finally {
    delete document.scrollingElement;
    document.documentElement.scrollTop = 0;
  }
});

test('TreeView keeps the saved scroll offset when the tree is out of the document at unmount', () => {
  saveTree({ actions: [{ type: ACTION_TYPES.SET_SCROLL, scrollTop: 120 }] });
  const first = renderTree(makeProps());
  const scrollContainer = first.container.querySelector('.scroll-container');
  expect(scrollContainer.scrollTop).toBe(120);
  first.container.remove();
  // A browser reads a `scrollTop` of 0 from a detached element.
  scrollContainer.scrollTop = 0;
  first.unmount();

  const { container } = renderTree(makeProps());
  expect(container.querySelector('.scroll-container').scrollTop).toBe(120);
});

test('TreeView keeps a load and a reveal in flight across a remount, and applies a response that arrives unmounted', async () => {
  const top = deferred();
  const path = deferred();
  const props = makeProps({
    currentId: 8,
    fetchChildren: jest.fn((parentId) => (parentId === 0 ? top.promise : Promise.resolve(getChildren(parentId)))),
    fetchPath: jest.fn(() => path.promise),
  });
  renderTree(props).unmount();
  const second = renderTree(props);
  expect(props.fetchChildren.mock.calls).toEqual([[0]]);
  expect(props.fetchPath).toHaveBeenCalledTimes(1);
  second.unmount();

  top.resolve(getChildren(0));
  path.resolve([2, 5]);
  await flush();
  renderTree(props);
  expect(isItemExpanded(getLink('About us'))).toBe(true);
  const link = await findLink('Sam Smith');

  expect(props.fetchChildren.mock.calls).toEqual([[0], [2], [5]]);
  expect(props.fetchPath).toHaveBeenCalledTimes(1);
  expect(link.getAttribute('aria-current')).toBe('page');
});

test('TreeView keeps two trees with different ids apart', async () => {
  const pages = makeProps();
  const files = makeProps({
    treeId: 'files',
    label: 'Files',
    titleRowText: 'Files',
    fetchChildren: jest.fn(() => Promise.resolve([makePage(2, 0, 'Uploads', { hasChildren: true })])),
  });
  render(<><TreeView {...pages} /><TreeView {...files} /></>);
  await flush();

  const filesNav = screen.getByRole('navigation', { name: 'Files' });
  fireEvent.click(getToggle('About us'));
  fireEvent.click(filesNav.querySelector('.tree-view__title-row > .tree-view__toggle'));
  await flush();

  expect(pages.fetchChildren.mock.calls).toEqual([[0], [2]]);
  expect(files.fetchChildren.mock.calls).toEqual([[0]]);
  expect(within(screen.getByRole('navigation', { name: 'Site pages' })).getAllByRole('link')).toHaveLength(6);
  expect(within(filesNav).queryAllByRole('link')).toEqual([]);
});

test('TreeView makes one request per parent under StrictMode, and none on a remount', async () => {
  const props = makeProps({ currentId: 8, fetchPath: jest.fn((id) => Promise.resolve(getPath(id))) });
  const first = render(<React.StrictMode><TreeView {...props} /></React.StrictMode>);
  const link = await findLink('Sam Smith');

  expect(props.fetchChildren.mock.calls).toEqual([[0], [2], [5]]);
  expect(props.fetchPath).toHaveBeenCalledTimes(1);
  expect(link.getAttribute('aria-current')).toBe('page');
  first.unmount();

  const secondProps = makeProps({ currentId: 8, fetchPath: jest.fn(() => Promise.resolve([])) });
  render(<React.StrictMode><TreeView {...secondProps} /></React.StrictMode>);
  await flush();

  expect(secondProps.fetchChildren).not.toHaveBeenCalled();
  expect(secondProps.fetchPath).not.toHaveBeenCalled();
  expect(getLink('Sam Smith')).not.toBeNull();
});

test('TreeView asks once for children that fail at once under StrictMode', () => {
  const fetchChildren = jest.fn(() => {
    throw new Error('Server error');
  });
  render(<React.StrictMode><TreeView {...makeProps({ fetchChildren })} /></React.StrictMode>);

  expect(fetchChildren).toHaveBeenCalledTimes(1);
});

test('TreeView reloads the top level and each expanded parent with the items kept, and drops children not expanded', async () => {
  saveTree({ expandedIds: [2, 5], storedCurrentId: 6, actions: [{ type: ACTION_TYPES.COLLAPSE_ITEM, id: 5 }] });
  const { fetchChildren, respond } = deferredServer();
  const fetchPath = jest.fn(() => Promise.resolve([2]));
  const props = makeProps({ currentId: 6, fetchChildren, fetchPath });
  const { rerender, container } = renderTree(props);
  expect(fetchChildren).not.toHaveBeenCalled();

  rerender({ ...props, reloadKey: 1 });

  expect(fetchChildren.mock.calls).toEqual([[0], [2]]);
  expect(screen.getAllByRole('link')).toHaveLength(6);
  expect(container.querySelector('.tree-view__item--loading')).toBeNull();

  respond(0, [
    getItem(2),
    getItem(3),
    { ...getItem(4), treeTitle: 'Contact', classes: 'class-Page', statusFlags: [] },
    makePage(11, 0, 'Events'),
  ]);
  await flush();
  expect(queryLink('Home')).toBeNull();
  expect(getLink('Contact')).not.toBeNull();
  expect(getLink('Events')).not.toBeNull();
  expect(getLink('History Draft')).not.toBeNull();

  respond(2, [getItem(5), { ...getItem(6), treeTitle: 'Our history', statusFlags: [] }]);
  await flush();
  expect(getLink('Our history').getAttribute('aria-current')).toBe('page');
  expect(fetchPath).not.toHaveBeenCalled();

  fireEvent.click(getToggle('Our team'));
  expect(fetchChildren.mock.calls).toEqual([[0], [2], [5]]);
  expect(getGroup('Our team').textContent).toBe('Loading...');
});

test('TreeView reloads on a mount after the value changed while unmounted, and not for the same value', async () => {
  const props = makeProps({ reloadKey: 1 });
  const first = renderTree(props);
  await flush();
  expect(props.fetchChildren.mock.calls).toEqual([[0]]);
  first.unmount();

  const same = makeProps({ reloadKey: 1 });
  const second = renderTree(same);
  await flush();
  expect(same.fetchChildren).not.toHaveBeenCalled();
  second.unmount();

  const changed = makeProps({ reloadKey: 2 });
  renderTree(changed);
  expect(screen.getAllByRole('link')).toHaveLength(4);
  await flush();
  expect(changed.fetchChildren.mock.calls).toEqual([[0]]);
});

test('TreeView keeps the old items and shows no failed item when a reload fails, and tries again on the next', async () => {
  saveTree({ expandedIds: [2] });
  const fetchChildren = jest.fn((parentId) => (
    parentId === 2 ? Promise.reject(new Error('Server error')) : Promise.resolve(getChildren(parentId))
  ));
  const props = makeProps({ fetchChildren });
  const { rerender } = renderTree(props);

  rerender({ ...props, reloadKey: 1 });
  await flush();
  expect(getLink('Our team')).not.toBeNull();
  expect(screen.queryByRole('button', { name: 'Failed to load. Try again' })).toBeNull();

  rerender({ ...props, reloadKey: 2 });
  await flush();
  expect(fetchChildren.mock.calls).toEqual([[0], [2], [0], [2]]);
  expect(getLink('Our team')).not.toBeNull();
});

test('TreeView stops reloading the children of an item that has left the tree', async () => {
  saveTree({ expandedIds: [2, 5], actions: [...loadActions(7, [makePage(40, 7, 'Notes')]), { type: ACTION_TYPES.EXPAND_ITEM, id: 7 }] });
  const fetchChildren = jest.fn((parentId) => Promise.resolve(parentId === 2 ? [getItem(6)] : getChildren(parentId)));
  const props = makeProps({ fetchChildren });
  const { rerender } = renderTree(props);

  rerender({ ...props, reloadKey: 1 });
  await flush();
  expect(fetchChildren.mock.calls).toEqual([[0], [2], [5], [7]]);
  expect(queryLink('Our team')).toBeNull();

  rerender({ ...props, reloadKey: 2 });
  await flush();
  expect(fetchChildren.mock.calls.slice(4)).toEqual([[0], [2]]);
});

test('TreeView leaves a parent the user collapses during a reload collapsed', async () => {
  saveTree({ expandedIds: [2], storedCurrentId: 6 });
  const { fetchChildren, respond } = deferredServer();
  const fetchPath = jest.fn(() => Promise.resolve([2]));
  const props = makeProps({ currentId: 6, fetchChildren, fetchPath });
  const { rerender } = renderTree(props);
  expect(getLink('History Draft').getAttribute('aria-current')).toBe('page');

  rerender({ ...props, reloadKey: 1 });
  fireEvent.click(getToggle('About us'));
  respond(0, getChildren(0));
  respond(2, getChildren(2));
  await flush();

  expect(isItemExpanded(getLink('About us'))).toBe(false);
  expect(fetchPath).not.toHaveBeenCalled();
});

test.each([
  ['the title row', () => fireEvent.click(getTitleRowToggle())],
  ['its parent', () => fireEvent.click(getToggle('Alpha'))],
])('TreeView does not reveal a moved current page when the user closes %s during the reload', async (_, close) => {
  saveMovedItemTree({ storedCurrentId: 22 });
  const { fetchChildren, respond } = deferredServer();
  const fetchPath = jest.fn(() => Promise.resolve([21]));
  const props = makeProps({ currentId: 22, fetchChildren, fetchPath });
  const { rerender } = renderTree(props);

  rerender({ ...props, reloadKey: 1 });
  close();
  respond(0, [alpha, beta]);
  respond(20, [added]);
  await flush();

  expect(fetchPath).not.toHaveBeenCalled();
  expect(queryLink('Moved')).toBeNull();
});

test('TreeView reveals an item selected during a reload that then takes it out of the children of a parent above it', async () => {
  saveMovedItemTree();
  const { fetchChildren, respond } = deferredServer();
  const fetchPath = jest.fn(() => Promise.resolve([21]));
  const props = makeProps({ fetchChildren, fetchPath });
  const { rerender } = renderTree(props);

  rerender({ ...props, reloadKey: 1 });
  rerender({ ...props, reloadKey: 1, currentId: 22 });
  expect(getLink('Moved').getAttribute('aria-current')).toBe('page');
  respond(0, [alpha, beta]);
  respond(20, [added]);
  await flush();
  expect(fetchPath.mock.calls).toEqual([[22]]);

  respond(21, [movedUnderBeta]);
  const link = await waitFor(() => within(getGroup('Beta')).getByRole('link', { name: 'Moved' }));
  expect(link.getAttribute('aria-current')).toBe('page');
});

test('TreeView loads an expanded parent again after it was limited for one reload', async () => {
  saveTree({ expandedIds: [2] });
  let limited = true;
  const fetchChildren = jest.fn((parentId) => {
    if (parentId === 0) {
      return Promise.resolve(getChildren(0).map((item) => (item.id === 2 ? { ...item, limited, listViewUrl: 'admin/pages?ParentID=2' } : item)));
    }
    return Promise.resolve(limited ? [] : getChildren(parentId));
  });
  const props = makeProps({ fetchChildren });
  const { rerender } = renderTree(props);

  rerender({ ...props, reloadKey: 1 });
  expect(await findLink('show as list')).toBeTruthy();

  limited = false;
  rerender({ ...props, reloadKey: 2 });
  expect(await findLink('Our team')).toBeTruthy();
  expect(isItemExpanded(getLink('About us'))).toBe(true);
  expect(queryLink('show as list')).toBeNull();
});

test('TreeView reveals the current item under its new parent after a reload', async () => {
  saveMovedItemTree({ storedCurrentId: 22 });
  const fetchChildren = jest.fn((parentId) => Promise.resolve(movedServer[parentId]));
  const fetchPath = jest.fn(() => Promise.resolve([21]));
  const props = makeProps({ currentId: 22, fetchChildren, fetchPath });
  const { rerender } = renderTree(props);
  expect(getLink('Moved').getAttribute('aria-current')).toBe('page');

  rerender({ ...props, reloadKey: 1 });
  const link = await waitFor(() => within(getGroup('Beta')).getByRole('link', { name: 'Moved' }));

  expect(fetchChildren.mock.calls).toEqual([[0], [20], [21]]);
  expect(fetchPath.mock.calls).toEqual([[22]]);
  expect(within(getGroup('Alpha')).queryByRole('link', { name: 'Moved' })).toBeNull();
  expect(isItemExpanded(getLink('Beta'))).toBe(true);
  expect(link.getAttribute('aria-current')).toBe('page');
});

test('TreeView reveals a moved current item when a second reload starts before the first has answered', async () => {
  saveMovedItemTree({ storedCurrentId: 22 });
  const firstResponses = { 0: deferred(), 20: deferred() };
  const fetchChildren = jest.fn((parentId) => (firstResponses[parentId] ? firstResponses[parentId].promise : Promise.resolve(movedServer[parentId])));
  const fetchPath = jest.fn(() => Promise.resolve([21]));
  const props = makeProps({ currentId: 22, fetchChildren, fetchPath });
  const { rerender } = renderTree(props);

  rerender({ ...props, reloadKey: 1 });
  rerender({ ...props, reloadKey: 2 });
  await flush();
  expect(fetchChildren.mock.calls).toEqual([[0], [20]]);
  expect(fetchPath).not.toHaveBeenCalled();

  await act(async () => {
    firstResponses[0].resolve(movedServer[0]);
    firstResponses[20].resolve(movedServer[20]);
  });
  const link = await waitFor(() => within(getGroup('Beta')).getByRole('link', { name: 'Moved' }));

  expect(fetchChildren.mock.calls).toEqual([[0], [20], [0], [20], [21]]);
  expect(fetchPath.mock.calls).toEqual([[22]]);
  expect(link.getAttribute('aria-current')).toBe('page');
});

test('TreeView loads the children of an expanded parent that a reload shows is no longer limited', async () => {
  saveTree();
  const news = getItem(3);
  const story = makePage(30, 3, 'Story');
  const server = { 0: getChildren(0).map((item) => (item.id === 3 ? { ...news, limited: false } : item)), 3: [story] };
  const fetchChildren = jest.fn((parentId) => Promise.resolve(server[parentId]));
  const props = makeProps({ fetchChildren });
  const { rerender } = renderTree(props);
  fireEvent.click(getToggle('News'));
  expect(getLink('show as list')).toBeTruthy();

  rerender({ ...props, reloadKey: 1 });

  expect(await findLink('Story')).toBeTruthy();
  expect(queryLink('show as list')).toBeNull();
  expect(fetchChildren.mock.calls).toEqual([[0], [3]]);
});

test('TreeView leaves a collapsed ancestor and a collapsed title row collapsed after a reload when the current item stays', async () => {
  saveTree({
    expandedIds: [2, 5],
    storedCurrentId: 7,
    actions: [{ type: ACTION_TYPES.COLLAPSE_ITEM, id: 2 }, { type: ACTION_TYPES.COLLAPSE_ITEM, id: 0 }],
  });
  const server = { 0: getChildren(0), 2: getChildren(2), 5: [{ ...getItem(7), treeTitle: 'Jane Smith' }] };
  const fetchChildren = jest.fn((parentId) => Promise.resolve(server[parentId]));
  const fetchPath = jest.fn(() => Promise.resolve([2, 5]));
  const props = makeProps({ currentId: 7, fetchChildren, fetchPath });
  const { rerender } = renderTree(props);

  rerender({ ...props, reloadKey: 1 });
  await flush();

  expect(fetchChildren.mock.calls).toEqual([[0]]);
  expect(fetchPath).not.toHaveBeenCalled();
  expect(getTopList()).toBeNull();

  fireEvent.click(getTitleRowToggle());
  expect(isItemExpanded(getLink('About us'))).toBe(false);
  fireEvent.click(getToggle('About us'));
  const link = await findLink('Jane Smith');
  expect(fetchChildren.mock.calls).toEqual([[0], [2], [5]]);
  expect(link.getAttribute('aria-current')).toBe('page');
});

test('TreeView shows no current item and no failed item after a reload drops an archived current item', async () => {
  saveTree({ expandedIds: [2], storedCurrentId: 6 });
  const fetchChildren = jest.fn((parentId) => Promise.resolve(parentId === 2 ? [getItem(5)] : getChildren(parentId)));
  const fetchPath = jest.fn(() => Promise.reject(new Error('Not Found')));
  const props = makeProps({ currentId: 6, fetchChildren, fetchPath });
  const { rerender } = renderTree(props);
  expect(getLink('History Draft').getAttribute('aria-current')).toBe('page');

  rerender({ ...props, reloadKey: 1 });
  await waitFor(() => expect(fetchPath.mock.calls).toEqual([[6]]));

  expect(queryLink('History Draft')).toBeNull();
  expect(document.querySelectorAll('[aria-current]')).toHaveLength(0);
  expect(screen.queryByRole('button', { name: 'Failed to load. Try again' })).toBeNull();
  expect(isItemExpanded(getLink('About us'))).toBe(true);

  rerender({ ...props, reloadKey: 2 });
  await flush();
  rerender({ ...props, reloadKey: 3 });
  await flush();
  expect(fetchPath.mock.calls).toEqual([[6], [6], [6]]);
  expect(screen.queryByRole('button', { name: 'Failed to load. Try again' })).toBeNull();
});

test('TreeView asks once for the path of an item selected during a reload while the children of its parent are still loading', async () => {
  saveTree({ expandedIds: [2, 5], storedCurrentId: 6, actions: [{ type: ACTION_TYPES.COLLAPSE_ITEM, id: 5 }] });
  const { fetchChildren, respond } = deferredServer();
  const fetchPath = jest.fn((id) => Promise.resolve(getPath(id)));
  const props = makeProps({ currentId: 6, fetchChildren, fetchPath });
  const { rerender } = renderTree(props);

  rerender({ ...props, reloadKey: 1 });
  rerender({ ...props, reloadKey: 1, currentId: 7 });
  await flush();
  expect(fetchChildren.mock.calls).toEqual([[0], [2], [5]]);
  respond(0, getChildren(0));
  respond(2, getChildren(2));
  await flush();
  expect(fetchPath.mock.calls).toEqual([[7]]);

  respond(5, getChildren(5));
  expect((await findLink('Jane Doe')).getAttribute('aria-current')).toBe('page');
  expect(fetchPath.mock.calls).toEqual([[7]]);
});

test('TreeView asks once for the path of an item it is remounted on during a reload while the children of its parent are still loading', async () => {
  saveTree({ expandedIds: [2, 5], storedCurrentId: 6, actions: [{ type: ACTION_TYPES.COLLAPSE_ITEM, id: 5 }] });
  const { fetchChildren, respond } = deferredServer();
  const fetchPath = jest.fn((id) => Promise.resolve(getPath(id)));
  const props = makeProps({ currentId: 6, fetchChildren, fetchPath });
  const first = renderTree(props);
  first.rerender({ ...props, reloadKey: 1 });
  first.unmount();

  renderTree({ ...props, reloadKey: 1, currentId: 7 });
  await flush();
  respond(0, getChildren(0));
  respond(2, getChildren(2));
  await flush();
  expect(fetchPath.mock.calls).toEqual([[7]]);

  respond(5, getChildren(5));
  expect((await findLink('Jane Doe')).getAttribute('aria-current')).toBe('page');
  expect(fetchPath.mock.calls).toEqual([[7]]);
});

test('TreeView reveals a current item moved under a limited parent once, and leaves that parent collapsed afterwards', async () => {
  saveMovedItemTree({ storedCurrentId: 22 });
  const server = { 0: [alpha, { ...beta, limited: true }], 20: [added] };
  const fetchChildren = jest.fn((parentId) => Promise.resolve(server[parentId]));
  const fetchPath = jest.fn(() => Promise.resolve([21]));
  const props = makeProps({ currentId: 22, fetchChildren, fetchPath });
  const { rerender } = renderTree(props);

  rerender({ ...props, reloadKey: 1 });
  await waitFor(() => expect(isItemExpanded(getLink('Beta'))).toBe(true));
  expect(fetchPath.mock.calls).toEqual([[22]]);

  fireEvent.click(getToggle('Beta'));
  rerender({ ...props, reloadKey: 2 });
  await flush();
  rerender({ ...props, reloadKey: 3 });
  await flush();

  expect(fetchPath.mock.calls).toEqual([[22]]);
  expect(isItemExpanded(getLink('Beta'))).toBe(false);
});

test('TreeView loads an expanded parent again when it stops being limited while a request for its children is in flight', async () => {
  saveTree({ expandedIds: [2] });
  const { fetchChildren, respond } = deferredServer();
  const topLevel = (limited) => getChildren(0).map((item) => (item.id === 2 ? { ...item, limited, listViewUrl: 'admin/pages?ParentID=2' } : item));
  const props = makeProps({ fetchChildren });
  const { rerender } = renderTree(props);

  rerender({ ...props, reloadKey: 1 });
  respond(0, topLevel(true));
  expect(await findLink('show as list')).toBeTruthy();

  rerender({ ...props, reloadKey: 2 });
  respond(0, topLevel(false));
  await flush();
  respond(2, []);
  await flush();
  expect(fetchChildren.mock.calls).toEqual([[0], [2], [0], [2]]);

  respond(2, getChildren(2));
  expect(await findLink('Our team')).toBeTruthy();
  expect(isItemExpanded(getLink('About us'))).toBe(true);
});
