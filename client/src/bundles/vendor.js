/* eslint-disable
 import/no-webpack-loader-syntax,
 import/no-extraneous-dependencies,
 import/no-unresolved,
 import/extensions
*/
// TODO Enable require(*.css) includes once https://github.com/webpack/extract-text-webpack-plugin/issues/179
// is resolved. Included in bundle.scss for now.

require('babel-polyfill');
require('json-js');

// jQuery plugins require that the jQuery object is exposed as a global
// webpack.ProvidePlugin is used to ensure that jQuery and $ are provided to all includes
require('script-loader!../../../thirdparty/jquery/jquery.js');
// require('expose-loader?exposes=jQuery!jquery|');

// Expose the libraries as globals for other modules to access
// Note that these are order-dependent - earlier items should not depend on later ones
require('expose-loader?exposes=PropTypes!prop-types');
require('expose-loader?exposes=classnames!classnames');
require('expose-loader?exposes=DeepFreezeStrict!deep-freeze-strict');
require('expose-loader?exposes=React!react');
require('expose-loader?exposes=ReactDom!react-dom');
require('expose-loader?exposes=ReactRouterDom!react-router-dom');
require('expose-loader?exposes=Reactstrap!reactstrap');
require('expose-loader?exposes=IsomorphicFetch!isomorphic-fetch');
require('expose-loader?exposes=Redux!redux');
require('expose-loader?exposes=ReactRedux!react-redux');
require('expose-loader?exposes=ReduxThunk!redux-thunk');
require('expose-loader?exposes=ReduxForm!redux-form');
require('expose-loader?exposes=ReactSelect!react-select');
require('expose-loader?exposes=ReactDND!react-dnd');
require('expose-loader?exposes=ReactDNDHtml5Backend!react-dnd-html5-backend');
require('expose-loader?exposes=Page!page.js');
require('expose-loader?exposes=validator!validator');
require('expose-loader?exposes=ApolloClient!apollo-client');
require('expose-loader?exposes=ReactApollo!react-apollo');
require('expose-loader?exposes=GraphQLTag!graphql-tag');
require('expose-loader?exposes=GraphQLFragments!graphql-fragments');
require('expose-loader?exposes=NodeUrl!url');
require('expose-loader?exposes=qs!qs');
require('expose-loader?exposes=modernizr!modernizr');
require('expose-loader?exposes=moment!moment');
require('expose-loader?exposes=merge!merge');

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
