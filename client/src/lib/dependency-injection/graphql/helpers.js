export const ROOT_FIELD = 'root';

const paginationFields = {
  limit: 'Int',
  offset: 'Int',
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
  const paramList = Object.entries(items)
    .map(([paramName, varName]) => (
      `${paramName}: $${varName}`
    ));

  return paramList.length ? `(${paramList.join(', ')})` : '';
};

export const getRootParams = ({ args, pagination = true }) => {
  const fieldParams = args[ROOT_FIELD] || {};

  return getParams({ params: fieldParams, pagination });
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

    const str = `${field}${getParams({ params: fieldParams, pagination: false })}`;

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

export const getCreateMutationType = ({ singularName }) => `Create${singularName}Input`;

export const getUpdateMutationType = ({ singularName }) => `Update${singularName}Input`;
