import React from 'react';
import Injector from './Container';

function provideInjector(Component) {
  class InjectorProvider extends React.Component {
    getChildContext() {
      const react = Injector.react;
      const { get } = react;

      return {
        injector: { get: get.bind(react) },
      };
    }

    render() {
      return <Component {...this.props} />;
    }
  }

  InjectorProvider.childContextTypes = {
    injector: React.PropTypes.shape({
      get: React.PropTypes.func,
    }),
  };

  return InjectorProvider;
}

export default provideInjector;
