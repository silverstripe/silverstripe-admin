import React, { Component } from 'react';
import Injector from './Container';
import injectorContext from './injectorContext';
import InjectorFunctionalContext from './InjectorFunctionalContext';

/**
 * This provides injector for both legacy class components via childContext
 * as well as functional components via <InjectorContext.Provider>
 */
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
      const value = this.getChildContext();
      return <InjectorFunctionalContext.Provider value={value}>
        <Injectable {...this.props} />
      </InjectorFunctionalContext.Provider>;
    }
  }

  InjectorProvider.childContextTypes = injectorContext;

  return InjectorProvider;
}

export default provideInjector;
