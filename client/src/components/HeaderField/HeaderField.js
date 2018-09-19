import React, { Component } from 'react';
import PropTypes from 'prop-types';

class HeaderField extends Component {
  /**
   * Fetches the properties for the field
   *
   * @returns {object} properties
   */
  getInputProps() {
    return {
      className: `${this.props.className} ${this.props.extraClass}`,
      id: this.props.id,
    };
  }

  render() {
    const Heading = `h${this.props.data.headingLevel || 3}`;

    return (
      <div className="field">
        <Heading {...this.getInputProps()} >{this.props.data.title}</Heading>
      </div>
    );
  }
}

HeaderField.propTypes = {
  extraClass: PropTypes.string,
  id: PropTypes.string,
  data: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.shape({
      headingLevel: PropTypes.number,
      title: PropTypes.string,
    }),
  ]).isRequired,
};

HeaderField.defaultProps = {
  className: '',
  extraClass: '',
};

export default HeaderField;
