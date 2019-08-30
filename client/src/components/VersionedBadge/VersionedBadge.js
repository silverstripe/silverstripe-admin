import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import Badge from 'components/Badge/Badge';
import i18n from 'i18n';

/**
 * List of valid versioned statuses for a Badge
 * @type {string[]}
 */
export const statuses = [
  'draft',
  'modified',
  'live',
  'archived',
];

/**
 * Capitalise the first letter
 * @param {string} str
 * @returns {string}
 */
const toTitleCase = (str) => str.replace(/^\w/, c => c.toUpperCase());

const VersionedBadge = ({ status, className }) => {
  const props = {
    className: classnames(className, 'versioned-badge', `versioned-badge--${status}`),
    message: i18n._t(`ADMIN.${status.toUpperCase()}`, toTitleCase(status)),
    status: 'default',
  };

  return (
    <Badge {...props} />
  );
};

VersionedBadge.propTypes = {
  status: PropTypes.oneOf(statuses).isRequired,
  className: PropTypes.string,
};

export default VersionedBadge;
