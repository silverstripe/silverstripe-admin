const paginationFields = {
  limit: 'Int',
  offset: 'Int',
};

const paginateFields = (fields) => {
  return `edges { node { ${fields.map(' ')} } } pageInfo { totalCount }`;
};

const buildDefs = (params, paginated = false) => {
  const items = (paginated) ? { ...params, ...paginationFields } : params;

  return Object.entries(items)
    .map(([key, type]) => (
      `$${key}: ${type}`
    ))
    .join(', ');
};

const buildArgs = (params, paginated = false) => {
  const items = (paginated) ? { ...params, ...paginationFields } : params;

  return Object.keys(items)
    .map((key) => (
      `${key}: $${key}`
    ))
    .join(', ');
};

const mapFields = (fields, paginated = false) => {
  const strings = fields.map(field => (
    (Array.isArray(field))
      ? `{ ${mapFields(field, paginated)} }`
      : field
  ));

  if (paginated) {
    return paginateFields(strings);
  }

  return strings.join(' ');
};

export const getSingularName = ({ singularName }) => singularName;

export const getPluralName = ({ pluralName }) => pluralName;

export const getVariables = ({ params, pagination }) => buildDefs(params, pagination);

export const getParams = ({ params, pagination }) => buildArgs(params, pagination);

export const getFields = ({ fields, pagination }) => mapFields(fields, pagination);

export const getFragments = ({ availableFragments, fragments = [] }) => (
  // build up the list of fragments needed for this query but concatenating them together
  Object.entries(availableFragments)
    .reduce((capturedFragments, [key, fragment]) => (
      (fragments.includes(key))
        ? `${capturedFragments} ${fragment}`
        : capturedFragments
    ))
);
