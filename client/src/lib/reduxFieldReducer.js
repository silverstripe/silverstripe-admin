import deepFreeze from 'deep-freeze-strict';

/**
 * Helper method to generate a field reducer for redux state containing nested form fields.
 * Fields must be identified via a fieldId property which is used as a key for the nested state.
 *
 * @param {Object} state State containing a 'fields' property, which is an object containing all
 * nested states for individual form fields.
 * @param {Object} action
 * @param {Object} initialFieldState Default state for new field
 */
export default function getFieldReducer(state, action, initialFieldState = {}) {
  /**
   * Helper to assist with manipulating the current field.
   *
   * @param {function} fieldReducer - Callback which will take
   * the current field information, and must return back an object
   * which reflects any properties on that field that should be changed.
   * @return {Object} - Updated state (frozen)
   */
  return (fieldReducer) => {
    if (!action.payload.fieldId) {
      throw new Error('Invalid fieldId');
    }
    // Extract field field record, or prototype
    const fields = state.fields || {};
    const field = fields[action.payload.fieldId]
      ? state.fields[action.payload.fieldId]
      : initialFieldState;

    // Merge result back into state
    return deepFreeze(Object.assign({}, state, {
      fields: Object.assign({}, fields, {
        [action.payload.fieldId]: Object.assign({}, field, fieldReducer(field)),
      }),
    }));
  };
}
