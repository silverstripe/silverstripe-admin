import React from 'react';
import injectorContext from './injectorContext';

const inject = (Component, dependencies, mapDependenciesToProps) => {
  // eslint-disable-next-line react/prefer-stateless-function
  class Injected extends React.Component {
    render() {
      let props = {};
      let deps = dependencies;
      if (deps) {
        if (!Array.isArray(deps)) {
          if (typeof deps !== 'string') {
            throw new Error(`
            withInjector() passed an argument for dependencies that is '${typeof deps}'. 
            Must be a string or array of named dependencies.
          `);
          }
          deps = [deps];
        }
        const resolved = deps.map(this.context.injector.get);
        if (typeof mapDependenciesToProps === 'function') {
          props = mapDependenciesToProps(...resolved);
          if (typeof props !== 'object') {
            throw new Error(`
              mapDepedenciesToProps parameter passed to inject() 
              should return an object that maps prop names to dependencies
             `);
          }
        } else {
          // If no mapping function is given, mirror the prop names and dependency names
          deps.forEach((dep, index) => {
            props[dep] = resolved[index];
          });
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
