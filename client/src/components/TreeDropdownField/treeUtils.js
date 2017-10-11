/**
 * Given a tree and a path of IDs find the nested node
 *
 * @param {Object} tree
 * @param {Array} path
 * @return {Object} Nested tree
 */
export const findTreeByPath = (tree, path) => {
  // No valid tree
  if (!tree || Object.keys(tree).length === 0) {
    return null;
  }
  // No more path means this is the complete tree
  if (path.length === 0) {
    return tree;
  }
  const subPath = path.slice(0);
  const nextID = subPath.shift();
  const subTree = tree.children.find((nextSubTree) => (nextSubTree.id === nextID));

  // Deepen search
  if (subTree) {
    return findTreeByPath(subTree, subPath);
  }

  // No tree found
  return null;
};

/**
 * Find a tree by id
 *
 * @param {Object} tree - Tree to search
 * @param {*} id - id property of node to find path for
 * @return {Object} - The tree if found, or null if not found.
 */
const findTreeByID = (tree, id) => {
  // No valid tree
  if (!id || !tree || !tree.children || Object.keys(tree).length === 0) {
    return null;
  }
  // Found node
  if (tree.id === id) {
    return tree;
  }
  // eslint-disable-next-line no-restricted-syntax
  for (const child of tree.children) {
    // Search children
    const found = findTreeByID(child, id);
    if (found !== null) {
      return found;
    }
  }
  // No tree found
  return null;
};

/**
 * Finds path to the node in a tree
 *
 * @param {Object} tree - Tree to search
 * @param {*} id - id property of node to find path for
 * @return {Array} - The path to this node, or null if not found
 */
export const findTreePath = (tree, id) => {
  // root node
  if (!id) {
    return [];
  }
  // No valid tree
  if (!tree || Object.keys(tree).length === 0) {
    return null;
  }
  // Base case, stops recursion
  if (tree.id === id) {
    return [tree.id];
  }
  if (!tree.children) {
    return null;
  }
  // eslint-disable-next-line no-restricted-syntax
  for (const child of tree.children) {
    // Search children
    const childPath = findTreePath(child, id);
    // Node found in subtree, shift this id and return
    if (childPath !== null) {
      // Don't add root ID
      if (tree.id) {
        childPath.unshift(tree.id);
      }
      return childPath;
    }
  }
  // No tree found
  return null;
};
