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
  if (!action.meta || !action.meta.form || omittedActions.includes(action.type)) {
    return reducedState;
  }

  const formName = action.meta.form;
  const formSchemaMiddleware = Injector.form.getSchema(formName);
  if (!formSchemaMiddleware) {
    return reducedState;
  }

  const formState = getIn(reducedState.formState, formName);
  if (!formState) {
    return reducedState;
  }

  const schemaEntry = Object.entries(reducedState.formSchemas)
    .find(([, entry]) => entry.name === formName);

  if (!schemaEntry) {
    return reducedState;
  }

  const [schemaKey, schema] = schemaEntry;

  if (!schemaKey) {
    return reducedState;
  }

  const schemaState = schema.state;
  let newState = {
    ...reducedState,
  };
  const updates = formSchemaMiddleware(formState.values, schemaState);
  if (!Array.isArray(updates.fields)) {
    throw new Error(`
      One more calls to alterSchema did not return a properly formed schema state
      object. Check your calls to Injector.transform() which could affect '${schemaKey}'.
    `);
  }

  newState = setIn(newState, `formSchemas.${schemaKey}.state`, updates);

  return newState;
};

export default applyFormMiddleware;
