/**
 * This file holds the selectors of the tree view state. `TreeViewReducer.js` describes the state and the terms that
 * the comments in this file use.
 *
 * `TreeViewReducer.js` imports from this file, so this file must not import the reducer.
 */
import { STATUS, TOP_LEVEL_ID } from './TreeViewConstants';

export function dropTopLevel(ancestorIds) {
  return ancestorIds.filter((ancestorId) => ancestorId !== TOP_LEVEL_ID);
}

function getChainLinks(chain) {
  return chain.slice(0, -1).map((parentId, index) => [parentId, chain[index + 1]]);
}

export function areChildrenLoading(tree, parentId) {
  return tree.status[parentId] === STATUS.LOADING;
}

function areChildrenLoaded(tree, parentId) {
  return Boolean(tree.childIds[parentId]);
}

function isChildLinked(tree, [parentId, childId]) {
  return areChildrenLoaded(tree, parentId) && tree.childIds[parentId].includes(childId);
}

// Return the chain of the item `id`, or null when the links do not reach the top level.
export function getStoredChain({ items }, id) {
  const chain = [id];
  let item = items[id];
  while (item) {
    if (item.parentId === TOP_LEVEL_ID) {
      return [TOP_LEVEL_ID, ...chain];
    }
    if (chain.includes(item.parentId)) {
      return null;
    }
    chain.unshift(item.parentId);
    item = items[item.parentId];
  }
  return null;
}

// Return the ancestor ids of the item `id`, top level first. Return null when the children of a parent above the item
// lack the next item down.
export function getStoredAncestorIds(tree, id) {
  const chain = getStoredChain(tree, id);
  const isChainComplete = Boolean(chain) && getChainLinks(chain).every((link) => isChildLinked(tree, link));
  return isChainComplete ? chain.slice(1, -1) : null;
}

// Check whether the title row is expanded. A tree without a `titleRowText` has no title row to collapse.
export function isTitleRowExpandedIn(tree, titleRowText) {
  return !titleRowText || !tree.isTitleRowCollapsed;
}

export function isItemShown(tree, id, isTitleRowExpanded = true) {
  const ancestorIds = getStoredAncestorIds(tree, id);
  return Boolean(ancestorIds) && isTitleRowExpanded
    && ancestorIds.every((ancestorId) => tree.expanded.includes(ancestorId));
}

// Return the id of the highlighted item: the pending item, or else the current item.
export function getHighlightedId(tree) {
  return tree.pendingId === null ? tree.currentId : tree.pendingId;
}

// Check whether the title row and every stored ancestor of the item `id` are expanded.
export function areStoredAncestorsExpanded(tree, id, isTitleRowExpanded = true) {
  const chain = getStoredChain(tree, id);
  return Boolean(chain) && isTitleRowExpanded
    && chain.slice(1, -1).every((ancestorId) => tree.expanded.includes(ancestorId));
}

// Check whether the item `id` has moved or gone. The children of every parent above the item are loaded, and the
// children of one parent no longer hold the item.
export function isMissingFromLoadedChain(tree, id) {
  const chain = getStoredChain(tree, id);
  const links = chain ? getChainLinks(chain) : [];
  const areAllChildrenLoaded = links.every(([parentId]) => areChildrenLoaded(tree, parentId));
  const isEveryChildLinked = links.every((link) => isChildLinked(tree, link));
  return Boolean(chain) && areAllChildrenLoaded && !isEveryChildLinked;
}

// Return the parent ids above the item `id` whose children are not loaded or lack the next item down.
export function getUnloadedChainParentIds(tree, id, ancestorIds) {
  return getChainLinks([TOP_LEVEL_ID, ...dropTopLevel(ancestorIds), id])
    .filter((link) => !isChildLinked(tree, link))
    .map(([parentId]) => parentId);
}
