import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import fieldHolder from 'components/FieldHolder/FieldHolder';
import fetch from 'isomorphic-fetch';
import Select from 'react-select';
import * as treeDropdownFieldActions from 'state/treeDropdownField/TreeDropdownFieldActions';
import TreeDropdownFieldMenu from 'components/TreeDropdownField/TreeDropdownFieldMenu';
import TreeDropdownFieldNode from 'components/TreeDropdownField/TreeDropdownFieldNode';
import url from 'url';
import { FormControl } from 'react-bootstrap-ss';
import { mapHighlight } from 'lib/castStringToElement';
import { findTreeByPath, findTreeByID, findTreePath } from './treeUtils';

const SEARCH_DELAY = 500; // ms

// legacy value for multi-select's empty value
const MULTI_EMPTY_VALUE = 'unchanged';

const SINGLE_EMPTY_VALUE = 0;

class TreeDropdownField extends Component {
  constructor(props) {
    super(props);

    // Renderers
    this.render = this.render.bind(this);
    this.renderMenu = this.renderMenu.bind(this);
    this.renderOption = this.renderOption.bind(this);

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
    this.filterOptions = this.filterOptions.bind(this);

    this.state = {
      opened: false,
    };

    this.searchTimer = null;
  }

  componentDidMount() {
    // Ensure root node is loaded, force invalidating the cache when not readonly or disabled
    if (!this.props.readOnly && !this.props.disabled) {
      this.loadTree([], this.props.search)
        .then((treeData) => {
          // If this is the first time the tree has been loaded, then ensure
          // the selected visible node is highlighted
          if (!this.props.data.multiple && this.props.value) {
            const newPath = this.props.findTreePath(treeData, this.props.value);
            if (newPath) {
              // Revert one level to show parent
              newPath.pop();
              this.props.actions.treeDropdownField.setVisible(this.props.id, newPath);
            }
          }
        });
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

  componentWillReceiveProps(nextProps) {
    if (this.props.readOnly || this.props.disabled) {
      return;
    }

    let reload = false;
    let visible = [];

    if (this.props.search !== nextProps.search) {
      // invalidate the tree cache
      reload = true;
      visible = nextProps.visible;
    }

    if (nextProps.data.urlTree !== this.props.data.urlTree) {
      // invalidate the tree cache, as url has changed
      reload = true;
    }

    if (nextProps.data.cacheKey !== this.props.data.cacheKey) {
      // invalidate the tree cache, as paths have changed
      reload = true;
    }

    if (reload) {
      this.loadTree(visible, nextProps.search, nextProps);
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
    const treePath = this.props.findTreePath(this.props.tree, id);
    const breadcrumbs = this.getBreadcrumbs(treePath);

    return breadcrumbs
      .reduce((prev, path) => `${prev}${path.contextString || ''}${path.title}/`, '');
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
    if (path.length) {
      fetchURL.query.ID = path[path.length - 1];
    }
    fetchURL.query.format = 'json';
    fetchURL.search = null;
    const fetchURLString = url.format(fetchURL);
    return fetch(fetchURLString, {
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
        // TODO: investigate whether failed should not retry
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
   * A filter for the list of options so determine what is shown and what isn't
   *
   * @param {Object[]} options
   * @return {Object[]}
   */
  filterOptions(options) {
    const parent = this.getVisibleTree();

    return options.filter((option) => {
      if ((option.id === SINGLE_EMPTY_VALUE || option.id === '') &&
        (!this.props.data.hasEmptyDefault || this.props.visible.length || this.hasSearch())
      ) {
          return false;
      }
      const title = option.title && option.title.toLocaleLowerCase();
      // using this.props.search so that we do not get flash of filtered current content
      const search = this.props.search.toLocaleLowerCase();

      // need to do some checks for the selected options, so that they do not show unnecessarily
      return (search)
        // only show option if matches search filter
        ? title && title.includes(search)
        // only show option if it belongs in the current visible tree
        : (
          !parent ||
          !option.id ||
          parent.children.find((child) => child.id === option.id)
        );
    });
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
    event.stopPropagation();
    event.preventDefault();

    if (this.hasSearch()) {
      return;
    }
    // Find parent path
    let path = this.props.findTreePath(this.props.tree, id);
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
   * Extra keyboard accessibility
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
      return;
    }

    // Only handle keys when an item is focused
    const focused = this.selectField.getFocusedOption();
    if (!focused) {
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
        break;
    }
  }

  /**
   * Go up one level
   *
   * @param {Event} event - Click event
   */
  handleBack(event) {
    event.stopPropagation();
    event.preventDefault();

    if (this.hasSearch()) {
      return;
    }
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
   * Render menu.
   * Replaces react-select/defaultMenuRenderer.js. See this file
   * for details on renderMenuOptions
   *
   * @param {Object} renderMenuOptions - Options passed from Select.js
   */
  renderMenu(renderMenuOptions) {
    // Build root node
    const visibleTree = this.getVisibleTree() || {};
    const loading = this.props.loading.indexOf(visibleTree.id || 0) > -1;
    const failed = this.props.failed.indexOf(visibleTree.id || 0) > -1;
    const breadcrumbs = this.getBreadcrumbs();

    return (
      <TreeDropdownFieldMenu
        loading={loading}
        failed={failed}
        tree={visibleTree}
        breadcrumbs={breadcrumbs}
        renderMenuOptions={renderMenuOptions}
        onBack={this.handleBack}
        search={this.hasSearch()}
        value={this.props.value}
      />
    );
  }

  /**
   * Renders an option in a menu level.
   * Replaces Select.js getOptionLabel() method
   *
   * @param {Object} tree - Tree being rendered
   */
  renderOption(tree) {
    let button = null;
    if (tree.count && !this.hasSearch()) {
      const handleNavigate = (event) => this.handleNavigate(event, tree.id);
      button = (
        <button
          className="treedropdownfield__option-button fill-width"
          onClick={handleNavigate}
          onMouseDown={handleNavigate}
          onTouchStart={handleNavigate}
        >
          <span className="treedropdownfield__option-count-icon font-icon-right-open-big" />
        </button>
      );
    }

    const Highlight = ({ children }) => (
      <span className="treedropdownfield__option-title--highlighted">{children}</span>
    );
    const title = (this.props.search.length)
      ? mapHighlight(tree.title, this.props.search, Highlight)
      : tree.title;

    let subtitle = null;
    if (this.hasSearch()) {
      subtitle = tree.contextString;

      if (!subtitle && this.props.data.hasEmptyDefault && !this.props.visible.length) {
        subtitle = this.props.data.emptyString;
      }
    }

    return (
      <div className="treedropdownfield__option fill-width">
        <div className="treedropdownfield__option-title-box flexbox-area-grow fill-height">
          <span className="treedropdownfield__option-title">{title}</span>
          { subtitle &&
          <span className="treedropdownfield__option-context">{subtitle}</span>
          }
        </div>
        {button}
      </div>
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
        <span className="treedropdownfield__title">{title}</span>
        <FormControl
          type="hidden"
          name={this.props.name}
          value={this.props.value}
          {...inputProps}
        />
      </div>
    );
  }

  render() {
    if (this.props.readOnly || this.props.disabled) {
      return this.renderReadOnly();
    }

    const inputProps = {
      id: this.props.id,
    };
    const className = this.props.extraClass
      ? `treedropdownfield ${this.props.extraClass}`
      : 'treedropdownfield';
    const options = this.getDropdownOptions();
    let value = this.props.value;

    // Multiple select should be coerced to array
    if (this.props.data.multiple) {
      value = this.props.value
        ? this.props.selectedValues.filter(item => value.includes(item.id))
        : [];
    }

    const resetValue = (this.props.data.hasEmptyDefault && !this.props.visible.length)
      ? ''
      : null;
    const showSearch = (typeof this.props.data.showSearch !== 'undefined')
      ? this.props.data.showSearch
      : false;

    return (
      <Select
        searchable={showSearch}
        multi={this.props.data.multiple}
        className={className}
        name={this.props.name}
        options={options}
        inputProps={inputProps}
        menuRenderer={this.renderMenu}
        filterOptions={this.filterOptions}
        optionRenderer={this.renderOption}
        onChange={this.handleChange}
        onOpen={this.handleOpen}
        onClose={this.handleClose}
        onBlurResetsInput
        onInputKeyDown={this.handleKeyDown}
        onInputChange={this.handleSearchChange}
        isLoading={Boolean(this.props.loading.length)}
        value={value}
        resetValue={resetValue}
        joinValues
        ref={(select) => { this.selectField = select; }}
        placeholder={this.props.data.emptyString}
        labelKey="title"
        valueKey="id"
      />
    );
  }
}

TreeDropdownField.propTypes = {
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
  }),
  onLoadingError: PropTypes.func,
  search: PropTypes.string,
  actions: PropTypes.shape({
    treeDropdownField: PropTypes.object,
  }),
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
