import Bottle from 'bottlejs';
import { compose } from 'redux';

// Bottle JS instance
const di = new Bottle();

/**
 * Store of middleware functions for composing dependencies
 * @type Object
 */
const middlewares = {};

/**
 * When true, DI is blocked
 * @type {boolean}
 */
let frozen = false;

/**
 * Wrapper function to enforce frozen state of DI container
 * @param func
 * @returns function
 */
const protect = (func) => {
  if (frozen) {
    throw new Error('Cannot mutate DI container after it has been initialised');
  }
  return (...params) => func(...params);
}

/**
 * Gets a dependency
 * @param key
 * @returns Component
 */
export const get = (key) => {
  if (!di.container[key]) {
    throw new Error(`Injector.get(): Component ${key} does not exist`);
  }
  return di.container[key];
};

/**
 * Applies a middleware function to compose an existing component
 * with new properties
 * @param key The name of the dependency to customise
 * @param factory The function that will compose the dependency. Gets passed the previous state of composition
 */
export const customise = protect((key, factory) => {
  if (!middlewares[key]) middlewares[key] = [];
  middlewares[key].push(factory);
});

/**
 * Register a dependency. This is the initial version of a depenency that will be
 * passed to the first link in the middleware chain (if any customisations exist)
 * @param key The name of the dependency to register
 * @param Component The component to register
 */
export const register = protect((key, value) => {
  di.factory(
    key,
    () => compose(...(middlewares[key] || []))(value)
  );
});

/**
 * Freeze the DI layer
 */
export const freeze = function () {
  frozen = true;
};
