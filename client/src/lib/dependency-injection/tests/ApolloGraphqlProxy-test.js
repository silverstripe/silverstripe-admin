/* global jest, describe, beforeEach, it, pit, expect, process */

import gql from 'graphql-tag';
import ApolloGraphqlProxy from '../ApolloGraphqlProxy';

const createMock = (ast, config = {}) => (
  new ApolloGraphqlProxy(ast, config)
);

describe('ApolloGraphqlProxy', () => {
  it('Constructs', () => {
    const proxy = createMock(
      'ast',
      { foo: 'bar' }
    );

    expect(proxy.getGraphqlAST()).toBe('ast');
    expect(proxy.getApolloConfig().foo).toBe('bar');
  });

  it('Builds a HOC', () => {
    const proxy = createMock(
      gql('query myQuery { foo }'),
      {
        test: 'config'
      }
    );

    const hoc = proxy.getApolloHOC();
    expect(typeof hoc).toBe('function');
  });
});
