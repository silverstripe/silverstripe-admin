const path = require('path');
const webpackConfig = require('@silverstripe/webpack-config');
const {
  resolveJS,
  moduleJS,
  pluginJS,
  moduleCSS,
} = webpackConfig;
const { collectStoryRoots, getDefaultRoot } = require('./lib/storyTeller');

const ENV = 'development';
const PATHS = require('../webpack-vars');

// See https://storybook.js.org/configurations/custom-webpack-config/#full-control-mode
module.exports = (config) => {
  const resolve = resolveJS(ENV, PATHS);
  config.resolve = Object.assign({},
    resolve,
    {
      modules: [
        ...resolve.modules.filter(module => module !== 'node_modules'),
        // Build modules that expose stories
        ...collectStoryRoots(getDefaultRoot()).map(config => config.src),

        // make sure silverstripe-admin's node_modules is used
        path.resolve('./node_modules'),
        // need generic "node_modules" folder to be last - otherwise it causes multiple versions of React
        'node_modules',
      ],
    });

  // Not copying other settings on modules key
  config.module.rules = [
    ...moduleJS(ENV, PATHS).rules
      .filter(module => module.loader !== 'file-loader'),
    ...moduleCSS(ENV, PATHS, { useStyle: true }).rules,
    {
      test: /\.(html)$/,
      loader: 'html-loader',
      options: {
        attrs: false,
      },
    },
    {
      test: /\.md$/,
      use: [
        {
          loader: 'html-loader',
        },
        {
          loader: 'markdown-loader',
        },
      ]
    }
  ];

  config.plugins = [
    ...config.plugins,
    ...pluginJS(ENV),
  ];

  return config;
};
