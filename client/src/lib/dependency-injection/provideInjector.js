import React from 'react';
import Injector from './Container';

function provideInjector(Component) {
  class InjectorProvider extends React.Component {
    getChildContext() {
      const { component, form } = Injector;
      const { get } = component;

      return {
        injector: {
          get: get.bind(component),
          validate: form.getValidation.bind(form),
        },
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
