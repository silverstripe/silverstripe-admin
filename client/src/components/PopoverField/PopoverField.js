import React, { Component } from 'react';
import { Popover, OverlayTrigger } from 'react-bootstrap-ss';

class PopoverField extends Component {
  constructor(props) {
    super(props);

    this.handleShow = this.handleShow.bind(this);
    this.handleHide = this.handleHide.bind(this);

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

  handleShow() {
    this.setState({
      showing: true,
    });
  }

  handleHide() {
    this.setState({
      showing: false,
    });
  }

  render() {
    const placement = this.getPlacement();
    const overlay = (
      <Popover
        id={`${this.props.id}_Popover`}
        className={`fade in bs-popover-${placement} ${this.props.popoverClassName}`}
        title={this.props.data.popoverTitle}
      >
        {this.props.children}
      </Popover>
    );

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
      <OverlayTrigger
        rootClose
        trigger="click"
        placement={placement}
        overlay={overlay}
        onEnter={this.handleShow}
        onExited={this.handleHide}
        container={this.props.container}
      >
        <button {...buttonProps}>
          {this.props.title}
        </button>
      </OverlayTrigger>
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
