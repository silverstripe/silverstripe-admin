import React from 'react';
import PropTypes from 'prop-types';
import i18n from 'i18n';

const TreeViewFailedItem = ({ onRetry }) => (
  <li className="tree-view__item tree-view__item--failed">
    <button type="button" className="tree-view__link" onClick={onRetry}>
      {i18n._t('Admin.TREEVIEW_FAILED_RETRY', 'Failed to load. Try again')}
    </button>
  </li>
);

TreeViewFailedItem.propTypes = {
  onRetry: PropTypes.func.isRequired,
};

export default TreeViewFailedItem;
