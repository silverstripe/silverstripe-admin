import React, { Component } from 'react';
import contextType from './injectorContext';

const provideContext = (context) => (ContextualComponent) => {
  class ContextProvider extends Component {
    getChildContext() {
      return {
        injector: {
          ...this.context.injector,
          context,
        },
      };
    }

    render() {
      return <ContextualComponent {...this.props} />;
    }
  }

  ContextProvider.contextTypes = contextType;

  ContextProvider.childContextTypes = contextType;

  return ContextProvider;
};

export default provideContext;
