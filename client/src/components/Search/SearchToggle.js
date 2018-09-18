import i18n from 'i18n';
import React from 'react';
import { Button } from 'reactstrap';
import classnames from 'classnames';
import PropTypes from 'prop-types';

const label = i18n._t('Admin.SHOW_SEARCH', 'Show search');

const toggleBtnClasses = (toggled) => classnames(
  'btn--no-text',
  'search-toggle',
  'font-icon-search',
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
>
  <span className="sr-only">{label}</span>
</Button>);


SearchToggle.propTypes = {
  onToggle: PropTypes.func,
  toggled: PropTypes.bool
};

export { SearchToggle as Component };

export default SearchToggle;
