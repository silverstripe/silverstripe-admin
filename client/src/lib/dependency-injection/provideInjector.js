import React from 'react';
import Injector from './Container';

function provideInjector(Component) {
  class InjectorProvider extends React.Component {
    getChildContext() {
      const { get } = Injector;
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
      get: React.PropTypes.func,
    }),
  };

  return InjectorProvider;
}

export default provideInjector;
