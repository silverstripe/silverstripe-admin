import React from 'react';
import container from '../container';

export default function (Component) {
  class InjectorProvider {
    getChildContext() {
      return container;
    }

    render() {
      return <Component />;
    }
  }

  InjectorProvider.childContextTypes = {
    get: React.PropTypes.func,
  };

  return InjectorProvider;
}
