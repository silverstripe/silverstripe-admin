const webpack = require('webpack');
const { JavascriptWebpackConfig, CssWebpackConfig } = require('@silverstripe/webpack-config');
const CopyWebpackPlugin = require('copy-webpack-plugin');
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
            // Copy npm and custom tinymce content into the same dist directory
            {
              from: `${PATHS.MODULES}/tinymce`,
              to: `${PATHS.DIST}/tinymce`
            },
            {
              from: `${PATHS.SRC}/tinymce`,
              to: `${PATHS.DIST}/tinymce`
            },
          ]
        }),
      ],
      watchOptions: {
        poll: true
      }
    })
    .getConfig(),
  // TinyMCE
  new JavascriptWebpackConfig('tinymce', PATHS, 'silverstripe/admin')
    .setEntry({
      TinyMCE_sslink: `${PATHS.LEGACY_SRC}/TinyMCE_sslink.js`,
      'TinyMCE_sslink-external': `${PATHS.LEGACY_SRC}/TinyMCE_sslink-external.js`,
      'TinyMCE_sslink-email': `${PATHS.LEGACY_SRC}/TinyMCE_sslink-email.js`,
    })
    .mergeConfig({
      watchOptions: {
        poll: true
      }
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
      editor: `${PATHS.SRC}/styles/editor.scss`,
      GridField_print: `${PATHS.SRC}/styles/legacy/GridField_print.scss`,
    })
    .getConfig(),
];

// Use WEBPACK_CHILD=js or WEBPACK_CHILD=css env var to run a single config
module.exports = (process.env.WEBPACK_CHILD)
  ? config.find((entry) => entry.name === process.env.WEBPACK_CHILD)
  : config;
