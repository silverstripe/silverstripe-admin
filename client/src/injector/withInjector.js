import React from 'react';

export default function (Component, dependencies, mapDependenciesToProps) {
  class Injectable extends React.Component {
    render() {
      const resolved = dependencies.map(this.context.get.bind(this.context));
      let props = {};
      if(mapDependenciesToProps && typeof mapDependenciesToProps === 'function') {
        props = mapDependenciesToProps(...resolved);
        if(typeof props !== 'object') {
          throw new Error('mapDepedenciesToProps parameter passed to withInjector() should return an object that maps prop names to dependencies');
        }
      } else {
        for (let i = 0; i < dependencies.length; i++) {
          props[dependencies[i]] = resolved[i];
        }
      }

      return React.createElement(Component, props);
    }
  }

  Injectable.contextTypes = {
    get: React.PropTypes.func
  };

  Injectable.displayName = `Injectable${(Component.displayName || Component.name || 'Component')}`;

  return Injectable;
};