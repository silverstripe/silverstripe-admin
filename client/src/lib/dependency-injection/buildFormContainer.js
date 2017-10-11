import buildBaseContainer from './buildBaseContainer';
import FormStateManager from './FormStateManager';

const SCHEMA_MIDDLEWARE_SERVICE = 'FormSchemaMiddleware';
const VALIDATION_MIDDLEWARE_SERVICE = 'FormValidationMiddleware';

const buildFormContainer = (base = buildBaseContainer()) => ({
  ...base,

  /**
   * The two middleware services are loaded by default
   */
  services: {
    [SCHEMA_MIDDLEWARE_SERVICE]: (state) => state,
    [VALIDATION_MIDDLEWARE_SERVICE]: (values, errors = {}) => errors,
  },

  /**
   * Registration of new services is not allowed
   */
  register() {
    throw new Error(`
      Attempted to register a service on Injector.form. This container accepts only two
      services by design (${SCHEMA_MIDDLEWARE_SERVICE} and ${VALIDATION_MIDDLEWARE_SERVICE}) 
      for updating form schema and adding validation, respectively. Consider using a more
      generic container, e.g. Injector.reducer.
    `);
  },

  /**
   * Registration of new services is not allowed
   */
  registerMany() {
    this.register();
  },

  /**
   * Gets the schema middleware
   * @param {string }context
   * @param {array} args
   * @returns {function}
   */
  getSchema(context, ...args) {
    return base.get.call(
      this,
      SCHEMA_MIDDLEWARE_SERVICE,
      context,
      ...args
    );
  },

  /**
   * Gets the validation middleware
   * @param {string} context
   * @param {array} args
   * @returns {function}
   */
  getValidation(context, ...args) {
    return base.get.call(
      this,
      VALIDATION_MIDDLEWARE_SERVICE,
      context,
      ...args
    );
  },

  /**
   * Creates a customise() method for this service
   * @param {string} name
   * @param {object} priorities
   * @returns {{alterSchema, addValidation}}
   */
  createTransformer(name, priorities) {
    const factory = (serviceName) => (context, wrapper) => (
      base.customise.call(
        this,
        { name, ...priorities },
        `${serviceName}.${context}`,
        wrapper
      )
    );

    return {
      alterSchema: factory(SCHEMA_MIDDLEWARE_SERVICE),
      addValidation: factory(VALIDATION_MIDDLEWARE_SERVICE),
    };
  },

  /**
   * Creates a factory function for the given service
   * @param {string} key
   * @param {array} middlewareMatches
   * @returns {function}
   */
  getFactory(key, middlewareMatches) {
    const factories = middlewareMatches.map(middleware => middleware.factory);
    if (key === SCHEMA_MIDDLEWARE_SERVICE) {
      return this.getSchemaReducer(factories);
    } else if (key === VALIDATION_MIDDLEWARE_SERVICE) {
      return this.getValidationReducer(factories);
    }
    throw new Error(`Invalid service for form injector: ${key}`);
  },

  /**
   * Creates a function that runs a series of state transformations
   * against the schema state and returns the new state
   *
   * @param {array} factories
   * @returns {function}
   */
  getSchemaReducer(factories) {
    return (formSchemaState, reduxFormState) =>
      factories.reduce((currentState, currentFactory) => {
        const manager = new FormStateManager(currentState, reduxFormState);
        const modifications = currentFactory(manager);
        return {
          ...currentState,
          ...modifications,
        };
      }, formSchemaState);
  },

  /**
   * Crates a function that runs a series of validations
   * against the form state and returns the validation result
   *
   * @param {array} factories
   * @returns {function}
   */
  getValidationReducer(factories) {
    return (values, errors = {}) =>
      factories.reduce((currentErrors, currentFactory) => {
        const modifications = currentFactory(values, errors);
        return {
          ...currentErrors,
          ...modifications,
        };
      }, errors);
  },

});

export {
  SCHEMA_MIDDLEWARE_SERVICE,
  VALIDATION_MIDDLEWARE_SERVICE,
};

export default buildFormContainer;
