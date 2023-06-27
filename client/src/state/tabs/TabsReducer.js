import deepFreeze from 'deep-freeze-strict';
import getFieldReducer from 'lib/reduxFieldReducer';
import ACTION_TYPES from './TabsActionTypes';

/**
 * Default state
 */
const initialState = deepFreeze({ fields: {} });

/**
 * Default object for an empty field state
 */
const initialFieldState = deepFreeze({
  activeTab: null
});

export default function tabsReducer(state = initialState, action = null) {
  // Get field reducer
  const reduceField = getFieldReducer(state, action, initialFieldState);

  // Actions
  switch (action.type) {
    case ACTION_TYPES.TABS_ACTIVATE_TAB: {
      return reduceField(() => ({ activeTab: action.payload.tab }));
    }

    default:
      return state;
  }
}
