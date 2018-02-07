import React, { Component } from 'react';
import contextType from './injectorContext';

const defaultContext = (props, injectorContext) => injectorContext;

/**
 * Injects dependences from the Injector as named props into a component
 * @param {Array} dependencies A list of named dependencies
 * @param {function} mapDependenciesToProps Maps the fetched dependencies to propnames, e.g.
 *   (TextField, FormAction) => { myText: TextField, myAction: FormAction }
 * @param {function} getContext Gets the name of the context to pass to Injector.
 *   Accepts the component's props as a param. (props) => `SomeContext.${props.identifier}`;
 */
const inject = (dependencies, mapDependenciesToProps, getContext = defaultContext) => (
  (InjectingComponent) => {
    if (dependencies && !Array.isArray(dependencies)) {
      throw new Error(`
      withInjector() passed an argument for dependencies that is ${typeof deps}. 
      Must be an array of named dependencies.
    `);
    }

    if (mapDependenciesToProps && typeof mapDependenciesToProps !== 'function') {
      throw new Error(`
      Second parameter of inject() [mapDependenciesToProps] must be a function, taking the resolved
      dependencies as enumerated arguments, and returning a map of prop names to dependencies.
    `);
    }

    if (typeof getContext !== 'function') {
      throw new Error(`
      Third parameter of inject() [getContext] must be a function, taking the component's props
      and current inject context as parameters, and returning a string representing the Injector
      context to use throughout the component.
    `);
    }

    // eslint-disable-next-line react/prefer-stateless-function
    class Injector extends Component {
      constructor(props, context) {
        super(props, context);

        this.state = {
          context: getContext(props, context.injector.context),
        };
      }

      getChildContext() {
        return {
          injector: {
            ...this.context.injector,
            context: this.state.context,
          },
        };
      }

      componentWillReceiveProps(nextProps, nextContext) {
        const newContext = getContext(nextProps, nextContext.injector.context);

        if (newContext !== this.state.context) {
          this.setState({
            context: newContext,
          });
        }
      }

      render() {
        let props = {};
        if (dependencies) {
          const { get } = this.context.injector;
          const resolved = dependencies.map(dep => get(dep, this.state.context));

          if (mapDependenciesToProps) {
            props = mapDependenciesToProps(...resolved);
          } else {
            // If no mapping function is given, mirror the prop names and dependency names
            dependencies.forEach((dep, index) => {
              props[dep] = resolved[index];
            });
          }

          if (!props || typeof props !== 'object') {
            throw new Error(`
            mapDepedenciesToProps parameter passed to inject()
            should return an object that maps prop names to dependencies
          `);
          }
        }
        const newProps = {
          ...props,
          ...this.props,
        };
        return <InjectingComponent {...newProps} />;
      }
    }

    Injector.contextTypes = contextType;

    Injector.childContextTypes = contextType;

    return Injector;
  }
);

export default inject;
