import injectorContext from './injectorContext';

const withInjector = (Component) => {
  // eslint-disable-next-line no-param-reassign
  Component.contextTypes = {
    ...(Component.contextTypes || {}),
    ...injectorContext,
  };
  // eslint-disable-next-line no-param-reassign
  Component.displayName = `withInjector(
    ${(Component.displayName || Component.name || 'Component')}
  )`;

  return Component;
};

export default withInjector;
