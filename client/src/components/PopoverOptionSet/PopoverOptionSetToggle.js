import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';
import PopoverOptionSet from './PopoverOptionSet';

/**
 * Simple component that presents a button that will toggle a PopoverOptionSet.
 * Using this component means that you won't be able to manage "open" state yourself.
 */
class PopoverOptionSetToggle extends Component {
  constructor(props) {
    super(props);

    this.handleToggle = this.handleToggle.bind(this);

    this.state = {
      isOpen: false,
    };
  }

  /**
   * Handle toggling the "open" state of the popover.
   */
  handleToggle() {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  }

  render() {
    const { isOpen } = this.state;
    const { id, buttonProps: forwardedButtonProps, ...forwardedProps } = this.props;

    const popoverProps = {
      ...forwardedProps,
      toggle: this.handleToggle,
      isOpen,
      target: id,
    };

    const buttonProps = {
      ...forwardedButtonProps,
      id,
      onClick: this.handleToggle,
    };

    return (
      <div>
        <Button {...buttonProps} >
          Toggle
        </Button>
        <PopoverOptionSet {...popoverProps} />
      </div>
    );
  }
}

PopoverOptionSetToggle.proptypes = {
  id: PropTypes.string.isRequired,
  // Provide props for the toggle button
  buttonProps: PropTypes.object,
  // Other given props will be forwarded to the included PopoverOptionSet
};

export default PopoverOptionSetToggle;

