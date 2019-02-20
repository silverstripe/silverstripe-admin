import { InMemoryCache, IntrospectionFragmentMatcher } from 'apollo-cache-inmemory';
import dataIdFromObject from './dataIdFromObject';

const buildCache = (introspectionQueryResultData) => (
  new InMemoryCache({
    fragmentMatcher: introspectionQueryResultData
      ? new IntrospectionFragmentMatcher({
          introspectionQueryResultData,
        })
      : null,
    dataIdFromObject,
    addTypename: true,
  })
);

export default buildCache;
