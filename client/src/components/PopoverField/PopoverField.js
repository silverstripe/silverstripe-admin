import React, { useState, useRef, useEffect } from 'react';
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
  const wrapper = useRef(null);
  const callbackPending = useRef(false);
  // Persist the latest props to simulate class component `this.props` behavior
  // and prevent stale closures
  const propsRef = useRef(props);
  // Update current props on each render before running any effects or callbacks
  propsRef.current = props;

  useEffect(() => {
    // Run the toggle callback after the state change has been applied, like the setState callback did
    if (callbackPending.current) {
      callbackPending.current = false;
      propsRef.current.toggleCallback();
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
    return wrapper.current;
  };

  /**
   * Toggle the popover on or off, then run an optional callback after each toggle
   */
  const toggle = () => {
    // Force setting state to the end of the execution queue to clear a potential race condition
    // with entwine click handlers
    window.setTimeout(() => {
      callbackPending.current = true;
      setIsOpen(!isOpen);
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
    <div className={wrapperClasses} ref={wrapper}>
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
