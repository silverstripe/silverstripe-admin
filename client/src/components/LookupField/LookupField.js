import React, { Component } from 'react';
import { Input } from 'reactstrap';
import fieldHolder from 'components/FieldHolder/FieldHolder';
import i18n from 'i18n';
import PropTypes from 'prop-types';

class LookupField extends Component {
  constructor(props) {
    super(props);

    this.getValueCSV = this.getValueCSV.bind(this);
  }

  /**
   * Gets the array of values possible, converts to CSV string.
   *
   * @returns {string} csv
   */
  getValueCSV() {
    const values = this.props.value;

    if (!Array.isArray(values) &&
      (values || typeof values === 'string' || typeof values === 'number')) {
      const item = this.props.source.find((next) => next.value === values);
      if (item) {
        return item.title;
      }
      return '';
    }

    if (!values || !values.length) {
      return '';
    }
    return values
      .map((value) => {
        const item = this.props.source.find((next) => next.value === value);
        return item && item.title;
      })
      .filter((value) => `${value}`.length)
      .join(', ');
  }

  /**
   * Fetches properties for an the field
   *
   * @returns {object} properties
   */
  getFieldProps() {
    return {
      id: this.props.id,
      name: this.props.name,
      className: `${this.props.className} ${this.props.extraClass}`,
    };
  }

  render() {
    if (!this.props.source) {
      return null;
    }
    const none = `('${i18n._t('Admin.NONE', 'None')}')`;
    const value = this.getValueCSV() || none;

    return <Input plaintext {...this.getFieldProps()} tag="p">{value}</Input>;
  }
}

LookupField.propTypes = {
  extraClass: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string.isRequired,
  source: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    title: PropTypes.any,
    disabled: PropTypes.bool,
  })),
  value: PropTypes.any,
};

LookupField.defaultProps = {
  // React considers "undefined" as an uncontrolled component.
  extraClass: '',
  className: '',
  value: [],
};

export { LookupField as Component };

export default fieldHolder(LookupField);
