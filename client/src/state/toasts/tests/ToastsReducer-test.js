/* global jest, describe, beforeEach, it, expect */

import reducer from '../ToastsReducer';
import { display, dismiss, info, error, success, warning, pause, resume } from '../ToastsActions';
import { STAY_TIME, FADEOUT_TIME } from '../ToastConstants';

jest.useFakeTimers();

let state;
const dispatch = (action) => {
  state = reducer(state, action);
};

describe('toastsReducer', () => {
  beforeEach(() => {
    state = {
      paused: false,
      toasts: []
    };
  });

  describe('display', () => {
    it('default', () => {
      const thunk = display({ text: 'A toast message' });
      thunk(dispatch);

      expect(state.toasts).toHaveLength(1);
      expect(state.toasts[0].id).toMatch(/^toast-.+$/);
      expect(state.toasts[0].type).toBe('notice');
      expect(state.toasts[0].text).toBe('A toast message');
      expect(state.toasts[0].stay).toBe(false);
      expect(state.toasts[0].dismissed).toBe(false);

      jest.advanceTimersByTime(STAY_TIME);
      expect(state.toasts).toHaveLength(1);
      expect(state.toasts[0].dismissed).toBe(true);

      jest.advanceTimersByTime(FADEOUT_TIME);
      expect(state.toasts).toHaveLength(0);
    });

    it('stay until dismiss', () => {
      const thunk = display({ text: 'A toast message', stay: true });
      thunk(dispatch);

      expect(state.toasts).toHaveLength(1);
      expect(state.toasts[0].id).toMatch(/^toast-.+$/);

      jest.advanceTimersByTime(STAY_TIME);
      expect(state.toasts).toHaveLength(1);
      expect(state.toasts[0].dismissed).toBe(false);

      jest.advanceTimersByTime(STAY_TIME);
      expect(state.toasts).toHaveLength(1);
      expect(state.toasts[0].dismissed).toBe(false);
    });

    it('provide explicit id', () => {
      const thunk = display({ text: 'A toast message', id: 'my-custom-key' });
      thunk(dispatch);

      expect(state.toasts).toHaveLength(1);
      expect(state.toasts[0].id).toBe('my-custom-key');
    });

    it('many toasts', () => {
      state = {
        paused: false,
        toasts: [{ id: 'preexisting', type: 'notice' }]
      };
      const thunk = display({ text: 'A toast message' });
      thunk(dispatch);

      expect(state.toasts).toHaveLength(2);
      expect(state.toasts[1].id).toMatch(/^toast-.+$/);
      expect(state.toasts[1].type).toBe('notice');
      expect(state.toasts[1].text).toBe('A toast message');
      expect(state.toasts[1].stay).toBe(false);
      expect(state.toasts[1].dismissed).toBe(false);

      jest.advanceTimersByTime(STAY_TIME);
      expect(state.toasts).toHaveLength(2);
      expect(state.toasts[1].dismissed).toBe(true);

      jest.advanceTimersByTime(FADEOUT_TIME);
      expect(state.toasts).toHaveLength(1);
    });
  });

  describe('convenience methods', () => {
    const expectedTypes = {
      info: { type: 'notice', stay: false },
      warning: { type: 'warning', stay: true },
      error: { type: 'error', stay: true },
      success: { type: 'success', stay: false },
    };

    [info, warning, error, success].forEach((fn) => {
      it(fn.name, () => {
        const thunk = fn(`${fn.name} message`);
        thunk(dispatch);

        expect(state.toasts).toHaveLength(1);
        expect(state.toasts[0].id).toMatch(/^toast-.+$/);
        expect(state.toasts[0].type).toBe(expectedTypes[fn.name].type);
        expect(state.toasts[0].text).toBe(`${fn.name} message`);
        expect(state.toasts[0].stay).toBe(expectedTypes[fn.name].stay);
        expect(state.toasts[0].dismissed).toBe(false);
      });
    });
  });

  describe('dismiss', () => {
    it('single', () => {
      state = {
        paused: false,
        toasts: [{ id: 'toDismiss', text: 'dimiss me', dismissed: false }]
      };
      const thunk = dismiss('toDismiss');
      thunk(dispatch);

      expect(state.toasts).toHaveLength(1);
      expect(state.toasts[0].id).toBe('toDismiss');
      expect(state.toasts[0].dismissed).toBe(true);

      jest.advanceTimersByTime(FADEOUT_TIME);
      expect(state.toasts).toHaveLength(0);
    });

    it('multiple', () => {
      state = {
        paused: false,
        toasts: [
          { id: 'first' },
          { id: 'toDismiss', text: 'dimiss me', dismissed: false },
          { id: 'last' },
        ]
      };
      const thunk = dismiss('toDismiss');
      thunk(dispatch);

      expect(state.toasts).toHaveLength(3);
      expect(state.toasts[1].id).toBe('toDismiss');
      expect(state.toasts[1].dismissed).toBe(true);

      jest.advanceTimersByTime(FADEOUT_TIME);
      expect(state.toasts).toHaveLength(2);
    });

    it('non-existant', () => {
      state = {
        paused: false,
        toasts: [
          { id: 'first' },
          { id: 'last' },
        ]
      };
      const thunk = dismiss('toDismiss');
      thunk(dispatch);

      expect(state.toasts).toHaveLength(2);

      jest.advanceTimersByTime(FADEOUT_TIME);
      expect(state.toasts).toHaveLength(2);
    });
  });

  describe('pause/resume', () => {
    it('single toast', () => {
      const thunk = display({ text: 'A toast message' });
      thunk(dispatch);
      expect(state.toasts).toHaveLength(1);

      dispatch(pause());
      expect(state.paused).toBe(true);

      jest.advanceTimersByTime(STAY_TIME + FADEOUT_TIME);
      expect(state.toasts).toHaveLength(1);

      dispatch(resume());
      expect(state.paused).toBe(false);
      jest.advanceTimersByTime(STAY_TIME + FADEOUT_TIME);
      expect(state.toasts).toHaveLength(0);
    });

    it('indefinite toast', () => {
      const thunk = display({ text: 'A toast message', stay: true });
      thunk(dispatch);
      expect(state.toasts).toHaveLength(1);

      dispatch(pause());

      jest.advanceTimersByTime(STAY_TIME + FADEOUT_TIME);
      expect(state.toasts).toHaveLength(1);

      dispatch(resume());
      jest.advanceTimersByTime(STAY_TIME + FADEOUT_TIME);
      expect(state.toasts).toHaveLength(1);
    });

    it('many toast', () => {
      display({ text: 'A toast message', stay: true })(dispatch);
      display({ text: 'A toast message' })(dispatch);
      jest.advanceTimersByTime(STAY_TIME / 2);
      display({ text: 'A toast message' })(dispatch);

      expect(state.toasts).toHaveLength(3);

      dispatch(pause());

      jest.advanceTimersByTime(STAY_TIME + FADEOUT_TIME);
      expect(state.toasts).toHaveLength(3);

      dispatch(resume());
      jest.advanceTimersByTime(STAY_TIME + FADEOUT_TIME);
      expect(state.toasts).toHaveLength(1);
    });

    it('add toast while paused', () => {
      dispatch(pause());
      expect(state.paused).toBe(true);
      expect(state.toasts).toHaveLength(0);

      const thunk = display({ text: 'A toast message' });
      thunk(dispatch);
      expect(state.toasts).toHaveLength(1);
      expect(state.toasts[0].dismissed).toBe(false);

      jest.advanceTimersByTime(STAY_TIME + FADEOUT_TIME);
      expect(state.toasts).toHaveLength(1);

      dispatch(resume());
      expect(state.paused).toBe(false);
      jest.advanceTimersByTime(STAY_TIME + FADEOUT_TIME);
      expect(state.toasts).toHaveLength(0);
    });
  });
});
