/* global document */
import i18n from 'i18n';
import React, { PropTypes } from 'react';
import FormBuilderLoader from 'containers/FormBuilderLoader/FormBuilderLoader';
import { Collapse, Button } from 'reactstrap';

const searchLabel = i18n._t('Admin.SEARCH', 'Search');
const clearLabel = i18n._t('Admin.CLEAR', 'Clear');

/**
 * Display an advanced filter form.
 */
const SearchForm = ({ expanded, onSearch, onClear, formSchemaUrl, id, identifier, clearable }) => (
  <Collapse id={id} isOpen={expanded} className="search-form">
    <div className="search-form__wrapper">
      {formSchemaUrl && <FormBuilderLoader
        identifier={identifier}
        schemaUrl={formSchemaUrl}
      />}
      <Button
        className="search-form__submit"
        onClick={onSearch}
        color="primary"
      >{searchLabel}</Button>
      <Button
        className="search-form__clear"
        onClick={onClear}
        disabled={!clearable}
      >{clearLabel}</Button>
    </div>
  </Collapse>
);


SearchForm.propTypes = {
  onSearch: PropTypes.func,
  onClear: PropTypes.func,

  id: PropTypes.string.isRequired,
  formSchemaUrl: PropTypes.string,
  identifier: PropTypes.string,
  clearable: PropTypes.bool,
};

SearchForm.defaultProps = {
  formData: {}
};


export { SearchForm as Component };

export default SearchForm;
