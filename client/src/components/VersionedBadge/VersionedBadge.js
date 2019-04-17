import React, { PureComponent } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import Badge from 'components/Badge/Badge';

/**
 * List of valid versioned statuses for a Badge
 * @type {string[]}
 */
export const statuses = [
  'draft',
  'modified',
  'live'
];

class VersionedBadge extends PureComponent {
  render() {
    const { status, className } = this.props;
    if (!status) {
      return null;
    }

    const compiledClassNames = classnames(
      className,
      'versioned-badge',
      `versioned-badge--${status}`,
    );

    const props = {
      ...this.props,
      className: compiledClassNames,
      status: 'default',
      inverted: false,
    };

    return (
      <Badge {...props} />
    );
  }
}

VersionedBadge.propTypes = {
  message: PropTypes.node,
  status: PropTypes.oneOf(statuses),
  className: PropTypes.string,
};

VersionedBadge.defaultProps = {
  status: 'default',
  className: '',
};

export default VersionedBadge;
