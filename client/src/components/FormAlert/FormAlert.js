import React, { Component } from 'react';
import { Alert } from 'reactstrap';
import castStringToElement from 'lib/castStringToElement';
import classnames from 'classnames';
import PropTypes from 'prop-types';

/**
 * A wrapper for Alert messages in reactstrap.
 * Displays a given message.
 */
class FormAlert extends Component {
  constructor(props) {
    super(props);

    this.handleClosed = this.handleClosed.bind(this);

    this.state = {
      visible: true,
    };
  }

  /**
   * Determines the style for the alert box to be shown based on messageType or other property
   * by default use "danger".
   *
   * @returns {string} can be the following values "success", "warning", "danger", "info"
   */
  getMessageStyle() {
    // See ValidationResult::TYPE_ constant definitions in PHP.
    switch (this.props.type) {
      case 'good':
      case 'success':
        return 'success';
      case 'info':
        return 'info';
      case 'warn':
      case 'warning':
        return 'warning';
      default:
        return 'danger';
    }
  }

  /**
   * Generate the properties for the FormAlert
   * @returns {object} properties
   */
  getMessageProps() {
    const type = this.props.type || 'no-type';

    return {
      className: classnames([
        'message-box',
        `message-box--${type}`,
        this.props.className,
        this.props.extraClass,
      ]),
      color: this.getMessageStyle(),
      toggle: (this.props.closeLabel) ? this.handleClosed : null,
      isOpen: (this.props.closeLabel) ? this.state.visible : true,
    };
  }

  /**
   * Handler for when the message box is dismissed and hidden
   */
  handleClosed() {
    if (typeof this.props.onClosed === 'function') {
      this.props.onClosed();
    } else {
      this.setState({ visible: false });
    }
  }

  render() {
    // @todo default this.props.visible as null
    if ((typeof this.props.visible !== 'boolean' && this.state.visible) || this.props.visible) {
      // needs to be inside a div because the `Alert` component does some magic with props.children
      const body = castStringToElement('div', this.props.value);
      if (body) {
        return (
          <Alert {...this.getMessageProps()}>
            {body}
          </Alert>
        );
      }
    }
    return null;
  }
}

FormAlert.propTypes = {
  extraClass: PropTypes.string,
  value: PropTypes.any,
  type: PropTypes.string,
  onClosed: PropTypes.func,
  closeLabel: PropTypes.string,
  visible: PropTypes.bool,
};

FormAlert.defaultProps = {
  extraClass: '',
  className: '',
};

export default FormAlert;
