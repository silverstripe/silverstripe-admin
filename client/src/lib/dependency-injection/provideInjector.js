import React from 'react';
import { get } from './container.js';

function provideInjector(Component) {
  class InjectorProvider extends React.Component {
    getChildContext() {
      return {
        injector: { get },
      };
    }

    render() {
      return <Component {...this.props} />;
    }
  }

  InjectorProvider.childContextTypes = {
    injector: React.PropTypes.shape({
      get: React.PropTypes.func
    }),
  };

  return InjectorProvider;
}

export {
  provideInjector,
};
