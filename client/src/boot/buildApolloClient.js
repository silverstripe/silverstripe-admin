import ApolloClient, { createNetworkInterface } from 'apollo-client';
import { printRequest } from 'apollo-client/transport/networkInterface';
import qs from 'qs';

function buildApolloClient(baseUrl) {
  const networkInterface = createNetworkInterface({
    uri: `${baseUrl}graphql/`,
    opts: {
      credentials: 'same-origin',
      headers: {
        accept: 'application/json',
      },
    },
  });
  const apolloClient = new ApolloClient({
    shouldBatch: true,
    addTypename: true,
    dataIdFromObject: (o) => {
      if (o.id >= 0 && o.__typename) {
        return `${o.__typename}:${o.id}`;
      }
      return null;
    },
    networkInterface,
  });

  networkInterface.use([{
    applyMiddleware(req, next) {
      const entries = printRequest(req.request);

      // eslint-disable-next-line no-param-reassign
      req.options.headers = Object.assign(
        {},
        req.options.headers,
        {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        }
      );
      // eslint-disable-next-line no-param-reassign
      req.options.body = qs.stringify(Object.assign(
        {},
        entries,
        { variables: JSON.stringify(entries.variables) }
      ));
      next();
    },
  }]);

  return apolloClient;
}

export default buildApolloClient;
