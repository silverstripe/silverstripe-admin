/* global window, document */
/* eslint-disable
 no-alert
*/
import $ from 'jquery';
import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, createRoutesFromElements, RouterProvider } from 'react-router-dom';
import Config from 'lib/Config';
import pageRouter from 'lib/Router';
import reactRouteRegister from 'lib/ReactRouteRegister';
import App from 'containers/App/App';
import { ApolloProvider } from '@apollo/client';
import i18n from 'i18n';
import { isDirty } from 'redux-form';
import getFormState from 'lib/getFormState';
import { Route } from 'react-router';
import { joinUrlPaths } from 'lib/urls';
import NavigationBlocker from '../components/NavigationBlocker/NavigationBlocker';

/**
 * Bootstraps routes
 */
class BootRoutes {
  /**
   * @param {Object} store Redux store
   * @param {Object} client The Apollo client
   */
  constructor(store, client) {
    this.store = store;
    this.client = client;

    // pageRouter must be initialised, regardless of whether we are
    // using page.js routing for this request.
    const base = Config.get('absoluteBaseUrl');
    pageRouter.setAbsoluteBase(base);

    this.shouldConfirmBeforeUnload = this.shouldConfirmBeforeUnload.bind(this);
  }

  setStore(store) {
    this.store = store;
  }

  setClient(client) {
    this.client = client;
  }

  /**
   * Conditionally registers routes either as legacy (via page.js) or react-route powered routes
   *
   * @param {String} location Current location to check
   */
  start(location) {
    // Decide which router to use, check for React routes first
    if (this.matchesReactRoute(location)) {
      this.initReactRouter();
    } else {
      // Check legacy last, as `LeftAndMain` should be the absolute last called
      this.initLegacyRouter();
    }

    // Legacy support – make sure we don't overwrite the `onbeforeunload`
    // handler in `LeftAndMain.EditForm.js` but run it after the new handler.
    const currBeforeUnload = window.onbeforeunload;
    window.onbeforeunload = () => {
      if (this.shouldConfirmBeforeUnload()) {
        return i18n._t('Admin.CONFIRMUNSAVEDSHORT', 'WARNING: Your changes have not been saved.');
      }

      if (typeof currBeforeUnload === 'function') {
        return currBeforeUnload();
      }

      return undefined;
    };
  }

  /**
   * Determine if the given location matches a react route.
   *
   * @param {String} location URL
   * @return {Boolean} True if this is a react route
   */
  matchesReactRoute(location) {
    const sections = Config.get('sections');
    const currentPath = pageRouter.resolveURLToBase(location).replace(/\/$/, '');

    // Check if the current url matches a react route
    return !!sections.find((section) => {
      const route = pageRouter.resolveURLToBase(section.url).replace(/\/$/, '');

      // Skip non-react routes
      if (!section.reactRouter) {
        return false;
      }

      // Check if the beginning of the route is the same as the current location.
      // Since we haven't decided on a router yet, we can't use it for route matching.
      return currentPath.match(`${route}(/|$)`);
    });
  }

  /**
   * Initialise routing to use react-route powered routing
   */
  initReactRouter() {
    reactRouteRegister.updateRootRoute({ component: App });
    const rootRoute = reactRouteRegister.getRootRoute();
    const router = createBrowserRouter(
      createRoutesFromElements(
        <Route
          path={rootRoute.path}
          element={
            <rootRoute.component>
              <NavigationBlocker shouldBlockFn={this.shouldConfirmBeforeUnload} blockMessage={this.getUnsavedChangesMessage()} />
            </rootRoute.component>
            }
        >
          {reactRouteRegister.getChildRoutes().map(
            (route) => (
              <Route key={route.path} path={route.path} element={<route.component />} />
            )
          )}
        </Route>
      ),
      { basename: joinUrlPaths(Config.get('baseUrl'), Config.get('adminUrl')) }
    );

    createRoot(document.getElementsByClassName('cms-content')[0]).render(
      <ApolloProvider client={this.client}>
        <ReduxProvider store={this.store}>
          <RouterProvider router={router} />
        </ReduxProvider>
      </ApolloProvider>
    );
  }

  /**
   * Initialise routing to use page.js powered legacy routing for non-react sections
   */
  initLegacyRouter() {
    const sections = Config.get('sections');
    const store = this.store;

    pageRouter('*', (ctx, next) => {
      const msg = this.getUnsavedChangesMessage();
      if (!this.shouldConfirmBeforeUnload() || window.confirm(msg)) {
        // eslint-disable-next-line no-param-reassign
        ctx.store = store;
        next();
      }
    });

    // Register all top level routes.
    // This can be removed when top level sections are converted to React,
    // have their own JavaScript controllers, and register their own routes.
    let lastPath = null;
    sections.forEach((section) => {
      let route = pageRouter.resolveURLToBase(section.url);
      route = route.replace(/\/$/, ''); // Remove trailing slash
      route = `${route}(/*?)?`; // add optional trailing slash

      // page.js based routing, excludes any React-powered sections
      pageRouter(route, (ctx, next) => {
        if (document.readyState !== 'complete' || ctx.init) {
          next();
          return;
        }
        // Bootstrap on initial load
        if (!lastPath) {
          lastPath = window.location.pathname;
        }

        // When navigating from a non-react route to a react route, we must
        // completely load the page for react's router to kick in.
        if (ctx.state?.path && this.matchesReactRoute(ctx.state.path)) {
          // Add the current path to the history so we can go back to it
          history.pushState({}, '');
          // Navigate to the new path
          window.location = ctx.state.path;
          return;
        }

        // Verify that this is a true state change. E.g. not a hash change.
        // This emulates behaviour of old html history.js
        const forceReload = ctx.state && ctx.state.__forceReload;
        if (ctx.path !== lastPath || forceReload) {
          // Load the panel and stop processing routes.
          lastPath = ctx.path.replace(/#.*$/, '');
          $('.cms-container')
            .entwine('ss')
            .handleStateChange(null, ctx.state);
        }
      });
    });

    // Hack: Initialise react event delegation prior to starting the page router.
    // Without this, react event delegation isn't initialised until the first component
    // with an event handler is rendered, which means the page router will intercept
    // events that should be caught by react component event handlers.
    // Note that this empty link is rendered into an element that doesn't exist in the DOM.
    const root = createRoot(document.createElement('div'));
    root.render(<a role="none" onClick={() => {}} />);

    // Start the page router
    pageRouter.start();
  }

  /**
   * Return `true` if there are forms with unsaved changes. Return `false`
   * otherwise.
   *
   * @return {Boolean}
   */
  shouldConfirmBeforeUnload() {
    const state = this.store.getState();
    const forms = state.unsavedForms || [];
    const schemas = state.form.formSchemas;

    const changedForms = forms.filter((form) => {
      const schema = Object.values(schemas).find(item => item.name === form.name);

      const notify = schema && schema.state && schema.state.notifyUnsavedChanges;

      if (!notify) {
        return false;
      }

      return isDirty(form.name, getFormState)(state);
    });

    return changedForms.length > 0;
  }

  getUnsavedChangesMessage() {
    return i18n._t('Admin.CONFIRMUNSAVED', `Are you sure you want to navigate away
    from this page?\n\nWARNING: Your changes have not been saved.\n\n
    Press OK to continue, or Cancel to stay on the current page.`);
  }
}

export default BootRoutes;
