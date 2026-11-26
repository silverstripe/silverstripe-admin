import React from 'react';
import i18n from 'i18n';

const TreeViewLoadingItem = () => (
  <li className="tree-view__item tree-view__item--loading">
    {i18n._t('Admin.TREEVIEW_LOADING', 'Loading...')}
  </li>
);

export default TreeViewLoadingItem;
