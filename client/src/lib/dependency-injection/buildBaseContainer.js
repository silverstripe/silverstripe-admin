import MiddlewareRegistry, { GLOBAL_CONTEXT } from './MiddlewareRegistry';
import { compose } from 'redux';

const buildBaseContainer = () => ({
  /**
   * Store of middleware registries
   * @type {object}
   */
  middlewareRegistries: {},

  /**
   * A map of services
   * @type {object}
   */
  services: {},

  /**
   * A map of factories to the services
   * @type {object}
   */
  factories: {},

  factoryCache: {},

  /**
   * When true, DI is blocked
   * @type {boolean}
   */
  initialised: false,

  isProtected() {
    if (this.initialised) {
      throw new Error('Cannot mutate DI container after it has been initialised');
    }
  },

  /**
   * Gets a dependency
   * @param {string} key
   * @param {string} context A dot-separated context specification
   * @returns {object} Component
   */
  get(key, context) {
    if (!this.initialised) {
      throw new Error(`
      Injector.get(): Attempted to access DI layer before it was initialised.
      Did you forget to invoke Injector.load()?`
      );
    }
    const factory = this.factories[key];
    if (!factory) {
      throw new Error(`Injector.get(): Component ${key} does not exist`);
    }

    return factory(context);
  },

  /**
   * Applies a middleware function to compose an existing component
   * with new properties
   * @param {object} meta An object of metadata
   * @param {string} key The name of the dependency to customise
   * @param {function} factory The function that will compose the dependency. Gets passed the
   *  previous state of composition
   */
  customise(meta, key, factory) {
    this.isProtected();

    const [serviceName, ...context] = key.split('.');
    let registry = this.middlewareRegistries[serviceName];
    if (!registry) {
      registry = new MiddlewareRegistry();
      this.middlewareRegistries = {
        ...this.middlewareRegistries,
        [serviceName]: registry,
      };
    }
    registry.add(
      meta,
      factory,
      context
    );
  },

  /**
   * Resolve all of the middleware constraints and freeze the DI layer
   */
  load() {
    this.isProtected();
    this.factories = Object.keys(this.services)
      .reduce((factories, key) => {
        const middleware = this.middlewareRegistries[key];
        if (middleware) {
          middleware.sort();

          return {
            ...factories,
            [key]: (context = GLOBAL_CONTEXT) => {
              const cacheKey = `${key}__${context}`;
              if (!this.factoryCache[cacheKey]) {
                const matches = middleware.getMatchesForContext(context);
                this.factoryCache[cacheKey] = this.getFactory(key, matches);
              }

              return this.factoryCache[cacheKey];
            },
          };
        }
        return {
          ...factories,
          [key]: () => this.getFactory(key, []),
        };
      }, {});

    this.initialised = true;
  },

  /**
   * Register a dependency. This is the initial version of a dependency that will be
   * passed to the first link in the middleware chain (if any customisations exist)
   *
   * @param {string} key - The name of the dependency to register
   * @param {function} value - The component to register
   * @param {boolean} force - Whether to force the given key to override an existing key
   */
  register(key, value, { force } = {}) {
    this.isProtected();

    if (this.services[key] && force !== true) {
      throw new Error(`
      Tried to register service '${key}' more than once. This practice is discouraged. Consider
      using Injector.update() to enhance the service rather than override it completely.
      Otherwise, invoke the register() function with { force: true } as the third argument.
     `);
    }
    this.services = {
      ...this.services,
      [key]: value,
    };
  },

  /**
   * Register many dependencies. This will be a list of the initial version of a dependency that
   * will be passed to the first link in the middleware chain (if any customisations exist)
   *
   * @param {object} map - The name-value mapping of the dependencies to register
   * @param {boolean} force - Whether to force the given key to override an existing key
   */
  registerMany(map, { force } = {}) {
    this.isProtected();

    const mapKeys = Object.keys(map);
    const existing = Object.keys(this.services).filter((service) => (
      mapKeys.includes(service)
    ));
    if (existing.length && force !== true) {
      const list = existing.join(', ');

      throw new Error(`
      Tried to register services (${list}) more than once. This practice is discouraged. Consider
      using Injector.update() to enhance the service rather than override it completely.
      Otherwise, invoke the register() function with { force: true } as the third argument.
     `);
    }
    this.services = {
      ...this.services,
      ...map,
    };
  },

  /**
   * Updates the injector by callback. First parameter should contain
   * an object with keys for name, and (optional) "before" and "after" declarations
   * e.x.
   * Injector.transform('my-transformation-name', (update) => {
   *  update('SomeComponent', MyNewComponentCreator);
   * }, { before: 'another-transform' });
   * @param {string} name The name of the transformation
   * @param {function} callback
   * @param {object} priorities An object mapping priorities for the loading order:
   *  { before: 'some-transformation', after: 'some-other-transformation' }
   */
  transform(name, callback, priorities = {}) {
    this.isProtected();

    callback(this.createTransformer(name, priorities));
  },

  /**
   * Creates a customise() function for a transformation
   * @param {string} name
   * @param {object} priorities
   * @returns {function}
   */
  createTransformer(name, priorities) {
    return (key, wrapper) => {
      this.customise({ name, ...priorities }, key, wrapper);
    };
  },

  /**
   * Creates a factory method for a service, incorporating all the given middleware.
   * @param {string} key
   * @param {Array} middlewareMatches
   * @returns {function}
   */
  getFactory(key, middlewareMatches) {
    const service = this.services[key];
    const middlewares = middlewareMatches.map(m => m.factory);
    return compose(...middlewares)(service);
  },
});

export default buildBaseContainer;
