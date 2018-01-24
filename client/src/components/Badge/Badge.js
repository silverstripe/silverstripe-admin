import React, { PureComponent, PropTypes } from 'react';

class Badge extends PureComponent {
  render() {
    if (!this.props.status) {
      return null;
    }

    return (
      <span className={`${this.props.className || ''} badge badge-${this.props.status} badge-pill`}>
        {this.props.message}
      </span>
    );
  }
}

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
