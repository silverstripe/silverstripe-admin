const webpack = require('webpack');
const { JavascriptWebpackConfig, CssWebpackConfig } = require('@silverstripe/webpack-config');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const glob = require('glob');
const path = require('path');
const PATHS = require('./webpack-vars');

const config = [
  // Main JS bundles
  new JavascriptWebpackConfig('js', PATHS, 'silverstripe/admin')
    .setEntry({
      vendor: `${PATHS.SRC}/bundles/vendor.js`,
      bundle: `${PATHS.SRC}/bundles/bundle.js`,
      'LeftAndMain.Ping': `${PATHS.LEGACY_SRC}/LeftAndMain.Ping.js`,
    })
    .splitVendor()
    .mergeConfig({
      plugins: [
        new webpack.IgnorePlugin({ resourceRegExp: /^\.\/locale$/, contextRegExp: /moment$/ }),
        new CopyWebpackPlugin({
          patterns: [
            {
              from: `${PATHS.MODULES}/moment/locale`,
              to: `${PATHS.DIST}/moment-locales`
            },
            {
              from: `${PATHS.MODULES}/@popperjs/core/dist/umd/popper.min.js`,
              to: `${PATHS.THIRDPARTY}/popper/popper.min.js`
            },
            {
              context: `${PATHS.SRC}/images`,
              from: 'chosen-sprite*.png',
              to: `${PATHS.DIST}/images/`
            },
          ]
        }),
      ],
      watchOptions: {
        poll: true
      }
    })
    .getConfig(),
  // Bootstrap components - can't just rely on CopyWebpackPlugin for these because some of them require
  // additional files that aren't declared in the documentation.
  new JavascriptWebpackConfig('bootstrap', PATHS, 'silverstripe/admin')
    .setEntry(glob.sync(`${PATHS.MODULES}/bootstrap/js/dist/**/*.js`).reduce((obj, el) => {
      const parsedPath = path.parse(el);
      const dir = parsedPath.dir.replace(new RegExp(`${PATHS.MODULES}\/bootstrap\/js\/dist\/?`), '');
      obj[path.join(dir, parsedPath.name)] = el;
      return obj;
    }, {}))
    .mergeConfig({
      output: {
        path: `${path.resolve('thirdparty')}/bootstrap/js/dist`,
        filename: '[name].js',
      },
    })
    .getConfig(),
  // i18n
  new JavascriptWebpackConfig('i18n', PATHS, 'silverstripe/admin')
    .setEntry({
      i18n: `${PATHS.SRC}/i18n.js`
    })
    .getConfig(),
  // sass to css
  new CssWebpackConfig('css', PATHS)
    .setEntry({
      bundle: `${PATHS.SRC}/styles/bundle.scss`,
      GridField_print: `${PATHS.SRC}/styles/legacy/GridField_print.scss`,
    })
    .getConfig(),
];

// Use WEBPACK_CHILD=js or WEBPACK_CHILD=css env var to run a single config
module.exports = (process.env.WEBPACK_CHILD)
  ? config.find((entry) => entry.name === process.env.WEBPACK_CHILD)
  : config;
