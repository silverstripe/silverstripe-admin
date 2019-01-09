import React from 'react';
import { provideInjector } from 'lib/Injector';
import { renderRoutes } from 'react-router-config';

/**
 * Empty container for the moment, will eventually contain the CMS menu`
 * and apply to document.body, rather than just one specific DOM element.
 */
const App = ({ route }) => (
  <div className="app">{renderRoutes(route.routes())}</div>
);

export default provideInjector(App);
