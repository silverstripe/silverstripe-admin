export const joinUrlPaths = (...urlPaths) => {
  // Just return a blank string if there's no paths passed in
  if (!urlPaths.length) {
    return '';
  }

  // Combine paths with a single '/' between them.
  let result = urlPaths.shift();
  // eslint-disable-next-line no-restricted-syntax
  for (const path of urlPaths) {
    result = `${result.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
  }
  return result;
};
