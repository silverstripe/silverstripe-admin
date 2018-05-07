/* global window */
import fetch from 'isomorphic-fetch';
import ApolloClient, { InMemoryCache, IntrospectionFragmentMatcher, printAST, ApolloLink } from 'apollo-boost';
import { BatchHttpLink } from 'apollo-link-batch-http';
import qs from 'qs';

function buildApolloClient(baseUrl) {
  return fetch(`${baseUrl}graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      uri: `${baseUrl}`,
      credentials: 'same-origin',
      body: JSON.stringify({
        query: `{
        __schema {
          types {
            kind
            name
            possibleTypes {
              name
            }
          }
        }
      }`,
      }),
    })
    .then(result => result.json())
    .then(result => {
      const fragmentData = result.data;
      // here we're filtering out any type information unrelated to unions or interfaces
      const filteredData = fragmentData.__schema.types.filter(
        type => type.possibleTypes !== null,
      );
      fragmentData.__schema.types = filteredData;
      return fragmentData;
    })
    .then(fragmentData => {
      const batchLink = new BatchHttpLink({
        uri: `${baseUrl}`,
        fetchOptions: {
          credentials: 'same-origin',
          headers: {
            accept: 'application/json',
          },
        },
      });
      const fragmentMatcher = new IntrospectionFragmentMatcher({
        fragmentData
      });
      const middlewareLink = new ApolloLink((operation, forward) => {
        const entries = printAST(operation.request);
        operation.setContext({
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
          },
          body: qs.stringify(
            Object.assign({}, entries, {
              variables: JSON.stringify(entries.variables),
            }),
          )
        });
        return forward(operation);
      });
      const link = middlewareLink.concat(batchLink);
      const cache = new InMemoryCache({
        fragmentMatcher,
        dataIdFromObject: (o) => {
          const dataId = o.id || o.ID;
          if (dataId && dataId >= 0 && o.__typename) {
            return `${o.__typename}:${dataId}`;
          }
          return null;
        },
        addTypename: true,
      });
      const apolloClient = new ApolloClient({
        cache,
        link,
      });

      return apolloClient;
    });
}

export default buildApolloClient;
