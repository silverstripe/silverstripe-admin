/* global window */
import React, { Component, PropTypes } from 'react';
import { ApolloProvider } from 'react-apollo';
import provideInjector from './provideInjector';
import withInjector from './withInjector';
import Injector from './Container';

/**
 * Handles loading SilverStripe-centric providers
 * These options can be overridden by providing a context object
 *
 * Ensures that Injector is ready before the provided component will be rendered.
 *
 * @param targetName - properties include the following
 *    - store for the redux store
 *    - apolloClient for the apollo client (graphql)
 * @param context
 * @param overrideInjector
 */
const loadComponent = (targetName, context = {}, overrideInjector) => {
  class LegacyLoader extends Component {
    constructor(props) {
      super(props);

      this.state = {
        target: null,
      };
    }

    componentWillMount() {
      Injector.ready(() => {
        if (typeof targetName === 'string') {
          const target = this.context.injector.get(targetName);
          return this.setState({ target });
        }

        return this.setState({ target: targetName });
      });
    }

    render() {
      const Target = this.state.target;

      if (Target) {
        if (context) {
          // allows for submitting partial store or client
          const fullContext = { ...window.ss, ...context };
          const {
            store,
            apolloClient: client,
          } = fullContext;
          return (
            <ApolloProvider store={store} client={client}>
              <Target {...this.props} />
            </ApolloProvider>
          );
        }
        return <Target {...this.props} />;
      }
      return null;
    }
  }

  LegacyLoader.childContextTypes = {
    injector: PropTypes.shape({
      get: PropTypes.func,
    }),
  };

  const contextInjector = overrideInjector || provideInjector;

  return contextInjector(withInjector(LegacyLoader));
};

export default loadComponent;
