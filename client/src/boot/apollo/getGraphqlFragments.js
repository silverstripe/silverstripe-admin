import fetch from 'isomorphic-fetch';

const parseResponse = result => {
  const fragmentData = result.data;
  fragmentData.__schema.types = fragmentData.__schema.types.filter(
    type => type.possibleTypes !== null,
  );
  return fragmentData;
};

const handleError = response => {
  if (!response.ok) {
    throw new Error(
      `The types.graphql file could not be loaded. You probably need to run a ?flush to generate it.
            Alternatively, you can use the IntrospectionProvider extension to generate the file dynamically.
            More information: https://github.com/silverstripe/silverstripe-graphql/#schema-introspection`
    );
  }

  return response;
};

const getGraphqlFragments = async (baseUrl) => {
  const typesUrl = `${baseUrl}assets/admin.types.graphql`;

  const fetchConfig = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
    uri: `${baseUrl}`,
    credentials: 'same-origin',
  };

  const fetchSchema = async (url) => (
    fetch(url, fetchConfig)
      .then(handleError)
      .then(result => result.json())
      .then(parseResponse)
  );

  let response;
  try {
    response = await fetchSchema(typesUrl);
  } catch (e) {
    return Promise.reject(e);
  }

  return Promise.resolve(response);
};

export default getGraphqlFragments;
