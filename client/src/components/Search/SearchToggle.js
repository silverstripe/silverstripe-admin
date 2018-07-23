import i18n from 'i18n';
import React, { PropTypes } from 'react';
import { Button } from 'reactstrap';
import classnames from 'classnames';

const label = i18n._t('Admin.SHOW_SEARCH', 'Show search');
const btnClasses = classnames(
  'btn--no-text',
  'search-toggle',
  'font-icon-search',
  'btn--icon-large'
);

/**
 * Simple Search toggle than can be use to enable/disable a Search component.
 */
const SearchToggle = ({ onToggle, toggled }) => (<Button
  title={label}
  onClick={onToggle}
  className={btnClasses + (toggled ? ' search-toggle__active' : '')}
>
  <span className="sr-only">{label}</span>
</Button>);


SearchToggle.propTypes = {
  onToggle: PropTypes.func,
  toggled: PropTypes.bool
};

export { SearchToggle as Component };

export default SearchToggle;
