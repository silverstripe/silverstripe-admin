import buildBaseContainer from './buildBaseContainer';
import MiddlewareRegistry from './MiddlewareRegistry';

const buildReducerContainer = (base = buildBaseContainer()) => ({
  ...base,

  /**
   * The redux store which will be providing the global context for the reducer middleware
   * @type {object}
   */
  store: null,

  setStore(store) {
    this.store = store;
  },

  /**
   * Applies a middleware function to compose an existing component
   * with new properties.
   * Note: overrides base.customise because reducers do not have context
   *
   * @param {object} meta An object of metadata
   * @param {string} key The name of the dependency to customise
   * @param {function} factory The function that will compose the dependency. Gets passed the
   *  previous state of composition
   */
  customise(meta, key, factory) {
    this.isProtected();

    let registry = this.middlewareRegistries[key];
    if (!registry) {
      registry = new MiddlewareRegistry();
      this.middlewareRegistries = {
        ...this.middlewareRegistries,
        [key]: registry,
      };
    }
    const enhancedFactory = (service) => {
      const getState = this.store && this.store.getState;

      return factory(service)(getState);
    };
    registry.add(
      meta,
      enhancedFactory
    );
  },

  getAll() {
    const newFactories = (this.initialised)
      ? Object.entries(this.factories).reduce((prev, [key, factory]) => ({
        ...prev,
        [key]: factory(),
      }), {})
      // return the services registered if we haven't initialised yet.
      : Object.entries(this.services).reduce((prev, [key, service]) => ({
        ...prev,
        [key]: service,
      }), {});

    return newFactories;
  },
});

export default buildReducerContainer;
