import buildApolloGraphqlContainer from './buildApolloGraphqlContainer';
import buildCreateMutation from './graphql/buildCreateMutation';
import buildReadQuery from './graphql/buildReadQuery';
import buildReadOneQuery from './graphql/buildReadOneQuery';
import buildUpdateMutation from './graphql/buildUpdateMutation';
import buildDeleteMutation from './graphql/buildDeleteMutation';
import buildBaseQuery from './graphql/buildBaseQuery';
import { CREATE, READ, READ_ONE, UPDATE, DELETE, QUERY } from './graphql/templates';
import { captureTag } from './graphql/tags';

const buildApolloGraphqlScaffoldingContainer = (base = buildApolloGraphqlContainer()) => ({
  ...base,

  templates: {
    [CREATE]: buildCreateMutation(captureTag),
    [READ]: buildReadQuery(captureTag),
    [READ_ONE]: buildReadOneQuery(captureTag),
    [UPDATE]: buildUpdateMutation(captureTag),
    [DELETE]: buildDeleteMutation(captureTag),
    [QUERY]: buildBaseQuery(captureTag),
  },
});

export default buildApolloGraphqlScaffoldingContainer;

