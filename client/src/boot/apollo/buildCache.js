import { InMemoryCache, IntrospectionFragmentMatcher } from 'apollo-cache-inmemory';
import dataIdFromObject from './dataIdFromObject';

const buildCache = (introspectionQueryResultData) => (
  new InMemoryCache({
    fragmentMatcher: new IntrospectionFragmentMatcher({
      introspectionQueryResultData,
    }),
    dataIdFromObject,
    addTypename: true,
  })
);

export default buildCache;
