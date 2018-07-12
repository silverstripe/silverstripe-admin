import i18n from 'i18n';
import React, { PropTypes } from 'react';

const label = i18n._t('Admin.SHOW_SEARCH', 'Show Search');


const SearchToggle = ({ onToggle }) => (<button
  title={label}
  onClick={onToggle}
  className="btn btn--no-text btn-secondary search__trigger font-icon-search btn--icon-large"
>
  <span className="sr-only">{label}</span>
</button>);


SearchToggle.propTypes = {
  onToggle: PropTypes.func,
};

export { SearchToggle as Component };

export default SearchToggle;
