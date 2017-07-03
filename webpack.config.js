const Path = require('path');
const webpack = require('webpack');
const webpackConfig = require('@silverstripe/webpack-config');
const {
  resolveJS,
  externalJS,
  moduleJS,
  pluginJS,
  moduleCSS,
  pluginCSS,
  createDevServer,
} = webpackConfig;

const ENV = process.env.NODE_ENV;
const PATHS = {
  MODULES: 'node_modules',
  THIRDPARTY: 'thirdparty',
  FILES_PATH: '../',
  ROOT: Path.resolve(),
  SRC: Path.resolve('client/src'),
  DIST: Path.resolve('client/dist'),
  LEGACY_SRC: Path.resolve('client/src/legacy'),
};
const devServer = createDevServer(ENV, 3000);
const config = [
  {
    name: 'js',
    entry: {
      bundle: devServer.entry(`${PATHS.SRC}/bundles/bundle.js`),
      vendor: devServer.entry(`${PATHS.SRC}/bundles/vendor.js`),
      // legacy scripts
      'LeftAndMain.Ping': `${PATHS.LEGACY_SRC}/LeftAndMain.Ping.js`,
      leaktools: `${PATHS.LEGACY_SRC}/leaktools.js`,
      MemberImportForm: `${PATHS.LEGACY_SRC}/MemberImportForm.js`,
      TinyMCE_sslink: `${PATHS.LEGACY_SRC}/TinyMCE_sslink.js`,
      'TinyMCE_sslink-external': `${PATHS.LEGACY_SRC}/TinyMCE_sslink-external.js`,
      'TinyMCE_sslink-email': `${PATHS.LEGACY_SRC}/TinyMCE_sslink-email.js`,
    },
    output: {
      path: PATHS.DIST,
      publicPath: PATHS.DIST,
      filename: 'js/[name].js',
    },
    devtool: (ENV !== 'production') ? 'source-map' : '',
    resolve: resolveJS(ENV, PATHS),
    externals: externalJS(ENV, PATHS),
    module: moduleJS(ENV, PATHS),
    plugins: [
      ...pluginJS(ENV, PATHS),
      ...devServer.plugins(),
      // Most vendor libs are loaded directly into the 'vendor' bundle (through require()
      // calls in vendor.js). This ensures that any further require() calls in other
      // bundles aren't duplicating libs.
      new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        minChunks: module => module.context && module.context.indexOf('/node_modules/') > -1,
      }),
    ],
    devServer: devServer.config(),
  },
  {
    name: 'css',
    entry: {
      bundle: devServer.entry(`${PATHS.SRC}/styles/bundle.scss`),
      editor: `${PATHS.SRC}/styles/editor.scss`,
      GridField_print: `${PATHS.SRC}/styles/legacy/GridField_print.scss`,
    },
    output: {
      path: PATHS.DIST,
      publicPath: PATHS.DIST,
      filename: 'styles/[name].css',
    },
    devtool: (ENV !== 'production') ? 'source-map' : '',
    module: moduleCSS(ENV, PATHS),
    plugins: [
      ...pluginCSS(ENV, PATHS),
      ...devServer.plugins(),
    ],
    devServer: devServer.config(),
  },

];

// Use WEBPACK_CHILD=js or WEBPACK_CHILD=css env var to run a single config
module.exports = (process.env.WEBPACK_CHILD)
  ? config.find((entry) => entry.name === process.env.WEBPACK_CHILD)
  : module.exports = config;
