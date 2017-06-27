import deepFreeze from 'deep-freeze-strict';
import ACTION_TYPES from './MobileMenuActionTypes';

const initialState = {
  isOpen: false,
};

function reducer(state = initialState, action) {
  switch (action.type) {
    case ACTION_TYPES.TOGGLE_MENU: {
      return deepFreeze({ ...state, isOpen: !state.isOpen });
    }

    case ACTION_TYPES.OPEN_MENU: {
      return deepFreeze({ ...state, isOpen: true });
    }

    case ACTION_TYPES.CLOSE_MENU: {
      return deepFreeze({ ...state, isOpen: false });
    }

    default: {
      return state;
    }
  }
}

export default reducer;

