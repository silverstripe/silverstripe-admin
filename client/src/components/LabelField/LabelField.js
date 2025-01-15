import React from 'react';
import PropTypes from 'prop-types';

const LabelField = ({ id, className, title, extraClass, data }) => {
  const htmlFor = data && data.target;
  const classes = `form-label ${className} ${extraClass}`;

  return (
    <label id={id} className={classes} htmlFor={htmlFor}>{title}</label>
  );
};

LabelField.propTypes = {
  id: PropTypes.number,
  className: PropTypes.string,
  extraClass: PropTypes.string,
  title: PropTypes.node,
  data: PropTypes.shape({
    target: PropTypes.string,
  }),
};

LabelField.defaultProps = {
  className: '',
  extraClass: '',
};

export default LabelField;
