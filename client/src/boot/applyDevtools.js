/* global window */
import { compose } from 'redux';

export default function applyDevtools(middleware) {
  // use browser extension `compose` function if it's available
  // eslint-disable-next-line no-underscore-dangle
  const composeExtension = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
  // use browser extension devTools if it's available
  // this is the old way: `devToolsExtension` is being deprecated
  // eslint-disable-next-line no-underscore-dangle
  const devTools = window.__REDUX_DEVTOOLS_EXTENSION__ || window.devToolsExtension;

  if (typeof composeExtension === 'function') {
    // use compose from extension first
    return composeExtension(middleware);
  }
  if (typeof devTools === 'function') {
    // fallback to old way
    return compose(middleware, devTools());
  }
  return middleware;
}
