/* global document */
import i18n from 'i18n';
import React from 'react';
import FormBuilderLoader from 'containers/FormBuilderLoader/FormBuilderLoader';
import { Collapse, Button } from 'reactstrap';
import PropTypes from 'prop-types';

/**
 * Perform the callback when the enter key is pressed
 * @param function callback
 * @returns {function(*): void}
 */
function onEnter(callback) {
  return (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      callback();
    }
  };
}

/**
 * Display an advanced filter form.
 */
function SearchForm({
  expanded, forceLoadForm, onSearch, onClear, formSchemaUrl, id, identifier, clearable
}) {
  const handleKeyDown = onEnter(onSearch);
  const loadForm = expanded || forceLoadForm;

  return (
    <Collapse id={id} isOpen={expanded} className="search-form">
      {// eslint-disable-next-line jsx-a11y/no-static-element-interactions
      }<div
        className="search-form__wrapper"
        onKeyDown={handleKeyDown}
      >
        {loadForm && formSchemaUrl && <FormBuilderLoader
          className="no-change-track"
          formTag="div"
          identifier={identifier}
          schemaUrl={formSchemaUrl}
          onSubmit={() => { onSearch(); return Promise.resolve(); }}
        />}
        <Button
          className="search-form__submit"
          onClick={() => onSearch()}
          color="primary"
          type="button"
        >{i18n._t('Admin.SEARCH', 'Search')}</Button>
        { clearable && <Button
          className="search-form__clear"
          onClick={() => onClear()}
        >{i18n._t('Admin.CLEAR', 'Clear')}</Button> }
      </div>
    </Collapse>
  );
}

SearchForm.propTypes = {
  onSearch: PropTypes.func,
  onClear: PropTypes.func,
  expanded: PropTypes.bool,
  id: PropTypes.string.isRequired,
  formSchemaUrl: PropTypes.string,
  identifier: PropTypes.string,
  clearable: PropTypes.bool,
  forceLoadForm: PropTypes.bool,
};

SearchForm.defaultProps = {
  formData: {},
  forceLoadForm: false,
};

export { SearchForm as Component };

export default SearchForm;
