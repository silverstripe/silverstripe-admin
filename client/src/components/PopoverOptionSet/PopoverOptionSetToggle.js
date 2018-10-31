import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';
import PopoverOptionSet from './PopoverOptionSet';
import { inject } from 'lib/Injector';
import i18n from 'i18n';

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
    const { id, toggleText, buttonProps: forwardedButtonProps, ...forwardedProps } = this.props;

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
          {toggleText}
        </Button>
        <PopoverOptionSet {...popoverProps} />
      </div>
    );
  }
}

PopoverOptionSetToggle.propTypes = {
  // Unique identifier for this toggle - passed through as an ID attribute onto the popover
  id: PropTypes.string.isRequired,
  // Text to be used for the button
  toggleText: PropTypes.string,
  // Provide props for the toggle button
  buttonProps: PropTypes.object,
  // Other given props will be forwarded to the included PopoverOptionSet
};

PopoverOptionSetToggle.defaultProps = {
  toggleText: i18n._t('PopoverOptionSetToggle.TOGGLE', 'Toggle'),
};

export { PopoverOptionSetToggle as Component };

export default inject(
  ['PopoverOptionSet'],
  (PopoverOptionSetComponent) => ({
    PopoverOptionSetComponent,
  }),
  () => 'PopoverOptionSetToggle'
)(PopoverOptionSetToggle);

