import { CREATE, DELETE, READ_ONE, UPDATE } from './templates';

export const ROOT_FIELD = 'root';

// used to help generate the parameters and variables
const paginationFields = {
  limit: 'Int',
  offset: 'Int',
};

// just outright is the parameters
const paginationParams = {
  limit: 'limit',
  offset: 'offset',
};

const paginateFields = (fields) => (
  `edges { node { ${fields.join(' ')} } } pageInfo { totalCount }`
);

export const getSingularName = ({ singularName }) => singularName;

export const getPluralName = ({ pluralName }) => pluralName;

export const getVariables = ({ params, pagination = true }) => {
  const items = (pagination) ? { ...params, ...paginationFields } : params;

  const varList = Object.entries(items)
    .map(([key, type]) => (
      `$${key}: ${type}`
    ));

  return varList.length ? `(${varList.join(', ')})` : '';
};

export const getParams = ({ params, pagination = true }) => {
  const items = (pagination) ? { ...params, ...paginationFields } : params;
  const paramList = Object.keys(items)
    .map((paramName) => (
      `${paramName}: $${paramName}`
    ));

  return paramList.length ? `(${paramList.join(', ')})` : '';
};

export const getFields = ({ args, fields, pagination = true }, stack = [ROOT_FIELD]) => {
  const strings = fields.map((field, i) => {
    if (Array.isArray(field)) {
      return `
      {
        ${getFields(
          { args, fields: field, pagination: false },
          [...stack, fields[i - 1]],
        )}
      }`;
    }
    const path = [...stack, field];
    const key = path.join('/');
    const fieldParams = args[key] || {};

    const items = (pagination) ? { ...fieldParams, ...paginationParams } : fieldParams;
    const paramList = Object.entries(items)
      .map(([paramName, varName]) => (
        `${paramName}: $${varName}`
      ));
    const paramOutput = paramList.length ? `(${paramList.join(', ')})` : '';

    const str = `${field}${paramOutput}`;

    return str;
  });

  if (pagination) {
    return paginateFields(strings);
  }

  return strings.join(' ');
};

export const getFragments = ({ availableFragments, fragments = [] }) => (
  // build up the list of fragments needed for this query but concatenating them together
  Object.entries(availableFragments)
    .reduce((capturedFragments, [key, fragment]) => (
      (fragments.includes(key))
        ? `${capturedFragments} ${fragment}`
        : capturedFragments
    ), '')
);

function getMatchingParamKey(matchWith, params) {
  return Object.keys(params).find((paramName) => paramName.toLowerCase() === matchWith);
}

function getInputVariable({ templateName, singularName, params }) {
  const inputKey = getMatchingParamKey('input', params);
  if (inputKey) {
    return `$${inputKey}: ${params[inputKey]}`;
  }
  // Graphql v3 fallbacks
  switch (templateName) {
    case CREATE:
      return `$Input: ${getSingularName({ singularName })}CreateInputType!`;
    case UPDATE:
      return `$Input: ${getSingularName({ singularName })}UpdateInputType!`;
    default:
      throw new Error('Template is not a mutation - no input variable is required.');
  }
}

function normaliseMutationParamsAndVars(paramsOrVars, dedup) {
  return paramsOrVars.replace(dedup, '').replace(/(^\(+|\)+$)/mg, '');
}

export function getMutationVariables(obj) {
  const inputVar = getInputVariable(obj);
  switch (obj.templateName) {
    case CREATE:
      return `(${inputVar})`;
    case UPDATE:
      return `(
        ${inputVar}
        ${normaliseMutationParamsAndVars(getVariables(obj), inputVar)}
      )`;
    default:
      throw new Error('Template is not a mutation - use getVariables() instead.');
  }
}

export function getMutationParams(obj) {
  const { templateName, params } = obj;
  let inputKey = getMatchingParamKey('input', params);
  if (!inputKey) {
    // Graphql v3 fallback
    inputKey = 'Input';
  }
  const inputParam = `${inputKey}: $${inputKey}`;

  switch (templateName) {
    case CREATE:
      return `(${inputParam})`;
    case UPDATE:
      return `(
        ${inputParam}
        ${normaliseMutationParamsAndVars(getParams(obj), inputParam)}
      )`;
    default:
      throw new Error('Template is not a mutation - use getParams() instead.');
  }
}

export function getIdOnlyVariables({ templateName, params }) {
  let key;
  switch (templateName) {
    case DELETE:
      // Let developer declare casing (e.g. "Ids" or "ids")
      key = getMatchingParamKey('ids', params);
      if (key) {
        return `($${key}: ${params[key]})`;
      }
      // Graphql v3 fallback
      return '($IDs:[ID]!)';
    case READ_ONE:
      // Let developer declare casing (e.g. "Id" or "id")
      key = getMatchingParamKey('id', params);
      if (key) {
        return `($${key}: ${params[key]})`;
      }
      // Graphql v3 fallback
      return '($ID: ID!)';
    default:
      throw new Error('Unexpected template type.');
  }
}

export function getIdOnlyParams({ templateName, params }) {
  let key;
  switch (templateName) {
    case DELETE:
      // Let developer declare casing (e.g. "Ids" or "ids")
      key = getMatchingParamKey('ids', params);
      if (key) {
        return `(${key}: $${key})`;
      }
      // Graphql v3 fallback
      return '(IDs: $IDs)';
    case READ_ONE:
      // Let developer declare casing (e.g. "Id" or "id")
      key = getMatchingParamKey('id', params);
      if (key) {
        return `(${key}: $${key})`;
      }
      // Graphql v3 fallback
      return '(ID: $ID)';
    default:
      throw new Error('Unexpected template type.');
  }
}
