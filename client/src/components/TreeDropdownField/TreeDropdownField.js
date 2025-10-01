import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import styled from '@emotion/styled';
import EmotionCssCacheProvider from 'containers/EmotionCssCacheProvider/EmotionCssCacheProvider';
import i18n from 'i18n';
import fieldHolder from 'components/FieldHolder/FieldHolder';
import fetch from 'isomorphic-fetch';
import Select, { components as selectComponents } from 'react-select';
import * as treeDropdownFieldActions from 'state/treeDropdownField/TreeDropdownFieldActions';
import TreeDropdownFieldNode from 'components/TreeDropdownField/TreeDropdownFieldNode';
import url from 'url';
import { Input } from 'reactstrap';
import { mapHighlight } from 'lib/castStringToElement';
import { findTreeByPath, findTreeByID, findTreePath } from './treeUtils';

const SEARCH_DELAY = 500; // ms

// legacy value for multi-select's empty value
const MULTI_EMPTY_VALUE = 'unchanged';

const SINGLE_EMPTY_VALUE = 0;

const Highlight = ({ children }) => (
  <span className="treedropdownfield__option-title--highlighted">{children}</span>
);

class TreeDropdownField extends Component {
  constructor(props) {
    super(props);

    // Renderers and custom component constructors
    this.render = this.render.bind(this);
    this.renderInput = this.renderInput.bind(this);
    this.renderMenuList = this.renderMenuList.bind(this);
    this.renderOption = this.renderOption.bind(this);
    this.formatOptionLabel = this.formatOptionLabel.bind(this);

    // Getters
    this.getBreadcrumbs = this.getBreadcrumbs.bind(this);
    this.getDropdownOptions = this.getDropdownOptions.bind(this);
    this.getVisibleTree = this.getVisibleTree.bind(this);

    // Events
    this.handleBack = this.handleBack.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleNavigate = this.handleNavigate.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.handleSearchReset = this.handleSearchReset.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);

    // Helpers
    this.callFetch = this.callFetch.bind(this);
    this.lazyLoad = this.lazyLoad.bind(this);
    this.filterOption = this.filterOption.bind(this);
    this.noOptionsMessage = this.noOptionsMessage.bind(this);

    this.state = {
      opened: false,
    };

    this.searchTimer = null;
  }

  componentDidMount() {
    // Ensure root node is loaded, force invalidating the cache when not readonly or disabled
    if (!this.props.readOnly && !this.props.disabled) {
      this.initialise();
    }

    const id = this.props.id;
    const values = (this.props.data.multiple)
      ? this.props.data.valueObjects || []
      : [this.props.data.valueObject];
    const selected = values.filter((item) => item);

    if (selected.length) {
      this.props.actions.treeDropdownField.addSelectedValues(id, selected);
    }
  }

  componentDidUpdate(oldProps) {
    if (this.props.readOnly || this.props.disabled) {
      return;
    }

    let reload = false;
    let visible = [];

    if (this.props.search !== oldProps.search) {
      // invalidate the tree cache
      reload = true;
      visible = this.props.visible;
    }

    if (oldProps.data.urlTree !== this.props.data.urlTree) {
      // invalidate the tree cache, as url has changed
      reload = true;
    }

    if (oldProps.data.cacheKey !== this.props.data.cacheKey) {
      // invalidate the tree cache, as paths have changed
      reload = true;
    }

    if (reload) {
      this.loadTree(visible, this.props.search, this.props);
    }
  }

  /**
   * Get the currently visible node
   *
   * @return {Object}
   */
  getVisibleTree() {
    return this.props.findTreeByPath(this.props.tree, this.props.visible);
  }

  /**
   * Get array of breadcrumb nodes
   *
   * @return {Array}
   */
  getBreadcrumbs(path = this.props.visible) {
    const breadcrumbs = [];

    if (!path) {
      return breadcrumbs;
    }
    // No more path means this is the complete tree
    let node = this.props.tree;

    // eslint-disable-next-line no-restricted-syntax
    for (const next of path) {
      if (!node.children) {
        break;
      }
      node = node.children.find((child) => (child.id === next));
      if (!node) {
        break;
      }
      breadcrumbs.push(node);
    }
    return breadcrumbs;
  }

  /**
   * Gets array of options to pass to the react-dropdown component
   *
   * @return {Array}
   */
  getDropdownOptions() {
    const value = this.props.value;
    const node = this.getVisibleTree();
    let options = node ? [...node.children] : [];

    const selectedOptions = this.props.selectedValues
      .filter(selected => (
        selected.id === value ||
        (Array.isArray(value) && value.find(item => item === selected.id))
      ));

    if (!this.state.opened && this.props.data.showSelectedPath) {
      options = selectedOptions
        .map(selected => ({
          ...selected,
          title: selected.titlePath || selected.title,
        }));
    } else if (selectedOptions.length) {
      options = [
        ...selectedOptions
          .filter(selected => (
            !options.find(item => item.id === selected.id)
          )),
        ...options,
      ];
    }

    // require an empty option in some instances
    // value is an empty string by react-select cannot find the options
    options.unshift({
      id: this.props.data.multiple ? '' : SINGLE_EMPTY_VALUE,
      title: (this.props.data.hasEmptyDefault) ? this.props.data.emptyString : null,
      disabled: !options.length || !this.props.data.hasEmptyDefault,
    });

    return options;
  }

  getPath(id) {
    const treePath = this.props.findTreePath(this.props.tree, id, this.props.data.treeBaseId);
    const breadcrumbs = this.getBreadcrumbs(treePath);

    return breadcrumbs
      .reduce((prev, path) => `${prev}${path.contextString || ''}${path.title}/`, '');
  }

  /**
   * Initialises the state of this field, forcing a root node
   * request and conditionally setting the path to the selected value
   * for single selected values.
   *
   * @return {Promise}
   */
  initialise() {
    return this
      .loadTree([], this.props.search)
      .then((treeData) => {
        // If this is the first time the tree has been loaded, then ensure
        // the selected visible node is highlighted, or otherwise reset to root
        let newPath = [];
        if (!this.props.data.multiple && this.props.value) {
          // Get path of current node
          newPath = this.props.findTreePath(treeData, this.props.value, this.props.data.treeBaseId);
          if (newPath) {
            // Revert one level to show parent
            newPath.pop();
          } else {
            newPath = [];
          }
        }
        this.props.actions.treeDropdownField.setVisible(this.props.id, newPath);
      });
  }

  /**
   * Call to make the fetching happen
   *
   * @param {Array} path to load
   * @param {string} search
   * @param {Object} props The props to be used by this method
   * @returns {Promise}
   */
  callFetch(path, search = '', props = this.props) {
    const fetchURL = url.parse(props.data.urlTree, true);
    if (props.data.showSearch && search.length) {
      fetchURL.query.search = search;
      fetchURL.query.flatList = '1';
    }
    // If incrementally loading, set base node
    if (path.length) {
      fetchURL.query.ID = path[path.length - 1];
    } else if (!props.data.multiple && props.value) {
      // If initial load, ensure that we mark any selected value as exposed
      fetchURL.query.forceValue = props.value;
    }
    fetchURL.query.format = 'json';
    fetchURL.search = null;
    const fetchURLString = url.format(fetchURL);
    return this.props.fetch(fetchURLString, {
      credentials: 'same-origin',
    })
      .then(response => response.json());
  }

  /**
   * Fetches data used to generate a form. This can be form schema and/or form state data.
   * When the response comes back the data is saved to state.
   *
   * @param {Array} path Path to ensure exists
   * @return {Object} Promise from the AJAX request.
   */
  lazyLoad(path) {
    // If any ancestor node in visible chain is either loading or failed then abort re-load
    const foundPrev = path.find((pathNode) => (
      this.props.loading.indexOf(pathNode) > -1
      || this.props.failed.indexOf(pathNode) > -1
    ));
    if (foundPrev) {
      return Promise.resolve({});
    }

    // If ancestor node is already loaded (and non-empty) then don't re-trigger
    const foundTree = this.props.findTreeByPath(this.props.tree, path);
    // Return if there are no children, or they are loaded
    if (foundTree && (foundTree.count === 0 || foundTree.children.length)) {
      return Promise.resolve({});
    }

    return this.loadTree(path);
  }

  /**
   * Sets callbacks and necessary state changes around a `callFetch()`
   *
   * @param {Array} path A list of ids denoting the path the user has browsed in to
   * @param {String} search A search term to use
   * @param {Object} props The props to be used by this method
   * @return {Promise}
   */
  loadTree(path, search = '', props = this.props) {
    // Mark as loading
    props.actions.treeDropdownField.beginTreeUpdating(props.id, path);

    return this.callFetch(path, search, props)
      .then((treeData) => {
        // Populate tree
        props.actions.treeDropdownField.updateTree(props.id, path, treeData);

        return treeData;
      })
      .catch((error) => {
        props.actions.treeDropdownField.updateTreeFailed(props.id, path);
        if (typeof props.onLoadingError === 'function') {
          return props.onLoadingError({
            errors: [
              {
                value: error.message,
                type: 'error',
              },
            ],
          });
        }
        throw error;
      });
  }

  /**
   * Returns whether a search is actively happening
   *
   * @return {Boolean}
   */
  hasSearch() {
    return this.props.data.showSearch && Boolean(this.props.search);
  }

  /**
   * A filter for the list of options to determine what is shown and what isn't
   */
  filterOption(option, input = '') {
    const parent = this.getVisibleTree();
    if ((option.value === SINGLE_EMPTY_VALUE || option.value === '') &&
      (!this.props.data.hasEmptyDefault || this.props.visible.length || this.hasSearch())
    ) {
      return false;
    }
    const title = option.label && option.label.toLocaleLowerCase();
    // using this.props.search so that we do not get flash of filtered current content
    // const search = this.props.search.toLocaleLowerCase();
    const search = input.toLocaleLowerCase();

    // need to do some checks for the selected options, so that they do not show unnecessarily
    return (search)
      // only show option if matches search filter
      ? title && title.includes(search)
      // only show option if it belongs in the current visible tree
      : (
        !parent ||
        !option.value ||
        parent.children.find((child) => child.id === option.value)
      );
  }

  handleOpen() {
    this.setState({ opened: true });

    this.handleSearchReset();
  }

  handleClose() {
    this.setState({ opened: false });
  }

  /**
   * Reset the search value
   */
  handleSearchReset() {
    clearTimeout(this.searchTimer);
    this.props.actions.treeDropdownField.setSearch(this.props.id, '');
  }

  /**
   * Sets the search value, handles throttling/debouncing so that API calls is not
   * fired after every keypress
   *
   * @param {String} value
   */
  handleSearchChange(value) {
    clearTimeout(this.searchTimer);
    // delay setting a search value, so ajax requests do not hammer the server
    this.searchTimer = setTimeout(() => {
      this.props.actions.treeDropdownField.setSearch(this.props.id, value);
    }, SEARCH_DELAY);
  }

  /**
   * Handles changes to the text field's value.
   *
   * @param {Object|Array} value - New value / option
   */
  handleChange(value) {
    let mappedValue = null;

    this.handleSearchReset();
    if (this.props.data.multiple) {
      mappedValue = MULTI_EMPTY_VALUE;

      if (value && value.length) {
        const uniqueValues = value && value
          .filter((item, index) => value.findIndex(next => next.id === item.id) === index);
        mappedValue = uniqueValues.map(item => item.id);

        this.props.actions.treeDropdownField.addSelectedValues(this.props.id, uniqueValues);
      }
    } else {
      // Get node ID from object
      const id = value ? value.id : null;
      const tree = this.getVisibleTree() || this.props.tree;
      let object = tree.children.find(item => item.id === id);
      if (object) {
        if (this.props.data.showSelectedPath) {
          object = {
            ...object,
            titlePath: this.getPath(id),
          };
        }
        this.props.actions.treeDropdownField.addSelectedValues(this.props.id, [object]);
      }

      mappedValue = id || SINGLE_EMPTY_VALUE;
    }

    if (typeof this.props.onChange === 'function') {
      this.props.onChange(mappedValue);
    }
  }

  /**
   * Handles navigating to a sub-tree
   *
   * @param {Event} event - Click event
   * @param {*} id - Id to add to end of path
   */
  handleNavigate(event, id) {
    if (this.hasSearch()) {
      return;
    }

    event.stopPropagation();
    event.nativeEvent.stopImmediatePropagation();
    event.preventDefault();

    // Find parent path
    let path = this.props.findTreePath(this.props.tree, id, this.props.data.treeBaseId);
    if (!path) {
      // Edge case: Path hasn't been loaded yet,
      // so append to current path
      path = this.props.visible.slice(0);
      path.push(id);
    }

    // Lazy-load children and update visibility
    this.lazyLoad(path);
    this.props.actions.treeDropdownField.setVisible(this.props.id, path);
  }

  /**
   * Extra keyboard accessibility.
   * Falls back on handling provided by react-select
   *
   * @param {Event} event
   */
  handleKeyDown(event) {
    // ignore handling keys if searching
    if (this.hasSearch()) {
      // if escape is pressed, clear the search term
      if (event.keyCode === 27) {
        this.handleSearchReset(event);
      }
      // let react-select handle it
      return;
    }

    // Only handle keys when an item is focused
    const focused = this.selectField.state.focusedOption;
    if (!focused) {
      // let react-select handle it
      return;
    }

    switch (event.keyCode) {
      case 37: // left, go back
        this.handleBack(event);
        break;
      case 39: // right, drill deeper
        if (focused.count) {
          this.handleNavigate(event, focused.id);
        }
        break;
      default:
        // let react-select handle it
        break;
    }
  }

  /**
   * Go up one level
   *
   * @param {Event} event - Click event
   */
  handleBack(event) {
    if (this.hasSearch()) {
      return;
    }

    event.stopPropagation();
    event.preventDefault();

    // Find id in existing path, otherwise adding it to the end
    let path = this.props.visible;

    if (path.length) {
      path = path.slice(0, path.length - 1);
    }

    // Lazy-load children and update visibility
    this.lazyLoad(path);
    this.props.actions.treeDropdownField.setVisible(this.props.id, path);
  }

  /**
   * Render the input field.
   * This essentially just sets the specific ID we want to use into the default input component.
   */
  renderInput({ children, ...props }) {
    props.id = this.props.id;
    return <selectComponents.Input {...props}>{children}</selectComponents.Input>;
  }

  /**
   * Render the breadcrumbs.
   * This sits above the options in nested trees, as a way to navigate back
   */
  renderBreadcrumbs(breadcrumbs, { cx, getStyles, getClassNames, ...props }) {
    if (breadcrumbs.length === 0) {
      return null;
    }

    // Join titles with ' / '
    breadcrumbs = breadcrumbs.map((item) => item.title).join(' / ');
    const icon = (this.hasSearch()) ? 'font-icon-search' : 'font-icon-left-open-big';

    // This allows us to get the correct css and class names that a normal react-select option uses.
    const className = cx(
      {
        option: true,
        breadcrumbs: true,
      },
      getClassNames('option', {})
    );
    const StyledDiv = styled.div(getStyles('option', props));

    return (
      <StyledDiv
        className={className}
        onClick={this.handleBack}
        role="button"
        tabIndex={0}
      >
        <button type="button" className="treedropdownfield__breadcrumbs-button">
          <span className={`icon ${icon}`} aria-hidden="true" />
        </button>
        <span className="treedropdownfield__breadcrumbs-crumbs flexbox-area-grow">
          {breadcrumbs}
        </span>
      </StyledDiv>
    );
  }

  /**
   * Render menulist.
   * Replaces the default MenuList component
   *
   * @param {Object} renderMenuOptions - Options passed from Select.js
   */
  renderMenuList({ children, ...props }) {
    const breadcrumbs = this.getBreadcrumbs();

    return (
      <selectComponents.MenuList {...props}>
        {this.renderBreadcrumbs(breadcrumbs, props)}
        {children}
      </selectComponents.MenuList>
    );
  }

  /**
   * Renders an option in a menu level.
   * Replaces the default Option component
   */
  renderOption({ children, ...props }) {
    let button = null;
    const tree = props.data;

    // button for dropping into nested trees
    if (tree.count && !this.hasSearch()) {
      const handleNavigate = (event) => this.handleNavigate(event, tree.id);
      button = (
        <button
          type="button"
          className="treedropdownfield__option-button fill-width"
          onClick={handleNavigate}
          onKeyDown={(event) => this.handleKeyDown(event)}
          onTouchStart={handleNavigate}
        >
          <span className="treedropdownfield__option-count-icon font-icon-right-open-big" aria-hidden="true" />
        </button>
      );
    }

    // search breadcrumbs for each nested search result
    let subtitle = null;
    if (this.hasSearch()) {
      subtitle = tree.contextString;

      if (!subtitle && this.props.data.hasEmptyDefault && !this.props.visible.length) {
        subtitle = this.props.data.emptyString;
      }
    }

    return (
      <selectComponents.Option {...props}>
        <span className="treedropdownfield__option-title-box flexbox-area-grow fill-height">
          <span className="treedropdownfield__option-title">{children}</span>
          { subtitle && <span className="treedropdownfield__option-context">{subtitle}</span> }
        </span>
        {button}
      </selectComponents.Option>
    );
  }

  /**
   * Fallback to a textbox for readonly and disabled status react-select isn't ideal for display
   *
   * @return {React}
   */
  renderReadOnly() {
    const inputProps = {
      id: this.props.id,
      readOnly: this.props.readOnly,
      disabled: this.props.disabled,
    };
    const className = this.props.extraClass
      ? `treedropdownfield ${this.props.extraClass}`
      : 'treedropdownfield';
    let title = (this.props.data.hasEmptyDefault) ? this.props.data.emptyString : '';
    const selected = this.props.selectedValues;

    if (this.props.data.multiple) {
      const values = this.props.value
        .map((value) => (
          // assumes all selected values had been populated into `props.selectedValues`
          selected.find((item) => item.id === value) ||
          value
        ));

      title = values.map(value => value.title).join(', ');
    } else {
      const value = selected.find((item) => item.id === this.props.value);
      title = this.props.value;

      if (value && typeof value.title === 'string') {
        title = value.title;
      }
    }

    return (
      <div className={className}>
        <span
          className="treedropdownfield__title"
          role="textbox"
          aria-readonly="true"
          tabIndex="0"
        >{title}</span>
        <Input
          type="hidden"
          name={this.props.name}
          value={this.props.value}
          {...inputProps}
        />
      </div>
    );
  }

  formatOptionLabel(option) {
    const { title } = option;

    return this.props.search.length
      ? mapHighlight(title || '', this.props.search, Highlight)
      : title;
  }

  noOptionsMessage({ inputValue }) {
    const visibleTree = this.getVisibleTree() || {};

    // Only show failed message for the currently visible tree or root
    if (this.props.failed.indexOf(visibleTree.id || 0) >= 0) {
      return i18n._t('Admin.TREEDROPDOWN_FAILED', 'Failed to load');
    }
    // If there was a search or this is the root level, say "no options"
    if (inputValue || !visibleTree.id) {
      return i18n._t('Admin.TREEDROPDOWN_NO_OPTIONS', 'No options');
    }
    // If this is inside a tree and there was no search, say "no children"
    return i18n._t('Admin.TREEDROPDOWN_NO_CHILDREN', 'No children');
  }

  render() {
    if (this.props.readOnly || this.props.disabled) {
      return this.renderReadOnly();
    }

    const className = this.props.extraClass
      ? `treedropdownfield ${this.props.extraClass}`
      : 'treedropdownfield';
    const options = this.getDropdownOptions();

    // The value passed in is an array of all selected option objects
    // i.e. an id and title key must be present for each selected option
    const rawValue = Array.isArray(this.props.value) ? this.props.value : [this.props.value];
    let value = this.props.selectedValues.filter(item => rawValue.includes(item.id));

    // If there weren't any "selected" values (e.g. setting the value programatically)
    // make sure the value is valid
    if (!value.length) {
      value = options.filter(item => rawValue.includes(item.id));
    }

    // Fall back to the empty default value if there is one
    if (!value.length && this.props.data.hasEmptyDefault) {
      value = options[0];
    }

    const showSearch = (typeof this.props.data.showSearch !== 'undefined')
      ? this.props.data.showSearch
      : false;

    const components = {
      Input: this.renderInput,
      MenuList: this.renderMenuList,
      Option: this.renderOption,
    };

    const visibleTree = this.getVisibleTree() || {};
    // Only show loading message for the currently visible tree or root
    const isLoading = this.props.loading.indexOf(visibleTree.id || 0) >= 0;

    return (
      <EmotionCssCacheProvider>
        <Select
          isSearchable={showSearch}
          isMulti={this.props.data.multiple}
          isClearable
          className={className}
          name={this.props.name}
          options={options}
          delimiter=","
          components={components}
          formatOptionLabel={this.formatOptionLabel}
          filterOption={this.filterOption}
          onChange={this.handleChange}
          onMenuOpen={this.handleOpen}
          onMenuClose={this.handleClose}
          onKeyDown={this.handleKeyDown}
          onInputChange={this.handleSearchChange}
          isLoading={isLoading}
          loadingMessage={() => i18n._t('Admin.TREEDROPDOWN_LOADING', 'Loading...')}
          noOptionsMessage={this.noOptionsMessage}
          value={value}
          ref={(select) => { this.selectField = select; }}
          placeholder={this.props.data.emptyString}
          getOptionLabel={({ title }) => title}
          getOptionValue={({ id }) => id}
          classNamePrefix="treedropdownfield"
          classNames={{
            option: () => 'fill-width',
          }}
          isOptionDisabled={(option) => option.disabled}
        />
      </EmotionCssCacheProvider>
    );
  }
}

TreeDropdownField.propTypes = {
  className: PropTypes.string,
  extraClass: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.array,
  ]),
  readOnly: PropTypes.bool,
  disabled: PropTypes.bool,
  tree: PropTypes.shape(TreeDropdownFieldNode.propTypes), // Root node of tree
  findTreeByPath: PropTypes.func, // Finds the node given the tree and a path
  findTreePath: PropTypes.func, // Given an ID, find the path to the node
  visible: PropTypes.array, // Path to visible node
  loading: PropTypes.array, // List of nodes marked as loading
  failed: PropTypes.array, // List of nodes that failed to load
  selectedValues: PropTypes.array,
  data: PropTypes.shape({
    cacheKey: PropTypes.string,
    urlTree: PropTypes.string.isRequired,
    emptyString: PropTypes.string,
    valueObject: PropTypes.shape(TreeDropdownFieldNode.propTypes),
    valueObjects: PropTypes.arrayOf(PropTypes.shape(TreeDropdownFieldNode.propTypes)),
    hasEmptyDefault: PropTypes.bool,
    showSearch: PropTypes.bool,
    multiple: PropTypes.bool,
    showSelectedPath: PropTypes.bool,
    treeBaseId: PropTypes.number
  }),
  onLoadingError: PropTypes.func,
  search: PropTypes.string,
  actions: PropTypes.shape({
    treeDropdownField: PropTypes.object,
  }),
  fetch: PropTypes.func, // Allows mocking / wrapping of fetch calls
};

TreeDropdownField.defaultProps = {
  // React considers "undefined" as an uncontrolled component.
  value: '',
  extraClass: '',
  className: '',
  tree: {},
  visible: [],
  loading: [],
  failed: [],
  findTreeByPath,
  findTreePath,
  fetch
};

function mapStateToProps(state, ownProps) {
  const id = ownProps.id;
  const field = (state.treeDropdownField.fields[id])
    ? state.treeDropdownField.fields[id]
    : {
      tree: {},
      visible: [],
      loading: [],
      failed: [],
      search: '',
      selectedValues: [],
    };

  let value = ownProps.value;

  if (ownProps.data.multiple && ownProps.value === MULTI_EMPTY_VALUE) {
    value = [];
  }

  if (!ownProps.data.multiple && !ownProps.value) {
    value = SINGLE_EMPTY_VALUE;
  }

  return { ...field, value };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      treeDropdownField: bindActionCreators(treeDropdownFieldActions, dispatch),
    },
  };
}

const ConnectedTreeDropdownField = connect(mapStateToProps, mapDispatchToProps)(TreeDropdownField);

export {
  TreeDropdownField as Component,
  ConnectedTreeDropdownField,
  MULTI_EMPTY_VALUE,
  SINGLE_EMPTY_VALUE,
  findTreePath,
  findTreeByID,
  findTreeByPath,
};

export default fieldHolder(ConnectedTreeDropdownField);
