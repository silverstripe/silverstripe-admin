import toposort from 'toposort';
import { compose } from 'redux';

/**
 * Store of middleware functions for composing dependencies
 * @type Object
 */
const middlewares = {};

/**
 * A map of service names to factories
 * @type Object
 */
const container = {};

/**
 * @type {string}
 */
const BEFORE = 'before';

/**
 * @type {string}
 */
const AFTER = 'after';

/**
 * @type {string}
 */
const GRAPH_HEAD = '__HEAD__';

/**
 * @type {string}
 */
const GRAPH_TAIL = '__TAIL__';

/**
 * A list of allowed priorities that can be specified as metadata
 * @type array
 */
const PRIORITIES = [BEFORE, AFTER];

/**
 * When true, DI is blocked
 * @type {boolean}
 */
let initialised = false;

/**
 * Validates the metadata passed to the injector customisation
 * @param meta
 */
const validateMeta = (meta) => {
  PRIORITIES.forEach(k => {
    if (
      typeof meta[k] !== 'undefined' &&
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
 * e.g. my-transformation(TextField)
 * @param original The original registered component
 * @param transforms The list of transformation names that modified the component
 */
const createDisplayName = (original, transforms) => {
  const componentName = (original.displayName || original.name || 'Component');
  const names = [componentName, ...transforms];

  return names.reduce((acc, curr) => `${curr}(${acc})`);
};

/**
 * Ensures that the priority keys are arrays, and that before/after is set
 * @param middlewareList
 * @returns object
 */
const normaliseMiddlewares = (middlewareList) => (
  middlewareList.map(middleware => {
    const normalised = { ...middleware };
    // make sure before/after are at least empty arrays
    PRIORITIES.forEach(k => {
      if (!Array.isArray(middleware[k])) {
        normalised[k] = middleware[k] ? [middleware[k]] : [];
      } else {
        normalised[k] = middleware[k];
      }
    });
    // If no before/after is specified, put it between the head and tail
    if (PRIORITIES.every(p => !normalised[p].length)) {
      normalised[AFTER] = [GRAPH_HEAD];
      normalised[BEFORE] = [GRAPH_TAIL];
    }
    return normalised;
  })
);

/**
 * Validates the use of a wildcard (*) specification on a middleware object.
 * It should:
 * -- Be singular
 *  BAD: { after: ['*', 'something-else'] }
 *  GOOD: { after: ['*'] }
 * -- Be the only priority rule
 *   BAD: { after: ['*'], before: 'something' }
 *   GOOD: { after: ['*'] }
 * @param middleware
 * @returns The priority (before/after) of the wildcard being used
 */
const checkWildcard = (middleware) => {
  let wildcard = null;
  PRIORITIES.forEach(PRIORITY => {
    if (middleware[PRIORITY].includes('*')) {
      if (middleware[PRIORITY].length > 1) {
        throw new Error(`
          Key ${PRIORITY} on ${middleware.name} should only specify one key 
          if using the "*" wildcard
        `);
      } else if (wildcard) {
        throw new Error(`
          Cannot specify a ${PRIORITY} rule on ${middleware.name} if a wildcard 
          has been specified
        `);
      } else {
        wildcard = PRIORITY;
      }
    }
  });

  return wildcard;
};

/**
 * Applies a topological sort to the middlewares and resolves
 * priority declarations
 * @param middlewareList
 * @returns {Array}
 */
const sortMiddlewares = (middlewareList) => {
  /* Initialise the graph with head and tail placeholders so that customisations
  with no before/after specified have a reference point */
  const GRAPH_INIT = [GRAPH_HEAD, GRAPH_TAIL];
  const graph = [GRAPH_INIT];
  let sortedMiddlewares = [];
  // Ensure all the middleware objects have the right shape
  const normalisedMiddlewares = normaliseMiddlewares(middlewareList);
  normalisedMiddlewares.forEach(middleware => {
    const { name } = middleware;
    const wildcard = checkWildcard(middleware);
    if (wildcard === AFTER) {
      graph.push([GRAPH_TAIL, name]);
    } else if (wildcard === BEFORE) {
      graph.push([name, GRAPH_HEAD]);
    } else {
      // Everything, other than wildcards, goes between head and tail
      // at a minimum
      graph.push([name, GRAPH_TAIL]);
      graph.push([GRAPH_HEAD, name]);

      middleware[BEFORE].forEach(beforeEntry => {
        graph.push([name, beforeEntry]);
      });
      middleware[AFTER].forEach(afterEntry => {
        graph.push([afterEntry, name]);
      });
    }
  });
  // Apply the topological sort and strip out the placeholders
  toposort(graph)
    .filter(item => !GRAPH_INIT.includes(item))
    .forEach(name => {
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
const reset = (silent) => {
  // eslint-disable-next-line no-console
  if (!silent) {
    console.warn(`
      Injector.__reset__() should only be used in dev mode. Using
      this method in production will likely break.
    `);
  }
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
 *  previous state of composition
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
 * Injector.transform('my-transformation-name', (update) => {
 *  update('SomeComponent', MyNewComponentCreator);
 * }, { before: 'another-transform' });
 * @param name The name of the transformation
 * @param callback
 * @param priorities An object mapping priorities for the loading order:
 *  { before: 'some-transformation', after: 'some-other-transformation' }
 */
const transform = (name, callback, priorities = {}) => {
  const meta = { name, ...priorities };
  validateMeta(meta);
  callback(
    (key, wrapper, displayName) => {
      customise({ ...meta, displayName }, key, wrapper);
    }
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
      const names = sortedMiddlewares.map(m => m.displayName || m.name);
      const composed = compose(...factories)(service);
      composed.displayName = createDisplayName(service, names);
      container[key] = composed;
    }
  });
  initialised = true;
};

// Public API
const Container = {
  get,
  load,
  transform: protect(transform),
  register: protect(register),
};
if (process.env.NODE_ENV !== 'production') {
  Container.__reset__ = reset;
}

export default Container;
