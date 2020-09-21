/**
 * Basic toast information that should be provided when displaying a new toast.
 * @typedef {Object} BasicToastOption
 * @property {string} text Message to display
 * @property {boolean} [stay=false] If true, the toast will remain until dismiss by the user
 * @property {string} [type='notice'] Type of the toast. Should be one of
 *     'notice', 'success', 'warning', 'error'.
 * @property {string} [id] Unique identifier for the toast. Will be generated if not provided.
 */


/**
 * Full toast options after being enriched in the redux store. Only the component rendering
 * toast and the toast reducer need this.
 * @typedef {ToastOption} ToastOption
 * @property {boolean} dismissed Whether this toast is in the process of being dismissed.
 * @property {function} dismissCallback Callbackback to invoke to dismiss this toast.
 * @property {number} timeout Reference to a timeout that will call dismissCallback.
 *     Clearing this timeout will pause the toast dismissal.
 */

/**
 * Definition of the Toasts state stored in the redux store.
 * @typedef {Object} ToastState
 * @property {boolean} paused Whatever the toast container is currently paused.
 * @property {ToastOption[]} toasts List of current toast.
 */

