import deepFreeze from 'deep-freeze-strict';
import getFieldReducer from 'lib/reduxFieldReducer';
import ACTION_TYPES from './TreeDropdownFieldActionTypes';

/**
 * Default state
 */
const initialState = deepFreeze({ fields: {} });

/**
 * Default object for an empty field state
 */
const initialFieldState = deepFreeze({
  // Show root node (represents all IDs in chain of visible node)
  visible: [],
  // Root node for empty tree (ajax result).
  // See MarkedSet::getChildrenAsJSON() (php) for structure
  tree: {},
  // Array of all nodes that are loading. (int)0 means loading root node.
  loading: [],
  // Array of nodes that were loaded, but failed to load (don't try to reload)
  failed: [],
  // Search term for looking for specific nodes
  search: '',
  // a cache of selected items that may undesirably disappear due to browsing or searching
  selectedValues: [],
});

/**
 * Merge one tree into another at a given path (list of ids)
 *
 * @param {Object} base node of tree
 * @param {Array} path ID path to merge subtree into base tree
 * @param {Object} tree Subtree to merge in
 * @return {Object} merged tree
 */
function mergeTree(base, path, tree) {
  // Root node
  if (path.length === 0) {
    return tree;
  }
  const [nextID, ...subPath] = path;
  if (!base.children) {
    return base;
  }

  return deepFreeze({
    ...base,
    children: base.children.map((subTree) => (
      (subTree.id === nextID)
        ? mergeTree(subTree, subPath, tree)
        : subTree
    )),
  });
}

/**
 * Get last ID in path. Always returns an ID; Returns 0 (root ID) if path is empty.
 *
 * @param {Array} path Path to node to get id for
 * @return {*} Last item ID or 0 if empty
 */
function idFromPath(path) {
  if (path.length) {
    return path[path.length - 1];
  }
  return 0;
}

export default function treeDropdownFieldReducer(state = initialState, action = null) {
  // Get field reducer
  const reduceField = getFieldReducer(state, action, initialFieldState);

  /**
   * Remove item from list
   *
   * @param {Array} list
   * @param {*} remove Item ID to remove
   * @return {Array} new loading array
   */
  const removeFromList = (list, remove) => (
    list.filter((next) => (next !== remove))
  );

  /**
   * Add item to array
   *
   * @param {Array} list
   * @param {*} add Item ID to add
   * @return {Array} New loading array
   */
  const addToList = (list, add) => {
    // alreading loading
    if (list.find((next) => (next === add))) {
      return list;
    }
    const newList = [
      ...list,
      add,
    ];
    // Ensure arrays of equivalent items are identically sorted
    return newList.sort();
  };

  // Actions
  switch (action.type) {
    // Set visible node
    case ACTION_TYPES.TREEFIELD_SET_VISIBLE: {
      return reduceField(() => ({ visible: action.payload.path }));
    }

    // Begin loading: Add item to loading array
    case ACTION_TYPES.TREEFIELD_UPDATING_TREE: {
      // Mark as loading, remove from failed
      return reduceField((field) => ({
        loading: addToList(
          field.loading,
          idFromPath(action.payload.path)
        ),
        failed: removeFromList(
          field.failed,
          idFromPath(action.payload.path)
        ),
      }));
    }

    // Update success: Update tree and remove item from loading
    case ACTION_TYPES.TREEFIELD_UPDATED_TREE: {
      return reduceField((field) => ({
        tree: mergeTree(field.tree, action.payload.path, action.payload.tree),
        // Remove from both loading / failed
        loading: removeFromList(
          field.loading,
          idFromPath(action.payload.path)
        ),
        failed: removeFromList(
          field.failed,
          idFromPath(action.payload.path)
        ),
      }));
    }

    // Update failed: Mark these so we don't repeat attempt to load
    case ACTION_TYPES.TREEFIELD_UPDATE_FAILED: {
      return reduceField((field) => ({
        // Remove from loading, but add to failed
        loading: removeFromList(
          field.loading,
          idFromPath(action.payload.path)
        ),
        failed: addToList(
          field.failed,
          idFromPath(action.payload.path)
        ),
      }));
    }

    case ACTION_TYPES.TREEFIELD_SET_SEARCH: {
      return reduceField((field) => ({
        ...field,
        search: action.payload.search,
      }));
    }

    case ACTION_TYPES.TREEFIELD_ADD_SELECTED_VALUES: {
      const values = action.payload.values || [];
      return reduceField(field => ({
        ...field,
        selectedValues: [
          ...field.selectedValues.filter(value =>
            !values.find(item => item.id === value.id)
          ),
          ...values,
        ].sort((a, b) => a.id - b.id),
      }));
    }

    default:
      return state;
  }
}
