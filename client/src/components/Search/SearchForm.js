/* global document */
import i18n from 'i18n';
import React, { PropTypes, Component } from 'react';

import FormBuilderLoader from 'containers/FormBuilderLoader/FormBuilderLoader';
import { Collapse } from 'reactstrap';

import classnames from 'classnames';


const identifier = 'Admin.SearchForm';
const searchButtonClasses = classnames(
  'btn',
  'btn-primary',
  'search__submit',
  'btn--no-text',
);
const clearButtonClasses = classnames(
  'btn',
  'btn-secondary',
  'clear__submit',
);

/**
 * Displays a search form
 */
const SearchForm = ({expanded, onSearch, onClear, formSchemaUrl, id}) => (
  <Collapse id={id} className="search__filter-panel" isOpen={expanded}>
    {formSchemaUrl && <FormBuilderLoader
      identifier={identifier}
      schemaUrl={formSchemaUrl} />}
    <button className={searchButtonClasses} onClick={onSearch}>
      {i18n._t('Admin.SEARCH', 'Search')}
    </button>
    <button
      className={clearButtonClasses}
      onClick={onClear}>
      {i18n._t('Admin.CLEAR', 'Clear')}
    </button>
  </Collapse>
);



SearchForm.propTypes = {
  onSearch: PropTypes.func,
  onClear: PropTypes.func,

  id: PropTypes.string.isRequired,
  showFilters: PropTypes.bool,
  formSchemaUrl: PropTypes.string,
  filters: PropTypes.object,
  formData: PropTypes.object,
};

SearchForm.defaultProps = {

}


export { SearchForm as Component};

export default SearchForm;
