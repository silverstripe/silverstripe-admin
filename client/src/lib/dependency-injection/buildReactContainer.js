import buildBaseContainer from './buildBaseContainer';

const buildReactContainer = (base = buildBaseContainer()) => ({
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
});

export default buildReactContainer;
