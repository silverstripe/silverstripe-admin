import React, { Component } from 'react';
import Injector from './Container';
import injectorContext from './injectorContext';

function provideInjector(Injectable, injectorContainer = Injector) {
  class InjectorProvider extends Component {
    getChildContext() {
      const { component, form } = injectorContainer;
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

  InjectorProvider.childContextTypes = injectorContext;

  return InjectorProvider;
}

export default provideInjector;
