import ACTION_TYPES from './ToastsActionTypes';
import { FADEOUT_TIME } from './ToastConstants';
import { v4 as uuid } from 'uuid';

/**
 * @typedef {import('./ToastsTypes').BasicToastOption} BasicToastOption
 */

/**
 * @callback reduxThunk
 * @param {function} dispatch
 */

/**
 * @type BasicToastOption
 */
const defaultOptions = {
  text: '',
  stay: false,
  type: 'notice'
};

/**
 * Dismiss a toast notification based on its ID.
 * @param {string} id
 * @returns {reduxThunk}
 */
export function dismiss(id) {
  return (dispatch) => {
    dispatch({
      type: ACTION_TYPES.DISMISS,
      payload: { id }
    });

    setTimeout(
      () => dispatch({ type: ACTION_TYPES.REMOVE, payload: { id } }),
      FADEOUT_TIME
    );
  };
}

/**
 * Display a toast notification
 * @param {ToastOption} options
 * @returns {reduxThunk}
 */
export function display(options) {
  const id = `toast-${uuid()}`;

  return (dispatch) => {
    const dismissCallback = () => dismiss(id)(dispatch);
    const payload = { id, dismissCallback, ...defaultOptions, ...options };

    dispatch({ type: ACTION_TYPES.DISPLAY, payload });
  };
}

/**
 * Display a success toast
 * @param {string} text
 * @returns {reduxThunk}
 */
export function success(text) {
  return display({ text, type: 'success' });
}

/**
 * Display an error toast
 * @param {string} text
 * @returns {reduxThunk}
 */
export function error(text) {
  return display({ text, type: 'error', stay: true });
}

/**
 * Display a warning toast
 * @param {string} text
 * @returns {reduxThunk}
 */
export function warning(text) {
  return display({ text, type: 'warning', stay: true });
}

/**
 * Display an info toast
 * @param {string} text
 * @returns {reduxThunk}
 */
export function info(text) {
  return display({ text });
}

/**
 * Pause all toast notifications.
 */
export function pause() {
  return { type: ACTION_TYPES.PAUSE };
}

/**
 * Resume the toast notifications.
 */
export function resume() {
  return { type: ACTION_TYPES.RESUME };
}
