import i18n from 'i18n';
import React, { PropTypes } from 'react';
import classnames from 'classnames';

const label = i18n._t('Admin.SHOW_SEARCH', 'Show search');
const btnClasses = classnames(
  'btn',
  'btn--no-text',
  'btn-secondary',
  'search-toggle',
  'font-icon-search',
  'btn--icon-large'
);


const SearchToggle = ({ onToggle, toggled }) => (<button
  title={label}
  onClick={onToggle}
  className={btnClasses + (toggled ? ' search-toggle__active' : '')}
>
  <span className="sr-only">{label}</span>
</button>);


SearchToggle.propTypes = {
  onToggle: PropTypes.func,
  toggled: PropTypes.bool
};

export { SearchToggle as Component };

export default SearchToggle;
