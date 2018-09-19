import ACTION_TYPES from './TabsActionTypes';

/**
 * @param activeTab
 * @returns {object}
 */
export function setActiveTab(activeTab) {
  return {
    type: ACTION_TYPES.SET_ACTIVE_TAB,
    payload: {
      activeTab
    },
  };
}
