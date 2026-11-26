import React from 'react';
import PropTypes from 'prop-types';
import i18n from 'i18n';
import { isPlainClick, itemPropType } from './treeViewUtils';

const TreeViewTooManyItem = ({ item, onShowAsList }) => {
  const handleClick = (event) => {
    if (isPlainClick(event)) {
      onShowAsList(item, event);
    }
  };
  const text = i18n._t('Admin.TREEVIEW_TOO_MANY', 'Too many records ({link})');
  // The link replaces `{link}`, so a translation can place the link and its brackets. Text without `{link}` gets the
  // link at the end.
  const [beforeLink, ...afterLink] = text.includes('{link}') ? text.split('{link}') : [`${text} `];

  return (
    <li className="tree-view__item tree-view__item--too-many">
      {beforeLink}
      <a className="tree-view__link" href={item.listViewUrl} onClick={handleClick}>
        {i18n._t('Admin.TREEVIEW_SHOW_AS_LIST', 'show as list')}
      </a>
      {afterLink.join('')}
    </li>
  );
};

TreeViewTooManyItem.propTypes = {
  item: itemPropType.isRequired,
  onShowAsList: PropTypes.func.isRequired,
};

export default TreeViewTooManyItem;
