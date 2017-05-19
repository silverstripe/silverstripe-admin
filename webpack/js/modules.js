/**
 * Exports the settings for javascript modules in webpack.config
 *
 * @param {string} ENV Environment to build for, expects 'production' for production and
 * anything else for non-production
 * @param {string} SRC Path to source files for ESLint to validate against
 * @param {string} MODULES The modules folder
 * @param {string} THIRDPARTY A thirdparty folder, self-hosted modules.
 * @returns {{rules: Array.<*>}}
 */
module.exports = (ENV, { SRC, MODULES, THIRDPARTY }) => {
  const eslintLoader = (ENV === 'production')
    ? {
      test: /\.jsx?$/,
      enforce: 'pre',
      loader: 'eslint-loader',
      options: {
        filePath: SRC,
      },
    }
    : null;

  return {
    rules: [
      eslintLoader,
      {
        // .js and .jsx files are caught
        test: /\.jsx?$/,
        exclude: new RegExp(`(${MODULES}|${THIRDPARTY})`),
        loader: 'babel-loader',
        options: {
          presets: [
            ['es2015', { modules: false }],
            'es2016',
            'react',
          ],
          plugins: [
            'transform-object-rest-spread',
          ],
          comments: false,
          cacheDirectory: (ENV !== 'production'),
        },
      },
      {
        test: '/i18n.js/',
        use: 'script-loader',
      },
      {
        test: /\.modernizrrc$/,
        use: [
          'modernizr-loader',
          'json-loader',
        ],
      },
    ].filter(rule => rule),
  };
};
