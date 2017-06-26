import buildBaseContainer from './buildBaseContainer';

const buildComponentContainer = (base = buildBaseContainer()) => ({
  ...base,
  /**
   * Extends base.get to add a displayName to the service
   *
   * @param key
   * @param context
   * @param args
   * @returns {XML}
   */
  get(key, context, ...args) {
    const service = base.get.call(this, key, context, ...args);

    if (service.displayName && service.displayName.match(/\]$/)) {
      return service;
    }

    const componentName = (service.displayName || service.name || 'Component');
    const componentKey = (context) ? `[${context}]` : '';
    service.displayName = `${componentName}${componentKey}`;

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

});

export default buildComponentContainer;
