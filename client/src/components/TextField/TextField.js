import React, { Component } from 'react';
import fieldHolder from 'components/FieldHolder/FieldHolder';
import { FormControl } from 'react-bootstrap-ss';

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
      bsClass: this.props.bsClass,
      className: `${this.props.className} ${this.props.extraClass}`,
      id: this.props.id,
      name: this.props.name,
      disabled: this.props.disabled,
      readOnly: this.props.readOnly,
      value: this.props.value,
      placeholder: this.props.placeholder,
      autoFocus: this.props.autoFocus,
    };

    if (this.props.attributes && !Array.isArray(this.props.attributes)) {
      Object.assign(props, this.props.attributes);
    }

    if (this.isMultiline()) {
      Object.assign(props, {
        componentClass: 'textarea',
        rows: this.props.data.rows,
        cols: this.props.data.columns,
      });
    } else {
      Object.assign(props, {
        componentClass: 'input',
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
    return <FormControl {...this.getInputProps()} />;
  }
}

TextField.propTypes = {
  extraClass: React.PropTypes.string,
  id: React.PropTypes.string,
  name: React.PropTypes.string.isRequired,
  onChange: React.PropTypes.func,
  value: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number]),
  readOnly: React.PropTypes.bool,
  disabled: React.PropTypes.bool,
  placeholder: React.PropTypes.string,
  type: React.PropTypes.string,
  autoFocus: React.PropTypes.bool,
  attributes: React.PropTypes.oneOfType([React.PropTypes.object, React.PropTypes.array]),
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
