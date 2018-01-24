/* global window, document */

import $ from 'jquery';
import React from 'react';
import ReactDOM from 'react-dom';
import { Router as ReactRouter, useRouterHistory } from 'react-router';
import useBeforeUnload from 'history/lib/useBeforeUnload';
import createHistory from 'history/lib/createBrowserHistory';
import Config from 'lib/Config';
import pageRouter from 'lib/Router';
import reactRouteRegister from 'lib/ReactRouteRegister';
import App from 'containers/App/App';
import { syncHistoryWithStore } from 'react-router-redux';
import { ApolloProvider } from 'react-apollo';
import i18n from 'i18n';
import { isDirty } from 'redux-form';
import getFormState from 'lib/getFormState';

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

    this.handleBeforeRoute = this.handleBeforeRoute.bind(this);
    this.handleBeforeUnload = this.handleBeforeUnload.bind(this);
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
      // TODO Limit full page load when transitioning from legacy to react route or vice versa
      return currentPath.match(route);
    });
  }

  /**
   * Initialise routing to use react-route powered routing
   */
  initReactRouter() {
    reactRouteRegister.updateRootRoute({
      component: App,
    });
    const history = syncHistoryWithStore(
      useRouterHistory(useBeforeUnload(createHistory))({
        basename: Config.get('baseUrl'),
      }),
      this.store
    );
    history.listenBeforeUnload(this.handleBeforeUnload);
    history.listenBefore(this.handleBeforeRoute);

    ReactDOM.render(
      <ApolloProvider store={this.store} client={this.client}>
        <ReactRouter
          history={history}
          routes={reactRouteRegister.getRootRoute()}
        />
      </ApolloProvider>,
      document.getElementsByClassName('cms-content')[0]
    );
  }

  /**
   * Initialise routing to use page.js powered legacy routing for non-react sections
   */
  initLegacyRouter() {
    const sections = Config.get('sections');
    const store = this.store;

    pageRouter('*', (ctx, next) => {
      const msg = i18n._t(
          'Admin.CONFIRMUNSAVED',
          `Are you sure you want to navigate away from this page?\n\n
          WARNING: Your changes have not been saved.\n\n
          Press OK to continue, or Cancel to stay on the current page.`
      );
      // eslint-disable-next-line no-alert
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

  handleBeforeUnload() {
    if (this.shouldConfirmBeforeUnload()) {
      return i18n._t('Admin.CONFIRMUNSAVEDSHORT', 'WARNING: Your changes have not been saved.');
    }

    return undefined;
  }

  handleBeforeRoute() {
    if (this.shouldConfirmBeforeUnload()) {
      return i18n._t('Admin.CONFIRMUNSAVED', `Are you sure you want to navigate away
          from this page?\n\nWARNING: Your changes have not been saved.\n\n
          Press OK to continue, or Cancel to stay on the current page.`);
    }

    return undefined;
  }
}

export default BootRoutes;
