const webpack = require('webpack');

/**
 * Exports the settings for plugins in webpack.config
 *
 * NOTE:
 * We do not normally require UglifyJS, which we've found causes a significant slowdown in
 * build times but no difference between file sizes.
 * We've used UglifyJS in production build to remove all comments
 */
module.exports = (ENV) => {
  const uglifyPlugin = (ENV === 'production')
    ? new webpack.optimize.UglifyJsPlugin({
      comments: false,
    })
    : null;

  return [
    new webpack.ProvidePlugin({
      jQuery: 'jquery',
      $: 'jquery',
    }),
    new webpack.DefinePlugin({
      'process.env': {
        // Builds React in production mode, avoiding console warnings
        NODE_ENV: JSON.stringify(ENV),
      },
    }),
    uglifyPlugin,
  ].filter(plugin => plugin);
};
