import React from 'react';
import Injector from './Container';

function provideInjector(Injectable) {
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
      return <Injectable {...this.props} />;
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
