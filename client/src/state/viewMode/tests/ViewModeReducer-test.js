import viewModeReducer from '../ViewModeReducer';
import ACTION_TYPES from '../ViewModeActionTypes';
import { VIEW_MODE_STATES } from '../ViewModeStates';

describe('viewModeReducer', () => {
  const initialState = { };

  describe(ACTION_TYPES.SELECT_EDIT, () => {
    it('should set to edit mode and lock state', () => {
      const nextState = viewModeReducer(initialState, {
        type: ACTION_TYPES.SELECT_EDIT,
      });

      expect(nextState.activeState).toBe(VIEW_MODE_STATES.EDIT);
      expect(nextState.lockState).toBe(true);
    });
  });

  describe(ACTION_TYPES.SELECT_PREVIEW, () => {
    it('should set to preview mode and lock state', () => {
      const nextState = viewModeReducer(initialState, {
        type: ACTION_TYPES.SELECT_PREVIEW,
      });

      expect(nextState.activeState).toBe(VIEW_MODE_STATES.PREVIEW);
      expect(nextState.lockState).toBe(true);
    });
  });

  describe(ACTION_TYPES.SELECT_SPLIT, () => {
    it('should set to preview mode and unlock state', () => {
      const nextState = viewModeReducer(initialState, {
        type: ACTION_TYPES.SELECT_SPLIT,
      });

      expect(nextState.activeState).toBe(VIEW_MODE_STATES.SPLIT);
      expect(nextState.lockState).toBe(false);
    });
  });

  describe(ACTION_TYPES.SPLIT_AVAILABLE, () => {
    it('determines if split mode is available for large screens', () => {
      const nextState = viewModeReducer(initialState, {
        type: ACTION_TYPES.SPLIT_AVAILABLE,
        payload: {
          panelWidth: 1200,
        }
      });

      expect(nextState.splitAvailable).toBe(true);
    });

    it('determines if split mode is available for small screens', () => {
      const nextState = viewModeReducer(initialState, {
        type: ACTION_TYPES.SPLIT_AVAILABLE,
        payload: {
          panelWidth: 400,
        }
      });

      expect(nextState.splitAvailable).toBe(false);
    });

    it('switches to edit mode on small screens from split mode when state is unlocked', () => {
      const nextState = viewModeReducer({
        activeState: VIEW_MODE_STATES.SPLIT,
        lockState: false,
      }, {
        type: ACTION_TYPES.SPLIT_AVAILABLE,
        payload: {
          panelWidth: 400,
        }
      });

      expect(nextState.splitAvailable).toBe(false);
      expect(nextState.activeState).toBe(VIEW_MODE_STATES.EDIT);
    });

    it('switches to split mode on large screens from edit mode when state is unlocked', () => {
      const nextState = viewModeReducer({
        activeState: VIEW_MODE_STATES.EDIT,
        lockState: false,
      }, {
        type: ACTION_TYPES.SPLIT_AVAILABLE,
        payload: {
          panelWidth: 1200,
        }
      });

      expect(nextState.splitAvailable).toBe(true);
      expect(nextState.activeState).toBe(VIEW_MODE_STATES.SPLIT);
    });

    it('does not change activeState when in edit mode on large screens and state is locked', () => {
      const nextState = viewModeReducer({
        activeState: VIEW_MODE_STATES.EDIT,
        lockState: true,
      }, {
        type: ACTION_TYPES.SPLIT_AVAILABLE,
        payload: {
          panelWidth: 1200,
        }
      });

      expect(nextState.splitAvailable).toBe(true);
      expect(nextState.activeState).toBe(VIEW_MODE_STATES.EDIT);
    });

    it('does not change activeState when in preview mode on large screens and state is unlocked', () => {
      const nextState = viewModeReducer({
        activeState: VIEW_MODE_STATES.PREVIEW,
        lockState: false,
      }, {
        type: ACTION_TYPES.SPLIT_AVAILABLE,
        payload: {
          panelWidth: 1200,
        }
      });

      expect(nextState.splitAvailable).toBe(true);
      expect(nextState.activeState).toBe(VIEW_MODE_STATES.PREVIEW);
    });

    it('does not change activeState when in preview mode on small screens and state is unlocked', () => {
      const nextState = viewModeReducer({
        activeState: VIEW_MODE_STATES.PREVIEW,
        lockState: false,
      }, {
        type: ACTION_TYPES.SPLIT_AVAILABLE,
        payload: {
          panelWidth: 400,
        }
      });

      expect(nextState.splitAvailable).toBe(false);
      expect(nextState.activeState).toBe(VIEW_MODE_STATES.PREVIEW);
    });
  });
});
