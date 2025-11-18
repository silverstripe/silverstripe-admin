import provideInjector from './dependency-injection/provideInjector';
import provideContext from './dependency-injection/provideContext';
import withInjector from './dependency-injection/withInjector';
import inject from './dependency-injection/inject';
import loadComponent from './dependency-injection/loadComponent';
import Container from './dependency-injection/Container';
//
import injectHook from './dependency-injection/injectHook';
import useInjector from './dependency-injection/useInjector';
import useInjectedComponent from './dependency-injection/useInjectedComponent';

export {
  provideInjector,
  provideContext,
  withInjector,
  inject,
  loadComponent,
  // new
  injectHook,       // Modern functional component HOC
  useInjector,      // Hook for direct access ? should be called useInjectorContext ? (get rid of?)
  useInjectedComponent, // Hook for component resolution
};

export default Container;
