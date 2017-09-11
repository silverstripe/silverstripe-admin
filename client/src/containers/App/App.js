import React from 'react';
import { provideInjector } from 'lib/Injector';

/**
 * Empty container for the moment, will eventually contain the CMS menu`
 * and apply to document.body, rather than just one specific DOM element.
 */
const App = (props) => (
  <div className="app">{props.children}</div>
);

export default provideInjector(App);
