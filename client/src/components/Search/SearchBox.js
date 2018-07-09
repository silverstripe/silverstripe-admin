/* global document */
import i18n from 'i18n';
import React, { PropTypes, Component } from 'react';
import classnames from 'classnames';
import { Label } from 'reactstrap';

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
class SearchBox extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      searchText: (props.filters && props.filters.name) || '',
    };
  }

  handleChange(event) {
    console.dir(event);
    this.setState({ searchText: event.target.value });
  }

  componentWillMount() {

  }

  componentWillReceiveProps(props) {

  }

  componentWillUnmount() {

  }

  /**
   * Handle enter key submission in search box
   *
   * @param {Object} event
   */
  handleKeyUp(event) {
    if (event.keyCode === 13) {
      this.doSearch();
    }
  }

  searchClasses() {

  }

  render() {
    const {id, searchText, hideable, onChange, expanded} = this.props;

    // Build classes
    const searchClasses = ['search'];
    const advancedButtonClasses = [
      'btn', 'btn-secondary', 'btn--icon-md', 'btn--no-text',
      'font-icon-caret-down-two', 'search__filter-trigger',
    ];
    if (!expanded) {
      advancedButtonClasses.push('collapsed');
    }

    searchClasses.push('search--active');

    // Decide if we display the X button
    searchClasses.push(hideable ? 'search__hideable' : 'search__not-hideable');


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
              value={searchText}
              autoFocus
              id={this.props.id}
            />
            <div className="icon font-icon-search"/>
            { (this.props.forceFilters || this.props.formSchemaUrl) && <button
              aria-expanded={expanded}
              aria-controls={this.props.formId}
              aria-label= {i18n._t('Admin.ADVANCED', 'Advanced')}
              onClick={this.toggle}
              className={advancedButtonClasses.join(' ')}
              title={i18n._t('Admin.ADVANCED', 'Advanced')}
            ></button>}
            { hideable && <button
              onClick={this.hide}
              title={i18n._t('Admin.CLOSE', 'Close')}
              className="btn font-icon-cancel btn--no-text btn--icon-lg search__cancel"
              aria-controls={this.props.id}
              aria-expanded="true"
            /> }
            {this.props.children}
          </div>
        </div>
    );
  }
}



SearchBox.propTypes = {
  onSearch: PropTypes.func,
  onClear: PropTypes.func,
  onShowFilters: PropTypes.func,
  onHideFilters: PropTypes.func,
  onChange: PropTypes.func,
  onShow: PropTypes.func,
  onHide: PropTypes.func,

  placeholder: PropTypes.string,
  expanded: PropTypes.bool,
  formId: PropTypes.string,
  id: PropTypes.string,
  searchText: PropTypes.string,
  hideable: PropTypes.bool,
};

SearchBox.defaultProps = {
  placeholder: i18n._t('Admin.SEARCH', 'Search'),

  filters: {},
  formData: {},
  term: '',
}


export { SearchBox as Component};

export default SearchBox;
