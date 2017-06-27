import deepFreeze from 'deep-freeze-strict';
import ACTION_TYPES from './MobileMenuActionTypes';

const initialState = deepFreeze({});

function reducer(state = initialState, action) {
  const isOpen = !!(state && state.isOpen);

  switch (action.type) {
    case ACTION_TYPES.TOGGLE_MENU:
      return deepFreeze({ ...state, isOpen: !isOpen });

    case ACTION_TYPES.OPEN_MENU:
      return deepFreeze({ ...state, isOpen: true });

    case ACTION_TYPES.CLOSE_MENU:
      return deepFreeze({ ...state, isOpen: false });

    default:
      return state;

  }
}

export default reducer;

