import buildBaseContainer from './buildBaseContainer';

const SCHEMA_MIDDLEWARE_SERVICE = 'FormSchemaMiddleware';
const VALIDATION_MIDDLEWARE_SERVICE = 'FormValidationMiddleware';

const buildFormContainer = (base = buildBaseContainer()) => ({
  ...base,

  /**
   * The two middleware services are loaded by default
   */
  services: {
    [SCHEMA_MIDDLEWARE_SERVICE]: (state) => state,
    [VALIDATION_MIDDLEWARE_SERVICE]: (values, errors) => errors,
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

});

export default buildFormContainer;
