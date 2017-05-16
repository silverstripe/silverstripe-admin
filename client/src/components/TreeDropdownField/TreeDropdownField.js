import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import fieldHolder from 'components/FieldHolder/FieldHolder';
import fetch from 'isomorphic-fetch';
import Select from 'react-select';
import i18n from 'i18n';
import * as treeDropdownFieldActions from 'state/treeDropdownField/TreeDropdownFieldActions';
import TreeDropdownFieldMenu from 'components/TreeDropdownField/TreeDropdownFieldMenu';
import TreeDropdownFieldNode from 'components/TreeDropdownField/TreeDropdownFieldNode';
import url from 'url';

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
    this.getSelectedOption = this.getSelectedOption.bind(this);
    this.getVisibleTree = this.getVisibleTree.bind(this);
    // Events
    this.handleBack = this.handleBack.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleNavigate = this.handleNavigate.bind(this);
    // Helpers
    this.callFetch = this.callFetch.bind(this);
    this.lazyLoad = this.lazyLoad.bind(this);
    this.findTreeByID = this.findTreeByID.bind(this);
    this.findTreeByPath = this.findTreeByPath.bind(this);
    this.findTreePath = this.findTreePath.bind(this);
  }

  componentDidMount() {
    // Ensure root node is loaded, force invalidating the cache
    this.loadTree([]);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.data.cacheKey !== this.props.data.cacheKey) {
      // invalidate the tree cache, as paths have changed
      this.loadTree([]);
    }
  }

  /**
   * Get the currently visible node
   *
   * @return {Object}
   */
  getVisibleTree() {
    return this.findTreeByPath(this.props.tree, this.props.visible);
  }

  /**
   * Get array of breadcrumb nodes
   *
   * @return {Array}
   */
  getBreadcrumbs() {
    const breadcrumbs = [];

    // No more path means this is the complete tree
    let node = this.props.tree;
    for (const next of this.props.visible) {
      node = node.children.find((child) => (child.id === next));
      if (!node) {
        break;
      }
      breadcrumbs.push(node);
    }
    return breadcrumbs;
  }

  /**
   * Find or mock option for selected value, suitable for use by react-tree to display the
   * selected value. Note that a mocked object will be returned if the selected node isn't
   * able to be found in the loaded tree.
   *
   * @return {Object} - The selected option object, or null if not selected.
   */
  getSelectedOption() {
    if (!this.props.value) {
      return null;
    }
    // Find node from loaded tree to pull out label
    const selectedOption = this.findTreeByID(this.props.tree, this.props.value);
    if (selectedOption) {
      return selectedOption;
    }
    // Find node from data.valueObject
    if (this.props.data.valueObject && this.props.data.valueObject.id === this.props.value) {
      return this.props.data.valueObject;
    }
    // Mock selected option
    return {
      id: this.props.value,
      title: i18n._t('Admin.TREEDROPDOWN_LOADING', 'Loading...'),
      disabled: false,
    };
  }

  /**
   * Gets array of options to pass to the react-dropdown component
   *
   * @return {Array}
   */
  getDropdownOptions(value) {
    // force renderMenu() to handle rendering even if options are empty
    const node = this.getVisibleTree();
    const options = node ? node.children.slice(0) : [];

    // Ensure selected value exists in the option
    if (value) {
      // Get selected option
      let selectedOption = options.find((option) => (option.id === value));
      if (!selectedOption) {
        selectedOption = this.getSelectedOption();
        options.unshift(selectedOption);
      }
    }

    if (this.props.data.hasEmptyDefault && !this.props.visible.length) {
      options.unshift({
        id: '',
        title: this.props.data.emptyString,
        disabled: false,
      });
    }

    if (options && options.length) {
      return options;
    }

    // force renderMenu() to handle rendering even if options are empty
    return [{
      id: null,
      title: null,
      disabled: true,
    }];
  }

  /**
   * Call to make the fetching happen
   *
   * @param {Array} path to load
   * @returns {*}
   */
  callFetch(path) {
    const fetchURL = url.parse(this.props.data.urlTree, true);
    fetchURL.search = '';
    if (path.length) {
      fetchURL.query.ID = path[path.length - 1];
    }
    fetchURL.query.format = 'json';
    const fetchURLString = url.format(fetchURL);
    return fetch(fetchURLString, {
      credentials: 'same-origin',
    })
      .then(response => response.json());
  }

  /**
   * Given a tree and a path of IDs find the nested node
   *
   * @param {Object} tree
   * @param {Array} path
   * @return {Object} Nested tree
   */
  findTreeByPath(tree, path) {
    // No valid tree
    if (!tree || Object.keys(tree).length === 0) {
      return null;
    }
    // No more path means this is the complete tree
    if (path.length === 0) {
      return tree;
    }
    const subPath = path.slice(0);
    const nextID = subPath.shift();
    const subTree = tree.children.find((nextSubTree) => (nextSubTree.id === nextID));

    // Deepen search
    if (subTree) {
      return this.findTreeByPath(subTree, subPath);
    }

    // No tree found
    return null;
  }

  /**
   * Find a tree by id
   *
   * @param {Object} tree - Tree to search
   * @param {*} id - id property of node to find path for
   * @return {Object} - The tree if found, or null if not found.
   */
  findTreeByID(tree, id) {
    // No valid tree
    if (!tree || Object.keys(tree).length === 0) {
      return null;
    }
    // Found node
    if (tree.id === id) {
      return tree;
    }
    for (const child of tree.children) {
      // Search children
      const found = this.findTreeByID(child, id);
      if (found !== null) {
        return found;
      }
    }
    // No tree found
    return null;
  }

  /**
   * Finds path to the node in a tree
   *
   * @param {Object} tree - Tree to search
   * @param {*} id - id property of node to find path for
   * @return {Array} - The path to this node, or null if not found
   */
  findTreePath(tree, id) {
    // root node
    if (!id) {
      return [];
    }
    // No valid tree
    if (!tree || Object.keys(tree).length === 0) {
      return null;
    }
    // Base case, stops recursion
    if (tree.id === id) {
      return [tree.id];
    }
    if (!tree.children) {
      return null;
    }
    for (const child of tree.children) {
      // Search children
      const childPath = this.findTreePath(child, id);
      // Node found in subtree, shift this id and return
      if (childPath !== null) {
        // Don't add root ID
        if (tree.id) {
          childPath.unshift(tree.id);
        }
        return childPath;
      }
    }
    // No tree found
    return null;
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
      [...this.props.loading, ...this.props.failed]
        .indexOf(pathNode) > -1
    ));
    if (foundPrev) {
      return Promise.resolve({});
    }

    // If ancestor node is already loaded (and non-empty) then don't re-trigger
    const foundTree = this.findTreeByPath(this.props.tree, path);
    if (foundTree) {
      // Return if there are no children, or they are loaded
      if (foundTree.count === 0 || foundTree.children.length) {
        return Promise.resolve({});
      }
    }

    return this.loadTree(path);
  }

  loadTree(path) {
    // Mark as loading
    this.props.actions.treeDropdownField.beginTreeUpdating(this.props.id, path);

    return this.callFetch(path)
      .then((treeData) => {
        const firstLoad = Object.keys(this.props.tree).length === 0;

        // Populate tree
        this.props.actions.treeDropdownField.updateTree(this.props.id, path, treeData);

        // If this is the first time the tree has been loaded, then ensure
        // the selected visible node is highlighted
        if (firstLoad && this.props.value && path.length === 0) {
          const newPath = this.findTreePath(treeData, this.props.value);
          if (newPath) {
            // Revert one level to show parent
            newPath.pop();
            this.props.actions.treeDropdownField.setVisible(this.props.id, newPath);
          }
        }
        return treeData;
      })
      .catch((error) => {
        this.props.actions.treeDropdownField.updateTreeFailed(this.props.id, path);
        if (typeof this.props.onLoadingError === 'function') {
          return this.props.onLoadingError({
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
   * Handles changes to the text field's value.
   *
   * @param {Object} value - New value / option
   */
  handleChange(value) {
    // Get node ID from object
    const id = value ? value.id : null;
    if (typeof this.props.onChange === 'function') {
      this.props.onChange(id);
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

    // Find parent path
    let path = this.findTreePath(this.props.tree, id);
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
   * @return {XML}
   */
  renderMenu(renderMenuOptions) {
    // Build root node
    const visibleTree = this.getVisibleTree();
    const tree = Object.assign({}, visibleTree, {
      // we only want to show options with a title
      children: this.getDropdownOptions().filter((option) => option.title !== null),
    });
    const loading = this.props.loading.indexOf(tree.id || 0) > -1;
    const failed = this.props.failed.indexOf(tree.id || 0) > -1;
    const breadcrumbs = this.getBreadcrumbs();

    return (
      <TreeDropdownFieldMenu
        loading={loading}
        failed={failed}
        tree={tree}
        breadcrumbs={breadcrumbs}
        renderMenuOptions={renderMenuOptions}
        onBack={this.handleBack}
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
    // @todo - render child properly
    let button = null;
    if (tree.count) {
      const handleNavigate = (event) => this.handleNavigate(event, tree.id);
      button = (
        <button className="treedropdownfield__option-button"
          onClick={handleNavigate}
          onMouseDown={handleNavigate}
          onTouchEnd={handleNavigate}
        >
          <span className="treedropdownfield__option-count" >{tree.count}</span>
          <span className="icon font-icon-list" />
        </button>
      );
    }
    return (
      <div className="treedropdownfield__option flexbox-area-grow fill-width">
        <span className="treedropdownfield__option__title flexbox-area-grow">
          {tree.title}
        </span>
        {button}
      </div>
    );
  }

  render() {
    const inputProps = {
      id: this.props.id,
    };
    const className = this.props.extraClass
      ? `treedropdownfield ${this.props.extraClass}`
      : 'treedropdownfield';
    const options = this.getDropdownOptions(this.props.value);
    const value = (this.props.value === 0) ? '' : this.props.value;

    return (
      <Select
        searchable={false}
        className={className}
        name={this.props.name}
        options={options}
        inputProps={inputProps}
        menuRenderer={this.renderMenu}
        optionRenderer={this.renderOption}
        onChange={this.handleChange}
        onInputKeyDown={this.handleKeyDown}
        value={value}
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
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  readOnly: PropTypes.bool,
  disabled: PropTypes.bool,
  tree: PropTypes.shape(TreeDropdownFieldNode.propTypes), // Root node of tree
  visible: PropTypes.array, // Path to visible node
  loading: PropTypes.array, // List of nodes marked as loading
  failed: PropTypes.array, // List of nodes that failed to load
  data: PropTypes.shape({
    cacheKey: PropTypes.string.isRequired,
    urlTree: PropTypes.string.isRequired,
    emptyString: PropTypes.string,
    valueObject: PropTypes.shape({
      id: PropTypes.number,
      title: PropTypes.string,
    }),
    hasEmptyDefault: PropTypes.bool,
  }),
  onLoadingError: PropTypes.func,
  actions: PropTypes.shape({
    treeDropdownField: PropTypes.shape({
      beginTreeUpdating: PropTypes.func,
      updateTreeFailed: PropTypes.func,
      updateTree: PropTypes.func,
      setVisible: PropTypes.func,
    }),
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
};

function mapStateToProps(state, ownprops) {
  const id = ownprops.id;
  const field = (state.treeDropdownField && state.treeDropdownField.fields)
    ? state.treeDropdownField.fields[id]
    : null;

  if (field) {
    const tree = field.tree || {};
    const visible = field.visible || [];
    const loading = field.loading || [];
    const failed = field.failed || [];

    return { tree, visible, loading, failed };
  }
  return {};
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      treeDropdownField: bindActionCreators(treeDropdownFieldActions, dispatch),
    },
  };
}

const ConnectedTreeDropdownField = connect(mapStateToProps, mapDispatchToProps)(TreeDropdownField);

export { TreeDropdownField, ConnectedTreeDropdownField };

export default fieldHolder(ConnectedTreeDropdownField);
