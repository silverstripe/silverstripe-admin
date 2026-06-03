import React from 'react';
import { Input } from 'reactstrap';
import fieldHolder from 'components/FieldHolder/FieldHolder';
import i18n from 'i18n';
import PropTypes from 'prop-types';

const LookupField = (_props) => {
  const defaultProps = {
    // React considers "undefined" as an uncontrolled component.
    extraClass: '',
    className: '',
    value: [],
  };
  const props = {
    ...defaultProps,
    ..._props,
  };

  /**
   * Gets the array of values possible, converts to CSV string.
   *
   * @returns {string} csv
   */
  const getValueCSV = () => {
    const values = props.value;

    if (!Array.isArray(values) &&
      (values || typeof values === 'string' || typeof values === 'number')) {
      const item = props.source.find((next) => next.value === values);
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
        const item = props.source.find((next) => next.value === value);
        return item && item.title;
      })
      .filter((value) => `${value}`.length)
      .join(', ');
  };

  /**
   * Fetches properties for an the field
   *
   * @returns {object} properties
   */
  const getFieldProps = () => ({
    id: props.id,
    name: props.name,
    className: `${props.className} ${props.extraClass}`,
  });

  if (!props.source) {
    return null;
  }
  const none = `('${i18n._t('Admin.NONE', 'None')}')`;
  const value = getValueCSV() || none;
  return <Input plaintext {...getFieldProps()} tag="p">{value}</Input>;
};

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

export { LookupField as Component };

export default fieldHolder(LookupField);
