import React, { useCallback, useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { TOP_LEVEL_ID } from './TreeViewConstants';
import { isItemShown, isTitleRowExpandedIn } from './TreeViewSelectors';
import { collapseItem, expandItem, trackOpenRequest } from './TreeViewActions';
import TreeViewContext from './TreeViewContext';
import { TreeViewItems } from './TreeViewItem';
import TreeViewToggle from './TreeViewToggle';
import {
  useReloadOnKeyChange,
  useRestoreScroll,
  useRevealCurrentItem,
  useScrollToCurrentItem,
} from './treeViewHooks';
import { getTreeStore, useTreeValue } from './treeViewStore';
import { parseItemId } from './treeViewUtils';

const TreeView = ({
  treeId,
  fetchChildren,
  fetchPath = null,
  currentId: givenCurrentId = null,
  reloadKey = null,
  onOpen = null,
  onShowAsList = null,
  label,
  titleRowText = '',
  isSidePanel = false,
}) => {
  const store = getTreeStore(treeId);
  const navRef = useRef(null);
  const hasTitleRow = Boolean(titleRowText);
  const currentId = parseItemId(givenCurrentId);
  const isTitleRowExpanded = useTreeValue(store, (tree) => isTitleRowExpandedIn(tree, titleRowText));
  const isCurrentItemShown = useTreeValue(
    store,
    (tree) => isItemShown(tree, currentId, isTitleRowExpandedIn(tree, titleRowText)),
  );

  // `useReloadOnKeyChange` calls `reloadTree()`, which reads the `currentId` that `useRevealCurrentItem` stores. Keep
  // `useRevealCurrentItem` first.
  useRevealCurrentItem(store, { currentId, fetchChildren, fetchPath });
  useReloadOnKeyChange(store, { reloadKey, titleRowText, fetchChildren, fetchPath });
  useRestoreScroll(store, navRef);
  useScrollToCurrentItem(navRef, currentId, isCurrentItemShown);

  const openItem = useCallback((item, event) => {
    if (onOpen) {
      event.preventDefault();
      trackOpenRequest(store, item.id, onOpen(item, event));
    }
  }, [store, onOpen]);
  const showAsList = useCallback((item, event) => {
    if (onShowAsList) {
      event.preventDefault();
      onShowAsList(item, event);
    }
  }, [onShowAsList]);

  // Each `TreeViewItem` reads the current item and the highlighted item from the store, not from `TreeViewContext`. A
  // new current or pending item then renders only the items whose state changes.
  const context = useMemo(() => ({
    store,
    fetchChildren,
    onOpen: openItem,
    onShowAsList: showAsList,
  }), [store, fetchChildren, openItem, showAsList]);

  const handleTitleRowToggle = () => (
    isTitleRowExpanded ? collapseItem(store, TOP_LEVEL_ID) : expandItem(store, TOP_LEVEL_ID)
  );

  return (
    <nav ref={navRef} className={classnames('tree-view', { 'tree-view--side-panel': isSidePanel })} aria-label={label}>
      {hasTitleRow && (
        <div className={classnames('tree-view__title-row', { 'tree-view__title-row--expanded': isTitleRowExpanded })}>
          <TreeViewToggle title={titleRowText} isExpanded={isTitleRowExpanded} onClick={handleTitleRowToggle} />
          <span className="tree-view__title-row-text">{titleRowText}</span>
        </div>
      )}
      {isTitleRowExpanded && (
        <ul className="tree-view__list">
          <TreeViewContext.Provider value={context}>
            <TreeViewItems parentId={TOP_LEVEL_ID} />
          </TreeViewContext.Provider>
        </ul>
      )}
    </nav>
  );
};

TreeView.propTypes = {
  treeId: PropTypes.string.isRequired,
  fetchChildren: PropTypes.func.isRequired,
  fetchPath: PropTypes.func,
  currentId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  reloadKey: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  onOpen: PropTypes.func,
  onShowAsList: PropTypes.func,
  label: PropTypes.string.isRequired,
  titleRowText: PropTypes.string,
  isSidePanel: PropTypes.bool,
};

export default TreeView;
