const path = require('path');
const webpack = require('webpack');
const moduleConfigs = require('../webpack.config.js');

// See https://storybook.js.org/configurations/custom-webpack-config/#full-control-mode
module.exports = (config, configType) => {
  const jsModuleConfig = moduleConfigs.find((c) => c.name == 'js');
  const cssModuleConfig = moduleConfigs.find((c) => c.name == 'css');

  // Doesn't resolve externals (assumes every module is loaded through this path)

  if (jsModuleConfig.resolve) {
    config.resolve = jsModuleConfig.resolve;
  }

  // Not copying other settings on modules key
  config.module.rules = [
    ...config.module.rules,
    // ...jsModuleConfig.module.rules,
    ...cssModuleConfig.module.rules
  ];

  config.plugins = [
    ...config.plugins,
    // ...jsModuleConfig.plugins
    // TODO Allow more specialised webpack build (without duplicate plugins like DefinePlugin)
    ...[
      new webpack.ProvidePlugin({
        jQuery: 'jquery',
        $: 'jquery',
      })
    ],
    ...cssModuleConfig.plugins
  ];

  console.log(config.module);

  return config;

  // TODO Doesn't support multiple configs
  // See https://github.com/storybooks/storybook/blob/master/app/react/src/server/middleware.js#L25
  // return [
  //   jsConfig,
  //   cssConfig
  // ];
};