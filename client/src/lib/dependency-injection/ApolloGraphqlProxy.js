import { graphql } from '@apollo/client/react/hoc';

class ApolloGraphqlProxy {
  /**
   * @param {Object} graphqlAST
   * @param {Object} apolloConfig
   */
  constructor(graphqlAST, apolloConfig) {
    this.graphqlAST = graphqlAST;
    this.apolloConfig = apolloConfig;
  }

  /**
   * @returns {function}
   */
  getApolloHOC() {
    return graphql(this.graphqlAST, this.apolloConfig);
  }

  /**
   * @returns {Object}
   */
  getGraphqlAST() {
    return this.graphqlAST;
  }

  /**
   * @returns {Object}
   */
  getApolloConfig() {
    return this.apolloConfig;
  }
}

export default ApolloGraphqlProxy;
