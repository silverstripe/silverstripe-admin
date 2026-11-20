/**
 * The state of one tree view and `treeViewReducer`, the pure function that changes the state.
 *
 * Terms the tree view comments use:
 * - children: a parent's loaded array of child ids.
 * - stored ancestors: the `parentId` links in `items` from an item up to the top level.
 * - chain: `TOP_LEVEL_ID`, the stored ancestors and the item, top level first.
 * - open request: a call of `onOpen`, from a click on an item, that does not return `false`.
 * - pending item: the item just clicked, highlighted until the current item changes or its open request fails.
 *
 * State fields whose name is not enough:
 * - `items`: the item data by id. An item's `parentId` is the parent whose children last held the item.
 * - `childIds`: the children of each loaded parent, by parent id.
 * - `status`: `STATUS.LOADING` or `STATUS.FAILED` by parent id.
 * - `currentId`: the id of the current item. `REVEAL_REQUEST` sets it from the `currentId` prop of `TreeView`, through
 *   `useRevealCurrentItem`.
 * - `isRevealFailed`: whether the ancestor ids of `currentId` failed to load. `useRevealCurrentItem` tries again on
 *   the next mount, and `reloadTree()` after a reload.
 *
 * An action that changes nothing returns the same state object, so the store notifies no listener.
 */
import deepFreeze from 'deep-freeze-strict';
import ACTION_TYPES from './TreeViewActionTypes';
import { STATUS, TOP_LEVEL_ID } from './TreeViewConstants';
import {
  areChildrenLoading,
  dropTopLevel,
  getStoredChain,
  isItemShown,
} from './TreeViewSelectors';

export const initialTreeState = deepFreeze({
  items: {},
  childIds: {},
  status: {},
  expanded: [],
  isTitleRowCollapsed: false,
  scrollTop: 0,
  currentId: null,
  isRevealing: false,
  isRevealFailed: false,
  revealCount: 0,
  reloadKey: null,
  pendingId: null,
  openCount: 0,
});

function dropKeys(object, keys) {
  const presentKeys = keys.filter((key) => Object.prototype.hasOwnProperty.call(object, key));
  if (!presentKeys.length) {
    return object;
  }
  const result = { ...object };
  presentKeys.forEach((key) => {
    delete result[key];
  });
  return result;
}

function updateTree(tree, changes) {
  const hasChanged = Object.keys(changes).some((key) => changes[key] !== tree[key]);
  return hasChanged ? { ...tree, ...changes } : tree;
}

function dropId(ids, id) {
  return ids.includes(id) ? ids.filter((otherId) => otherId !== id) : ids;
}

function addOnce(ids, newIds) {
  return newIds.reduce((result, id) => (result.includes(id) ? result : [...result, id]), ids);
}

// Return the ids of the items that left loaded children, and every item below them. `keptIds` is the current item's
// chain, which `reloadTree()` reads after a reload to find out whether the item moved. The removed ids stay in
// `expanded`, so an item that comes back is still expanded.
function getRemovedIds(items, childIds, keptIds) {
  const removedIds = new Set();
  const queue = Object.keys(items).map(Number).filter((id) => {
    const siblingIds = childIds[items[id].parentId];
    return Boolean(siblingIds) && !siblingIds.includes(id) && !keptIds.includes(id);
  });
  while (queue.length) {
    const id = queue.pop();
    if (!removedIds.has(id)) {
      removedIds.add(id);
      queue.push(...(childIds[id] || []));
    }
  }
  return [...removedIds];
}

function receiveChildren(tree, parentId, received) {
  const items = { ...tree.items };
  const childIds = { ...tree.childIds };
  const unlimitedIds = [];
  received.forEach((item) => {
    // An item received under a new parent leaves the old parent's children, or the item renders twice.
    const previous = items[item.id];
    if (previous && previous.parentId !== parentId && childIds[previous.parentId]) {
      childIds[previous.parentId] = dropId(childIds[previous.parentId], item.id);
    }
    // A parent that is no longer limited drops its old children and `status` entry.
    if (previous && previous.limited && !item.limited) {
      delete childIds[item.id];
      unlimitedIds.push(item.id);
    }
    items[item.id] = { ...item, parentId };
  });
  childIds[parentId] = received.map((item) => item.id);

  const removedIds = getRemovedIds(items, childIds, getStoredChain({ items }, tree.currentId) || []);
  removedIds.forEach((id) => {
    delete items[id];
    delete childIds[id];
  });

  return {
    ...tree,
    items,
    childIds,
    status: dropKeys(tree.status, [parentId, ...unlimitedIds, ...removedIds]),
  };
}

function receivePath(tree, ancestorIds) {
  return updateTree(tree, {
    isTitleRowCollapsed: false,
    expanded: addOnce(tree.expanded, dropTopLevel(ancestorIds)),
    isRevealing: false,
  });
}

// Keep the top-level items and the children of each shown, expanded item. With `status` cleared, the reducer ignores a
// response to a request from before the reload.
function reload(tree, reloadKey) {
  const areChildrenKept = (id) => id === TOP_LEVEL_ID || (tree.expanded.includes(id) && isItemShown(tree, id));
  const droppedKeys = Object.keys(tree.childIds).filter((id) => !areChildrenKept(Number(id)));
  return updateTree(tree, {
    reloadKey,
    childIds: dropKeys(tree.childIds, droppedKeys),
    status: dropKeys(tree.status, Object.keys(tree.status)),
  });
}

function reduceTree(tree, action) {
  switch (action.type) {
    case ACTION_TYPES.FETCH_CHILDREN_REQUEST:
      return areChildrenLoading(tree, action.parentId)
        ? tree
        : { ...tree, status: { ...tree.status, [action.parentId]: STATUS.LOADING } };

    case ACTION_TYPES.FETCH_CHILDREN_SUCCESS:
      return areChildrenLoading(tree, action.parentId) ? receiveChildren(tree, action.parentId, action.items) : tree;

    case ACTION_TYPES.FETCH_CHILDREN_FAILURE:
      if (!areChildrenLoading(tree, action.parentId)) {
        return tree;
      }
      // A parent whose children are loaded keeps them when a later load fails.
      return tree.childIds[action.parentId]
        ? { ...tree, status: dropKeys(tree.status, [action.parentId]) }
        : { ...tree, status: { ...tree.status, [action.parentId]: STATUS.FAILED } };

    case ACTION_TYPES.EXPAND_ITEM:
      return action.id === TOP_LEVEL_ID
        ? updateTree(tree, { isTitleRowCollapsed: false })
        : updateTree(tree, { expanded: addOnce(tree.expanded, [action.id]) });

    case ACTION_TYPES.COLLAPSE_ITEM:
      return action.id === TOP_LEVEL_ID
        ? updateTree(tree, { isTitleRowCollapsed: true })
        : updateTree(tree, { expanded: dropId(tree.expanded, action.id) });

    case ACTION_TYPES.SET_SCROLL:
      return updateTree(tree, { scrollTop: action.scrollTop });

    // Revealing another item clears the pending item. Revealing the same item again, after a reload, keeps it.
    case ACTION_TYPES.REVEAL_REQUEST:
      return updateTree(tree, {
        currentId: action.id,
        isRevealing: action.id !== null,
        isRevealFailed: false,
        pendingId: action.id === tree.currentId ? tree.pendingId : null,
        revealCount: tree.revealCount + 1,
      });

    case ACTION_TYPES.REVEAL_SUCCESS:
      return tree.isRevealing && tree.revealCount === action.revealCount ? receivePath(tree, action.ancestorIds) : tree;

    case ACTION_TYPES.REVEAL_FAILURE:
      return tree.isRevealing && tree.revealCount === action.revealCount
        ? updateTree(tree, { isRevealing: false, isRevealFailed: true })
        : tree;

    case ACTION_TYPES.RELOAD_REQUEST:
      return reload(tree, action.reloadKey);

    case ACTION_TYPES.OPEN_REQUEST:
      return { ...tree, pendingId: action.id, openCount: tree.openCount + 1 };

    // Only a failure of the latest open request clears the pending item.
    case ACTION_TYPES.OPEN_FAILURE:
      return action.openCount === tree.openCount ? updateTree(tree, { pendingId: null }) : tree;

    default:
      return tree;
  }
}

export default function treeViewReducer(tree = initialTreeState, action = {}) {
  const next = reduceTree(tree, action);
  return next === tree ? tree : deepFreeze(next);
}
