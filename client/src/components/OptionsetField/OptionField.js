import React from 'react';
import { FormGroup, Input, Label } from 'reactstrap';
import classnames from 'classnames';
import castStringToElement from 'lib/castStringToElement';
import PropTypes from 'prop-types';

const OptionField = (_props) => {
  const defaultProps = {
    // React considers "undefined" as an uncontrolled component.
    extraClass: '',
    className: '',
    type: 'radio',
    leftTitle: null,
    rightTitle: null,
  };
  const props = {
    ...defaultProps,
    ..._props,
  };

  /**
   * React recommends using `onClick`, however react-bootstrap uses `onChange`
   *
   * @param {Event} event
   */
  const handleChange = (event) => {
    if (props.readOnly || props.disabled) {
      event.preventDefault();
      return;
    }

    let callback = null;
    if (typeof props.onChange === 'function') {
      // call onChange for `FormBuilder` and `redux-form` to work
      callback = props.onChange;
    } else if (typeof props.onClick === 'function') {
      // for other React components which needs compatibility with this component
      callback = props.onClick;
    }

    if (callback) {
      callback(event, {
        id: props.id,
        value: event.target.checked ? 1 : 0,
      });
    }
  };

  /**
   * Fetches the properties for the field
   *
   * @returns {object} properties
   */
  const getInputProps = () => {
    const classes = classnames({
      [props.className]: true,
      [props.extraClass]: true,
      checked: props.value,
      disabled: props.readOnly,
      'option-field--disabled': props.readOnly || props.disabled,
    });
    const inputProps = {
      id: props.id,
      type: props.type,
      name: props.name,
      disabled: props.disabled || props.readOnly,
      readOnly: props.readOnly,
      className: classes,
      onChange: handleChange,
      checked: !!props.value,
      value: 1,
    };
    if (props.role) {
      inputProps.role = props.role;
    }
    return inputProps;
  };

  const leftTitle = props.leftTitle !== null
    ? props.leftTitle
    : props.title;

  const labelText = props.rightTitle !== null
    ? `${leftTitle} ${props.rightTitle}`
    : leftTitle;

  return (
    <FormGroup check>
      <Label check>
        <Input {...getInputProps()} />
        {castStringToElement('span', labelText)}
      </Label>
    </FormGroup>
  );
};

OptionField.propTypes = {
  type: PropTypes.oneOf(['checkbox', 'radio']),
  role: PropTypes.string,
  leftTitle: PropTypes.any,
  rightTitle: PropTypes.any,
  title: PropTypes.any,
  extraClass: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string,
  onChange: PropTypes.func,

  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
  ]),
  readOnly: PropTypes.bool,
  disabled: PropTypes.bool,
};

export { OptionField as Component };

export default OptionField;
