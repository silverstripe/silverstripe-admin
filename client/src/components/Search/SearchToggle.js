/* global document */
import i18n from 'i18n';
import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import classnames from 'classnames';

const SearchToggle = ({toogle}) => <button
  title={i18n._t('Admin.SHOW_SEARCH', 'Show Search')}
  onClick={toogle}
  className="btn btn--no-text btn-secondary search__trigger font-icon-search btn--icon-large"
  title={i18n._t('Admin.SHOW_SEARCH', 'Show Search')} />



SearchToggle.propTypes = {
};

SearchToggle.defaultProps = {

}

function mapStateToProps(state, ownProps) {
  const schema = state.form.formSchemas[ownProps.searchFormSchemaUrl];
  if (!schema || !schema.name) {
    return { formData: {} };
  }
  const form = getIn(getFormState(state), schema.name);
  const formData = (form && form.values) || {};
  return { formData };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      schema: bindActionCreators(schemaActions, dispatch),
      reduxForm: bindActionCreators({ reset, initialize }, dispatch),
    },
  };
}

export { SearchToggle as Component };

export default SearchToggle;
