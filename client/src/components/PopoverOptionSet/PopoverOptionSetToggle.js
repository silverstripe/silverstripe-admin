import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';
import { inject } from 'lib/Injector';
import i18n from 'i18n';
import PopoverOptionSet from './PopoverOptionSet';

/**
 * Simple component that presents a button that will toggle a PopoverOptionSet.
 * Using this component means that you won't be able to manage "open" state yourself.
 */
const PopoverOptionSetToggle = (_props) => {
  const defaultProps = {
    toggleText: i18n._t('PopoverOptionSetToggle.TOGGLE', 'Toggle'),
  };
  const props = {
    ...defaultProps,
    ..._props,
  };

  const [isOpen, setIsOpen] = useState(false);

  /**
   * Handle toggling the "open" state of the popover.
   */
  const handleToggle = () => {
    // Force setting state to the end of the execution queue to clear a potential race condition
    // with entwine click handlers
    //
    // ignore linting rule because following the recommended replacement caused behat failures
    // eslint-disable-next-line react/no-access-state-in-setstate
    window.setTimeout(() => setIsOpen((prev) => !prev), 0);
  };

  const { id, toggleText, buttonProps: forwardedButtonProps, ...forwardedProps } = props;

  const popoverProps = {
    ...forwardedProps,
    toggle: handleToggle,
    isOpen,
    target: id,
  };

  const buttonProps = {
    ...forwardedButtonProps,
    id,
    onClick: handleToggle,
  };

  return (
    <div>
      <Button {...buttonProps} >
        {toggleText}
      </Button>
      <PopoverOptionSet {...popoverProps} />
    </div>
  );
};

PopoverOptionSetToggle.propTypes = {
  // Unique identifier for this toggle - passed through as an ID attribute onto the popover
  id: PropTypes.string.isRequired,
  // Text to be used for the button
  toggleText: PropTypes.string,
  // Provide props for the toggle button
  buttonProps: PropTypes.object,
  // Other given props will be forwarded to the included PopoverOptionSet
};

export { PopoverOptionSetToggle as Component };

export default inject(
  ['PopoverOptionSet'],
  (PopoverOptionSetComponent) => ({
    PopoverOptionSetComponent,
  }),
  () => 'PopoverOptionSetToggle'
)(PopoverOptionSetToggle);
