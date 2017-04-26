import { PropTypes } from 'react';

const TreeDropdownFieldNode = () => null;

TreeDropdownFieldNode.propTypes = {
  // ID field could be string
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  title: PropTypes.string, // item label
  // Marking information
  disabled: PropTypes.bool,
  count: PropTypes.number, // Number of children that exist (not that were returned)
  depth: PropTypes.number, // Depth in the tree (root = 0)
  expanded: PropTypes.bool, // True if children returned (even if closed)
  limited: PropTypes.bool, // True if children exceeded rate limit
  marked: PropTypes.bool, // All nodes are marked: Redundant
  opened: PropTypes.bool, // Show as open
  // List of nodeShape child objects
  children: PropTypes.array,
};

export default TreeDropdownFieldNode;
