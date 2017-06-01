const buildInjectorContainer = () => ({
  /**
   * A map of services
   * @type {object}
   */
  services: {},

  /**
   * When true, DI is blocked
   * @type {boolean}
   */
  initialised: false,

  /**
   * Register a service for the injector to provide
   *
   * @param key
   * @param value
   * @param force
   */
  register(key, value, { force } = {}) {
    if (this.initialised) {
      throw new Error('Cannot mutate DI container after it has been initialised');
    }
    if (this.services[key] && force !== true) {
      throw new Error(`
      Tried to register service ${key} more than once. This practice is discouraged. Consider
      using Injector.update() to enhance the service rather than override it completely.
      Otherwise, invoke the register() function with { force: true } as the third argument.
     `);
    }
    if (!value ||
      typeof value.load !== 'function' ||
      typeof value.customise !== 'function' ||
      typeof value.get !== 'function' ||
      typeof value.register !== 'function'
    ) {
      throw new Error(`
      Tried to register service ${key} that is not a valid object, Injector requires an object
      which contains the following methods:
        - load
        - customise
        - get
        - register
      `);
    }
    this.services[key] = value;

    // globally expose the service as well
    this[key] = value;
  },

  /**
   * Loads each service that was registered
   */
  load() {
    if (this.initialised) {
      throw new Error('Cannot mutate DI container after it has been initialised');
    }
    Object.keys(this.services)
      .forEach(key => this.services[key].load());

    this.initialised = true;
  },

  /**
   * Provides an object to a callback which allows quick access to individual services
   *
   * @param {string} name The name of the transformation
   * @param {function} callback
   * @param {object} priorities An object mapping priorities for the loading order:
   *  { before: 'some-transformation', after: 'some-other-transformation' }
   */
  transform(name, callback, priorities = {}) {
    if (this.initialised) {
      throw new Error('Cannot mutate DI container after it has been initialised');
    }

    const updater = Object.keys(this.services).reduce(
      (updateContainer, serviceName) => {
        const service = this.services[serviceName];

        return {
          ...updateContainer,
          [serviceName]: (key, wrapper, displayName) => {
            service.customise({ name, ...priorities, displayName }, key, wrapper);
          },
        };
      },
      {}
    );
    callback(updater);
  },
});

export default buildInjectorContainer;
