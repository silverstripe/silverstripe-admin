/* global window */
import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { ApolloProvider } from '@apollo/client';
import NotFoundComponent from 'components/NotFoundComponent/NotFoundComponent';
import provideInjector from './provideInjector';
import withInjector from './withInjector';
import Injector from './Container';
import contextType from './injectorContext';

/**
 * Handles loading SilverStripe-centric providers
 * These options can be overridden by providing a context object
 *
 * Ensures that Injector is ready before the provided component will be rendered.
 *
 * @param targetName
 * @param context - properties include the following
 *    - store for the redux store
 *    - apolloClient for the apollo client (graphql)
 *    - context for filtering/applying transformations to the obtained component
 * @param overrideInjector
 */
const loadComponent = (targetName, context = {}, overrideInjector) => {
  class LegacyLoader extends Component {
    constructor(props) {
      super(props);

      this.state = {
        target: null,
        error: false,
      };
    }

    getChildContext() {
      const injectorContext = context && context.context;
      if (!injectorContext) {
        return this.context;
      }
      return {
        injector: {
          ...this.context.injector,
          context: injectorContext,
        },
      };
    }

    componentDidMount() {
      Injector.ready(() => {
        if (typeof targetName === 'string') {
          let error = true;
          let target = null;
          try {
            target = this.context.injector.get(targetName, context && context.context);
            error = false;
          } catch (e) {
            this.setState({ target, error });

            // re-throw the error, as we do not want to silence it in the console
            throw e;
          }

          this.setState({ target, error });
          return;
        }

        this.setState({ target: targetName });
      });
    }

    render() {
      const Target = this.state.target;
      if (this.state.error) {
        let NotFound = NotFoundComponent;
        try {
          NotFound = this.context.injector.get('NotFoundComponent');
        } catch (e) {
          // can't throw and return... together.
        }
        return <NotFound {...this.props} itemName={targetName} />;
      }

      if (Target) {
        if (context) {
          // allows for submitting partial store or client
          const fullContext = { ...window.ss, ...context };
          const {
            store,
            apolloClient: client,
          } = fullContext;
          return (
            <ApolloProvider client={client}>
              <Provider store={store}>
                <Target {...this.props} />
              </Provider>
            </ApolloProvider>
          );
        }
        return <Target {...this.props} />;
      }
      return null;
    }
  }

  LegacyLoader.childContextTypes = contextType;

  const contextInjector = overrideInjector || provideInjector;

  return contextInjector(withInjector(LegacyLoader));
};

export default loadComponent;
