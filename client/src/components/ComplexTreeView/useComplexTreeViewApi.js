import { useState, useEffect, useMemo, useRef } from 'react';
import { StaticTreeDataProvider } from 'react-complex-tree';
import Config from 'lib/Config';

/**
 * Custom hook to manage fetching and preparing data for ComplexTreeView.
 */
const useComplexTreeViewApi = (treeId, currentRecordIDParam, apiEndpoint = '/admin/pages/tree/jsonview') => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [initialViewState, setInitialViewState] = useState(null);
  // using a ref rather than state as we need to reference it straight away
  // after setting it in fetchData()
  const currentRecordIDRef = useRef(currentRecordIDParam);
  /**
   * Transforms the API response data into the structure required by react-complex-tree.
   * Can be used for initial data load or subtree load.
   */
  const transformDataForTree = (apiData, isSubtree = false) => {
    const items = {};
    const rootId = isSubtree ? null : 'root';
    const rootChildren = [];
    let nextSyntheticId = -1;

    const processNode = (node) => {
      const index = node.id.toString();
      const hasChildren = node.children && node.children.length > 0;
      const isLimited = node.limited === true;
      const hasUnloadedChildren = node.expanded === false && node.count > 0;
      const isFolder = hasChildren || isLimited || hasUnloadedChildren;
      const childIds = [];

      // Add regular children
      if (hasChildren) {
        node.children.forEach(child => {
          childIds.push(child.id.toString());
        });
      }

      // If node is limited, add a synthetic child node with the limited indicator
      if (isLimited) {
        const syntheticId = nextSyntheticId.toString();
        nextSyntheticId -= 1;
        childIds.push(syntheticId);
        const linkUrl = `/admin/pages?ParentID=${node.id}`;
        items[syntheticId] = {
          index: syntheticId,
          isFolder: false,
          data: {
            id: syntheticId,
            parentID: node.id,
            title: 'Too many records (show as list)',
            limited: false,
            isLimitedIndicator: true,
            linkUrl,
          },
          children: [],
        };
      }

      // Transform statusFlags if present
      const nodeData = { ...node };
      if (node.statusFlags && Object.keys(node.statusFlags).length > 0) {
        nodeData.statusFlags = Object.entries(node.statusFlags).map(([key, value]) => {
          if (typeof value === 'string') {
            return {
              cssClass: `status-${key}`,
              text: value,
            };
          }
          return {
            cssClass: `status-${key}`,
            text: value.text,
            ...(value.title && { title: value.title }),
          };
        });
      }

      items[index] = {
        index,
        isFolder,
        data: {
          ...nodeData,
          ...(node.contextMenuData && { contextMenuData: node.contextMenuData }),
        },
        children: childIds,
      };

      if (hasChildren) {
        node.children.forEach(processNode);
      }
    };

    // Handle both array format (from API) and single root node format (from tests)
    const dataArray = Array.isArray(apiData) ? apiData : (apiData.children || []);

    // Collect root-level children
    dataArray.forEach(node => {
      if (isSubtree) {
        // For subtrees, always add nodes as they're the direct children of the parent
        rootChildren.push(node.id.toString());
      } else if (node.parentID === 0 || node.parentID === null) {
        // For initial load, only add nodes with parentID === 0 or no parent
        rootChildren.push(node.id.toString());
      }
      processNode(node);
    });

    // Create the root node only for initial load
    if (!isSubtree) {
      items[rootId] = {
        index: rootId,
        isFolder: true,
        children: rootChildren,
        data: 'Root',
      };
    }

    return { items, rootId, subtreeChildIds: isSubtree ? rootChildren : null };
  };

  /**
   * Calculates the initial tree view state based on the current record ID.
   */
  const calculateInitialViewState = (transformedData) => {
    const { items, rootId } = transformedData;
    const currentRecordID = currentRecordIDRef.current;
    // 1. Parse URL for ID (Matches /show/123)
    const expandedItems = [rootId]; // Root is always expanded
    const selectedItems = [];
    if (currentRecordID && items[currentRecordID]) {
      // Mark the active node as selected
      selectedItems.push(currentRecordID);
      // 2. Walk up the tree from the active node to the root
      let currentItem = items[currentRecordID];
      // Loop as long as we have a valid item and we haven't hit the root yet
      while (currentItem && currentItem.index !== rootId) {
        const parentID = currentItem.data.parentID;
        // If there is a parent, ensure it is expanded
        if (parentID !== null && parentID !== undefined) {
          const parentIndex = parentID.toString();
          if (!expandedItems.includes(parentIndex)) {
            expandedItems.push(parentIndex);
          }
          // Move the pointer up one level
          currentItem = items[parentIndex];
        } else {
          // No parent found (or reached top), stop
          break;
        }
      }
    }
    return {
      [treeId]: {
        expandedItems,
        focusedItem: currentRecordID,
        selectedItems,
      }
    };
  };

  /**
   * Creates the API endpoint URL with the given root ID and current record ID.
   */
  const createEndpoint = (rootID) => `${apiEndpoint}/${rootID}/${currentRecordIDRef.current}`;

  /**
   * Fetches data from the API and sets up the tree data and initial view state.
   */
  const fetchData = async (rootID = 0) => {
    try {
      const endpoint = createEndpoint(rootID);
      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      // TODO remove currentRecordID from API response
      const { data: apiData, currentRecordID: apiCurrentRecordID } = await response.json();
      currentRecordIDRef.current = apiCurrentRecordID;
      const transformedData = transformDataForTree(apiData);
      setData(transformedData);
      const calculatedInitialViewState = calculateInitialViewState(transformedData);
      setInitialViewState(calculatedInitialViewState);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Memoize the data provider to ensure trigger re-render in ComplexTreeView when data changes
  const dataProvider = useMemo(() => {
    if (!data) {
      return null;
    }
    return new StaticTreeDataProvider(data.items, (item, dataParam) => ({ ...item, data: dataParam }));
  }, [data]);

  const rootId = data ? data.rootId : null;
  const dataProviderRef = useRef(null);

  // Update the ref whenever dataProvider changes
  useEffect(() => {
    dataProviderRef.current = dataProvider;
  }, [dataProvider]);

  /**
   * Loads a subtree for a given node ID and returns transformed data.
   * Does not update component state, just returns the transformed subtree data.
   */
  const loadSubtree = async (nodeId) => {
    const subtreeEndpoint = `${apiEndpoint}/${nodeId}/${currentRecordIDRef.current}`;
    const response = await fetch(subtreeEndpoint);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const { data: apiData } = await response.json();
    const transformedSubtree = transformDataForTree(apiData, true);
    return transformedSubtree;
  };

  /**
   * Merges subtree data into the existing tree.
   * Updates the parent node's children and merges new items into the data provider.
   */
  const mergeSubtree = async (nodeId, subtreeItems, orderedSubtreeChildIds = null) => {
    if (!data || !dataProviderRef.current) {
      return;
    }
    const parentNodeId = nodeId.toString();
    const existingItem = data.items[parentNodeId];
    if (!existingItem) {
      return;
    }
    // Use provided ordered child IDs, or fall back to filtering (for backwards compatibility)
    const newChildIds = orderedSubtreeChildIds !== null
      ? orderedSubtreeChildIds
      : Object.keys(subtreeItems).filter(key => {
        const item = subtreeItems[key];
        return item.data && item.data.parentID === parseInt(nodeId, 10);
      });
    // Remove the synthetic limited indicator child if present
    const updatedChildren = existingItem.children.filter(childId => {
      const child = data.items[childId];
      return !child || child.data.isLimitedIndicator !== true;
    });
    // Add the new children IDs
    const mergedChildren = [...updatedChildren, ...newChildIds];
    // Merge new items into existing items
    const mergedItems = {
      ...data.items,
      ...subtreeItems,
    };
    // Update the data state with merged items
    setData({
      ...data,
      items: mergedItems,
    });
    // Notify the data provider about the change
    await dataProviderRef.current.onChangeItemChildren(parentNodeId, mergedChildren);
  };

  /**
   * Saves a node to the server with new parent and sibling order.
   * Sends POST request to savejsonnode endpoint with ID, ParentID, and SiblingIDs.
   */
  const saveNode = async (nodeId, parentId, siblingIds) => {
    const securityID = Config.get('SecurityID');
    const baseEndpoint = apiEndpoint.replace(/\/jsonview.*/, '');
    const endpoint = `${baseEndpoint}/savejsonnode`;
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-SecurityID': securityID,
      },
      body: JSON.stringify({
        ID: nodeId,
        ParentID: parentId,
        SiblingIDs: siblingIds,
      }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    return result;
  };

  /**
   * Updates node data from the server.
   * Sends GET request to updatejsonnodes endpoint with list of node IDs.
   */
  const updateNodes = async (nodeIds) => {
    const baseEndpoint = apiEndpoint.replace(/\/jsonview.*/, '');
    const idsParam = nodeIds.join(',');
    const endpoint = `${baseEndpoint}/updatejsonnodes?ids=${encodeURIComponent(idsParam)}`;
    const response = await fetch(endpoint);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    return result;
  };

  return {
    data,
    dataProvider,
    error,
    initialViewState,
    fetchData,
    loading,
    loadSubtree,
    mergeSubtree,
    rootId,
    saveNode,
    updateNodes,
  };
};

export default useComplexTreeViewApi;
