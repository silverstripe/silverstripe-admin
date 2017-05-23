import React from 'react';

function withInjector(Component, dependencies, mapDependenciesToProps) {
  const injectorContext = {
    injector: React.PropTypes.shape({
      get: React.PropTypes.func,
    }),
  };
  // eslint-disable-next-line react/prefer-stateless-function
  class Injectable extends React.Component {
    render() {
      let props = {};
      if (dependencies) {
        if (!Array.isArray(dependencies)) {
          throw new Error(`
            withInjector() passed an argument for dependencies that is ${typeof dependencies}. 
            Must be an array of named dependencies.
          `);
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
      const newProps = Object.assign({}, this.props, props);
      return <Component {...newProps} />;
    }
  }
  // eslint-disable-next-line no-param-reassign
  Component.contextTypes = {
    ...Component.contextTypes,
    ...injectorContext,
  };
  Injectable.contextTypes = injectorContext;
  Injectable.displayName = `withInjector(
    ${(Component.displayName || Component.name || 'Component')}
  )`;

  return Injectable;
}

export {
  withInjector,
};
