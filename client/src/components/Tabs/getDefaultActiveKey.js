import { Children } from 'react';

/**
 * Determines a default tab to be opened and validates the given default tab.
 * Replaces the given default tab if it is invalid with a valid tab.
 *
 * @param defaultActiveKey
 * @param children
 * @returns {string}
 */
export default function getDefaultActiveKey(defaultActiveKey, children) {
  const tabs = Children.toArray(children);

  if (!tabs || tabs.length === 0) {
    // There's no tab, so none of them are active
    return '';
  }

  let activeTab;

  if (typeof defaultActiveKey === 'string') {
    // Let's find the tab matching our default key
    activeTab = tabs.find(({ props: { name } }) => name === defaultActiveKey);
  }

  if (!activeTab) {
    // The first tab is the default one
    activeTab = tabs[0];
  }

  return activeTab.props.name;
}
