import fetch from 'isomorphic-fetch';

const getGraphqlFragments = async (baseUrl) => (
  fetch(`${baseUrl}/assets/types.graphql`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
    uri: `${baseUrl}`,
    credentials: 'same-origin',
  })
    .then(result => result.json())
    .then(result => {
      const fragmentData = result.data;
      fragmentData.__schema.types = fragmentData.__schema.types.filter(
        type => type.possibleTypes !== null,
      );
      return fragmentData;
    })
);

export default getGraphqlFragments;
