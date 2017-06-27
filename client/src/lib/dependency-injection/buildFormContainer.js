import buildBaseContainer from './buildBaseContainer';
import SchemaStateManager from './SchemaStateManager';

const SCHEMA_MIDDLEWARE_SERVICE = 'FormSchemaMiddleware';
const VALIDATION_MIDDLEWARE_SERVICE = 'FormValidationMiddleware';

const buildFormContainer = (base = buildBaseContainer()) => ({
  ...base,

  /**
   * The two middleware services are loaded by default
   */
  services: {
    SCHEMA_MIDDLEWARE_SERVICE,
    VALIDATION_MIDDLEWARE_SERVICE
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

  getFactory(service, middlewareMatches) {
    const factories = middlewareMatches.map(middleware => middleware.factory);
    if (service === SCHEMA_MIDDLEWARE_SERVICE) {
      return this.getSchemaReducer(factories);
    } else if (service === VALIDATION_MIDDLEWARE_SERVICE) {
      return this.getValidationReducer(factories);
    } else {
      throw new Error(`Invalid service for form injector: ${service}`);
    }
  },

  getSchemaReducer(factories) {
    return (values, schemaState) => {
      return factories.reduce((currentState, currentFactory) => {
        const manager = new SchemaStateManager(currentState);
        const modifications = currentFactory(values, manager);
        return {
          ...currentState,
          ...modifications,
        };
      }, schemaState);
    };
  },

  getValidationReducer(factories) {
    return (values, errors = {}) => {
      return factories.reduce((currentErrors, currentFactory) => {
        const modifications = currentFactory(values, errors);
        return {
          ...currentErrors,
          ...modifications,
        };
      }, errors);
    };
  },


});

export default buildFormContainer;
