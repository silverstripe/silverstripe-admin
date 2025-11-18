import React, { Component } from 'react';
import Injector from './Container';
import contextType from './contextType';
import InjectorContext from './InjectorContext';
// import { GLOBAL_CONTEXT } from './MiddlewareRegistry';

const createContextValue = (component, form) => ({
  // context: GLOBAL_CONTEXT,
  get: component.get.bind(component),
  validate: form.getValidation.bind(form),
});

const provideInjector = (Injectable, injectorContainer = Injector) => {
  class InjectorProvider extends Component {
    // Legacy context API
    getChildContext() {
      const { component, form } = injectorContainer;
      return {
        injector: createContextValue(component, form),
      };
    }

    render() {
      const { component, form } = injectorContainer;
      const contextValue = createContextValue(component, form);
      // Modern context API
      return (
        <InjectorContext.Provider value={contextValue}>
          <Injectable {...this.props} />
        </InjectorContext.Provider>
      );
    }
  }

  // Legacy context API
  InjectorProvider.childContextTypes = contextType;

  return InjectorProvider;
};

export default provideInjector;
