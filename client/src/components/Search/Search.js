/* global document */
import i18n from 'i18n';
import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import ReactDOM from 'react-dom';
import { bindActionCreators } from 'redux';
import * as schemaActions from 'state/schema/SchemaActions';
import { reset, initialize } from 'redux-form';
import getIn from 'redux-form/lib/structure/plain/getIn';
import Focusedzone from 'components/Focusedzone/Focusedzone';
import getFormState from 'lib/getFormState';
import SearchBox from './SearchBox';
import SearchForm from './SearchForm';
import SearchToggle from './SearchToggle';


const display = {
  NONE: 'NONE',
  VISIBLE: 'VISIBLE',
  EXPANDED: 'EXPANDED',
};
const displayBehavior = {
  NONE: 'NONE',
  HIDEABLE: 'HIDEABLE',
  TOGGLABLE: 'TOGGLABLE'
};

const identifier = 'Admin.SearchForm';

/**
 * @param {Object} filters
 * @returns {boolean}
 */
function hasFilters(filters) {
  return (filters && Object.keys(filters).length > 0);
}

/**
 * Displays a search form
 */
class Search extends Component {
  constructor(props) {
    super(props);

    this.expand = this.expand.bind(this);
    this.doSearch = this.doSearch.bind(this);
    this.doClear = this.doClear.bind(this);
    this.focusInput = this.focusInput.bind(this);
    this.focusFirstFormField = this.focusFirstFormField.bind(this);
    this.hide = this.hide.bind(this);
    this.show = this.show.bind(this);
    this.toggle = this.toggle.bind(this);
    this.open = this.open.bind(this);
    this.state = {
      searchText: (props.filters && props.filters.name) || '',
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
        !hasFilters(props.filters) || this.props.searchFormSchemaUrl !== props.searchFormSchemaUrl
      )) {
      // clear any overrides that may be in place
      const schemaUrl = (props && props.searchFormSchemaUrl) || this.props.searchFormSchemaUrl;
      if (schemaUrl) {
        this.props.actions.schema.setSchemaStateOverrides(schemaUrl, null);
      }
    }

    if (props && (hasFilters(props.filters) && props.searchFormSchemaUrl)) {
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
      this.props.actions.schema.setSchemaStateOverrides(props.searchFormSchemaUrl, overrides);
    }
  }

  focusInput() {
    if (this.state.display === display.NONE) {
      return;
    }

    const node = ReactDOM.findDOMNode(this);
    if (!node) {
      return;
    }

    const input = node.querySelector('.search__content-field');
    // check that it doesn't already have focus
    if (input !== document.activeElement) {
      input.focus();
      if (input.select) {
        input.select();
      }
    }
  }

  focusFirstFormField() {
    if (this.state.display !== display.EXPANDED) {
      return;
    }

    const node = ReactDOM.findDOMNode(this);
    if (!node) {
      return;
    }

    const form = node.querySelector('.search__filter-panel form');
    if (!form) {
      return;
    }

    const input = form.querySelector('input, textarea, select');
    if (input) {
      input.focus();
      if (input.select) {
        input.select();
      }
    }
  }

  clearFormData(props) {
    this.setState({ searchText: '' });

    const schemaUrl = (props && props.searchFormSchemaUrl) || this.props.searchFormSchemaUrl;
    if (schemaUrl) {
      this.props.actions.schema.setSchemaStateOverrides(schemaUrl, null);
      this.props.actions.reduxForm.initialize(identifier, {}, Object.keys(this.props.formData));
      this.props.actions.reduxForm.reset(identifier);
    }
  }

  open() {
    this.show();
    setTimeout(this.focusInput, 50);
  }

  /**
   * Hide this field.
   * When clicking the "X" button
   */
  hide() {
    this.setState({ display: display.NONE });
  }

  /**
   * Show this field.
   * When clicking the green activate "magnifying glass" button
   */
  show() {
    this.setState({ display: display.VISIBLE });
  }

  /**
   * Expand fully form
   */
  expand() {
    this.setState({ display: display.EXPANDED });
  }

  /**
   * When toggling the advanced button
   */
  toggle() {
    switch (this.state.display) {
      case display.VISIBLE:
        this.expand();
        setTimeout(this.focusFirstFormField, 50);
        break;
      case display.EXPANDED:
        this.show();
        break;
      default:
        // noop
    }
  }

  doSearch() {
    const data = {};

    // Merge data from redux-forms with text field
    if (this.state.searchText) {
      data.name = this.state.searchText;
    }

    // Filter empty values
    Object.keys(this.props.formData).forEach((key) => {
      const value = this.props.formData[key];
      if (value) {
        data[key] = value;
      }
    });

    this.show();
    this.props.onSearch(data);
  }

  doClear() {
    this.clearFormData();
  }

  render() {
    const { formSchemaUrl, id, ...props } = this.props;

    const formId = `${id}_ExtraFields`;
    const searchText = this.state.searchText;

    // Build classes
    const searchClasses = ['search'];
    const showToggle =
      (props.display === display.NONE) &&
      (props.displayBehavior === displayBehavior.TOGGLABLE);
    const expanded = props.display === display.EXPANDED;

    // Decide if we display the X button
    const hideable =
      [displayBehavior.HIDEABLE, displayBehavior.TOGGLABLE].indexOf(props.displayBehavior) > -1;
    if (hideable) {
      searchClasses.push('search__hideable');
    } else {
      searchClasses.push('search__not-hideable');
    }

    return (showToggle ? <SearchToggle onToggle={this.show} /> :
    <Focusedzone onClickOut={this.hide}>
      <SearchBox
        onChange={this.handleChange}
        searchText={searchText}
        hideable={hideable}
        expanded={expanded}
        id={`${id}_searchbox`}
        {...props}
      >

        <SearchForm
          id={formId}
          expanded={expanded}
          formSchemaUrl={formSchemaUrl}
          onSearch={this.doSearch}
          onClear={this.doClear}
        />
      </SearchBox>
    </Focusedzone>
    );
  }
}


Search.propTypes = {
  onSearch: PropTypes.func,
  onClear: PropTypes.func,
  onShowFilters: PropTypes.func,
  onHideFilters: PropTypes.func,
  onShow: PropTypes.func,
  onHide: PropTypes.func,

  id: PropTypes.string.isRequired,
  display: PropTypes.oneOf(Object.values(display)),
  showFilters: PropTypes.bool,
  formSchemaUrl: PropTypes.string,
  filters: PropTypes.object,
  formData: PropTypes.object,
  placeholder: PropTypes.string,
  displayBehavior: PropTypes.oneOf(Object.values(displayBehavior)),
  term: PropTypes.string,

  forceFilters: PropTypes.bool,
};

Search.defaultProps = {
  placeholder: i18n._t('Admin.SEARCH', 'Search'),
  display: display.VISIBLE,
  displayBehavior: displayBehavior.NONE,
  showFilters: false,
  filters: {},
  formData: {},
  term: '',
  forceFilters: false
};

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

export { Search as Component, hasFilters };

export default connect(mapStateToProps, mapDispatchToProps)(Search);
