import React, { useMemo, useEffect, useRef } from 'react';
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

  // Putting the ref on the <Fade> rather than the <TabPane> as there seems to be a bug
  // with reactstrap where TabPane where innerRef doesn't work as expected
  const fadeRef = useRef(null);

  // Set tabindex="0" on the tab content if there are no focusable elements inside it
  // See point 4 under notes on https://www.w3.org/WAI/ARIA/apg/patterns/tabs/
  useEffect(() => {
    if (!fadeRef.current) {
      return;
    }
    // This selector is duplicated in LeftAndMain.EditForm.js - keep in sync
    const cssSelector = [
      'a[href]',
      'button:not([disabled])',
      'input:not([disabled]):not([type="hidden"])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
      'summary',
      'iframe',
      'object',
    ].join(', ');
    if (fadeRef.current.querySelectorAll(cssSelector).length === 0) {
      // Note - setting tabindex on the Fade element's parentNode, which is the actual tab pane
      fadeRef.current.parentNode.setAttribute('tabindex', '0');
    }
  }, [fadeRef]);

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
        <Fade in={isOnActiveTab} innerRef={fadeRef}>
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
