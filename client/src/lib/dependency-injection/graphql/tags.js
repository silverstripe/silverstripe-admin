export const captureTag = (strings, ...expressions) => ({
  strings,
  expressions,
});

export const defaultTag = (strings, ...expressions) => (
  strings.map((partial, index) => (
    `${partial}${expressions[index] || ''}`
  )).join('')
);
