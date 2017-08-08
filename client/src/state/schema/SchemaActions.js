import ACTION_TYPES from './SchemaActionTypes';

/**
 * Sets the schema being used to generate the current form layout.
 * Note that the `state` key just determines the initial form field values,
 * and is overruled by redux-form behaviour (stored in separate reducer key)
 *
 * @param {string} id - URL or id for schema
 * @param {object} schema - JSON schema for the layout.
 * @param {string} name - identifier used for form and redux-form
 *
 *@return {object}
 */
export function setSchema(id, schema = {}, name) {
  return {
    type: ACTION_TYPES.SET_SCHEMA,
    payload: {
      ...schema,
      id,
      name,
    },
  };
}

/**
 * For setting the stateOverride of a formData in redux store
 *
 * @param {int} id
 * @param {object} stateOverride
 * @returns {object}
 */
export function setSchemaStateOverrides(id, stateOverride) {
  return {
    type: ACTION_TYPES.SET_SCHEMA_STATE_OVERRIDES,
    payload: {
      id,
      stateOverride,
    },
  };
}

/**
 * Tracks loading of schema for a form
 *
 * @param id
 * @returns {object}
 */
export function setSchemaLoading(id, loading) {
  return {
    type: ACTION_TYPES.SET_SCHEMA_LOADING,
    payload: {
      id,
      loading,
    },
  };
}
