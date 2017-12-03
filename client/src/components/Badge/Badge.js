import React, { PropTypes } from 'react';
import classnames from 'classnames';

const Badge = ({ status, message, className }) => (
  <span className={classnames(className, `badge badge-${status} badge-pill`)}>
    {message}
  </span>
);

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

Badge.defaultProps = {
  status: 'default',
};

export default Badge;
