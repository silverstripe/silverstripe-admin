import React, { Component } from 'react';
import { Input } from 'reactstrap';
import classnames from 'classnames';
import PropTypes from 'prop-types';

class HiddenField extends Component {
  /**
   * Fetches the properties for the field
   *
   * @returns {object} properties
   */
  getInputProps() {
    return {
      className: classnames(this.props.className, this.props.extraClass),
      id: this.props.id,
      name: this.props.name,
      type: 'hidden',
      value: this.props.value || '',
    };
  }

  render() {
    return (
      <Input {...this.getInputProps()} />
    );
  }
}

HiddenField.propTypes = {
  id: PropTypes.string,
  extraClass: PropTypes.string,
  name: PropTypes.string.isRequired,
  value: PropTypes.any,
};

HiddenField.defaultProps = {
  className: '',
  extraClass: '',
  value: '',
};

export default HiddenField;
