import React from 'react';
import useInjector from './useInjector';

export default (dependencies, mapDependenciesToProps, getContext) => (Component) => (props) => {
  const injector = useInjector();
  const context = getContext ? getContext(props, injector.context) : injector.context;

  let injectedProps = {};
  if (dependencies) {
    const resolved = dependencies.map(dep => injector.get(dep, context));
    if (mapDependenciesToProps) {
      injectedProps = mapDependenciesToProps(...resolved);
    } else {
      dependencies.forEach((dep, index) => {
        injectedProps[dep] = resolved[index];
      });
    }
  }

  return <Component {...injectedProps} {...props} />;
};
