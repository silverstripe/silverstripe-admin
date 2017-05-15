const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');
// const SprityWebpackPlugin = require('sprity-webpack-plugin');

const PATHS = {
  MODULES: './node_modules',
  ADMIN_IMAGES: './client/dist/images',
  ADMIN_CSS_SRC: './client/src/styles',
  ADMIN_CSS_DIST: './client/dist/styles',
  ADMIN_THIRDPARTY: './thirdparty',
  ADMIN_JS_SRC: './client/src',
  ADMIN_JS_DIST: './client/dist/js',
};

// Used for autoprefixing css properties (same as Bootstrap Aplha.2 defaults)
const SUPPORTED_BROWSERS = [
  'Chrome >= 35',
  'Firefox >= 31',
  'Edge >= 12',
  'Explorer >= 9',
  'iOS >= 8',
  'Safari >= 8',
  'Android 2.3',
  'Android >= 4',
  'Opera >= 12',
];

const config = [
  {
    name: 'js',
    entry: {
      vendor: `${PATHS.ADMIN_JS_SRC}/bundles/vendor.js`,
      bundle: `${PATHS.ADMIN_JS_SRC}/bundles/bundle.js`,
      'LeftAndMain.Ping': `${PATHS.ADMIN_JS_SRC}/legacy/LeftAndMain.Ping.js`,
      leaktools: `${PATHS.ADMIN_JS_SRC}/legacy/leaktools.js`,
      MemberImportForm: `${PATHS.ADMIN_JS_SRC}/legacy/MemberImportForm.js`,
      TinyMCE_sslink: `${PATHS.ADMIN_JS_SRC}/legacy/TinyMCE_sslink.js`,
      'TinyMCE_sslink-external': `${PATHS.ADMIN_JS_SRC}/legacy/TinyMCE_sslink-external.js`,
      'TinyMCE_sslink-email': `${PATHS.ADMIN_JS_SRC}/legacy/TinyMCE_sslink-email.js`,
    },
    resolve: {
      root: [__dirname, path.resolve(__dirname, PATHS.ADMIN_JS_SRC)],
      modulesDirectories: [PATHS.MODULES],
      alias: {
        modernizr$: path.resolve(__dirname, `${PATHS.ADMIN_JS_SRC}/.modernizrrc`),
      },
    },
    output: {
      path: 'client/dist',
      filename: 'js/[name].js',
    },

    // lib.js provies these globals and more. These references allow the framework bundle
    // to access them.
    externals: {
      'apollo-client': 'ApolloClient',
      'bootstrap-collapse': 'BootstrapCollapse',
      'components/Breadcrumb/Breadcrumb': 'Breadcrumb',
      'state/breadcrumbs/BreadcrumbsActions': 'BreadcrumbsActions',
      'state/schema/SchemaActions': 'SchemaActions',
      'components/FieldHolder/FieldHolder': 'FieldHolder',
      'components/FormAction/FormAction': 'FormAction',
      'components/FormBuilder/FormBuilder': 'FormBuilder',
      'components/FormBuilderModal/FormBuilderModal': 'FormBuilderModal',
      'components/GridField/GridField': 'GridField',
      'components/Toolbar/Toolbar': 'Toolbar',
      'containers/FormBuilderLoader/FormBuilderLoader': 'FormBuilderLoader',
      'deep-freeze-strict': 'DeepFreezeStrict',
      'graphql-fragments': 'GraphQLFragments',
      'graphql-tag': 'GraphQLTag',
      i18n: 'i18n',
      jquery: 'jQuery',
      'lib/Backend': 'Backend',
      'lib/ReducerRegister': 'ReducerRegister',
      'lib/ReactRouteRegister': 'ReactRouteRegister',
      'lib/SilverStripeComponent': 'SilverStripeComponent',
      'page.js': 'Page',
      'react-addons-test-utils': 'ReactAddonsTestUtils',
      'react-dom': 'ReactDom',
      tether: 'Tether',
      'react-apollo': 'ReactApollo',
      'react-bootstrap-ss': 'ReactBootstrap',
      'react-redux': 'ReactRedux',
      'react-router-redux': 'ReactRouterRedux',
      'react-router': 'ReactRouter',
      'react-addons-css-transition-group': 'ReactAddonsCssTransitionGroup',
      react: 'React',
      'redux-form': 'ReduxForm',
      'redux-thunk': 'ReduxThunk',
      redux: 'Redux',
      config: 'Config',
      'lib/Router': 'Router',
      qs: 'qs',
      moment: 'moment',
      modernizr: 'modernizr',
    },
    module: {
      loaders: [
        {
          test: /\.js$/,
          exclude: /(node_modules|thirdparty)/,
          loader: 'babel',
          query: {
            presets: ['es2015', 'react'],
            plugins: ['transform-object-assign', 'transform-object-rest-spread'],
            comments: false,
          },
        },
        {
          test: '/i18n.js/',
          loader: 'script-loader',
        },
        {
          test: /\.modernizrrc$/,
          loader: 'modernizr!json',
        },
      ],
    },
    plugins: [
      new webpack.ProvidePlugin({
        jQuery: 'jquery',
        $: 'jquery',
      }),
      new webpack.DefinePlugin({
        'process.env': {
          // Builds React in production mode, avoiding console warnings
          NODE_ENV: JSON.stringify('production'),
        },
      }),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          unused: false,
          warnings: false,
        },
        output: {
          beautify: false,
          semicolons: false,
          comments: false,
          max_line_len: 200,
        },
      }),
      // Most vendor libs are loaded directly into the 'vendor' bundle (through require()
      // calls in vendor.js). This ensures that any further require() calls in other
      // bundles aren't duplicating libs.
      new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        minChunks: Infinity,
      }),
    ],
  },
  {
    name: 'css',
    entry: {
      bundle: `${PATHS.ADMIN_CSS_SRC}/bundle.scss`,
      editor: `${PATHS.ADMIN_CSS_SRC}/editor.scss`,
      GridField_print: `${PATHS.ADMIN_CSS_SRC}/legacy/GridField_print.scss`,
    },
    output: {
      path: 'client/dist/styles',
      filename: '[name].css',
    },
    module: {
      loaders: [
        {
          test: /\.scss$/,
          loader: ExtractTextPlugin.extract([
            'css?sourceMap&minimize&-core&discardComments',
            'postcss?sourceMap',
            'resolve-url',
            'sass?sourceMap',
          ]),
        },
        {
          test: /\.css$/,
          loader: ExtractTextPlugin.extract([
            'css?sourceMap&minimize&-core&discardComments',
            'postcss?sourceMap',
          ]),
        },
        {
          test: /\.(png|gif|jpg|svg)$/,
          exclude: /fonts\/([\w_-]+)\.svg$/,
          loader: 'url?limit=10000&name=../images/[name].[ext]',
        },
        {
          test: /fonts\/([\w_-]+)\.(woff|eot|ttf|svg)$/,
          loader: 'file?name=../fonts/[name].[ext]',
        },
      ],
    },
    postcss: [
      autoprefixer({ browsers: SUPPORTED_BROWSERS }),
    ],
    plugins: [
      new ExtractTextPlugin('[name].css', { allChunks: true }),
    ],
  },
];

// Use WEBPACK_CHILD=js or WEBPACK_CHILD=css env var to run a single config
if (process.env.WEBPACK_CHILD) {
  module.exports = config.filter((entry) => entry.name === process.env.WEBPACK_CHILD)[0];
} else {
  module.exports = config;
}
