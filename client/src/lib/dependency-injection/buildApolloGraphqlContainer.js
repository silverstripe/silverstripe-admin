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

  registerFragment(fragmentName, fragmentString, { force } = {}) {
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
