import React, { useMemo } from 'react';
import { TabPane, Fade } from 'reactstrap';
import PropTypes from 'prop-types';
import useTabContext, { TabContext } from 'hooks/useTabContext';
import classnames from 'classnames';

/**
 * Wraps the content of a tab.
 * @param {string} name
 * @param {string?} className
 * @param {string?} extraClass
 * @param {boolean?} disabled
 * @param {JSX.Element} children
 * @returns {JSX.Element}
 */
function TabItem({ name, className, extraClass, disabled, children }) {
  const { activeTab, isOnActiveTab } = useTabContext();
  const currentTab = name;
  const nextTabContext = useMemo(() => (
    {
      activeTab,
      currentTab,
      // a tab embedded inside another tab can only be active if it's parent is also active
      isOnActiveTab: isOnActiveTab !== false && activeTab === name
    }),
  [activeTab, currentTab, isOnActiveTab]
  );
  return (
    <TabContext.Provider value={nextTabContext}>
      <TabPane tabId={name} className={classnames(className, extraClass)} disabled={disabled}>
        <Fade in={isOnActiveTab}>
          {children}
        </Fade>
      </TabPane>
    </TabContext.Provider>
  );
}

TabItem.propTypes = {
  name: PropTypes.string.isRequired,
  extraClass: PropTypes.string,
  className: PropTypes.string,
  disabled: PropTypes.bool,
};

export default TabItem;
