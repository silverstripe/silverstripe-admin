import React, { useContext, useEffect, useState } from 'react';

/**
 * Context defining basic information about the parent tab
 * @type {React.Context<boolean|Object>}
 */
export const TabContext = React.createContext(false);

/**
 * Hook for retriving the parent tab context.
 * @returns {boolean|Object}
 */
function useTabContext() {
  return useContext(TabContext);
}

/**
 * Inject a tabContext prop into the provided component.
 * @param Component
 */
export function injectTabContext(Component) {
  return (props) => {
    const tabContext = useTabContext();
    return <Component {...props} tabContext={tabContext} />;
  };
}

/**
 * Hook for triggering a callback the first time the parent tab is shown.
 * @param callback
 */
export function useTabFirstShow(callback) {
  const tabContext = useTabContext();

  // If we're not in a tab, fire the callback right away
  const readyToShow = !tabContext || tabContext.isOnActiveTab;
  const [shownOnce, setShownOnce] = useState(false);
  useEffect(() => {
    if (!readyToShow) {
      return;
    }
    // By setting shownOnce to true, we ensure our callback will only be fired once
    setShownOnce(true);
    callback(tabContext);
  }, [shownOnce || readyToShow]);
}

export default useTabContext;
