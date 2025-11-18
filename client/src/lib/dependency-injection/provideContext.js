import React, { Component } from 'react';
import contextType from './contextType';
import InjectorContext from './InjectorContext';

// TODO Possibly just revert this - don't think it's even used anywhere

const provideContext = (context) => (ContextualComponent) => {
  class ContextProvider extends Component {
    createContextValue() {
      return {
        ...this.context.injector,
        context,
      };
    }

    // Legacy context API
    getChildContext() {
      return {
        injector: this.createContextValue(),
      };
    }

    render() {
      const contextValue = this.createContextValue();
      // Modern context API
      return (
        <InjectorContext.Provider value={contextValue}>
          <ContextualComponent {...this.props} />
        </InjectorContext.Provider>
      );
    }
  }

  // Legacy context API
  ContextProvider.contextTypes = contextType;
  ContextProvider.childContextTypes = contextType;

  return ContextProvider;
};

export default provideContext;
