import deepFreeze from 'deep-freeze-strict';
import ACTION_TYPES from './MobileMenuActionTypes';

const initialState = deepFreeze({});

function reducer(state = initialState, action) {
  const isOpen = !!(state && state.isOpen);

  switch (action.type) {
    case ACTION_TYPES.TOGGLE_MENU:
      return deepFreeze(Object.assign({}, state, { isOpen: !isOpen }));

    default:
      return state;

  }
}

export default reducer;

