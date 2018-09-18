/* global document */
import i18n from 'i18n';
import React, { Component } from 'react';
import FormBuilderLoader from 'containers/FormBuilderLoader/FormBuilderLoader';
import { Collapse, Button } from 'reactstrap';
import PropTypes from 'prop-types';

const searchLabel = i18n._t('Admin.SEARCH', 'Search');
const clearLabel = i18n._t('Admin.CLEAR', 'Clear');

/**
 * Display an advanced filter form.
 */
class SearchForm extends Component {
  constructor(props) {
    super(props);

    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  /**
   * Handle enter key submission in search form
   *
   * @param {Object} event
   */
  handleKeyDown(e) {
    if (e.key === 'Enter') {
      this.props.onSearch();
    }
  }

  render() {
    const { expanded, onSearch, onClear, formSchemaUrl, id, identifier, clearable } = this.props;

    return (
      <Collapse id={id} isOpen={expanded} className="search-form">
        {// eslint-disable-next-line jsx-a11y/no-static-element-interactions
        }<div
          className="search-form__wrapper"
          onKeyDown={this.handleKeyDown}
        >
          {formSchemaUrl && <FormBuilderLoader
            className="no-change-track"
            identifier={identifier}
            schemaUrl={formSchemaUrl}
            onSubmit={() => { onSearch(); return Promise.resolve(); }}
          />}
          <Button
            className="search-form__submit"
            onClick={() => onSearch()}
            color="primary"
            type="submit"
          >{searchLabel}</Button>
          { clearable && <Button
            className="search-form__clear"
            onClick={() => onClear()}
          >{clearLabel}</Button> }
        </div>
      </Collapse>
    );
  }
}

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
