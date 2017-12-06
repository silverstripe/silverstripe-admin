/* global window */
import React, { Component, PropTypes } from 'react';
import { ApolloProvider } from 'react-apollo';
import provideInjector from './provideInjector';
import withInjector from './withInjector';
import Injector from './Container';
import NotFoundComponent from 'components/NotFoundComponent/NotFoundComponent';

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
        error: false,
      };
    }

    componentWillMount() {
      Injector.ready(() => {
        if (typeof targetName === 'string') {
          let error = true;
          let target = null;
          try {
            target = this.context.injector.get(targetName);
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
