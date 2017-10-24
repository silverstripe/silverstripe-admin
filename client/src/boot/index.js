/* global window */
import BootRoutes from './BootRoutes';
import Injector from 'lib/Injector';
import { combineReducers, createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import Config from 'lib/Config';
import buildApolloClient from 'boot/buildApolloClient';
import { setConfig } from 'state/config/ConfigActions';
import registerComponents from 'boot/registerComponents';
import registerReducers from 'boot/registerReducers';
import applyDevtools from 'boot/applyDevtools';
import applyTransforms from 'boot/applyTransforms';

window.ss = window.ss || {};

function appBoot() {
  const baseUrl = Config.get('absoluteBaseUrl');
  const apolloClient = buildApolloClient(baseUrl);
  const apolloReducer = apolloClient.reducer();

  registerComponents();
  registerReducers({
    apollo: apolloReducer,
  });
  const middleware = [
    thunkMiddleware,
    apolloClient.middleware(),
  ];
  const debugging = Config.get('debugging');
  let runMiddleware = applyMiddleware(...middleware);

  if (debugging) {
    runMiddleware = applyDevtools(runMiddleware);
  }

  const createStoreWithMiddleware = runMiddleware(createStore);

  // need to build initial state of reducers for booting earlier
  const rootReducer = combineReducers(Injector.reducer.getAll());
  const store = createStoreWithMiddleware(rootReducer, {});

  // Set the initial config state.
  store.dispatch(setConfig(Config.getAll()));
  Injector.reducer.setStore(store);

  // Expose store stuff for legacy use
  window.ss.store = store;
  window.ss.apolloClient = apolloClient;

  // @todo - Remove once we remove entwine
  // Enable top-level css selectors for react-dependant entwine sections
  if (window.jQuery) {
    window.jQuery('body').addClass('js-react-boot');
  }

  // Bootstrap routing
  const routes = new BootRoutes(store, apolloClient);

  // Apply any injector transformations
  applyTransforms();

  Injector.ready(() => {
    // add any possible new reducers that were registered
    const newReducer = combineReducers(Injector.reducer.getAll());
    store.replaceReducer(newReducer);

    routes.start(window.location.pathname);
    if (window.jQuery) {
      window.jQuery('body').addClass('js-injector-boot');
    }
  });

  // Force this to the end of the execution queue to ensure it's last.
  window.setTimeout(() => Injector.load(), 0);
}
window.onload = appBoot;
