/* global document window */
import i18n from 'i18n';
import React, { Component } from 'react';
import { Label } from 'reactstrap';
import classNames from 'classnames';
import Button from 'components/Button/Button';
import CompactTagList from 'components/Tag/CompactTagList';
import ResizeAware from 'components/ResizeAware/ResizeAware';
import PropTypes from 'prop-types';
import TagPropType from '../Tag/TagPropType';

/**
 * Displays a search box and a few buttons related buttons.
 */
class SearchBox extends Component {
  constructor(props) {
    super(props);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.renderInput = this.renderInput.bind(this);
    this.renderFilterButton = this.renderFilterButton.bind(this);
    this.renderEnterHint = this.renderEnterHint.bind(this);
    this.renderHideButton = this.renderHideButton.bind(this);
    this.componentDidUpdate = this.componentDidUpdate.bind(this);
    this.onResize = this.onResize.bind(this);
    this.setWidth = this.setWidth.bind(this);
    this.renderTags = this.renderTags.bind(this);
    this.getComponentWidth = this.getComponentWidth.bind(this);
    this.calculateSpaceForTags = this.calculateSpaceForTags.bind(this);
    this.calculateInputLeftPadding = this.calculateInputLeftPadding.bind(this);
    this.calculateInputRightPadding = this.calculateInputRightPadding.bind(this);
    this.onTagListResize = this.onTagListResize.bind(this);
    this.focusOnLastTag = this.focusOnLastTag.bind(this);
    this.focusOnInput = this.focusOnInput.bind(this);

    this.state = {
      hasFocus: false,
      width: window.innerWidth - 180 - 55,
      tagWidth: 0
    };
  }

  componentDidUpdate() {
    const width = this.getComponentWidth();
    this.setWidth(width);
  }

  /**
   * Detect resizing of the component.
   * If it's bigger, the summary view is triggered.
   * @param tagListDimension
   */
  onResize(dimension) {
    this.setWidth(dimension.width);
  }

  onTagListResize(dimensions) {
    const tagWidth = dimensions.width;
    if (this.state.tagWidth !== tagWidth) {
      this.setState({ tagWidth });
    }
  }

  setWidth(width) {
    if (this.state.width !== width) {
      this.setState({ width });
    }
  }

  /**
   * Measure the width of the component.
   * @returns number
   */
  getComponentWidth() {
    const node = this.nodeRef;
    if (!node) {
      return 0;
    }

    return node.getBoundingClientRect().width;
  }

  /**
   * Calculate our input's left padding base on the width of our tag list.
   * @returns {number}
   */
  calculateInputLeftPadding() {
    // Account for if the search icon is hidden in compact mode
    const existingPadding = this.state.width > 576 ? 55 : 20;
    return this.state.tagWidth + existingPadding;
  }

  calculateInputRightPadding() {
    // Right padding is used to set the alignedment of the "x" that shows in chrome
    // when you type in the search box
    return this.state.width < 576 ? 121 : 264;
  }

  /**
   * Calculate the max-width available for tags.
   */
  calculateSpaceForTags() {
    let width = this.state.width;

    // Keep a minimal amount of space for the input field.
    width -= 150;

    // Remove the icon space and the enter/clear box
    width = width - 55 - 52;

    const { hideable, showFilters } = this.props;

    // Remove space for the Hide button
    if (hideable) {
      width -= 52;
    }

    // Remove space for the filter button
    if (showFilters) {
      width -= 52;
    }

    // Don't return negative values
    width = Math.max(width, 0);

    return width;
  }

  /**
   * Handle enter key submission in search box
   *
   * @param {Object} event
   */
  handleKeyDown(event) {
    if (event.key === 'Enter') {
      // Trigger search when the user hits the enter key
      event.preventDefault();
      this.props.onSearch();
    } else if (
      event.target.selectionStart === 0
      && (event.key === 'ArrowLeft'
      || (event.key === 'Backspace'
      && event.target.selectionEnd - event.target.selectionStart === 0))
    ) {
      // Set focus on last tag when the user hits a back key at the start of the search box
      // and only if they don't have text selected to delete
      event.preventDefault();
      this.focusOnLastTag();
    }
  }

  /**
   * Set the focus attribute on the internal state.
   */
  handleFocus() {
    if (!this.state.hasFocus) {
      this.setState({ hasFocus: true });
    }
    if (this.props.onHideFilter) {
      this.props.onHideFilter();
    }
  }

  /**
   * Unset the focus attribute on the internal state.
   */
  handleBlur() {
    if (this.state.hasFocus) {
      this.setState({ hasFocus: false });
    }
  }

  focusOnLastTag() {
    const node = this.nodeRef;
    if (!node) {
      return;
    }
    const lastTag = node.querySelector('.compact-tag-list__visible .tag:last-child');
    if (lastTag) {
      lastTag.focus();
    }
  }

  focusOnInput() {
    const node = this.nodeRef;
    if (!node) {
      return;
    }
    const input = node.querySelector('input');
    if (input) {
      input.focus();
    }
  }

  /**
   * Render the input for the search box.
   */
  renderInput() {
    const { id, searchText, onChange, placeholder, name, borders } = this.props;
    const style = {
      paddingLeft: `${this.calculateInputLeftPadding()}px`,
      paddingRight: `${this.calculateInputRightPadding()}px`
    };

    const mergedBorders = Object.assign({}, SearchBox.defaultProps.borders, borders);
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
        onKeyDown={this.handleKeyDown}
        onChange={onChange}
        onFocus={this.handleFocus}
        onBlur={this.handleBlur}
        value={searchText}
        id={id}
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus
        style={style}
      />
    );
  }

  renderTags() {
    const { tagData, onTagDelete, onTagClick, onToggleFilter } = this.props;
    return (
      <div className="search-box__tags">
        <ResizeAware onResize={this.onTagListResize}>
          <CompactTagList
            onTagDelete={onTagDelete}
            onTagClick={onTagClick}
            onHolderFocus={this.focusOnInput}
            tags={tagData}
            onSummary={onToggleFilter}
            maxSize={this.calculateSpaceForTags()}
            deletable
          />
        </ResizeAware>
      </div>
    );
  }

  /**
   * Render the `[enter ↵]` hint.
   */
  renderEnterHint() {
    return (
      <div
        role="presentation"
        className="search-box__enter"
        onClick={e => { e.stopPropagation(); e.preventDefault(); this.props.onSearch(); }}
      >
        {i18n._t('Admin.ENTER', 'Enter')}&nbsp;↵
      </div>
    );
  }

  /**
   * Render the advanced filter button.
   */
  renderFilterButton() {
    const { expanded, onToggleFilter, formId } = this.props;
    const classes = classNames(
      'btn--icon',
      'search-box__filter-trigger',
      this.state.width < 576 ? 'search-box--no-label' : '',
      { collapsed: !expanded }
    );
    const spanClass = this.state.width < 576 ? 'visually-hidden' : '';
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
  }

  /**
   * Render the hide button.
   */
  renderHideButton() {
    const { id, onHide } = this.props;
    return (<Button
      onClick={onHide}
      title={i18n._t('Admin.CLOSE', 'Close')}
      aria-label={i18n._t('Admin.CLOSE', 'Close')}
      className="btn--no-text btn--icon-lg search-box__cancel"
      icon="cancel"
      aria-controls={id}
      aria-expanded="true"
    />);
  }

  render() {
    const { children, id, hideable, expanded, showFilters, dirty, clearable } = this.props;

    const searchClasses = classNames('search-box', {
      'search-box--hideable': hideable,
      'search-box--not-hideable': !hideable,
      'search-box--has-focus': this.state.hasFocus,
      'search-box--has-not-focus': !this.state.hasFocus,
      'search-box--has-filters': showFilters,
      'search-box--has-not-filters': !showFilters,
      'search-box--compact': this.state.width < 576, // 'sm' breakpoint
      'search-box--expanded': expanded
    });

    const showEnter = (dirty || !clearable) && this.state.hasFocus;

    return (
      <div className={searchClasses} ref={node => { this.nodeRef = node; }}>
        <ResizeAware onResize={this.onResize}>
          <div className="search-box__group">
            <Label for={id} id={`${id}_label`} hidden>
              {i18n._t('Admin.SEARCH', 'Search')}
            </Label>
            { this.renderTags() }
            { this.renderInput() }
            { showEnter && this.renderEnterHint() }
            { children }
            <div className="icon font-icon-search" aria-hidden="true" />
            { showFilters && this.renderFilterButton() }
            { hideable && this.renderHideButton() }
          </div>
        </ResizeAware>
      </div>
    );
  }
}

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

SearchBox.defaultProps = {
  placeholder: i18n._t('Admin.SEARCH', 'Search'),
  tagData: [],
  filters: {},
  formData: {},
  term: '',
  borders: {
    top: false,
    right: false,
    bottom: true,
    left: true,
  }
};

export { SearchBox as Component };

export default SearchBox;
