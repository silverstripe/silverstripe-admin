import ACTION_TYPES from './ViewModeActionTypes';
import { SPLITMODE_BREAKPOINT as viewWideEnoughForSplitMode } from '../../lib/constants';
import { VIEW_MODE_STATES } from './ViewModeStates';

const initialState = {
  activeState: VIEW_MODE_STATES.SPLIT,
  splitAvailable: true
};

function reducer(state = initialState, action) {
  switch (action.type) {
    case ACTION_TYPES.SELECT_EDIT: {
      return {
        ...state,
        activeState: VIEW_MODE_STATES.EDIT,
      };
    }

    case ACTION_TYPES.SELECT_PREVIEW: {
      return {
        ...state,
        activeState: VIEW_MODE_STATES.PREVIEW,
      };
    }

    case ACTION_TYPES.SELECT_SPLIT: {
      return {
        ...state,
        activeState: VIEW_MODE_STATES.SPLIT,
      };
    }

    case ACTION_TYPES.SPLIT_AVAILABLE: {
      const splitAvailable = action.payload.panelWidth > viewWideEnoughForSplitMode;
      let activeState = state.activeState;

      if (activeState === VIEW_MODE_STATES.SPLIT && !splitAvailable) {
         activeState = VIEW_MODE_STATES.EDIT;
      }

      return {
        ...state,
        splitAvailable,
        activeState,
      };
    }

    default: {
      return state;
    }
  }
}

export default reducer;
