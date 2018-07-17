/* global document */
import i18n from 'i18n';
import React, { PropTypes, Component } from 'react';
import { Label } from 'reactstrap';

/**
 * Displays a search form
 */
class SearchBox extends Component {
  constructor(props) {
    super(props);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
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

  handleFocus() {
    this.setState({ hasFocus: true });
  }

  handleBlur() {
    this.setState({ hasFocus: false });
  }


  render() {
    const { id, searchText, hideable, onChange, expanded } = this.props;

    // Build classes
    const searchClasses = ['search', 'search--active'];
    const advancedButtonClasses = [
      'btn', 'btn-secondary', 'btn--icon-md', 'btn--no-text',
      'font-icon-caret-down-two', 'search__filter-trigger',
    ];
    if (!expanded) {
      advancedButtonClasses.push('collapsed');
    }

    // Decide if we display the X button
    searchClasses.push(hideable ? 'search__hideable' : 'search__not-hideable');
    searchClasses.push(this.state.hasFocus ? 'search__has-focus' : 'search__has-not-focus');


    return (
      <div className={searchClasses.join(' ')}>
        <div id={this.props.id} className="search__group">
          <Label for={this.props.id} id={`${id}_label`} hidden>{i18n._t('AssetAdmin.SEARCH', 'Search')}</Label>
          <input
            aria-labelledby={`${id}_label`}
            type="text"
            name="name"
            placeholder={this.props.placeholder}
            className="form-control search__content-field "
            onKeyUp={this.handleKeyUp}
            onChange={onChange}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
            value={searchText}
            id={this.props.id}
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
          />
          <div className="icon font-icon-search" />
          { (this.props.showFilters) && <button
            aria-expanded={expanded}
            aria-controls={this.props.formId}
            aria-label={i18n._t('Admin.ADVANCED', 'Advanced')}
            onClick={this.props.onToggleFilter}
            className={advancedButtonClasses.join(' ')}
            title={i18n._t('Admin.ADVANCED', 'Advanced')}
          />}
          { hideable && <button
            onClick={this.props.onHide}
            title={i18n._t('Admin.CLOSE', 'Close')}
            className="btn font-icon-cancel btn--no-text btn--icon-lg search__cancel"
            aria-controls={this.props.id}
            aria-expanded="true"
          /> }
          <div className="search__enter">{i18n._t('Admin.ENTER', 'Enter')} ↵</div>
          {this.props.children}
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
};

SearchBox.defaultProps = {
  placeholder: i18n._t('Admin.SEARCH', 'Search'),

  filters: {},
  formData: {},
  term: '',
};


export { SearchBox as Component };

export default SearchBox;
