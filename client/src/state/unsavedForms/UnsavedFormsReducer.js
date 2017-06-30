import deepFreeze from 'deep-freeze-strict';
import { actionTypes as reduxFormActionTypes } from 'redux-form';
import ACTION_TYPES from './UnsavedFormsActionTypes';

/**
 * State is (unsaved) a form schema to pathname map
 */
function unsavedFormsReducer(state = [], action) {
  const formName = action.meta && action.meta.form;

  switch (action.type) {
    case ACTION_TYPES.ADD_FORM_CHANGED:
    case reduxFormActionTypes.CHANGE: {
      return deepFreeze([
        ...state.filter(form => form.name !== formName),
        { name: formName },
      ]);
    }

    case ACTION_TYPES.REMOVE_FORM_CHANGED:
    case reduxFormActionTypes.STOP_SUBMIT: {
      return deepFreeze([
        ...state.filter(form => form.name !== formName),
      ]);
    }

    case reduxFormActionTypes.DESTROY: {
      // In the case of DESTROY, `action.meta.form` is an array instead of string
      return deepFreeze([
        ...state.filter(form => !formName.includes(form.name)),
      ]);
    }

    default: {
      return state;
    }
  }
}

export default unsavedFormsReducer;

