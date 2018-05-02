import React, { Component } from 'react';
import { Button, Popover, PopoverHeader, PopoverBody } from 'reactstrap';
import classnames from 'classnames';

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
   * Toggle the popover on or off
   */
  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  render() {
    const placement = this.getPlacement();

    const buttonClasses = classnames({
      'popover-container': true,
      btn: true,
      'btn-secondary': true,
      [this.props.className]: true,
      'btn--no-focus': this.state.isOpen,
      'font-icon-dot-3 btn--no-text': !this.props.title,
      [`btn--icon-${this.props.buttonSize}`]: !this.props.title,
    });

    const buttonProps = {
      id: this.props.id,
      type: 'button',
      onClick: this.toggle,
      title: this.props.data.buttonTooltip,
    };

    return (
      <div className={buttonClasses}>
        <Button {...buttonProps}>{this.props.title}</Button>
        <Popover
          id={`${this.props.id}_Popover`}
          placement={placement}
          isOpen={this.state.isOpen}
          target={this.props.id}
          toggle={this.toggle}
          className={this.props.popoverClassName}
          container={this.props.container}
        >
          <PopoverHeader>{this.props.data.popoverTitle}</PopoverHeader>
          <PopoverBody>{this.props.children}</PopoverBody>
        </Popover>
      </div>
    );
  }
}

PopoverField.propTypes = {
  id: React.PropTypes.string,
  title: React.PropTypes.any,
  container: React.PropTypes.any,
  className: React.PropTypes.string,
  popoverClassName: React.PropTypes.string,
  buttonSize: React.PropTypes.oneOf(['sm', 'md', 'large', 'xl']),
  data: React.PropTypes.oneOfType([
    React.PropTypes.array,
    React.PropTypes.shape({
      popoverTitle: React.PropTypes.string,
      buttonTooltip: React.PropTypes.string,
      placement: React.PropTypes.string,
    }),
  ]),
};

PopoverField.defaultProps = {
  data: {},
  className: '',
  popoverClassName: '',
  buttonSize: 'xl',
};

export default PopoverField;
