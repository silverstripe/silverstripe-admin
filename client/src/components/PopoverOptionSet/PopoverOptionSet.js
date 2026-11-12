import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Input, InputGroup, Popover, Util as reactstrapUtil } from 'reactstrap';
import Button from 'components/Button/Button';
import classNames from 'classnames';
import i18n from 'i18n';

/**
 * Fills a popover with buttons and a search box to filter the buttons.
 * See the storybook for more details
 */
const PopoverOptionSet = (_props) => {
  const defaultProps = {
    searchPlaceholder: i18n._t('PopoverOptionSet.SEARCH_PLACEHOLDER', 'Search'),
    onSearch: (query, buttons) => buttons.filter(
      ({ content }) => content.toLowerCase().includes(query.toLowerCase())
    ),
    disableSearch: false,
    ButtonComponent: Button,
    PopoverComponent: Popover,
    className: 'popover-option-set',
    searchClassName: 'popover-option-set__search',
    searchInputClassName: 'popover-option-set__search-input',
    clearButtonClassName: 'popover-option-set__search-clear btn btn-link',
    buttonContainerClassName: 'popover-option-set__button-container',
    emptyResultClassName: 'popover-option-set__no-results',
    buttonClassName: 'popover-option-set__button',
  };
  const props = {
    ...defaultProps,
    ..._props,
  };
  const [searchValue, setSearchValue] = useState('');

  /**
   * Handle click on clear button within search bar
   */
  const handleSearchValueClear = () => {
    setSearchValue('');
  };

  /**
   * Move the focus back to the popover target
   */
  const focusOnTargetElement = () => {
    if (props.target) {
      const el = reactstrapUtil.getTarget(props.target);
      if (el) {
        el.focus();
      }
    }
  };

  /**
   * Pass toggle to parent (props requires a toggle function) and clear the search input
   * @param {bool} focusOnTarget Whether we should give the focus back to the popover target.
   */
  const doToggle = (focusOnTarget) => {
    props.toggle();
    handleSearchValueClear();

    if (focusOnTarget) {
      focusOnTargetElement();
    }
  };

  /**
   * Handle the toggle from the underlying react strap component.
   */
  const handleToggle = () => {
    doToggle(false);
  };

  /**
   * Update the internal state on user input change
   * @param {Event} event
   */
  const handleSearchValueChange = (event) => {
    setSearchValue(event.target.value);
  };

  /**
   * Handle key presses that are triggered while the popover is focused
   *
   * @param {SyntheticEvent} event
   */
  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      doToggle(true);
    }
  };

  /**
   * Render a link to clear the search field if user entered input
   * @returns {button|null}
   */
  const renderSearchValueClearLink = () => {
    if (searchValue.length === 0) {
      return null;
    }

    return (
      <button
        className={classNames(props.clearButtonClassName)}
        onClick={handleSearchValueClear}
      >
        {i18n._t('PopoverOptionSet.CLEAR', 'Clear')}
      </button>
    );
  };

  /**
   * Render the search value input box (which is in turn used to filter the buttons)
   *
   * @return {InputGroup|null}
   */
  const renderSearchBox = () => {
    if (props.disableSearch) {
      return null;
    }

    return (
      <InputGroup className={classNames(props.searchClassName)}>
        <Input
          autoFocus
          className={classNames(props.searchInputClassName)}
          onChange={handleSearchValueChange}
          placeholder={props.searchPlaceholder}
          type="text"
          value={searchValue}
        />
        {renderSearchValueClearLink()}
      </InputGroup>
    );
  };

  /**
   * Render either all buttons available, buttons matching the search term, or a message that
   * there are no matching buttons
   * @returns {DOMElement}
   */
  const renderOptionButtons = () => {
    let buttonsToRender = props.buttons;

    if (searchValue.length !== 0) {
      buttonsToRender = props.onSearch(searchValue, buttonsToRender);
    }

    if (buttonsToRender.length === 0) {
      return (
        <div className={classNames(props.buttonContainerClassName)}>
          <div className={classNames(props.emptyResultClassName)}>
            {i18n._t('PopoverOptionSet.NO_RESULTS', 'No results found')}
          </div>
        </div>
      );
    }

    return (
      <div className={classNames(props.buttonContainerClassName)}>
        {buttonsToRender.map((button) => (
          <props.ButtonComponent
            {...button.buttonProps}
            className={
              classNames(
                button.className,
                props.buttonClassName
              )
            }
            key={button.key}
            onClick={button.onClick}
            icon={button.icon}
          >
            {button.content}
          </props.ButtonComponent>
        ))}
      </div>
    );
  };

  return (
    <props.PopoverComponent
      className={classNames(props.className)}
      container={props.container}
      hideArrow
      isOpen={props.isOpen}
      onKeyDown={handleKeyDown}
      placement={props.placement}
      target={props.target}
      toggle={handleToggle}
      trigger="legacy"
    >
      {renderSearchBox()}
      {renderOptionButtons()}
    </props.PopoverComponent>
  );
};

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
  container: PropTypes.oneOfType([PropTypes.string, PropTypes.elementType]),
  isOpen: PropTypes.bool.isRequired,
  placement: PropTypes.string,
  target: PropTypes.oneOfType([PropTypes.string, PropTypes.elementType]).isRequired,
  toggle: PropTypes.func.isRequired,
  searchPlaceholder: PropTypes.string,
  disableSearch: PropTypes.bool,
  ButtonComponent: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  PopoverComponent: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
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

export default PopoverOptionSet;
