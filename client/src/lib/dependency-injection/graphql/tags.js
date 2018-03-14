export const captureTag = (strings, ...expressions) => ({
  strings,
  expressions,
});

export const defaultTag = (strings, ...expressions) => (
  strings.map((partial, index) => (
    `${partial}${(expressions[index] === 0) ? expressions[index] : expressions[index] || ''}`
  )).join('')
);

export const processTag = (config) => (strings, ...expressions) => {
  const expressed = expressions.map(expression => {
    if (typeof expression !== 'function') {
      return expression;
    }
    return expression(config);
  });

  return defaultTag(strings, ...expressed);
};
