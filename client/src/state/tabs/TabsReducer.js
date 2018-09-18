import ACTION_TYPES from './TabsActionTypes';
import deepFreeze from 'deep-freeze-strict';

export default function tabsReducer(state = {}, action = null) {
  switch (action.type) {
    case ACTION_TYPES.SET_ACTIVE_TAB: {
      return deepFreeze({
        ...state,
        activeTab: action.payload.activeTab,
      });
    }

    default:
      return state;
  }
}
