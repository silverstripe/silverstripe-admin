import React, { Component } from 'react';
import Injector from './Container';
import injectorContext from './injectorContext';

function provideInjector(Injectable, injectorContainer = Injector) {
  class InjectorProvider extends Component {
    getChildContext() {
      const { component, form, query } = injectorContainer;

      return {
        injector: {
          query: query.get.bind(query),
          get: component.get.bind(component),
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
