import React, { Component } from 'react';
import fieldHolder from 'components/FieldHolder/FieldHolder';
import { Input } from 'reactstrap';
import PropTypes from 'prop-types';

class TextField extends Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
  }

  /**
   * Fetches the properties for the text field
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
    };

    if (this.props.attributes && !Array.isArray(this.props.attributes)) {
      Object.assign(props, this.props.attributes);
    }

    if (this.isMultiline()) {
      Object.assign(props, {
        type: 'textarea',
        rows: this.props.data.rows,
        cols: this.props.data.columns,
      });
    } else {
      Object.assign(props, {
        type: this.props.type ? this.props.type : null,
      });
    }

    if (!this.props.readOnly) {
      Object.assign(props, {
        onChange: this.handleChange,
      });
    }

    return props;
  }

  /**
   * Determines whether this text field is a multi-line textarea or not
   *
   * @returns {boolean}
   */
  isMultiline() {
    return this.props.data && this.props.data.rows > 1;
  }

  /**
   * Handles changes to the text field's value.
   *
   * @param {Event} event
   */
  handleChange(event) {
    if (typeof this.props.onChange === 'function') {
      this.props.onChange(event, { id: this.props.id, value: event.target.value });
    }
  }

  render() {
    return <Input {...this.getInputProps()} />;
  }
}

TextField.propTypes = {
  extraClass: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  readOnly: PropTypes.bool,
  disabled: PropTypes.bool,
  placeholder: PropTypes.string,
  type: PropTypes.string,
  autoFocus: PropTypes.bool,
  attributes: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

TextField.defaultProps = {
  // React considers "undefined" as an uncontrolled component.
  value: '',
  extraClass: '',
  className: '',
  type: 'text',
  attributes: {},
};

export { TextField as Component };

export default fieldHolder(TextField);
