/**
 * Exports the settings for resolve in webpack.config
 *
 * @param {string} ENV Environment to build for, expects 'production' for production and
 * anything else for non-production
 * @param {string} ROOT The root folder containing package.json
 * @param {string} SRC Path to source files for ESLint to validate against
 * @param {string} MODULES The modules folder
 */
module.exports = (ENV, { ROOT, MODULES, SRC }) => ({
  modules: [ROOT, SRC, MODULES],
  alias: {
    modernizr$: `${SRC}/.modernizrrc`,
  },
});
