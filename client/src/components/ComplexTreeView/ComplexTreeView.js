/**
 * Note: these docs are temporary until the drag-and-drop implementation is stable.
 *
 * ComplexTreeView Component
 *
 * A modern React implementation of the Silverstripe CMS page tree, replacing the legacy jstree
 * drag-and-drop implementation. Uses react-complex-tree library with native drag-and-drop support.
 *
 * DRAG-AND-DROP ARCHITECTURE:
 * ==========================
 *
 * This component uses react-complex-tree's native drag-and-drop (not dnd-kit) to handle tree
 * reordering. The approach mirrors the legacy jstree flow in LeftAndMain.Tree.js:
 *
 * LEGACY FLOW (jstree):
 * --------------------
 * 1. User drags node to new parent
 * 2. move_node.jstree event fires (line 28-78 in LeftAndMain.Tree.js)
 * 3. canMove() async check validates permissions (line 303-305)
 * 4. On success, call savetreenode endpoint with: ID, ParentID, SiblingIDs
 * 5. On 403 error, rollback the move via $.jstree.rollback()
 * 6. On success, call updateNodesFromServer() which fetches updatetreenodes endpoint
 * 7. updatetreenodes endpoint returns updated node HTML + metadata
 * 8. Update tree state with refreshed node data
 *
 * NEW FLOW (react-complex-tree):
 * ----------------------------
 * 1. Enable via UncontrolledTreeEnvironment props:
 *    - canDragAndDrop={true} - enables drag support
 *    - canReorderItems={true} - allows reordering within same parent
 *    - canDropOnFolder={true} - allows dropping on folder nodes
 *    - canDrag={canDragFunction} - validate if items can be dragged (permission check)
 *    - canDropAt={canDropAtFunction} - validate drop target (prevent invalid moves)
 *    - onDrop={handleDropFunction} - called after successful drop
 *
 * 2. canDrag(items) function:
 *    - Validates that user has permission to drag selected items
 *    - Replaces legacy canMove() async check
 *    - Returns boolean (false prevents drag initiation)
 *    - Can check item.data properties like archived status, etc.
 *
 * 3. canDropAt(items, target) function:
 *    - Validates that drop location is valid (replaces check_move in jstree config)
 *    - target.targetType: 'on-item' (drop on folder) or 'between-items' (reorder)
 *    - For 'on-item': target.targetItem is the destination folder
 *    - For 'between-items': target.parentItem is the parent, target.index is position
 *    - Returns false to prevent drop (shows visual feedback during drag)
 *    - Can check: destination has children allowed, not archived, not root in invalid position, etc.
 *
 * 4. onDrop(items, target) handler:
 *    - Called after drop succeeds (user releases mouse)
 *    - Extract: draggedItem ID, targetParentID, targetIndex
 *    - Call savetreenode endpoint with: ID, ParentID, SiblingIDs
 *    - On 403 error: revert tree state (no automatic rollback like jstree)
 *    - On success: call updateNodesFromServer to refresh node HTML
 *    - Update tree state with refreshed data
 *
 * KEY DIFFERENCES FROM LEGACY:
 * ---------------------------
 * - No automatic rollback: must manually revert tree state on API error
 * - No async permission check during drag: canMove() must complete before drag starts
 * - DataProvider updates: changes to items require calling setTreeData with new items map
 * - Synthetic indicator nodes (-1, -2, etc) for "too many records" still supported
 * - Updates happen via hook methods (loadSubtree, mergeSubtree) not direct DOM manipulation
 *
 * INTEGRATION POINTS:
 * ------------------
 * - Backend: /admin/pages/tree/savetreenode (save move)
 * - Backend: /admin/pages/tree/updatetreenodes (refresh node data)
 * - Frontend: useComplexTreeViewApi hook manages data state and API calls
 * - Frontend: canDrag, canDropAt validation for permission checks
 * - Frontend: onDrop handler executes savetreenode and refreshes tree
 *
 * @see LeftAndMain.Tree.js lines 28-78 (move_node callback)
 * @see LeftAndMain.Tree.js lines 303-305 (canMove method)
 * @see LeftAndMain.Tree.js lines 533-596 (updateNodesFromServer method)
 * @see LeftAndMain.Tree.js lines 326-354 (check_move validation)
 * @see REACT-COMPLEX-TREE-DND-DOCS.txt (react-complex-tree drag-drop API)
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { UncontrolledTreeEnvironment, Tree } from 'react-complex-tree';
import useComplexTreeViewApi from './useComplexTreeViewApi';
import TreeContextMenu from './TreeContextMenu';

const CSS_CLASS = 'complex-tree-view';
const TREE_ID = 'tree-1';

const ComplexTreeView = ({
  currentRecordID = 0,
  apiEndpoint = '/admin/pages/tree/jsonview',
  contextMenuUrls = null,
}) => {
  const [loadingNodeId, setLoadingNodeId] = useState(null);
  const [contextMenuOpen, setContextMenuOpen] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const [contextMenuNode, setContextMenuNode] = useState(null);
  const {
    data,
    dataProvider,
    error,
    initialViewState,
    loading,
    rootId,
    loadSubtree,
    mergeSubtree,
    saveNode,
    updateNodes,
  } = useComplexTreeViewApi(TREE_ID, currentRecordID, apiEndpoint);

  /**
   * Determines if context menu should be rendered based on available URLs.
   */
  const shouldRenderContextMenu = () => {
    if (!contextMenuUrls) {
      return false;
    }
    return (
      contextMenuUrls.duplicate
      || contextMenuUrls.duplicateWithChildren
      || contextMenuUrls.addChild
    );
  };

  /**
   * Prevents dragging of limited indicator nodes and the root node.
   */
  const handleCanDrag = (items) => {
    if (!items || items.length === 0) {
      return false;
    }
    const item = items[0];
    if (item.data.isLimitedIndicator === true) {
      return false;
    }
    if (item.data.id === 0) {
      return false;
    }
    return true;
  };

  // /**
  //  * Determines if a drop location is valid.
  //  * Prevents dropping on limited indicator nodes, on self, or into descendants.
  //  */
  // const handleCanDrop = (items, target) => {
  //   if (!items || items.length === 0 || !target) {
  //     return false;
  //   }
  //   const draggedItem = items[0];
  //   const draggedId = draggedItem.data.id;
  //   if (draggedId === 0) {
  //     return false;
  //   }
  //   let targetParentId = null;
  //   if (target.targetType === 'on-item') {
  //     const targetItem = target.targetItem;
  //     if (targetItem.data.isLimitedIndicator === true) {
  //       return false;
  //     }
  //     targetParentId = targetItem.data.id;
  //   } else if (target.targetType === 'between-items') {
  //   console.log('1')
  //     const parentItem = target.parentItem;
  //   console.log('2')
  //     if (parentItem === 'root') {
  //   console.log('3')
  //       targetParentId = 0;
  //     } else {
  //   console.log('4')
  //       if (parentItem.data && parentItem.data.isLimitedIndicator === true) {
  //   console.log('5')
  //         return false;
  //       }
  //   console.log('6')
  //       targetParentId = parentItem.data.id;
  //     }
  //   } else if (target.targetType === 'item') {
  //   console.log('item')
  //     return true;
  //   }
  //   console.log('7')
  //   if (draggedId === targetParentId) {
  //     return false;
  //   }
  //   if (!data || !data.items) {
  //     return true;
  //   }
  //   const draggedItemData = data.items[draggedId.toString()];
  //   if (!draggedItemData || !draggedItemData.children) {
  //     return true;
  //   }
  //   if (draggedItemData.children.includes(targetParentId.toString())) {
  //     return false;
  //   }
  //   return true;
  // };

  /**
   * Handles drop event - saves the node to the server with new parent and order.
   * react-complex-tree updates its internal state BEFORE calling onDrop, so data.items
   * already reflects the new order. We simply read the current children array and send
   * that as the siblingIds (filtering out synthetic limited indicator nodes).
   * On error, shows message and does not update tree (react-complex-tree reverts automatically).
   */
  const handleDrop = async (items, target) => {
    if (!items || items.length === 0 || !target || !data) {
      return;
    }
    try {
      const draggedItem = items[0];
      const draggedId = draggedItem.data.id;
      let parentItem = null;
      if (target.targetType === 'on-item') {
        parentItem = target.targetItem;
      } else if (target.targetType === 'between-items') {
        parentItem = data.items[target.parentItem];
      }
      const parentId = parentItem.data === 'Root' ? 0 : parentItem.data.id;
      const siblingIds = parentItem.children
        .map(childId => data.items[childId])
        .filter(child => child && child.data && child.data.isLimitedIndicator !== true)
        .map(child => child.data.id);
      await saveNode(draggedId, parentId, siblingIds);
      await updateNodes([draggedId]);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Error saving node:', err);
    }
  };

  /**
   * Handle click on "show as list" link in limited indicator nodes.
   */
  const handleTooManyRecordsClick = () => {
    localStorage.setItem('ss.pages-view-type', 'listview');
  };

  /**
   * Handle context menu open on right-click.
   */
  const handleContextMenu = (event, item) => {
    event.preventDefault();
    event.stopPropagation();
    setContextMenuPosition({ x: event.clientX, y: event.clientY });
    setContextMenuNode(item);
    setContextMenuOpen(true);
  };

  /**
   * Handle context menu close.
   */
  const handleContextMenuClose = () => {
    setContextMenuOpen(false);
    setContextMenuNode(null);
  };

  /**
   * Handle context menu action selection.
   * Executes navigation based on action type or makes POST requests to context menu endpoints.
   */
  const handleMenuAction = async (action, nodeId, payload = null) => {
    switch (action) {
      case 'edit':
        window.location.assign(`/admin/pages/edit/show/${nodeId}`);
        break;
      case 'showAsList':
        localStorage.setItem('ss.pages-view-type', 'listview');
        window.location.assign(`/admin/pages/?ParentID=${nodeId}`);
        break;
      case 'addPage':
        if (payload && payload.childType) {
          window.location.assign(`/admin/pages/add?parent=${nodeId}&type=${payload.childType}`);
        }
        break;
      case 'duplicate':
        if (payload && typeof payload.includeSubpages === 'boolean') {
          try {
            const endpoint = payload.includeSubpages
              ? contextMenuUrls.duplicateWithChildren
              : contextMenuUrls.duplicate;
            if (endpoint) {
              const url = endpoint.replace('%s', nodeId);
              const response = await fetch(url, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
              });
              if (!response.ok) {
                // eslint-disable-next-line no-console
                console.error(`Duplicate action failed with status ${response.status}`);
                break;
              }
              const responseData = await response.json();
              if (responseData.success && responseData.newNodeID) {
                window.location.assign(`/admin/pages/edit/show/${responseData.newNodeID}`);
              }
            }
          } catch (err) {
            // eslint-disable-next-line no-console
            console.error('Error duplicating node:', err);
          }
        }
        break;
      default:
        break;
    }
  };

  /**
   * Renders the DOM for a tree item label with context menu support.
   * For synthetic limited indicator nodes, renders as a clickable link.
   * Otherwise renders the regular title with right-click support.
   */
  const renderTreeItemTitle = ({ item }) => {
    const isLimitedIndicator = item.data.isLimitedIndicator === true;
    const isLoading = loadingNodeId === item.index;

    if (isLimitedIndicator) {
      return (
        <span className={`${CSS_CLASS}__item-link ${CSS_CLASS}__item-link--limited`}>
          Too many records (
          <a href={item.data.linkUrl} onClick={handleTooManyRecordsClick} className={`${CSS_CLASS}__limited-link`}>show as list</a>
          )
        </span>
      );
    }

    if (isLoading) {
      return (
        <span className={`${CSS_CLASS}__item-link`} data-item-id={item.index}>
          <span className={`${CSS_CLASS}__loading`}>Loading...</span>
          {item.data.title}
        </span>
      );
    }

    const statusFlags = item.data.statusFlags || [];
    return (
      <span
        className={`${CSS_CLASS}__item-link`}
        data-item-id={item.index}
        onContextMenu={(e) => handleContextMenu(e, item)}
        role="presentation"
      >
        {item.data.title}
        {statusFlags.length > 0 && statusFlags.map((flag) => (
          <span
            key={flag.cssClass}
            className={`badge ${flag.cssClass}`}
            title={flag.title}
          >
            { flag.text }
          </span>
        ))}
      </span>
    );
  };

  /**
   * This is triggered by Double Click (mouse) or Enter (keyboard) on a focused item.
   * For branch nodes, this should only navigate if the item is a leaf or if the title was clicked.
   */
  const handlePrimaryAction = (items) => {
    window.location.href = `/admin/pages/edit/show/${items.data.id}`;
  };

  /**
   * Handle click events on tree item titles for branch nodes.
   * Only navigates if clicking on the title, not dragging.
   * Leaf nodes navigate on primaryAction (double-click or Enter).
   */
  const handleTitleClick = (e) => {
    // Ignore right-click (button 2)
    if (e.button === 2) {
      return;
    }
    const titleSpan = e.target.closest('.complex-tree-view__item-link');
    if (!titleSpan) {
      return;
    }
    const button = titleSpan.closest('[data-rct-item-interactive="true"]');
    if (!button) {
      return;
    }
    const treeItem = button.closest('[role="treeitem"]');
    if (!treeItem || !treeItem.hasAttribute('aria-expanded')) {
      return;
    }
    // Only navigate if this is a single click (not during drag)
    const itemId = titleSpan.getAttribute('data-item-id');
    if (itemId && data && data.items && data.items[itemId]) {
      const item = data.items[itemId];
      if (item && item.data && item.data.id) {
        e.preventDefault();
        e.stopPropagation();
        window.location.href = `/admin/pages/edit/show/${item.data.id}`;
      }
    }
  };

  /**
   * Handler for item selection - no-op for now
   */
  const handleSelectItems = () => {};

  /**
   * Handles expanding a tree item. If the item has unloaded children,
   * loads the subtree and merges it into the tree.
   */
  // eslint-disable-next-line no-unused-vars
  const handleExpandItem = async (item, treeId) => {
    const hasUnloadedChildren = item.data.expanded === false && item.data.count > 0 && item.children.length === 0;
    if (hasUnloadedChildren) {
      try {
        setLoadingNodeId(item.index);
        const subtree = await loadSubtree(item.data.id);
        await mergeSubtree(item.data.id, subtree.items, subtree.subtreeChildIds);
      } finally {
        setLoadingNodeId(null);
      }
    }
  };

  /**
   * INTERCEPT KEYDOWN
   * This is the key fix. We intercept the event at the container level.
   */
  const handleRootKeyDown = (e) => {
    // Check if the key pressed is Space
    if (e.key !== ' ') {
      return;
    }
    // Find the closest tree item container
    const treeItem = e.target.closest('[role="treeitem"]');

    // If we are on a tree item...
    if (treeItem) {
      // Check if it is a Folder. Folders have 'aria-expanded' (true or false).
      // Leaves do NOT have this attribute.
      const isFolder = treeItem.hasAttribute('aria-expanded');

      // If it's NOT a folder (it's a leaf), prevent the default browser behavior.
      // This stops the browser from turning "Space" into a "Click" event.
      if (!isFolder) {
        e.preventDefault();
      }
    }
  };

  if (loading) {
    return <div>Loading page tree...</div>;
  }
  if (error) {
    return <div style={{ color: 'red' }}>Error loading data: {error}</div>;
  }
  if (!dataProvider || !initialViewState) {
    return <div>No data available.</div>;
  }

  return (
    <div
      className={CSS_CLASS}
      onKeyDown={handleRootKeyDown}
      onClickCapture={handleTitleClick}
    >
      <UncontrolledTreeEnvironment
        dataProvider={dataProvider}
        getItemTitle={item => item.data.title}
        viewState={initialViewState}
        canDragAndDrop
        canDropOnFolder
        canReorderItems
        canDrag={handleCanDrag}
        // canDropAt={handleCanDrop}
        onDrop={handleDrop}
        canRenameItems={false}
        canSearchItems={false}
        canSearchByStartingTyping={false}
        renderItemTitle={renderTreeItemTitle}
        onPrimaryAction={handlePrimaryAction}
        onSelectItems={handleSelectItems}
        onExpandItem={handleExpandItem}
      >
        <Tree treeId={TREE_ID} rootItem={rootId} treeLabel="Page Tree" />
      </UncontrolledTreeEnvironment>
      {shouldRenderContextMenu() && (
        <TreeContextMenu
          isOpen={contextMenuOpen}
          position={contextMenuPosition}
          node={contextMenuNode}
          onClose={handleContextMenuClose}
          onMenuAction={handleMenuAction}
          contextMenuUrls={contextMenuUrls}
        />
      )}
    </div>
  );
};

ComplexTreeView.propTypes = {
  currentRecordID: PropTypes.number,
  apiEndpoint: PropTypes.string,
  contextMenuUrls: PropTypes.shape({
    duplicate: PropTypes.string,
    duplicateWithChildren: PropTypes.string,
    addChild: PropTypes.string,
  }),
};

export { ComplexTreeView as Component };
export default ComplexTreeView;
