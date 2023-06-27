import buildBaseContainer from './buildBaseContainer';
import ApolloGraphqlManager from './ApolloGraphqlManager';

const buildApolloGraphqlContainer = (
  base = buildBaseContainer(),
  initialTemplates = {},
  initialFragments = {}
) => ({
  ...base,

  /**
   * A register of templates registered with this container
   */
  templates: { ...initialTemplates },

  /**
   * A register of available fragments which templates and queries could take advantage of
   */
  fragments: { ...initialFragments },

  /**
   * Registers queries which mirror silverstripe graphql's scaffolded options, also adds some
   * handlers that isn't possible if you're only registering each query/mutation individually.
   *
   * @ref https://github.com/silverstripe/silverstripe-graphql#available-operations
   *
   * @param {string} key - base key to use to generate the scaffolded keys
   * @param {object} config - properties include: singularName, pluralName, fields, pagination,
   * @param {boolean} force
   *
   * @return {object} mappedQueryNameKeys
   */
  /* eslint-disable max-len, no-unused-vars */
  scaffold(key, config, { force }) {
    /*
     * @todo build out scaffolding
     * I would recommend adding a default mutation update handlers here, instead of in the `register` method.
     * This way query and mutation could be potentially be linked more easily.
     * Config schema could be found in the `GraphqlManager.js` file.
     *
     * Proof-of-concept for handlers could be found here:
     * https://github.com/flamerohr/silverstripe-graphql-react-boilerplate/tree/master/client/src/js/lib/graphql
     */
    throw new Error('This API endpoint is not available yet');
  },
  /* eslint-enable */

  /**
   * Register a new query with a given key and config options
   *
   * @param key
   * @param {Object} config - requires a `templateName` property, other properties may also be
   *    required depending on the template used.
   * @param args
   * @return {*}
   */
  register(key, config, ...args) {
    const {
      templateName,
    } = config;

    if (!templateName || !this.templates[templateName]) {
      throw new Error(`
Tried to register a new query '${key}' without a defined template '${templateName}'. Please ensure the
templateName config is defined and that you have registered the template before registering a query.
      `);
    }

    return base.register.call(
      this,
      key,
      config,
      ...args
    );
  },

  registerTemplate(templateName, { force } = {}) {
    base.isProtected.call(this);
    return (strings, ...expressions) => {
      if (this.templates[templateName] && !force) {
        throw new Error(`
Tried to register template '${templateName}' more than once. This practice is discouraged. Consider
using Injector.update() to enhance the template rather than override it completely.
Otherwise, invoke the registerTemplate() function with '{ force: true }' as the second argument.
        `);
      }
      this.templates = {
        ...this.templates,
        [templateName]: {
          strings,
          expressions,
        },
      };
    };
  },

  /**
   * Register fragments available to be used by transformations and also registered queries
   *
   * @param {string} fragmentName
   * @param {string|object} fragmentString - can be a string or gql AST
   * @param {boolean} force
   */
  registerFragment(fragmentName, fragmentString, { force } = {}) {
    base.isProtected.call(this);
    if (this.fragments[fragmentName] && !force) {
      throw new Error(`
Tried to register fragment '${fragmentName}' more than once. This practice is discouraged. Consider
adding a new fragment or using Injector.update() to enhance the template you're working with.
Otherwise, invoke the registerFragment() function with '{ force: true }' as the third argument.
      `);
    }
    this.fragments = {
      ...this.fragments,
      [fragmentName]: fragmentString,
    };
  },

  getTemplates() {
    return { ...this.templates };
  },

  getFragments() {
    return { ...this.fragments };
  },

  /**
   * Runs all of the factories against the manager and returns the instance
   * @param {string} key
   * @param {Array} middlewareMatches
   * @returns {ApolloGraphqlManager}
   */
  getProcessedManager(key, middlewareMatches) {
    const factories = middlewareMatches.map(middleware => middleware.factory).reverse();
    const config = this.services[key];

    const manager = new ApolloGraphqlManager(
      config,
      { ...this.templates },
      { ...this.fragments },
    );
    factories.forEach((factory) => {
      factory(manager);
    }, config);

    return manager;
  },

  /**
   * Creates a factory function for the given service
   *
   * @param {string} key
   * @param {Array} middlewareMatches
   * @returns {ApolloGraphqlProxy}
   */
  getFactory(key, middlewareMatches) {
    return this.getProcessedManager(key, middlewareMatches).getContainer();
  },

});

export default buildApolloGraphqlContainer;
