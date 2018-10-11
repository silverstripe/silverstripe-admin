import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Input, InputGroup, InputGroupAddon, Popover } from 'reactstrap';
import classNames from 'classnames';
import i18n from 'i18n';

class PopoverOptionSet extends Component {
  constructor(props) {
    super(props);

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
    this.handleClear();
  }

  /**
   * Handle click on clear button within search bar
   */
  handleClear() {
    this.setState(
      { searchValue: '' }
    );
  }

  /**
   * Update the internal state on user input change
   * @param event
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
  renderClearLink() {
    const { searchValue } = this.state;

    if (searchValue.length === 0) {
      return null;
    }

    return (
      <InputGroupAddon addonType="append">
        <button
          className="popover-option-set__search-clear btn-link"
          onClick={this.handleClear}
        >
          {i18n._t('PopoverOptionSet.CLEAR', 'Clear')}
        </button>
      </InputGroupAddon>
    );
  }

  /**
   * Render either all buttons available, buttons matching the search term, or a message that
   * there are no matching buttons
   * @returns {DOMElement}
   */
  renderOptionButtons() {
    const { onSearch, onButtonClick } = this.props;
    let { buttons } = this.props;
    const { searchValue } = this.state;

    if (searchValue.length !== 0) {
      buttons = onSearch(searchValue, buttons);
    }

    if (buttons.length === 0) {
      return (
        <div className="popover-option-set__no-results">
          {i18n._t('PopoverOptionSet.NO_RESULTS', 'No results found')}
        </div>
      );
    }

    return buttons.map((button) =>
      (
        <Button
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
          {button.text}
        </Button>
      )
    );
  }

  /**
   * Render the container for the option set popover content
   * @returns {DOMElement}
   */
  renderPopoverOptionSetContent() {
    return (
      <div className="popover-option-set__button-container">
        {this.renderOptionButtons()}
      </div>
    );
  }

  /**
   * Render the option set popover
   * @returns {DOMElement}
   */
  render() {
    const { container, extraClass, isOpen, placement, target, searchPlaceholder } = this.props;
    const { searchValue } = this.state;
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
          {this.renderClearLink()}
        </InputGroup>
        {this.renderPopoverOptionSetContent()}
      </Popover>
    );
  }
}

const buttonType = PropTypes.shape({
  key: PropTypes.string.required,
  text: PropTypes.string.required,
  className: PropTypes.string,
});

PopoverOptionSet.propTypes = {
  buttons: PropTypes.arrayOf(buttonType),
  onSearch: PropTypes.func,
  onButtonClick: PropTypes.func.isRequired,
  container: PropTypes.oneOfType([PropTypes.string, PropTypes.func, PropTypes.object]),
  extraClass: PropTypes.oneOfType([PropTypes.string, PropTypes.array, PropTypes.object]),
  isOpen: PropTypes.bool.isRequired,
  placement: PropTypes.string,
  target: PropTypes.oneOfType([PropTypes.string, PropTypes.func, PropTypes.object]).isRequired,
  toggle: PropTypes.func.isRequired,
  searchPlaceholder: PropTypes.string,
};

PopoverOptionSet.defaultProps = {
  searchPlaceholder: i18n._t('PopoverOptionSet.SEARCH_PLACEHOLDER', 'Search'),
  onSearch: (query, buttons) => buttons.filter(({ text }) => text.contains(query)),
};

export { buttonType };

export default PopoverOptionSet;
