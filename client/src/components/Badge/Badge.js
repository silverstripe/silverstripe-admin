import React, { PropTypes } from 'react';

const Badge = ({ status, message, className }) => {
  if (!status) {
    return null;
  }
  return (
    <span className={`${className || ''} badge badge-${status} badge-pill`}>
      {message}
    </span>
  );
};

Badge.propTypes = {
  message: PropTypes.node,
  status: PropTypes.oneOf([
    'default',
    'info',
    'success',
    'warning',
    'danger',
    'primary',
    'secondary',
  ]),
  className: PropTypes.string,
};

export default Badge;
