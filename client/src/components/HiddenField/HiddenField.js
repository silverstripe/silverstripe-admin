import React from 'react';
import { Input } from 'reactstrap';
import classnames from 'classnames';
import PropTypes from 'prop-types';

/**
 * Fetches the properties for the field
 *
 * @returns {object} properties
 */
const getInputProps = (props) => ({
  className: classnames(props.className, props.extraClass),
  id: props.id,
  name: props.name,
  type: 'hidden',
  value: props.value || '',
});

const HiddenField = (_props) => {
  const defaultProps = {
    className: '',
    extraClass: '',
    value: '',
  };
  const props = {
    ...defaultProps,
    ..._props,
  };

  return (
    <Input {...getInputProps(props)} />
  );
};

HiddenField.propTypes = {
  className: PropTypes.string,
  id: PropTypes.string,
  extraClass: PropTypes.string,
  name: PropTypes.string.isRequired,
  value: PropTypes.any,
};

export default HiddenField;
