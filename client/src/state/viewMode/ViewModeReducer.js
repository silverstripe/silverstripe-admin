import ACTION_TYPES from './ViewModeActionTypes';
import { SPLITMODE_BREAKPOINT as viewWideEnoughForSplitMode } from '../../lib/constants';
import { VIEW_MODE_STATES } from './ViewModeStates';

const initialState = {
  activeState: VIEW_MODE_STATES.SPLIT,
  splitAvailable: true,
  lockState: false,
};

function reducer(state = initialState, action) {
  switch (action.type) {
    case ACTION_TYPES.SELECT_EDIT: {
      return {
        ...state,
        activeState: VIEW_MODE_STATES.EDIT,
        lockState: true,
      };
    }

    case ACTION_TYPES.SELECT_PREVIEW: {
      return {
        ...state,
        activeState: VIEW_MODE_STATES.PREVIEW,
        lockState: true,
      };
    }

    case ACTION_TYPES.SELECT_SPLIT: {
      return {
        ...state,
        activeState: VIEW_MODE_STATES.SPLIT,
        lockState: false,
      };
    }

    case ACTION_TYPES.SPLIT_AVAILABLE: {
      const splitAvailable = action.payload.panelWidth > viewWideEnoughForSplitMode;
      let activeState = state.activeState;

      if (!state.lockState && activeState === VIEW_MODE_STATES.SPLIT && !splitAvailable) {
        // Resizing into a small viewport should automatically disable split view
        activeState = VIEW_MODE_STATES.EDIT;
      } else if (!state.lockState && activeState === VIEW_MODE_STATES.EDIT && splitAvailable) {
        // Resizing away from small viewports should automatically re-enable split view
        activeState = VIEW_MODE_STATES.SPLIT;
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
