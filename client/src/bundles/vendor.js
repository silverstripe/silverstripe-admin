/* eslint-disable
 import/no-webpack-loader-syntax,
 import/no-unresolved,
 import/extensions
*/
// TODO Enable import *.css) includes once https://github.com/webpack/extract-text-webpack-plugin/issues/179
// is resolved. Included in bundle.scss for now.

import 'core-js/stable';

// Expose the libraries as globals for other modules to access
// Note that these are order-dependent - earlier items should not depend on later ones
import 'expose-loader?exposes=$,jQuery!jquery';
import 'expose-loader?exposes=PropTypes!prop-types';
import 'expose-loader?exposes=classnames!classnames';
import 'expose-loader?exposes=DeepFreezeStrict!deep-freeze-strict';
import 'expose-loader?exposes=React!react';
import 'expose-loader?exposes=ReactDom!react-dom';
import 'expose-loader?exposes=ReactRouterDom!react-router-dom';
import 'expose-loader?exposes=Reactstrap!reactstrap';
import 'expose-loader?exposes=IsomorphicFetch!isomorphic-fetch';
import 'expose-loader?exposes=Redux!redux';
import 'expose-loader?exposes=ReactRedux!react-redux';
import 'expose-loader?exposes=ReduxThunk!redux-thunk';
import 'expose-loader?exposes=ReduxForm!redux-form';
import 'expose-loader?exposes=qs!qs';
import 'expose-loader?exposes=ReactSelect!react-select';
import 'expose-loader?exposes=ReactDND!react-dnd';
import 'expose-loader?exposes=ReactDNDHtml5Backend!react-dnd-html5-backend';
import 'expose-loader?exposes=Page!page.js';
import 'expose-loader?exposes=validator!validator';
// @apollo/client can't be exposed - see https://github.com/webpack-contrib/expose-loader/issues/188
// import 'expose-loader?exposes=ApolloClient!@apollo/client';
import 'expose-loader?exposes=GraphQLTag!graphql-tag';
import 'expose-loader?exposes=GraphQLFragments!graphql-fragments';
import 'expose-loader?exposes=NodeUrl!url';
import 'expose-loader?exposes=modernizr!modernizr';
import 'expose-loader?exposes=moment!moment';
import 'expose-loader?exposes=merge!merge';

import '../../../thirdparty/jquery-ondemand/jquery.ondemand.js';
import '../../../thirdparty/jquery-ui/jquery-ui.js'; // there is related css in styles/bundle.scss
import '../../../thirdparty/jquery-entwine/jquery.entwine.js';
import '../../../thirdparty/jquery-cookie/jquery.cookie.js';
import '../../../thirdparty/jquery-query/jquery.query.js';
import 'jquery-form';
import 'jquery-sizes/lib/jquery.sizes.js';
import '../../../thirdparty/jstree/jquery.jstree.js'; // there is related css in styles/bundle.scss

import 'chosen-js';
