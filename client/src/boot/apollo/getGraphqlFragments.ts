import * as fetch from 'isomorphic-fetch';

const parseResponse = result => {
  const fragmentData = result.data;
  fragmentData.__schema.types = fragmentData.__schema.types.filter(
    type => type.possibleTypes !== null,
  );
  return fragmentData;
};

const handleError = (response: Response) => {
  if (!response.ok) {
    throw new Error(
      `The types.graphql file could not be loaded. You probably need to run a ?flush to generate it.
            Alternatively, you can use the IntrospectionProvider extension to generate the file dynamically.
            More information: https://github.com/silverstripe/silverstripe-graphql/#schema-introspection`
    );
  }

  return response;
};

const getGraphqlFragments = async (baseUrl:string, preferStatic:boolean = true): Promise<any> => {
  const urls = [
    `${baseUrl}assets/admin.types.graphql`,
    `${baseUrl}admin/graphql/types`
  ];
  if (!preferStatic) {
    urls.reverse();
  }
  const [primaryURL, fallbackURL] = urls;

  const fetchConfig: RequestInit = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
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
    response = await fetchSchema(primaryURL);
  } catch (e) {
    try {
      response = await fetchSchema(fallbackURL);
    } catch (finalError) {
      return Promise.reject(finalError);
    }
  }

  return Promise.resolve(response);
};

export default getGraphqlFragments;
