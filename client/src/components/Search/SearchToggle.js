import i18n from 'i18n';
import React from 'react';
import Button from 'components/Button/Button';
import classnames from 'classnames';
import PropTypes from 'prop-types';

const label = i18n._t('Admin.SHOW_SEARCH', 'Show search');

const toggleBtnClasses = (toggled) => classnames(
  'btn--no-text',
  'search-toggle',
  'btn--icon-lg',
  { 'search-toggle__active': toggled }
);

/**
 * Simple Search toggle than can be use to enable/disable a Search component.
 */
const SearchToggle = ({ onToggle, toggled }) => (<Button
  title={label}
  onClick={onToggle}
  className={toggleBtnClasses(toggled)}
  icon="search"
>
  <span className="visually-hidden">{label}</span>
</Button>);

SearchToggle.propTypes = {
  onToggle: PropTypes.func,
  toggled: PropTypes.bool
};

export { SearchToggle as Component };

export default SearchToggle;
