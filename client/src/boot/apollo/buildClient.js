/* global window */
import ApolloClient from 'apollo-client';
import { withClientState } from 'apollo-link-state';
import { from } from 'apollo-link';
import getGraphqlFragments from './getGraphqlFragments';
import buildNetworkComponents from './buildNetworkComponents';
import buildCache from './buildCache';

const buildClient = async (baseUrl) => {
    const fragmentData = await getGraphqlFragments(baseUrl);
    const cache = buildCache(fragmentData);
    const components = buildNetworkComponents(baseUrl);
    const stateLink = withClientState({
      cache,
      resolvers: {}
    });
    const link = from([stateLink, ...components]);
    return new ApolloClient({ cache, link });
};

export default buildClient;
