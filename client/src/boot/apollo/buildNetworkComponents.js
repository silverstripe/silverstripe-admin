import { HttpLink } from 'apollo-link-http';
import { onError } from 'apollo-link-error';
import { ApolloLink } from 'apollo-link';

const buildNetworkComponents = (baseUrl) => {
  const httpLink = new HttpLink({
    uri: `${baseUrl}graphql`,
    fetchOptions: {
      credentials: 'same-origin',
      headers: {
        accept: 'application/json',
      },
    },
  });

  const errorLink = onError(({ networkError }) => {
    if (networkError) {
      console.log(`[Network error]: ${networkError}`);
    }
  });

  const middlewareLink = new ApolloLink((operation, forward) => {
    operation.setContext({
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
    });

    return forward(operation);
  });

  return [middlewareLink, errorLink, httpLink];
};

export default buildNetworkComponents;
