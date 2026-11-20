/**
 * The components in this file render the items of a tree view. `TreeView` builds the value of `TreeViewContext`.
 *
 * `item.classes` and `item.iconClasses` are global class names, styled outside TreeView.scss: `.record-icon` sizes the
 * icon and the generated `.class-*` rules draw image icons.
 */
import React, { memo, useContext } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import StatusBadge from 'components/StatusBadge/StatusBadge';
import { STATUS } from './TreeViewConstants';
import { getHighlightedId } from './TreeViewSelectors';
import { collapseItem, expandItem, loadChildren } from './TreeViewActions';
import TreeViewContext from './TreeViewContext';
import TreeViewFailedItem from './TreeViewFailedItem';
import TreeViewLoadingItem from './TreeViewLoadingItem';
import TreeViewToggle from './TreeViewToggle';
import TreeViewTooManyItem from './TreeViewTooManyItem';
import { useLoadChildren } from './treeViewHooks';
import { useTreeValue } from './treeViewStore';
import { isPlainClick, itemPropType } from './treeViewUtils';

const BADGE_STATUS_BY_FLAG_KEY = {
  addedtodraft: 'draft',
  archived: 'archived',
  deletedonlive: 'archived',
  modified: 'modified',
  removedfromdraft: 'archived',
};

export const TreeViewItems = ({ parentId, parentItem = null }) => {
  const { store, fetchChildren, onShowAsList } = useContext(TreeViewContext);
  const childIds = useTreeValue(store, (tree) => tree.childIds[parentId]);
  const childrenStatus = useTreeValue(store, (tree) => tree.status[parentId]);
  const isParentLimited = Boolean(parentItem && parentItem.limited);
  const haveChildrenFailed = childrenStatus === STATUS.FAILED;
  const areChildrenAwaited = !childIds && !haveChildrenFailed;
  // A limited parent has no children to load.
  const areChildrenNeeded = !isParentLimited && !childIds && !childrenStatus;

  useLoadChildren(store, parentId, fetchChildren, areChildrenNeeded);

  if (isParentLimited) {
    return <TreeViewTooManyItem item={parentItem} onShowAsList={onShowAsList} />;
  }
  if (haveChildrenFailed) {
    const handleRetry = () => loadChildren(store, parentId, fetchChildren);
    return <TreeViewFailedItem onRetry={handleRetry} />;
  }
  if (areChildrenAwaited) {
    return <TreeViewLoadingItem />;
  }
  return childIds.map((id) => (
    // eslint-disable-next-line no-use-before-define
    <MemoTreeViewItem key={id} id={id} />
  ));
};

TreeViewItems.propTypes = {
  parentId: PropTypes.number.isRequired,
  parentItem: itemPropType,
};

const TreeViewItem = ({ id }) => {
  const { store, onOpen } = useContext(TreeViewContext);
  const item = useTreeValue(store, (tree) => tree.items[id]);
  const childIds = useTreeValue(store, (tree) => tree.childIds[id]);
  const isItemExpanded = useTreeValue(store, (tree) => tree.expanded.includes(id));
  const isItemCurrent = useTreeValue(store, (tree) => tree.currentId === id);
  const isItemHighlighted = useTreeValue(store, (tree) => getHighlightedId(tree) === id);

  if (!item) {
    return null;
  }

  // An expanded item stays a parent until its children load empty, so a child added after the server sent `hasChildren`
  // still shows.
  const hasChildren = childIds ? childIds.length > 0 : Boolean(item.hasChildren) || isItemExpanded;
  const isItemParent = Boolean(item.limited) || hasChildren;
  const isExpandedParent = isItemParent && isItemExpanded;
  const canViewItem = item.canView !== false;
  const canEditItem = item.canEdit !== false;
  // An item the member can view but not edit looks the same as one the member cannot view.
  const isItemDisabled = !canViewItem || !canEditItem;
  const statusFlags = Array.isArray(item.statusFlags) ? item.statusFlags : [];

  const handleToggle = () => (isItemExpanded ? collapseItem(store, id) : expandItem(store, id));

  const handleClick = (event) => {
    if (!isPlainClick(event)) {
      return;
    }
    if (canViewItem) {
      onOpen(item, event);
    } else {
      event.preventDefault();
    }
  };

  return (
    <li
      className={classnames('tree-view__item', { 'tree-view__item--expanded': isExpandedParent }, item.classes)}
      data-id={id}
      data-recordtype={item.recordClass}
    >
      {isItemParent && <TreeViewToggle title={item.treeTitle} isExpanded={isExpandedParent} onClick={handleToggle} />}
      <a
        className={classnames(
          'tree-view__link',
          statusFlags.map((flag) => `tree-view__link--status-${flag.key}`),
          {
            'tree-view__link--current': isItemHighlighted,
            'tree-view__link--disabled': isItemDisabled,
          },
        )}
        href={item.editUrl}
        title={item.tooltip}
        aria-current={isItemCurrent ? 'page' : undefined}
        onClick={handleClick}
      >
        <span className={classnames('tree-view__icon', item.iconClasses)} aria-hidden="true" />
        <span className="tree-view__title">{item.treeTitle}</span>
        {statusFlags.map((flag) => (
          <StatusBadge
            key={flag.key}
            status={BADGE_STATUS_BY_FLAG_KEY[flag.key]}
            text={flag.text}
          />
        ))}
      </a>
      {isExpandedParent && (
        <ul className="tree-view__group">
          <TreeViewItems parentId={id} parentItem={item} />
        </ul>
      )}
    </li>
  );
};

TreeViewItem.propTypes = {
  id: PropTypes.number.isRequired,
};

const MemoTreeViewItem = memo(TreeViewItem);
