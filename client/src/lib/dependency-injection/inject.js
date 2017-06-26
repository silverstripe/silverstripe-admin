import React from 'react';
import injectorContext from './injectorContext';

/**
 * Injects dependences from the Injector as named props into a component
 * @param {Array} dependencies A list of named dependencies
 * @param {callback} mapDependenciesToProps Maps the fetched dependencies to propnames, e.g.
 *   (TextField, FormAction) => { myText: TextField, myAction: FormAction }
 * @param {function} getContext Gets the name of the context to pass to Injector.
 *   Accepts the component's props as a param. (props) => `SomeContext.${props.identifier}`;
 */
const inject = (dependencies, mapDependenciesToProps, getContext) => (Component) => {
  if (mapDependenciesToProps && typeof mapDependenciesToProps !== 'function') {
    throw new Error(`
      Second parameter of inject() [getContext] must be a function, taking the resolved
      dependencies as enumerated arguments, and returning a map of prop names to dependencies.
    `);
  }

  if (getContext && typeof getContext !== 'function') {
    throw new Error(`
      Third parameter of inject() [getContext] must be a function, taking the component's props
      as the single parameter, and returning a string representing the Injector
      context to use throughout the component.
    `);
  }
  // eslint-disable-next-line react/prefer-stateless-function
  class Injected extends React.Component {
    render() {
      let props = {};
      const context = getContext ? getContext(this.props) : null;
      const deps = dependencies;
      if (deps) {
        if (!Array.isArray(deps)) {
          throw new Error(`
          withInjector() passed an argument for dependencies that is ${typeof deps}. 
          Must be a string or array of named dependencies.
        `);
        }
        const resolved = deps.map(dep => this.context.injector.get(dep, context));
        if (mapDependenciesToProps) {
          props = mapDependenciesToProps(...resolved);
          if (typeof props !== 'object') {
            throw new Error(`
              mapDepedenciesToProps parameter passed to inject() 
              should return an object that maps prop names to dependencies
             `);
          }
        } else {
          // If no mapping function is given, mirror the prop names and dependency names
          for (let i = 0; i < deps.length; i++) {
            props[deps[i]] = resolved[i];
          }
        }
      }
      const newProps = {
        ...this.props,
        ...props,
      };
      return <Component {...newProps} />;
    }
  }
  Injected.contextTypes = injectorContext;
  Injected.displayName = `inject(
    ${(Component.displayName || Component.name || 'Component')}
  )`;

  return Injected;
};

export default inject;
