import React from 'react';
import castStringToElement from 'lib/castStringToElement';
import classnames from 'classnames';
import PropTypes from 'prop-types';

const FormAction = (_props) => {
  const defaultProps = {
    title: '',
    icon: '',
    extraClass: '',
    attributes: {},
    data: {},
    disabled: false,
    readOnly: false,
  };
  const props = {
    ...defaultProps,
    ..._props,
  };

  /**
   * Returns whether the button is disabled or readonly
   *
   * @returns {boolean}
   */
  const isDisabled = () => props.disabled || props.readOnly;

  /**
   * @returns {boolean}
   */
  const isPrimary = () => (
    props.name === 'action_save' ||
    !!props.extraClass.split(' ').find(className => className === 'ss-ui-action-constructive')
  );

  /**
   * Gets the bootstrap classname for this action
   *
   * @return {String}
   */
  const getButtonStyle = () => {
    // Add 'type' class
    if (typeof props.data.buttonStyle !== 'undefined') {
      return props.data.buttonStyle;
    }

    if (typeof props.buttonStyle !== 'undefined') {
      return props.buttonStyle;
    }

    // defined their own `btn-${something}` class
    if (props.extraClass.split(' ').find((className) => className.indexOf('btn-') > -1)) {
      return null;
    }

    if (isPrimary()) {
      return 'primary';
    }

    return 'secondary';
  };

  /**
   * Returns the necessary button classes based on the given props
   *
   * @returns string
   */
  const getButtonClasses = () => {
    const buttonClasses = {
      btn: true,
      'btn--no-text': (typeof props.title !== 'string'),
      'btn--loading': props.loading,
      disabled: isDisabled(),
    };
    // Add 'type' class
    const style = getButtonStyle();

    if (style) {
      buttonClasses[`btn-${style}`] = true;
    }

    if (typeof props.extraClass === 'string') {
      buttonClasses[props.extraClass] = true;
    }

    return classnames(buttonClasses);
  };

  /**
   * Event handler triggered when a user clicks the button.
   *
   * @param {Object} event
   */
  const handleClick = (event) => {
    if (typeof props.onClick === 'function') {
      props.onClick(event, props.name || props.id);
    }
  };

  /**
   * Get props for the button
   *
   * @returns {Object}
   */
  const getButtonProps = () => {
    // Merge attributes
    const buttonAttributes = typeof props.attributes === 'undefined' ? {} : props.attributes;
    return {
      ...buttonAttributes,
      id: props.id,
      name: props.name,
      className: getButtonClasses(),
      disabled: isDisabled(),
      onClick: handleClick,
    };
  };

  /**
   * Get icon name
   *
   * @returns {String}
   */
  const getIcon = () => props.icon || props.data.icon || null;

  /**
   * Returns markup for the loading icon
   *
   * @returns {Object|null}
   */
  const getLoadingIcon = () => {
    if (props.loading) {
      return (
        <div className="btn__loading-icon" >
          <span className="btn__circle btn__circle--1" />
          <span className="btn__circle btn__circle--2" />
          <span className="btn__circle btn__circle--3" />
        </div>
      );
    }

    return null;
  };

  const iconName = getIcon();
  return (
    <button {...getButtonProps()}>
      {iconName && <span className={`font-icon-${iconName} btn__icon`} aria-hidden="true" />}
      {getLoadingIcon()}
      {castStringToElement('span', props.title, { className: 'btn__title' })}
    </button>
  );
};

FormAction.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  onClick: PropTypes.func,
  title: PropTypes.string,
  type: PropTypes.string,
  loading: PropTypes.bool,
  icon: PropTypes.string,
  disabled: PropTypes.bool,
  readOnly: PropTypes.bool,
  data: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.shape({
      buttonStyle: PropTypes.string,
    }),
  ]),
  extraClass: PropTypes.string,
  attributes: PropTypes.object,
};

export default FormAction;
