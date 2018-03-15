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

  return Object.entries(items)
    .map(([key, type]) => (
      `$${key}: ${type}`
    ))
    .join(', ');
};

export const getParams = ({ params, pagination = true }) => {
  const items = (pagination) ? { ...params, ...paginationFields } : params;

  return Object.keys(items)
    .map((key) => (
      `${key}: $${key}`
    ))
    .join(', ');
};

export const getFields = ({ fields, pagination = true }) => {
  const strings = fields.map(field => (
    (Array.isArray(field))
      // nested fields shouldn't also have pagination
      ? `{ ${getFields({ fields: field, pagination: false })} }`
      : field
  ));

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
