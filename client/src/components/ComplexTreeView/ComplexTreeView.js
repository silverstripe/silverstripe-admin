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
 *    - canDrag={handleCanDrag} - validates if items can be dragged
 *    - onDrop={handleDrop} - called after successful drop
 *
 * 2. canDrag(items) function (handleCanDrag):
 *    - Prevents dragging of synthetic limited indicator nodes
 *    - Prevents dragging of the root node (id === 0)
 *    - Returns boolean (false prevents drag initiation)
 *
 * 3. onDrop(items, target) handler (handleDrop):
 *    - Called after drop succeeds (user releases mouse)
 *    - Extract: draggedItem ID, targetParentID from target
 *    - Reads current children order from react-complex-tree state (already updated)
 *    - Filters out synthetic limited indicator nodes from sibling IDs
 *    - Calls saveNode() to persist via savejsonnode endpoint
 *    - Calls updateNodes() to refresh node data via updatejsonnodes endpoint
 *    - On error: logs to console (react-complex-tree handles visual rollback)
 *
 * KEY DIFFERENCES FROM LEGACY:
 * ---------------------------
 * - react-complex-tree updates internal state BEFORE calling onDrop
 * - No async permission check during drag (permissions handled server-side)
 * - DataProvider updates via hook methods (loadSubtree, mergeSubtree)
 * - Synthetic indicator nodes (-1, -2, etc) for "too many records" are filtered from sibling IDs
 * - Endpoints are configurable via props (saveNodeEndpoint, updateNodesEndpoint)
 *
 * INTEGRATION POINTS:
 * ------------------
 * - Backend: savejsonnode endpoint (configurable via saveNodeEndpoint prop)
 * - Backend: updatejsonnodes endpoint (configurable via updateNodesEndpoint prop)
 * - Frontend: useComplexTreeViewApi hook manages data state and API calls
 * - Frontend: handleCanDrag validation prevents dragging invalid items
 * - Frontend: handleDrop executes save and refreshes tree
 *
 * @see LeftAndMain.Tree.js lines 28-78 (move_node callback)
 * @see LeftAndMain.Tree.js lines 303-305 (canMove method)
 * @see LeftAndMain.Tree.js lines 533-596 (updateNodesFromServer method)
 * @see LeftAndMain.Tree.js lines 326-354 (check_move validation)
 */

import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { UncontrolledTreeEnvironment, Tree } from 'react-complex-tree';
import Config from 'lib/Config';
import useComplexTreeViewApi from './useComplexTreeViewApi';
import TreeContextMenu from './TreeContextMenu';

const CSS_CLASS = 'complex-tree-view';
const TREE_ID = 'tree-1';

const ComplexTreeView = ({
  currentRecordID = 0,
  // apiEndpoint = '/admin/pages/tree/jsonview',
  apiEndpoint,
  editUrlPattern = null,
  listUrlPattern = null,
  contextMenuUrls = null,
  saveNodeEndpoint = null,
  updateNodesEndpoint = null,
  treeLabel = 'Page Tree',
  labels = null,
  enableContextMenu = true,
  enableAddChild = true,
  onEditItem = null,
  onDuplicateItem = null,
  onAddChild = null,
  onShowAsList = null,
  onRefreshNodes = null,
  onRefreshParentNode = null,
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
  } = useComplexTreeViewApi(
    TREE_ID,
    currentRecordID,
    apiEndpoint,
    listUrlPattern,
    saveNodeEndpoint,
    updateNodesEndpoint
  );

  /**
   * Determines if context menu should be rendered based on available URLs.
   */
  const shouldRenderContextMenu = () => {
    if (!enableContextMenu) {
      return false;
    }
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
   * The page will need to be either reloaded or navigated to for the list view to render
   */
  const showAsListView = (nodeId = null) => {
    if (onShowAsList) {
      onShowAsList(nodeId);
    } else {
      localStorage.setItem('ss.pages-view-type', 'listview');
    }
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
   * If callbacks are provided, delegates to them; otherwise executes default behavior
   * (navigation based on action type or makes POST requests to context menu endpoints).
   */
  const handleMenuAction = async (action, nodeId, payload = null) => {
    switch (action) {
      case 'edit':
        if (onEditItem) {
          onEditItem(nodeId);
        } else if (editUrlPattern) {
          window.location.assign(editUrlPattern.replace('%s', nodeId));
        }
        break;
      case 'showAsList':
        if (onShowAsList) {
          onShowAsList(nodeId);
        } else {
          showAsListView();
          if (listUrlPattern) {
            window.location.assign(listUrlPattern.replace('%s', nodeId));
          }
        }
        break;
      case 'addPage':
        if (onAddChild) {
          onAddChild(nodeId, payload);
        } else if (payload && payload.childType && contextMenuUrls?.addChild) {
          const params = new URLSearchParams({
            ParentID: nodeId,
            RecordType: payload.childType,
            action_doAdd: 1,
            SecurityID: Config.get('SecurityID')
          }).toString();
          window.location.assign(`${contextMenuUrls.addChild}?${params}`);
        }
        break;
      case 'duplicate':
        if (onDuplicateItem) {
          onDuplicateItem(nodeId, payload);
        } else if (payload && typeof payload.includeSubpages === 'boolean') {
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
                if (editUrlPattern) {
                  window.location.assign(editUrlPattern.replace('%s', responseData.newNodeID));
                }
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
   * For synthetic limited indicator nodes, renders as a clickable element that triggers list view.
   * When listUrlPattern is not configured, shows "Too many records" without list view option.
   * Otherwise renders the regular title with right-click support.
   */
  const renderTreeItemTitle = ({ item }) => {
    const isLimitedIndicator = item.data.isLimitedIndicator === true;
    const isLoading = loadingNodeId === item.index;

    if (isLimitedIndicator) {
      // If linkUrl is null, listview is not available - just show a message
      if (!item.data.linkUrl) {
        return (
          <span className={`${CSS_CLASS}__item-link ${CSS_CLASS}__item-link--limited`}>
            Too many records
          </span>
        );
      }
      // When clicking on this <span> showAsListView() will be called to set localStorage flag
      // There is will be a parent <button> this that will be be clicked clicked which is created by react-complex-tree
      // and this will trigger a page reload which will be in list view mode
      return (
        <span onClick={() => showAsListView(item.data.id)} className={`${CSS_CLASS}__item-link ${CSS_CLASS}__item-link--limited`}>
          Too many records (show as list)
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
   * This is triggered by Click (mouse) or Enter (keyboard) on a focused item.
   */
  const handlePrimaryAction = (item) => {
    if (onEditItem) {
      onEditItem(item.data.id);
    } else if (editUrlPattern) {
      window.location.href = editUrlPattern.replace('%s', item.data.id);
    }
  };

  /**
   * Handles tree node refresh triggered externally (e.g., after form submission).
   * Calls the updateNodes API to refresh node data from the server.
   */
  const handleRefreshNodes = async (nodeId) => {
    if (!nodeId || !updateNodes) {
      return;
    }
    try {
      await updateNodes([nodeId]);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Error refreshing nodes:', err);
    }
  };

  /**
   * Handles parent node refresh triggered externally (e.g., after duplicate).
   * Reloads the parent node's children to show new items without full tree reload.
   */
  const handleRefreshParentNode = async (parentId) => {
    if (parentId === null || parentId === undefined || !loadSubtree || !mergeSubtree) {
      return;
    }
    try {
      const subtree = await loadSubtree(parentId);
      await mergeSubtree(parentId, subtree.items, subtree.subtreeChildIds);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Error refreshing parent node:', err);
    }
  };

  // Store the refresh handlers in refs so they can be accessed by Entwine
  const refreshHandlerRef = useRef(handleRefreshNodes);
  const refreshParentHandlerRef = useRef(handleRefreshParentNode);
  useEffect(() => {
    refreshHandlerRef.current = handleRefreshNodes;
    refreshParentHandlerRef.current = handleRefreshParentNode;
  }, [updateNodes, loadSubtree, mergeSubtree]);

  // Expose refresh handlers via callback props when they're provided
  useEffect(() => {
    if (onRefreshNodes && typeof onRefreshNodes === 'function') {
      onRefreshNodes(refreshHandlerRef.current);
    }
  }, [onRefreshNodes]);

  useEffect(() => {
    if (onRefreshParentNode && typeof onRefreshParentNode === 'function') {
      onRefreshParentNode(refreshParentHandlerRef.current);
    }
  }, [onRefreshParentNode]);

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
        if (onEditItem) {
          onEditItem(item.data.id);
        } else if (editUrlPattern) {
          window.location.href = editUrlPattern.replace('%s', item.data.id);
        }
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
    return <div>Loading {treeLabel}...</div>;
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
        onDrop={handleDrop}
        canRenameItems={false}
        canSearchItems={false}
        canSearchByStartingTyping={false}
        renderItemTitle={renderTreeItemTitle}
        onPrimaryAction={handlePrimaryAction}
        onSelectItems={handleSelectItems}
        onExpandItem={handleExpandItem}
      >
        <Tree treeId={TREE_ID} rootItem={rootId} treeLabel={treeLabel} />
      </UncontrolledTreeEnvironment>
      {shouldRenderContextMenu() && (
        <TreeContextMenu
          isOpen={contextMenuOpen}
          position={contextMenuPosition}
          node={contextMenuNode}
          onClose={handleContextMenuClose}
          onMenuAction={handleMenuAction}
          contextMenuUrls={contextMenuUrls}
          labels={labels}
          enableAddChild={enableAddChild}
        />
      )}
    </div>
  );
};

ComplexTreeView.propTypes = {
  currentRecordID: PropTypes.number,
  apiEndpoint: PropTypes.string,
  editUrlPattern: PropTypes.string,
  listUrlPattern: PropTypes.string,
  saveNodeEndpoint: PropTypes.string,
  updateNodesEndpoint: PropTypes.string,
  treeLabel: PropTypes.string,
  labels: PropTypes.shape({
    edit: PropTypes.string,
    showAsList: PropTypes.string,
    addChild: PropTypes.string,
    duplicate: PropTypes.string,
    duplicateThisOnly: PropTypes.string,
    duplicateWithChildren: PropTypes.string,
  }),
  contextMenuUrls: PropTypes.shape({
    duplicate: PropTypes.string,
    duplicateWithChildren: PropTypes.string,
    addChild: PropTypes.string,
  }),
  enableContextMenu: PropTypes.bool,
  enableAddChild: PropTypes.bool,
  onEditItem: PropTypes.func,
  onDuplicateItem: PropTypes.func,
  onAddChild: PropTypes.func,
  onShowAsList: PropTypes.func,
  onRefreshNodes: PropTypes.func,
  onRefreshParentNode: PropTypes.func,
};

export { ComplexTreeView as Component };
export default ComplexTreeView;
