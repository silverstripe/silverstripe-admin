import ACTION_TYPES from './UnsavedFormsActionTypes';

export function addFormChanged(form) {
  return {
    type: ACTION_TYPES.ADD_FORM_CHANGED,
    meta: { form },
  };
}

export function removeFormChanged(form) {
  return {
    type: ACTION_TYPES.REMOVE_FORM_CHANGED,
    meta: { form },
  };
}
