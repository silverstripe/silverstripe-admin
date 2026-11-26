import { useEffect, useLayoutEffect, useReducer, useRef } from 'react';
import { loadChildren, reloadTree, revealItem, setScroll } from './TreeViewActions';
import { getScrollContainer } from './treeViewUtils';

// Reveal the current item only when `currentId` changes. A remount then shows the items as the user left them.
export function useRevealCurrentItem(store, { currentId, fetchChildren, fetchPath }) {
  const hasMountedRef = useRef(false);
  const [, renderAgain] = useReducer((count) => count + 1, 0);
  useLayoutEffect(() => {
    const tree = store.getState();
    const isMount = !hasMountedRef.current;
    hasMountedRef.current = true;
    // This effect runs again each time the host passes new functions. Only a mount retries a failed reveal, so those
    // runs do not call `fetchPath` again.
    const isRetryDue = tree.isRevealFailed && isMount;
    if (tree.currentId !== currentId || isRetryDue) {
      revealItem(store, currentId, fetchChildren, fetchPath);
      // On a mount, `revealItem()` changes the store before the new items subscribe to it. The items subscribe in a
      // passive effect, so they can paint the old state for one frame. A state update here re-renders before paint.
      if (isMount) {
        renderAgain();
      }
    }
  }, [store, currentId, fetchChildren, fetchPath]);
}

// Reload the tree when `reloadKey` changes. A layout effect runs before the passive effect in `useLoadChildren`. On a
// first mount, `useLoadChildren` then finds the top level already loading and does not fetch it again.
export function useReloadOnKeyChange(store, { reloadKey, titleRowText, fetchChildren, fetchPath }) {
  useLayoutEffect(() => {
    if (store.getState().reloadKey !== reloadKey) {
      reloadTree(store, reloadKey, { titleRowText, fetchChildren, fetchPath });
    }
  }, [store, reloadKey, titleRowText, fetchChildren, fetchPath]);
}

// Restore the scroll offset of the element that scrolls the tree before paint. The cleanup saves the offset before
// React detaches the tree.
export function useRestoreScroll(store, navRef) {
  useLayoutEffect(() => {
    const nav = navRef.current;
    const scrollContainer = getScrollContainer(nav);
    // The page scroll belongs to the host page, so a tree with no scrolling element around it leaves the page alone.
    if (scrollContainer === document.scrollingElement) {
      return undefined;
    }
    scrollContainer.scrollTop = store.getState().scrollTop;
    return () => {
      // A detached element reads a `scrollTop` of 0. Saving that value loses the offset.
      if (nav.isConnected) {
        setScroll(store, scrollContainer.scrollTop);
      }
    };
  }, [store, navRef]);
}

// Scroll to the current item once for each current id. Later expands and reloads then do not scroll back.
export function useScrollToCurrentItem(navRef, currentId, isCurrentItemShown) {
  const scrolledIdRef = useRef(null);
  useLayoutEffect(() => {
    if (currentId === null) {
      scrolledIdRef.current = null;
    } else if (isCurrentItemShown && scrolledIdRef.current !== currentId) {
      scrolledIdRef.current = currentId;
      // Keep this selector the same as the `data-id` and the class names that `TreeViewItem` renders.
      const link = navRef.current.querySelector(`[data-id="${currentId}"] > .tree-view__link`);
      if (link) {
        link.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [navRef, currentId, isCurrentItemShown]);
}

// Load the children of `parentId` when `areChildrenNeeded` is true and no load has started or failed.
export function useLoadChildren(store, parentId, fetchChildren, areChildrenNeeded) {
  useEffect(() => {
    // Read the state again: the children can have loaded or failed since this render.
    const tree = store.getState();
    if (areChildrenNeeded && !tree.childIds[parentId] && !tree.status[parentId]) {
      loadChildren(store, parentId, fetchChildren);
    }
  }, [store, parentId, fetchChildren, areChildrenNeeded]);
}
