import { HttpLink } from 'apollo-link-http';
import { onError } from 'apollo-link-error';
import { ApolloLink } from 'apollo-link';
import Config from 'lib/Config';

const buildNetworkComponents = (baseUrl) => {
  const httpLink = new HttpLink({
    uri: `${baseUrl}admin/graphql`,
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
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        'X-CSRF-TOKEN': Config.get('SecurityID'),
      },
    });

    return forward(operation);
  });

  return [middlewareLink, errorLink, httpLink];
};

export default buildNetworkComponents;
