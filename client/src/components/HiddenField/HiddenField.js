import React, { Component } from 'react';
import { Input } from 'reactstrap';

class HiddenField extends Component {
  /**
   * Fetches the properties for the field
   *
   * @returns {object} properties
   */
  getInputProps() {
    return {
      className: `${this.props.className} ${this.props.extraClass}`,
      id: this.props.id,
      name: this.props.name,
      type: 'hidden',
      value: this.props.value,
    };
  }

  render() {
    return (
      <Input {...this.getInputProps()} />
    );
  }
}

HiddenField.propTypes = {
  id: React.PropTypes.string,
  extraClass: React.PropTypes.string,
  name: React.PropTypes.string.isRequired,
  value: React.PropTypes.any,
};

HiddenField.defaultProps = {
  className: '',
  extraClass: '',
  value: '',
};

export default HiddenField;
