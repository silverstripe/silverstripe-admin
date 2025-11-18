import useInjector from './useInjector';

export default (componentName, context) => {
  const injector = useInjector();
  const resolvedContext = context || injector.context;
  return injector.get(componentName, resolvedContext);
};
