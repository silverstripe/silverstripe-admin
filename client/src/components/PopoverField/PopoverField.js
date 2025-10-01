import React, { Component } from 'react';
import { Popover, PopoverHeader, PopoverBody } from 'reactstrap';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import Button from 'components/Button/Button';

class PopoverField extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);

    this.state = {
      isOpen: false,
    };
  }

  /**
   * Get popup placement direction
   *
   * @returns {String}
   */
  getPlacement() {
    const placement = this.props.data.placement;
    return placement || 'bottom';
  }

  /**
   * Gets the DOM element the Popover markup will be appended to
   * @return {*}
   */
  getContainer() {
    if (this.props.container) {
      return this.props.container;
    }
    return this.wrapper;
  }

  /**
   * Toggle the popover on or off, then run an optional callback after each toggle
   */
  toggle() {
    const { toggleCallback } = this.props;

    // Force setting state to the end of the execution queue to clear a potential race condition
    // with entwine click handlers
    //
    // ignore linting rule because following the recommended replacement caused behat failures
    // eslint-disable-next-line react/no-access-state-in-setstate
    window.setTimeout(() => this.setState({ isOpen: !this.state.isOpen }, toggleCallback), 0);
  }

  getButtonIcon() {
    if (this.props.buttonIcon) {
      return this.props.buttonIcon;
    }
    if (this.props.title) {
      return undefined;
    }
    return 'dot-3';
  }

  render() {
    const placement = this.getPlacement();

    const buttonClasses = classnames({
      btn: true,
      'btn-secondary': true,
      [this.props.className]: true,
      [this.props.buttonClassName]: true,
      'btn--no-focus': this.state.isOpen,
      'btn--no-text': !this.props.title,
      [`btn--icon-${this.props.buttonSize}`]: !this.props.title,
    });

    const buttonProps = {
      id: this.props.id,
      type: 'button',
      className: buttonClasses,
      onClick: this.toggle,
      title: this.props.data.buttonTooltip,
      icon: this.getButtonIcon(),
    };

    const wrapperClasses = classnames({
      [this.props.className]: true,
      'popover-container': true,
      'popover-field': true
    });

    return (
      <div className={wrapperClasses} ref={(wrapper) => { this.wrapper = wrapper; }}>
        <Button {...buttonProps}>{this.props.title}</Button>
        <Popover
          id={`${this.props.id}_Popover`}
          placement={placement}
          isOpen={this.state.isOpen}
          target={this.props.id}
          toggle={this.toggle}
          className={this.props.popoverClassName}
          container={this.getContainer()}
        >
          <PopoverHeader>{this.props.data.popoverTitle}</PopoverHeader>
          <PopoverBody>{this.props.children}</PopoverBody>
        </Popover>
      </div>
    );
  }
}

PopoverField.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.any,
  container: PropTypes.any,
  className: PropTypes.string,
  buttonClassName: PropTypes.string,
  buttonIcon: PropTypes.string,
  popoverClassName: PropTypes.string,
  buttonSize: PropTypes.oneOf(['sm', 'md', 'large', 'xl']),
  data: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.shape({
      popoverTitle: PropTypes.string,
      buttonTooltip: PropTypes.string,
      placement: PropTypes.oneOf(['top', 'bottom', 'left', 'right']),
    }),
  ]),
  toggleCallback: PropTypes.func,
};

PopoverField.defaultProps = {
  data: {},
  className: '',
  buttonClassName: '',
  popoverClassName: '',
  buttonSize: 'xl',
  toggleCallback: () => {},
};

export default PopoverField;
