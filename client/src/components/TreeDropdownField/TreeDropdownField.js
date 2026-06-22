import React, { useRef, useState, useEffect } from 'react';
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

const TreeDropdownField = (_props) => {
  const defaultProps = {
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
  const props = {
    ...defaultProps,
    ..._props,
  };

  const [opened, setOpened] = useState(false);

  // Mutable instance variable (was this.searchTimer)
  const searchTimer = useRef(null);
  // Ref to the react-select instance (was this.selectField)
  const selectField = useRef(null);

  // Persist the latest props to simulate class component `this.props` behavior
  // and prevent stale closures
  const propsRef = useRef(props);
  // Update current props on each render before running any effects or callbacks
  propsRef.current = props;

  /**
   * Get the currently visible node
   *
   * @return {Object}
   */
  const getVisibleTree = () => props.findTreeByPath(props.tree, props.visible);

  /**
   * Get array of breadcrumb nodes
   *
   * @return {Array}
   */
  const getBreadcrumbs = (path = props.visible) => {
    const breadcrumbs = [];

    if (!path) {
      return breadcrumbs;
    }
    // No more path means this is the complete tree
    let node = props.tree;

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
  };

  /**
   * Returns whether a search is actively happening
   *
   * @return {Boolean}
   */
  const hasSearch = () => props.data.showSearch && Boolean(props.search);

  /**
   * Reset the search value
   */
  const handleSearchReset = () => {
    clearTimeout(searchTimer.current);
    propsRef.current.actions.treeDropdownField.setSearch(propsRef.current.id, '');
  };

  /**
   * Call to make the fetching happen
   *
   * @param {Array} path to load
   * @param {string} search
   * @param {Object} currentProps The props to be used by this method
   * @returns {Promise}
   */
  const callFetch = (path, search = '', currentProps = propsRef.current) => {
    const fetchURL = url.parse(currentProps.data.urlTree, true);
    if (currentProps.data.showSearch && search.length) {
      fetchURL.query.search = search;
      fetchURL.query.flatList = '1';
    }
    // If incrementally loading, set base node
    if (path.length) {
      fetchURL.query.ID = path[path.length - 1];
    } else if (!currentProps.data.multiple && currentProps.value) {
      // If initial load, ensure that we mark any selected value as exposed
      fetchURL.query.forceValue = currentProps.value;
    }
    fetchURL.query.format = 'json';
    fetchURL.search = null;
    const fetchURLString = url.format(fetchURL);
    return currentProps.fetch(fetchURLString, {
      credentials: 'same-origin',
    })
      .then(response => response.json());
  };

  /**
   * Sets callbacks and necessary state changes around a `callFetch()`
   *
   * @param {Array} path A list of ids denoting the path the user has browsed in to
   * @param {String} search A search term to use
   * @param {Object} currentProps The props to be used by this method
   * @return {Promise}
   */
  const loadTree = (path, search = '', currentProps = propsRef.current) => {
    // Mark as loading
    currentProps.actions.treeDropdownField.beginTreeUpdating(currentProps.id, path);

    return callFetch(path, search, currentProps)
      .then((treeData) => {
        // Populate tree
        currentProps.actions.treeDropdownField.updateTree(currentProps.id, path, treeData);

        return treeData;
      })
      .catch((error) => {
        currentProps.actions.treeDropdownField.updateTreeFailed(currentProps.id, path);
        if (typeof currentProps.onLoadingError === 'function') {
          return currentProps.onLoadingError({
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
  };

  /**
   * Fetches data used to generate a form. This can be form schema and/or form state data.
   * When the response comes back the data is saved to state.
   *
   * @param {Array} path Path to ensure exists
   * @return {Object} Promise from the AJAX request.
   */
  const lazyLoad = (path) => {
    // If any ancestor node in visible chain is either loading or failed then abort re-load
    const foundPrev = path.find((pathNode) => (
      propsRef.current.loading.indexOf(pathNode) > -1
      || propsRef.current.failed.indexOf(pathNode) > -1
    ));
    if (foundPrev) {
      return Promise.resolve({});
    }

    // If ancestor node is already loaded (and non-empty) then don't re-trigger
    const foundTree = propsRef.current.findTreeByPath(propsRef.current.tree, path);
    // Return if there are no children, or they are loaded
    if (foundTree && (foundTree.count === 0 || foundTree.children.length)) {
      return Promise.resolve({});
    }

    return loadTree(path);
  };

  /**
   * Initialises the state of this field, forcing a root node
   * request and conditionally setting the path to the selected value
   * for single selected values.
   *
   * @return {Promise}
   */
  const initialise = () => loadTree([], propsRef.current.search)
    .then((treeData) => {
      // If this is the first time the tree has been loaded, then ensure
      // the selected visible node is highlighted, or otherwise reset to root
      let newPath = [];
      if (!propsRef.current.data.multiple && propsRef.current.value) {
        // Get path of current node
        newPath = propsRef.current.findTreePath(
          treeData,
          propsRef.current.value,
          propsRef.current.data.treeBaseId
        );
        if (newPath) {
          // Revert one level to show parent
          newPath.pop();
        } else {
          newPath = [];
        }
      }
      propsRef.current.actions.treeDropdownField.setVisible(propsRef.current.id, newPath);
    });

  // componentDidMount equivalent
  useEffect(() => {
    // Ensure root node is loaded, force invalidating the cache when not readonly or disabled
    if (!propsRef.current.readOnly && !propsRef.current.disabled) {
      initialise();
    }

    const id = propsRef.current.id;
    const values = (propsRef.current.data.multiple)
      ? propsRef.current.data.valueObjects || []
      : [propsRef.current.data.valueObject];
    const selected = values.filter((item) => item);

    if (selected.length) {
      propsRef.current.actions.treeDropdownField.addSelectedValues(id, selected);
    }
  }, []);

  // Track previous values for componentDidUpdate-style comparisons
  const prevSearchRef = useRef(props.search);
  const prevUrlTreeRef = useRef(props.data.urlTree);
  const prevCacheKeyRef = useRef(props.data.cacheKey);

  // componentDidUpdate equivalent
  useEffect(() => {
    if (props.readOnly || props.disabled) {
      prevSearchRef.current = props.search;
      prevUrlTreeRef.current = props.data.urlTree;
      prevCacheKeyRef.current = props.data.cacheKey;
      return;
    }

    let reload = false;
    let visible = [];

    if (props.search !== prevSearchRef.current) {
      // invalidate the tree cache
      reload = true;
      visible = props.visible;
    }

    if (props.data.urlTree !== prevUrlTreeRef.current) {
      // invalidate the tree cache, as url has changed
      reload = true;
    }

    if (props.data.cacheKey !== prevCacheKeyRef.current) {
      // invalidate the tree cache, as paths have changed
      reload = true;
    }

    prevSearchRef.current = props.search;
    prevUrlTreeRef.current = props.data.urlTree;
    prevCacheKeyRef.current = props.data.cacheKey;

    if (reload) {
      loadTree(visible, props.search, props);
    }
  }, [props.search, props.data.urlTree, props.data.cacheKey]);

  /**
   * Gets array of options to pass to the react-dropdown component
   *
   * @return {Array}
   */
  const getDropdownOptions = () => {
    const value = props.value;
    const node = getVisibleTree();
    let options = node ? [...node.children] : [];

    const selectedOptions = props.selectedValues
      .filter(selected => (
        selected.id === value ||
        (Array.isArray(value) && value.find(item => item === selected.id))
      ));

    if (!opened && props.data.showSelectedPath) {
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
      id: props.data.multiple ? '' : SINGLE_EMPTY_VALUE,
      title: (props.data.hasEmptyDefault) ? props.data.emptyString : null,
      disabled: !options.length || !props.data.hasEmptyDefault,
    });

    return options;
  };

  const getPath = (id) => {
    const treePath = props.findTreePath(props.tree, id, props.data.treeBaseId);
    const breadcrumbs = getBreadcrumbs(treePath);

    return breadcrumbs
      .reduce((prev, path) => `${prev}${path.contextString || ''}${path.title}/`, '');
  };

  const handleOpen = () => {
    setOpened(true);

    handleSearchReset();
  };

  const handleClose = () => {
    setOpened(false);
  };

  /**
   * Sets the search value, handles throttling/debouncing so that API calls is not
   * fired after every keypress
   *
   * @param {String} value
   */
  const handleSearchChange = (value) => {
    clearTimeout(searchTimer.current);
    // delay setting a search value, so ajax requests do not hammer the server
    searchTimer.current = setTimeout(() => {
      propsRef.current.actions.treeDropdownField.setSearch(propsRef.current.id, value);
    }, SEARCH_DELAY);
  };

  /**
   * Handles changes to the text field's value.
   *
   * @param {Object|Array} value - New value / option
   */
  const handleChange = (value) => {
    let mappedValue = null;

    handleSearchReset();
    if (propsRef.current.data.multiple) {
      mappedValue = MULTI_EMPTY_VALUE;

      if (value && value.length) {
        const uniqueValues = value && value
          .filter((item, index) => value.findIndex(next => next.id === item.id) === index);
        mappedValue = uniqueValues.map(item => item.id);

        propsRef.current.actions.treeDropdownField.addSelectedValues(
          propsRef.current.id, uniqueValues
        );
      }
    } else {
      // Get node ID from object
      const id = value ? value.id : null;
      const tree = getVisibleTree() || propsRef.current.tree;
      let object = tree.children.find(item => item.id === id);
      if (object) {
        if (propsRef.current.data.showSelectedPath) {
          object = {
            ...object,
            titlePath: getPath(id),
          };
        }
        propsRef.current.actions.treeDropdownField.addSelectedValues(
          propsRef.current.id, [object]
        );
      }

      mappedValue = id || SINGLE_EMPTY_VALUE;
    }

    if (typeof propsRef.current.onChange === 'function') {
      propsRef.current.onChange(mappedValue);
    }
  };

  /**
   * Handles navigating to a sub-tree
   *
   * @param {Event} event - Click event
   * @param {*} id - Id to add to end of path
   */
  const handleNavigate = (event, id) => {
    if (hasSearch()) {
      return;
    }

    event.stopPropagation();
    event.nativeEvent.stopImmediatePropagation();
    event.preventDefault();

    // Find parent path
    let path = propsRef.current.findTreePath(
      propsRef.current.tree, id, propsRef.current.data.treeBaseId
    );
    if (!path) {
      // Edge case: Path hasn't been loaded yet,
      // so append to current path
      path = propsRef.current.visible.slice(0);
      path.push(id);
    }

    // Lazy-load children and update visibility
    lazyLoad(path);
    propsRef.current.actions.treeDropdownField.setVisible(propsRef.current.id, path);
  };

  /**
   * Go up one level
   *
   * @param {Event} event - Click event
   */
  const handleBack = (event) => {
    if (hasSearch()) {
      return;
    }

    event.stopPropagation();
    event.preventDefault();

    // Find id in existing path, otherwise adding it to the end
    let path = propsRef.current.visible;

    if (path.length) {
      path = path.slice(0, path.length - 1);
    }

    // Lazy-load children and update visibility
    lazyLoad(path);
    propsRef.current.actions.treeDropdownField.setVisible(propsRef.current.id, path);
  };

  /**
   * Extra keyboard accessibility.
   * Falls back on handling provided by react-select
   *
   * @param {Event} event
   */
  const handleKeyDown = (event) => {
    // ignore handling keys if searching
    if (hasSearch()) {
      // if escape is pressed, clear the search term
      if (event.key === 'Escape') {
        handleSearchReset(event);
      }
      // let react-select handle it
      return;
    }

    // Only handle keys when an item is focused
    const focused = selectField.current && selectField.current.state.focusedOption;
    if (!focused) {
      // let react-select handle it
      return;
    }

    switch (event.key) {
      case 'ArrowLeft': // left, go back
        handleBack(event);
        break;
      case 'ArrowRight': // right, drill deeper
        if (focused.count) {
          handleNavigate(event, focused.id);
        }
        break;
      default:
        // let react-select handle it
        break;
    }
  };

  /**
   * Render the input field.
   * This essentially just sets the specific ID we want to use into the default input component.
   */
  const renderInput = ({ children, ...inputProps }) => {
    inputProps.id = props.id;
    return <selectComponents.Input {...inputProps}>{children}</selectComponents.Input>;
  };

  /**
   * Render the breadcrumbs.
   * This sits above the options in nested trees, as a way to navigate back
   */
  const renderBreadcrumbs = (breadcrumbs, { cx, getStyles, getClassNames, ...menuProps }) => {
    if (breadcrumbs.length === 0) {
      return null;
    }

    // Join titles with ' / '
    breadcrumbs = breadcrumbs.map((item) => item.title).join(' / ');
    const icon = (hasSearch()) ? 'font-icon-search' : 'font-icon-left-open-big';

    // This allows us to get the correct css and class names that a normal react-select option uses.
    const className = cx(
      {
        option: true,
        breadcrumbs: true,
      },
      getClassNames('option', {})
    );
    const StyledDiv = styled.div(getStyles('option', menuProps));

    return (
      <StyledDiv
        className={className}
        onClick={handleBack}
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
  };

  /**
   * Render menulist.
   * Replaces the default MenuList component
   *
   * @param {Object} renderMenuOptions - Options passed from Select.js
   */
  const renderMenuList = ({ children, ...menuProps }) => {
    const breadcrumbs = getBreadcrumbs();

    return (
      <selectComponents.MenuList {...menuProps}>
        {renderBreadcrumbs(breadcrumbs, menuProps)}
        {children}
      </selectComponents.MenuList>
    );
  };

  /**
   * Renders an option in a menu level.
   * Replaces the default Option component
   */
  const renderOption = ({ children, ...optionProps }) => {
    let button = null;
    const tree = optionProps.data;

    // button for dropping into nested trees
    if (tree.count && !hasSearch()) {
      const handleNavigateOption = (event) => handleNavigate(event, tree.id);
      button = (
        <button
          type="button"
          className="treedropdownfield__option-button fill-width"
          onClick={handleNavigateOption}
          onKeyDown={(event) => handleKeyDown(event)}
          onTouchStart={handleNavigateOption}
        >
          <span className="treedropdownfield__option-count-icon font-icon-right-open-big" aria-hidden="true" />
        </button>
      );
    }

    // search breadcrumbs for each nested search result
    let subtitle = null;
    if (hasSearch()) {
      subtitle = tree.contextString;

      if (!subtitle && props.data.hasEmptyDefault && !props.visible.length) {
        subtitle = props.data.emptyString;
      }
    }

    return (
      <selectComponents.Option {...optionProps}>
        <span className="treedropdownfield__option-title-box flexbox-area-grow fill-height">
          <span className="treedropdownfield__option-title">{children}</span>
          { subtitle && <span className="treedropdownfield__option-context">{subtitle}</span> }
        </span>
        {button}
      </selectComponents.Option>
    );
  };

  /**
   * Fallback to a textbox for readonly and disabled status react-select isn't ideal for display
   *
   * @return {React}
   */
  const renderReadOnly = () => {
    const inputProps = {
      id: props.id,
      readOnly: props.readOnly,
      disabled: props.disabled,
    };
    const className = props.extraClass
      ? `treedropdownfield ${props.extraClass}`
      : 'treedropdownfield';
    let title = (props.data.hasEmptyDefault) ? props.data.emptyString : '';
    const selected = props.selectedValues;

    if (props.data.multiple) {
      const values = props.value
        .map((value) => (
          // assumes all selected values had been populated into `props.selectedValues`
          selected.find((item) => item.id === value) ||
          value
        ));

      title = values.map(value => value.title).join(', ');
    } else {
      const value = selected.find((item) => item.id === props.value);
      title = props.value;

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
          name={props.name}
          value={props.value}
          {...inputProps}
        />
      </div>
    );
  };

  const formatOptionLabel = (option) => {
    const { title } = option;

    return props.search.length
      ? mapHighlight(title || '', props.search, Highlight)
      : title;
  };

  const noOptionsMessage = ({ inputValue }) => {
    const visibleTree = getVisibleTree() || {};

    // Only show failed message for the currently visible tree or root
    if (props.failed.indexOf(visibleTree.id || 0) >= 0) {
      return i18n._t('Admin.TREEDROPDOWN_FAILED', 'Failed to load');
    }
    // If there was a search or this is the root level, say "no options"
    if (inputValue || !visibleTree.id) {
      return i18n._t('Admin.TREEDROPDOWN_NO_OPTIONS', 'No options');
    }
    // If this is inside a tree and there was no search, say "no children"
    return i18n._t('Admin.TREEDROPDOWN_NO_CHILDREN', 'No children');
  };

  /**
   * A filter for the list of options to determine what is shown and what isn't
   */
  const filterOption = (option, input = '') => {
    const parent = getVisibleTree();
    if ((option.value === SINGLE_EMPTY_VALUE || option.value === '') &&
      (!props.data.hasEmptyDefault || props.visible.length || hasSearch())
    ) {
      return false;
    }
    const title = option.label && option.label.toLocaleLowerCase();
    // using props.search so that we do not get flash of filtered current content
    // const search = props.search.toLocaleLowerCase();
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
  };

  if (props.readOnly || props.disabled) {
    return renderReadOnly();
  }

  const className = props.extraClass
    ? `treedropdownfield ${props.extraClass}`
    : 'treedropdownfield';
  const options = getDropdownOptions();

  // The value passed in is an array of all selected option objects
  // i.e. an id and title key must be present for each selected option
  const rawValue = Array.isArray(props.value) ? props.value : [props.value];
  let value = props.selectedValues.filter(item => rawValue.includes(item.id));

  // If there weren't any "selected" values (e.g. setting the value programatically)
  // make sure the value is valid
  if (!value.length) {
    value = options.filter(item => rawValue.includes(item.id));
  }

  // Fall back to the empty default value if there is one
  if (!value.length && props.data.hasEmptyDefault) {
    value = options[0];
  }

  const showSearch = (typeof props.data.showSearch !== 'undefined')
    ? props.data.showSearch
    : false;

  const components = {
    Input: renderInput,
    MenuList: renderMenuList,
    Option: renderOption,
  };

  const visibleTree = getVisibleTree() || {};
  // Only show loading message for the currently visible tree or root
  const isLoading = props.loading.indexOf(visibleTree.id || 0) >= 0;

  return (
    <EmotionCssCacheProvider>
      <Select
        isSearchable={showSearch}
        isMulti={props.data.multiple}
        isClearable
        className={className}
        name={props.name}
        options={options}
        delimiter=","
        components={components}
        formatOptionLabel={formatOptionLabel}
        filterOption={filterOption}
        onChange={handleChange}
        onMenuOpen={handleOpen}
        onMenuClose={handleClose}
        onKeyDown={handleKeyDown}
        onInputChange={handleSearchChange}
        isLoading={isLoading}
        loadingMessage={() => i18n._t('Admin.TREEDROPDOWN_LOADING', 'Loading...')}
        noOptionsMessage={noOptionsMessage}
        value={value}
        ref={(select) => { selectField.current = select; }}
        placeholder={props.data.emptyString}
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
};

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
