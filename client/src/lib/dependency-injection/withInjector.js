import contextType from './contextType';

const withInjector = (Component) => {
  // eslint-disable-next-line no-param-reassign
  Component.contextTypes = {
    ...(Component.contextTypes || {}),
    ...contextType,
  };
  // eslint-disable-next-line no-param-reassign
  Component.displayName = `withInjector(
    ${(Component.displayName || Component.name || 'Component')}
  )`;

  return Component;
};

export default withInjector;
