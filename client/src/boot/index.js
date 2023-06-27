/* global window */
import Injector from 'lib/Injector';
import { combineReducers, createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import Config from 'lib/Config';
import buildApolloClient from 'boot/apollo/buildClient';
import { setConfig } from 'state/config/ConfigActions';
import registerComponents from 'boot/registerComponents';
import registerReducers from 'boot/registerReducers';
import applyDevtools from 'boot/applyDevtools';
import applyTransforms from 'boot/applyTransforms';
import BootRoutes from './BootRoutes';

window.ss = window.ss || {};

async function appBoot() {
  const baseUrl = Config.get('absoluteBaseUrl');
  const apolloClient = await buildApolloClient(baseUrl);
  registerComponents();
  registerReducers();
  const middleware = [
    thunkMiddleware
  ];
  const debugging = Config.get('debugging');
  let runMiddleware = applyMiddleware(...middleware);

  if (debugging) {
    runMiddleware = applyDevtools(runMiddleware);
  }

  const createStoreWithMiddleware = runMiddleware(createStore);

  // Expose store stuff for legacy use
  window.ss.apolloClient = apolloClient;

  // Bootstrap routing
  const routes = new BootRoutes(null, apolloClient);

  // Apply any injector transformations
  applyTransforms();

  Injector.init(() => {
    // need to build initial state of reducers for booting earlier
    const rootReducer = combineReducers(Injector.reducer.getAll());
    const store = createStoreWithMiddleware(rootReducer, {});

    // Set the initial config state.
    store.dispatch(setConfig(Config.getAll()));
    Injector.reducer.setStore(store);

    window.ss.store = store;

    routes.setStore(store);
    routes.start(window.location.pathname);

    // @todo - Remove once we remove entwine
    // Enable top-level css selectors for react-dependant entwine sections
    if (window.jQuery) {
      // need to separate class adds ...because entwine...
      window.jQuery('body')
        .addClass('js-react-boot')
        .addClass('js-injector-boot');
    }
  });

  // Force this to the end of the execution queue to ensure it's last.
  window.setTimeout(() => Injector.load(), 0);
}
window.onload = appBoot;
