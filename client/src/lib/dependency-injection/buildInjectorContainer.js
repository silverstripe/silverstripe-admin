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

  callbacks: [],

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

    if (typeof this[key] !== 'undefined' && !this.services[key]) {
      throw new Error(`
      Tried to register service ${key} which is a reserved keyword. This would affect the behaviour
      of this API class, so it is forbidden to register with Injector.
      `);
    }

    const requiredMethods = ['load', 'createTransformer', 'get', 'register'];
    if (!requiredMethods.every(method => typeof value[method] === 'function')) {
      throw new Error(`
      Tried to register service ${key} that is not a valid object, Injector requires an object
      which contains the following methods: ${requiredMethods.join(', ')}
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
    Object.values(this.services)
      .forEach(service => service.load());

    this.initialised = true;
    this.callbacks.forEach((callback) => {
      callback();
    });
    this.callbacks = [];
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

    const updater = Object.entries(this.services).reduce(
      (updateContainer, [serviceName, service]) => ({
        ...updateContainer,
        [serviceName]: service.createTransformer(name, priorities),
      }),
      {}
    );
    callback(updater);
  },

  ready(callback) {
    if (typeof callback !== 'function') {
      throw new Error('Callback provided is not a function');
    }
    if (this.initialised) {
      callback();
      return;
    }

    this.callbacks = [
      ...this.callbacks,
      callback,
    ];
  },
});

export default buildInjectorContainer;
