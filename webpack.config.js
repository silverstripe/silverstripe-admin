const Path = require('path');
const webpack = require('webpack');
const webpackConfig = require('@silverstripe/webpack-config');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const {
  resolveJS,
  externalJS,
  moduleJS,
  pluginJS,
  moduleCSS,
  pluginCSS,
} = webpackConfig;

const ENV = process.env.NODE_ENV;
const PATHS = require('./webpack-vars');

const config = [
  {
    name: 'js',
    entry: {
      bundle: `${PATHS.SRC}/bundles/bundle.js`,
      vendor: `${PATHS.SRC}/bundles/vendor.js`,
      // legacy scripts
      'LeftAndMain.Ping': `${PATHS.LEGACY_SRC}/LeftAndMain.Ping.js`,
    },
    output: {
      path: PATHS.DIST,
      filename: 'js/[name].js',
    },
    devtool: (ENV !== 'production') ? 'source-map' : '',
    resolve: resolveJS(ENV, PATHS),
    externals: externalJS(ENV, PATHS),
    module: moduleJS(ENV, PATHS),
    plugins: [
      ...pluginJS(ENV, PATHS),
      new webpack.IgnorePlugin({ resourceRegExp: /^\.\/locale$/, contextRegExp: /moment$/ }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: `${PATHS.MODULES}/moment/locale`,
            to: `${PATHS.DIST}/moment-locales`
          },
          {
            from: `${PATHS.MODULES}/popper.js/dist/umd/popper.min.js`,
            to: `${PATHS.THIRDPARTY}/popper/popper.min.js`
          }
        ]
      }),
    ],
    watchOptions: {
      poll: true
    }
  },
  {
    name: 'tinymce',
    entry: {
      TinyMCE_sslink: `${PATHS.LEGACY_SRC}/TinyMCE_sslink.js`,
      'TinyMCE_sslink-external': `${PATHS.LEGACY_SRC}/TinyMCE_sslink-external.js`,
      'TinyMCE_sslink-email': `${PATHS.LEGACY_SRC}/TinyMCE_sslink-email.js`,
    },
    output: {
      path: PATHS.DIST,
      filename: 'js/[name].js',
    },
    devtool: (ENV !== 'production') ? 'source-map' : '',
    resolve: resolveJS(ENV, PATHS),
    externals: externalJS(ENV, PATHS),
    module: moduleJS(ENV, PATHS),
    plugins: [
      ...pluginJS(ENV, PATHS),
    ],
    watchOptions: {
      poll: true
    }
  },
  {
    name: 'i18n',
    entry: {
      'i18n': `${PATHS.SRC}/i18n.js`
    },
    output: {
      path: PATHS.DIST,
      filename: 'js/[name].js',
    },
    devtool: (ENV !== 'production') ? 'source-map' : '',
    resolve: resolveJS(ENV, PATHS),
    externals: externalJS(ENV, PATHS),
    module: moduleJS(ENV, PATHS),
    plugins: pluginJS(ENV, PATHS),
  },
  {
    name: 'css',
    entry: {
      bundle: `${PATHS.SRC}/styles/bundle.scss`,
      editor: `${PATHS.SRC}/styles/editor.scss`,
      GridField_print: `${PATHS.SRC}/styles/legacy/GridField_print.scss`,
      // For IE version 10 and below. These browsers doesn't handle large
      // resource files so need to break browser detection and warning code into
      // its own file
      'browser-warning': `${PATHS.SRC}/styles/browser-warning.scss`,
    },
    output: {
      path: PATHS.DIST,
      filename: 'styles/[name].[chunkhash].css',
      chunkFilename: 'styles/[name].chunk.[chunkhash].css',
    },
    devtool: (ENV !== 'production') ? 'source-map' : '',
    module: moduleCSS(ENV, PATHS),
    plugins: [
      ...pluginCSS(ENV, PATHS),
      new CopyWebpackPlugin({
        patterns: [
          {
            context: `${PATHS.SRC}/images`,
            from: 'chosen-sprite*.png',
            to: `${PATHS.DIST}/images`
          }
        ]
      }),
    ],
  }
];

// console.log(JSON.stringify(config[0], null, 2));
// process.exit();

// Use WEBPACK_CHILD=js or WEBPACK_CHILD=css env var to run a single config
module.exports = (process.env.WEBPACK_CHILD)
  ? config.find((entry) => entry.name === process.env.WEBPACK_CHILD)
  : module.exports = config;
