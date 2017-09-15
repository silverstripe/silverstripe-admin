const path = require('path');
const webpack = require('webpack');
const webpackConfig = require('@silverstripe/webpack-config');
const {
  resolveJS,
  moduleJS,
  pluginJS,
  moduleCSS,
} = webpackConfig;

const ENV = 'development';
const PATHS = require('../webpack-vars');

// See https://storybook.js.org/configurations/custom-webpack-config/#full-control-mode
module.exports = (config, configType) => {
  config.resolve = resolveJS(ENV, PATHS);

  // Not copying other settings on modules key
  config.module.rules = [
    ...moduleJS(ENV, PATHS).rules,
    ...moduleCSS(ENV, PATHS, { useStyle: true }).rules,
  ];

  config.plugins = [
    ...config.plugins,
    ...pluginJS(ENV),
  ];

  return config;};
