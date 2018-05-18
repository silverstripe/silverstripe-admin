/* global window */
import ApolloClient from 'apollo-client';
import { withClientState } from 'apollo-link-state';
import { from } from 'apollo-link';
import getGraphqlFragments from './getGraphqlFragments';
import buildNetworkComponents from './buildNetworkComponents';
import buildCache from './buildCache';
import Config from 'lib/Config';

const buildClient = async (baseUrl) => {
    const graphQLConfig = Config.getSection('SilverStripe\\Admin\\LeftAndMain').graphql;
    const cachedTypenames = graphQLConfig && graphQLConfig.cachedTypenames;
    let fragmentData;
    try {
      fragmentData = await getGraphqlFragments(baseUrl, cachedTypenames);
    } catch (e) {
        fragmentData = null;
    }
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
