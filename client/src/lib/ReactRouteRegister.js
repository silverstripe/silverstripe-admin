/* global window */
/**
 * ReactRouteRegister is the interface developers should use to register routes with
 * the main client application. Routes should not be registered with react-router directly.
 *
 * Register routes using the `DOMContentLoaded` event in your controller file.
 *
 * __controller.js__
 * ```
 * import reactRouteRegister from 'lib/ReactRouteRegister';
 * import MyComponent from 'containers/MyComponent';
 *
 * document.addEventListener('DOMContentLoaded', () => {
 *   reactRouteRegister.add({
 *     path: 'parent/route',
 *     component: ParentComponent
 *   });
 *   reactRouteRegister.add({
 *     path: 'child/route',
 *     component: ChildComponent
 *   }, ['parent/route']);
 * });
 * ```
 * All routes registered with `ReactRouteRegister` are applied to react-router in `appBoot()`
 *
 * @class
 */
class ReactRouteRegister {
  constructor() {
    this.reset();
  }

  /**
   * Resets all routes to the default
   */
  reset() {
    this.childRoutes = [];
    this.rootRoute = {
      path: '/',
      routes: () => this.getChildRoutes()
    };
  }

  /**
   * Updates the root configuration.
   * Use add() to set child routes.
   *
   * @param  {Object} route
   */
  updateRootRoute(route) {
    this.rootRoute = Object.assign({}, this.rootRoute, route);
  }

  /**
   * Register a new child route at a point in the route hierarchy
   * defined by the "paths" argument. Requires all parent routes to
   * be registered already. Overwrites an existing route with the same path.
   *
   * @see https://github.com/reactjs/react-router/blob/master/docs/guides/RouteConfiguration.md
   * @param {Object} route A react-router <PlainRoute> config object
   * @param {Array} parentPaths List of parent paths to nest this route inside.
   * Leave blank for childRoutes registered on the root configuration.
   */
  add(route, parentPaths = []) {
    // If the routes are for the root route, c
    if (route.path === this.rootRoute.path && Array.isArray(route.routes)) {
      this.childRoutes = route.routes.concat(this.childRoutes);
      return;
    }

    const routes = this.findChildRoute(parentPaths);

    // Ensure that every config has a routes key for later traversal
    const newRoute = Object.assign({}, { routes: [] }, route);

    // Ensure there's a "splat" route, which is required to match any further route segments
    // and give lazy routes a chance to load
    let splatRoute = newRoute.routes[newRoute.routes.length - 1];
    if (!splatRoute || splatRoute.path !== '**') {
      splatRoute = { path: '**' };
      newRoute.routes.push(splatRoute);
    }

    // Add route to correct place
    const newRouteIndex = routes.findIndex(childRoute => childRoute.path === route.path);
    if (newRouteIndex >= 0) {
      // Overwrite existing route
      routes[newRouteIndex] = newRoute;
    } else {
      // Add route at beginning of routes (higher precendence)
      // See https://github.com/reactjs/react-router/blob/master/docs/guides/RouteMatching.md
      routes.unshift(newRoute);
    }
  }

  /**
   * Find the child routes array using the given parent paths
   *
   * @param {Array} parentPaths
   * @returns {Array}
   */
  findChildRoute(parentPaths) {
    let childRoutes = this.childRoutes;

    // Traverse into route hierarchy, ignoring the root element
    if (parentPaths) {
      parentPaths.forEach(path => {
        const nextParent = childRoutes.find(childRoute => childRoute.path === path);
        if (!nextParent) {
          throw new Error(`Parent path ${path} could not be found.`);
        }
        childRoutes = nextParent.routes;
      });
    }

    return childRoutes;
  }

  /**
   * @return {Object} Configuration object for react-router.
   */
  getRootRoute() {
    return this.rootRoute;
  }

  /**
   * Get list of child routes
   *
   * @returns {Array} List of child routes
   */
  getChildRoutes() {
    return this.childRoutes;
  }

  /**
   * Remove the given path
   *
   * @param {String} path
   * @param {Array} parentPaths
   * @returns {Array} The removed route, if it exists
   */
  remove(path, parentPaths = []) {
    const childRoutes = this.findChildRoute(parentPaths);
    const routeIndex = childRoutes.findIndex(childRoute => childRoute.path === path);
    if (routeIndex < 0) {
      return null;
    }

    // Remove item and return
    return childRoutes.splice(routeIndex, 1)[0];
  }
}

/*
 * We're assigning an instances to the `ss` namespace because singletons only
 * work within the context on a single Browserify bundle.
 *
 * For example - the `lib` bundle exposes a singleton called `reactRouteRegister`.
 * If the `framework` imports `reactRouteRegister`, as an external dependency, then
 * all modules in `framework` will get the same copy of `register` when importing it.
 *
 * Likewise if the `custom` bundle imports `reactRouteRegister` as an external dependency,
 * all modules in `custom` will get the same copy of `reactRouteRegister`.
 *
 * This works as expected within the context of one bundle, all modules in that bundle
 * importing `reactRouteRegister` get the exact same copy, a singleton.
 *
 * However this is not true across bundles. While all modules in `framework` get a single
 * copy of `reactRouteRegister` and all modules in `custom` get a single copy of
 * `reactRouteRegister`, the copy of `reactRouteRegister` in `framework` is not
 * the same copy of `reactRouteRegister` available in `custom`.
 *
 * @TODO Look into SystemJS as a solution https://github.com/systemjs/systemjs
 */

window.ss = window.ss || {};
window.ss.routeRegister = window.ss.routeRegister || new ReactRouteRegister();

export default window.ss.routeRegister;
