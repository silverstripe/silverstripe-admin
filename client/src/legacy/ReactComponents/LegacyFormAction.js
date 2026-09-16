import React, { Component } from 'react';
import castStringToElement from 'lib/castStringToElement';
import classnames from 'classnames';
import PropTypes from 'prop-types';

class FormAction extends Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  /**
   * Get props for the button
   *
   * @returns {Object}
   */
  getButtonProps() {
    const { attributes, id, name } = this.props;

    // Merge attributes
    const buttonAttributes = typeof attributes === 'undefined' ? {} : attributes;
    return {
      ...buttonAttributes,
      id,
      name,
      className: this.getButtonClasses(),
      disabled: this.isDisabled(),
      onClick: this.handleClick,
    };
  }

  /**
   * Returns the necessary button classes based on the given props
   *
   * @returns string
   */
  getButtonClasses() {
    const { title, loading, extraClass } = this.props;

    const buttonClasses = {
      btn: true,
      'btn--no-text': (typeof title !== 'string'),
      'btn--loading': loading,
      disabled: this.isDisabled(),
    };
    // Add 'type' class
    const style = this.getButtonStyle();

    if (style) {
      buttonClasses[`btn-${style}`] = true;
    }

    if (typeof extraClass === 'string') {
      buttonClasses[extraClass] = true;
    }

    return classnames(buttonClasses);
  }

  /**
   * Gets the bootstrap classname for this action
   *
   * @return {String}
   */
  getButtonStyle() {
    // Add 'type' class
    if (typeof this.props.data.buttonStyle !== 'undefined') {
      return this.props.data.buttonStyle;
    }

    if (typeof this.props.buttonStyle !== 'undefined') {
      return this.props.buttonStyle;
    }

    const extraClasses = this.props.extraClass.split(' ');

    // defined their own `btn-${something}` class
    if (extraClasses.find((className) => className.indexOf('btn-') > -1)) {
      return null;
    }

    if (this.isPrimary()) {
      return 'primary';
    }

    return 'secondary';
  }

  /**
   * Get icon name
   *
   * @returns {String}
   */
  getIcon() {
    // In case this is specified directly
    return this.props.icon || this.props.data.icon || null;
  }

  /**
   * Returns markup for the loading icon
   *
   * @returns {Object|null}
   */
  getLoadingIcon() {
    if (this.props.loading) {
      return (
        <div className="btn__loading-icon" >
          <span className="btn__circle btn__circle--1" />
          <span className="btn__circle btn__circle--2" />
          <span className="btn__circle btn__circle--3" />
        </div>
      );
    }

    return null;
  }

  /**
   * Returns whether the button is disabled or readonly
   *
   * @returns {boolean}
   */
  isDisabled() {
    const { disabled, readOnly } = this.props;

    return disabled || readOnly;
  }

  /**
   * @returns {boolean}
   */
  isPrimary() {
    const { extraClass, name } = this.props;

    const extraClasses = extraClass ? extraClass.split(' ') : [];
    return (
      name === 'action_save' ||
      !!extraClasses.find(className => className === 'ss-ui-action-constructive')
    );
  }

  /**
   * Event handler triggered when a user clicks the button.
   *
   * @param {Object} event
   */
  handleClick(event) {
    if (typeof this.props.onClick === 'function') {
      this.props.onClick(event, this.props.name || this.props.id);
    }
  }

  render() {
    const { title } = this.props;

    const icon = this.getIcon();

    return (
      <button {...this.getButtonProps()}>
        {icon && <span className={`font-icon-${icon} btn__icon`} aria-hidden="true" />}
        {this.getLoadingIcon()}
        {castStringToElement('span', title, { className: 'btn__title' })}
      </button>
    );
  }
}

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

FormAction.defaultProps = {
  title: '',
  icon: '',
  extraClass: '',
  attributes: {},
  data: {},
  disabled: false,
  readOnly: false,
};

export default FormAction;
