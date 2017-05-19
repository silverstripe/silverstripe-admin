const ExtractTextPlugin = require('extract-text-webpack-plugin');
const autoprefixer = require('autoprefixer');
const Path = require('path');

// Used for autoprefixing css properties (same as Bootstrap Aplha.2 defaults)
const SUPPORTED_BROWSERS = [
  'Chrome >= 35',
  'Firefox >= 31',
  'Edge >= 12',
  'Explorer >= 11',
  'iOS >= 8',
  'Safari >= 8',
  'Android 2.3',
  'Android >= 4',
  'Opera >= 12',
];

/**
 * Exports the settings for css modules in webpack.config
 *
 * @param {string} ENV Environment to build for, expects 'production' for production and
 * anything else for non-production
 * @param {string} FILES_PATH The relative path from dist-css file to dist-images/dist-fonts
 * @param {string} SRC The path to the source scss files
 * @param {string} ROOT The path to the root of the project, this is so we can scope for
 * silverstripe-admin variables.scss
 * @returns {{rules: [*,*,*,*]}}
 */
module.exports = (ENV, { FILES_PATH, SRC, ROOT }) => {
  const cssLoaders = [
    {
      loader: 'css-loader',
      options: {
        sourceMap: true,
        minimize: true,
        discardComments: true,
      },
    },
    {
      loader: 'postcss-loader',
      options: {
        sourceMap: true,
        plugins: [
          autoprefixer({ browsers: SUPPORTED_BROWSERS }),
        ],
      },
    },
  ];

  return {
    rules: [
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract({
          publicPath: FILES_PATH,
          use: [
            ...cssLoaders,
            {
              loader: 'resolve-url-loader',
            },
            {
              loader: 'sass-loader',
              options: {
                includePaths: [
                  Path.resolve(SRC, 'styles'),
                  Path.resolve(ROOT, 'silverstripe-admin/client/src/styles'),
                  Path.resolve(ROOT, '../silverstripe-admin/client/src/styles'),
                ],
                sourceMap: true,
              },
            },
          ],
        }),
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract({
          publicPath: FILES_PATH,
          use: cssLoaders,
        }),
      },
      {
        test: /\.(png|gif|jpg|svg)$/,
        exclude: /fonts\/([\w_-]+)\.svg$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'images/[name].[ext]',
        },
      },
      {
        test: /fonts\/([\w_-]+)\.(woff|eot|ttf|svg)$/,
        loader: 'file-loader',
        options: {
          name: 'fonts/[name].[ext]',
        },
      },
    ],
  };
};
