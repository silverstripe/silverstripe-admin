import React, { Component } from 'react';
import { Button, Popover, PopoverTitle, PopoverContent } from 'reactstrap';

class PopoverField extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);

    this.state = {
      showing: false,
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

  toggle() {
    this.setState({
      showing: !this.state.showing
    });
  }

  render() {
    const placement = this.getPlacement();

    const buttonClasses = ['btn', 'btn-secondary', this.props.className];
    if (this.state.showing) {
      buttonClasses.push('btn--no-focus');
    }

    if (!this.props.title) {
      buttonClasses.push('font-icon-dot-3 btn--no-text');
      buttonClasses.push(`btn--icon-${this.props.buttonSize}`);
    }

    const buttonProps = {
      id: this.props.id,
      type: 'button',
      className: buttonClasses.join(' '),
    };
    if (this.props.data.buttonTooltip) {
      buttonProps.title = this.props.data.buttonTooltip;
    }

    return (
      <Button {...buttonProps} onClick={this.toggle}>
        {this.props.title}
        <Popover
          id={`${this.props.id}_Popover`}
          placement={placement}
          isOpen={this.state.showing}
          target={this.props.id}
          toggle={this.toggle}
          className={this.props.popoverClassName}
        >
          <PopoverHeader>{this.props.data.popoverTitle}</PopoverHeader>
          <PopoverBody>{this.props.children}</PopoverBody>
        </Popover>
      </Button>
    );
  }
}

PopoverField.propTypes = {
  id: React.PropTypes.string,
  title: React.PropTypes.any,
  className: React.PropTypes.string,
  popoverClassName: React.PropTypes.string,
  buttonSize: React.PropTypes.oneOf(['sm', 'md', 'large', 'xl']),
  data: React.PropTypes.oneOfType([
    React.PropTypes.array,
    React.PropTypes.shape({
      popoverTitle: React.PropTypes.string,
      buttonTooltip: React.PropTypes.string,
      placement: React.PropTypes.oneOf(['top', 'right', 'bottom', 'left']),
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
