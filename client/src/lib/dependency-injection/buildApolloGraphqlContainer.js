import buildBaseContainer from './buildBaseContainer';
import { captureTag } from './graphql/tags';
import buildReadQuery from './graphql/buildReadQuery';
import GraphqlManager from './GraphqlManager';

const buildApolloGraphqlContainer = (base = buildBaseContainer()) => ({
  ...base,

  /**
   * A register of templates registered with this container
   */
  templates: {
    scaffoldedRead: buildReadQuery(captureTag),
  },

  /**
   * A register of available fragments which templates and queries could take advantage of
   */
  fragments: {},

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
  scaffold(key, config, { force }) {
    // proof-of-concept: https://github.com/flamerohr/silverstripe-graphql-react-boilerplate/tree/master/client/src/js/lib/graphql

    /*
     * I would recommend adding mutation update handlers here, so it could be linked with the
     * read query more easily, anything else (such as additional fields) could be done through
     * transformations instead of through `scaffold` or `register`
     */
    throw new Error('This API endpoint is not available yet');
  },

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
   * Creates a factory function for the given service
   *
   * @param {string} key
   * @param {Array} middlewareMatches
   * @returns {function}
   */
  getFactory(key, middlewareMatches) {
    const factories = middlewareMatches.map(middleware => middleware.factory).reverse();
    const config = this.services[key];

    const manager = new GraphqlManager(
      config,
      { ...this.templates },
      { ...this.fragments },
    );
    factories.forEach((factory) => {
      factory(manager);
    }, config);

    return manager.getContainer();
  },
});

export default buildApolloGraphqlContainer;
