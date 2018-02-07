import React, { PureComponent, PropTypes } from 'react';
import classnames from 'classnames';

class Badge extends PureComponent {
  render() {
    if (!this.props.status) {
      return null;
    }
    const className = classnames(
      this.props.className,
      `badge badge-${this.props.status} badge-pill`
    );
    return (
      <span className={className}>
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

Badge.defaultProps = {
  status: 'default',
};

export default Badge;
