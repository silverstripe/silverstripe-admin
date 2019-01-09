import React, { PureComponent } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

/**
 * List of valid status for a Badge
 * @type {string[]}
 */
export const statuses = [
  'default',
  'info',
  'success',
  'warning',
  'danger',
  'primary',
  'secondary',
];

class Badge extends PureComponent {
  render() {
    const { status, inverted, className, message } = this.props;
    if (!status) {
      return null;
    }

    const invertedClass = inverted ? `badge-${status}--inverted` : '';

    const compiledClassNames = classnames(
      className,
      'badge',
      `badge-${status}`,
      invertedClass,
    );
    return (
      <span className={compiledClassNames}>
        {message}
      </span>
    );
  }
}

Badge.propTypes = {
  message: PropTypes.node,
  status: PropTypes.oneOf(statuses),
  className: PropTypes.string,
  inverted: PropTypes.bool,
};

Badge.defaultProps = {
  status: 'default',
  className: 'badge-pill',
  inverted: false,
};

export default Badge;
