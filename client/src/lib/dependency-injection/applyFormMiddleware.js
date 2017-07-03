import Injector from '../Injector';
import getIn from 'redux-form/lib/structure/plain/getIn';
import setIn from 'redux-form/lib/structure/plain/setIn';

const applyFormMiddleware = (reducer) => () => (state, action) => {
  const reducedState = reducer(state, action);
  if (!action.meta || !action.meta.form) {
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
  const [schemaKey, schema] = Object.entries(reducedState.formSchemas)
    .find(([, schemaEntry]) => schemaEntry.name === formName);

  if (!schemaKey) {
    return reducedState;
  }

  const schemaState = schema.state;
  let newState = {
    ...reducedState,
  };
  const updates = formSchemaMiddleware(formState.values, schemaState);
  newState = setIn(newState, `formSchemas.${schemaKey}.state`, updates);

  return newState;
};

export default applyFormMiddleware;
