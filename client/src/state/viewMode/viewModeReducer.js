import ACTION_TYPES from './viewModeActionTypes';
import { SPLITMODE_BREAKPOINT as viewWideEnoughForSplitMode } from '../../lib/constants';

const initialState = {
  activeState: 'split',
  splitAvailable: true
};

function reducer(state = initialState, action) {
  switch (action.type) {
    case ACTION_TYPES.SELECT_EDIT: {
      return {
        ...state,
        activeState: 'edit'
      };
    }

    case ACTION_TYPES.SELECT_PREVIEW: {
      return {
        ...state,
        activeState: 'preview'
      };
    }

    case ACTION_TYPES.SELECT_SPLIT: {
      return {
        ...state,
        activeState: 'split'
      };
    }

    case ACTION_TYPES.SPLIT_AVAILABLE: {
      const splitAvailable = action.payload.panelWidth > viewWideEnoughForSplitMode;
      let activeState = state.activeState;

      if (activeState === 'split' && !splitAvailable) {
         activeState = 'edit';
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
