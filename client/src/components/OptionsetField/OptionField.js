import React, { Component } from 'react';
import fieldHolder from 'components/FieldHolder/FieldHolder';
import { Input, Label } from 'reactstrap';

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
      type: this.props.type,
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

    const FieldHolder = fieldHolder(() =>
      (<Label check>
        <Input {...this.getInputProps()} />
        {labelText}
      </Label>)
    );

    return (
      <FieldHolder {...this.props} hideLabels check />
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
  rightTitle: React.PropTypes.any,
  check: React.PropTypes.bool,
};

OptionField.defaultProps = {
  // React considers "undefined" as an uncontrolled component.
  extraClass: '',
  className: '',
  type: 'radio',
  leftTitle: null,
  check: true,
};

export { OptionField as Component };

export default fieldHolder(OptionField);
