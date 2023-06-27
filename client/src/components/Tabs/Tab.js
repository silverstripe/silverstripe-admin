import React from 'react';
import { NavItem, NavLink } from 'reactstrap';
import classnames from 'classnames';
import PropTypes from 'prop-types';

/**
 * Render an individual link for the tabset.
 * @param {string} title
 * @param {boolean} disabled
 * @param {boolean} active
 * @param {string} tabClassName
 * @param {function} onToggle
 * @returns {JSX.Element|null}
 * @constructor
 */
function Tab({ title, disabled, active, tabClassName, onToggle }) {
  if (!title) {
    return null;
  }
  const classNames = classnames(tabClassName, { active });
  return (
    <NavItem>
      <NavLink onClick={onToggle} disabled={disabled} className={classNames}>
        {title}
      </NavLink>
    </NavItem>
  );
}

Tab.propTypes = {
  title: PropTypes.string,
  disabled: PropTypes.bool,
  active: PropTypes.bool,
  tabClassName: PropTypes.string,
  onToggle: PropTypes.func.isRequired,
};

Tab.defaultProps = {
  disabled: false,
  active: false
};

export default Tab;
