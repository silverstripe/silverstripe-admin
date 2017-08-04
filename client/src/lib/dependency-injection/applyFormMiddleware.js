import Injector from '../Injector';
import getIn from 'redux-form/lib/structure/plain/getIn';
import setIn from 'redux-form/lib/structure/plain/setIn';
import { actionTypes } from 'redux-form';

const omittedActions = [
  actionTypes.REGISTER_FIELD,
  actionTypes.DESTROY,
];

const applyFormMiddleware = (reducer) => () => (state, action) => {
  const reducedState = reducer(state, action);
  const formName = action.meta && action.meta.form;

  if (!formName || omittedActions.includes(action.type)) {
    return reducedState;
  }

  const formSchemaMiddleware = Injector.form.getSchema(formName);
  if (!formSchemaMiddleware) {
    return reducedState;
  }

  const reduxFormState = getIn(reducedState.formState, formName);
  if (!reduxFormState) {
    return reducedState;
  }

  let newState = {
    ...reducedState,
  };

  const schemaEntries = Object.entries(reducedState.formSchemas)
    .filter(([, entry]) => entry.name === formName);

  if (!schemaEntries.length) {
    return reducedState;
  }

  schemaEntries.forEach(([schemaKey, formSchemaState]) => {
    const updates = formSchemaMiddleware(formSchemaState, reduxFormState);

    if (!updates.state || !Array.isArray(updates.state.fields)) {
      throw new Error(`
      One more calls to alterSchema did not return a properly formed schema state
      object. Check your calls to Injector.transform() which could affect '${schemaKey}'.
    `);
    }

    // only update the schema state, updating other schema properties would be dangerous
    newState = setIn(newState, `formSchemas.${schemaKey}.state`, updates.state);
  });

  return newState;
};

export default applyFormMiddleware;
