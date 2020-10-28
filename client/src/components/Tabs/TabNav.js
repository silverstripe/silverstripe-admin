import React from 'react';
import { Nav } from 'reactstrap';
import PropTypes from 'prop-types';
import Tab from './Tab';

/**
 * Builds the tabset navigation links, will hide the links if there is only one child
 * @param {string} currentTab
 * @param {JSX.Element} children
 * @param {function} onToggle
 * @returns {JSX.Element|null}
 */
function TabNav({ currentTab, children, onToggle }) {
  const tabs = React.Children.map(children, ({ props }) => (
    <Tab
      {...props}
      onToggle={() => currentTab !== props.name && onToggle(props.name)}
      active={currentTab === props.name}
    />
  ));

  return tabs && tabs.length > 1 ? <Nav tabs role="tablist">{tabs}</Nav> : null;
}

TabNav.propTypes = {
  currentTab: PropTypes.string,
  onToggle: PropTypes.func.isRequired
};

export default TabNav;
