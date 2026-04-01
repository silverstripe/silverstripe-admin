import React, { Component } from 'react';
import castStringToElement from 'lib/castStringToElement';
import PropTypes from 'prop-types';

class CompositeField extends Component {
  /**
   * Builds the legend for a fieldset if it is defined
   *
   * @returns {Component}
   */
  getLegend() {
    if (this.props.data.tag === 'fieldset' && this.props.data.legend) {
      return castStringToElement(
        'legend',
        this.props.data.legend
      );
    }
    return null;
  }

  getClassName() {
    return `${this.props.className} ${this.props.extraClass}`;
  }

  render() {
    const legend = this.getLegend();
    const Tag = this.props.data.tag || 'div';
    const className = this.getClassName();

    return (
      <Tag className={className}>
        {legend}
        {this.props.children}
      </Tag>
    );
  }
}

CompositeField.propTypes = {
  data: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.shape({
      tag: PropTypes.string,
      legend: PropTypes.string,
    }),
  ]),
  extraClass: PropTypes.string,
};

CompositeField.defaultProps = {
  className: '',
  extraClass: '',
};

export { CompositeField as Component };

export default CompositeField;
