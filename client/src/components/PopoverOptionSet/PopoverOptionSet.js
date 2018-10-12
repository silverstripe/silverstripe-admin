import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Input, InputGroup, InputGroupAddon, Popover } from 'reactstrap';
import classNames from 'classnames';
import i18n from 'i18n';

class PopoverOptionSet extends Component {
  constructor(props) {
    super(props);

    this.handleToggle = this.handleToggle.bind(this);
    this.handleSearchValueClear = this.handleSearchValueClear.bind(this);
    this.handleSearchValueChange = this.handleSearchValueChange.bind(this);

    this.state = {
      searchValue: ''
    };
  }

  /**
   * Pass toggle to parent and clear the search input
   */
  handleToggle() {
    const { toggle } = this.props;

    toggle();
    this.handleSearchValueClear();
  }

  /**
   * Handle click on clear button within search bar
   */
  handleSearchValueClear() {
    this.setState(
      { searchValue: '' }
    );
  }

  /**
   * Update the internal state on user input change
   * @param {Event} event
   */
  handleSearchValueChange(event) {
    this.setState(
      { searchValue: event.target.value }
    );
  }

  /**
   * Render a link to clear the search field if user entered input
   * @returns {DOMElement}
   */
  renderSearchValueClearLink() {
    const { searchValue } = this.state;

    if (searchValue.length === 0) {
      return null;
    }

    return (
      <InputGroupAddon addonType="append">
        <button
          className="popover-option-set__search-clear btn-link"
          onClick={this.handleSearchValueClear}
        >
          {i18n._t('PopoverOptionSet.CLEAR', 'Clear')}
        </button>
      </InputGroupAddon>
    );
  }

  /**
   * Render the search value intput box (which is in turn used to filter the buttons)
   *
   * @return {DOMElement}
   */
  renderSearchBox() {
    const { searchPlaceholder, disableSearch } = this.props;
    const { searchValue } = this.state;
    if (disableSearch) {
      return null;
    }
    return (
      <InputGroup className="popover-option-set__search">
        <Input
          autoFocus
          className="popover-option-set__search-input"
          id="popover-option-set__search-input"
          onChange={this.handleSearchValueChange}
          placeholder={searchPlaceholder}
          type="text"
          value={searchValue}
        />
        {this.renderSearchValueClearLink()}
      </InputGroup>
    );
  }

  /**
   * Render either all buttons available, buttons matching the search term, or a message that
   * there are no matching buttons
   * @returns {DOMElement}
   */
  renderOptionButtons() {
    const { onSearch, onButtonClick, ButtonComponent } = this.props;
    let { buttons } = this.props;
    const { searchValue } = this.state;

    if (searchValue.length !== 0) {
      buttons = onSearch(searchValue, buttons);
    }

    if (buttons.length === 0) {
      return (
        <div className="popover-option-set__button-container">
          <div className="popover-option-set__no-results">
            {i18n._t('PopoverOptionSet.NO_RESULTS', 'No results found')}
          </div>
        </div>
      );
    }

    return (
      <div className="popover-option-set__button-container">
        {buttons.map((button) => (
          <ButtonComponent
            className={
              classNames(
                button.className,
                'btn--icon-xl',
                'popover-option-set__button'
              )
            }
            key={button.key}
            onClick={onButtonClick(button)}
          >
            {button.content}
          </ButtonComponent>
        ))}
      </div>
    );
  }

  /**
   * Render the option set popover
   * @returns {DOMElement}
   */
  render() {
    const { container, extraClass, isOpen, placement, target } = this.props;
    const popoverClassNames = classNames(
      'popover-option-set',
      extraClass
    );

    return (
      <Popover
        className={popoverClassNames}
        container={container}
        hideArrow
        isOpen={isOpen}
        placement={placement}
        target={target}
        toggle={this.handleToggle}
      >
        {this.renderSearchBox()}
        {this.renderOptionButtons()}
      </Popover>
    );
  }
}

const buttonType = PropTypes.shape({
  key: PropTypes.string.required,
  content: PropTypes.string.required,
  className: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.arrayOf(PropTypes.string)
  ]),
});

PopoverOptionSet.propTypes = {
  buttons: PropTypes.arrayOf(buttonType),
  onSearch: PropTypes.func,
  // function that accepts a button object & returns an event handler
  // e.g. (button) => (event) => event.preventDefault() && togglePopover();
  onButtonClick: PropTypes.func.isRequired,
  container: PropTypes.oneOfType([PropTypes.string, PropTypes.func, PropTypes.object]),
  extraClass: PropTypes.oneOfType([PropTypes.string, PropTypes.array, PropTypes.object]),
  isOpen: PropTypes.bool.isRequired,
  placement: PropTypes.string,
  target: PropTypes.oneOfType([PropTypes.string, PropTypes.func, PropTypes.object]).isRequired,
  toggle: PropTypes.func.isRequired,
  searchPlaceholder: PropTypes.string,
  disableSearch: PropTypes.bool,
  ButtonComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
};

PopoverOptionSet.defaultProps = {
  searchPlaceholder: i18n._t('PopoverOptionSet.SEARCH_PLACEHOLDER', 'Search'),
  onSearch: (query, buttons) => buttons.filter(
    // Default search handler assumes button content to be plain text
    ({ content }) => content.toLowerCase().includes(query.toLowerCase())
  ),
  disableSearch: false,
  ButtonComponent: Button,
};

export { buttonType };

export default PopoverOptionSet;
