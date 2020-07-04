import ACTION_TYPES from './ToastsActionTypes';
import { STAY_TIME } from './ToastConstants';

/**
 * @typedef {import('./BasicToastOption').ToastOption} ToastOption
 */

/**
 * @typedef {import('./ToastsTypes').ToastOption} ToastOption
 */

/**
 * @typedef {import('./ToastsTypes').ToastState} ToastOption
 */


/**
 * @type {ToastState}
 */
const initState = {
  paused: false,
  toasts: []
};

/**
 * Start a timeout to eventually dismiss a toast if the toast is not configured to stay
 * indefinitely.
 * @returns {undefined|number} Timeout reference if the toast is not indefinite
 */
const scheduleDismissal = ({ stay, dismissCallback }) => (
  stay ? undefined : setTimeout(dismissCallback, STAY_TIME)
);

/**
 * Pause all toasts and mark the main state as paused.
 * @param {ToastState} state
 * @returns {ToastState}
 */
const pause = (state) => ({
  paused: true,
  toasts: state.toasts.map(
    ({ timeout, ...toast }) => {
      if (timeout) { clearTimeout(timeout); }
      return toast;
    }
  )
});

/**
 * Resume all toasts not marked to self-dismissed and mark the main state as not paused.
 * @param {ToastState} state
 * @returns {ToastState}
 */
const resume = (state) => ({
  paused: false,
  toasts: state.toasts.map(
    (toast) => ({ timeout: scheduleDismissal(toast), ...toast })
  )
});


/**
 * Add the provided toast list to the list of toast.
 * @param {ToastState} state
 * @param {ToastOption[]} toastsList
 * @returns {ToastState}
 */
const updateToastList = (state, toastsList) => ({
  ...state,
  toasts: toastsList
});

/**
 * Add a toast to the list for display
 * @param {ToastState} state
 * @param {BasicToastOption} toast
 * @returns {ToastState}
 */
const appendToast = (state, toast) => updateToastList(
  state,
  [
    ...state.toasts,
    {
      ...toast,
      timeout: state.paused ? undefined : scheduleDismissal(toast),
      dismissed: false
    }
  ]
);

/**
 * @param {ToastState} state
 * @param {string} id
 * @returns {ToastState}
 */
const dissmissToast = (state, id) => updateToastList(
  state,
  state.toasts.map(
    toast => (toast.id === id ? { ...toast, dismissed: true } : toast)
  )
);

/**
 * @param {ToastState} state
 * @param {string} id
 * @returns {ToastState}
 */
const removeToast = (state, id) => updateToastList(
  state,
  state.toasts.filter((toast) => toast.id !== id)
);

/**
 * @param {ToastOption[]} state
 * @param {string} type
 * @param {Object} payload
 * @returns {ToastOption[]}
 */
function toastsReducer(state = initState, { type, payload }) {
  switch (type) {
    case ACTION_TYPES.DISPLAY:
      return appendToast(state, payload);

    case ACTION_TYPES.DISMISS:
      return dissmissToast(state, payload.id);

    case ACTION_TYPES.REMOVE:
      return removeToast(state, payload.id);

    case ACTION_TYPES.PAUSE:
      return pause(state);

    case ACTION_TYPES.RESUME:
      return resume(state);

    default:
      return state;
  }
}

export default toastsReducer;
