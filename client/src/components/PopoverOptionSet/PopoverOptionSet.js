import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Input, InputGroup, InputGroupAddon, Popover } from 'reactstrap';
import classNames from 'classnames';
import i18n from 'i18n';

/**
 * Fills a popover with buttons and a search box to filter the buttons.
 * See the storybook for more details
 */
class PopoverOptionSet extends Component {
  constructor(props) {
    super(props);

    this.handleToggle = this.handleToggle.bind(this);
    this.handleSearchValueClear = this.handleSearchValueClear.bind(this);
    this.handleSearchValueChange = this.handleSearchValueChange.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);

    this.state = {
      searchValue: ''
    };
  }

  /**
   * Pass toggle to parent (props requires a toggle function) and clear the search input
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
   * Handle key presses that are triggered while the popover is focused
   *
   * @param {SyntheticEvent} event
   */
  handleKeyDown(event) {
    if (event.key === 'Escape') {
      this.handleToggle();
    }
  }

  /**
   * Render a link to clear the search field if user entered input
   * @returns {InputGroupAddon|null}
   */
  renderSearchValueClearLink() {
    const { clearButtonClassName } = this.props;
    const { searchValue } = this.state;

    if (searchValue.length === 0) {
      return null;
    }

    return (
      <InputGroupAddon addonType="append">
        <button
          className={classNames(clearButtonClassName)}
          onClick={this.handleSearchValueClear}
        >
          {i18n._t('PopoverOptionSet.CLEAR', 'Clear')}
        </button>
      </InputGroupAddon>
    );
  }

  /**
   * Render the search value input box (which is in turn used to filter the buttons)
   *
   * @return {InputGroup|null}
   */
  renderSearchBox() {
    const {
      searchPlaceholder, disableSearch, searchClassName, searchInputClassName
    } = this.props;
    const { searchValue } = this.state;

    if (disableSearch) {
      return null;
    }

    return (
      <InputGroup className={classNames(searchClassName)}>
        <Input
          autoFocus
          className={classNames(searchInputClassName)}
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
    const {
      buttons, onSearch, buttonContainerClassName,
      emptyResultClassName, buttonClassName, ButtonComponent
    } = this.props;
    const { searchValue } = this.state;

    let buttonsToRender = buttons;

    if (searchValue.length !== 0) {
      buttonsToRender = onSearch(searchValue, buttonsToRender);
    }

    if (buttonsToRender.length === 0) {
      return (
        <div className={classNames(buttonContainerClassName)}>
          <div className={classNames(emptyResultClassName)}>
            {i18n._t('PopoverOptionSet.NO_RESULTS', 'No results found')}
          </div>
        </div>
      );
    }

    return (
      <div className={classNames(buttonContainerClassName)}>
        {buttonsToRender.map((button) => (
          <ButtonComponent
            {...button.buttonProps}
            className={
              classNames(
                button.className,
                buttonClassName
              )
            }
            key={button.key}
            onClick={button.onClick}
          >
            {button.content}
          </ButtonComponent>
        ))}
      </div>
    );
  }

  /**
   * Render the option set popover
   * @returns {Popover}
   */
  render() {
    const { container, className, isOpen, placement, target } = this.props;

    return (
      <Popover
        className={classNames(className)}
        container={container}
        hideArrow
        isOpen={isOpen}
        placement={placement}
        target={target}
        toggle={this.handleToggle}
        onKeyDown={this.handleKeyDown}
      >
        {this.renderSearchBox()}
        {this.renderOptionButtons()}
      </Popover>
    );
  }
}

PopoverOptionSet.propTypes = {
  buttons: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string.isRequired,
    content: PropTypes.node.isRequired,
    onClick: PropTypes.func.isRequired,
    className: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
      PropTypes.arrayOf(PropTypes.string)
    ]),
    buttonProps: PropTypes.object,
  })).isRequired,
  // Accepts a function that takes a search term as a first parameter and a set
  // of buttons to match against that returns a filtered set of buttons
  // Default search handler assumes button content to be plain text and performs
  // a simple string.contains check.
  onSearch: PropTypes.func,
  container: PropTypes.oneOfType([PropTypes.string, PropTypes.func, PropTypes.object]),
  isOpen: PropTypes.bool.isRequired,
  placement: PropTypes.string,
  target: PropTypes.oneOfType([PropTypes.string, PropTypes.func, PropTypes.object]).isRequired,
  toggle: PropTypes.func.isRequired,
  searchPlaceholder: PropTypes.string,
  disableSearch: PropTypes.bool,
  ButtonComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  // Various classNames that can be configured:
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.array, PropTypes.object]),
  searchClassName: PropTypes.oneOfType([PropTypes.string, PropTypes.array, PropTypes.object]),
  searchInputClassName: PropTypes.oneOfType([PropTypes.string, PropTypes.array, PropTypes.object]),
  clearButtonClassName: PropTypes.oneOfType([PropTypes.string, PropTypes.array, PropTypes.object]),
  buttonContainerClassName:
    PropTypes.oneOfType([PropTypes.string, PropTypes.array, PropTypes.object]),
  emptyResultClassName: PropTypes.oneOfType([PropTypes.string, PropTypes.array, PropTypes.object]),
  buttonClassName: PropTypes.oneOfType([PropTypes.string, PropTypes.array, PropTypes.object]),
};

PopoverOptionSet.defaultProps = {
  searchPlaceholder: i18n._t('PopoverOptionSet.SEARCH_PLACEHOLDER', 'Search'),
  onSearch: (query, buttons) => buttons.filter(
    ({ content }) => content.toLowerCase().includes(query.toLowerCase())
  ),
  disableSearch: false,
  ButtonComponent: Button,
  className: 'popover-option-set',
  searchClassName: 'popover-option-set__search',
  searchInputClassName: 'popover-option-set__search-input',
  clearButtonClassName: 'popover-option-set__search-clear btn btn-link',
  buttonContainerClassName: 'popover-option-set__button-container',
  emptyResultClassName: 'popover-option-set__no-results',
  buttonClassName: 'popover-option-set__button',

};

export default PopoverOptionSet;
