/* global document */
import i18n from 'i18n';
import React from 'react';
import FormBuilderLoader from 'containers/FormBuilderLoader/FormBuilderLoader';
import { Collapse, Button } from 'reactstrap';
import PropTypes from 'prop-types';

const searchLabel = i18n._t('Admin.SEARCH', 'Search');
const clearLabel = i18n._t('Admin.CLEAR', 'Clear');

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
  visible, expanded, onSearch, onClear, formSchemaUrl, id, identifier, clearable
}) {
  const handleKeyDown = onEnter(onSearch);
  const loadForm = (visible || expanded);

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
        >{searchLabel}</Button>
        { clearable && <Button
          className="search-form__clear"
          onClick={() => onClear()}
        >{clearLabel}</Button> }
      </div>
    </Collapse>
  );
}

SearchForm.propTypes = {
  onSearch: PropTypes.func,
  onClear: PropTypes.func,
  visible: PropTypes.bool,
  expanded: PropTypes.bool,
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
