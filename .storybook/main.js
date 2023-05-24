/** @type { import('@storybook/react-webpack5').StorybookConfig } */

import main from './scripts/runStoryTeller';
import customWebpackconfig from './webpack.config.js';

let modules = [];
(() => modules = main())();

const config = {
  stories: modules,
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "@storybook/addon-notes",
    "@storybook/addon-actions",
    "@storybook/addon-options",
    '@storybook/addon-controls',
    "storybook-addon-jsx"
  ],
  framework: {
    name: '@storybook/react-webpack5',
    options: {
      builder: {
        lazyCompilation: true,
        fsCache: false
      }
    }
  },
  features: {
    storyStoreV7: false
  },
  docs: {
    autodocs: "tag"
  },
  webpackFinal: async (config) => {
    return {
      ...config,
      ...customWebpackconfig
    };
  }
};

export default config;
