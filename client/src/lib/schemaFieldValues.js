import merge from 'merge';

/**
 * For a given form field, merge the schema with state and return the props
 * to be assigned when rendering the field component.
 *
 * @param {Object} schema
 * @param {Object} state
 * @return {Object}
 */
export function schemaMerge(schema, state) {
  // could be a dataless field
  if (typeof state === 'undefined') {
    return schema;
  }
  return merge.recursive(true, schema, state);
}

/**
 * Finds the field with matching id from the schema or state, this is mainly for dealing with
 * schema's deep nesting of fields.
 *
 * @param fields
 * @param name
 * @returns {object|undefined}
 */
export function findField(fields, name) {
  if (!fields) {
    return null;
  }

  return fields.reduce((prev, field) => {
    if (prev) {
      return prev;
    }
    return findField(field.children, name);
  }, fields.find(field => field.name === name));
}

/**
 * Gets all field values based on the assigned form schema, from prop state.
 *
 * @returns {Object}
 */
export default function schemaFieldValues(schema, state) {
  // using state is more efficient and has the same fields, fallback to nested schema
  if (!state) {
    return {};
  }

  return state.fields
    .reduce((prev, curr) => {
      const match = findField(schema.fields, curr.name);

      if (!match) {
        return prev;
      }

      // Skip non-data fields
      if (match.type === 'Structural' || match.readOnly === true) {
        return prev;
      }

      return Object.assign({}, prev, {
        [match.name]: curr.value,
      });
    }, {});
}
