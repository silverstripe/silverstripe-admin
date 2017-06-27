import BootRoutes from './BootRoutes';
import Injector from 'lib/Injector';
import { combineReducers, createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { reducer as ReduxFormReducer } from 'redux-form';
import { routerReducer } from 'react-router-redux';
import Config from 'lib/Config';
import buildApolloClient from 'boot/buildApolloClient';
import applyFormMiddleware from '../lib/dependency-injection/applyFormMiddleware';
import ReducerRegister from 'lib/ReducerRegister';
import { setConfig } from 'state/config/ConfigActions';
import ConfigReducer from 'state/config/ConfigReducer';
import SchemaReducer from 'state/schema/SchemaReducer';
import RecordsReducer from 'state/records/RecordsReducer';
import BreadcrumbsReducer from 'state/breadcrumbs/BreadcrumbsReducer';
// import UnsavedFormsReducer from 'state/unsavedForms/UnsavedFormsReducer';
import MobileMenuReducer from 'state/mobileMenu/MobileMenuReducer';
import registerComponents from 'boot/registerComponents';
import TreeDropdownFieldReducer from 'state/treeDropdownField/TreeDropdownFieldReducer';
import applyDevtools from 'boot/applyDevtools';

window.ss = window.ss || {};

function appBoot() {
  const baseUrl = Config.get('absoluteBaseUrl');
  const apolloClient = buildApolloClient(baseUrl);

  const FormReducer = applyFormMiddleware(
    combineReducers({
      formState: ReduxFormReducer,
      formSchemas: SchemaReducer,
    })
  );

  ReducerRegister.add('config', ConfigReducer);
  ReducerRegister.add('form', FormReducer);
  ReducerRegister.add('records', RecordsReducer);
  ReducerRegister.add('breadcrumbs', BreadcrumbsReducer);
  ReducerRegister.add('routing', routerReducer);
  ReducerRegister.add('apollo', apolloClient.reducer());
  ReducerRegister.add('treeDropdownField', TreeDropdownFieldReducer);
  // @todo - Restore this once we address https://github.com/silverstripe/silverstripe-admin/issues/90
  // ReducerRegister.add('unsavedForms', UnsavedFormsReducer);
  ReducerRegister.add('mobileMenu', MobileMenuReducer);

  // Force this to the end of the execution queue to ensure it's last.
  window.setTimeout(() => {
    registerComponents();
    Injector.load();
  }, 0);

  const rootReducer = combineReducers(ReducerRegister.getAll());
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
  const store = createStoreWithMiddleware(rootReducer, {});

  // Set the initial config state.
  store.dispatch(setConfig(Config.getAll()));

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

  // Force this to the end of the execution queue to ensure it's last.
  window.setTimeout(() => {
    registerComponents();
    Injector.load();
    routes.start(window.location.pathname);
  }, 0);
}
window.onload = appBoot;
