const webpack = require('webpack');
const { JavascriptWebpackConfig, CssWebpackConfig } = require('@silverstripe/webpack-config');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const glob = require('glob');
const path = require('path');
const PATHS = require('./webpack-vars');

/**
 * Dart Sass's "compressed" output style prepends a UTF-8 BOM to the compiled CSS
 * whenever it contains non-ASCII characters i.e. our icon font glyphs
 * Strip it as a final build step so it can't break styling
 */
class StripStrayBomPlugin {
  apply(compiler) {
    compiler.hooks.thisCompilation.tap('StripStrayBomPlugin', (compilation) => {
      compilation.hooks.processAssets.tap(
        {
          name: 'StripStrayBomPlugin',
          stage: webpack.Compilation.PROCESS_ASSETS_STAGE_REPORT,
        },
        (assets) => {
          Object.keys(assets)
            .filter((name) => name.endsWith('.css'))
            .forEach((name) => {
              const bom = String.fromCharCode(0xFEFF);
              const content = compilation.getAsset(name).source.source().toString();
              if (!content.includes(bom)) {
                return;
              }
              const occurrences = content.split(bom).length - 1;
              compilation.warnings.push(
                new webpack.WebpackError(
                  `StripStrayBomPlugin: removed ${occurrences} stray BOM character(s) from ${name}`
                )
              );
              compilation.updateAsset(
                name,
                new webpack.sources.RawSource(content.split(bom).join(''))
              );
            });
        }
      );
    });
  }
}

const cssConfig = new CssWebpackConfig('css', PATHS)
  .setEntry({
    bundle: `${PATHS.SRC}/styles/bundle.scss`,
    GridField_print: `${PATHS.SRC}/styles/legacy/GridField_print.scss`,
  })
  .getConfig();
cssConfig.plugins.push(new StripStrayBomPlugin());

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
  cssConfig,
];

// Use WEBPACK_CHILD=js or WEBPACK_CHILD=css env var to run a single config
module.exports = (process.env.WEBPACK_CHILD)
  ? config.find((entry) => entry.name === process.env.WEBPACK_CHILD)
  : config;
