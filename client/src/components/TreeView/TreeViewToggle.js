import React from 'react';
import PropTypes from 'prop-types';
import i18n from 'i18n';

const TreeViewToggle = ({ title = '', isExpanded, onClick }) => (
  <button
    type="button"
    className="tree-view__toggle"
    aria-expanded={isExpanded}
    aria-label={i18n.inject(i18n._t('Admin.TREEVIEW_TOGGLE', 'Toggle children of {title}'), { title })}
    onClick={onClick}
  >
    <span className="font-icon-right-dir" aria-hidden="true" />
  </button>
);

TreeViewToggle.propTypes = {
  title: PropTypes.string,
  isExpanded: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default TreeViewToggle;
