import React, { PropTypes } from 'react';

const LabelField = (
  {
    id,
    className,
    title,
    extraClass,
  }
) => {
  const props = {
    id,
    className: `${className} ${extraClass}`,
  };

  return (
    <label {...props}>{title}</label>
  );
};

LabelField.propTypes = {
  id: PropTypes.number,
  className: PropTypes.string,
  extraClass: PropTypes.string,
  title: PropTypes.node,
};

LabelField.defaultProps = {
  className: '',
  extraClass: '',
};

export default LabelField;
