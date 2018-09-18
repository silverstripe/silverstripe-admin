import React, { Component } from 'react';
import PropTypes from 'prop-types';

class LiteralField extends Component {
  /**
   * Sets the content into a dangerouslySetInnerHTML object
   *
   * @returns {object} innerHtml
   */
  getContent() {
    return { __html: this.props.value };
  }

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
      <div
        {...this.getInputProps()}
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={this.getContent()}
      />
    );
  }
}

LiteralField.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string.isRequired,
  extraClass: PropTypes.string,
  value: PropTypes.string,
};

LiteralField.defaultProps = {
  // React considers "undefined" as an uncontrolled component.
  extraClass: '',
  className: '',
};

export default LiteralField;
