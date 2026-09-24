import React, { useEffect, useRef, useState } from 'react';
import { Popover, PopoverHeader, PopoverBody } from 'reactstrap';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import Button from 'components/Button/Button';

const PopoverField = (_props) => {
  const defaultProps = {
    data: {},
    className: '',
    buttonClassName: '',
    popoverClassName: '',
    buttonSize: 'xl',
    toggleCallback: () => {},
  };
  const props = {
    ...defaultProps,
    ..._props,
  };
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);
  const toggleCallbackRef = useRef(null);

  useEffect(() => {
    if (toggleCallbackRef.current) {
      const callback = toggleCallbackRef.current;
      toggleCallbackRef.current = null;
      callback();
    }
  }, [isOpen]);
  /**
   * Get popup placement direction
   *
   * @returns {String}
   */
  const getPlacement = () => {
    const placement = props.data.placement;
    return placement || 'bottom';
  };
  /**
   * Gets the DOM element the Popover markup will be appended to
   * @return {*}
   */
  const getContainer = () => {
    if (props.container) {
      return props.container;
    }
    return wrapperRef.current;
  };
  /**
   * Toggle the popover on or off, then run an optional callback after each toggle
   */
  const toggle = () => {
    // Force setting state to the end of the execution queue to clear a potential race condition
    // with entwine click handlers
    //
    // ignore linting rule because following the recommended replacement caused behat failures
    // eslint-disable-next-line react/no-access-state-in-setstate
    window.setTimeout(() => {
      toggleCallbackRef.current = props.toggleCallback;
      setIsOpen((current) => !current);
    }, 0);
  };
  const getButtonIcon = () => {
    if (props.buttonIcon) {
      return props.buttonIcon;
    }
    if (props.title) {
      return undefined;
    }
    return 'dot-3';
  };
  const placement = getPlacement();
  const buttonClasses = classnames({
    btn: true,
    'btn-secondary': true,
    [props.className]: true,
    [props.buttonClassName]: true,
    'btn--no-text': !props.title,
    [`btn--icon-${props.buttonSize}`]: !props.title,
  });
  const buttonProps = {
    id: props.id,
    type: 'button',
    className: buttonClasses,
    onClick: toggle,
    title: props.data.buttonTooltip,
    icon: getButtonIcon(),
  };
  const wrapperClasses = classnames({
    [props.className]: true,
    'popover-container': true,
    'popover-field': true
  });
  return (
    <div className={wrapperClasses} ref={wrapperRef}>
      <Button {...buttonProps}>{props.title}</Button>
      <Popover
        id={`${props.id}_Popover`}
        placement={placement}
        isOpen={isOpen}
        target={props.id}
        toggle={toggle}
        className={props.popoverClassName}
        container={getContainer()}
      >
        <PopoverHeader>{props.data.popoverTitle}</PopoverHeader>
        <PopoverBody>{props.children}</PopoverBody>
      </Popover>
    </div>
  );
};

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

export default PopoverField;
