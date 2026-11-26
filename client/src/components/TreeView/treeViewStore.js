/**
 * Holds the state of each tree view by `treeId` for the life of the page. A remounted tree starts where it left off,
 * including any response that arrived while it was unmounted. Trees with the same `treeId` share one store.
 */
import { useSyncExternalStore } from 'react';
import treeViewReducer, { initialTreeState } from './TreeViewReducer';

// The store of each tree view by `treeId`, exported for tests to clear.
export const treeStores = new Map();

function createStore() {
  let state = initialTreeState;
  const listeners = new Set();
  return {
    getState: () => state,
    dispatch: (action) => {
      const next = treeViewReducer(state, action);
      if (next !== state) {
        state = next;
        listeners.forEach((listener) => listener());
      }
    },
    subscribe: (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}

export function getTreeStore(treeId) {
  if (!treeStores.has(treeId)) {
    treeStores.set(treeId, createStore());
  }
  return treeStores.get(treeId);
}

// `select` must return the same value for the same state. A new object or array on each call re-renders without end.
export function useTreeValue(store, select) {
  return useSyncExternalStore(store.subscribe, () => select(store.getState()));
}
