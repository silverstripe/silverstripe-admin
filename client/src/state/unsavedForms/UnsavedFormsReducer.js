import deepFreeze from 'deep-freeze-strict';
import { actionTypes as reduxFormActionTypes } from 'redux-form';
import Config from 'lib/Config';

/**
 * State is (unsaved) a form schema to pathname map
 */
function unsavedFormsReducer(state = {}, action) {
  const baseUrlRegex = new RegExp(`^${Config.get('baseUrl')}`);
  // @todo Find a better way to get pathname
  const pathname = window.location.pathname.replace(baseUrlRegex, '');
  const form = action.meta && action.meta && action.meta.form;
  const unsaveds = Object.assign({}, state);

  switch (action.type) {
    case reduxFormActionTypes.CHANGE: {
      unsaveds[form] = pathname;
      return deepFreeze(Object.assign({}, unsaveds));
    }

    case reduxFormActionTypes.START_SUBMIT: {
      delete unsaveds[form];
      return deepFreeze(Object.assign({}, unsaveds));
    }

    case reduxFormActionTypes.DESTROY: {
      // In the case of DESTROY, `action.meta.form` is an array instead of string
      form.forEach((f) => {
        delete unsaveds[f];
      });
      return deepFreeze(Object.assign({}, unsaveds));
    }

    default:
      return deepFreeze(Object.assign({}, state));
  }
}

export default unsavedFormsReducer;

