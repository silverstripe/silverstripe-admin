import { InMemoryCache } from '@apollo/client/cache';
import dataIdFromObject from './dataIdFromObject';

const buildCache = (introspectionQueryResultData) => {
  const possibleTypes = {};
  if (introspectionQueryResultData) {
    introspectionQueryResultData.__schema.types.forEach(supertype => {
      if (supertype.possibleTypes) {
        possibleTypes[supertype.name] = supertype.possibleTypes.map(subtype => subtype.name);
      }
    });
  }
  return new InMemoryCache({
    possibleTypes,
    dataIdFromObject,
    addTypename: true,
  });
};

export default buildCache;
