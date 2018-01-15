import buildBaseContainer from './buildBaseContainer';
import provideContext from './provideContext';

/**
 * Creates a display name for a final composed component given all
 * the names of the mutations that affected it.
 * e.g. my-transformation(TextField)
 * @param original The original registered component
 * @param transforms The list of transformation names that modified the component
 */
const createDisplayName = (original, transforms) => {
  const componentName = (original.displayName || original.name || 'Component');
  const names = [componentName, ...transforms];

  return names.reduce((acc, curr) => `${curr}(${acc})`);
};

const buildComponentContainer = (base = buildBaseContainer()) => ({
  ...base,

  /**
   * Extends base.get to add a displayName to the service
   *
   * @param key
   * @param context
   * @param args
   * @returns {function}
   */
  get(key, context, ...args) {
    const Component = base.get.call(this, key, context, ...args);

    const service = provideContext(context)(Component);

    const name = (Component.displayName || Component.name || 'Component');
    const suffix = (context) ? `[${context}]` : '';
    service.displayName = `injected(${name}${suffix})`;

    return service;
  },

  /**
   * Creates a customise() function for a transformation
   * @param {string} name
   * @param {object} priorities
   * @returns {function}
   */
  createTransformer(name, priorities) {
    return (key, wrapper, displayName) => {
      this.customise({ name, ...priorities, displayName }, key, wrapper);
    };
  },

  /**
   * Creates a factory method for a service, incorporating all the given middleware.
   * @param {string} key
   * @param {array} middlewareMatches
   * @returns {function}
   */
  getFactory(key, middlewareMatches) {
    const factory = base.getFactory.call(this, key, middlewareMatches);
    const names = middlewareMatches.map(middleware => middleware.displayName || middleware.name);
    factory.displayName = createDisplayName(this.services[key], names);

    return factory;
  },

});

export default buildComponentContainer;
