/* global document */
import i18n from 'i18n';
import React, { PropTypes } from 'react';

import FormBuilderLoader from 'containers/FormBuilderLoader/FormBuilderLoader';
import { Collapse } from 'reactstrap';

import classnames from 'classnames';


const identifier = 'Admin.SearchForm';
const searchButtonClasses = classnames(
  'btn',
  'btn-primary',
  'search-form__submit',
  'btn--no-text',
);
const clearButtonClasses = classnames(
  'btn',
  'btn-secondary',
  'search-form__clear',
);

const searchLabel = i18n._t('Admin.SEARCH', 'Search');
const clearLabel = i18n._t('Admin.CLEAR', 'Clear');

/**
 * Displays a search form
 */
const SearchForm = ({ expanded, onSearch, onClear, formSchemaUrl, id }) => (
  <Collapse id={id} className="search-form" isOpen={expanded}>
    {formSchemaUrl && <FormBuilderLoader identifier={identifier} schemaUrl={formSchemaUrl} />}
    <button className={searchButtonClasses} onClick={onSearch}>{searchLabel}</button>
    <button className={clearButtonClasses} onClick={onClear}>{clearLabel}</button>
  </Collapse>
);


SearchForm.propTypes = {
  onSearch: PropTypes.func,
  onClear: PropTypes.func,

  id: PropTypes.string.isRequired,
  formSchemaUrl: PropTypes.string,
};

SearchForm.defaultProps = {
  formData: {},
};


export { SearchForm as Component };

export default SearchForm;
