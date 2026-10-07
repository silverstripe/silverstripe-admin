import React, { Component } from 'react';
import fieldHolder from 'components/FieldHolder/FieldHolder';
import { Input } from 'reactstrap';
import PropTypes from 'prop-types';

class LegacyHtmlReadonlyField extends Component {
  /**
   * Fetches the properties for the text field
   *
   * @returns {object} properties
   */
  getInputProps() {
    return {
      // The extraClass property is defined on both the holder and element
      // for legacy reasons (same behaviour as PHP rendering)
      className: `${this.props.className} ${this.props.extraClass}`,
      id: this.props.id,
      name: this.props.name,
    };
  }

  render() {
    return (
      <Input
        plaintext
        tag="p"
        dangerouslySetInnerHTML={{ __html: this.props.value }}
        {...this.getInputProps()}
      />
    );
  }
}

LegacyHtmlReadonlyField.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string.isRequired,
  extraClass: PropTypes.string,
  value: PropTypes.string,
};

LegacyHtmlReadonlyField.defaultProps = {
  // React considers "undefined" as an uncontrolled component.
  extraClass: '',
  className: '',
};

export { LegacyHtmlReadonlyField as Component };

export default fieldHolder(LegacyHtmlReadonlyField);
