/* global document */
import i18n from 'i18n';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactDOM from 'react-dom';
import { bindActionCreators } from 'redux';
import * as schemaActions from 'state/schema/SchemaActions';
import { reset, initialize, change } from 'redux-form';
import { isDirty } from 'redux-form/lib/immutable';
import getIn from 'redux-form/lib/structure/plain/getIn';
import getFormState from 'lib/getFormState';
import PropTypes from 'prop-types';
import Focusedzone from '../Focusedzone/Focusedzone';
import SearchBox from './SearchBox';
import SearchForm from './SearchForm';
import SearchToggle from './SearchToggle';
import mapFormSchemaToTags from './utilities/mapFormSchemaToTags';

const DISPLAY = {
  NONE: 'NONE',
  VISIBLE: 'VISIBLE',
  EXPANDED: 'EXPANDED',
};
const BEHAVIOR = {
  NONE: 'NONE',
  HIDEABLE: 'HIDEABLE',
  TOGGLABLE: 'TOGGLABLE'
};

/**
 * @param {Object} filters
 * @returns {boolean}
 */
function hasFilters(filters) {
  return (filters && Object.keys(filters).length > 0);
}

/**
 * Displays a search component that can be use to retrieve a search term and
 * display an advanced search form.
 */
class Search extends Component {
  constructor(props) {
    super(props);

    this.expand = this.expand.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.getData = this.getData.bind(this);
    this.doSearch = this.doSearch.bind(this);
    this.focusInput = this.focusInput.bind(this);
    this.focusFirstFormField = this.focusFirstFormField.bind(this);
    this.hide = this.hide.bind(this);
    this.show = this.show.bind(this);
    this.toggle = this.toggle.bind(this);
    this.open = this.open.bind(this);
    this.searchTermIsDirty = this.searchTermIsDirty.bind(this);
    this.clearFilters = this.clearFilters.bind(this);
    this.clearSearchBox = this.clearSearchBox.bind(this);
    this.clearFormFilter = this.clearFormFilter.bind(this);
    this.focusFormFilter = this.focusFormFilter.bind(this);
    this.formatTagData = this.formatTagData.bind(this);

    const term = props.term
      || (props.filters && props.filters[`${props.filterPrefix}${props.name}`])
      || '';

    this.state = {
      display: props.display,
      searchText: term,
      initialSearchText: term,
    };
  }

  componentDidMount() {
    this.setOverrides(this.props);
  }

  componentWillUnmount() {
    this.setOverrides();
  }

  /**
   * Populate search form with search in case a pre-existing search has been queried
   *
   * @param {Object} props
   */
  setOverrides(props) {
    if (props && (
      !hasFilters(props.filters) || this.props.formSchemaUrl !== props.formSchemaUrl
    )) {
      // clear any overrides that may be in place
      const schemaUrl = (props && props.formSchemaUrl) || this.props.formSchemaUrl;
      if (schemaUrl) {
        this.props.actions.schema.setSchemaStateOverrides(schemaUrl, null);
      }
    }

    if (props && (hasFilters(props.filters) && props.formSchemaUrl)) {
      const filters = props.filters || {};
      const overrides = {
        fields: Object
          .keys(filters)
          .map((name) => {
            const value = filters[name];
            return { name, value };
          }),
      };

      // set overrides into redux store, so that it can be accessed by FormBuilder with the same
      // schemaUrl.
      this.props.actions.schema.setSchemaStateOverrides(props.formSchemaUrl, overrides);
    }
  }

  /**
   * Get the search criteria compiled into an object.
   * @returns {Object}
   */
  getData(ignoreSearchTerm = false) {
    const { name, filterPrefix, formData } = this.props;
    const { searchText } = this.state;
    const data = {};

    // Filter empty values
    Object.keys(formData).forEach((key) => {
      const value = formData[key];
      if (value) {
        data[key] = value;
      }
    });

    // Merge data from redux-forms with text field
    if (
      !ignoreSearchTerm
      && searchText
      && typeof formData[`${filterPrefix}${name}`] === 'undefined'
    ) {
      data[`${filterPrefix}${name}`] = searchText.trim();
    }

    return data;
  }

  /**
   * Update the state search term form an input field change event.
   * @param {Object} event onChangeEvent from a input field.
   */
  handleChange(event) {
    const value = event.target.value;
    if (this.state.searchText !== value) {
      this.setState({ searchText: value });
    }

    const { schemaName, name, filterPrefix, actions, formData } = this.props;
    if (typeof formData[`${filterPrefix}${name}`] !== 'undefined') {
      actions.reduxForm.change(schemaName, `${filterPrefix}${name}`, value);
    }
  }

  /**
   * Try to find the input field and focus on it.
   */
  focusInput() {
    if (this.state.display === DISPLAY.NONE) {
      return;
    }

    const node = ReactDOM.findDOMNode(this);
    if (!node) {
      return;
    }

    const input = node.querySelector('.search-box__content-field');
    // check that it doesn't already have focus
    if (input !== document.activeElement) {
      input.focus();
      if (input.select) {
        input.select();
      }
    }
  }

  /**
   * Try to find the first form field in the advanced form and focus on it.
   */
  focusFirstFormField(filter = 'input, textarea, select, button') {
    if (this.state.display !== DISPLAY.EXPANDED) {
      return;
    }

    const node = ReactDOM.findDOMNode(this);
    if (!node) {
      return;
    }

    const form = node.querySelector('.search-form');
    if (!form) {
      return;
    }

    const input = form.querySelector(filter);
    if (input) {
      input.focus();
      if (input.select) {
        input.select();
      }
    }
  }

  /**
   * Clear the search term and any advanced search form data.
   * @param {Object} props
   */
  clearFormData(props) {
    if (this.state.searchText !== '') {
      this.setState({ searchText: '' });
    }

    const formSchemaUrl = (props && props.formSchemaUrl) || this.props.formSchemaUrl;
    if (formSchemaUrl) {
      const identifier = (props && props.identifier) || this.props.identifier;
      this.props.actions.schema.setSchemaStateOverrides(formSchemaUrl, { fields: [] });
      this.props.actions.reduxForm.reset(identifier);
    }
  }

  /**
   * Clear a search filter and execute a new search
   * @param {string} key Search filter name to clear
   */
  clearFormFilter(key) {
    const tag = this.props.tagData[key];
    const clearables = { [key]: undefined };

    const { schemaName, filters } = this.props;
    this.props.actions.reduxForm.change(schemaName, key, '');
    this.setOverrides({
      ...this.props,
      filters: {
        ...filters,
        [key]: undefined
      }
    });

    if (Array.isArray(tag.linkedFields)) {
      tag.linkedFields.forEach(linkFieldkey => { clearables[linkFieldkey] = undefined; });
    }
    this.doSearch(clearables);
  }

  /**
   * Focus on the requested search filter name.
   * @param {string} key Search filter name.
   */
  focusFormFilter(key) {
    const tag = this.props.tagData[key];
    const selector = tag.focusSelector || `[name=${key}]`;
    this.expand();
    setTimeout(() => this.focusFirstFormField(selector), 50);
  }

  /**
   * Show the Search box and set the focus on it after a slight delay.
   */
  open() {
    this.show();
    this.focusInput();
  }

  /**
   * Hide this field. When clicking the "X" button. If an `onHide` method has
   * been provided it will be called and the global state will have to update
   * the display props. Otherwise, the internal state will be updated instead.
   */
  hide() {
    this.clearSearchBox();
    if (this.props.onHide) {
      this.props.onHide();
    } else if (this.state.display !== DISPLAY.NONE) {
      this.setState({ display: DISPLAY.NONE });
    }
  }

  /**
   * Show this field when the Search Toggle is click.
   */
  show() {
    if (this.state.display !== DISPLAY.VISIBLE) {
      this.setState({ display: DISPLAY.VISIBLE });
    }

    const { schemaName, formData, name, actions } = this.props;
    if (typeof formData[name] !== 'undefined') {
      actions.reduxForm.change(schemaName, name, this.state.searchText);
    }
  }

  /**
   * Expand fully form
   */
  expand() {
    if (this.state.display !== DISPLAY.EXPANDED) {
      this.setState({ display: DISPLAY.EXPANDED });
    }
  }

  /**
   * When toggling the advanced button
   */
  toggle() {
    switch (this.state.display) {
      case DISPLAY.VISIBLE:
        this.expand();
        setTimeout(this.focusFirstFormField, 50);
        break;
      case DISPLAY.EXPANDED:
        this.show();
        break;
      default:
        // noop
    }
  }

  /**
   * Determine if the search term has changed since the last search.
   * @returns {boolean}
   */
  searchTermIsDirty() {
    const { searchText, initialSearchText } = this.state;
    return searchText.trim() !== initialSearchText.trim();
  }

  /**
   * Wrap up all the data into an object and call the onSearch method provided via the props.
   * @param {Object} overrides Data to overrides over our existing form data.
   */
  doSearch(overrides = {}) {
    // Data to send to the remote service
    const { name, filterPrefix } = this.props;
    const searchData = {};
    const fieldData = this.getData();

    Object.entries(fieldData).forEach(([key, value]) => {
      // Strip any prefix from the key
      let newKey = key;
      let newValue = value;

      if (overrides.hasOwnProperty(key)) {
        newValue = overrides[key];
      }

      if (filterPrefix.length > 0 && key.startsWith(filterPrefix)) {
        newKey = key.substring(filterPrefix.length);
      }

      // Avoid adding prefixed and unprefixed keys, preferring the prefixed
      if (
        !filterPrefix.length > 0
        || key !== name
        || typeof fieldData[`${filterPrefix}${name}`] === 'undefined'
      ) {
        searchData[newKey] = newValue;
      }
    });

    const searchText = searchData[name] || '';
    if (
      this.state.display !== DISPLAY.VISIBLE ||
      this.state.initialSearchText !== searchText ||
      this.state.searchText !== searchText
    ) {
      this.setState({
        display: DISPLAY.VISIBLE,
        initialSearchText: searchText,
        searchText
      });
    }

    this.props.onSearch(searchData);
  }

  /**
   * Clear the Search component and focus on the first filter field.
   */
  clearFilters() {
    this.clearFormData();
    this.focusFirstFormField();
  }

  /**
   * Clear the Search component and focus on the main input field.
   */
  clearSearchBox() {
    this.clearFormData();
    this.focusInput();
  }

  /**
   * Take the provided tagData and format in way that will make sense for TagList.
   * @returns {Object[]}
   */
  formatTagData() {
    const { tagData, name, filterPrefix } = this.props;
    const tagDataCopy = Object.assign({}, tagData);
    const nameKey = `${filterPrefix}${name}`;

    // Remove any tag matching the name of our form field.
    if (tagDataCopy && tagDataCopy[nameKey]) {
      delete tagDataCopy[nameKey];
    }

    // Convert the tag data to a plain array and remove un-needed attributes.
    return tagDataCopy ?
      Object.values(tagDataCopy).map(({ key, label, value }) => ({ key, label, value })) :
      [];
  }

  render() {
    const { formSchemaUrl, forceFilters, id, displayBehavior,
      identifier, formIsDirty, tagData, name, ...props } = this.props;

    // If the box is not to be displayed
    if (this.state.display === DISPLAY.NONE) {
      if (displayBehavior === BEHAVIOR.TOGGLABLE) {
        return (<SearchToggle onToggle={this.show} />);
      }
      return (<div />);
    }

    // Display the SearchBox
    const formId = `${id}_ExtraFields`;
    const searchText = this.state.searchText;

    // Build classes
    const expanded = this.state.display === DISPLAY.EXPANDED;
    const visible = this.state.display === DISPLAY.VISIBLE;

    // Decide if we display the X button
    const hideable =
      [BEHAVIOR.HIDEABLE, BEHAVIOR.TOGGLABLE].includes(displayBehavior);

    const dirty = formIsDirty || this.searchTermIsDirty();
    const data = this.getData();
    const clearable = (Object.keys(data).length > 0);

    return (
      <Focusedzone onClickOut={this.show} className="search">
        <SearchBox
          {...props}
          name={`SearchBox__${name}`}
          onChange={this.handleChange}
          onSearch={this.doSearch}
          onToggleFilter={this.toggle}
          onHideFilter={this.show}
          onHide={this.hide}
          onClear={this.clearSearchBox}
          searchText={searchText}
          hideable={hideable}
          expanded={expanded}
          id={`${id}_searchbox`}
          showFilters={Boolean(forceFilters || formSchemaUrl)}
          dirty={dirty}
          clearable={clearable}
          onTagDelete={this.clearFormFilter}
          onTagClick={this.focusFormFilter}
          tagData={this.formatTagData()}
        >

          <SearchForm
            id={formId}
            identifier={identifier}
            visible={visible}
            expanded={expanded}
            formSchemaUrl={formSchemaUrl}
            onSearch={this.doSearch}
            onClear={this.clearFilters}
            clearable={clearable}
          />
        </SearchBox>
      </Focusedzone>
    );
  }
}

Search.propTypes = {
  onSearch: PropTypes.func,
  onHide: PropTypes.func,

  id: PropTypes.string.isRequired,
  display: PropTypes.oneOf(Object.values(DISPLAY)),
  formSchemaUrl: PropTypes.string,
  filters: PropTypes.object,
  formData: PropTypes.object,
  placeholder: PropTypes.string,
  displayBehavior: PropTypes.oneOf(Object.values(BEHAVIOR)),
  term: PropTypes.string,
  name: PropTypes.string,
  filterPrefix: PropTypes.string,
  forceFilters: PropTypes.bool,
  formIsDirty: PropTypes.bool,
  identifier: PropTypes.string,
  schemaName: PropTypes.string,
  tagHandlers: PropTypes.object,
  borders: PropTypes.shape({
    top: PropTypes.bool,
    right: PropTypes.bool,
    bottom: PropTypes.bool,
    left: PropTypes.bool,
  })
};

Search.defaultProps = {
  placeholder: i18n._t('Admin.SEARCH', 'Search'),
  display: DISPLAY.VISIBLE,
  displayBehavior: BEHAVIOR.NONE,
  filters: {},
  formData: {},
  term: '',
  filterPrefix: '',
  forceFilters: false,
  name: 'searchTerm',
  identifier: 'Admin.SearchForm'
};

function mapStateToProps(state, ownProps) {
  const schema = state.form.formSchemas[ownProps.formSchemaUrl];
  if (!schema || !schema.name) {
    return { formData: {} };
  }

  const schemaName = schema.name;

  const form = getIn(getFormState(state), schemaName);

  const formData = (form && form.values) || {};
  const tagData = mapFormSchemaToTags(schema, ownProps.filters, ownProps.tagHandlers || {});
  const formIsDirty = isDirty(schemaName, getFormState)(state);

  return { formData, formIsDirty, schemaName, tagData };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      schema: bindActionCreators(schemaActions, dispatch),
      reduxForm: bindActionCreators({ reset, initialize, change }, dispatch),
    },
  };
}

export { Search as Component, hasFilters };

export default connect(mapStateToProps, mapDispatchToProps)(Search);
