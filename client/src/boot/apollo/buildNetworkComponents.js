import { ApolloLink, HttpLink } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import Config from 'lib/Config';
import { joinUrlPaths } from 'lib/urls';

const buildNetworkComponents = (baseUrl) => {
  const httpLink = new HttpLink({
    uri: joinUrlPaths(baseUrl, 'admin/graphql'),
    fetchOptions: {
      credentials: 'same-origin',
      headers: {
        accept: 'application/json',
      },
    },
  });

  const errorLink = onError(({ networkError }) => {
    if (networkError) {
      // eslint-disable-next-line no-console
      console.log(`[Network error]: ${networkError}`);
    }
  });

  const middlewareLink = new ApolloLink((operation, forward) => {
    operation.setContext({
      headers: {
        'X-CSRF-TOKEN': Config.get('SecurityID'),
      },
    });

    return forward(operation);
  });

  return [middlewareLink, errorLink, httpLink];
};

export default buildNetworkComponents;
