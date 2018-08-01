/* global document */
import i18n from 'i18n';
import React, { PropTypes, Component } from 'react';
import { Label, Button } from 'reactstrap';
import classNames from 'classnames';

/**
 * Displays a search box and a few buttons related buttons.
 */
class SearchBox extends Component {
  constructor(props) {
    super(props);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.renderInput = this.renderInput.bind(this);
    this.renderFilterButton = this.renderFilterButton.bind(this);
    this.renderClearButton = this.renderClearButton.bind(this);
    this.renderEnterHint = this.renderEnterHint.bind(this);
    this.renderHideButton = this.renderHideButton.bind(this);
    this.state = { hasFocus: false };
  }

  /**
   * Handle enter key submission in search box
   *
   * @param {Object} event
   */
  handleKeyUp(event) {
    if (event.keyCode === 13) {
      this.props.onSearch();
    }
  }

  /**
   * Set the focus attribute on the internal state.
   */
  handleFocus() {
    if (!this.state.hasFocus) {
      this.setState({ hasFocus: true });
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

  /**
   * Render the input for the search box.
   */
  renderInput() {
    const { id, searchText, onChange, placeholder, name } = this.props;
    return (
      <input
        aria-labelledby={`${id}_label`}
        type="text"
        name={name}
        placeholder={placeholder}
        className="form-control search-box__content-field"
        onKeyUp={this.handleKeyUp}
        onChange={onChange}
        onFocus={this.handleFocus}
        onBlur={this.handleBlur}
        value={searchText}
        id={id}
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus
      />
    );
  }

  /**
   * Render the `[enter ↵]` hint.
   */
  renderEnterHint() {
    return (
      <div className="search-box__enter">
        {i18n._t('Admin.ENTER', 'Enter')}&nbsp;↵
      </div>
    );
  }

  /**
   * Render the Clear button.
   */
  renderClearButton() {
    const { formId, onClear } = this.props;
    return (
      <Button
        aria-controls={formId}
        onClick={onClear}
        className="search-box__clear"
        title={i18n._t('Admin.CLEAR', 'Clear')}
      >{i18n._t('Admin.CLEAR', 'Clear')}</Button>
    );
  }

  /**
   * Render the advanced filter button.
   */
  renderFilterButton() {
    const { expanded, onToggleFilter, formId } = this.props;
    const classes = classNames(
        'btn--icon-md',
        'btn--no-text',
        'font-icon-caret-down-two',
        'search-box__filter-trigger',
        { collapsed: !expanded }
    );
    return (<Button
      aria-expanded={expanded}
      aria-controls={formId}
      aria-label={i18n._t('Admin.ADVANCED', 'Advanced')}
      onClick={onToggleFilter}
      className={classes}
      title={i18n._t('Admin.ADVANCED', 'Advanced')}
    />);
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
      className="font-icon-cancel btn--no-text btn--icon-lg search-box__cancel"
      aria-controls={id}
      aria-expanded="true"
    />);
  }

  render() {
    const { children, id, hideable, expanded, showFilters, dirty, clearable } = this.props;

    const searchClasses = classNames('search-box', {
      'search-box__hideable': hideable,
      'search-box__not-hideable': !hideable,
      'search-box__has-focus': this.state.hasFocus,
      'search-box__has-not-focus': !this.state.hasFocus,
      'search-box__has-filters': showFilters,
      'search-box__has-not-filters': !showFilters,
      'search-box__expanded': expanded
    });

    const showEnter = (dirty || !clearable) && this.state.hasFocus;
    const showClear = !showEnter && clearable;

    return (
      <div className={searchClasses}>
        <div className="search-box__group">
          <Label for={id} id={`${id}_label`} hidden>
            {i18n._t('Admin.SEARCH', 'Search')}
          </Label>
          { this.renderInput() }
          { showEnter && this.renderEnterHint() }
          { showClear && this.renderClearButton() }
          { children }
          <div className="icon font-icon-search" />
          { showFilters && this.renderFilterButton() }
          { hideable && this.renderHideButton() }
        </div>
      </div>
    );
  }
}


SearchBox.propTypes = {
  onSearch: PropTypes.func,
  onToggleFilter: PropTypes.func,
  onChange: PropTypes.func,
  onHide: PropTypes.func,

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
};

SearchBox.defaultProps = {
  placeholder: i18n._t('Admin.SEARCH', 'Search'),

  filters: {},
  formData: {},
  term: '',
};


export { SearchBox as Component };

export default SearchBox;
