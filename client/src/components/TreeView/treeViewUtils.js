import PropTypes from 'prop-types';

// The fields of an item that the tree view components read. The page tree endpoints in cms send more fields.
export const itemPropType = PropTypes.shape({
  id: PropTypes.number.isRequired,
  treeTitle: PropTypes.string,
  tooltip: PropTypes.string,
  recordClass: PropTypes.string,
  classes: PropTypes.string,
  iconClasses: PropTypes.string,
  statusFlags: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string.isRequired,
    text: PropTypes.string,
  })),
  hasChildren: PropTypes.bool,
  limited: PropTypes.bool,
  listViewUrl: PropTypes.string,
  editUrl: PropTypes.string,
  canView: PropTypes.bool,
  canEdit: PropTypes.bool,
});

// Return `value` as an item id, or null when `value` is not a positive whole number.
export function parseItemId(value) {
  return /^[1-9]\d*$/.test(String(value)) ? Number(value) : null;
}

// Check whether `event` is a click of the main button with no modifier key. The browser handles any other click.
export function isPlainClick(event) {
  return event.button === 0 && !event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey;
}

// Get the element that scrolls the tree: the nearest element from `element` up that scrolls, or else the page. In the
// CMS this is the panel around the tree, as for the legacy tree.
export function getScrollContainer(element) {
  for (let ancestor = element; ancestor; ancestor = ancestor.parentElement) {
    if (['auto', 'scroll'].includes(window.getComputedStyle(ancestor).overflowY)) {
      return ancestor;
    }
  }
  return document.scrollingElement || element;
}
