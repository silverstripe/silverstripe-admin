/* global test, expect */
import ACTION_TYPES from '../TreeViewActionTypes';
import reducer, { initialTreeState } from '../TreeViewReducer';
import { STATUS } from '../TreeViewConstants';
import {
  areStoredAncestorsExpanded,
  getStoredAncestorIds,
  getUnloadedChainParentIds,
  isMissingFromLoadedChain,
  isItemShown,
} from '../TreeViewSelectors';
import { loadActions } from './mockTree';

function makeItem(id, parentId, extra = {}) {
  return { id, parentId, treeTitle: `Page ${id}`, hasChildren: false, ...extra };
}

function reduce(actions, state) {
  return actions.reduce(reducer, state);
}

// Load items 1 and 2 at the top level, 3 and 4 under 1, 5 under 3 and 7 under 2. Expand 1, 3 and 2.
function makeLoadedState() {
  return reduce([
    ...loadActions(0, [makeItem(1, 0, { hasChildren: true }), makeItem(2, 0, { hasChildren: true })]),
    ...loadActions(1, [makeItem(3, 1, { hasChildren: true }), makeItem(4, 1)]),
    ...loadActions(3, [makeItem(5, 3)]),
    ...loadActions(2, [makeItem(7, 2)]),
    { type: ACTION_TYPES.EXPAND_ITEM, id: 1 },
    { type: ACTION_TYPES.EXPAND_ITEM, id: 3 },
    { type: ACTION_TYPES.EXPAND_ITEM, id: 2 },
  ]);
}

test('TreeViewReducer clears the pending item on a failure of the latest open request or a new current item only', () => {
  const pending = reduce([
    { type: ACTION_TYPES.REVEAL_REQUEST, id: 1 },
    { type: ACTION_TYPES.OPEN_REQUEST, id: 3 },
    { type: ACTION_TYPES.OPEN_REQUEST, id: 4 },
  ], makeLoadedState());
  expect(pending.pendingId).toBe(4);
  expect(reducer(pending, { type: ACTION_TYPES.OPEN_FAILURE, openCount: pending.openCount - 1 })).toBe(pending);
  expect(reducer(pending, { type: ACTION_TYPES.REVEAL_REQUEST, id: 1 }).pendingId).toBe(4);

  expect(reducer(pending, { type: ACTION_TYPES.OPEN_FAILURE, openCount: pending.openCount }).pendingId).toBeNull();
  expect(reducer(pending, { type: ACTION_TYPES.REVEAL_REQUEST, id: 2 }).pendingId).toBeNull();
  expect(reducer(pending, { type: ACTION_TYPES.REVEAL_REQUEST, id: null }).pendingId).toBeNull();
});

test('TreeViewReducer ignores a response for a parent that is no longer loading', () => {
  const loaded = makeLoadedState();
  expect(reducer(loaded, { type: ACTION_TYPES.FETCH_CHILDREN_SUCCESS, parentId: 4, items: [makeItem(8, 4)] })).toBe(loaded);
  expect(reducer(loaded, { type: ACTION_TYPES.FETCH_CHILDREN_FAILURE, parentId: 4 })).toBe(loaded);

  const received = reduce(loadActions(4, [makeItem(9, 4)]), loaded);
  expect(reducer(received, { type: ACTION_TYPES.FETCH_CHILDREN_SUCCESS, parentId: 4, items: [makeItem(8, 4)] })).toBe(received);
  expect(reducer(received, { type: ACTION_TYPES.FETCH_CHILDREN_FAILURE, parentId: 4 })).toBe(received);
  expect(received.childIds[4]).toEqual([9]);
  expect(received.items[8]).toBeUndefined();
});

test('TreeViewReducer stores received items under the parent they were requested for', () => {
  const tree = reduce(loadActions(0, [makeItem(1, null), makeItem(2, 5)]));
  expect(tree.items[1].parentId).toBe(0);
  expect(tree.items[2].parentId).toBe(0);
});

test('TreeViewReducer takes a received item out of the children of its old parent', () => {
  const tree = reduce(loadActions(2, [makeItem(7, 2), makeItem(4, 2)]), makeLoadedState());
  expect(tree.childIds[1]).toEqual([3]);
  expect(tree.childIds[2]).toEqual([7, 4]);
  expect(tree.items[4].parentId).toBe(2);
});

test('TreeViewReducer does not expand again an ancestor collapsed since its reveal for a repeated success', () => {
  const tree = reduce([
    { type: ACTION_TYPES.COLLAPSE_ITEM, id: 2 },
    { type: ACTION_TYPES.REVEAL_REQUEST, id: 7 },
    { type: ACTION_TYPES.REVEAL_SUCCESS, revealCount: 1, ancestorIds: [2] },
    { type: ACTION_TYPES.COLLAPSE_ITEM, id: 2 },
  ], makeLoadedState());
  expect(tree.expanded).not.toContain(2);

  expect(reducer(tree, { type: ACTION_TYPES.REVEAL_SUCCESS, revealCount: 1, ancestorIds: [2] })).toBe(tree);
});

test('TreeViewReducer ignores the response to a reveal that a later reveal replaced, even of the same item', () => {
  const tree = reduce([
    { type: ACTION_TYPES.REVEAL_REQUEST, id: 7 },
    { type: ACTION_TYPES.REVEAL_REQUEST, id: 7 },
  ], makeLoadedState());
  expect(tree.revealCount).toBe(2);
  expect(reducer(tree, { type: ACTION_TYPES.REVEAL_FAILURE, revealCount: 1 })).toBe(tree);
  expect(reducer(tree, { type: ACTION_TYPES.REVEAL_SUCCESS, revealCount: 1, ancestorIds: [2] })).toBe(tree);
  expect(reducer(tree, { type: ACTION_TYPES.REVEAL_FAILURE, revealCount: 2 }).isRevealFailed).toBe(true);
});

test('TreeViewReducer keeps the children on the chain of the current item that lack the next item down', () => {
  const tree = reducer(makeLoadedState(), { type: ACTION_TYPES.REVEAL_REQUEST, id: 8 });
  expect(getUnloadedChainParentIds(tree, 8, [2])).toEqual([2]);
  expect(getUnloadedChainParentIds(tree, 8, [])).toEqual([0]);
  expect(getUnloadedChainParentIds(tree, 7, [2])).toEqual([]);
  expect(getUnloadedChainParentIds(tree, 9, [1, 4])).toEqual([4]);

  const revealed = reducer(tree, { type: ACTION_TYPES.REVEAL_SUCCESS, revealCount: 1, ancestorIds: [2] });
  expect(revealed.childIds).toBe(tree.childIds);
  expect(revealed.isRevealing).toBe(false);
});

test('getStoredAncestorIds walks the stored ancestors to the top level, and isItemShown needs their children intact and each expanded', () => {
  const tree = makeLoadedState();
  expect(getStoredAncestorIds(tree, 5)).toEqual([1, 3]);
  expect(getStoredAncestorIds(tree, 1)).toEqual([]);
  expect(getStoredAncestorIds(tree, 9)).toBeNull();
  expect(isItemShown(tree, 5)).toBe(true);
  expect(isItemShown(tree, 5, false)).toBe(false);
  expect(isItemShown(reducer(tree, { type: ACTION_TYPES.COLLAPSE_ITEM, id: 1 }), 5)).toBe(false);

  const moved = reduce(loadActions(1, [makeItem(4, 1)]), tree);
  expect(getStoredAncestorIds(moved, 5)).toBeNull();
  expect(isItemShown(moved, 5)).toBe(false);

  const cycle = reduce([...loadActions(1, [makeItem(2, 1)]), ...loadActions(2, [makeItem(1, 2)])]);
  expect(getStoredAncestorIds(cycle, 1)).toBeNull();
});

test('areStoredAncestorsExpanded needs the title row expanded and each stored ancestor expanded, whether or not their children hold the item', () => {
  const tree = makeLoadedState();
  expect(areStoredAncestorsExpanded(tree, 1)).toBe(true);
  expect(areStoredAncestorsExpanded(tree, 1, false)).toBe(false);
  expect(areStoredAncestorsExpanded(tree, 5)).toBe(true);
  const revealed = reducer(tree, { type: ACTION_TYPES.REVEAL_REQUEST, id: 5 });
  expect(areStoredAncestorsExpanded(reduce(loadActions(3, []), revealed), 5)).toBe(true);
  expect(areStoredAncestorsExpanded(reducer(tree, { type: ACTION_TYPES.COLLAPSE_ITEM, id: 3 }), 5)).toBe(false);
  expect(areStoredAncestorsExpanded(tree, 9)).toBe(false);
  expect(areStoredAncestorsExpanded(tree, null)).toBe(false);

  const orphan = reduce([...loadActions(8, [makeItem(9, 8)]), { type: ACTION_TYPES.EXPAND_ITEM, id: 8 }], tree);
  expect(areStoredAncestorsExpanded(orphan, 9)).toBe(false);

  const cycle = reduce([
    ...loadActions(1, [makeItem(2, 1)]),
    ...loadActions(2, [makeItem(1, 2)]),
    { type: ACTION_TYPES.EXPAND_ITEM, id: 1 },
    { type: ACTION_TYPES.EXPAND_ITEM, id: 2 },
  ]);
  expect(areStoredAncestorsExpanded(cycle, 1)).toBe(false);
});

test('isMissingFromLoadedChain is true only when the children of every parent above the item are loaded and one of them lacks the item', () => {
  const tree = makeLoadedState();
  expect(isMissingFromLoadedChain(tree, 5)).toBe(false);
  const revealed = reducer(tree, { type: ACTION_TYPES.REVEAL_REQUEST, id: 5 });
  expect(isMissingFromLoadedChain(reduce(loadActions(3, []), revealed), 5)).toBe(true);
  expect(isMissingFromLoadedChain(reduce(loadActions(1, [makeItem(4, 1)]), revealed), 5)).toBe(true);

  const childrenToLoad = reduce([
    { type: ACTION_TYPES.COLLAPSE_ITEM, id: 3 },
    { type: ACTION_TYPES.RELOAD_REQUEST, reloadKey: 1 },
    { type: ACTION_TYPES.EXPAND_ITEM, id: 3 },
  ], tree);
  expect(childrenToLoad.childIds[3]).toBeUndefined();
  expect(isMissingFromLoadedChain(childrenToLoad, 5)).toBe(false);
  expect(isMissingFromLoadedChain(tree, 9)).toBe(false);
  expect(isMissingFromLoadedChain(tree, null)).toBe(false);

  const cycle = reduce([...loadActions(1, [makeItem(2, 1)]), ...loadActions(2, [makeItem(1, 2)])]);
  expect(isMissingFromLoadedChain(cycle, 1)).toBe(false);
});

test('TreeViewReducer drops the children of a parent that stops being limited and ignores the answer it was awaiting', () => {
  const limited = reduce([
    { type: ACTION_TYPES.FETCH_CHILDREN_REQUEST, parentId: 2 },
    ...loadActions(0, [makeItem(1, 0), makeItem(2, 0, { hasChildren: true, limited: true })]),
  ], makeLoadedState());
  expect(limited.status[2]).toBe(STATUS.LOADING);

  const unlimited = reduce(loadActions(0, [makeItem(1, 0), makeItem(2, 0, { hasChildren: true })]), limited);
  expect(unlimited.childIds[2]).toBeUndefined();
  expect(unlimited.status[2]).toBeUndefined();
  expect(reducer(unlimited, { type: ACTION_TYPES.FETCH_CHILDREN_SUCCESS, parentId: 2, items: [] })).toBe(unlimited);
});

test('TreeViewReducer keeps the top level and the children on screen on a reload, and clears each status', () => {
  const tree = reduce([
    { type: ACTION_TYPES.COLLAPSE_ITEM, id: 2 },
    { type: ACTION_TYPES.FETCH_CHILDREN_REQUEST, parentId: 4 },
    { type: ACTION_TYPES.FETCH_CHILDREN_FAILURE, parentId: 4 },
    { type: ACTION_TYPES.EXPAND_ITEM, id: 4 },
    { type: ACTION_TYPES.FETCH_CHILDREN_REQUEST, parentId: 7 },
    { type: ACTION_TYPES.FETCH_CHILDREN_REQUEST, parentId: 3 },
  ], makeLoadedState());

  const reloaded = reducer(tree, { type: ACTION_TYPES.RELOAD_REQUEST, reloadKey: 1 });
  expect(Object.keys(reloaded.childIds)).toEqual(['0', '1', '3']);
  expect(reloaded.status).toEqual({});
  expect(reloaded.reloadKey).toBe(1);

  const underCollapsed = reduce([
    { type: ACTION_TYPES.COLLAPSE_ITEM, id: 1 },
    { type: ACTION_TYPES.RELOAD_REQUEST, reloadKey: 1 },
  ], makeLoadedState());
  expect(Object.keys(underCollapsed.childIds)).toEqual(['0', '2']);
});

test('TreeViewReducer removes an item that loaded children no longer hold and the items below, except on the chain of the current item', () => {
  const reloadActions = loadActions(1, [makeItem(4, 1)]);
  const tree = reduce(reloadActions, makeLoadedState());
  expect(Object.keys(tree.items)).toEqual(['1', '2', '4', '7']);
  expect(Object.keys(tree.childIds)).toEqual(['0', '1', '2']);
  expect(tree.expanded).toEqual([1, 3, 2]);

  const revealed = reduce([{ type: ACTION_TYPES.REVEAL_REQUEST, id: 5 }, ...reloadActions], makeLoadedState());
  expect(Object.keys(revealed.items)).toEqual(['1', '2', '3', '4', '5', '7']);
});

test('TreeViewReducer returns frozen state and leaves the given items alone', () => {
  const item = makeItem(3, 1);
  const tree = reduce(loadActions(1, [item]));
  expect(item).toEqual(makeItem(3, 1));
  expect(Object.isFrozen(item)).toBe(false);
  expect(Object.isFrozen(tree)).toBe(true);
  expect(Object.isFrozen(tree.items[3])).toBe(true);
  expect(() => { tree.childIds[1].push(4); }).toThrow(TypeError);
});

test('TreeViewReducer returns the same state when an action changes nothing', () => {
  const setScroll = { type: ACTION_TYPES.SET_SCROLL, scrollTop: 120 };
  const tree = reduce([
    setScroll,
    { type: ACTION_TYPES.REVEAL_REQUEST, id: 7 },
    { type: ACTION_TYPES.REVEAL_SUCCESS, revealCount: 1, ancestorIds: [2] },
  ], makeLoadedState());
  [
    { type: ACTION_TYPES.EXPAND_ITEM, id: 1 },
    { type: ACTION_TYPES.EXPAND_ITEM, id: 0 },
    { type: ACTION_TYPES.COLLAPSE_ITEM, id: 4 },
    setScroll,
    { type: ACTION_TYPES.REVEAL_SUCCESS, revealCount: 1, ancestorIds: [2] },
    { type: ACTION_TYPES.REVEAL_SUCCESS, revealCount: 0, ancestorIds: [2] },
    { type: ACTION_TYPES.FETCH_CHILDREN_SUCCESS, parentId: 1, items: [makeItem(3, 1)] },
    { type: ACTION_TYPES.FETCH_CHILDREN_FAILURE, parentId: 1 },
    { type: 'UNKNOWN_ACTION' },
  ].forEach((action) => {
    expect(reducer(tree, action)).toBe(tree);
  });

  const loading = reducer(tree, { type: ACTION_TYPES.FETCH_CHILDREN_REQUEST, parentId: 4 });
  expect(reducer(loading, { type: ACTION_TYPES.FETCH_CHILDREN_REQUEST, parentId: 4 })).toBe(loading);
  expect(reducer(undefined, { type: 'UNKNOWN_ACTION' })).toBe(initialTreeState);
});
