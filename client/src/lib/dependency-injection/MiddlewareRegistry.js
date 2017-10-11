import toposort from 'toposort';

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
 * @type {Array}
 */
const PRIORITIES = [BEFORE, AFTER];

/**
 * The name of the default context, if none is given
 * @type {string}
 */
const GLOBAL_CONTEXT = '__GLOBAL__';

/**
 * The wildcard operator, used for priorities
 * @type {string}
 */
const WILDCARD = '*';

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
      throw new Error(`Middleware key ${k} must be a string or array`);
    }
  });
};

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
    if (middleware[PRIORITY].includes(WILDCARD)) {
      if (middleware[PRIORITY].length > 1) {
        throw new Error(`
          Key ${PRIORITY} on ${middleware.name} should only specify one key 
          if using the "${WILDCARD}" wildcard
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
 * The public API of the middleware registry. Holds a set of middlewares
 * for a given service and negotiates priorities and contexts to create
 * a factory. Factories are cached for each context.
 */
class MiddlewareRegistry {
  /**
   * Constructor
   */
  constructor() {
    this._middlewares = [];
    this._contextCache = {};
  }

  /**
   * Applies a topological sort to the middlewares and resolves
   * priority declarations
   */
  sort() {
    /* Initialise the graph with head and tail placeholders so that customisations
     with no before/after specified have a reference point */
    const GRAPH_INIT = [GRAPH_HEAD, GRAPH_TAIL];
    const graph = [GRAPH_INIT];
    let sortedMiddlewares = [];
    this._middlewares.forEach(middleware => {
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
          this._middlewares.filter(m => m.name === name)
        );
      });

    this._middlewares = sortedMiddlewares;

    return this;
  }

  /**
   * Adds new middleware to the list
   * @param {object} meta An object of meta data { name, before, after }
   * @param {function} factory The middleware (decorator) to apply to the service
   * @param {Array} contextList An array of hierarchical context, ['Universe', 'Earth', 'NZ']
   */
  add(meta, factory, contextList) {
    validateMeta(meta);

    // Invalidate the cache when new middlewares are added
    this._contextCache = {};
    let context = contextList;
    if (!context || !context.length) {
      context = [GLOBAL_CONTEXT];
    } else if (!Array.isArray(context)) {
      context = [context];
    }

    const normalised = { ...meta, factory, context };
    // make sure before/after are at least empty arrays
    PRIORITIES.forEach(k => {
      if (!Array.isArray(meta[k])) {
        normalised[k] = meta[k] ? [meta[k]] : [];
      } else {
        normalised[k] = meta[k];
      }
    });
    // If no before/after is specified, put it between the head and tail
    if (PRIORITIES.every(p => !normalised[p].length)) {
      normalised[AFTER] = [GRAPH_HEAD];
      normalised[BEFORE] = [GRAPH_TAIL];
    }

    this._middlewares.push(normalised);

    return this;
  }

  /**
   * Given a dot-separated context spec, find all the registered middlewares that apply
   * @param {string} context
   * @returns {Array}
   */
  getMatchesForContext(context = GLOBAL_CONTEXT) {
    if (!this._contextCache[context]) {
      const requestedContext = context.split('.');
      this._contextCache[context] = this._middlewares.filter(middleware => (
        middleware.context[0] === GLOBAL_CONTEXT ||
        middleware.context.every((part, index) => (
          part === WILDCARD || requestedContext[index] === part
        ))
      ));
    }
    return this._contextCache[context];
  }
}

export { GLOBAL_CONTEXT };

export default MiddlewareRegistry;
