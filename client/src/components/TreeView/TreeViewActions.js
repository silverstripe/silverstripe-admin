import ACTION_TYPES from './TreeViewActionTypes';
import { TOP_LEVEL_ID } from './TreeViewConstants';
import {
  areChildrenLoading,
  areStoredAncestorsExpanded,
  getStoredAncestorIds,
  getUnloadedChainParentIds,
  isItemShown,
  isMissingFromLoadedChain,
  isTitleRowExpandedIn,
} from './TreeViewSelectors';
import { parseItemId } from './treeViewUtils';

export function expandItem(store, id) {
  store.dispatch({ type: ACTION_TYPES.EXPAND_ITEM, id });
}

export function collapseItem(store, id) {
  store.dispatch({ type: ACTION_TYPES.COLLAPSE_ITEM, id });
}

export function setScroll(store, scrollTop) {
  store.dispatch({ type: ACTION_TYPES.SET_SCROLL, scrollTop });
}

// Active requests by store, then by parent id, so a caller can wait for a request another call started.
const activeRequests = new WeakMap();

async function requestChildren(store, parentId, fetchChildren) {
  store.dispatch({ type: ACTION_TYPES.FETCH_CHILDREN_REQUEST, parentId });
  let children = null;
  try {
    children = await fetchChildren(parentId);
  } catch (error) {
    // A failed fetch leaves `children` null.
  }
  const isItemArray = Array.isArray(children) && children.every((item) => (
    item !== null && typeof item === 'object' && parseItemId(item.id) !== null
  ));
  // The server can send an id as a string. The tree compares ids as numbers.
  store.dispatch(isItemArray
    ? {
      type: ACTION_TYPES.FETCH_CHILDREN_SUCCESS,
      parentId,
      items: children.map((item) => ({ ...item, id: parseItemId(item.id) })),
    }
    : { type: ACTION_TYPES.FETCH_CHILDREN_FAILURE, parentId });
}

// Fetch the children of a parent, or return the active request for a parent that is already loading. A failed
// fetch or a malformed response dispatches `FETCH_CHILDREN_FAILURE`, so the promise never rejects.
export function loadChildren(store, parentId, fetchChildren) {
  const tree = store.getState();
  const parentItem = tree.items[parentId];
  const requests = activeRequests.get(store) || new Map();
  const activeRequest = requests.get(parentId);
  if (areChildrenLoading(tree, parentId)) {
    return activeRequest || Promise.resolve();
  }
  // A reload has cleared the loading status, but `activeRequest` is still out. The reducer ignores its response, so
  // fetch again once it settles.
  if (activeRequest) {
    return activeRequest.then(() => loadChildren(store, parentId, fetchChildren));
  }
  if (parentItem && parentItem.limited) {
    return Promise.resolve();
  }

  const request = requestChildren(store, parentId, fetchChildren).finally(() => requests.delete(parentId));
  requests.set(parentId, request);
  activeRequests.set(store, requests);
  return request;
}

// Reveal the item `id` by expanding its ancestors. Call `fetchPath` when the stored ancestors are not complete. Then
// load in parallel the children of each ancestor that are not loaded or do not hold the next item down.
export async function revealItem(store, id, fetchChildren, fetchPath) {
  store.dispatch({ type: ACTION_TYPES.REVEAL_REQUEST, id });
  if (id === null) {
    return;
  }
  // Read straight after the dispatch, `revealCount` is the number of this reveal. The reducer ignores the result of an
  // older reveal.
  const { revealCount } = store.getState();
  const storedAncestorIds = getStoredAncestorIds(store.getState(), id);
  if (storedAncestorIds) {
    store.dispatch({ type: ACTION_TYPES.REVEAL_SUCCESS, revealCount, ancestorIds: storedAncestorIds });
    return;
  }
  if (!fetchPath) {
    return;
  }
  try {
    const path = await fetchPath(id);
    const tree = store.getState();
    if (!tree.isRevealing || tree.revealCount !== revealCount) {
      return;
    }
    // The server can send an id as a string, and can start the path with the id of the top level.
    const ancestorIds = Array.isArray(path)
      ? path.map((ancestorId) => (Number(ancestorId) === TOP_LEVEL_ID ? TOP_LEVEL_ID : parseItemId(ancestorId)))
      : [null];
    if (ancestorIds.includes(null)) {
      store.dispatch({ type: ACTION_TYPES.REVEAL_FAILURE, revealCount });
      return;
    }
    const unloadedParentIds = getUnloadedChainParentIds(tree, id, ancestorIds);
    store.dispatch({ type: ACTION_TYPES.REVEAL_SUCCESS, revealCount, ancestorIds });
    await Promise.all(unloadedParentIds.map((parentId) => loadChildren(store, parentId, fetchChildren)));
  } catch (error) {
    store.dispatch({ type: ACTION_TYPES.REVEAL_FAILURE, revealCount });
  }
}

// Check whether the current item needs a new reveal after a reload, because it moved or its reveal failed.
function shouldRevealAfterReload(tree, { reloadKey, titleRowText, currentIdBefore, wasCurrentItemShown }) {
  const isLatestReload = tree.reloadKey === reloadKey;
  // An item that became current during the reload counts as shown.
  const wasItemShown = tree.currentId === currentIdBefore ? wasCurrentItemShown : tree.currentId !== null;
  const areAncestorsStillExpanded = areStoredAncestorsExpanded(tree, tree.currentId, isTitleRowExpandedIn(tree, titleRowText));
  const hasItemMoved = isMissingFromLoadedChain(tree, tree.currentId);
  return isLatestReload && (tree.isRevealFailed || (wasItemShown && areAncestorsStillExpanded && hasItemMoved));
}

// Fetch again all the children that `reload()` in `TreeViewReducer.js` keeps. After every response arrives, reveal
// the current item again if it moved or its reveal failed.
export async function reloadTree(store, reloadKey, { titleRowText, fetchChildren, fetchPath }) {
  // The reload can remove the current item from the children of its parent, so `reloadTree()` reads the state before
  // the reload.
  const treeBefore = store.getState();
  const currentIdBefore = treeBefore.currentId;
  const wasCurrentItemShown = isItemShown(treeBefore, currentIdBefore, isTitleRowExpandedIn(treeBefore, titleRowText));
  store.dispatch({ type: ACTION_TYPES.RELOAD_REQUEST, reloadKey });
  const keptParentIds = Object.keys(store.getState().childIds).map(Number);
  await Promise.all(keptParentIds.map((id) => loadChildren(store, id, fetchChildren)));

  const treeAfter = store.getState();
  if (shouldRevealAfterReload(treeAfter, { reloadKey, titleRowText, currentIdBefore, wasCurrentItemShown })) {
    await revealItem(store, treeAfter.currentId, fetchChildren, fetchPath);
  }
}

// Track the open request for the item `id`. `request` is what `onOpen` returned: `false` starts no open request, and a
// thenable that rejects or resolves to `false` fails it.
export async function trackOpenRequest(store, id, request) {
  if (request === false) {
    return;
  }
  store.dispatch({ type: ACTION_TYPES.OPEN_REQUEST, id });
  // Read straight after the dispatch, `openCount` is the number of this open request. The reducer ignores the failure of
  // an older open request.
  const { openCount } = store.getState();
  if (!request || typeof request.then !== 'function') {
    return;
  }
  let outcome;
  try {
    outcome = await request;
  } catch (error) {
    outcome = false;
  }
  if (outcome === false) {
    store.dispatch({ type: ACTION_TYPES.OPEN_FAILURE, openCount });
  }
}
