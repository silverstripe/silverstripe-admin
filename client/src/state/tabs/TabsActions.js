import ACTION_TYPES from './TabsActionTypes';

/**
 * Sets the active tab
 *
 * @param {String} fieldId ID for field
 * @param {String} name of the tab
 * @return {Object}
 */
export function activateTab(fieldId, tab) {
  return {
    type: ACTION_TYPES.TABS_ACTIVATE_TAB,
    payload: { fieldId, tab },
  };
}
