import ACTION_TYPES from './TreeDropdownFieldActionTypes';

/**
 * Sets the node being made visible
 *
 * @param {String} fieldId ID for field
 * @param {Array} path full path to node
 * @return {Object}
 */
export function setVisible(fieldId, path) {
  return {
    type: ACTION_TYPES.TREEFIELD_SET_VISIBLE,
    payload: { fieldId, path },
  };
}

/**
 * Mark a tree as being updated
 *
 * @param {String} fieldId ID for field
 * @param {Array} path full path to node
 * @returns {Object}
 */
export function beginTreeUpdating(fieldId, path) {
  return {
    type: ACTION_TYPES.TREEFIELD_UPDATING_TREE,
    payload: { fieldId, path },
  };
}

/**
 * Finish updating a tree
 *
 * @param {String} fieldId
 * @param {Array} path full path to node
 * @param {Array} tree Tree to merge at the given path
 * @returns {Object}
 */
export function updateTree(fieldId, path, tree) {
  return {
    type: ACTION_TYPES.TREEFIELD_UPDATED_TREE,
    payload: { fieldId, path, tree },
  };
}

/**
 * Mark a tree as failed
 *
 * @param {String} fieldId ID for field
 * @param {Array} path full path to node
 * @returns {Object}
 */
export function updateTreeFailed(fieldId, path) {
  return {
    type: ACTION_TYPES.TREEFIELD_UPDATE_FAILED,
    payload: { fieldId, path },
  };
}

export function setSearch(fieldId, search) {
  return {
    type: ACTION_TYPES.TREEFIELD_SET_SEARCH,
    payload: { fieldId, search },
  };
}

export function addSelectedValues(fieldId, values) {
  return {
    type: ACTION_TYPES.TREEFIELD_ADD_SELECTED_VALUES,
    payload: { fieldId, values },
  };
}
