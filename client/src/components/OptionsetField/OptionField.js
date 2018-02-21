import React, { Component } from 'react';
import { FormGroup, Input, Label } from 'reactstrap';
import classnames from 'classnames';

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
    const classes = classnames({
      [this.props.className]: true,
      [this.props.extraClass]: true,
      'form-check': true,
      checked: this.props.value,
      disabled: this.props.readOnly,
      'option-field--disabled': this.props.readOnly || this.props.disabled,
    });

    return {
      id: this.props.id,
      type: this.props.type,
      name: this.props.name,
      disabled: this.props.disabled || this.props.readOnly,
      readOnly: this.props.readOnly,
      className: classes,
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

    let callback = null;
    if (typeof this.props.onChange === 'function') {
      // call onChange for `FormBuilder` and `redux-form` to work
      callback = this.props.onChange;
    } else if (typeof this.props.onClick === 'function') {
      // for other React components which needs compatibility with this component
      callback = this.props.onClick;
    }

    if (callback) {
      callback(event, {
        id: this.props.id,
        value: event.target.checked ? 1 : 0,
      });
    }
  }

  render() {
    const labelText = this.props.leftTitle !== null
      ? this.props.leftTitle
      : this.props.title;

    return (
      <FormGroup check>
        <Label check>
          <Input {...this.getInputProps()} />
          {labelText}
        </Label>
      </FormGroup>
    );
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

export { OptionField as Component };

export default OptionField;
