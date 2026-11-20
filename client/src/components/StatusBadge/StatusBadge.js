import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

export const STATUSES = [
  'archived',
  'draft',
  'modified',
];

const StatusBadge = ({ status, text }) => (
  <span
    className={classnames('status-badge', status && `status-badge--${status}`)}
  >
    {text}
  </span>
);

StatusBadge.propTypes = {
  status: PropTypes.oneOf(STATUSES),
  text: PropTypes.node.isRequired,
};

export default StatusBadge;
