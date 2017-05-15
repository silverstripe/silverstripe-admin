import React from 'react';

function withInjector(Component, dependencies, mapDependenciesToProps) {
  Component.contextTypes = {
    injector: React.PropTypes.shape({
      get: React.PropTypes.func,
    }),
  };

  class Injectable extends React.Component {
    render() {
      let props = {};
      if (dependencies) {
        if (!Array.isArray(dependencies)) {
          throw new Error(`
            withInjector() passed an argument for dependencies that is ${typeof dependencies}. 
            Must be an array of named dependencies.
          `);
          return;
        }
        const resolved = dependencies.map(this.context.injector.get);
        if (mapDependenciesToProps && typeof mapDependenciesToProps === 'function') {
          props = mapDependenciesToProps(...resolved);
          if (typeof props !== 'object') {
            throw new Error(`
              mapDepedenciesToProps parameter passed to withInjector() 
              should return an object that maps prop names to dependencies
             `);
          }
        } else {
          // If no mapping function is given, mirror the prop names and dependency names
          for (let i = 0; i < dependencies.length; i++) {
            props[dependencies[i]] = resolved[i];
          }
        }
      }

      return React.createElement(
        Component,
        Object.assign({}, this.props, props),
        this.props.children
      );
    }
  }

  Injectable.displayName = `withInjector(${(Component.displayName || Component.name || 'Component')})`;

  return Injectable;
}

export {
  withInjector
};