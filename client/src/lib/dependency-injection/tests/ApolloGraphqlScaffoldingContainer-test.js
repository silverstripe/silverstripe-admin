/* global jest, jasmine, describe, beforeEach, it, pit, expect, process */
import buildInjectorContainer from '../buildInjectorContainer';
import buildApolloGraphqlScaffoldingContainer from '../buildApolloGraphqlScaffoldingContainer';
import * as graphqlTemplates from '../graphql/templates';
import { GLOBAL_CONTEXT } from '../MiddlewareRegistry';

describe('Dynamic graphql injection', () => {
  let Injector;

  const fetchManager = (key) => {
    const middlewares = Injector.test.middlewareRegistries[key];
    middlewares.sort();
    const middlewareMatches = middlewares.getMatchesForContext(GLOBAL_CONTEXT);
    return Injector.test.getProcessedManager(key, middlewareMatches);
  };

  beforeEach(() => {
    Injector = buildInjectorContainer();
    Injector.register('test', buildApolloGraphqlScaffoldingContainer());
  });

  it('Allows customisation of Apollo config', () => {
    const { QUERY } = graphqlTemplates;
    const query = {
      apolloConfig: {
        props() {
          return {
            foo: 'bar',
          };
        }
      },
      templateName: QUERY,
      pluralName: '',
      pagination: false,
      params: {},
      fields: [],
    };

    Injector.test.register('MyTestQuery', query);
    Injector.transform(
      'test-transform',
      (updater) => {
        updater.test('MyTestQuery', (manager) => {
          manager.transformApolloConfig('props', () => (previous) => ({
            ...previous,
            qux: 'baz'
          }));
        });
      }
    );

    Injector.load();

    const apolloConfig = fetchManager('MyTestQuery').getApolloConfig();
    expect(typeof apolloConfig.props).toBe('function');
    expect(apolloConfig.props()).toEqual({ foo: 'bar', qux: 'baz' });
  });

  it('Allows customisation of READ queries', () => {
    const { READ } = graphqlTemplates;
    const query = {
      apolloConfig: {
        props() {
          return {
            foo: 'bar',
          };
        }
      },
      templateName: READ,
      pluralName: 'Dinos',
      pagination: false,
      params: {},
      fields: [
        'Spikes',
        'Tail'
      ],
    };

    Injector.test.register('MyTestReadQuery', query);
    Injector.transform(
      'test-transform',
      (updater) => {
        updater.test('MyTestReadQuery', (manager) => {
          manager.addField('Plates');
          manager.transformApolloConfig('props', () => (previous) => ({
            ...previous,
            qux: 'baz'
          }));
        });
      }
    );
    Injector.load();

    const AST = fetchManager('MyTestReadQuery').getGraphqlAST();

    expect(AST.kind).toBe('Document');
    const compiledQuery = AST.loc.source.body;
    expect(compiledQuery).toMatch(/\s*query\s+ReadDinos\s+{\s+readDinos\s+{\s+Spikes Tail Plates\s+}\s+}\s*$/);
  });

  it('Allows customisation of READ ONE queries', () => {
    const { READ_ONE } = graphqlTemplates;
    const query = {
      apolloConfig: {
      },
      templateName: READ_ONE,
      singularName: 'Dino',
      pagination: false,
      params: {},
      fields: [
        'Spikes',
        'Tail'
      ],
    };

    Injector.test.register('MyTestReadOneQuery', query);
    Injector.transform(
      'test-transform',
      (updater) => {
        updater.test('MyTestReadOneQuery', (manager) => {
          manager.addField('Plates');
        });
      }
    );
    Injector.load();

    const AST = fetchManager('MyTestReadOneQuery').getGraphqlAST();

    expect(AST.kind).toBe('Document');
    const compiledQuery = AST.loc.source.body;
    expect(compiledQuery).toMatch(/\s*query\s+ReadOneDino\(\s*\$ID: ID!\s*\)\s+{\s+readOneDino\(\s*ID: \$ID\s*\)\s+{\s+Spikes Tail Plates\s+}\s+}\s*$/);
  });

  it('Allows customisation of UPDATE queries', () => {
    const { UPDATE } = graphqlTemplates;
    const query = {
      apolloConfig: {
      },
      templateName: UPDATE,
      singularName: 'Dino',
      pagination: false,
      params: {},
      fields: [
        'Teeth',
      ],
    };

    Injector.test.register('MyTestUpdateQuery', query);
    Injector.transform(
      'test-transform',
      (updater) => {
        updater.test('MyTestUpdateQuery', (manager) => {
          manager.addField('Plates');
        });
      }
    );
    Injector.load();

    const AST = fetchManager('MyTestUpdateQuery').getGraphqlAST();

    expect(AST.kind).toBe('Document');
    const compiledQuery = AST.loc.source.body;
    expect(compiledQuery).toMatch(/\s*mutation\s+UpdateDino\(\s*\$input:\s*UpdateDinoInput!\s*\)\s+{\s+updateDino\(\s*input:\s*\$input\s*\)\s+{\s+Teeth Plates\s+}\s+}\s*$/);
  });

  it('Allows customisation of DELETE queries', () => {
    const { DELETE } = graphqlTemplates;
    const query = {
      apolloConfig: {
      },
      templateName: DELETE,
      singularName: 'Dino',
      pagination: false,
      params: {},
      fields: [
      ],
    };

    Injector.test.register('MyTestDeleteQuery', query);
    Injector.transform(
      'test-transform',
      (updater) => {
        updater.test('MyTestDeleteQuery', (manager) => {
          manager.addField('ID');
        });
      }
    );
    Injector.load();

    const AST = fetchManager('MyTestDeleteQuery').getGraphqlAST();

    expect(AST.kind).toBe('Document');
    const compiledQuery = AST.loc.source.body;
    expect(compiledQuery).toMatch(/\s*mutation\s+DeleteDino\(\s*\$IDs:\s*\[ID]!\s*\)\s+{\s+deleteDino\(\s*IDs:\s*\$IDs\s*\)\s+}\s*$/);
  });

  it('Allows customisation of CREATE queries', () => {
    const { CREATE } = graphqlTemplates;
    const query = {
      apolloConfig: {
      },
      templateName: CREATE,
      singularName: 'Dino',
      pagination: false,
      params: {},
      fields: [
        'Club',
      ],
    };

    Injector.test.register('MyTestCreateQuery', query);
    Injector.transform(
      'test-transform',
      (updater) => {
        updater.test('MyTestCreateQuery', (manager) => {
          manager.addField('Claws');
        });
      }
    );
    Injector.load();

    const AST = fetchManager('MyTestCreateQuery').getGraphqlAST();

    expect(AST.kind).toBe('Document');
    const compiledQuery = AST.loc.source.body;
    expect(compiledQuery).toMatch(/\s*mutation\s+CreateDino\(\s*\$input:\s*CreateDinoInput!\s*\)\s+{\s+createDino\(\s*input:\s*\$input\s*\)\s+{\s+Club Claws\s+}\s+}\s*$/);
  });
});
