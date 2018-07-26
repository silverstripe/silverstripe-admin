/* global document */
import i18n from 'i18n';
import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import ReactDOM from 'react-dom';
import { bindActionCreators } from 'redux';
import * as schemaActions from 'state/schema/SchemaActions';
import { reset, initialize } from 'redux-form';
import { isDirty } from 'redux-form/lib/immutable';
import getIn from 'redux-form/lib/structure/plain/getIn';
import Focusedzone from '../Focusedzone/Focusedzone';
import getFormState from 'lib/getFormState';
import SearchBox from './SearchBox';
import SearchForm from './SearchForm';
import SearchToggle from './SearchToggle';


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
    this.doClear = this.doClear.bind(this);
    this.focusInput = this.focusInput.bind(this);
    this.focusFirstFormField = this.focusFirstFormField.bind(this);
    this.hide = this.hide.bind(this);
    this.show = this.show.bind(this);
    this.toggle = this.toggle.bind(this);
    this.open = this.open.bind(this);
    this.searchTermIsDirty = this.searchTermIsDirty.bind(this);

    const term = props.term || (props.filters && props.filters[props.name]) || '';
    this.state = {
      display: props.display,
      searchText: term,
      initialSearchText: term,
    };
  }

  componentWillMount() {
    this.setOverrides(this.props);
  }

  componentWillReceiveProps(props) {
    if (props && (!hasFilters(props.filters) && hasFilters(this.props.filters))) {
      this.clearFormData(props);
    } else if (JSON.stringify(props.filters) !== JSON.stringify(this.props.filters)) {
      this.setOverrides(props);
    }
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
   * @return Object
   */
  getData(ignoreSearchTerm = false) {
    const data = {};

    // Merge data from redux-forms with text field
    if (!ignoreSearchTerm && this.state.searchText) {
      data[this.props.name] = this.state.searchText.trim();
    }

    // Filter empty values
    Object.keys(this.props.formData).forEach((key) => {
      const value = this.props.formData[key];
      if (value) {
        data[key] = value;
      }
    });

    return data;
  }

  /**
   * Update the state search term form an input field change event.
   * @param event onChangeEvent from a input field.
   */
  handleChange(event) {
    const value = event.target.value;
    if (this.state.searchText !== value) {
      this.setState({ searchText: value });
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
  focusFirstFormField() {
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

    const input = form.querySelector('input, textarea, select, button');
    if (input) {
      input.focus();
      if (input.select) {
        input.select();
      }
    }
  }

  /**
   * Clear the search term and any advanced search form data.
   * @param props
   */
  clearFormData(props) {
    if (this.state.searchText !== '') {
      this.setState({ searchText: '' });
    }

    const schemaUrl = (props && props.formSchemaUrl) || this.props.formSchemaUrl;
    if (schemaUrl) {
      const identifier = (props && props.identifier) || this.props.identifier;
      this.props.actions.schema.setSchemaStateOverrides(schemaUrl, null);
      this.props.actions.reduxForm.initialize(identifier, {}, Object.keys(this.props.formData));
      this.props.actions.reduxForm.reset(identifier);
    }
  }

  /**
   * Show the Search box and set the focus on it after a slight delay.
   */
  open() {
    this.show();
    setTimeout(this.focusInput, 50);
  }

  /**
   * Hide this field. When clicking the "X" button. If an `onHide` method has
   * been provided it will be called and the global state will have to update
   * the display props. Otherwise, the internal state will be updated instead.
   */
  hide() {
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
   */
  doSearch() {
    this.setState({
      display: DISPLAY.VISIBLE,
      initialSearchText: this.state.searchText
    });

    const formData = this.getData(true);
    this.props.actions.schema.setSchemaStateOverrides(this.props.schemaUrl, null);
    this.props.actions.reduxForm.initialize(this.props.schemaName, formData);

    const data = this.getData();
    this.props.onSearch(data);
  }

  /**
   * Handle the internal clear event.
   */
  doClear() {
    this.clearFormData();
  }

  render() {
    const { formSchemaUrl, forceFilters, id, displayBehavior,
      identifier, formIsDirty, ...props } = this.props;

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
          onChange={this.handleChange}
          onSearch={this.doSearch}
          onToggleFilter={this.toggle}
          onHide={this.hide}
          onClear={this.doClear}
          searchText={searchText}
          hideable={hideable}
          expanded={expanded}
          id={`${id}_searchbox`}
          showFilters={Boolean(forceFilters || formSchemaUrl)}
          dirty={dirty}
          clearable={clearable}
        >

          <SearchForm
            id={formId}
            identifier={identifier}
            expanded={expanded}
            formSchemaUrl={formSchemaUrl}
            onSearch={this.doSearch}
            onClear={this.doClear}
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
  forceFilters: PropTypes.bool,
  formIsDirty: PropTypes.bool,
  identifier: PropTypes.string,
  schemaName: PropTypes.string,
};

Search.defaultProps = {
  placeholder: i18n._t('Admin.SEARCH', 'Search'),
  display: DISPLAY.VISIBLE,
  displayBehavior: BEHAVIOR.NONE,
  filters: {},
  formData: {},
  term: '',
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
  const formIsDirty = isDirty(schemaName, getFormState)(state);

  return { formData, formIsDirty, schemaName };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      schema: bindActionCreators(schemaActions, dispatch),
      reduxForm: bindActionCreators({ reset, initialize }, dispatch),
    },
  };
}

export { Search as Component, hasFilters };

export default connect(mapStateToProps, mapDispatchToProps)(Search);
