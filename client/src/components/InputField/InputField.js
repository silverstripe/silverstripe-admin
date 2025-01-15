import React, { Component } from 'react';
import {
  Input,
  InputGroup,
} from 'reactstrap';
import PropTypes from 'prop-types';

import Tip, { tipShape } from 'components/Tip/Tip';

class InputField extends Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
  }

  /**
   * Fetches the properties for the input field
   *
   * @returns {object} properties
   */
  getInputProps() {
    const props = {
      className: `${this.props.className} ${this.props.extraClass}`,
      id: this.props.id,
      name: this.props.name,
      disabled: this.props.disabled,
      readOnly: this.props.readOnly,
      value: this.props.value || '',
      placeholder: this.props.placeholder,
      autoFocus: this.props.autoFocus,
      maxLength: this.props.data && this.props.data.maxlength,
      type: this.props.type ? this.props.type : null,
      onBlur: this.props.onBlur,
      onFocus: this.props.onFocus
    };

    if (this.props.attributes && !Array.isArray(this.props.attributes)) {
      Object.assign(props, this.props.attributes);
    }

    if (!this.props.readOnly) {
      Object.assign(props, {
        onChange: this.handleChange,
      });
    }

    return props;
  }

  /**
   * Handles changes to the input field's value.
   *
   * @param {Event} event
   */
  handleChange(event) {
    if (typeof this.props.onChange === 'function') {
      if (!event.target) {
        return;
      }
      this.props.onChange(event, { id: this.props.id, value: event.target.value });
    }
  }

  renderFieldWithTip() {
    const { id, title, tip } = this.props;

    return (
      <InputGroup>
        <Input {...this.getInputProps()} />
        <Tip
          {...tip}
          fieldTitle={title}
          id={`${id}-tip`}
        />
      </InputGroup>
    );
  }

  render() {
    if (this.props.tip) {
      return this.renderFieldWithTip();
    }

    return <Input {...this.getInputProps()} />;
  }
}

InputField.propTypes = {
  extraClass: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  readOnly: PropTypes.bool,
  disabled: PropTypes.bool,
  placeholder: PropTypes.string,
  type: PropTypes.string,
  autoFocus: PropTypes.bool,
  attributes: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  tip: PropTypes.shape(tipShape),
};

InputField.defaultProps = {
  // React considers "undefined" as an uncontrolled component.
  value: '',
  extraClass: '',
  className: '',
  type: 'text',
  attributes: {},
};

export { InputField as Component };

export default InputField;
