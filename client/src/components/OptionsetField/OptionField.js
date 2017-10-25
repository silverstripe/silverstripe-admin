import React, { Component } from 'react';
import castStringToElement from 'lib/castStringToElement';
import { Checkbox, Radio } from 'react-bootstrap-ss';

class OptionField extends Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
  }

  /**
   * Fetches the properties for the field
   *
   * @returns {object} properties
   */
  getInputProps() {
    const classNames = [
      this.props.className,
      this.props.extraClass,
      'form-check',
    ];

    if (this.props.value) {
      classNames.push('checked');
    }

    if (this.props.readOnly || this.props.disabled) {
      // bootstrap4 specific
      classNames.push('disabled');

      if (this.props.disabled) {
        classNames.push('option-field--disabled');
      }
    }

    return {
      id: this.props.id,
      name: this.props.name,
      disabled: this.props.disabled || this.props.readOnly,
      readOnly: this.props.readOnly,
      className: classNames.join(' '),
      onChange: this.handleChange,
      checked: !!this.props.value,
      value: 1,
    };
  }

  /**
   * React recommends using `onClick`, however react-bootstrap uses `onChange`
   *
   * @param {Event} event
   */
  handleChange(event) {
    if (this.props.readOnly || this.props.disabled) {
      event.preventDefault();
      return;
    }
    if (typeof this.props.onChange === 'function') {
      // call onChange for `FormBuilder` to work
      this.props.onChange(event, {
        id: this.props.id,
        value: event.target.checked ? 1 : 0,
      });
    } else if (typeof this.props.onClick === 'function') {
      // for other React components which needs compatibility with this component
      this.props.onClick(event, {
        id: this.props.id,
        value: event.target.checked ? 1 : 0,
      });
    }
  }

  render() {
    const labelText = this.props.leftTitle !== null
      ? this.props.leftTitle
      : this.props.title;

    // default and fallback to a Radio button
    let Option = null;

    switch (this.props.type) {
      case 'checkbox':
        Option = Checkbox;
        break;
      case 'radio':
        Option = Radio;
        break;
      default:
        throw new Error(`Invalid OptionField type: ${this.props.type}`);
    }

    const label = (typeof labelText === 'string')
      ? { react: <span>{labelText}</span> }
      : labelText;

    return castStringToElement(Option, label, this.getInputProps());
  }
}

OptionField.propTypes = {
  type: React.PropTypes.oneOf(['checkbox', 'radio']),
  leftTitle: React.PropTypes.any,
  title: React.PropTypes.any,
  extraClass: React.PropTypes.string,
  id: React.PropTypes.string,
  name: React.PropTypes.string,
  onChange: React.PropTypes.func,
  value: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.number,
    React.PropTypes.bool,
  ]),
  readOnly: React.PropTypes.bool,
  disabled: React.PropTypes.bool,
};

OptionField.defaultProps = {
  // React considers "undefined" as an uncontrolled component.
  extraClass: '',
  className: '',
  type: 'radio',
  leftTitle: null,
};

export default OptionField;
