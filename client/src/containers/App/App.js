import React from 'react';
import SilverStripeComponent from 'lib/SilverStripeComponent';
import { provideInjector } from 'lib/Injector';

/**
 * Empty container for the moment, will eventually contain the CMS menu`
 * and apply to document.body, rather than just one specific DOM element.
 */
class App extends SilverStripeComponent {
  render() {
    // TODO re-add <div className="app"> wrapper when applying to document.body
    return <div>{this.props.children}</div>;
    // const Child = React.Children.only(this.props.children);
    // return (Child);
  }
}

export default provideInjector(App);
