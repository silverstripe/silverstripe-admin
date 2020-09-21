/* eslint-disable
 import/no-webpack-loader-syntax,
 import/no-extraneous-dependencies,
 import/no-unresolved
*/
// TODO Enable require(*.css) includes once https://github.com/webpack/extract-text-webpack-plugin/issues/179
// is resolved. Included in bundle.scss for now.

require('babel-polyfill');
require('json-js');

// jQuery plugins require that the jQuery object is exposed as a global
// webpack.ProvidePlugin is used to ensure that jQuery and $ are provided to all includes
require('script-loader!../../../thirdparty/jquery/jquery.js');
require('expose-loader?jQuery!jquery');

// Expose the libraries as globals for other modules to access
// Note that these are order-dependent - earlier items should not depend on later ones
require('expose-loader?PropTypes!prop-types');
require('expose-loader?classnames!classnames');
require('expose-loader?DeepFreezeStrict!deep-freeze-strict');
require('expose-loader?React!react');
require('expose-loader?ReactDom!react-dom');
require('expose-loader?ReactRouterDom!react-router-dom');
require('expose-loader?Reactstrap!reactstrap');
require('expose-loader?IsomorphicFetch!isomorphic-fetch');
require('expose-loader?Redux!redux');
require('expose-loader?ReactRedux!react-redux');
require('expose-loader?ReduxThunk!redux-thunk');
require('expose-loader?ReduxForm!redux-form');
require('expose-loader?ReactSelect!react-select');
require('expose-loader?ReactDND!react-dnd');
require('expose-loader?ReactDNDHtml5Backend!react-dnd-html5-backend');
require('expose-loader?Page!page.js');
require('expose-loader?validator!validator');
require('expose-loader?ApolloClient!apollo-client');
require('expose-loader?ReactApollo!react-apollo');
require('expose-loader?GraphQLTag!graphql-tag');
require('expose-loader?GraphQLFragments!graphql-fragments');
require('expose-loader?NodeUrl!url');
require('expose-loader?qs!qs');
require('expose-loader?modernizr!modernizr');
require('expose-loader?history!history');
require('expose-loader?moment!moment');
require('expose-loader?merge!merge');

require('../../../thirdparty/jquery-ondemand/jquery.ondemand.js');
require('../../../thirdparty/jquery-ui/jquery-ui.js');
// require('../../../thirdparty/jquery-ui-themes/smoothness/jquery-ui.css');
require('../../../thirdparty/jquery-entwine/dist/jquery.entwine-dist.js');
require('../../../thirdparty/jquery-cookie/jquery.cookie.js');
require('../../../thirdparty/jquery-query/jquery.query.js');
require('../../../thirdparty/jquery-form/jquery.form.js');
require('jquery-sizes/lib/jquery.sizes.js');
require('../../../thirdparty/jstree/jquery.jstree.js');
// require('../../../thirdparty/stree/themes/apple/style.css');
require('../../../thirdparty/jquery-hoverIntent/jquery.hoverIntent.js');
require('../../../thirdparty/jquery-changetracker/lib/jquery.changetracker.js');

require('chosen-js');
