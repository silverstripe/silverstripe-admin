/* global document window */
import i18n from 'i18n';
import React, { useState, useRef, useEffect } from 'react';
import { Label } from 'reactstrap';
import classNames from 'classnames';
import Button from 'components/Button/Button';
import CompactTagList from 'components/Tag/CompactTagList';
import ResizeAware from 'components/ResizeAware/ResizeAware';
import PropTypes from 'prop-types';
import TagPropType from '../Tag/TagPropType';

const defaultBorders = {
  top: false,
  right: false,
  bottom: true,
  left: true,
};

/**
 * Displays a search box and a few buttons related buttons.
 */
const SearchBox = ({
  onSearch,
  onToggleFilter,
  onHideFilter,
  onChange,
  onHide,
  onTagDelete,
  onTagClick,
  placeholder = i18n._t('Admin.SEARCH', 'Search'),
  expanded,
  formId,
  id,
  searchText,
  hideable,
  showFilters,
  name,
  dirty,
  clearable,
  tagData = [],
  borders = defaultBorders,
  children
}) => {
  const [hasFocus, setHasFocus] = useState(false);
  const [width, setWidthState] = useState(window.innerWidth - 180 - 55);
  const [tagWidth, setTagWidth] = useState(0);
  const nodeRef = useRef(null);
  const isFirstRender = useRef(true);

  /**
   * Measure the width of the component.
   * @returns number
   */
  const getComponentWidth = () => {
    if (!nodeRef.current) {
      return 0;
    }
    return nodeRef.current.getBoundingClientRect().width;
  };

  const setWidth = (newWidth) => {
    setWidthState(newWidth);
  };

  /**
   * Detect resizing of the component.
   * If it's bigger, the summary view is triggered.
   * @param tagListDimension
   */
  const onResize = (dimension) => {
    setWidth(dimension.width);
  };

  const onTagListResize = (dimensions) => {
    setTagWidth(dimensions.width);
  };

  /**
   * Calculate our input's left padding base on the width of our tag list.
   * @returns {number}
   */
  const calculateInputLeftPadding = () => {
    // Account for if the search icon is hidden in compact mode
    const existingPadding = width > 576 ? 55 : 20;
    return tagWidth + existingPadding;
  };

  /**
   * Right padding is used to set the alignedment of the "x" that shows in chrome
   * when you type in the search box
   */
  const calculateInputRightPadding = () => (width < 576 ? 121 : 264);

  /**
   * Calculate the max-width available for tags.
   */
  const calculateSpaceForTags = () => {
    let calculatedWidth = width;

    // Keep a minimal amount of space for the input field.
    calculatedWidth -= 150;

    // Remove the icon space and the enter/clear box
    calculatedWidth = calculatedWidth - 55 - 52;

    // Remove space for the Hide button
    if (hideable) {
      calculatedWidth -= 52;
    }

    // Remove space for the filter button
    if (showFilters) {
      calculatedWidth -= 52;
    }

    // Don't return negative values
    calculatedWidth = Math.max(calculatedWidth, 0);

    return calculatedWidth;
  };

  const focusOnLastTag = () => {
    if (!nodeRef.current) {
      return;
    }
    const lastTag = nodeRef.current.querySelector('.compact-tag-list__visible .tag:last-child');
    if (lastTag) {
      lastTag.focus();
    }
  };

  /**
   * Handle enter key submission in search box
   *
   * @param {Object} event
   */
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      // Trigger search when the user hits the enter key
      event.preventDefault();
      onSearch();
    } else if (
      event.target.selectionStart === 0
      && (event.key === 'ArrowLeft'
      || (event.key === 'Backspace'
      && event.target.selectionEnd - event.target.selectionStart === 0))
    ) {
      // Set focus on last tag when the user hits a back key at the start of the search box
      // and only if they don't have text selected to delete
      event.preventDefault();
      focusOnLastTag();
    }
  };

  /**
   * Set the focus attribute on the internal state.
   */
  const handleFocus = () => {
    if (!hasFocus) {
      setHasFocus(true);
    }
    if (onHideFilter) {
      onHideFilter();
    }
  };

  /**
   * Unset the focus attribute on the internal state.
   */
  const handleBlur = () => {
    if (hasFocus) {
      setHasFocus(false);
    }
  };

  const focusOnInput = () => {
    if (!nodeRef.current) {
      return;
    }
    const input = nodeRef.current.querySelector('input');
    if (input) {
      input.focus();
    }
  };

  /**
   * Render the input for the search box.
   */
  const renderInput = () => {
    const style = {
      paddingLeft: `${calculateInputLeftPadding()}px`,
      paddingRight: `${calculateInputRightPadding()}px`
    };
    const mergedBorders = Object.assign({}, defaultBorders, borders);
    const classe = 'search-box__content-field';
    const classeNames = classNames(
      'form-control', classe,
      {
        [`${classe}--top-border`]: mergedBorders.top,
        [`${classe}--right-border`]: mergedBorders.right,
        [`${classe}--bottom-border`]: mergedBorders.bottom,
        [`${classe}--left-border`]: mergedBorders.left,
      }
    );

    return (
      <input
        aria-labelledby={`${id}_label`}
        type="search"
        name={name}
        placeholder={placeholder}
        className={classeNames}
        onKeyDown={handleKeyDown}
        onChange={onChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        value={searchText}
        id={id}
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus
        style={style}
      />
    );
  };

  const renderTags = () => (
    <div className="search-box__tags">
      <ResizeAware onResize={onTagListResize}>
        <CompactTagList
          onTagDelete={onTagDelete}
          onTagClick={onTagClick}
          onHolderFocus={focusOnInput}
          tags={tagData}
          onSummary={onToggleFilter}
          maxSize={calculateSpaceForTags()}
          deletable
        />
      </ResizeAware>
    </div>
  );

  /**
   * Render the `[enter ↵]` hint.
   */
  const renderEnterHint = () => (
    <div
      role="presentation"
      className="search-box__enter"
      onClick={e => { e.stopPropagation(); e.preventDefault(); onSearch(); }}
    >
      {i18n._t('Admin.ENTER', 'Enter')}&nbsp;↵
    </div>
  );

  /**
   * Render the advanced filter button.
   */
  const renderFilterButton = () => {
    const classes = classNames(
      'btn--icon',
      'search-box__filter-trigger',
      width < 576 ? 'search-box--no-label' : '',
      { collapsed: !expanded }
    );
    const spanClass = width < 576 ? 'visually-hidden' : '';
    return (<Button
      aria-expanded={expanded}
      aria-controls={formId}
      aria-label={i18n._t('Admin.ADVANCED', 'Advanced')}
      onClick={onToggleFilter}
      className={classes}
      title={i18n._t('Admin.ADVANCED', 'Advanced')}
      icon="caret-down-two"
    >
      <span className={spanClass}>{i18n._t('Admin.SEARCH_OPTIONS', 'Search options')}</span>
    </Button>);
  };

  /**
   * Render the hide button.
   */
  const renderHideButton = () => (<Button
    onClick={onHide}
    title={i18n._t('Admin.CLOSE_SEARCH', 'Close search')}
    aria-label={i18n._t('Admin.CLOSE_SEARCH', 'Close search')}
    className="btn--no-text btn--icon-lg search-box__cancel"
    icon="cancel"
    aria-controls={id}
    aria-expanded="true"
  />);

  useEffect(() => {
    // Do not run on first render to match previous behaviour from class component
    // Note: This hook has no dependencies so will behave like componentDidUpdate() used to
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const componentWidth = getComponentWidth();
    setWidth(componentWidth);
  });

  const searchClasses = classNames('search-box', {
    'search-box--hideable': hideable,
    'search-box--not-hideable': !hideable,
    'search-box--has-focus': hasFocus,
    'search-box--has-not-focus': !hasFocus,
    'search-box--has-filters': showFilters,
    'search-box--has-not-filters': !showFilters,
    'search-box--compact': width < 576, // 'sm' breakpoint
    'search-box--expanded': expanded
  });

  const showEnter = (dirty || !clearable) && hasFocus;

  return (
    <div className={searchClasses} ref={nodeRef}>
      <ResizeAware onResize={onResize}>
        <div className="search-box__group">
          <Label for={id} id={`${id}_label`} hidden>
            {i18n._t('Admin.SEARCH', 'Search')}
          </Label>
          <div className="icon font-icon-search" aria-hidden="true" />
          { renderTags() }
          { renderInput() }
          { showEnter && renderEnterHint() }
          { showFilters && renderFilterButton() }
          { children }
          { hideable && renderHideButton() }
        </div>
      </ResizeAware>
    </div>
  );
};

SearchBox.propTypes = {
  onSearch: PropTypes.func,
  onToggleFilter: PropTypes.func,
  onHideFilter: PropTypes.func,
  onChange: PropTypes.func,
  onHide: PropTypes.func,
  onTagDelete: PropTypes.func,
  onTagClick: PropTypes.func,
  placeholder: PropTypes.string,
  expanded: PropTypes.bool,
  formId: PropTypes.string,
  id: PropTypes.string,
  searchText: PropTypes.string,
  hideable: PropTypes.bool,
  showFilters: PropTypes.bool,
  name: PropTypes.string,
  dirty: PropTypes.bool,
  clearable: PropTypes.bool,
  tagData: PropTypes.arrayOf(TagPropType)
};

export { SearchBox as Component };

export default SearchBox;
