import toposort from 'toposort';
import { compose } from 'redux';

/**
 * Store of middleware functions for composing dependencies
 * @type Object
 */
const middlewares = {};

const container = {};

/**
 * A list of allowed priorities that can be specified as metadata
 * @type array
 */
const PRIORITIES = ['before', 'after'];
/**
 * When true, DI is blocked
 * @type {boolean}
 */
let initialised = false;

/**
 * Validates the metadata passed to the injector customisation
 * @param object
 */
const validateMeta = (meta) => {
  if (typeof meta.name === undefined) {
    throw new Error('Injector.update() called with no "name" property specified.');
  }
  PRIORITIES.forEach(k => {
    if (
      meta[k] !== undefined &&
      (typeof meta[k] !== 'string' && !Array.isArray(meta[k]))
    ) {
      throw new Error(`Injector.update() key ${k} must be a string or array`);
    }
  });
};

/**
 * Wrapper function to enforce frozen state of DI container
 * @param func
 * @returns function
 */
const protect = (func) => (...params) => {
  if (initialised) {
    throw new Error('Cannot mutate DI container after it has been initialised');
  }

  func(...params);
};

/**
 * Creates a display name for a final composed component given all
 * the names of the mutations that affected it.
 * e.g. my-module(TextField)
 * @param original The original registered component
 * @param module The list of module names that modified the component
 */
const createDisplayName = (original, modules) => {
  const componentName = (original.displayName || original.name || 'Component');
  const names = [componentName, ...modules];

  return names.reduce((acc, curr) => `${curr}(${acc})`);
};

/**
 * Ensures that the priority keys are arrays
 * @param middleware
 * @returns object
 */
const normaliseMiddleware = (middleware) => {
  const normalised = { ...middleware };
  PRIORITIES.forEach(k => {
    if (!Array.isArray(middleware[k])) {
      normalised[k] = middleware[k] ? [middleware[k]] : [];
    } else {
      normalised[k] = middleware[k];
    }
  });
  return normalised;
};

/**
 * Applies a topological sort to the middlewares and resolves
 * priority declarations
 * @param middlewareList
 * @returns {Array}
 */
const sortMiddlewares = (middlewareList) => {
  const graph = [];
  let sortedMiddlewares = [];

  middlewareList.forEach(entry => {
    const middleware = normaliseMiddleware(entry);
    const { name, before, after } = middleware;
    if (!before.length && !after.length) {
      after.push('*');
    }
    before.forEach(beforeEntry => {
      graph.push([name, beforeEntry]);
    });
    after.forEach(afterEntry => {
      graph.push([afterEntry, name]);
    });
  });

  /** @var Array sortedByName */
  const sortedByName = toposort(graph);
  sortedByName.forEach(name => {
    sortedMiddlewares = sortedMiddlewares.concat(
      middlewareList.filter(m => m.name === name)
    );
  });

  return sortedMiddlewares;
};

/**
 * Empties the state and restarts the injector. Should be used
 * only for testing purposes.
 */
const reset = () => {
  [middlewares, container].forEach(o => {
    // eslint-disable-next-line no-param-reassign
    Object.keys(o).forEach(k => delete o[k]);
  });

  initialised = false;
};

/**
 * Applies a middleware function to compose an existing component
 * with new properties
 * @param meta An object of metadata
 * @param key The name of the dependency to customise
 * @param factory The function that will compose the dependency. Gets passed the
 * previous state of composition
 */
const customise = (meta, key, factory) => {
  validateMeta(meta);
  if (!middlewares[key]) middlewares[key] = [];
  middlewares[key].push({ ...meta, factory });
};

/**
 * Register a dependency. This is the initial version of a dependency that will be
 * passed to the first link in the middleware chain (if any customisations exist)
 * @param key The name of the dependency to register
 * @param value The component to register
 * @param params
 */
const register = (key, value, params = {}) => {
  if (container[key] && params.force !== true) {
    throw new Error(`
      Tried to register service ${key} more than once. This practice is discouraged. Consider
      using Injector.update() to enhance the service rather than override it completely.
      Otherwise, invoke the register() function with { force: true } as the third argument.
     `);
  }
  container[key] = value;
};

/**
 * Gets a dependency
 * @param key
 * @returns Component
 */
const get = (key) => {
  if (!initialised) {
    throw new Error(`
      Injector.get(): Attempted to access DI layer before it was initialised.
      Did you forget to invoke Injector.load()?`
    );
  }
  if (!container[key]) {
    throw new Error(`Injector.get(): Component ${key} does not exist`);
  }
  return container[key];
};

/**
 * Updates the injector by callback. First parameter should contain
 * an object with keys for name, and (optional) "before" and "after" declarations
 * e.x.
 * Injector.update(
 *   {
 *     name: 'my-module',
 *     before: ['another-module']
 *   },
 *   wrap => {
 *      wrap('SomeComponent', MyNewComponentCreator);
 *   }
 * )
 * @param meta
 * @param callback
 */
const update = (meta, callback) => {
  validateMeta(meta);
  callback(
    (key, wrapper) => customise(meta, key, wrapper)
  );
};

/**
 * Resolve all of the middleware constraints and freeze the DI layer
 */
const load = function load() {
  Object.keys(middlewares).forEach(key => {
    if (middlewares.hasOwnProperty(key)) {
      const sortedMiddlewares = sortMiddlewares(middlewares[key]);
      const service = container[key];
      const factories = sortedMiddlewares.map(m => m.factory);
      const names = sortedMiddlewares.map(m => m.name);
      const composed = compose(...factories)(service);
      composed.displayName = createDisplayName(service, names);
      container[key] = composed;
    }
  });
  initialised = true;
};

// Public API
const ContainerAPI = {
  get,
  load,
  update: protect(update),
  register: protect(register),
};
if (process.env.NODE_ENV !== 'production') {
  ContainerAPI.__reset__ = reset;
}

export default ContainerAPI;
