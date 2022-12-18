import React from 'react';
import { provideInjector } from 'lib/Injector';
import { Outlet } from 'react-router';

/**
 * Empty container for the moment, will eventually contain the CMS menu`
 * and apply to document.body, rather than just one specific DOM element.
 */
const App = () => (
  <div className="app"><Outlet /></div>
);

export default provideInjector(App);
