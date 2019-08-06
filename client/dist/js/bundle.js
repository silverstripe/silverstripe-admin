webpackJsonp([0],{

/***/ "./client/src/boot/BootRoutes.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _jquery = __webpack_require__(2);

var _jquery2 = _interopRequireDefault(_jquery);

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _reactRedux = __webpack_require__(5);

var _reactDom = __webpack_require__(10);

var _reactDom2 = _interopRequireDefault(_reactDom);

var _reactRouterDom = __webpack_require__(48);

var _reactRouterConfig = __webpack_require__("./node_modules/react-router-config/esm/react-router-config.js");

var _Config = __webpack_require__(18);

var _Config2 = _interopRequireDefault(_Config);

var _Router = __webpack_require__(52);

var _Router2 = _interopRequireDefault(_Router);

var _ReactRouteRegister = __webpack_require__(47);

var _ReactRouteRegister2 = _interopRequireDefault(_ReactRouteRegister);

var _App = __webpack_require__("./client/src/containers/App/App.js");

var _App2 = _interopRequireDefault(_App);

var _reactApollo = __webpack_require__(22);

var _i18n = __webpack_require__(3);

var _i18n2 = _interopRequireDefault(_i18n);

var _reduxForm = __webpack_require__(12);

var _getFormState = __webpack_require__(17);

var _getFormState2 = _interopRequireDefault(_getFormState);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BootRoutes = function () {
  function BootRoutes(store, client) {
    _classCallCheck(this, BootRoutes);

    this.store = store;
    this.client = client;

    var base = _Config2.default.get('absoluteBaseUrl');
    _Router2.default.setAbsoluteBase(base);

    this.handleBeforeRoute = this.handleBeforeRoute.bind(this);
    this.handleBeforeUnload = this.handleBeforeUnload.bind(this);
  }

  _createClass(BootRoutes, [{
    key: 'setStore',
    value: function setStore(store) {
      this.store = store;
    }
  }, {
    key: 'setClient',
    value: function setClient(client) {
      this.client = client;
    }
  }, {
    key: 'start',
    value: function start(location) {
      if (this.matchesReactRoute(location)) {
        this.initReactRouter();
      } else {
        this.initLegacyRouter();
      }
    }
  }, {
    key: 'matchesReactRoute',
    value: function matchesReactRoute(location) {
      var sections = _Config2.default.get('sections');
      var currentPath = _Router2.default.resolveURLToBase(location).replace(/\/$/, '');

      return !!sections.find(function (section) {
        var route = _Router2.default.resolveURLToBase(section.url).replace(/\/$/, '');

        if (!section.reactRouter) {
          return false;
        }

        return currentPath.match(route);
      });
    }
  }, {
    key: 'initReactRouter',
    value: function initReactRouter() {
      _ReactRouteRegister2.default.updateRootRoute({
        component: _App2.default
      });

      _reactDom2.default.render(_react2.default.createElement(
        _reactApollo.ApolloProvider,
        { client: this.client },
        _react2.default.createElement(
          _reactRedux.Provider,
          { store: this.store },
          _react2.default.createElement(
            _reactRouterDom.BrowserRouter,
            {
              basename: _Config2.default.get('baseUrl'),
              getUserConfirmation: this.handleBeforeRoute
            },
            (0, _reactRouterConfig.renderRoutes)([_ReactRouteRegister2.default.getRootRoute()])
          )
        )
      ), document.getElementsByClassName('cms-content')[0]);
    }
  }, {
    key: 'initLegacyRouter',
    value: function initLegacyRouter() {
      var _this = this;

      var sections = _Config2.default.get('sections');
      var store = this.store;

      (0, _Router2.default)('*', function (ctx, next) {
        var msg = _i18n2.default._t('Admin.CONFIRMUNSAVED', 'Are you sure you want to navigate away from this page?\n\n\n          WARNING: Your changes have not been saved.\n\n\n          Press OK to continue, or Cancel to stay on the current page.');

        if (!_this.shouldConfirmBeforeUnload() || window.confirm(msg)) {
          ctx.store = store;
          next();
        }
      });

      var lastPath = null;
      sections.forEach(function (section) {
        var route = _Router2.default.resolveURLToBase(section.url);
        route = route.replace(/\/$/, '');
        route = route + '(/*?)?';
        (0, _Router2.default)(route, function (ctx, next) {
          if (document.readyState !== 'complete' || ctx.init) {
            next();
            return;
          }

          if (!lastPath) {
            lastPath = window.location.pathname;
          }

          var forceReload = ctx.state && ctx.state.__forceReload;
          if (ctx.path !== lastPath || forceReload) {
            lastPath = ctx.path.replace(/#.*$/, '');
            (0, _jquery2.default)('.cms-container').entwine('ss').handleStateChange(null, ctx.state);
          }
        });
      });

      var currBeforeUnload = window.onbeforeunload;
      window.onbeforeunload = function () {
        if (_this.shouldConfirmBeforeUnload()) {
          return _i18n2.default._t('Admin.CONFIRMUNSAVEDSHORT', 'WARNING: Your changes have not been saved.');
        }

        if (typeof currBeforeUnload === 'function') {
          return currBeforeUnload();
        }

        return undefined;
      };

      _Router2.default.start();
    }
  }, {
    key: 'shouldConfirmBeforeUnload',
    value: function shouldConfirmBeforeUnload() {
      var state = this.store.getState();
      var forms = state.unsavedForms || [];
      var schemas = state.form.formSchemas;

      var changedForms = forms.filter(function (form) {
        var schema = Object.values(schemas).find(function (item) {
          return item.name === form.name;
        });

        var notify = schema && schema.state && schema.state.notifyUnsavedChanges;

        if (!notify) {
          return false;
        }

        return (0, _reduxForm.isDirty)(form.name, _getFormState2.default)(state);
      });

      return changedForms.length > 0;
    }
  }, {
    key: 'handleBeforeUnload',
    value: function handleBeforeUnload() {
      if (this.shouldConfirmBeforeUnload()) {
        return _i18n2.default._t('Admin.CONFIRMUNSAVEDSHORT', 'WARNING: Your changes have not been saved.');
      }

      return undefined;
    }
  }, {
    key: 'handleBeforeRoute',
    value: function handleBeforeRoute() {
      if (this.shouldConfirmBeforeUnload()) {
        return _i18n2.default._t('Admin.CONFIRMUNSAVED', 'Are you sure you want to navigate away\n          from this page?\n\nWARNING: Your changes have not been saved.\n\n\n          Press OK to continue, or Cancel to stay on the current page.');
      }

      return undefined;
    }
  }]);

  return BootRoutes;
}();

exports.default = BootRoutes;

/***/ }),

/***/ "./client/src/boot/apollo/buildCache.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _apolloCacheInmemory = __webpack_require__("./node_modules/apollo-cache-inmemory/lib/index.js");

var _dataIdFromObject = __webpack_require__("./client/src/boot/apollo/dataIdFromObject.js");

var _dataIdFromObject2 = _interopRequireDefault(_dataIdFromObject);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var buildCache = function buildCache(introspectionQueryResultData) {
  return new _apolloCacheInmemory.InMemoryCache({
    fragmentMatcher: introspectionQueryResultData ? new _apolloCacheInmemory.IntrospectionFragmentMatcher({
      introspectionQueryResultData: introspectionQueryResultData
    }) : null,
    dataIdFromObject: _dataIdFromObject2.default,
    addTypename: true
  });
};

exports.default = buildCache;

/***/ }),

/***/ "./client/src/boot/apollo/buildClient.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _apolloClient = __webpack_require__(25);

var _apolloClient2 = _interopRequireDefault(_apolloClient);

var _apolloLinkState = __webpack_require__("./node_modules/apollo-link-state/lib/index.js");

var _apolloLink = __webpack_require__("./node_modules/apollo-link/lib/index.js");

var _getGraphqlFragments = __webpack_require__("./client/src/boot/apollo/getGraphqlFragments.js");

var _getGraphqlFragments2 = _interopRequireDefault(_getGraphqlFragments);

var _buildNetworkComponents = __webpack_require__("./client/src/boot/apollo/buildNetworkComponents.js");

var _buildNetworkComponents2 = _interopRequireDefault(_buildNetworkComponents);

var _buildCache = __webpack_require__("./client/src/boot/apollo/buildCache.js");

var _buildCache2 = _interopRequireDefault(_buildCache);

var _Config = __webpack_require__(18);

var _Config2 = _interopRequireDefault(_Config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var buildClient = function () {
    var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(baseUrl) {
        var graphQLConfig, cachedTypenames, fragmentData, cache, components, stateLink, link;
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        graphQLConfig = _Config2.default.getSection('SilverStripe\\Admin\\LeftAndMain').graphql;
                        cachedTypenames = graphQLConfig && graphQLConfig.cachedTypenames;
                        fragmentData = void 0;
                        _context.prev = 3;
                        _context.next = 6;
                        return (0, _getGraphqlFragments2.default)(baseUrl, cachedTypenames);

                    case 6:
                        fragmentData = _context.sent;
                        _context.next = 12;
                        break;

                    case 9:
                        _context.prev = 9;
                        _context.t0 = _context['catch'](3);

                        fragmentData = null;

                    case 12:
                        cache = (0, _buildCache2.default)(fragmentData);
                        components = (0, _buildNetworkComponents2.default)(baseUrl);
                        stateLink = (0, _apolloLinkState.withClientState)({
                            cache: cache,
                            resolvers: {}
                        });
                        link = (0, _apolloLink.from)([stateLink].concat(_toConsumableArray(components)));
                        return _context.abrupt('return', new _apolloClient2.default({ cache: cache, link: link }));

                    case 17:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, undefined, [[3, 9]]);
    }));

    return function buildClient(_x) {
        return _ref.apply(this, arguments);
    };
}();

exports.default = buildClient;

/***/ }),

/***/ "./client/src/boot/apollo/buildNetworkComponents.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _apolloLinkHttp = __webpack_require__("./node_modules/apollo-link-http/lib/index.js");

var _apolloLinkError = __webpack_require__("./node_modules/apollo-link-error/lib/index.js");

var _apolloLink = __webpack_require__("./node_modules/apollo-link/lib/index.js");

var _Config = __webpack_require__(18);

var _Config2 = _interopRequireDefault(_Config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var buildNetworkComponents = function buildNetworkComponents(baseUrl) {
  var httpLink = new _apolloLinkHttp.HttpLink({
    uri: baseUrl + 'admin/graphql',
    fetchOptions: {
      credentials: 'same-origin',
      headers: {
        accept: 'application/json'
      }
    }
  });

  var errorLink = (0, _apolloLinkError.onError)(function (_ref) {
    var networkError = _ref.networkError;

    if (networkError) {
      console.log('[Network error]: ' + networkError);
    }
  });

  var middlewareLink = new _apolloLink.ApolloLink(function (operation, forward) {
    operation.setContext({
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        'X-CSRF-TOKEN': _Config2.default.get('SecurityID')
      }
    });

    return forward(operation);
  });

  return [middlewareLink, errorLink, httpLink];
};

exports.default = buildNetworkComponents;

/***/ }),

/***/ "./client/src/boot/apollo/dataIdFromObject.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var dataIdFromObject = function dataIdFromObject(o) {
  var dataId = o.id || o.ID;
  if (dataId && dataId >= 0 && o.__typename) {
    return o.__typename + ":" + dataId;
  }
  return null;
};

exports.default = dataIdFromObject;

/***/ }),

/***/ "./client/src/boot/apollo/getGraphqlFragments.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _isomorphicFetch = __webpack_require__(15);

var _isomorphicFetch2 = _interopRequireDefault(_isomorphicFetch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var parseResponse = function parseResponse(result) {
  var fragmentData = result.data;
  fragmentData.__schema.types = fragmentData.__schema.types.filter(function (type) {
    return type.possibleTypes !== null;
  });
  return fragmentData;
};

var handleError = function handleError(response) {
  if (!response.ok) {
    throw new Error('The types.graphql file could not be loaded. You probably need to run a ?flush to generate it.\n            Alternatively, you can use the IntrospectionProvider extension to generate the file dynamically.\n            More information: https://github.com/silverstripe/silverstripe-graphql/#schema-introspection');
  }

  return response;
};

var getGraphqlFragments = function () {
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(baseUrl) {
    var preferStatic = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
    var urls, primaryURL, fallbackURL, fetchConfig, fetchSchema, response;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            urls = [baseUrl + 'assets/admin.types.graphql', baseUrl + 'admin/graphql/types'];

            if (!preferStatic) {
              urls.reverse();
            }
            primaryURL = urls[0], fallbackURL = urls[1];
            fetchConfig = {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json'
              },
              uri: '' + baseUrl,
              credentials: 'same-origin'
            };

            fetchSchema = function () {
              var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee(url) {
                return regeneratorRuntime.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        return _context.abrupt('return', (0, _isomorphicFetch2.default)(url, fetchConfig).then(handleError).then(function (result) {
                          return result.json();
                        }).then(parseResponse));

                      case 1:
                      case 'end':
                        return _context.stop();
                    }
                  }
                }, _callee, undefined);
              }));

              return function fetchSchema(_x3) {
                return _ref2.apply(this, arguments);
              };
            }();

            response = void 0;
            _context2.prev = 6;
            _context2.next = 9;
            return fetchSchema(primaryURL);

          case 9:
            response = _context2.sent;
            _context2.next = 23;
            break;

          case 12:
            _context2.prev = 12;
            _context2.t0 = _context2['catch'](6);
            _context2.prev = 14;
            _context2.next = 17;
            return fetchSchema(fallbackURL);

          case 17:
            response = _context2.sent;
            _context2.next = 23;
            break;

          case 20:
            _context2.prev = 20;
            _context2.t1 = _context2['catch'](14);
            return _context2.abrupt('return', Promise.reject(_context2.t1));

          case 23:
            return _context2.abrupt('return', Promise.resolve(response));

          case 24:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined, [[6, 12], [14, 20]]);
  }));

  return function getGraphqlFragments(_x2) {
    return _ref.apply(this, arguments);
  };
}();

exports.default = getGraphqlFragments;

/***/ }),

/***/ "./client/src/boot/applyDevtools.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = applyDevtools;

var _redux = __webpack_require__(7);

function applyDevtools(middleware) {
  var composeExtension = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;

  var devTools = window.__REDUX_DEVTOOLS_EXTENSION__ || window.devToolsExtension;

  if (typeof composeExtension === 'function') {
    return composeExtension(middleware);
  }
  if (typeof devTools === 'function') {
    return (0, _redux.compose)(middleware, devTools());
  }
  return middleware;
}

/***/ }),

/***/ "./client/src/boot/applyTransforms.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _Injector = __webpack_require__(9);

var _Injector2 = _interopRequireDefault(_Injector);

var _Validator = __webpack_require__("./client/src/lib/Validator.js");

var _Validator2 = _interopRequireDefault(_Validator);

var _classnames = __webpack_require__(4);

var _classnames2 = _interopRequireDefault(_classnames);

var _schemaFieldValues = __webpack_require__(13);

var _FieldHolder = __webpack_require__(8);

var _FieldHolder2 = _interopRequireDefault(_FieldHolder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var togglePristineState = function togglePristineState(field) {
  var isPristine = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  var classes = field.extraClass ? field.extraClass.split(' ').reduce(function (prev, className) {
    return _extends({}, prev, _defineProperty({}, className, true));
  }, {}) : {};
  if (typeof field.data.pristineClass === 'string') {
    classes[field.data.pristineClass] = isPristine;
  }
  if (typeof field.data.dirtyClass === 'string') {
    classes[field.data.dirtyClass] = !isPristine;
  }

  var customTitle = isPristine ? field.data.pristineTitle : field.data.dirtyTitle;
  var customIcon = isPristine ? field.data.pristineIcon : field.data.dirtyIcon;

  return _extends({}, field, {
    title: customTitle || field.title,
    icon: customIcon || field.icon,
    extraClass: (0, _classnames2.default)(classes)
  });
};

var applyTransforms = function applyTransforms() {
  _Injector2.default.transform('field-holders', function (updater) {
    var fields = ['FieldGroup'];
    fields.forEach(function (field) {
      return updater.component('FieldGroup', _FieldHolder2.default, field + 'Holder');
    });
  });
  _Injector2.default.transform('form-action-changed', function (updater) {
    updater.form.alterSchema('*', function (form) {
      form.mutateField('action_save', function (field) {
        var isPristine = form.isPristine();

        return togglePristineState(field, isPristine);
      });
      form.mutateField('action_publish', function (field) {
        var isPristine = field.data.isPublished && !field.data.isModified && form.isPristine();

        return togglePristineState(field, isPristine);
      });

      return form.getState();
    });
  });
  _Injector2.default.transform('schema-validation', function (updater) {
    updater.form.addValidation('*', function (values, Validation, schema) {
      var validator = new _Validator2.default(values);
      var errorMap = Object.keys(values).reduce(function (curr, key) {
        var field = (0, _schemaFieldValues.findField)(schema.fields, key);
        if (!field) {
          return curr;
        }

        var _validator$validateFi = validator.validateFieldSchema(field),
            valid = _validator$validateFi.valid,
            errors = _validator$validateFi.errors;

        if (valid) {
          return curr;
        }
        return _extends({}, curr, _defineProperty({}, key, errors));
      }, {});
      Validation.addErrors(errorMap);

      return Validation.getState();
    });
  });
};

exports.default = applyTransforms;

/***/ }),

/***/ "./client/src/boot/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var appBoot = function () {
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
    var baseUrl, apolloClient, middleware, debugging, runMiddleware, createStoreWithMiddleware, routes;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            baseUrl = _Config2.default.get('absoluteBaseUrl');
            _context.next = 3;
            return (0, _buildClient2.default)(baseUrl);

          case 3:
            apolloClient = _context.sent;

            (0, _registerComponents2.default)();
            (0, _registerReducers2.default)();
            middleware = [_reduxThunk2.default];
            debugging = _Config2.default.get('debugging');
            runMiddleware = _redux.applyMiddleware.apply(undefined, middleware);


            if (debugging) {
              runMiddleware = (0, _applyDevtools2.default)(runMiddleware);
            }

            createStoreWithMiddleware = runMiddleware(_redux.createStore);

            window.ss.apolloClient = apolloClient;

            routes = new _BootRoutes2.default(null, apolloClient);

            (0, _applyTransforms2.default)();

            _Injector2.default.ready(function () {
              var rootReducer = (0, _redux.combineReducers)(_Injector2.default.reducer.getAll());
              var store = createStoreWithMiddleware(rootReducer, {});

              store.dispatch((0, _ConfigActions.setConfig)(_Config2.default.getAll()));
              _Injector2.default.reducer.setStore(store);

              window.ss.store = store;

              routes.setStore(store);
              routes.start(window.location.pathname);

              if (window.jQuery) {
                window.jQuery('body').addClass('js-react-boot').addClass('js-injector-boot');
              }
            });

            window.setTimeout(function () {
              return _Injector2.default.load();
            }, 0);

          case 16:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function appBoot() {
    return _ref.apply(this, arguments);
  };
}();

var _BootRoutes = __webpack_require__("./client/src/boot/BootRoutes.js");

var _BootRoutes2 = _interopRequireDefault(_BootRoutes);

var _Injector = __webpack_require__(9);

var _Injector2 = _interopRequireDefault(_Injector);

var _redux = __webpack_require__(7);

var _reduxThunk = __webpack_require__(51);

var _reduxThunk2 = _interopRequireDefault(_reduxThunk);

var _Config = __webpack_require__(18);

var _Config2 = _interopRequireDefault(_Config);

var _buildClient = __webpack_require__("./client/src/boot/apollo/buildClient.js");

var _buildClient2 = _interopRequireDefault(_buildClient);

var _ConfigActions = __webpack_require__("./client/src/state/config/ConfigActions.js");

var _registerComponents = __webpack_require__("./client/src/boot/registerComponents.js");

var _registerComponents2 = _interopRequireDefault(_registerComponents);

var _registerReducers = __webpack_require__("./client/src/boot/registerReducers.js");

var _registerReducers2 = _interopRequireDefault(_registerReducers);

var _applyDevtools = __webpack_require__("./client/src/boot/applyDevtools.js");

var _applyDevtools2 = _interopRequireDefault(_applyDevtools);

var _applyTransforms = __webpack_require__("./client/src/boot/applyTransforms.js");

var _applyTransforms2 = _interopRequireDefault(_applyTransforms);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

window.ss = window.ss || {};

window.onload = appBoot;

/***/ }),

/***/ "./client/src/boot/registerComponents.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _reduxForm = __webpack_require__(12);

var _Injector = __webpack_require__(9);

var _Injector2 = _interopRequireDefault(_Injector);

var _ActionMenu = __webpack_require__("./client/src/components/ActionMenu/ActionMenu.js");

var _ActionMenu2 = _interopRequireDefault(_ActionMenu);

var _Badge = __webpack_require__(36);

var _Badge2 = _interopRequireDefault(_Badge);

var _TextField = __webpack_require__("./client/src/components/TextField/TextField.js");

var _TextField2 = _interopRequireDefault(_TextField);

var _HiddenField = __webpack_require__("./client/src/components/HiddenField/HiddenField.js");

var _HiddenField2 = _interopRequireDefault(_HiddenField);

var _DateField = __webpack_require__("./client/src/components/DateField/DateField.js");

var _DateField2 = _interopRequireDefault(_DateField);

var _TimeField = __webpack_require__("./client/src/components/TimeField/TimeField.js");

var _TimeField2 = _interopRequireDefault(_TimeField);

var _DatetimeField = __webpack_require__("./client/src/components/DatetimeField/DatetimeField.js");

var _DatetimeField2 = _interopRequireDefault(_DatetimeField);

var _CheckboxField = __webpack_require__("./client/src/components/CheckboxField/CheckboxField.js");

var _CheckboxField2 = _interopRequireDefault(_CheckboxField);

var _CheckboxSetField = __webpack_require__("./client/src/components/CheckboxSetField/CheckboxSetField.js");

var _CheckboxSetField2 = _interopRequireDefault(_CheckboxSetField);

var _OptionsetField = __webpack_require__("./client/src/components/OptionsetField/OptionsetField.js");

var _OptionsetField2 = _interopRequireDefault(_OptionsetField);

var _GridField = __webpack_require__(41);

var _GridField2 = _interopRequireDefault(_GridField);

var _GridFieldActions = __webpack_require__("./client/src/components/GridFieldActions/GridFieldActions.js");

var _GridFieldActions2 = _interopRequireDefault(_GridFieldActions);

var _SingleSelectField = __webpack_require__("./client/src/components/SingleSelectField/SingleSelectField.js");

var _SingleSelectField2 = _interopRequireDefault(_SingleSelectField);

var _PopoverField = __webpack_require__("./client/src/components/PopoverField/PopoverField.js");

var _PopoverField2 = _interopRequireDefault(_PopoverField);

var _HeaderField = __webpack_require__("./client/src/components/HeaderField/HeaderField.js");

var _HeaderField2 = _interopRequireDefault(_HeaderField);

var _LiteralField = __webpack_require__(42);

var _LiteralField2 = _interopRequireDefault(_LiteralField);

var _HtmlReadonlyField = __webpack_require__("./client/src/components/HtmlReadonlyField/HtmlReadonlyField.js");

var _HtmlReadonlyField2 = _interopRequireDefault(_HtmlReadonlyField);

var _LookupField = __webpack_require__("./client/src/components/LookupField/LookupField.js");

var _LookupField2 = _interopRequireDefault(_LookupField);

var _CompositeField = __webpack_require__("./client/src/components/CompositeField/CompositeField.js");

var _CompositeField2 = _interopRequireDefault(_CompositeField);

var _LabelField = __webpack_require__("./client/src/components/LabelField/LabelField.js");

var _LabelField2 = _interopRequireDefault(_LabelField);

var _Tabs = __webpack_require__("./client/src/components/Tabs/Tabs.js");

var _Tabs2 = _interopRequireDefault(_Tabs);

var _TabItem = __webpack_require__("./client/src/components/Tabs/TabItem.js");

var _TabItem2 = _interopRequireDefault(_TabItem);

var _FormAction = __webpack_require__(38);

var _FormAction2 = _interopRequireDefault(_FormAction);

var _FieldGroup = __webpack_require__("./client/src/components/FieldGroup/FieldGroup.js");

var _FieldGroup2 = _interopRequireDefault(_FieldGroup);

var _TreeDropdownField = __webpack_require__(33);

var _TreeDropdownField2 = _interopRequireDefault(_TreeDropdownField);

var _FormBuilderModal = __webpack_require__(29);

var _FormBuilderModal2 = _interopRequireDefault(_FormBuilderModal);

var _NotFoundComponent = __webpack_require__("./client/src/components/NotFoundComponent/NotFoundComponent.js");

var _NotFoundComponent2 = _interopRequireDefault(_NotFoundComponent);

var _Form = __webpack_require__("./client/src/components/Form/Form.js");

var _Form2 = _interopRequireDefault(_Form);

var _FormAlert = __webpack_require__(19);

var _FormAlert2 = _interopRequireDefault(_FormAlert);

var _Preview = __webpack_require__(44);

var _Preview2 = _interopRequireDefault(_Preview);

var _Form3 = __webpack_require__("./client/src/containers/Form/Form.js");

var _Form4 = _interopRequireDefault(_Form3);

var _UsedOnTable = __webpack_require__("./client/src/components/UsedOnTable/UsedOnTable.js");

var _UsedOnTable2 = _interopRequireDefault(_UsedOnTable);

var _Loading = __webpack_require__(30);

var _Loading2 = _interopRequireDefault(_Loading);

var _ViewModeToggle = __webpack_require__(56);

var _ViewModeToggle2 = _interopRequireDefault(_ViewModeToggle);

var _ResizeAware = __webpack_require__(23);

var _ResizeAware2 = _interopRequireDefault(_ResizeAware);

var _Tag = __webpack_require__(24);

var _Tag2 = _interopRequireDefault(_Tag);

var _TagList = __webpack_require__(32);

var _TagList2 = _interopRequireDefault(_TagList);

var _CompactTagList = __webpack_require__(27);

var _CompactTagList2 = _interopRequireDefault(_CompactTagList);

var _Search = __webpack_require__(31);

var _Search2 = _interopRequireDefault(_Search);

var _SearchToggle = __webpack_require__(53);

var _SearchToggle2 = _interopRequireDefault(_SearchToggle);

var _HtmlEditorField = __webpack_require__("./client/src/components/HtmlEditorField/HtmlEditorField.js");

var _HtmlEditorField2 = _interopRequireDefault(_HtmlEditorField);

var _NumberField = __webpack_require__("./client/src/components/NumberField/NumberField.js");

var _NumberField2 = _interopRequireDefault(_NumberField);

var _PopoverOptionSet = __webpack_require__("./client/src/components/PopoverOptionSet/PopoverOptionSet.js");

var _PopoverOptionSet2 = _interopRequireDefault(_PopoverOptionSet);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  _Injector2.default.component.registerMany({
    ActionMenu: _ActionMenu2.default,
    Badge: _Badge2.default,
    TextField: _TextField2.default,
    HiddenField: _HiddenField2.default,
    DateField: _DateField2.default,
    TimeField: _TimeField2.default,
    DatetimeField: _DatetimeField2.default,
    CheckboxField: _CheckboxField2.default,
    CheckboxSetField: _CheckboxSetField2.default,
    OptionsetField: _OptionsetField2.default,
    GridField: _GridField2.default,
    GridFieldActions: _GridFieldActions2.default,
    FieldGroup: _FieldGroup2.default,
    SingleSelectField: _SingleSelectField2.default,
    PopoverField: _PopoverField2.default,
    HeaderField: _HeaderField2.default,
    LiteralField: _LiteralField2.default,
    HtmlReadonlyField: _HtmlReadonlyField2.default,
    LookupField: _LookupField2.default,
    CompositeField: _CompositeField2.default,
    Tabs: _Tabs2.default,
    TabItem: _TabItem2.default,
    FormAction: _FormAction2.default,
    LabelField: _LabelField2.default,
    TreeDropdownField: _TreeDropdownField2.default,
    Preview: _Preview2.default,
    ReduxForm: _Form4.default,
    ReduxFormField: _reduxForm.Field,
    Form: _Form2.default,
    FormAlert: _FormAlert2.default,
    FormBuilderModal: _FormBuilderModal2.default,
    NotFoundComponent: _NotFoundComponent2.default,
    UsedOnTable: _UsedOnTable2.default,
    Loading: _Loading2.default,
    ViewModeToggle: _ViewModeToggle2.default,
    ResizeAware: _ResizeAware2.default,
    Tag: _Tag2.default,
    TagList: _TagList2.default,
    CompactTagList: _CompactTagList2.default,
    Search: _Search2.default,
    SearchToggle: _SearchToggle2.default,
    HtmlEditorField: _HtmlEditorField2.default,
    NumberField: _NumberField2.default,
    PopoverOptionSet: _PopoverOptionSet2.default
  });
};

/***/ }),

/***/ "./client/src/boot/registerReducers.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _Injector = __webpack_require__(9);

var _Injector2 = _interopRequireDefault(_Injector);

var _redux = __webpack_require__(7);

var _reduxForm = __webpack_require__(12);

var _ConfigReducer = __webpack_require__("./client/src/state/config/ConfigReducer.js");

var _ConfigReducer2 = _interopRequireDefault(_ConfigReducer);

var _SchemaReducer = __webpack_require__("./client/src/state/schema/SchemaReducer.js");

var _SchemaReducer2 = _interopRequireDefault(_SchemaReducer);

var _RecordsReducer = __webpack_require__("./client/src/state/records/RecordsReducer.js");

var _RecordsReducer2 = _interopRequireDefault(_RecordsReducer);

var _BreadcrumbsReducer = __webpack_require__("./client/src/state/breadcrumbs/BreadcrumbsReducer.js");

var _BreadcrumbsReducer2 = _interopRequireDefault(_BreadcrumbsReducer);

var _TreeDropdownFieldReducer = __webpack_require__("./client/src/state/treeDropdownField/TreeDropdownFieldReducer.js");

var _TreeDropdownFieldReducer2 = _interopRequireDefault(_TreeDropdownFieldReducer);

var _TabsReducer = __webpack_require__("./client/src/state/tabs/TabsReducer.js");

var _TabsReducer2 = _interopRequireDefault(_TabsReducer);

var _MobileMenuReducer = __webpack_require__("./client/src/state/mobileMenu/MobileMenuReducer.js");

var _MobileMenuReducer2 = _interopRequireDefault(_MobileMenuReducer);

var _UnsavedFormsReducer = __webpack_require__("./client/src/state/unsavedForms/UnsavedFormsReducer.js");

var _UnsavedFormsReducer2 = _interopRequireDefault(_UnsavedFormsReducer);

var _usedOnReducer = __webpack_require__("./client/src/state/usedOn/usedOnReducer.js");

var _usedOnReducer2 = _interopRequireDefault(_usedOnReducer);

var _applyFormMiddleware = __webpack_require__("./client/src/lib/dependency-injection/applyFormMiddleware.js");

var _applyFormMiddleware2 = _interopRequireDefault(_applyFormMiddleware);

var _ViewModeReducer = __webpack_require__("./client/src/state/viewMode/ViewModeReducer.js");

var _ViewModeReducer2 = _interopRequireDefault(_ViewModeReducer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  var extra = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var FormReducer = (0, _redux.combineReducers)({
    formState: _reduxForm.reducer,
    formSchemas: _SchemaReducer2.default
  });

  _Injector2.default.reducer.registerMany(_extends({
    config: _ConfigReducer2.default,
    form: FormReducer,
    records: _RecordsReducer2.default,
    breadcrumbs: _BreadcrumbsReducer2.default,
    treeDropdownField: _TreeDropdownFieldReducer2.default,
    tabs: _TabsReducer2.default,
    mobileMenu: _MobileMenuReducer2.default,
    unsavedForms: _UnsavedFormsReducer2.default,
    usedOn: _usedOnReducer2.default,
    viewMode: _ViewModeReducer2.default
  }, extra));

  _Injector2.default.transform('admin', function (updater) {
    updater.reducer('form', _applyFormMiddleware2.default);
  });
};

/***/ }),

/***/ "./client/src/bundles/bundle.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__("./client/src/i18n.js");

__webpack_require__("./node_modules/expose-loader/index.js?SilverStripeComponent!./client/src/lib/SilverStripeComponent.js-exposed");
__webpack_require__("./node_modules/expose-loader/index.js?Backend!./client/src/lib/Backend.js-exposed");
__webpack_require__("./node_modules/expose-loader/index.js?schemaFieldValues!./client/src/lib/schemaFieldValues.js-exposed");
__webpack_require__("./node_modules/expose-loader/index.js?FormAlert!./client/src/components/FormAlert/FormAlert.js-exposed");
__webpack_require__("./node_modules/expose-loader/index.js?Injector!./client/src/lib/Injector.js-exposed");
__webpack_require__("./node_modules/expose-loader/index.js?reduxFieldReducer!./client/src/lib/reduxFieldReducer.js-exposed");
__webpack_require__("./node_modules/expose-loader/index.js?getFormState!./client/src/lib/getFormState.js-exposed");
__webpack_require__("./node_modules/expose-loader/index.js?PopoverField!./client/src/components/PopoverField/PopoverField.js-exposed");
__webpack_require__("./node_modules/expose-loader/index.js?FieldHolder!./client/src/components/FieldHolder/FieldHolder.js-exposed");
__webpack_require__("./node_modules/expose-loader/index.js?Form!./client/src/components/Form/Form.js-exposed");
__webpack_require__("./node_modules/expose-loader/index.js?FormConstants!./client/src/components/Form/FormConstants.js-exposed");
__webpack_require__("./node_modules/expose-loader/index.js?FormAction!./client/src/components/FormAction/FormAction.js-exposed");
__webpack_require__("./node_modules/expose-loader/index.js?SchemaActions!./client/src/state/schema/SchemaActions.js-exposed");
__webpack_require__("./node_modules/expose-loader/index.js?FormBuilder!./client/src/components/FormBuilder/FormBuilder.js-exposed");
__webpack_require__("./node_modules/expose-loader/index.js?FormBuilderLoader!./client/src/containers/FormBuilderLoader/FormBuilderLoader.js-exposed");
__webpack_require__("./node_modules/expose-loader/index.js?FormBuilderModal!./client/src/components/FormBuilderModal/FormBuilderModal.js-exposed");
__webpack_require__("./node_modules/expose-loader/index.js?FileSchemaModalHandler!./client/src/containers/InsertLinkModal/fileSchemaModalHandler.js-exposed");
__webpack_require__("./node_modules/expose-loader/index.js?InsertLinkModal!./client/src/containers/InsertLinkModal/InsertLinkModal.js-exposed");
__webpack_require__("./node_modules/expose-loader/index.js?RecordsActions!./client/src/state/records/RecordsActions.js-exposed");
__webpack_require__("./node_modules/expose-loader/index.js?GridField!./client/src/components/GridField/GridField.js-exposed");
__webpack_require__("./node_modules/expose-loader/index.js?GridFieldCell!./client/src/components/GridField/GridFieldCell.js-exposed");
__webpack_require__("./node_modules/expose-loader/index.js?GridFieldHeader!./client/src/components/GridField/GridFieldHeader.js-exposed");
__webpack_require__("./node_modules/expose-loader/index.js?GridFieldHeaderCell!./client/src/components/GridField/GridFieldHeaderCell.js-exposed");
__webpack_require__("./node_modules/expose-loader/index.js?GridFieldRow!./client/src/components/GridField/GridFieldRow.js-exposed");
__webpack_require__("./node_modules/expose-loader/index.js?GridFieldTable!./client/src/components/GridField/GridFieldTable.js-exposed");
__webpack_require__("./node_modules/expose-loader/index.js?Accordion!./client/src/components/Accordion/Accordion.js-exposed");
__webpack_require__("./node_modules/expose-loader/index.js?AccordionBlock!./client/src/components/Accordion/AccordionBlock.js-exposed");
__webpack_require__("./node_modules/expose-loader/index.js?HiddenField!./client/src/components/HiddenField/HiddenField.js-exposed");
__webpack_require__("./node_modules/expose-loader/index.js?ListGroup!./client/src/components/ListGroup/ListGroup.js-exposed");
__webpack_require__("./node_modules/expose-loader/index.js?ListGroupItem!./client/src/components/ListGroup/ListGroupItem.js-exposed");
__webpack_require__("./node_modules/expose-loader/index.js?Loading!./client/src/components/Loading/Loading.js-exposed");
__webpack_require__("./node_modules/expose-loader/index.js?TextField!./client/src/components/TextField/TextField.js-exposed");
__webpack_require__("./node_modules/expose-loader/index.js?LiteralField!./client/src/components/LiteralField/LiteralField.js-exposed");
__webpack_require__("./node_modules/expose-loader/index.js?Toolbar!./client/src/components/Toolbar/Toolbar.js-exposed");
__webpack_require__("./node_modules/expose-loader/index.js?Breadcrumb!./client/src/components/Breadcrumb/Breadcrumb.js-exposed");
__webpack_require__("./node_modules/expose-loader/index.js?ResizeAware!./client/src/components/ResizeAware/ResizeAware.js-exposed");
__webpack_require__("./node_modules/expose-loader/index.js?TabsActions!./client/src/state/tabs/TabsActions.js-exposed");
__webpack_require__("./node_modules/expose-loader/index.js?Tag!./client/src/components/Tag/Tag.js-exposed");
__webpack_require__("./node_modules/expose-loader/index.js?TagList!./client/src/components/Tag/TagList.js-exposed");
__webpack_require__("./node_modules/expose-loader/index.js?CompactTagList!./client/src/components/Tag/CompactTagList.js-exposed");
__webpack_require__("./node_modules/expose-loader/index.js?Search!./client/src/components/Search/Search.js-exposed");
__webpack_require__("./node_modules/expose-loader/index.js?SearchToggle!./client/src/components/Search/SearchToggle.js-exposed");
__webpack_require__("./node_modules/expose-loader/index.js?TreeDropdownFieldNode!./client/src/components/TreeDropdownField/TreeDropdownFieldNode.js-exposed");
__webpack_require__("./node_modules/expose-loader/index.js?TreeDropdownFieldMenu!./client/src/components/TreeDropdownField/TreeDropdownFieldMenu.js-exposed");
__webpack_require__("./node_modules/expose-loader/index.js?TreeDropdownField!./client/src/components/TreeDropdownField/TreeDropdownField.js-exposed");
__webpack_require__("./node_modules/expose-loader/index.js?BreadcrumbsActions!./client/src/state/breadcrumbs/BreadcrumbsActions.js-exposed");
__webpack_require__("./node_modules/expose-loader/index.js?RecordsActionTypes!./client/src/state/records/RecordsActionTypes.js-exposed");
__webpack_require__("./node_modules/expose-loader/index.js?UnsavedFormsActions!./client/src/state/unsavedForms/UnsavedFormsActions.js-exposed");
__webpack_require__("./node_modules/expose-loader/index.js?Badge!./client/src/components/Badge/Badge.js-exposed");
__webpack_require__("./node_modules/expose-loader/index.js?CheckboxSetField!./client/src/components/CheckboxSetField/CheckboxSetField.js-exposed");
__webpack_require__("./node_modules/expose-loader/index.js?Preview!./client/src/components/Preview/Preview.js-exposed");
__webpack_require__("./node_modules/expose-loader/index.js?ViewModeStates!./client/src/state/viewMode/ViewModeStates.js-exposed");
__webpack_require__("./node_modules/expose-loader/index.js?ViewModeActions!./client/src/state/viewMode/ViewModeActions.js-exposed");
__webpack_require__("./node_modules/expose-loader/index.js?ViewModeToggle!./client/src/components/ViewModeToggle/ViewModeToggle.js-exposed");
__webpack_require__("./node_modules/expose-loader/index.js?Focusedzone!./client/src/components/Focusedzone/Focusedzone.js-exposed");
__webpack_require__("./node_modules/expose-loader/index.js?Config!./client/src/lib/Config.js-exposed");
__webpack_require__("./node_modules/expose-loader/index.js?DataFormat!./client/src/lib/DataFormat.js-exposed");
__webpack_require__("./node_modules/expose-loader/index.js?ReactRouteRegister!./client/src/lib/ReactRouteRegister.js-exposed");
__webpack_require__("./node_modules/expose-loader/index.js?Router!./client/src/lib/Router.js-exposed");
__webpack_require__("./node_modules/expose-loader/index.js?TinyMCEActionRegistrar!./client/src/lib/TinyMCEActionRegistrar.js-exposed");
__webpack_require__("./node_modules/expose-loader/index.js?ShortcodeSerialiser!./client/src/lib/ShortcodeSerialiser.js-exposed");
__webpack_require__("./node_modules/expose-loader/index.js?formatWrittenNumber!./client/src/lib/formatWrittenNumber.js-exposed");
__webpack_require__("./node_modules/expose-loader/index.js?withDragDropContext!./client/src/lib/withDragDropContext.js-exposed");

__webpack_require__("./client/src/legacy/sspath.js");
__webpack_require__("./client/src/legacy/ssui.core.js");
__webpack_require__("./client/src/legacy/LeftAndMain.js");
__webpack_require__("./client/src/legacy/LeftAndMain.ActionTabSet.js");
__webpack_require__("./client/src/legacy/LeftAndMain.Panel.js");
__webpack_require__("./client/src/legacy/LeftAndMain.Tree.js");
__webpack_require__("./client/src/legacy/LeftAndMain.Content.js");
__webpack_require__("./client/src/legacy/LeftAndMain.EditForm.js");
__webpack_require__("./client/src/legacy/LeftAndMain.Menu.js");
__webpack_require__("./client/src/legacy/LeftAndMain.MobileMenuToggle.js");
__webpack_require__("./client/src/legacy/LeftAndMain.Preview.js");
__webpack_require__("./client/src/legacy/LeftAndMain.BatchActions.js");
__webpack_require__("./client/src/legacy/LeftAndMain.FieldHelp.js");
__webpack_require__("./client/src/legacy/LeftAndMain.FieldDescriptionToggle.js");
__webpack_require__("./client/src/legacy/LeftAndMain.TreeDropdownField.js");
__webpack_require__("./client/src/legacy/AddToCampaignForm.js");
__webpack_require__("./client/src/legacy/SecurityAdmin.js");
__webpack_require__("./client/src/legacy/ModelAdmin.js");

__webpack_require__("./client/src/legacy/ConfirmedPasswordField.js");
__webpack_require__("./client/src/legacy/SelectionGroup.js");
__webpack_require__("./client/src/legacy/DateField.js");
__webpack_require__("./client/src/legacy/ToggleCompositeField.js");
__webpack_require__("./client/src/legacy/TreeDropdownField/TreeDropdownFieldEntwine.js");
__webpack_require__("./client/src/legacy/UsedOnTable/UsedOnTableEntwine.js");
__webpack_require__("./client/src/legacy/DateField.js");
__webpack_require__("./client/src/legacy/DatetimeField.js");
__webpack_require__("./client/src/legacy/HtmlEditorField.js");
__webpack_require__("./client/src/legacy/TabSet.js");
__webpack_require__("./client/src/legacy/GridField.js");

__webpack_require__("./client/src/boot/index.js");

/***/ }),

/***/ "./client/src/components/ActionMenu/ActionMenu.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(1);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactstrap = __webpack_require__(6);

var _i18n = __webpack_require__(3);

var _i18n2 = _interopRequireDefault(_i18n);

var _classnames = __webpack_require__(4);

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ActionMenu = function (_PureComponent) {
  _inherits(ActionMenu, _PureComponent);

  function ActionMenu(props) {
    _classCallCheck(this, ActionMenu);

    var _this = _possibleConstructorReturn(this, (ActionMenu.__proto__ || Object.getPrototypeOf(ActionMenu)).call(this, props));

    _this.toggle = _this.toggle.bind(_this);
    _this.state = {
      isOpen: false
    };
    return _this;
  }

  _createClass(ActionMenu, [{
    key: 'toggle',
    value: function toggle(event) {
      var toggleCallback = this.props.toggleCallback;

      if (toggleCallback) {
        toggleCallback(event);
      }

      this.setState({
        isOpen: !this.state.isOpen
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          dropdownToggleProps = _props.dropdownToggleProps,
          dropdownMenuProps = _props.dropdownMenuProps,
          dropdownToggleClassNames = _props.dropdownToggleClassNames,
          className = _props.className,
          toggleCallback = _props.toggleCallback,
          restProps = _objectWithoutProperties(_props, ['dropdownToggleProps', 'dropdownMenuProps', 'dropdownToggleClassNames', 'className', 'toggleCallback']);

      var toggleClassName = (0, _classnames2.default)(dropdownToggleClassNames, dropdownToggleProps.className);
      var menuClassName = (0, _classnames2.default)('action-menu__dropdown', dropdownMenuProps.className);

      return _react2.default.createElement(
        _reactstrap.Dropdown,
        _extends({
          className: (0, _classnames2.default)('action-menu', className),
          isOpen: this.state.isOpen,
          toggle: this.toggle
        }, restProps),
        _react2.default.createElement(_reactstrap.DropdownToggle, _extends({ className: toggleClassName, 'aria-label': _i18n2.default._t('Admin.ACTIONS', 'View actions') }, dropdownToggleProps)),
        _react2.default.createElement(
          _reactstrap.DropdownMenu,
          _extends({ className: menuClassName }, dropdownMenuProps),
          this.props.children
        )
      );
    }
  }]);

  return ActionMenu;
}(_react.PureComponent);

ActionMenu.propTypes = {
  toggleCallback: _propTypes2.default.func,
  dropdownToggleClassNames: _propTypes2.default.arrayOf(_propTypes2.default.string)
};

ActionMenu.defaultProps = {
  className: '',
  dropdownToggleClassNames: ['action-menu__toggle', 'btn', 'btn--no-text', 'btn--icon-xl', 'font-icon-dot-3'],
  dropdownToggleProps: {},
  dropdownMenuProps: {}
};

exports.default = ActionMenu;

/***/ }),

/***/ "./client/src/components/CheckboxField/CheckboxField.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Component = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _FieldHolder = __webpack_require__(8);

var _FieldHolder2 = _interopRequireDefault(_FieldHolder);

var _OptionField = __webpack_require__("./client/src/components/OptionsetField/OptionField.js");

var _OptionField2 = _interopRequireDefault(_OptionField);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Checkbox = function Checkbox(props) {
  return _react2.default.createElement(_OptionField2.default, _extends({}, props, { type: 'checkbox' }));
};

var CheckboxField = function CheckboxField(props) {
  var FieldHolder = (0, _FieldHolder2.default)(Checkbox);

  return _react2.default.createElement(FieldHolder, _extends({}, props, { hideLabels: true }));
};

exports.Component = Checkbox;
exports.default = CheckboxField;

/***/ }),

/***/ "./client/src/components/CheckboxSetField/CheckboxSetField.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Component = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _OptionField = __webpack_require__("./client/src/components/OptionsetField/OptionField.js");

var _OptionField2 = _interopRequireDefault(_OptionField);

var _FieldHolder = __webpack_require__(8);

var _FieldHolder2 = _interopRequireDefault(_FieldHolder);

var _propTypes = __webpack_require__(1);

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CheckboxSet = function (_Component) {
  _inherits(CheckboxSet, _Component);

  function CheckboxSet(props) {
    _classCallCheck(this, CheckboxSet);

    var _this = _possibleConstructorReturn(this, (CheckboxSet.__proto__ || Object.getPrototypeOf(CheckboxSet)).call(this, props));

    _this.getItemKey = _this.getItemKey.bind(_this);
    _this.getOptionProps = _this.getOptionProps.bind(_this);
    _this.handleChange = _this.handleChange.bind(_this);
    _this.getValues = _this.getValues.bind(_this);
    return _this;
  }

  _createClass(CheckboxSet, [{
    key: 'getItemKey',
    value: function getItemKey(item, index) {
      return this.props.id + '-' + (item.value || 'empty' + index);
    }
  }, {
    key: 'getValues',
    value: function getValues() {
      var values = this.props.value;

      if (!Array.isArray(values)) {
        if (typeof values === 'string') {
          values = values.length ? [values] : [];
        }
        if (typeof values === 'number') {
          values = [values];
        }
      }

      if (values) {
        return values.map(function (value) {
          return '' + value;
        });
      }
      return [];
    }
  }, {
    key: 'getOptionProps',
    value: function getOptionProps(item, index) {
      var values = this.getValues();
      var key = this.getItemKey(item, index);

      return {
        key: key,
        id: key,
        name: this.props.name,
        className: this.props.itemClass,
        disabled: item.disabled || this.props.disabled,
        readOnly: this.props.readOnly,
        onChange: this.handleChange,
        value: values.indexOf('' + item.value) > -1,
        title: item.title,
        type: 'checkbox'
      };
    }
  }, {
    key: 'handleChange',
    value: function handleChange(event, field) {
      var _this2 = this;

      if (typeof this.props.onChange === 'function') {
        var oldValue = this.getValues();
        var value = this.props.source.filter(function (item, index) {
          if (_this2.getItemKey(item, index) === field.id) {
            return field.value === 1;
          }
          return oldValue.indexOf('' + item.value) > -1;
        }).map(function (item) {
          return '' + item.value;
        });

        this.props.onChange(event, { id: this.props.id, value: value });
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      if (!this.props.source) {
        return null;
      }
      return _react2.default.createElement(
        'div',
        null,
        this.props.source.map(function (item, index) {
          return _react2.default.createElement(_OptionField2.default, _extends({}, _this3.getOptionProps(item, index), { hideLabels: true }));
        })
      );
    }
  }]);

  return CheckboxSet;
}(_react.Component);

CheckboxSet.propTypes = {
  className: _propTypes2.default.string,
  extraClass: _propTypes2.default.string,
  itemClass: _propTypes2.default.string,
  id: _propTypes2.default.string,
  name: _propTypes2.default.string.isRequired,
  source: _propTypes2.default.arrayOf(_propTypes2.default.shape({
    value: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.number]),
    title: _propTypes2.default.any,
    disabled: _propTypes2.default.bool
  })),
  onChange: _propTypes2.default.func,
  value: _propTypes2.default.any,
  readOnly: _propTypes2.default.bool,
  disabled: _propTypes2.default.bool
};

CheckboxSet.defaultProps = {
  extraClass: '',
  className: '',
  value: []
};

exports.Component = CheckboxSet;


var CheckboxSetField = function CheckboxSetField(props) {
  var FieldHolder = (0, _FieldHolder2.default)(CheckboxSet);
  return _react2.default.createElement(FieldHolder, props);
};

exports.default = CheckboxSetField;

/***/ }),

/***/ "./client/src/components/CompositeField/CompositeField.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Component = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _castStringToElement = __webpack_require__("./client/src/lib/castStringToElement.js");

var _castStringToElement2 = _interopRequireDefault(_castStringToElement);

var _propTypes = __webpack_require__(1);

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CompositeField = function (_Component) {
  _inherits(CompositeField, _Component);

  function CompositeField() {
    _classCallCheck(this, CompositeField);

    return _possibleConstructorReturn(this, (CompositeField.__proto__ || Object.getPrototypeOf(CompositeField)).apply(this, arguments));
  }

  _createClass(CompositeField, [{
    key: 'getLegend',
    value: function getLegend() {
      if (this.props.data.tag === 'fieldset' && this.props.data.legend) {
        return (0, _castStringToElement2.default)('legend', this.props.data.legend);
      }
      return null;
    }
  }, {
    key: 'getClassName',
    value: function getClassName() {
      return this.props.className + ' ' + this.props.extraClass;
    }
  }, {
    key: 'render',
    value: function render() {
      var legend = this.getLegend();
      var Tag = this.props.data.tag || 'div';
      var className = this.getClassName();

      return _react2.default.createElement(
        Tag,
        { className: className },
        legend,
        this.props.children
      );
    }
  }]);

  return CompositeField;
}(_react.Component);

CompositeField.propTypes = {
  data: _propTypes2.default.oneOfType([_propTypes2.default.array, _propTypes2.default.shape({
    tag: _propTypes2.default.string,
    legend: _propTypes2.default.string
  })]),
  extraClass: _propTypes2.default.string
};

CompositeField.defaultProps = {
  className: '',
  extraClass: ''
};

exports.Component = CompositeField;
exports.default = CompositeField;

/***/ }),

/***/ "./client/src/components/DateField/DateField.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Component = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _FieldHolder = __webpack_require__(8);

var _FieldHolder2 = _interopRequireDefault(_FieldHolder);

var _TextField2 = __webpack_require__("./client/src/components/TextField/TextField.js");

var _moment2 = __webpack_require__(14);

var _moment3 = _interopRequireDefault(_moment2);

var _modernizr = __webpack_require__(21);

var _modernizr2 = _interopRequireDefault(_modernizr);

var _i18n = __webpack_require__(3);

var _i18n2 = _interopRequireDefault(_i18n);

var _propTypes = __webpack_require__(1);

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var localFormat = 'L';

var DateField = function (_TextField) {
  _inherits(DateField, _TextField);

  function DateField() {
    _classCallCheck(this, DateField);

    return _possibleConstructorReturn(this, (DateField.__proto__ || Object.getPrototypeOf(DateField)).apply(this, arguments));
  }

  _createClass(DateField, [{
    key: 'render',
    value: function render() {
      return _get(DateField.prototype.__proto__ || Object.getPrototypeOf(DateField.prototype), 'render', this).call(this);
    }
  }, {
    key: 'moment',
    value: function moment() {
      _moment3.default.locale(this.getLang());
      return _moment3.default.apply(undefined, arguments);
    }
  }, {
    key: 'getLang',
    value: function getLang() {
      var lang = this.asHTML5() ? this.props.isoLang : this.props.lang;

      return lang || (0, _moment3.default)().locale();
    }
  }, {
    key: 'asHTML5',
    value: function asHTML5() {
      return this.props.data.html5 && this.hasNativeSupport();
    }
  }, {
    key: 'hasNativeSupport',
    value: function hasNativeSupport() {
      return this.props.modernizr.inputtypes.date;
    }
  }, {
    key: 'getInputProps',
    value: function getInputProps() {
      var placeholder = _i18n2.default.inject(_i18n2.default._t('Admin.FormatExample', 'Example: {format}'), { format: this.moment().endOf('month').format(localFormat) });

      var value = this.asHTML5() ? this.props.value : this.getLocalisedValue();
      var type = this.asHTML5() ? 'date' : 'text';
      var props = _extends({}, _get(DateField.prototype.__proto__ || Object.getPrototypeOf(DateField.prototype), 'getInputProps', this).call(this), {
        type: type,

        value: value,
        placeholder: placeholder
      });

      return props;
    }
  }, {
    key: 'getLocalisedValue',
    value: function getLocalisedValue() {
      return this.convertToLocalised(this.props.value);
    }
  }, {
    key: 'isMultiline',
    value: function isMultiline() {
      return false;
    }
  }, {
    key: 'handleChange',
    value: function handleChange(event) {
      var enteredValue = event.target.value;
      var isoValue = '';

      if (this.asHTML5()) {
        isoValue = enteredValue;
      } else {
        isoValue = this.convertToIso(enteredValue);
      }

      if (typeof this.props.onChange === 'function') {
        this.triggerChange(event, isoValue);
      }
    }
  }, {
    key: 'triggerChange',
    value: function triggerChange(event, value) {
      this.props.onChange(event, { id: this.props.id, value: value });
    }
  }, {
    key: 'convertToIso',
    value: function convertToIso(localDate) {
      var isoDate = '';

      if (localDate) {
        var dateObject = this.moment(localDate, [localFormat, 'YYYY-MM-DD']);
        if (dateObject.isValid()) {
          isoDate = dateObject.format('YYYY-MM-DD');
        }
      }

      return isoDate;
    }
  }, {
    key: 'convertToLocalised',
    value: function convertToLocalised(isoDate) {
      var localDate = '';
      if (isoDate) {
        var dateObject = this.moment(isoDate);
        if (dateObject.isValid()) {
          localDate = dateObject.format(localFormat);
        }
      }
      return localDate;
    }
  }]);

  return DateField;
}(_TextField2.Component);

DateField.propTypes = {
  lang: _propTypes2.default.string,
  isoLang: _propTypes2.default.string,
  modernizr: _propTypes2.default.object,
  data: _propTypes2.default.shape({
    html5: _propTypes2.default.bool
  })
};

DateField.defaultProps = {
  modernizr: _modernizr2.default,
  data: {}
};

exports.Component = DateField;
exports.default = (0, _FieldHolder2.default)(DateField);

/***/ }),

/***/ "./client/src/components/DatetimeField/DatetimeField.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Component = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _FieldHolder = __webpack_require__(8);

var _FieldHolder2 = _interopRequireDefault(_FieldHolder);

var _DateField2 = __webpack_require__("./client/src/components/DateField/DateField.js");

var _moment = __webpack_require__(14);

var _moment2 = _interopRequireDefault(_moment);

var _i18n = __webpack_require__(3);

var _i18n2 = _interopRequireDefault(_i18n);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var localFormat = 'L LT';

var DatetimeField = function (_DateField) {
  _inherits(DatetimeField, _DateField);

  function DatetimeField() {
    _classCallCheck(this, DatetimeField);

    return _possibleConstructorReturn(this, (DatetimeField.__proto__ || Object.getPrototypeOf(DatetimeField)).apply(this, arguments));
  }

  _createClass(DatetimeField, [{
    key: 'getInputProps',
    value: function getInputProps() {
      var placeholder = _i18n2.default.inject(_i18n2.default._t('Admin.FormatExample', 'Example: {format}'), { format: this.moment().endOf('month').format(localFormat) });
      var type = this.asHTML5() ? 'datetime-local' : 'text';
      return _extends({}, _get(DatetimeField.prototype.__proto__ || Object.getPrototypeOf(DatetimeField.prototype), 'getInputProps', this).call(this), {
        type: type,
        placeholder: placeholder
      });
    }
  }, {
    key: 'isMultiline',
    value: function isMultiline() {
      return false;
    }
  }, {
    key: 'hasNativeSupport',
    value: function hasNativeSupport() {
      return this.props.modernizr.inputtypes['datetime-local'];
    }
  }, {
    key: 'triggerChange',
    value: function triggerChange(event, value) {
      if (/^\d{4}-\d\d-\d\dT\d\d:\d\d$/.test(value)) {
        this.props.onChange(event, { id: this.props.id, value: value + ':00' });
      } else {
        this.props.onChange(event, { id: this.props.id, value: value });
      }
    }
  }, {
    key: 'convertToLocalised',
    value: function convertToLocalised(isoTime) {
      _moment2.default.locale(this.props.lang);
      var localTime = '';
      if (isoTime) {
        var timeObject = this.moment(isoTime);
        if (timeObject.isValid()) {
          localTime = timeObject.format(localFormat);
        }
      }
      return localTime;
    }
  }, {
    key: 'convertToIso',
    value: function convertToIso(localTime) {
      _moment2.default.locale(this.props.lang);
      var isoTime = '';
      if (localTime) {
        var timeObject = this.moment(localTime, [localFormat, _moment2.default.ISO_8601]);
        if (timeObject.isValid()) {
          isoTime = timeObject.format('YYYY-MM-DDTHH:mm:ss');
        }
      }
      return isoTime;
    }
  }]);

  return DatetimeField;
}(_DateField2.Component);

DatetimeField.propTypes = _DateField2.Component.propTypes;

DatetimeField.defaultProps = _DateField2.Component.defaultProps;

exports.Component = DatetimeField;
exports.default = (0, _FieldHolder2.default)(DatetimeField);

/***/ }),

/***/ "./client/src/components/FieldGroup/FieldGroup.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _CompositeField2 = __webpack_require__("./client/src/components/CompositeField/CompositeField.js");

var _CompositeField3 = _interopRequireDefault(_CompositeField2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var FieldGroup = function (_CompositeField) {
  _inherits(FieldGroup, _CompositeField);

  function FieldGroup() {
    _classCallCheck(this, FieldGroup);

    return _possibleConstructorReturn(this, (FieldGroup.__proto__ || Object.getPrototypeOf(FieldGroup)).apply(this, arguments));
  }

  _createClass(FieldGroup, [{
    key: 'getClassName',
    value: function getClassName() {
      return 'field-group-component ' + _get(FieldGroup.prototype.__proto__ || Object.getPrototypeOf(FieldGroup.prototype), 'getClassName', this).call(this);
    }
  }]);

  return FieldGroup;
}(_CompositeField3.default);

exports.default = FieldGroup;

/***/ }),

/***/ "./client/src/components/Focusedzone/Focusedzone.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(1);

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Focusedzone = function (_Component) {
  _inherits(Focusedzone, _Component);

  function Focusedzone(props) {
    _classCallCheck(this, Focusedzone);

    var _this = _possibleConstructorReturn(this, (Focusedzone.__proto__ || Object.getPrototypeOf(Focusedzone)).call(this, props));

    _this.wasClicked = false;

    _this.handleElementClick = _this.handleElementClick.bind(_this);
    _this.handleDocumentClick = _this.handleDocumentClick.bind(_this);
    return _this;
  }

  _createClass(Focusedzone, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var element = this.container;

      element.addEventListener('click', this.handleElementClick);
      document.addEventListener('click', this.handleDocumentClick);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      var element = this.container;
      element.removeEventListener('click', this.handleElementClick);
      document.removeEventListener('click', this.handleDocumentClick);
    }
  }, {
    key: 'handleElementClick',
    value: function handleElementClick() {
      this.wasClicked = true;
    }
  }, {
    key: 'handleDocumentClick',
    value: function handleDocumentClick() {
      if (!this.wasClicked) {
        this.props.onClickOut();
      }
      this.wasClicked = false;
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      return _react2.default.createElement(
        'div',
        {
          className: this.props.className,
          ref: function ref(container) {
            _this2.container = container;
          }
        },
        this.props.children
      );
    }
  }]);

  return Focusedzone;
}(_react.Component);

Focusedzone.propTypes = {
  children: _propTypes2.default.any,
  className: _propTypes2.default.string,
  onClickOut: _propTypes2.default.func.isRequired
};

Focusedzone.defaultProps = {
  className: ''
};

exports.default = Focusedzone;

/***/ }),

/***/ "./client/src/components/Form/Form.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Component = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _FormAlert = __webpack_require__(19);

var _FormAlert2 = _interopRequireDefault(_FormAlert);

var _propTypes = __webpack_require__(1);

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Form = function (_Component) {
  _inherits(Form, _Component);

  function Form() {
    _classCallCheck(this, Form);

    return _possibleConstructorReturn(this, (Form.__proto__ || Object.getPrototypeOf(Form)).apply(this, arguments));
  }

  _createClass(Form, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      if (!this.props.autoFocus) {
        return;
      }

      if (this.form) {
        var input = this.form.querySelector('input:not([type=hidden]), select, textarea');
        if (input) {
          input.focus();
          if (input.select) {
            input.select();
          }
        }
      }
    }
  }, {
    key: 'renderMessages',
    value: function renderMessages() {
      if (Array.isArray(this.props.messages)) {
        return this.props.messages.map(function (message, index) {
          return _react2.default.createElement(_FormAlert2.default, _extends({
            key: index,
            className: !index ? 'message-box--panel-top' : ''
          }, message));
        });
      }
      return null;
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var valid = this.props.valid !== false;
      var fields = this.props.mapFieldsToComponents(this.props.fields);
      var actions = this.props.mapActionsToComponents(this.props.actions);
      var messages = this.renderMessages();
      var FormTag = this.props.formTag;

      var className = ['form'];
      if (valid === false) {
        className.push('form--invalid');
      }
      if (this.props.attributes && this.props.attributes.className) {
        className.push(this.props.attributes.className);
      }
      var formProps = _extends({}, this.props.attributes, {
        onSubmit: this.props.handleSubmit,
        className: className.join(' ')
      });

      return _react2.default.createElement(
        FormTag,
        _extends({}, formProps, {
          ref: function ref(form) {
            _this2.form = form;_this2.props.setDOM(form);
          },
          role: 'form'
        }),
        fields && _react2.default.createElement(
          'fieldset',
          this.props.fieldHolder,
          messages,
          this.props.afterMessages,
          fields
        ),
        actions && actions.length ? _react2.default.createElement(
          'div',
          this.props.actionHolder,
          actions
        ) : null
      );
    }
  }]);

  return Form;
}(_react.Component);

Form.propTypes = {
  autoFocus: _propTypes2.default.bool,
  setDOM: _propTypes2.default.func,
  valid: _propTypes2.default.bool,
  actions: _propTypes2.default.array,
  fieldHolder: _propTypes2.default.shape({
    className: _propTypes2.default.string
  }),
  actionHolder: _propTypes2.default.shape({
    className: _propTypes2.default.string
  }),
  extraClass: _propTypes2.default.string,
  afterMessages: _propTypes2.default.node,
  attributes: _propTypes2.default.shape({
    action: _propTypes2.default.string.isRequired,
    className: _propTypes2.default.string,
    encType: _propTypes2.default.string,
    id: _propTypes2.default.string,
    method: _propTypes2.default.string.isRequired
  }),
  fields: _propTypes2.default.array.isRequired,

  handleSubmit: _propTypes2.default.func,
  mapActionsToComponents: _propTypes2.default.func.isRequired,
  mapFieldsToComponents: _propTypes2.default.func.isRequired,
  messages: _propTypes2.default.arrayOf(_propTypes2.default.shape({
    extraClass: _propTypes2.default.string,
    value: _propTypes2.default.any,
    type: _propTypes2.default.string
  })),
  formTag: _propTypes2.default.oneOfType([_propTypes2.default.func, _propTypes2.default.string])
};

Form.defaultProps = {
  setDOM: function setDOM() {
    return null;
  },
  formTag: 'form',
  actionHolder: {
    className: 'btn-toolbar'
  }
};

exports.Component = Form;
exports.default = Form;

/***/ }),

/***/ "./client/src/components/Form/FormConstants.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  CSRF_HEADER: 'X-SecurityID' };

/***/ }),

/***/ "./client/src/components/GridField/GridFieldAction.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(1);

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var GridFieldAction = function (_Component) {
  _inherits(GridFieldAction, _Component);

  function GridFieldAction(props) {
    _classCallCheck(this, GridFieldAction);

    var _this = _possibleConstructorReturn(this, (GridFieldAction.__proto__ || Object.getPrototypeOf(GridFieldAction)).call(this, props));

    _this.handleClick = _this.handleClick.bind(_this);
    return _this;
  }

  _createClass(GridFieldAction, [{
    key: 'handleClick',
    value: function handleClick(event) {
      this.props.onClick(event, this.props.record.ID);
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement('button', {
        className: 'grid-field__icon-action font-icon-' + this.props.icon + ' btn--icon-lg',
        onClick: this.handleClick
      });
    }
  }]);

  return GridFieldAction;
}(_react.Component);

GridFieldAction.propTypes = {
  onClick: _propTypes2.default.func.isRequired
};

exports.default = GridFieldAction;

/***/ }),

/***/ "./client/src/components/GridField/GridFieldCell.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _classnames = __webpack_require__(4);

var _classnames2 = _interopRequireDefault(_classnames);

var _propTypes = __webpack_require__(1);

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var GridFieldCell = function (_Component) {
  _inherits(GridFieldCell, _Component);

  function GridFieldCell(props) {
    _classCallCheck(this, GridFieldCell);

    var _this = _possibleConstructorReturn(this, (GridFieldCell.__proto__ || Object.getPrototypeOf(GridFieldCell)).call(this, props));

    _this.handleDrillDown = _this.handleDrillDown.bind(_this);
    return _this;
  }

  _createClass(GridFieldCell, [{
    key: 'handleDrillDown',
    value: function handleDrillDown(event) {
      if (typeof this.props.onDrillDown === 'function') {
        this.props.onDrillDown(event);
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var classNames = ['grid-field__cell', this.props.className];

      var _props = this.props,
          onDrillDown = _props.onDrillDown,
          props = _objectWithoutProperties(_props, ['onDrillDown']);

      return _react2.default.createElement('td', _extends({}, props, {
        className: (0, _classnames2.default)(classNames),
        onClick: this.handleDrillDown
      }));
    }
  }]);

  return GridFieldCell;
}(_react.Component);

GridFieldCell.propTypes = {
  className: _propTypes2.default.string,
  onDrillDown: _propTypes2.default.func
};

exports.default = GridFieldCell;

/***/ }),

/***/ "./client/src/components/GridField/GridFieldHeader.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _GridFieldRow = __webpack_require__("./client/src/components/GridField/GridFieldRow.js");

var _GridFieldRow2 = _interopRequireDefault(_GridFieldRow);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var GridFieldHeader = function GridFieldHeader(props) {
  return _react2.default.createElement(
    _GridFieldRow2.default,
    null,
    props.children
  );
};

exports.default = GridFieldHeader;

/***/ }),

/***/ "./client/src/components/GridField/GridFieldHeaderCell.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var GridFieldHeaderCell = function GridFieldHeaderCell(props) {
  return _react2.default.createElement(
    'th',
    null,
    props.children
  );
};

exports.default = GridFieldHeaderCell;

/***/ }),

/***/ "./client/src/components/GridField/GridFieldRow.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var GridFieldRow = function GridFieldRow(props) {
  var className = 'grid-field__row ' + props.className;
  return _react2.default.createElement(
    'tr',
    { tabIndex: 0, className: className },
    props.children
  );
};

exports.default = GridFieldRow;

/***/ }),

/***/ "./client/src/components/GridField/GridFieldTable.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(1);

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var GridFieldTable = function (_Component) {
  _inherits(GridFieldTable, _Component);

  function GridFieldTable() {
    _classCallCheck(this, GridFieldTable);

    return _possibleConstructorReturn(this, (GridFieldTable.__proto__ || Object.getPrototypeOf(GridFieldTable)).apply(this, arguments));
  }

  _createClass(GridFieldTable, [{
    key: 'generateHeader',
    value: function generateHeader() {
      if (typeof this.props.header !== 'undefined') {
        return this.props.header;
      }

      if (typeof this.props.data !== 'undefined') {}

      return null;
    }
  }, {
    key: 'generateRows',
    value: function generateRows() {
      if (typeof this.props.rows !== 'undefined') {
        return this.props.rows;
      }

      if (typeof this.props.data !== 'undefined') {}

      return null;
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        { className: 'grid-field' },
        _react2.default.createElement(
          'table',
          { className: 'table table-hover grid-field__table' },
          _react2.default.createElement(
            'thead',
            null,
            this.generateHeader()
          ),
          _react2.default.createElement(
            'tbody',
            null,
            this.generateRows()
          )
        )
      );
    }
  }]);

  return GridFieldTable;
}(_react.Component);

GridFieldTable.propTypes = {
  data: _propTypes2.default.object,
  header: _propTypes2.default.object,
  rows: _propTypes2.default.array
};

exports.default = GridFieldTable;

/***/ }),

/***/ "./client/src/components/GridFieldActions/GridFieldActions.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _reactstrap = __webpack_require__(6);

var _GridFieldDropdownAction = __webpack_require__("./client/src/components/GridFieldActions/GridFieldDropdownAction.js");

var _GridFieldDropdownAction2 = _interopRequireDefault(_GridFieldDropdownAction);

var _ActionMenu = __webpack_require__("./client/src/components/ActionMenu/ActionMenu.js");

var _ActionMenu2 = _interopRequireDefault(_ActionMenu);

var _classnames = __webpack_require__(4);

var _classnames2 = _interopRequireDefault(_classnames);

var _propTypes = __webpack_require__(1);

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var GridFieldActions = function (_PureComponent) {
  _inherits(GridFieldActions, _PureComponent);

  function GridFieldActions(props) {
    _classCallCheck(this, GridFieldActions);

    var _this = _possibleConstructorReturn(this, (GridFieldActions.__proto__ || Object.getPrototypeOf(GridFieldActions)).call(this, props));

    _this.toggle = _this.toggle.bind(_this);
    _this.state = {
      dropdownOpen: false
    };
    return _this;
  }

  _createClass(GridFieldActions, [{
    key: 'toggle',
    value: function toggle() {
      this.setState({
        dropdownOpen: !this.state.dropdownOpen
      });
    }
  }, {
    key: 'renderMultipleActions',
    value: function renderMultipleActions(schema) {
      var groupedActions = schema.reduce(function (groups, action) {
        var groupsList = groups;
        var groupName = action.group;

        if (!groupName) {
          throw new Error('Action: "' + action.title + '" has no group assigned');
        }

        if (!groupsList[groupName]) {
          groupsList[groupName] = [];
        }

        groupsList[groupName].push(action);

        return groupsList;
      }, []);

      var dropdownMenuProps = { right: true };
      var dropdownToggleClassNames = ['action-menu__toggle', 'btn', 'btn--no-text', 'btn-sm', 'font-icon-dot-3'];

      return _react2.default.createElement(
        _ActionMenu2.default,
        {
          dropdownMenuProps: dropdownMenuProps,
          dropdownToggleClassNames: dropdownToggleClassNames
        },
        Object.keys(groupedActions).map(function (group, groupIndex) {
          return [groupIndex !== 0 && _react2.default.createElement(_reactstrap.DropdownItem, { divider: true, key: group }), groupedActions[group].map(function (action, actionIndex) {
            return _react2.default.createElement(_GridFieldDropdownAction2.default, {
              data: action.data,
              title: action.title,
              type: action.type,
              url: action.url,
              key: actionIndex });
          })];
        })
      );
    }
  }, {
    key: 'renderSingleAction',
    value: function renderSingleAction(action) {
      var type = action.type,
          title = action.title,
          data = action.data;
      var url = action.url;

      var buttonType = void 0;
      if (type === 'submit') {
        buttonType = 'submit';
        url = undefined;
      }
      var classNames = (0, _classnames2.default)('action', data.classNames);
      return _react2.default.createElement(
        _reactstrap.Button,
        {
          className: classNames,
          type: buttonType,
          href: url,
          'data-url': data['data-url'],
          'data-action-state': data['data-action-state'],
          name: data.name,
          color: 'secondary'
        },
        title
      );
    }
  }, {
    key: 'render',
    value: function render() {
      var schema = this.props.schema;

      if (schema.length > 1) {
        return this.renderMultipleActions(schema);
      } else if (schema.length === 1) {
        return this.renderSingleAction(schema[0]);
      }
      return null;
    }
  }]);

  return GridFieldActions;
}(_react.PureComponent);

var actionShape = _GridFieldDropdownAction2.default.propTypes;
actionShape.group = _propTypes2.default.string;

GridFieldActions.propTypes = _propTypes2.default.arrayOf(_propTypes2.default.shape(actionShape)).isRequired;

exports.default = GridFieldActions;

/***/ }),

/***/ "./client/src/components/GridFieldActions/GridFieldDropdownAction.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _reactstrap = __webpack_require__(6);

var _classnames = __webpack_require__(4);

var _classnames2 = _interopRequireDefault(_classnames);

var _propTypes = __webpack_require__(1);

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var GridFieldDropdownAction = function (_PureComponent) {
  _inherits(GridFieldDropdownAction, _PureComponent);

  function GridFieldDropdownAction() {
    _classCallCheck(this, GridFieldDropdownAction);

    return _possibleConstructorReturn(this, (GridFieldDropdownAction.__proto__ || Object.getPrototypeOf(GridFieldDropdownAction)).apply(this, arguments));
  }

  _createClass(GridFieldDropdownAction, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          type = _props.type,
          title = _props.title,
          data = _props.data;
      var url = this.props.url;


      var classNames = (0, _classnames2.default)('action', data.classNames);
      var elementType = null;

      switch (type) {
        case 'submit':
          elementType = 'button';
          url = undefined;
          break;
        case 'link':
          elementType = 'a';
          break;
        default:
          elementType = undefined;
          break;
      }
      return _react2.default.createElement(
        _reactstrap.DropdownItem,
        {
          className: classNames,
          href: url,
          tag: elementType,
          type: elementType === 'button' ? 'button' : undefined,
          'data-url': data['data-url'],
          'data-action-state': data['data-action-state'],
          name: data.name
        },
        title
      );
    }
  }]);

  return GridFieldDropdownAction;
}(_react.PureComponent);

GridFieldDropdownAction.propTypes = {
  data: _propTypes2.default.object,
  title: _propTypes2.default.string.isRequired,
  type: _propTypes2.default.oneOf(['submit', 'link']),
  url: _propTypes2.default.string
};

exports.default = GridFieldDropdownAction;

/***/ }),

/***/ "./client/src/components/HeaderField/HeaderField.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(1);

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var HeaderField = function (_Component) {
  _inherits(HeaderField, _Component);

  function HeaderField() {
    _classCallCheck(this, HeaderField);

    return _possibleConstructorReturn(this, (HeaderField.__proto__ || Object.getPrototypeOf(HeaderField)).apply(this, arguments));
  }

  _createClass(HeaderField, [{
    key: 'getInputProps',
    value: function getInputProps() {
      return {
        className: this.props.className + ' ' + this.props.extraClass,
        id: this.props.id
      };
    }
  }, {
    key: 'render',
    value: function render() {
      var Heading = 'h' + (this.props.data.headingLevel || 3);

      return _react2.default.createElement(
        'div',
        { className: 'field' },
        _react2.default.createElement(
          Heading,
          this.getInputProps(),
          this.props.data.title
        )
      );
    }
  }]);

  return HeaderField;
}(_react.Component);

HeaderField.propTypes = {
  extraClass: _propTypes2.default.string,
  id: _propTypes2.default.string,
  data: _propTypes2.default.oneOfType([_propTypes2.default.array, _propTypes2.default.shape({
    headingLevel: _propTypes2.default.number,
    title: _propTypes2.default.string
  })]).isRequired
};

HeaderField.defaultProps = {
  className: '',
  extraClass: ''
};

exports.default = HeaderField;

/***/ }),

/***/ "./client/src/components/HiddenField/HiddenField.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _reactstrap = __webpack_require__(6);

var _classnames = __webpack_require__(4);

var _classnames2 = _interopRequireDefault(_classnames);

var _propTypes = __webpack_require__(1);

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var HiddenField = function (_Component) {
  _inherits(HiddenField, _Component);

  function HiddenField() {
    _classCallCheck(this, HiddenField);

    return _possibleConstructorReturn(this, (HiddenField.__proto__ || Object.getPrototypeOf(HiddenField)).apply(this, arguments));
  }

  _createClass(HiddenField, [{
    key: 'getInputProps',
    value: function getInputProps() {
      return {
        className: (0, _classnames2.default)(this.props.className, this.props.extraClass),
        id: this.props.id,
        name: this.props.name,
        type: 'hidden',
        value: this.props.value
      };
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(_reactstrap.Input, this.getInputProps());
    }
  }]);

  return HiddenField;
}(_react.Component);

HiddenField.propTypes = {
  id: _propTypes2.default.string,
  extraClass: _propTypes2.default.string,
  name: _propTypes2.default.string.isRequired,
  value: _propTypes2.default.any
};

HiddenField.defaultProps = {
  className: '',
  extraClass: '',
  value: ''
};

exports.default = HiddenField;

/***/ }),

/***/ "./client/src/components/HtmlEditorField/HtmlEditorField.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Component = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _reactLoadScript = __webpack_require__("./node_modules/react-load-script/lib/index.js");

var _reactLoadScript2 = _interopRequireDefault(_reactLoadScript);

var _TextField2 = __webpack_require__("./client/src/components/TextField/TextField.js");

var _FieldHolder = __webpack_require__(8);

var _FieldHolder2 = _interopRequireDefault(_FieldHolder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var HtmlEditorField = function (_TextField) {
  _inherits(HtmlEditorField, _TextField);

  function HtmlEditorField(props) {
    _classCallCheck(this, HtmlEditorField);

    var _this = _possibleConstructorReturn(this, (HtmlEditorField.__proto__ || Object.getPrototypeOf(HtmlEditorField)).call(this, props));

    _this.state = {
      isReady: !props.data.editorjs
    };

    _this.inputRef = null;

    _this.handleReady = _this.handleReady.bind(_this);
    return _this;
  }

  _createClass(HtmlEditorField, [{
    key: 'getInputProps',
    value: function getInputProps() {
      var _this2 = this;

      return _extends({}, _get(HtmlEditorField.prototype.__proto__ || Object.getPrototypeOf(HtmlEditorField.prototype), 'getInputProps', this).call(this), this.props.data.attributes, {
        innerRef: function innerRef(ref) {
          _this2.inputRef = ref;
        }
      });
    }
  }, {
    key: 'getEditorElement',
    value: function getEditorElement() {
      return document.getElementById(this.getInputProps().id);
    }
  }, {
    key: 'getEditor',
    value: function getEditor() {
      return window.TinyMCE && window.TinyMCE.get(this.getInputProps().id);
    }
  }, {
    key: 'handleReady',
    value: function handleReady() {
      if (!window.TinyMCE && window.tinymce) {
        window.TinyMCE = window.tinymce;
      }
      this.setState({ isReady: true });
    }
  }, {
    key: 'registerChangeListener',
    value: function registerChangeListener() {
      var _this3 = this;

      var target = this.getEditorElement();
      this.getEditor().on('change keyup setcontent', function () {
        _get(HtmlEditorField.prototype.__proto__ || Object.getPrototypeOf(HtmlEditorField.prototype), 'handleChange', _this3).call(_this3, { target: target });
      });
    }
  }, {
    key: 'renderDependencyScript',
    value: function renderDependencyScript() {
      return _react2.default.createElement(_reactLoadScript2.default, { url: this.props.data.editorjs, onLoad: this.handleReady });
    }
  }, {
    key: 'render',
    value: function render() {
      return this.state.isReady ? _get(HtmlEditorField.prototype.__proto__ || Object.getPrototypeOf(HtmlEditorField.prototype), 'render', this).call(this) : this.renderDependencyScript();
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps, prevState) {
      var _this4 = this;

      var isReady = this.state.isReady;


      if (!isReady) {
        return;
      }

      if (isReady !== prevState.isReady) {
        setTimeout(function () {
          var _window = window,
              document = _window.document,
              $ = _window.jQuery;

          var mountEvent = $.Event('EntwineElementsAdded');
          var editorElement = _this4.getEditorElement();
          mountEvent.targets = [editorElement];
          $(document).triggerHandler(mountEvent);
          _this4.registerChangeListener();
        }, 1);
      }

      var value = this.props.value;


      if (value !== prevProps.value) {
        var event = new Event('change', { bubbles: true });
        event.simulated = true;
        event.value = value;
        this.inputRef.dispatchEvent(event);
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      if (!this.state.isReady) {
        return;
      }

      var _window2 = window,
          document = _window2.document,
          $ = _window2.jQuery;

      var unmountEvent = $.Event('EntwineElementsRemoved');
      var editorElement = this.getEditorElement();

      var editor = this.getEditor();
      if (editor) {
        editor.save();
      }
      unmountEvent.targets = [editorElement];

      _get(HtmlEditorField.prototype.__proto__ || Object.getPrototypeOf(HtmlEditorField.prototype), 'handleChange', this).call(this, { target: editorElement });
      $(document).triggerHandler(unmountEvent);
    }
  }]);

  return HtmlEditorField;
}(_TextField2.Component);

exports.Component = HtmlEditorField;
exports.default = (0, _FieldHolder2.default)(HtmlEditorField);

/***/ }),

/***/ "./client/src/components/HtmlReadonlyField/HtmlReadonlyField.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Component = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _FieldHolder = __webpack_require__(8);

var _FieldHolder2 = _interopRequireDefault(_FieldHolder);

var _reactstrap = __webpack_require__(6);

var _propTypes = __webpack_require__(1);

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var HtmlReadonlyField = function (_Component) {
  _inherits(HtmlReadonlyField, _Component);

  function HtmlReadonlyField(props) {
    _classCallCheck(this, HtmlReadonlyField);

    var _this = _possibleConstructorReturn(this, (HtmlReadonlyField.__proto__ || Object.getPrototypeOf(HtmlReadonlyField)).call(this, props));

    _this.getContent = _this.getContent.bind(_this);
    return _this;
  }

  _createClass(HtmlReadonlyField, [{
    key: 'getContent',
    value: function getContent() {
      return { __html: this.props.value };
    }
  }, {
    key: 'getInputProps',
    value: function getInputProps() {
      return {
        className: this.props.className + ' ' + this.props.extraClass,
        id: this.props.id,
        name: this.props.name
      };
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(_reactstrap.Input, _extends({
        plaintext: true
      }, this.getInputProps(), {
        dangerouslySetInnerHTML: this.getContent()
      }));
    }
  }]);

  return HtmlReadonlyField;
}(_react.Component);

HtmlReadonlyField.propTypes = {
  id: _propTypes2.default.string,
  name: _propTypes2.default.string.isRequired,
  extraClass: _propTypes2.default.string,
  value: _propTypes2.default.string
};

HtmlReadonlyField.defaultProps = {
  extraClass: '',
  className: ''
};

exports.Component = HtmlReadonlyField;
exports.default = (0, _FieldHolder2.default)(HtmlReadonlyField);

/***/ }),

/***/ "./client/src/components/IframeDialog/IframeDialog.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _reactstrap = __webpack_require__(6);

var _classnames = __webpack_require__(4);

var _classnames2 = _interopRequireDefault(_classnames);

var _propTypes = __webpack_require__(1);

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var IframeDialog = function (_Component) {
  _inherits(IframeDialog, _Component);

  function IframeDialog(props) {
    _classCallCheck(this, IframeDialog);

    var _this = _possibleConstructorReturn(this, (IframeDialog.__proto__ || Object.getPrototypeOf(IframeDialog)).call(this, props));

    _this.handleClosed = _this.handleClosed.bind(_this);
    return _this;
  }

  _createClass(IframeDialog, [{
    key: 'handleClosed',
    value: function handleClosed() {
      if (typeof this.props.onClosed === 'function') {
        this.props.onClosed();
      }
    }
  }, {
    key: 'renderHeader',
    value: function renderHeader() {
      var title = this.props.title;
      if (title) {
        return _react2.default.createElement(
          _reactstrap.ModalHeader,
          { toggle: this.handleClosed },
          title
        );
      }
      return null;
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        _reactstrap.Modal,
        {
          isOpen: this.props.isOpen,
          onClosed: this.handleClosed,
          className: (0, _classnames2.default)('iframe-dialog', this.props.className),
          modalClassName: this.props.modalClassName
        },
        this.renderHeader(),
        _react2.default.createElement(
          _reactstrap.ModalBody,
          { className: this.props.bodyClassName },
          _react2.default.createElement('iframe', {
            id: this.props.iframeId,
            className: (0, _classnames2.default)('iframe-dialog__iframe', this.props.iframeClassName),
            src: this.props.url,
            frameBorder: 0
          })
        )
      );
    }
  }]);

  return IframeDialog;
}(_react.Component);

IframeDialog.propTypes = {
  url: _propTypes2.default.string.isRequired,
  onClosed: _propTypes2.default.func,
  isOpen: _propTypes2.default.bool,
  title: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.bool]),
  modalClassName: _propTypes2.default.string,
  iframeId: _propTypes2.default.string,
  iframeClassName: _propTypes2.default.string,
  className: _propTypes2.default.string,
  bodyClassName: _propTypes2.default.string
};

IframeDialog.defaultProps = {
  isOpen: false,
  title: null
};

exports.default = IframeDialog;

/***/ }),

/***/ "./client/src/components/InputField/InputField.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Component = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _reactstrap = __webpack_require__(6);

var _propTypes = __webpack_require__(1);

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var InputField = function (_Component) {
  _inherits(InputField, _Component);

  function InputField(props) {
    _classCallCheck(this, InputField);

    var _this = _possibleConstructorReturn(this, (InputField.__proto__ || Object.getPrototypeOf(InputField)).call(this, props));

    _this.handleChange = _this.handleChange.bind(_this);
    return _this;
  }

  _createClass(InputField, [{
    key: 'getInputProps',
    value: function getInputProps() {
      var props = {
        className: this.props.className + ' ' + this.props.extraClass,
        id: this.props.id,
        name: this.props.name,
        disabled: this.props.disabled,
        readOnly: this.props.readOnly,
        value: this.props.value || '',
        placeholder: this.props.placeholder,
        autoFocus: this.props.autoFocus,
        maxLength: this.props.data && this.props.data.maxlength,
        type: this.props.type ? this.props.type : null
      };

      if (this.props.attributes && !Array.isArray(this.props.attributes)) {
        Object.assign(props, this.props.attributes);
      }

      if (!this.props.readOnly) {
        Object.assign(props, {
          onChange: this.handleChange
        });
      }

      return props;
    }
  }, {
    key: 'handleChange',
    value: function handleChange(event) {
      if (typeof this.props.onChange === 'function') {
        if (!event.target) {
          return;
        }
        this.props.onChange(event, { id: this.props.id, value: event.target.value });
      }
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(_reactstrap.Input, this.getInputProps());
    }
  }]);

  return InputField;
}(_react.Component);

InputField.propTypes = {
  extraClass: _propTypes2.default.string,
  id: _propTypes2.default.string,
  name: _propTypes2.default.string.isRequired,
  onChange: _propTypes2.default.func,
  value: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.number]),
  readOnly: _propTypes2.default.bool,
  disabled: _propTypes2.default.bool,
  placeholder: _propTypes2.default.string,
  type: _propTypes2.default.string,
  autoFocus: _propTypes2.default.bool,
  attributes: _propTypes2.default.oneOfType([_propTypes2.default.object, _propTypes2.default.array])
};

InputField.defaultProps = {
  value: '',
  extraClass: '',
  className: '',
  type: 'text',
  attributes: {}
};

exports.Component = InputField;
exports.default = InputField;

/***/ }),

/***/ "./client/src/components/LabelField/LabelField.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(1);

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var LabelField = function LabelField(_ref) {
  var id = _ref.id,
      className = _ref.className,
      title = _ref.title,
      extraClass = _ref.extraClass,
      data = _ref.data;

  var htmlFor = data && data.target;
  var classes = className + ' ' + extraClass;

  return _react2.default.createElement(
    'label',
    { id: id, className: classes, htmlFor: htmlFor },
    title
  );
};

LabelField.propTypes = {
  id: _propTypes2.default.number,
  className: _propTypes2.default.string,
  extraClass: _propTypes2.default.string,
  title: _propTypes2.default.node,
  data: _propTypes2.default.shape({
    target: _propTypes2.default.string
  })
};

LabelField.defaultProps = {
  className: '',
  extraClass: ''
};

exports.default = LabelField;

/***/ }),

/***/ "./client/src/components/ListGroup/ListGroupItem.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(1);

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ListGroupItem = function (_Component) {
  _inherits(ListGroupItem, _Component);

  function ListGroupItem(props) {
    _classCallCheck(this, ListGroupItem);

    var _this = _possibleConstructorReturn(this, (ListGroupItem.__proto__ || Object.getPrototypeOf(ListGroupItem)).call(this, props));

    _this.handleClick = _this.handleClick.bind(_this);
    return _this;
  }

  _createClass(ListGroupItem, [{
    key: 'handleClick',
    value: function handleClick(event) {
      if (this.props.onClick) {
        this.props.onClick(event, this.props.onClickArg);
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var className = 'list-group-item ' + this.props.className;
      return _react2.default.createElement(
        'a',
        { role: 'button', tabIndex: 0, className: className, onClick: this.handleClick },
        this.props.children
      );
    }
  }]);

  return ListGroupItem;
}(_react.Component);

ListGroupItem.propTypes = {
  onClickArg: _propTypes2.default.any,
  onClick: _propTypes2.default.func
};

exports.default = ListGroupItem;

/***/ }),

/***/ "./client/src/components/LookupField/LookupField.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Component = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _reactstrap = __webpack_require__(6);

var _FieldHolder = __webpack_require__(8);

var _FieldHolder2 = _interopRequireDefault(_FieldHolder);

var _i18n = __webpack_require__(3);

var _i18n2 = _interopRequireDefault(_i18n);

var _propTypes = __webpack_require__(1);

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var LookupField = function (_Component) {
  _inherits(LookupField, _Component);

  function LookupField(props) {
    _classCallCheck(this, LookupField);

    var _this = _possibleConstructorReturn(this, (LookupField.__proto__ || Object.getPrototypeOf(LookupField)).call(this, props));

    _this.getValueCSV = _this.getValueCSV.bind(_this);
    return _this;
  }

  _createClass(LookupField, [{
    key: 'getValueCSV',
    value: function getValueCSV() {
      var _this2 = this;

      var values = this.props.value;

      if (!Array.isArray(values) && (values || typeof values === 'string' || typeof values === 'number')) {
        var item = this.props.source.find(function (next) {
          return next.value === values;
        });
        if (item) {
          return item.title;
        }
        return '';
      }

      if (!values || !values.length) {
        return '';
      }
      return values.map(function (value) {
        var item = _this2.props.source.find(function (next) {
          return next.value === value;
        });
        return item && item.title;
      }).filter(function (value) {
        return ('' + value).length;
      }).join(', ');
    }
  }, {
    key: 'getFieldProps',
    value: function getFieldProps() {
      return {
        id: this.props.id,
        name: this.props.name,
        className: this.props.className + ' ' + this.props.extraClass
      };
    }
  }, {
    key: 'render',
    value: function render() {
      if (!this.props.source) {
        return null;
      }
      var none = '(\'' + _i18n2.default._t('Admin.NONE', 'None') + '\')';

      return _react2.default.createElement(
        _reactstrap.Input,
        _extends({
          plaintext: true
        }, this.getFieldProps()),
        this.getValueCSV() || none
      );
    }
  }]);

  return LookupField;
}(_react.Component);

LookupField.propTypes = {
  extraClass: _propTypes2.default.string,
  id: _propTypes2.default.string,
  name: _propTypes2.default.string.isRequired,
  source: _propTypes2.default.arrayOf(_propTypes2.default.shape({
    value: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.number]),
    title: _propTypes2.default.any,
    disabled: _propTypes2.default.bool
  })),
  value: _propTypes2.default.any
};

LookupField.defaultProps = {
  extraClass: '',
  className: '',
  value: []
};

exports.Component = LookupField;
exports.default = (0, _FieldHolder2.default)(LookupField);

/***/ }),

/***/ "./client/src/components/MobileMenuToggle/MobileMenuToggle.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _classnames = __webpack_require__(4);

var _classnames2 = _interopRequireDefault(_classnames);

var _propTypes = __webpack_require__(1);

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MobileMenuToggle = function (_Component) {
  _inherits(MobileMenuToggle, _Component);

  function MobileMenuToggle() {
    _classCallCheck(this, MobileMenuToggle);

    var _this = _possibleConstructorReturn(this, (MobileMenuToggle.__proto__ || Object.getPrototypeOf(MobileMenuToggle)).call(this));

    _this.handleClick = _this.handleClick.bind(_this);
    return _this;
  }

  _createClass(MobileMenuToggle, [{
    key: 'handleClick',
    value: function handleClick(e) {
      e.preventDefault();

      if (typeof this.props.onClick === 'function') {
        this.props.onClick(e);
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var classes = (0, _classnames2.default)({
        'cms-mobile-menu-toggle': true,
        'cms-mobile-menu-toggle--open': this.props.isOpen
      });

      return _react2.default.createElement(
        'button',
        {
          className: classes,
          href: '#toggle-mobile-menu',
          onClick: this.handleClick,
          'aria-controls': this.props.controls,
          'aria-expanded': Boolean(this.props.isOpen)
        },
        _react2.default.createElement('span', null),
        _react2.default.createElement('span', null),
        _react2.default.createElement('span', null),
        _react2.default.createElement('span', null)
      );
    }
  }]);

  return MobileMenuToggle;
}(_react.Component);

MobileMenuToggle.propTypes = {
  isOpen: _propTypes2.default.bool.isRequired,
  onClick: _propTypes2.default.func.isRequired,
  controls: _propTypes2.default.string
};

MobileMenuToggle.defaultProps = {
  controls: ''
};

exports.default = MobileMenuToggle;

/***/ }),

/***/ "./client/src/components/MobileMenuToggle/MobileMenuToggleContainer.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _MobileMenuActions = __webpack_require__("./client/src/state/mobileMenu/MobileMenuActions.js");

var _reactRedux = __webpack_require__(5);

var _MobileMenuToggle = __webpack_require__("./client/src/components/MobileMenuToggle/MobileMenuToggle.js");

var _MobileMenuToggle2 = _interopRequireDefault(_MobileMenuToggle);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (0, _reactRedux.connect)(function (state) {
  return {
    isOpen: state.mobileMenu.isOpen
  };
}, function (dispatch) {
  return {
    onClick: function onClick() {
      dispatch((0, _MobileMenuActions.toggleMobileMenu)());
    }
  };
})(_MobileMenuToggle2.default);

/***/ }),

/***/ "./client/src/components/NotFoundComponent/NotFoundComponent.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _i18n = __webpack_require__(3);

var _i18n2 = _interopRequireDefault(_i18n);

var _classnames = __webpack_require__(4);

var _classnames2 = _interopRequireDefault(_classnames);

var _FormAlert = __webpack_require__(19);

var _FormAlert2 = _interopRequireDefault(_FormAlert);

var _propTypes = __webpack_require__(1);

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var NotFoundComponent = function NotFoundComponent(_ref) {
  var itemName = _ref.itemName,
      name = _ref.name,
      value = _ref.value;
  return _react2.default.createElement(
    'div',
    { className: (0, _classnames2.default)(itemName, 'not-found-component') },
    _react2.default.createElement(_FormAlert2.default, { value: _i18n2.default.inject(_i18n2.default._t('Admin.NOT_FOUND_COMPONENT', 'The component here ({component}) failed to load, there is a chance that you may lose data when saving due to this.'), { component: itemName })
    }),
    name && typeof value === 'string' ? _react2.default.createElement('input', { type: 'hidden', name: name, value: value }) : null
  );
};

NotFoundComponent.propTypes = {
  itemName: _propTypes2.default.string.isRequired,
  name: _propTypes2.default.string,
  value: _propTypes2.default.any
};

exports.default = NotFoundComponent;

/***/ }),

/***/ "./client/src/components/NumberField/NumberField.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Component = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _FieldHolder = __webpack_require__(8);

var _FieldHolder2 = _interopRequireDefault(_FieldHolder);

var _InputField2 = __webpack_require__("./client/src/components/InputField/InputField.js");

var _InputField3 = _interopRequireDefault(_InputField2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var NumberField = function (_InputField) {
  _inherits(NumberField, _InputField);

  function NumberField() {
    _classCallCheck(this, NumberField);

    return _possibleConstructorReturn(this, (NumberField.__proto__ || Object.getPrototypeOf(NumberField)).apply(this, arguments));
  }

  _createClass(NumberField, [{
    key: 'getInputProps',
    value: function getInputProps() {
      var props = _get(NumberField.prototype.__proto__ || Object.getPrototypeOf(NumberField.prototype), 'getInputProps', this).call(this);

      Object.assign(props, {
        type: 'number'
      });

      return props;
    }
  }]);

  return NumberField;
}(_InputField3.default);

exports.Component = NumberField;
exports.default = (0, _FieldHolder2.default)(NumberField);

/***/ }),

/***/ "./client/src/components/OptionsetField/OptionField.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Component = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _reactstrap = __webpack_require__(6);

var _classnames2 = __webpack_require__(4);

var _classnames3 = _interopRequireDefault(_classnames2);

var _castStringToElement = __webpack_require__("./client/src/lib/castStringToElement.js");

var _castStringToElement2 = _interopRequireDefault(_castStringToElement);

var _propTypes = __webpack_require__(1);

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var OptionField = function (_Component) {
  _inherits(OptionField, _Component);

  function OptionField(props) {
    _classCallCheck(this, OptionField);

    var _this = _possibleConstructorReturn(this, (OptionField.__proto__ || Object.getPrototypeOf(OptionField)).call(this, props));

    _this.handleChange = _this.handleChange.bind(_this);
    return _this;
  }

  _createClass(OptionField, [{
    key: 'getInputProps',
    value: function getInputProps() {
      var _classnames;

      var classes = (0, _classnames3.default)((_classnames = {}, _defineProperty(_classnames, this.props.className, true), _defineProperty(_classnames, this.props.extraClass, true), _defineProperty(_classnames, 'form-check', true), _defineProperty(_classnames, 'checked', this.props.value), _defineProperty(_classnames, 'disabled', this.props.readOnly), _defineProperty(_classnames, 'option-field--disabled', this.props.readOnly || this.props.disabled), _classnames));

      return {
        id: this.props.id,
        type: this.props.type,
        name: this.props.name,
        disabled: this.props.disabled || this.props.readOnly,
        readOnly: this.props.readOnly,
        className: classes,
        onChange: this.handleChange,
        checked: !!this.props.value,
        value: 1
      };
    }
  }, {
    key: 'handleChange',
    value: function handleChange(event) {
      if (this.props.readOnly || this.props.disabled) {
        event.preventDefault();
        return;
      }

      var callback = null;
      if (typeof this.props.onChange === 'function') {
        callback = this.props.onChange;
      } else if (typeof this.props.onClick === 'function') {
        callback = this.props.onClick;
      }

      if (callback) {
        callback(event, {
          id: this.props.id,
          value: event.target.checked ? 1 : 0
        });
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var leftTitle = this.props.leftTitle !== null ? this.props.leftTitle : this.props.title;

      var labelText = this.props.rightTitle !== null ? leftTitle + ' ' + this.props.rightTitle : leftTitle;

      return _react2.default.createElement(
        _reactstrap.FormGroup,
        { check: true },
        _react2.default.createElement(
          _reactstrap.Label,
          { check: true },
          _react2.default.createElement(_reactstrap.Input, this.getInputProps()),
          (0, _castStringToElement2.default)('span', labelText)
        )
      );
    }
  }]);

  return OptionField;
}(_react.Component);

OptionField.propTypes = {
  type: _propTypes2.default.oneOf(['checkbox', 'radio']),
  leftTitle: _propTypes2.default.any,
  rightTitle: _propTypes2.default.any,
  title: _propTypes2.default.any,
  extraClass: _propTypes2.default.string,
  id: _propTypes2.default.string,
  name: _propTypes2.default.string,
  onChange: _propTypes2.default.func,

  value: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.number, _propTypes2.default.bool]),
  readOnly: _propTypes2.default.bool,
  disabled: _propTypes2.default.bool
};

OptionField.defaultProps = {
  extraClass: '',
  className: '',
  type: 'radio',
  leftTitle: null,
  rightTitle: null
};

exports.Component = OptionField;
exports.default = OptionField;

/***/ }),

/***/ "./client/src/components/OptionsetField/OptionsetField.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Component = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _OptionField = __webpack_require__("./client/src/components/OptionsetField/OptionField.js");

var _OptionField2 = _interopRequireDefault(_OptionField);

var _FieldHolder = __webpack_require__(8);

var _FieldHolder2 = _interopRequireDefault(_FieldHolder);

var _propTypes = __webpack_require__(1);

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var OptionsetField = function (_Component) {
  _inherits(OptionsetField, _Component);

  function OptionsetField(props) {
    _classCallCheck(this, OptionsetField);

    var _this = _possibleConstructorReturn(this, (OptionsetField.__proto__ || Object.getPrototypeOf(OptionsetField)).call(this, props));

    _this.getItemKey = _this.getItemKey.bind(_this);
    _this.getOptionProps = _this.getOptionProps.bind(_this);
    _this.handleChange = _this.handleChange.bind(_this);
    return _this;
  }

  _createClass(OptionsetField, [{
    key: 'getItemKey',
    value: function getItemKey(item, index) {
      var value = item.value || 'empty' + index;
      return this.props.id + '-' + value;
    }
  }, {
    key: 'getOptionProps',
    value: function getOptionProps(item, index) {
      var key = this.getItemKey(item, index);

      return {
        key: key,
        id: key,
        name: this.props.name,
        className: this.props.itemClass + ' option-val--' + item.value,
        disabled: item.disabled || this.props.disabled,
        readOnly: this.props.readOnly,
        onChange: this.handleChange,
        value: '' + this.props.value === '' + item.value,
        title: item.title,
        type: 'radio'
      };
    }
  }, {
    key: 'handleChange',
    value: function handleChange(event, field) {
      var _this2 = this;

      if (typeof this.props.onChange === 'function') {
        if (field.value === 1) {
          var sourceItem = this.props.source.find(function (item, index) {
            return _this2.getItemKey(item, index) === field.id;
          });

          this.props.onChange(event, { id: this.props.id, value: sourceItem.value });
        }
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      if (!this.props.source) {
        return null;
      }
      return _react2.default.createElement(
        'div',
        null,
        this.props.source.map(function (item, index) {
          return _react2.default.createElement(_OptionField2.default, _extends({}, _this3.getOptionProps(item, index), { hideLabels: true }));
        })
      );
    }
  }]);

  return OptionsetField;
}(_react.Component);

OptionsetField.propTypes = {
  extraClass: _propTypes2.default.string,
  itemClass: _propTypes2.default.string,
  id: _propTypes2.default.string,
  name: _propTypes2.default.string.isRequired,
  source: _propTypes2.default.arrayOf(_propTypes2.default.shape({
    value: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.number]),
    title: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.number]),
    disabled: _propTypes2.default.bool
  })),
  onChange: _propTypes2.default.func,
  value: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.number]),
  readOnly: _propTypes2.default.bool,
  disabled: _propTypes2.default.bool
};

OptionsetField.defaultProps = {
  extraClass: '',
  className: '',
  itemClass: ''
};

exports.Component = OptionsetField;
exports.default = (0, _FieldHolder2.default)(OptionsetField);

/***/ }),

/***/ "./client/src/components/PopoverField/PopoverField.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _reactstrap = __webpack_require__(6);

var _classnames3 = __webpack_require__(4);

var _classnames4 = _interopRequireDefault(_classnames3);

var _propTypes = __webpack_require__(1);

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PopoverField = function (_Component) {
  _inherits(PopoverField, _Component);

  function PopoverField(props) {
    _classCallCheck(this, PopoverField);

    var _this = _possibleConstructorReturn(this, (PopoverField.__proto__ || Object.getPrototypeOf(PopoverField)).call(this, props));

    _this.toggle = _this.toggle.bind(_this);

    _this.state = {
      isOpen: false
    };
    return _this;
  }

  _createClass(PopoverField, [{
    key: 'getPlacement',
    value: function getPlacement() {
      var placement = this.props.data.placement;
      return placement || 'bottom';
    }
  }, {
    key: 'getContainer',
    value: function getContainer() {
      if (this.props.container) {
        return this.props.container;
      }
      return this.wrapper;
    }
  }, {
    key: 'toggle',
    value: function toggle() {
      var toggleCallback = this.props.toggleCallback;


      this.setState({
        isOpen: !this.state.isOpen
      }, toggleCallback);
    }
  }, {
    key: 'render',
    value: function render() {
      var _classnames,
          _classnames2,
          _this2 = this;

      var placement = this.getPlacement();

      var buttonClasses = (0, _classnames4.default)((_classnames = {
        btn: true,
        'btn-secondary': true
      }, _defineProperty(_classnames, this.props.className, true), _defineProperty(_classnames, this.props.buttonClassName, true), _defineProperty(_classnames, 'btn--no-focus', this.state.isOpen), _defineProperty(_classnames, 'font-icon-dot-3 btn--no-text', !this.props.title), _defineProperty(_classnames, 'btn--icon-' + this.props.buttonSize, !this.props.title), _classnames));

      var buttonProps = {
        id: this.props.id,
        type: 'button',
        className: buttonClasses,
        onClick: this.toggle,
        title: this.props.data.buttonTooltip
      };

      var wrapperClasses = (0, _classnames4.default)((_classnames2 = {}, _defineProperty(_classnames2, this.props.className, true), _defineProperty(_classnames2, 'popover-container', true), _defineProperty(_classnames2, 'popover-field', true), _classnames2));

      return _react2.default.createElement(
        'div',
        { className: wrapperClasses, ref: function ref(wrapper) {
            _this2.wrapper = wrapper;
          } },
        _react2.default.createElement(
          _reactstrap.Button,
          buttonProps,
          this.props.title
        ),
        _react2.default.createElement(
          _reactstrap.Popover,
          {
            id: this.props.id + '_Popover',
            placement: placement,
            isOpen: this.state.isOpen,
            target: this.props.id,
            toggle: this.toggle,
            className: this.props.popoverClassName,
            container: this.getContainer()
          },
          _react2.default.createElement(
            _reactstrap.PopoverHeader,
            null,
            this.props.data.popoverTitle
          ),
          _react2.default.createElement(
            _reactstrap.PopoverBody,
            null,
            this.props.children
          )
        )
      );
    }
  }]);

  return PopoverField;
}(_react.Component);

PopoverField.propTypes = {
  id: _propTypes2.default.string.isRequired,
  title: _propTypes2.default.any,
  container: _propTypes2.default.any,
  className: _propTypes2.default.string,
  buttonClassName: _propTypes2.default.string,
  popoverClassName: _propTypes2.default.string,
  buttonSize: _propTypes2.default.oneOf(['sm', 'md', 'large', 'xl']),
  data: _propTypes2.default.oneOfType([_propTypes2.default.array, _propTypes2.default.shape({
    popoverTitle: _propTypes2.default.string,
    buttonTooltip: _propTypes2.default.string,
    placement: _propTypes2.default.oneOf(['top', 'bottom', 'left', 'right'])
  })]),
  toggleCallback: _propTypes2.default.func
};

PopoverField.defaultProps = {
  data: {},
  className: '',
  buttonClassName: '',
  popoverClassName: '',
  buttonSize: 'xl',
  toggleCallback: function toggleCallback() {}
};

exports.default = PopoverField;

/***/ }),

/***/ "./client/src/components/PopoverOptionSet/PopoverOptionSet.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(1);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactstrap = __webpack_require__(6);

var _classnames = __webpack_require__(4);

var _classnames2 = _interopRequireDefault(_classnames);

var _i18n = __webpack_require__(3);

var _i18n2 = _interopRequireDefault(_i18n);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PopoverOptionSet = function (_Component) {
  _inherits(PopoverOptionSet, _Component);

  function PopoverOptionSet(props) {
    _classCallCheck(this, PopoverOptionSet);

    var _this = _possibleConstructorReturn(this, (PopoverOptionSet.__proto__ || Object.getPrototypeOf(PopoverOptionSet)).call(this, props));

    _this.handleToggle = _this.handleToggle.bind(_this);
    _this.handleSearchValueClear = _this.handleSearchValueClear.bind(_this);
    _this.handleSearchValueChange = _this.handleSearchValueChange.bind(_this);
    _this.handleKeyDown = _this.handleKeyDown.bind(_this);

    _this.state = {
      searchValue: ''
    };
    return _this;
  }

  _createClass(PopoverOptionSet, [{
    key: 'handleToggle',
    value: function handleToggle() {
      var toggle = this.props.toggle;


      toggle();
      this.handleSearchValueClear();
    }
  }, {
    key: 'handleSearchValueClear',
    value: function handleSearchValueClear() {
      this.setState({ searchValue: '' });
    }
  }, {
    key: 'handleSearchValueChange',
    value: function handleSearchValueChange(event) {
      this.setState({ searchValue: event.target.value });
    }
  }, {
    key: 'handleKeyDown',
    value: function handleKeyDown(event) {
      if (event.key === 'Escape') {
        this.handleToggle();
      }
    }
  }, {
    key: 'renderSearchValueClearLink',
    value: function renderSearchValueClearLink() {
      var clearButtonClassName = this.props.clearButtonClassName;
      var searchValue = this.state.searchValue;


      if (searchValue.length === 0) {
        return null;
      }

      return _react2.default.createElement(
        _reactstrap.InputGroupAddon,
        { addonType: 'append' },
        _react2.default.createElement(
          'button',
          {
            className: (0, _classnames2.default)(clearButtonClassName),
            onClick: this.handleSearchValueClear
          },
          _i18n2.default._t('PopoverOptionSet.CLEAR', 'Clear')
        )
      );
    }
  }, {
    key: 'renderSearchBox',
    value: function renderSearchBox() {
      var _props = this.props,
          searchPlaceholder = _props.searchPlaceholder,
          disableSearch = _props.disableSearch,
          searchClassName = _props.searchClassName,
          searchInputClassName = _props.searchInputClassName;
      var searchValue = this.state.searchValue;


      if (disableSearch) {
        return null;
      }

      return _react2.default.createElement(
        _reactstrap.InputGroup,
        { className: (0, _classnames2.default)(searchClassName) },
        _react2.default.createElement(_reactstrap.Input, {
          autoFocus: true,
          className: (0, _classnames2.default)(searchInputClassName),
          onChange: this.handleSearchValueChange,
          placeholder: searchPlaceholder,
          type: 'text',
          value: searchValue
        }),
        this.renderSearchValueClearLink()
      );
    }
  }, {
    key: 'renderOptionButtons',
    value: function renderOptionButtons() {
      var _props2 = this.props,
          buttons = _props2.buttons,
          onSearch = _props2.onSearch,
          buttonContainerClassName = _props2.buttonContainerClassName,
          emptyResultClassName = _props2.emptyResultClassName,
          buttonClassName = _props2.buttonClassName,
          ButtonComponent = _props2.ButtonComponent;
      var searchValue = this.state.searchValue;


      var buttonsToRender = buttons;

      if (searchValue.length !== 0) {
        buttonsToRender = onSearch(searchValue, buttonsToRender);
      }

      if (buttonsToRender.length === 0) {
        return _react2.default.createElement(
          'div',
          { className: (0, _classnames2.default)(buttonContainerClassName) },
          _react2.default.createElement(
            'div',
            { className: (0, _classnames2.default)(emptyResultClassName) },
            _i18n2.default._t('PopoverOptionSet.NO_RESULTS', 'No results found')
          )
        );
      }

      return _react2.default.createElement(
        'div',
        { className: (0, _classnames2.default)(buttonContainerClassName) },
        buttonsToRender.map(function (button) {
          return _react2.default.createElement(
            ButtonComponent,
            _extends({}, button.buttonProps, {
              className: (0, _classnames2.default)(button.className, buttonClassName),
              key: button.key,
              onClick: button.onClick
            }),
            button.content
          );
        })
      );
    }
  }, {
    key: 'render',
    value: function render() {
      var _props3 = this.props,
          container = _props3.container,
          className = _props3.className,
          isOpen = _props3.isOpen,
          placement = _props3.placement,
          target = _props3.target;


      return _react2.default.createElement(
        _reactstrap.Popover,
        {
          className: (0, _classnames2.default)(className),
          container: container,
          hideArrow: true,
          isOpen: isOpen,
          placement: placement,
          target: target,
          toggle: this.handleToggle,
          onKeyDown: this.handleKeyDown
        },
        this.renderSearchBox(),
        this.renderOptionButtons()
      );
    }
  }]);

  return PopoverOptionSet;
}(_react.Component);

PopoverOptionSet.propTypes = {
  buttons: _propTypes2.default.arrayOf(_propTypes2.default.shape({
    key: _propTypes2.default.string.isRequired,
    content: _propTypes2.default.node.isRequired,
    onClick: _propTypes2.default.func.isRequired,
    className: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.object, _propTypes2.default.arrayOf(_propTypes2.default.string)]),
    buttonProps: _propTypes2.default.object
  })).isRequired,

  onSearch: _propTypes2.default.func,
  container: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.func, _propTypes2.default.object]),
  isOpen: _propTypes2.default.bool.isRequired,
  placement: _propTypes2.default.string,
  target: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.func, _propTypes2.default.object]).isRequired,
  toggle: _propTypes2.default.func.isRequired,
  searchPlaceholder: _propTypes2.default.string,
  disableSearch: _propTypes2.default.bool,
  ButtonComponent: _propTypes2.default.oneOfType([_propTypes2.default.func, _propTypes2.default.object]),

  className: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.array, _propTypes2.default.object]),
  searchClassName: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.array, _propTypes2.default.object]),
  searchInputClassName: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.array, _propTypes2.default.object]),
  clearButtonClassName: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.array, _propTypes2.default.object]),
  buttonContainerClassName: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.array, _propTypes2.default.object]),
  emptyResultClassName: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.array, _propTypes2.default.object]),
  buttonClassName: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.array, _propTypes2.default.object])
};

PopoverOptionSet.defaultProps = {
  searchPlaceholder: _i18n2.default._t('PopoverOptionSet.SEARCH_PLACEHOLDER', 'Search'),
  onSearch: function onSearch(query, buttons) {
    return buttons.filter(function (_ref) {
      var content = _ref.content;
      return content.toLowerCase().includes(query.toLowerCase());
    });
  },
  disableSearch: false,
  ButtonComponent: _reactstrap.Button,
  className: 'popover-option-set',
  searchClassName: 'popover-option-set__search',
  searchInputClassName: 'popover-option-set__search-input',
  clearButtonClassName: 'popover-option-set__search-clear btn btn-link',
  buttonContainerClassName: 'popover-option-set__button-container',
  emptyResultClassName: 'popover-option-set__no-results',
  buttonClassName: 'popover-option-set__button'

};

exports.default = PopoverOptionSet;

/***/ }),

/***/ "./client/src/components/Search/Search.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hasFilters = exports.Component = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _i18n = __webpack_require__(3);

var _i18n2 = _interopRequireDefault(_i18n);

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _reactRedux = __webpack_require__(5);

var _reactDom = __webpack_require__(10);

var _reactDom2 = _interopRequireDefault(_reactDom);

var _redux = __webpack_require__(7);

var _SchemaActions = __webpack_require__(16);

var schemaActions = _interopRequireWildcard(_SchemaActions);

var _reduxForm = __webpack_require__(12);

var _immutable = __webpack_require__("./node_modules/redux-form/lib/immutable.js");

var _lib = __webpack_require__("./node_modules/redux-form/lib/index.js");

var _getIn = __webpack_require__("./node_modules/redux-form/lib/structure/plain/getIn.js");

var _getIn2 = _interopRequireDefault(_getIn);

var _Focusedzone = __webpack_require__("./client/src/components/Focusedzone/Focusedzone.js");

var _Focusedzone2 = _interopRequireDefault(_Focusedzone);

var _getFormState = __webpack_require__(17);

var _getFormState2 = _interopRequireDefault(_getFormState);

var _SearchBox = __webpack_require__("./client/src/components/Search/SearchBox.js");

var _SearchBox2 = _interopRequireDefault(_SearchBox);

var _SearchForm = __webpack_require__("./client/src/components/Search/SearchForm.js");

var _SearchForm2 = _interopRequireDefault(_SearchForm);

var _SearchToggle = __webpack_require__("./client/src/components/Search/SearchToggle.js");

var _SearchToggle2 = _interopRequireDefault(_SearchToggle);

var _mapFormSchemaToTags = __webpack_require__("./client/src/components/Search/utilities/mapFormSchemaToTags.js");

var _mapFormSchemaToTags2 = _interopRequireDefault(_mapFormSchemaToTags);

var _propTypes = __webpack_require__(1);

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DISPLAY = {
  NONE: 'NONE',
  VISIBLE: 'VISIBLE',
  EXPANDED: 'EXPANDED'
};
var BEHAVIOR = {
  NONE: 'NONE',
  HIDEABLE: 'HIDEABLE',
  TOGGLABLE: 'TOGGLABLE'
};

function hasFilters(filters) {
  return filters && Object.keys(filters).length > 0;
}

var Search = function (_Component) {
  _inherits(Search, _Component);

  function Search(props) {
    _classCallCheck(this, Search);

    var _this = _possibleConstructorReturn(this, (Search.__proto__ || Object.getPrototypeOf(Search)).call(this, props));

    _this.expand = _this.expand.bind(_this);
    _this.handleChange = _this.handleChange.bind(_this);
    _this.getData = _this.getData.bind(_this);
    _this.doSearch = _this.doSearch.bind(_this);
    _this.focusInput = _this.focusInput.bind(_this);
    _this.focusFirstFormField = _this.focusFirstFormField.bind(_this);
    _this.hide = _this.hide.bind(_this);
    _this.show = _this.show.bind(_this);
    _this.toggle = _this.toggle.bind(_this);
    _this.open = _this.open.bind(_this);
    _this.searchTermIsDirty = _this.searchTermIsDirty.bind(_this);
    _this.clearFilters = _this.clearFilters.bind(_this);
    _this.clearSearchBox = _this.clearSearchBox.bind(_this);
    _this.clearFormFilter = _this.clearFormFilter.bind(_this);
    _this.focusFormFilter = _this.focusFormFilter.bind(_this);
    _this.formatTagData = _this.formatTagData.bind(_this);

    var term = props.term || props.filters && props.filters['' + props.filterPrefix + props.name] || '';

    _this.state = {
      display: props.display,
      searchText: term,
      initialSearchText: term
    };
    return _this;
  }

  _createClass(Search, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      this.setOverrides(this.props);
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(props) {
      if (props && !hasFilters(props.filters) && hasFilters(this.props.filters)) {
        this.clearFormData(props);
      } else if (JSON.stringify(props.filters) !== JSON.stringify(this.props.filters)) {
        this.setOverrides(props);
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.setOverrides();
    }
  }, {
    key: 'setOverrides',
    value: function setOverrides(props) {
      if (props && (!hasFilters(props.filters) || this.props.formSchemaUrl !== props.formSchemaUrl)) {
        var schemaUrl = props && props.formSchemaUrl || this.props.formSchemaUrl;
        if (schemaUrl) {
          this.props.actions.schema.setSchemaStateOverrides(schemaUrl, null);
        }
      }

      if (props && hasFilters(props.filters) && props.formSchemaUrl) {
        var filters = props.filters || {};
        var overrides = {
          fields: Object.keys(filters).map(function (name) {
            var value = filters[name];
            return { name: name, value: value };
          })
        };

        this.props.actions.schema.setSchemaStateOverrides(props.formSchemaUrl, overrides);
      }
    }
  }, {
    key: 'getData',
    value: function getData() {
      var ignoreSearchTerm = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      var _props = this.props,
          name = _props.name,
          filterPrefix = _props.filterPrefix,
          formData = _props.formData;
      var searchText = this.state.searchText;

      var data = {};

      Object.keys(formData).forEach(function (key) {
        var value = formData[key];
        if (value) {
          data[key] = value;
        }
      });

      if (!ignoreSearchTerm && searchText && typeof formData['' + filterPrefix + name] === 'undefined') {
        data['' + filterPrefix + name] = searchText.trim();
      }

      return data;
    }
  }, {
    key: 'handleChange',
    value: function handleChange(event) {
      var value = event.target.value;
      if (this.state.searchText !== value) {
        this.setState({ searchText: value });
      }

      var _props2 = this.props,
          schemaName = _props2.schemaName,
          name = _props2.name,
          filterPrefix = _props2.filterPrefix,
          actions = _props2.actions,
          formData = _props2.formData;

      if (typeof formData['' + filterPrefix + name] !== 'undefined') {
        actions.reduxForm.change(schemaName, '' + filterPrefix + name, value);
      }
    }
  }, {
    key: 'focusInput',
    value: function focusInput() {
      if (this.state.display === DISPLAY.NONE) {
        return;
      }

      var node = _reactDom2.default.findDOMNode(this);
      if (!node) {
        return;
      }

      var input = node.querySelector('.search-box__content-field');

      if (input !== document.activeElement) {
        input.focus();
        if (input.select) {
          input.select();
        }
      }
    }
  }, {
    key: 'focusFirstFormField',
    value: function focusFirstFormField() {
      var filter = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'input, textarea, select, button';

      if (this.state.display !== DISPLAY.EXPANDED) {
        return;
      }

      var node = _reactDom2.default.findDOMNode(this);
      if (!node) {
        return;
      }

      var form = node.querySelector('.search-form');
      if (!form) {
        return;
      }

      var input = form.querySelector(filter);
      if (input) {
        input.focus();
        if (input.select) {
          input.select();
        }
      }
    }
  }, {
    key: 'clearFormData',
    value: function clearFormData(props) {
      if (this.state.searchText !== '') {
        this.setState({ searchText: '' });
      }

      var formSchemaUrl = props && props.formSchemaUrl || this.props.formSchemaUrl;
      if (formSchemaUrl) {
        var identifier = props && props.identifier || this.props.identifier;
        this.props.actions.reduxForm.initialize(identifier, {}, Object.keys(this.props.formData));
        this.props.actions.reduxForm.reset(identifier);
      }
    }
  }, {
    key: 'clearFormFilter',
    value: function clearFormFilter(key) {
      var tag = this.props.tagData[key];
      var clearables = _defineProperty({}, key, undefined);
      if (Array.isArray(tag.linkedFields)) {
        tag.linkedFields.forEach(function (linkFieldkey) {
          clearables[linkFieldkey] = undefined;
        });
      }
      this.doSearch(clearables);
    }
  }, {
    key: 'focusFormFilter',
    value: function focusFormFilter(key) {
      var _this2 = this;

      var tag = this.props.tagData[key];
      var selector = tag.focusSelector || '[name=' + key + ']';
      this.expand();
      setTimeout(function () {
        return _this2.focusFirstFormField(selector);
      }, 50);
    }
  }, {
    key: 'open',
    value: function open() {
      this.show();
      this.focusInput();
    }
  }, {
    key: 'hide',
    value: function hide() {
      if (this.props.onHide) {
        this.props.onHide();
      } else if (this.state.display !== DISPLAY.NONE) {
        this.setState({ display: DISPLAY.NONE });
      }
    }
  }, {
    key: 'show',
    value: function show() {
      if (this.state.display !== DISPLAY.VISIBLE) {
        this.setState({ display: DISPLAY.VISIBLE });
      }

      var _props3 = this.props,
          schemaName = _props3.schemaName,
          formData = _props3.formData,
          name = _props3.name,
          actions = _props3.actions;

      if (typeof formData[name] !== 'undefined') {
        actions.reduxForm.change(schemaName, name, this.state.searchText);
      }
    }
  }, {
    key: 'expand',
    value: function expand() {
      if (this.state.display !== DISPLAY.EXPANDED) {
        this.setState({ display: DISPLAY.EXPANDED });
      }
    }
  }, {
    key: 'toggle',
    value: function toggle() {
      switch (this.state.display) {
        case DISPLAY.VISIBLE:
          this.expand();
          setTimeout(this.focusFirstFormField, 50);
          break;
        case DISPLAY.EXPANDED:
          this.show();
          break;
        default:
      }
    }
  }, {
    key: 'searchTermIsDirty',
    value: function searchTermIsDirty() {
      var _state = this.state,
          searchText = _state.searchText,
          initialSearchText = _state.initialSearchText;

      return searchText.trim() !== initialSearchText.trim();
    }
  }, {
    key: 'doSearch',
    value: function doSearch() {
      var overrides = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var _props4 = this.props,
          formSchemaUrl = _props4.formSchemaUrl,
          identifier = _props4.identifier,
          name = _props4.name,
          filterPrefix = _props4.filterPrefix;

      var searchData = {};
      var fieldData = this.getData();

      Object.entries(fieldData).forEach(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2),
            key = _ref2[0],
            value = _ref2[1];

        var newKey = key;
        var newValue = value;

        if (overrides.hasOwnProperty(key)) {
          newValue = overrides[key];
        }

        if (filterPrefix.length > 0 && key.startsWith(filterPrefix)) {
          newKey = key.substring(filterPrefix.length);
        }

        if (!filterPrefix.length > 0 || key !== name || typeof fieldData['' + filterPrefix + name] === 'undefined') {
          searchData[newKey] = newValue;
        }
      });

      var searchText = searchData[name] || '';

      var formData = Object.assign({}, this.getData(true), overrides);

      if (this.state.display !== DISPLAY.VISIBLE || this.state.initialSearchText !== searchText || this.state.searchText !== searchText) {
        this.setState({
          display: DISPLAY.VISIBLE,
          initialSearchText: searchText,
          searchText: searchText
        });
      }

      this.props.actions.schema.setSchemaStateOverrides(formSchemaUrl, { fields: [] });
      this.props.actions.reduxForm.initialize(identifier, formData);

      this.props.onSearch(searchData);
    }
  }, {
    key: 'clearFilters',
    value: function clearFilters() {
      this.clearFormData();
      this.focusFirstFormField();
    }
  }, {
    key: 'clearSearchBox',
    value: function clearSearchBox() {
      this.clearFormData();
      this.focusInput();
    }
  }, {
    key: 'formatTagData',
    value: function formatTagData() {
      var _props5 = this.props,
          tagData = _props5.tagData,
          name = _props5.name,
          filterPrefix = _props5.filterPrefix;

      var tagDataCopy = Object.assign({}, tagData);
      var nameKey = '' + filterPrefix + name;

      if (tagDataCopy && tagDataCopy[nameKey]) {
        delete tagDataCopy[nameKey];
      }

      return tagDataCopy ? Object.values(tagDataCopy).map(function (_ref3) {
        var key = _ref3.key,
            label = _ref3.label,
            value = _ref3.value;
        return { key: key, label: label, value: value };
      }) : [];
    }
  }, {
    key: 'render',
    value: function render() {
      var _props6 = this.props,
          formSchemaUrl = _props6.formSchemaUrl,
          forceFilters = _props6.forceFilters,
          id = _props6.id,
          displayBehavior = _props6.displayBehavior,
          identifier = _props6.identifier,
          formIsDirty = _props6.formIsDirty,
          tagData = _props6.tagData,
          name = _props6.name,
          props = _objectWithoutProperties(_props6, ['formSchemaUrl', 'forceFilters', 'id', 'displayBehavior', 'identifier', 'formIsDirty', 'tagData', 'name']);

      if (this.state.display === DISPLAY.NONE) {
        if (displayBehavior === BEHAVIOR.TOGGLABLE) {
          return _react2.default.createElement(_SearchToggle2.default, { onToggle: this.show });
        }
        return _react2.default.createElement('div', null);
      }

      var formId = id + '_ExtraFields';
      var searchText = this.state.searchText;

      var expanded = this.state.display === DISPLAY.EXPANDED;
      var visible = this.state.display === DISPLAY.VISIBLE;

      var hideable = [BEHAVIOR.HIDEABLE, BEHAVIOR.TOGGLABLE].includes(displayBehavior);

      var dirty = formIsDirty || this.searchTermIsDirty();
      var data = this.getData();
      var clearable = Object.keys(data).length > 0;

      return _react2.default.createElement(
        _Focusedzone2.default,
        { onClickOut: this.show, className: 'search' },
        _react2.default.createElement(
          _SearchBox2.default,
          _extends({}, props, {
            name: 'SearchBox__' + name,
            onChange: this.handleChange,
            onSearch: this.doSearch,
            onToggleFilter: this.toggle,
            onHideFilter: this.show,
            onHide: this.hide,
            onClear: this.clearSearchBox,
            searchText: searchText,
            hideable: hideable,
            expanded: expanded,
            id: id + '_searchbox',
            showFilters: Boolean(forceFilters || formSchemaUrl),
            dirty: dirty,
            clearable: clearable,
            onTagDelete: this.clearFormFilter,
            onTagClick: this.focusFormFilter,
            tagData: this.formatTagData()
          }),
          _react2.default.createElement(_SearchForm2.default, {
            id: formId,
            identifier: identifier,
            visible: visible,
            expanded: expanded,
            formSchemaUrl: formSchemaUrl,
            onSearch: this.doSearch,
            onClear: this.clearFilters,
            clearable: clearable
          })
        )
      );
    }
  }]);

  return Search;
}(_react.Component);

Search.propTypes = {
  onSearch: _propTypes2.default.func,
  onHide: _propTypes2.default.func,

  id: _propTypes2.default.string.isRequired,
  display: _propTypes2.default.oneOf(Object.values(DISPLAY)),
  formSchemaUrl: _propTypes2.default.string,
  filters: _propTypes2.default.object,
  formData: _propTypes2.default.object,
  placeholder: _propTypes2.default.string,
  displayBehavior: _propTypes2.default.oneOf(Object.values(BEHAVIOR)),
  term: _propTypes2.default.string,
  name: _propTypes2.default.string,
  filterPrefix: _propTypes2.default.string,
  forceFilters: _propTypes2.default.bool,
  formIsDirty: _propTypes2.default.bool,
  identifier: _propTypes2.default.string,
  schemaName: _propTypes2.default.string,
  tagHandlers: _propTypes2.default.object,
  borders: _propTypes2.default.shape({
    top: _propTypes2.default.bool,
    right: _propTypes2.default.bool,
    bottom: _propTypes2.default.bool,
    left: _propTypes2.default.bool
  })
};

Search.defaultProps = {
  placeholder: _i18n2.default._t('Admin.SEARCH', 'Search'),
  display: DISPLAY.VISIBLE,
  displayBehavior: BEHAVIOR.NONE,
  filters: {},
  formData: {},
  term: '',
  filterPrefix: '',
  forceFilters: false,
  name: 'searchTerm',
  identifier: 'Admin.SearchForm'
};

function mapStateToProps(state, ownProps) {
  var schema = state.form.formSchemas[ownProps.formSchemaUrl];
  if (!schema || !schema.name) {
    return { formData: {} };
  }

  var schemaName = schema.name;

  var form = (0, _getIn2.default)((0, _getFormState2.default)(state), schemaName);

  var formData = form && form.values || {};
  var tagData = (0, _mapFormSchemaToTags2.default)(schema, ownProps.filters, ownProps.tagHandlers || {});
  var formIsDirty = (0, _immutable.isDirty)(schemaName, _getFormState2.default)(state);

  return { formData: formData, formIsDirty: formIsDirty, schemaName: schemaName, tagData: tagData };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      schema: (0, _redux.bindActionCreators)(schemaActions, dispatch),
      reduxForm: (0, _redux.bindActionCreators)({ reset: _reduxForm.reset, initialize: _reduxForm.initialize, change: _lib.change }, dispatch)
    }
  };
}

exports.Component = Search;
exports.hasFilters = hasFilters;
exports.default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(Search);

/***/ }),

/***/ "./client/src/components/Search/SearchBox.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Component = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _i18n = __webpack_require__(3);

var _i18n2 = _interopRequireDefault(_i18n);

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _reactstrap = __webpack_require__(6);

var _classnames = __webpack_require__(4);

var _classnames2 = _interopRequireDefault(_classnames);

var _TagPropType = __webpack_require__("./client/src/components/Tag/TagPropType.js");

var _TagPropType2 = _interopRequireDefault(_TagPropType);

var _CompactTagList = __webpack_require__(27);

var _CompactTagList2 = _interopRequireDefault(_CompactTagList);

var _ResizeAware = __webpack_require__(23);

var _ResizeAware2 = _interopRequireDefault(_ResizeAware);

var _reactDom = __webpack_require__(10);

var _reactDom2 = _interopRequireDefault(_reactDom);

var _propTypes = __webpack_require__(1);

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SearchBox = function (_Component) {
  _inherits(SearchBox, _Component);

  function SearchBox(props) {
    _classCallCheck(this, SearchBox);

    var _this = _possibleConstructorReturn(this, (SearchBox.__proto__ || Object.getPrototypeOf(SearchBox)).call(this, props));

    _this.handleKeyDown = _this.handleKeyDown.bind(_this);
    _this.handleFocus = _this.handleFocus.bind(_this);
    _this.handleBlur = _this.handleBlur.bind(_this);
    _this.renderInput = _this.renderInput.bind(_this);
    _this.renderFilterButton = _this.renderFilterButton.bind(_this);
    _this.renderEnterHint = _this.renderEnterHint.bind(_this);
    _this.renderHideButton = _this.renderHideButton.bind(_this);
    _this.componentDidUpdate = _this.componentDidUpdate.bind(_this);
    _this.onResize = _this.onResize.bind(_this);
    _this.setWidth = _this.setWidth.bind(_this);
    _this.renderTags = _this.renderTags.bind(_this);
    _this.getComponentWidth = _this.getComponentWidth.bind(_this);
    _this.calculateSpaceForTags = _this.calculateSpaceForTags.bind(_this);
    _this.calculateInputLeftPadding = _this.calculateInputLeftPadding.bind(_this);
    _this.onTagListResize = _this.onTagListResize.bind(_this);
    _this.focusOnLastTag = _this.focusOnLastTag.bind(_this);
    _this.focusOnInput = _this.focusOnInput.bind(_this);

    _this.state = {
      hasFocus: false,
      width: window.innerWidth - 180 - 55,
      tagWidth: 0
    };
    return _this;
  }

  _createClass(SearchBox, [{
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      var width = this.getComponentWidth();
      this.setWidth(width);
    }
  }, {
    key: 'onResize',
    value: function onResize(dimension) {
      this.setWidth(dimension.width);
    }
  }, {
    key: 'onTagListResize',
    value: function onTagListResize(dimensions) {
      var tagWidth = dimensions.width;
      if (this.state.tagWidth !== tagWidth) {
        this.setState({ tagWidth: tagWidth });
      }
    }
  }, {
    key: 'setWidth',
    value: function setWidth(width) {
      if (this.state.width !== width) {
        this.setState({ width: width });
      }
    }
  }, {
    key: 'getComponentWidth',
    value: function getComponentWidth() {
      var node = _reactDom2.default.findDOMNode(this);
      if (!node) {
        return 0;
      }

      return node.getBoundingClientRect().width;
    }
  }, {
    key: 'calculateInputLeftPadding',
    value: function calculateInputLeftPadding() {
      var existingPadding = this.state.width > 576 ? 55 : 20;
      return this.state.tagWidth + existingPadding;
    }
  }, {
    key: 'calculateSpaceForTags',
    value: function calculateSpaceForTags() {
      var width = this.state.width;

      width -= 150;

      width = width - 55 - 52;

      var _props = this.props,
          hideable = _props.hideable,
          showFilters = _props.showFilters;

      if (hideable) {
        width -= 52;
      }

      if (showFilters) {
        width -= 52;
      }

      width = Math.max(width, 0);

      return width;
    }
  }, {
    key: 'handleKeyDown',
    value: function handleKeyDown(event) {
      if (event.key === 'Enter') {
        event.preventDefault();
        this.props.onSearch();
      } else if (event.target.selectionStart === 0 && (event.key === 'ArrowLeft' || event.key === 'Backspace' && event.target.selectionEnd - event.target.selectionStart === 0)) {
        event.preventDefault();
        this.focusOnLastTag();
      }
    }
  }, {
    key: 'handleFocus',
    value: function handleFocus() {
      if (!this.state.hasFocus) {
        this.setState({ hasFocus: true });
      }
      if (this.props.onHideFilter) {
        this.props.onHideFilter();
      }
    }
  }, {
    key: 'handleBlur',
    value: function handleBlur() {
      if (this.state.hasFocus) {
        this.setState({ hasFocus: false });
      }
    }
  }, {
    key: 'focusOnLastTag',
    value: function focusOnLastTag() {
      var node = _reactDom2.default.findDOMNode(this);
      if (!node) {
        return;
      }
      var lastTag = node.querySelector('.compact-tag-list__visible .tag:last-child');
      if (lastTag) {
        lastTag.focus();
      }
    }
  }, {
    key: 'focusOnInput',
    value: function focusOnInput() {
      var node = _reactDom2.default.findDOMNode(this);
      if (!node) {
        return;
      }
      var input = node.querySelector('input');
      if (input) {
        input.focus();
      }
    }
  }, {
    key: 'renderInput',
    value: function renderInput() {
      var _classNames;

      var _props2 = this.props,
          id = _props2.id,
          searchText = _props2.searchText,
          onChange = _props2.onChange,
          placeholder = _props2.placeholder,
          name = _props2.name,
          borders = _props2.borders;

      var style = { paddingLeft: this.calculateInputLeftPadding() + 'px' };

      var mergedBorders = Object.assign({}, SearchBox.defaultProps.borders, borders);
      var classe = 'search-box__content-field';
      var classeNames = (0, _classnames2.default)('form-control', classe, (_classNames = {}, _defineProperty(_classNames, classe + '--top-border', mergedBorders.top), _defineProperty(_classNames, classe + '--right-border', mergedBorders.right), _defineProperty(_classNames, classe + '--bottom-border', mergedBorders.bottom), _defineProperty(_classNames, classe + '--left-border', mergedBorders.left), _classNames));

      return _react2.default.createElement('input', {
        'aria-labelledby': id + '_label',
        type: 'search',
        name: name,
        placeholder: placeholder,
        className: classeNames,
        onKeyDown: this.handleKeyDown,
        onChange: onChange,
        onFocus: this.handleFocus,
        onBlur: this.handleBlur,
        value: searchText,
        id: id,

        autoFocus: true,
        style: style
      });
    }
  }, {
    key: 'renderTags',
    value: function renderTags() {
      var _props3 = this.props,
          tagData = _props3.tagData,
          onTagDelete = _props3.onTagDelete,
          onTagClick = _props3.onTagClick,
          onToggleFilter = _props3.onToggleFilter;

      return _react2.default.createElement(
        'div',
        { className: 'search-box__tags' },
        _react2.default.createElement(
          _ResizeAware2.default,
          { onResize: this.onTagListResize },
          _react2.default.createElement(_CompactTagList2.default, {
            onTagDelete: onTagDelete,
            onTagClick: onTagClick,
            onHolderFocus: this.focusOnInput,
            tags: tagData,
            onSummary: onToggleFilter,
            maxSize: this.calculateSpaceForTags(),
            deletable: true
          })
        )
      );
    }
  }, {
    key: 'renderEnterHint',
    value: function renderEnterHint() {
      var _this2 = this;

      return _react2.default.createElement(
        'div',
        {
          role: 'presentation',
          className: 'search-box__enter',
          onClick: function onClick(e) {
            e.stopPropagation();e.preventDefault();_this2.props.onSearch();
          }
        },
        _i18n2.default._t('Admin.ENTER', 'Enter'),
        '\xA0\u21B5'
      );
    }
  }, {
    key: 'renderFilterButton',
    value: function renderFilterButton() {
      var _props4 = this.props,
          expanded = _props4.expanded,
          onToggleFilter = _props4.onToggleFilter,
          formId = _props4.formId;

      var classes = (0, _classnames2.default)('btn--icon', 'btn--no-text', 'font-icon-caret-down-two', 'search-box__filter-trigger', { collapsed: !expanded });
      return _react2.default.createElement(_reactstrap.Button, {
        'aria-expanded': expanded,
        'aria-controls': formId,
        'aria-label': _i18n2.default._t('Admin.ADVANCED', 'Advanced'),
        onClick: onToggleFilter,
        className: classes,
        title: _i18n2.default._t('Admin.ADVANCED', 'Advanced')
      });
    }
  }, {
    key: 'renderHideButton',
    value: function renderHideButton() {
      var _props5 = this.props,
          id = _props5.id,
          onHide = _props5.onHide;

      return _react2.default.createElement(_reactstrap.Button, {
        onClick: onHide,
        title: _i18n2.default._t('Admin.CLOSE', 'Close'),
        'aria-label': _i18n2.default._t('Admin.CLOSE', 'Close'),
        className: 'font-icon-cancel btn--no-text btn--icon-lg search-box__cancel',
        'aria-controls': id,
        'aria-expanded': 'true'
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _props6 = this.props,
          children = _props6.children,
          id = _props6.id,
          hideable = _props6.hideable,
          expanded = _props6.expanded,
          showFilters = _props6.showFilters,
          dirty = _props6.dirty,
          clearable = _props6.clearable;


      var searchClasses = (0, _classnames2.default)('search-box', {
        'search-box--hideable': hideable,
        'search-box--not-hideable': !hideable,
        'search-box--has-focus': this.state.hasFocus,
        'search-box--has-not-focus': !this.state.hasFocus,
        'search-box--has-filters': showFilters,
        'search-box--has-not-filters': !showFilters,
        'search-box--compact': this.state.width < 576,
        'search-box--expanded': expanded
      });

      var showEnter = (dirty || !clearable) && this.state.hasFocus;

      return _react2.default.createElement(
        'div',
        { className: searchClasses },
        _react2.default.createElement(
          _ResizeAware2.default,
          { onResize: this.onResize },
          _react2.default.createElement(
            'div',
            { className: 'search-box__group' },
            _react2.default.createElement(
              _reactstrap.Label,
              { 'for': id, id: id + '_label', hidden: true },
              _i18n2.default._t('Admin.SEARCH', 'Search')
            ),
            this.renderTags(),
            this.renderInput(),
            showEnter && this.renderEnterHint(),
            children,
            _react2.default.createElement('div', { className: 'icon font-icon-search' }),
            showFilters && this.renderFilterButton(),
            hideable && this.renderHideButton()
          )
        )
      );
    }
  }]);

  return SearchBox;
}(_react.Component);

SearchBox.propTypes = {
  onSearch: _propTypes2.default.func,
  onToggleFilter: _propTypes2.default.func,
  onHideFilter: _propTypes2.default.func,
  onChange: _propTypes2.default.func,
  onHide: _propTypes2.default.func,
  onTagDelete: _propTypes2.default.func,
  onTagClick: _propTypes2.default.func,
  placeholder: _propTypes2.default.string,
  expanded: _propTypes2.default.bool,
  formId: _propTypes2.default.string,
  id: _propTypes2.default.string,
  searchText: _propTypes2.default.string,
  hideable: _propTypes2.default.bool,
  showFilters: _propTypes2.default.bool,
  name: _propTypes2.default.string,
  dirty: _propTypes2.default.bool,
  clearable: _propTypes2.default.bool,
  tagData: _propTypes2.default.arrayOf(_TagPropType2.default)
};

SearchBox.defaultProps = {
  placeholder: _i18n2.default._t('Admin.SEARCH', 'Search'),
  tagData: [],
  filters: {},
  formData: {},
  term: '',
  borders: {
    top: false,
    right: false,
    bottom: true,
    left: true
  }
};

exports.Component = SearchBox;
exports.default = SearchBox;

/***/ }),

/***/ "./client/src/components/Search/SearchForm.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Component = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _i18n = __webpack_require__(3);

var _i18n2 = _interopRequireDefault(_i18n);

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _FormBuilderLoader = __webpack_require__(28);

var _FormBuilderLoader2 = _interopRequireDefault(_FormBuilderLoader);

var _reactstrap = __webpack_require__(6);

var _propTypes = __webpack_require__(1);

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var searchLabel = _i18n2.default._t('Admin.SEARCH', 'Search');
var clearLabel = _i18n2.default._t('Admin.CLEAR', 'Clear');

var SearchForm = function (_Component) {
  _inherits(SearchForm, _Component);

  function SearchForm(props) {
    _classCallCheck(this, SearchForm);

    var _this = _possibleConstructorReturn(this, (SearchForm.__proto__ || Object.getPrototypeOf(SearchForm)).call(this, props));

    _this.handleKeyDown = _this.handleKeyDown.bind(_this);
    return _this;
  }

  _createClass(SearchForm, [{
    key: 'handleKeyDown',
    value: function handleKeyDown(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        this.props.onSearch();
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          visible = _props.visible,
          expanded = _props.expanded,
          onSearch = _props.onSearch,
          onClear = _props.onClear,
          formSchemaUrl = _props.formSchemaUrl,
          id = _props.id,
          identifier = _props.identifier,
          clearable = _props.clearable;


      var loadForm = visible || expanded;

      return _react2.default.createElement(
        _reactstrap.Collapse,
        { id: id, isOpen: expanded, className: 'search-form' },
        _react2.default.createElement(
          'div',
          {
            className: 'search-form__wrapper',
            onKeyDown: this.handleKeyDown
          },
          loadForm && formSchemaUrl && _react2.default.createElement(_FormBuilderLoader2.default, {
            className: 'no-change-track',
            formTag: 'div',
            identifier: identifier,
            schemaUrl: formSchemaUrl,
            onSubmit: function onSubmit() {
              onSearch();return Promise.resolve();
            }
          }),
          _react2.default.createElement(
            _reactstrap.Button,
            {
              className: 'search-form__submit',
              onClick: function onClick() {
                return onSearch();
              },
              color: 'primary',
              type: 'button'
            },
            searchLabel
          ),
          clearable && _react2.default.createElement(
            _reactstrap.Button,
            {
              className: 'search-form__clear',
              onClick: function onClick() {
                return onClear();
              }
            },
            clearLabel
          )
        )
      );
    }
  }]);

  return SearchForm;
}(_react.Component);

SearchForm.propTypes = {
  onSearch: _propTypes2.default.func,
  onClear: _propTypes2.default.func,
  visible: _propTypes2.default.bool,
  expanded: _propTypes2.default.bool,
  id: _propTypes2.default.string.isRequired,
  formSchemaUrl: _propTypes2.default.string,
  identifier: _propTypes2.default.string,
  clearable: _propTypes2.default.bool
};

SearchForm.defaultProps = {
  formData: {}
};

exports.Component = SearchForm;
exports.default = SearchForm;

/***/ }),

/***/ "./client/src/components/Search/SearchToggle.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Component = undefined;

var _i18n = __webpack_require__(3);

var _i18n2 = _interopRequireDefault(_i18n);

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _reactstrap = __webpack_require__(6);

var _classnames = __webpack_require__(4);

var _classnames2 = _interopRequireDefault(_classnames);

var _propTypes = __webpack_require__(1);

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var label = _i18n2.default._t('Admin.SHOW_SEARCH', 'Show search');

var toggleBtnClasses = function toggleBtnClasses(toggled) {
  return (0, _classnames2.default)('btn--no-text', 'search-toggle', 'font-icon-search', 'btn--icon-lg', { 'search-toggle__active': toggled });
};

var SearchToggle = function SearchToggle(_ref) {
  var onToggle = _ref.onToggle,
      toggled = _ref.toggled;
  return _react2.default.createElement(
    _reactstrap.Button,
    {
      title: label,
      onClick: onToggle,
      className: toggleBtnClasses(toggled)
    },
    _react2.default.createElement(
      'span',
      { className: 'sr-only' },
      label
    )
  );
};

SearchToggle.propTypes = {
  onToggle: _propTypes2.default.func,
  toggled: _propTypes2.default.bool
};

exports.Component = SearchToggle;
exports.default = SearchToggle;

/***/ }),

/***/ "./client/src/components/Search/utilities/defaultTagHandlers.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _genericDateTagHandler = __webpack_require__("./client/src/components/Search/utilities/genericDateTagHandler.js");

var _genericDateTagHandler2 = _interopRequireDefault(_genericDateTagHandler);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var selectTagHandler = function selectTagHandler(key, values, formSchema) {
  if (!Array.isArray(values) || values.length === 0) {
    return false;
  }

  var fieldState = formSchema.state.fields.find(function (_ref) {
    var name = _ref.name;
    return name === key;
  });

  if (fieldState && fieldState.source) {
    var labelValue = values.map(function (selectedValue) {
      var sourceEntry = fieldState.source.find(function (_ref2) {
        var value = _ref2.value;
        return value.toString() === selectedValue.toString();
      });
      return sourceEntry && sourceEntry.title ? sourceEntry.title : selectedValue;
    }).join(', ');

    return labelValue || false;
  }

  return false;
};

var defaultTagHandlers = {
  Date: (0, _genericDateTagHandler2.default)('ll'),
  Time: (0, _genericDateTagHandler2.default)('LT'),
  Datetime: (0, _genericDateTagHandler2.default)('lll'),
  Hidden: function Hidden() {
    return false;
  },
  SingleSelect: function SingleSelect(tag, field, formSchema) {
    if (typeof tag.value === 'undefined') {
      return false;
    }

    var value = selectTagHandler(tag.key, [tag.value], formSchema);
    return value ? Object.assign({}, tag, { value: value }) : false;
  },
  Boolean: function Boolean(tag) {
    if (tag.value) {
      var value = tag.value,
          valuelessTag = _objectWithoutProperties(tag, ['value']);

      return valuelessTag;
    }
    return false;
  },
  MultiSelect: function MultiSelect(tag, field, formSchema) {
    var value = selectTagHandler(tag.key, tag.value, formSchema);
    return value ? Object.assign({}, tag, { value: value }) : false;
  },
  default: function _default(tag) {
    return tag.value ? tag : false;
  }
};

exports.default = defaultTagHandlers;

/***/ }),

/***/ "./client/src/components/Search/utilities/genericDateTagHandler.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _moment = __webpack_require__(14);

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var genericDateTagHandler = function genericDateTagHandler(format) {
  return function (tag, _ref) {
    var lang = _ref.lang;

    if (!tag.value) {
      return false;
    }

    if (tag.value && lang) {
      _moment2.default.locale(lang);
      var dateObject = (0, _moment2.default)(tag.value);
      if (dateObject.isValid()) {
        return Object.assign({}, tag, { value: dateObject.format(format) });
      }
    }

    return tag;
  };
};

exports.default = genericDateTagHandler;

/***/ }),

/***/ "./client/src/components/Search/utilities/mapFormSchemaToTags.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defaultTagHandlers = __webpack_require__("./client/src/components/Search/utilities/defaultTagHandlers.js");

var _defaultTagHandlers2 = _interopRequireDefault(_defaultTagHandlers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var tagListReducer = function tagListReducer(accumulator, _ref) {
  var key = _ref.key,
      value = _ref.value,
      label = _ref.label;
  return '' + accumulator + (label.toLowerCase() || key) + ' ' + (value || '') + ' ';
};

var mapFormSchemaToTags = function mapFormSchemaToTags(formSchema, formData) {
  var tagHandlerOverrides = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  if (formSchema.metadata.loading) {
    return {};
  }

  var tagHandlers = void 0;

  var fieldToTag = function fieldToTag(field) {
    var tag = {
      key: field.name,
      label: field.title,
      value: formData[field.name]
    };

    var handler = void 0;
    if (typeof tagHandlers['#' + tag.key] === 'function') {
      handler = tagHandlers['#' + tag.key];
    } else if (typeof tagHandlers[field.schemaType] === 'function') {
      handler = tagHandlers[field.schemaType];
    } else {
      handler = tagHandlers.default;
    }

    return handler(tag, field, formSchema, formData);
  };

  var structuralTagHandler = function structuralTagHandler(tag, field) {
    var children = field.children;

    if (!Array.isArray(children) || children.length === 0) {
      return false;
    }

    var value = children.map(fieldToTag).filter(function (subTag) {
      return subTag !== false;
    }).reduce(tagListReducer, '').trim();
    var linkedFields = children.map(function (linkedField) {
      return linkedField.name;
    });
    var focusSelector = '[name=' + children[0].name + ']';

    return value ? Object.assign({}, tag, { value: value, linkedFields: linkedFields, focusSelector: focusSelector }) : false;
  };

  tagHandlers = Object.assign({}, _defaultTagHandlers2.default, { Structural: structuralTagHandler }, tagHandlerOverrides);

  var fields = formSchema.schema.fields;

  var tags = fields.map(fieldToTag).filter(function (tag) {
    return tag !== false;
  });

  var keyedTags = {};
  tags.forEach(function (tag) {
    keyedTags[tag.key] = tag;
  });

  return keyedTags;
};

exports.default = mapFormSchemaToTags;

/***/ }),

/***/ "./client/src/components/SingleSelectField/SingleSelectField.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Component = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _FieldHolder = __webpack_require__(8);

var _FieldHolder2 = _interopRequireDefault(_FieldHolder);

var _i18n = __webpack_require__(3);

var _i18n2 = _interopRequireDefault(_i18n);

var _reactstrap = __webpack_require__(6);

var _propTypes = __webpack_require__(1);

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SingleSelectField = function (_Component) {
  _inherits(SingleSelectField, _Component);

  function SingleSelectField(props) {
    _classCallCheck(this, SingleSelectField);

    var _this = _possibleConstructorReturn(this, (SingleSelectField.__proto__ || Object.getPrototypeOf(SingleSelectField)).call(this, props));

    _this.handleChange = _this.handleChange.bind(_this);
    return _this;
  }

  _createClass(SingleSelectField, [{
    key: 'getReadonlyField',
    value: function getReadonlyField() {
      var _this2 = this;

      var label = this.props.source && this.props.source.find(function (item) {
        return item.value === _this2.props.value;
      });

      label = typeof label === 'string' ? label : this.props.value || '';

      return _react2.default.createElement(
        _reactstrap.Input,
        _extends({ plaintext: true }, this.getInputProps()),
        label
      );
    }
  }, {
    key: 'getSelectField',
    value: function getSelectField() {
      var _this3 = this;

      var options = this.props.source ? this.props.source.slice() : [];

      if (this.props.data.hasEmptyDefault && !options.find(function (item) {
        return !item.value;
      })) {
        options.unshift({
          value: '',
          title: this.props.data.emptyString,
          disabled: false
        });
      }

      return _react2.default.createElement(
        _reactstrap.Input,
        _extends({ type: 'select' }, this.getInputProps()),
        options.map(function (item, index) {
          var key = _this3.props.name + '-' + (item.value || 'empty' + index);

          return _react2.default.createElement(
            'option',
            { key: key, value: item.value, disabled: item.disabled },
            item.title
          );
        })
      );
    }
  }, {
    key: 'getInputProps',
    value: function getInputProps() {
      var props = {
        className: this.props.className + ' ' + this.props.extraClass + ' no-chosen',
        id: this.props.id,
        name: this.props.name,
        disabled: this.props.disabled
      };

      if (!this.props.readOnly) {
        Object.assign(props, {
          onChange: this.handleChange,
          value: this.props.value
        });
      }

      return props;
    }
  }, {
    key: 'handleChange',
    value: function handleChange(event) {
      if (typeof this.props.onChange === 'function') {
        this.props.onChange(event, { id: this.props.id, value: event.target.value });
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var field = null;
      if (this.props.readOnly) {
        field = this.getReadonlyField();
      } else {
        field = this.getSelectField();
      }

      return field;
    }
  }]);

  return SingleSelectField;
}(_react.Component);

SingleSelectField.propTypes = {
  id: _propTypes2.default.string,
  name: _propTypes2.default.string.isRequired,
  onChange: _propTypes2.default.func,
  value: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.number]),
  readOnly: _propTypes2.default.bool,
  disabled: _propTypes2.default.bool,
  source: _propTypes2.default.arrayOf(_propTypes2.default.shape({
    value: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.number]),
    title: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.number]),
    disabled: _propTypes2.default.bool
  })),
  data: _propTypes2.default.oneOfType([_propTypes2.default.array, _propTypes2.default.shape({
    hasEmptyDefault: _propTypes2.default.bool,
    emptyString: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.number])
  })])
};

SingleSelectField.defaultProps = {
  source: [],
  extraClass: '',
  className: '',
  data: {
    emptyString: _i18n2.default._t('Boolean.ANY', 'Any')
  }
};

exports.Component = SingleSelectField;
exports.default = (0, _FieldHolder2.default)(SingleSelectField);

/***/ }),

/***/ "./client/src/components/Tabs/TabItem.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _reactstrap = __webpack_require__(6);

var _propTypes = __webpack_require__(1);

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TabItem = function (_Component) {
  _inherits(TabItem, _Component);

  function TabItem() {
    _classCallCheck(this, TabItem);

    return _possibleConstructorReturn(this, (TabItem.__proto__ || Object.getPrototypeOf(TabItem)).apply(this, arguments));
  }

  _createClass(TabItem, [{
    key: 'getTabProps',
    value: function getTabProps() {
      var _props = this.props,
          name = _props.name,
          className = _props.className,
          extraClass = _props.extraClass,
          disabled = _props.disabled;


      return {
        tabId: name,
        className: className + ' ' + extraClass,
        disabled: disabled
      };
    }
  }, {
    key: 'isActive',
    value: function isActive() {
      return this.context.activeTabId === this.props.name;
    }
  }, {
    key: 'render',
    value: function render() {
      var tabProps = this.getTabProps();
      return _react2.default.createElement(
        _reactstrap.TabPane,
        tabProps,
        _react2.default.createElement(
          _reactstrap.Fade,
          { 'in': this.isActive() },
          this.props.children
        )
      );
    }
  }]);

  return TabItem;
}(_react.Component);

TabItem.propTypes = {
  name: _propTypes2.default.string.isRequired,
  extraClass: _propTypes2.default.string,
  tabClassName: _propTypes2.default.string
};

TabItem.defaultProps = {
  className: '',
  extraClass: ''
};

TabItem.contextTypes = {
  activeTabId: _propTypes2.default.string
};

exports.default = TabItem;

/***/ }),

/***/ "./client/src/components/Tabs/Tabs.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Component = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _reactstrap = __webpack_require__(6);

var _classnames2 = __webpack_require__(4);

var _classnames3 = _interopRequireDefault(_classnames2);

var _propTypes = __webpack_require__(1);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactRedux = __webpack_require__(5);

var _TabsActions = __webpack_require__(54);

var Actions = _interopRequireWildcard(_TabsActions);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Tabs = function (_Component) {
  _inherits(Tabs, _Component);

  function Tabs(props) {
    _classCallCheck(this, Tabs);

    var _this = _possibleConstructorReturn(this, (Tabs.__proto__ || Object.getPrototypeOf(Tabs)).call(this, props));

    _this.toggle = _this.toggle.bind(_this);
    _this.renderTab = _this.renderTab.bind(_this);
    return _this;
  }

  _createClass(Tabs, [{
    key: 'getContainerProps',
    value: function getContainerProps() {
      var _props = this.props,
          className = _props.className,
          extraClass = _props.extraClass,
          id = _props.id;


      return {
        className: (0, _classnames3.default)([className, extraClass]),
        id: id
      };
    }
  }, {
    key: 'getDefaultActiveKey',
    value: function getDefaultActiveKey() {
      var _this2 = this;

      var active = null;

      if (typeof this.props.defaultActiveKey === 'string') {
        var activeChild = _react2.default.Children.toArray(this.props.children).find(function (child) {
          return child.props.name === _this2.props.defaultActiveKey;
        });

        if (activeChild) {
          active = activeChild.props.name;
        }
      }

      if (typeof active !== 'string') {
        _react2.default.Children.forEach(this.props.children, function (child) {
          if (typeof active !== 'string') {
            active = child.props.name;
          }
        });
      }

      return active;
    }
  }, {
    key: 'toggle',
    value: function toggle(activeTab) {
      if (this.props.activeTab !== activeTab) {
        this.props.activateTab(activeTab);
      }
    }
  }, {
    key: 'renderTab',
    value: function renderTab(child) {
      var _this3 = this;

      if (child.props.title === null) {
        return null;
      }

      var currentTab = this.props.activeTab || this.getDefaultActiveKey();

      var classNames = (0, _classnames3.default)(_defineProperty({
        active: currentTab === child.props.name
      }, child.props.tabClassName, child.props.tabClassName));

      return _react2.default.createElement(
        _reactstrap.NavItem,
        null,
        _react2.default.createElement(
          _reactstrap.NavLink,
          {
            onClick: function onClick() {
              return _this3.toggle(child.props.name);
            },
            disabled: child.props.disabled,
            className: classNames
          },
          child.props.title
        )
      );
    }
  }, {
    key: 'renderNav',
    value: function renderNav() {
      var tabs = _react2.default.Children.map(this.props.children, this.renderTab);

      if (tabs.length <= 1) {
        return null;
      }

      return _react2.default.createElement(
        _reactstrap.Nav,
        { tabs: true, role: 'tablist' },
        tabs
      );
    }
  }, {
    key: 'render',
    value: function render() {
      var _props2 = this.props,
          hideNav = _props2.hideNav,
          children = _props2.children,
          activeTab = _props2.activeTab;


      var containerProps = this.getContainerProps();
      var nav = hideNav ? null : this.renderNav();

      return _react2.default.createElement(
        'div',
        containerProps,
        _react2.default.createElement(
          'div',
          { className: 'wrapper' },
          nav,
          _react2.default.createElement(
            _reactstrap.TabContent,
            { activeTab: activeTab || this.getDefaultActiveKey() },
            children
          )
        )
      );
    }
  }]);

  return Tabs;
}(_react.Component);

Tabs.propTypes = {
  id: _propTypes2.default.string.isRequired,
  defaultActiveKey: _propTypes2.default.string,
  extraClass: _propTypes2.default.string,
  hideNav: _propTypes2.default.bool,
  activateTab: _propTypes2.default.func,
  activeTab: _propTypes2.default.string
};

Tabs.defaultProps = {
  className: '',
  extraClass: '',
  hideNav: false
};

exports.Component = Tabs;


var createFieldID = function createFieldID(props) {
  return props.formid + '__' + props.id;
};

function mapStateToProps(state, ownProps) {
  var fieldID = createFieldID(ownProps);
  var field = state.tabs.fields[fieldID] ? state.tabs.fields[fieldID] : {
    activeTab: null
  };

  return _extends({}, field);
}

function mapDispatchToProps(dispatch, ownProps) {
  var fieldID = createFieldID(ownProps);
  return {
    activateTab: function activateTab(activeTab) {
      dispatch(Actions.activateTab(fieldID, activeTab));
    }
  };
}

exports.default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(Tabs);

/***/ }),

/***/ "./client/src/components/Tag/SummaryTag.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _Tag = __webpack_require__(24);

var _Tag2 = _interopRequireDefault(_Tag);

var _i18n = __webpack_require__(3);

var _i18n2 = _interopRequireDefault(_i18n);

var _propTypes = __webpack_require__(1);

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var SummaryTag = function SummaryTag(_ref) {
  var label = _ref.label,
      count = _ref.count,
      props = _objectWithoutProperties(_ref, ['label', 'count']);

  return _react2.default.createElement(
    _Tag2.default,
    _extends({}, props, { deletable: false, title: count + ' ' + label }),
    count,
    ' ',
    _react2.default.createElement('span', { className: 'font-icon-sliders', 'aria-label': label })
  );
};

SummaryTag.propTypes = Object.assign({}, _Tag2.default.propTypes, {
  label: _propTypes2.default.string,
  count: _propTypes2.default.number
});

SummaryTag.defaultProps = {
  label: _i18n2.default._t('Admin.SUMMARY_TAG_LABEL', 'filters')
};

exports.default = SummaryTag;

/***/ }),

/***/ "./client/src/components/Tag/TagPropType.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _propTypes = __webpack_require__(1);

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TagPropType = _propTypes2.default.shape({
  key: _propTypes2.default.string.required,
  label: _propTypes2.default.string,
  value: _propTypes2.default.string
});

exports.default = TagPropType;

/***/ }),

/***/ "./client/src/components/TextField/TextField.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Component = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _FieldHolder = __webpack_require__(8);

var _FieldHolder2 = _interopRequireDefault(_FieldHolder);

var _InputField2 = __webpack_require__("./client/src/components/InputField/InputField.js");

var _InputField3 = _interopRequireDefault(_InputField2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TextField = function (_InputField) {
  _inherits(TextField, _InputField);

  function TextField() {
    _classCallCheck(this, TextField);

    return _possibleConstructorReturn(this, (TextField.__proto__ || Object.getPrototypeOf(TextField)).apply(this, arguments));
  }

  _createClass(TextField, [{
    key: 'getInputProps',
    value: function getInputProps() {
      var props = _get(TextField.prototype.__proto__ || Object.getPrototypeOf(TextField.prototype), 'getInputProps', this).call(this);

      if (this.isMultiline()) {
        Object.assign(props, {
          type: 'textarea',
          rows: this.props.data.rows,
          cols: this.props.data.columns
        });
      }

      return props;
    }
  }, {
    key: 'isMultiline',
    value: function isMultiline() {
      return this.props.data && this.props.data.rows > 1;
    }
  }]);

  return TextField;
}(_InputField3.default);

exports.Component = TextField;
exports.default = (0, _FieldHolder2.default)(TextField);

/***/ }),

/***/ "./client/src/components/TimeField/TimeField.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Component = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _FieldHolder = __webpack_require__(8);

var _FieldHolder2 = _interopRequireDefault(_FieldHolder);

var _DateField2 = __webpack_require__("./client/src/components/DateField/DateField.js");

var _moment = __webpack_require__(14);

var _moment2 = _interopRequireDefault(_moment);

var _modernizr = __webpack_require__(21);

var _modernizr2 = _interopRequireDefault(_modernizr);

var _i18n = __webpack_require__(3);

var _i18n2 = _interopRequireDefault(_i18n);

var _propTypes = __webpack_require__(1);

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var localFormat = 'LT';

var TimeField = function (_DateField) {
  _inherits(TimeField, _DateField);

  function TimeField() {
    _classCallCheck(this, TimeField);

    return _possibleConstructorReturn(this, (TimeField.__proto__ || Object.getPrototypeOf(TimeField)).apply(this, arguments));
  }

  _createClass(TimeField, [{
    key: 'getInputProps',
    value: function getInputProps() {
      var placeholder = _i18n2.default.inject(_i18n2.default._t('Admin.FormatExample', 'Example: {format}'), { format: (0, _moment2.default)().endOf('month').format(localFormat) });
      var type = this.asHTML5() ? 'time' : 'text';
      return _extends({}, _get(TimeField.prototype.__proto__ || Object.getPrototypeOf(TimeField.prototype), 'getInputProps', this).call(this), {
        type: type,
        placeholder: placeholder
      });
    }
  }, {
    key: 'isMultiline',
    value: function isMultiline() {
      return false;
    }
  }, {
    key: 'hasNativeSupport',
    value: function hasNativeSupport() {
      return this.props.modernizr.inputtypes.time;
    }
  }, {
    key: 'convertToLocalised',
    value: function convertToLocalised(isoTime) {
      var localTime = '';
      if (isoTime) {
        var timeObject = (0, _moment2.default)(isoTime, 'HH:mm:ss');
        if (timeObject.isValid()) {
          localTime = timeObject.format(localFormat);
        }
      }
      return localTime;
    }
  }, {
    key: 'convertToIso',
    value: function convertToIso(localTime) {
      var isoTime = '';
      if (localTime) {
        var timeObject = (0, _moment2.default)(localTime, localFormat);
        if (timeObject.isValid()) {
          isoTime = timeObject.format('HH:mm:ss');
        }
      }
      return isoTime;
    }
  }]);

  return TimeField;
}(_DateField2.Component);

TimeField.propTypes = {
  lang: _propTypes2.default.string,
  modernizr: _propTypes2.default.object,
  data: _propTypes2.default.shape({
    html5: _propTypes2.default.boolean
  })
};

TimeField.defaultProps = {
  modernizr: _modernizr2.default,
  data: {}
};

exports.Component = TimeField;
exports.default = (0, _FieldHolder2.default)(TimeField);

/***/ }),

/***/ "./client/src/components/TreeDropdownField/TreeDropdownFieldMenu.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(1);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _i18n = __webpack_require__(3);

var _i18n2 = _interopRequireDefault(_i18n);

var _classnames = __webpack_require__(4);

var _classnames2 = _interopRequireDefault(_classnames);

var _TreeDropdownFieldNode = __webpack_require__("./client/src/components/TreeDropdownField/TreeDropdownFieldNode.js");

var _TreeDropdownFieldNode2 = _interopRequireDefault(_TreeDropdownFieldNode);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TreeDropdownFieldMenu = function (_Component) {
  _inherits(TreeDropdownFieldMenu, _Component);

  function TreeDropdownFieldMenu(props) {
    _classCallCheck(this, TreeDropdownFieldMenu);

    var _this = _possibleConstructorReturn(this, (TreeDropdownFieldMenu.__proto__ || Object.getPrototypeOf(TreeDropdownFieldMenu)).call(this, props));

    _this.render = _this.render.bind(_this);
    _this.renderOption = _this.renderOption.bind(_this);
    _this.renderBreadcrumbs = _this.renderBreadcrumbs.bind(_this);
    _this.handleBack = _this.handleBack.bind(_this);
    return _this;
  }

  _createClass(TreeDropdownFieldMenu, [{
    key: 'handleBack',
    value: function handleBack(event) {
      if (typeof this.props.onBack === 'function') {
        this.props.onBack(event);
      } else {
        event.stopPropagation();
        event.preventDefault();
      }
    }
  }, {
    key: 'renderBreadcrumbs',
    value: function renderBreadcrumbs() {
      if (this.props.breadcrumbs.length === 0) {
        return null;
      }

      var breadcrumbs = this.props.breadcrumbs.map(function (item) {
        return item.title;
      }).join(' / ');
      var icon = this.props.search ? 'font-icon-search' : 'font-icon-left-open-big';
      var button = _react2.default.createElement(
        'button',
        { className: 'treedropdownfield__breadcrumbs-button' },
        _react2.default.createElement('span', { className: 'icon ' + icon })
      );

      return _react2.default.createElement(
        'div',
        {
          className: 'Select-option treedropdownfield__breadcrumbs flexbox-area-grow fill-width',
          onClick: this.handleBack,
          role: 'button',
          tabIndex: 0
        },
        button,
        _react2.default.createElement(
          'span',
          { className: 'treedropdownfield__breadcrumbs-crumbs flexbox-area-grow' },
          breadcrumbs
        )
      );
    }
  }, {
    key: 'renderOption',
    value: function renderOption(tree, index) {
      if (!this.props.renderMenuOptions) {
        return null;
      }
      var _props$renderMenuOpti = this.props.renderMenuOptions,
          focusedOption = _props$renderMenuOpti.focusedOption,
          instancePrefix = _props$renderMenuOpti.instancePrefix,
          onFocus = _props$renderMenuOpti.onFocus,
          onSelect = _props$renderMenuOpti.onSelect,
          optionClassName = _props$renderMenuOpti.optionClassName,
          optionComponent = _props$renderMenuOpti.optionComponent,
          optionRenderer = _props$renderMenuOpti.optionRenderer,
          onOptionRef = _props$renderMenuOpti.onOptionRef;

      var Option = optionComponent;
      var value = this.props.value;

      var isSelected = value === tree.id;
      if (Array.isArray(value)) {
        isSelected = value.includes(tree.id);
      }
      var isFocused = focusedOption && tree.id === focusedOption.id;
      var optionClass = (0, _classnames2.default)(optionClassName, {
        treedropdownfield__option: true,
        'Select-option': true,
        'is-selected': isSelected,
        'is-focused': isFocused,
        'is-disabled': tree.disabled
      });

      return _react2.default.createElement(
        Option,
        {
          className: optionClass,
          instancePrefix: instancePrefix,
          isDisabled: tree.disabled,
          isFocused: isFocused,
          isSelected: isSelected,
          key: 'option-' + tree.id + '-' + index,
          onFocus: onFocus,
          onSelect: onSelect,
          option: tree,
          optionIndex: index,
          ref: function ref(_ref) {
            onOptionRef(_ref, isFocused);
          }
        },
        optionRenderer(tree, index)
      );
    }
  }, {
    key: 'render',
    value: function render() {
      var classes = (0, _classnames2.default)([this.props.className, 'treedropdownfield__menu']);

      if (this.props.loading) {
        return _react2.default.createElement(
          'div',
          { className: classes },
          _react2.default.createElement(
            'div',
            { className: 'Select-option flexbox-area-grow fill-width' },
            _react2.default.createElement(
              'span',
              { className: 'Select-loading-zone', 'aria-hidden': 'true' },
              _react2.default.createElement('span', { className: 'Select-loading' })
            ),
            _react2.default.createElement(
              'span',
              { className: 'treedropdownfield__menu-loading flexbox-area-grow' },
              _i18n2.default._t('Admin.TREEDROPDOWN_LOADING', 'Loading...')
            )
          )
        );
      }
      if (this.props.failed) {
        return _react2.default.createElement(
          'div',
          { className: classes },
          _react2.default.createElement(
            'div',
            { className: 'Select-option' },
            _i18n2.default._t('Admin.TREEDROPDOWN_FAILED', 'Failed to load')
          )
        );
      }
      if (this.props.tree.count === 0) {
        return _react2.default.createElement(
          'div',
          { className: classes },
          _react2.default.createElement(
            'div',
            { className: 'Select-option' },
            _i18n2.default._t('Admin.TREEDROPDOWN_NO_CHILDREN', 'No children')
          )
        );
      }

      var breadcrumbs = this.renderBreadcrumbs();
      var options = this.props.renderMenuOptions && this.props.renderMenuOptions.options;

      var children = options ? options.filter(function (option) {
        return option.title !== null;
      }).map(this.renderOption) : null;

      return _react2.default.createElement(
        'div',
        { className: classes },
        breadcrumbs,
        children
      );
    }
  }]);

  return TreeDropdownFieldMenu;
}(_react.Component);

TreeDropdownFieldMenu.propTypes = {
  className: _propTypes2.default.string,
  breadcrumbs: _propTypes2.default.arrayOf(_propTypes2.default.shape(_TreeDropdownFieldNode2.default.propTypes)),
  loading: _propTypes2.default.bool,
  failed: _propTypes2.default.bool,
  tree: _propTypes2.default.shape(_TreeDropdownFieldNode2.default.propTypes),
  renderMenuOptions: _propTypes2.default.object,
  onBack: _propTypes2.default.func,
  search: _propTypes2.default.bool,
  value: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.number, _propTypes2.default.array])
};

exports.default = TreeDropdownFieldMenu;

/***/ }),

/***/ "./client/src/components/TreeDropdownField/TreeDropdownFieldNode.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _propTypes = __webpack_require__(1);

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TreeDropdownFieldNode = function TreeDropdownFieldNode() {
  return null;
};

TreeDropdownFieldNode.propTypes = {
  id: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.number]),
  title: _propTypes2.default.string,
  titlePath: _propTypes2.default.string,
  disabled: _propTypes2.default.bool,
  parentid: _propTypes2.default.number,
  count: _propTypes2.default.number,
  depth: _propTypes2.default.number,
  expanded: _propTypes2.default.bool,
  limited: _propTypes2.default.bool,
  marked: _propTypes2.default.bool,
  opened: _propTypes2.default.bool,
  children: _propTypes2.default.array
};

exports.default = TreeDropdownFieldNode;

/***/ }),

/***/ "./client/src/components/TreeDropdownField/treeUtils.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var findTreeByPath = exports.findTreeByPath = function findTreeByPath(tree, path) {
  if (!tree || Object.keys(tree).length === 0) {
    return null;
  }

  if (path.length === 0) {
    return tree;
  }
  var subPath = path.slice(0);
  var nextID = subPath.shift();
  var subTree = tree.children.find(function (nextSubTree) {
    return nextSubTree.id === nextID;
  });

  if (subTree) {
    return findTreeByPath(subTree, subPath);
  }

  return null;
};

var findTreeByID = function findTreeByID(tree, id) {
  if (!id || !tree || !tree.children || Object.keys(tree).length === 0) {
    return null;
  }

  if (tree.id === id) {
    return tree;
  }
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = tree.children[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var child = _step.value;

      var found = findTreeByID(child, id);
      if (found !== null) {
        return found;
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return null;
};

var findTreePath = exports.findTreePath = function findTreePath(tree, id) {
  if (!id) {
    return [];
  }

  if (!tree || Object.keys(tree).length === 0) {
    return null;
  }

  if (tree.id === id) {
    return [tree.id];
  }
  if (!tree.children) {
    return null;
  }
  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = tree.children[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var child = _step2.value;

      var childPath = findTreePath(child, id);

      if (childPath !== null) {
        if (tree.id) {
          childPath.unshift(tree.id);
        }
        return childPath;
      }
    }
  } catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion2 && _iterator2.return) {
        _iterator2.return();
      }
    } finally {
      if (_didIteratorError2) {
        throw _iteratorError2;
      }
    }
  }

  return null;
};

/***/ }),

/***/ "./client/src/components/UsedOnTable/UsedOnTable.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Component = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(1);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _classnames = __webpack_require__(4);

var _classnames2 = _interopRequireDefault(_classnames);

var _i18n = __webpack_require__(3);

var _i18n2 = _interopRequireDefault(_i18n);

var _provideUsedOnData = __webpack_require__("./client/src/components/UsedOnTable/provideUsedOnData.js");

var _provideUsedOnData2 = _interopRequireDefault(_provideUsedOnData);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var UsedOnTable = function (_PureComponent) {
  _inherits(UsedOnTable, _PureComponent);

  function UsedOnTable() {
    _classCallCheck(this, UsedOnTable);

    return _possibleConstructorReturn(this, (UsedOnTable.__proto__ || Object.getPrototypeOf(UsedOnTable)).apply(this, arguments));
  }

  _createClass(UsedOnTable, [{
    key: 'renderHeader',
    value: function renderHeader() {
      return _react2.default.createElement(
        'thead',
        null,
        _react2.default.createElement(
          'tr',
          null,
          _react2.default.createElement(
            'th',
            { className: 'used-on__col--index' },
            '#'
          ),
          _react2.default.createElement(
            'th',
            { className: 'used-on__col--title' },
            _i18n2.default._t('Admin.USED_ON', 'Used on')
          ),
          _react2.default.createElement(
            'th',
            { className: 'used-on__col--type' },
            _i18n2.default._t('Admin.TYPE', 'Type')
          )
        )
      );
    }
  }, {
    key: 'renderBody',
    value: function renderBody() {
      var _props = this.props,
          usedOn = _props.usedOn,
          loading = _props.loading,
          error = _props.error;


      if (error || !usedOn || !usedOn.length) {
        var message = null;
        var classState = null;

        if (error) {
          message = _i18n2.default.inject(_i18n2.default._t('Admin.LOADING_ERROR', 'As error occured when loading the data: {message}'), { message: error });
          classState = 'error';
        } else if (loading) {
          message = _i18n2.default._t('Admin.LOADING', 'Loading...');
          classState = 'loading';
        } else {
          message = _i18n2.default._t('Admin.NOT_USED', 'This is not used anywhere');
          classState = 'empty';
        }

        var className = (0, _classnames2.default)(['used-on__message', 'used-on__message--' + classState]);

        return _react2.default.createElement(
          'tbody',
          null,
          _react2.default.createElement(
            'tr',
            null,
            _react2.default.createElement(
              'td',
              { className: className, colSpan: '3' },
              message
            )
          )
        );
      }

      return _react2.default.createElement(
        'tbody',
        null,
        usedOn.map(this.renderRow)
      );
    }
  }, {
    key: 'renderRow',
    value: function renderRow(data, index) {
      var id = data.id,
          title = data.title,
          type = data.type,
          state = data.state,
          link = data.link;


      var badge = state ? _react2.default.createElement(
        'span',
        { className: (0, _classnames2.default)('badge', 'used-on__badge', 'status-' + state) },
        state
      ) : null;

      var titleLabel = link ? _react2.default.createElement(
        'a',
        { className: 'used-on__edit-link', href: link },
        title,
        ' ',
        badge
      ) : _react2.default.createElement(
        'span',
        null,
        title,
        ' ',
        badge
      );

      return _react2.default.createElement(
        'tr',
        { key: id },
        _react2.default.createElement(
          'td',
          { className: 'used-on__col--index' },
          index + 1
        ),
        _react2.default.createElement(
          'td',
          { className: 'used-on__col--title' },
          titleLabel
        ),
        _react2.default.createElement(
          'td',
          { className: 'used-on__col--type' },
          type
        )
      );
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'table',
        { className: 'table' },
        this.renderHeader(),
        this.renderBody()
      );
    }
  }]);

  return UsedOnTable;
}(_react.PureComponent);

UsedOnTable.propTypes = {
  loading: _propTypes2.default.bool,
  usedOn: _propTypes2.default.arrayOf(_propTypes2.default.shape({
    id: _propTypes2.default.string,
    title: _propTypes2.default.string,
    type: _propTypes2.default.string,
    state: _propTypes2.default.string,
    link: _propTypes2.default.string
  })),
  error: _propTypes2.default.string
};

exports.Component = UsedOnTable;
exports.default = (0, _provideUsedOnData2.default)(UsedOnTable);

/***/ }),

/***/ "./client/src/components/UsedOnTable/provideUsedOnData.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(1);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactRedux = __webpack_require__(5);

var _usedOnActions = __webpack_require__("./client/src/state/usedOn/usedOnActions.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var provideUsedOnData = function provideUsedOnData(UsedOnTable) {
  var UsedOnDataProvider = function (_Component) {
    _inherits(UsedOnDataProvider, _Component);

    function UsedOnDataProvider() {
      _classCallCheck(this, UsedOnDataProvider);

      return _possibleConstructorReturn(this, (UsedOnDataProvider.__proto__ || Object.getPrototypeOf(UsedOnDataProvider)).apply(this, arguments));
    }

    _createClass(UsedOnDataProvider, [{
      key: 'componentDidMount',
      value: function componentDidMount() {
        this.loadUsedOn();
      }
    }, {
      key: 'componentWillReceiveProps',
      value: function componentWillReceiveProps(nextProps) {
        if (nextProps.identifier !== this.props.identifier) {
          this.loadUsedOn(nextProps);
        }
      }
    }, {
      key: 'loadUsedOn',
      value: function loadUsedOn() {
        var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.props;

        var _ref = props.data.readUsageEndpoint || {},
            method = _ref.method,
            url = _ref.url;

        props.loadUsedOn(props.identifier, method, url);
      }
    }, {
      key: 'render',
      value: function render() {
        return _react2.default.createElement(UsedOnTable, this.props);
      }
    }]);

    return UsedOnDataProvider;
  }(_react.Component);

  UsedOnDataProvider.propTypes = {
    identifier: _propTypes2.default.string,
    loading: _propTypes2.default.bool,
    data: _propTypes2.default.oneOfType([_propTypes2.default.array, _propTypes2.default.shape({
      recordClass: _propTypes2.default.string,
      recordId: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.number]),
      readUsageEndpoint: _propTypes2.default.shape({
        url: _propTypes2.default.string,
        method: _propTypes2.default.string
      })
    })]),
    usedOn: _propTypes2.default.array
  };

  var mapStateToProps = function mapStateToProps(state, props) {
    var _props$data = props.data,
        recordClass = _props$data.recordClass,
        recordId = _props$data.recordId;


    var identifier = recordClass && recordId ? recordClass + '#' + recordId : '';
    var usedState = state.usedOn;
    var loading = usedState.loading.includes(identifier);
    var usedOn = usedState.usedOn[identifier] || null;
    var error = usedState.errors[identifier] || null;

    return {
      identifier: identifier,
      loading: loading,
      usedOn: usedOn,
      error: error
    };
  };

  var connectedUsedOnDataProvider = (0, _reactRedux.connect)(mapStateToProps, { loadUsedOn: _usedOnActions.loadUsedOn })(UsedOnDataProvider);
  connectedUsedOnDataProvider.Component = UsedOnDataProvider;

  return connectedUsedOnDataProvider;
};

exports.default = provideUsedOnData;

/***/ }),

/***/ "./client/src/containers/App/App.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _Injector = __webpack_require__(9);

var _reactRouterConfig = __webpack_require__("./node_modules/react-router-config/esm/react-router-config.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var App = function App(_ref) {
  var route = _ref.route;
  return _react2.default.createElement(
    'div',
    { className: 'app' },
    (0, _reactRouterConfig.renderRoutes)(route.routes())
  );
};

exports.default = (0, _Injector.provideInjector)(App);

/***/ }),

/***/ "./client/src/containers/Form/Form.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _reduxForm = __webpack_require__(12);

var _Injector = __webpack_require__(9);

var _getFormState = __webpack_require__(17);

var _getFormState2 = _interopRequireDefault(_getFormState);

var _propTypes = __webpack_require__(1);

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var InjectableForm = function InjectableForm(props) {
  var FormComponent = props.formComponent;
  var newProps = _extends({}, props);
  delete newProps.formComponent;

  return _react2.default.createElement(FormComponent, newProps);
};

InjectableForm.propTypes = {
  formComponent: _propTypes2.default.func.isRequired
};

var InjectedForm = (0, _Injector.inject)(['Form'], function (formComponent) {
  return { formComponent: formComponent };
})(InjectableForm);

exports.default = (0, _reduxForm.reduxForm)({
  getFormState: _getFormState2.default,
  destroyOnUnmount: false
})(InjectedForm);

/***/ }),

/***/ "./client/src/i18n.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var i18n = function () {
  function i18n() {
    _classCallCheck(this, i18n);

    this.defaultLocale = 'en_US';
    this.currentLocale = this.detectLocale();
    this.lang = {};
  }

  _createClass(i18n, [{
    key: 'setLocale',
    value: function setLocale(locale) {
      this.currentLocale = locale;
    }
  }, {
    key: 'getLocale',
    value: function getLocale() {
      return this.currentLocale !== null ? this.currentLocale : this.defaultLocale;
    }
  }, {
    key: '_t',
    value: function _t(entity, fallbackString, priority, context) {
      var fallback = fallbackString || '';

      if (!this.lang) {
        return fallback;
      }
      var locale = this.getLocale();
      var search = [locale, locale.replace(/_[\w]+/i, ''), this.defaultLocale, this.defaultLocale.replace(/_[\w]+/i, '')];

      for (var i = 0; i < search.length; i++) {
        var lang = search[i];
        if (this.lang[lang] && this.lang[lang][entity]) {
          return this.lang[lang][entity];
        }
      }

      return fallback;
    }
  }, {
    key: 'addDictionary',
    value: function addDictionary(locale, dict) {
      if (typeof this.lang[locale] === 'undefined') {
        this.lang[locale] = {};
      }

      for (var entity in dict) {
        this.lang[locale][entity] = dict[entity];
      }
    }
  }, {
    key: 'getDictionary',
    value: function getDictionary(locale) {
      return this.lang[locale];
    }
  }, {
    key: 'stripStr',
    value: function stripStr(str) {
      return str.replace(/^\s*/, '').replace(/\s*$/, '');
    }
  }, {
    key: 'stripStrML',
    value: function stripStrML(str) {
      var parts = str.split('\n');

      for (var i = 0; i < parts.length; i += 1) {
        parts[i] = stripStr(parts[i]);
      }

      return stripStr(parts.join(' '));
    }
  }, {
    key: 'sprintf',
    value: function sprintf(s) {
      for (var _len = arguments.length, params = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        params[_key - 1] = arguments[_key];
      }

      if (params.length === 0) {
        return s;
      }

      var regx = new RegExp('(.?)(%s)', 'g');

      var i = 0;

      return s.replace(regx, function (match, subMatch1, subMatch2, offset, string) {
        if (subMatch1 === '%') {
          return match;
        }

        return subMatch1 + params[i++];
      });
    }
  }, {
    key: 'inject',
    value: function inject(s, map) {
      var regx = new RegExp('\{([A-Za-z0-9_]*)\}', 'g');

      return s.replace(regx, function (match, key, offset, string) {
        return map[key] ? map[key] : match;
      });
    }
  }, {
    key: 'detectLocale',
    value: function detectLocale() {
      var rawLocale = document.documentElement.getAttribute('lang');

      if (!rawLocale) {
        rawLocale = document.body.getAttribute('lang');
      }

      if (!rawLocale) {
        var metas = document.getElementsByTagName('meta');
        for (var i = 0; i < metas.length; i++) {
          if (metas[i].attributes['http-equiv'] && metas[i].attributes['http-equiv'].nodeValue.toLowerCase() === 'content-language') {
            rawLocale = metas[i].attributes['content'].nodeValue;
          }
        }
      }

      if (!rawLocale) {
        rawLocale = this.defaultLocale;
      }

      var detectedLocale = null;
      if (rawLocale.length === 2) {
        for (var compareLocale in i18n.lang) {
          if (compareLocale.substr(0, 2).toLowerCase() === rawLocale.toLowerCase()) {
            return compareLocale;
          }
        }
      }

      var rawLocaleParts = rawLocale.match(/([^-|_]*)[-|_](.*)/);
      if (rawLocaleParts) {
        return rawLocaleParts[1].toLowerCase() + '_' + rawLocaleParts[2].toUpperCase();
      }

      return null;
    }
  }, {
    key: 'addEvent',
    value: function addEvent(obj, evType, fn, useCapture) {
      if (obj.addEventListener) {
        obj.addEventListener(evType, fn, useCapture);
        return true;
      } else if (obj.attachEvent) {
        return obj.attachEvent('on' + evType, fn);
      } else {
        console.log('Handler could not be attached');
      }
    }
  }]);

  return i18n;
}();

var _i18n = new i18n();

window.ss = typeof window.ss !== 'undefined' ? window.ss : {};
window.ss.i18n = window.i18n = _i18n;

exports.default = _i18n;

/***/ }),

/***/ "./client/src/legacy/AddToCampaignForm.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _i18n = __webpack_require__(3);

var _i18n2 = _interopRequireDefault(_i18n);

var _jquery = __webpack_require__(2);

var _jquery2 = _interopRequireDefault(_jquery);

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _reactDom = __webpack_require__(10);

var _reactDom2 = _interopRequireDefault(_reactDom);

var _Injector = __webpack_require__(9);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var FormBuilderModal = (0, _Injector.loadComponent)('FormBuilderModal');

_jquery2.default.entwine('ss', function ($) {
  $('.cms-content-actions .add-to-campaign-action,' + '#add-to-campaign__action').entwine({
    onclick: function onclick() {
      var dialog = $('#add-to-campaign__dialog-wrapper');

      if (!dialog.length) {
        dialog = $('<div id="add-to-campaign__dialog-wrapper" />');
        $('body').append(dialog);
      }

      dialog.open();

      return false;
    }
  });

  $('.add-to-campaign-modal .add-to-campaign-modal__nav-link').entwine({
    onclick: function onclick(e) {
      e.preventDefault();
      var $link = $(e.target);
      window.location = $link.attr('href');
    }
  });

  $('#add-to-campaign__dialog-wrapper').entwine({
    onunmatch: function onunmatch() {
      this._clearModal();
    },
    open: function open() {
      this._renderModal(true);
    },
    close: function close() {
      this._renderModal(false);
    },
    _renderModal: function _renderModal(isOpen) {
      var _this = this;

      var handleHide = function handleHide() {
        return _this.close();
      };
      var handleSubmit = function handleSubmit() {
        return _this._handleSubmitModal.apply(_this, arguments);
      };
      var id = $('form.cms-edit-form :input[name=ID]').val();
      var sectionConfigKey = 'SilverStripe\\CMS\\Controllers\\CMSPageEditController';
      var store = window.ss.store;
      var sectionConfig = store.getState().config.sections.find(function (section) {
        return section.name === sectionConfigKey;
      });
      var modalSchemaUrl = sectionConfig.form.AddToCampaignForm.schemaUrl + '/' + id;
      var title = _i18n2.default._t('Admin.ADD_TO_CAMPAIGN', 'Add to campaign');

      _reactDom2.default.render(_react2.default.createElement(FormBuilderModal, {
        title: title,
        isOpen: isOpen,
        onSubmit: handleSubmit,
        onClosed: handleHide,
        schemaUrl: modalSchemaUrl,
        bodyClassName: 'modal__dialog',
        className: 'add-to-campaign-modal',
        responseClassBad: 'modal__response modal__response--error',
        responseClassGood: 'modal__response modal__response--good',
        identifier: 'Admin.AddToCampaign'
      }), this[0]);
    },
    _clearModal: function _clearModal() {
      _reactDom2.default.unmountComponentAtNode(this[0]);
    },
    _handleSubmitModal: function _handleSubmitModal(data, action, submitFn) {
      return submitFn();
    }
  });
});

/***/ }),

/***/ "./client/src/legacy/ConfirmedPasswordField.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _jquery = __webpack_require__(2);

var _jquery2 = _interopRequireDefault(_jquery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _jquery2.default)(document).on('click', '.confirmedpassword .showOnClick a', function () {
  var $container = (0, _jquery2.default)('.showOnClickContainer', (0, _jquery2.default)(this).parent());

  $container.toggle('fast', function () {
    $container.toggleClass('d-none').find('input[type="hidden"]').val($container.hasClass('d-none') ? 0 : 1);
  });

  return false;
});

/***/ }),

/***/ "./client/src/legacy/DateField.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _jquery = __webpack_require__(2);

var _jquery2 = _interopRequireDefault(_jquery);

var _i18n = __webpack_require__(3);

var _i18n2 = _interopRequireDefault(_i18n);

var _moment = __webpack_require__(14);

var _moment2 = _interopRequireDefault(_moment);

var _modernizr = __webpack_require__(21);

var _modernizr2 = _interopRequireDefault(_modernizr);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

__webpack_require__("./thirdparty/jquery-entwine/dist/jquery.entwine-dist.js");

_jquery2.default.entwine('ss', function ($) {
  $('input[type=date]').entwine({
    onadd: function onadd() {
      if (_modernizr2.default.inputtypes.date) {
        return;
      }

      if (this.prop('disabled') || this.prop('readonly') || this.hasClass('hasDatepicker')) {
        return;
      }

      var hiddenInput = $('<input/>', { type: 'hidden', name: this.attr('name'), value: this.val() });
      this.parent().append(hiddenInput);

      this.removeAttr('name');

      _moment2.default.locale(this.attr('lang'));
      var isoDate = this.val();
      var localDate = '';
      if (isoDate) {
        var dateObject = (0, _moment2.default)(isoDate);
        if (dateObject.isValid()) {
          localDate = dateObject.format('L');
        }
      }
      this.val(localDate);

      var placeholder = _i18n2.default.inject(_i18n2.default._t('Admin.FormatExample', 'Example: {format}'), { format: (0, _moment2.default)().endOf('month').format('L') });
      this.attr('placeholder', placeholder);

      this.updateValue();
    },
    onchange: function onchange() {
      this.updateValue();
    },
    updateValue: function updateValue() {
      var localDate = this.val();
      var isoDate = '';
      if (localDate) {
        var _arr = ['L', 'YYYY-MM-DD'];

        for (var _i = 0; _i < _arr.length; _i++) {
          var format = _arr[_i];
          var dateObject = (0, _moment2.default)(localDate, format);
          if (dateObject.isValid()) {
            isoDate = dateObject.format('YYYY-MM-DD');
            break;
          }
        }
      }
      this.parent().find('input[type=hidden]').val(isoDate);
    }
  });
});

/***/ }),

/***/ "./client/src/legacy/DatetimeField.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _jquery = __webpack_require__(2);

var _jquery2 = _interopRequireDefault(_jquery);

var _i18n = __webpack_require__(3);

var _i18n2 = _interopRequireDefault(_i18n);

var _moment = __webpack_require__(14);

var _moment2 = _interopRequireDefault(_moment);

var _modernizr = __webpack_require__(21);

var _modernizr2 = _interopRequireDefault(_modernizr);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

__webpack_require__("./thirdparty/jquery-entwine/dist/jquery.entwine-dist.js");

_jquery2.default.entwine('ss', function ($) {
  $('input[type=datetime-local]').entwine({
    onadd: function onadd() {
      if (_modernizr2.default.inputtypes['datetime-local']) {
        return;
      }

      if (this.prop('disabled') || this.prop('readonly') || this.hasClass('hasDatepicker')) {
        return;
      }

      var hiddenInput = $('<input/>', { type: 'hidden', name: this.attr('name'), value: this.val() });
      this.parent().append(hiddenInput);

      this.removeAttr('name');

      _moment2.default.locale(this.attr('lang'));
      var isoDate = this.val();
      var localDate = '';
      if (isoDate) {
        var dateObject = (0, _moment2.default)(isoDate);
        if (dateObject.isValid()) {
          localDate = dateObject.format('L LT');
        }
      }
      this.val(localDate);

      var placeholder = _i18n2.default.inject(_i18n2.default._t('Admin.FormatExample', 'Example: {format}'), { format: (0, _moment2.default)().endOf('month').format('L LT') });
      this.attr('placeholder', placeholder);

      this.updateValue();
    },
    onchange: function onchange() {
      this.updateValue();
    },
    updateValue: function updateValue() {
      var localDate = this.val();
      var isoDate = '';
      if (localDate) {
        var dateObject = (0, _moment2.default)(localDate, ['L LT', _moment2.default.ISO_8601]);
        if (dateObject.isValid()) {
          isoDate = dateObject.format('YYYY-MM-DDTHH:mm:ss');
        }
      }
      this.parent().find('input[type=hidden]').val(isoDate);
    }
  });
});

/***/ }),

/***/ "./client/src/legacy/GridField.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _jquery = __webpack_require__(2);

var _jquery2 = _interopRequireDefault(_jquery);

var _i18n = __webpack_require__(3);

var _i18n2 = _interopRequireDefault(_i18n);

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _reactDom = __webpack_require__(10);

var _reactDom2 = _interopRequireDefault(_reactDom);

var _Search = __webpack_require__("./client/src/components/Search/Search.js");

var _Search2 = _interopRequireDefault(_Search);

var _schemaFieldValues = __webpack_require__(13);

var _Injector = __webpack_require__(9);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

__webpack_require__("./thirdparty/jquery-ui/jquery-ui.js");
__webpack_require__("./thirdparty/jquery-entwine/dist/jquery.entwine-dist.js");

_jquery2.default.entwine('ss', function ($) {
  $('.grid-field').entwine({
    onmatch: function onmatch() {
      if (this.needsColumnFix()) {
        this.fixColumns();
        this.injectSearchButton(false);
      }

      if (this.is('.grid-field--lazy-loadable') && (this.closest('.ss-tabset').length === 0 || this.data('gridfield-lazy-load-state') === 'force')) {
        this.data('gridfield-lazy-load-state', 'ready');
        this.lazyload();
      }

      this.data('gridfield-lazy-load-state', 'ready');
    },

    lazyload: function lazyload() {
      if (this.data('gridfield-lazy-load-state') !== 'ready') {
        this.data('gridfield-lazy-load-state', 'force');
      } else {
        this.removeClass('grid-field--lazy-loadable').addClass('grid-field--lazy-loaded');
        this.reload();
      }
    },

    reload: function reload(ajaxOpts, successCallback) {
      var self = this,
          form = this.closest('form'),
          focusedElName = this.find(':input:focus').attr('name'),
          data = form.find(':input:not(.grid-field__search-holder :input, .relation-search)').serializeArray(),
          tbody = this.find('tbody'),
          colspan = this.find('.grid-field__title-row th').attr('colspan');
      ;

      if (!ajaxOpts) ajaxOpts = {};
      if (!ajaxOpts.data) ajaxOpts.data = [];
      ajaxOpts.data = ajaxOpts.data.concat(data);

      if (window.location.search) {
        ajaxOpts.data = window.location.search.replace(/^\?/, '') + '&' + $.param(ajaxOpts.data);
      }

      tbody.find('tr').remove();
      var loadingCell = $('<td />').addClass('ss-gridfield-item loading').attr('colspan', colspan);
      tbody.append($('<tr />').append(loadingCell));

      var request = $.ajax($.extend({}, {
        headers: { "X-Pjax": 'CurrentField' },
        type: "POST",
        url: this.data('url'),
        dataType: 'html',
        success: function success(data) {
          self.empty().append($(data).children());

          if (focusedElName) self.find(':input[name="' + focusedElName + '"]').focus();

          if (self.find('.grid-field__filter-header, .grid-field__search-holder').length) {
            var visible = ajaxOpts.data[0].filter === "show";
            if (self.needsColumnFix()) {
              self.fixColumns();
            }
            self.injectSearchButton(visible);
          }

          if (successCallback) successCallback.apply(this, arguments);
          self.trigger('reload', self);

          if (ajaxOpts.data[0].triggerChange !== false) {
            self.trigger('change');
          }
        },
        error: function error(e) {
          alert(_i18n2.default._t('Admin.ERRORINTRANSACTION'));
        },
        complete: function complete(request, status) {
          self.find('.loading').removeClass('loading');
        }
      }, ajaxOpts));
    },
    showDetailView: function showDetailView(url) {
      window.location.href = url;
    },
    getItems: function getItems() {
      return this.find('.ss-gridfield-item');
    },

    setState: function setState(k, v) {
      var state = this.getState();
      state[k] = v;
      this.find(':input[name="' + this.data('name') + '[GridState]"]').val(JSON.stringify(state));
    },

    getState: function getState() {
      return JSON.parse(this.find(':input[name="' + this.data('name') + '[GridState]"]').val());
    },

    needsColumnFix: function needsColumnFix() {
      return this.find('.grid-field__filter-header, .grid-field__search-holder').length && !this.find('.grid-field__col-compact').length && !this.find('th.col-Actions').length;
    },

    fixColumns: function fixColumns(visible) {
      this.find('.sortable-header').append('<th class="main col-Actions" />');
      this.find('tbody tr').each(function () {
        var cell = $(this).find('td:last');
        cell.attr('colspan', 2);
      });
      var $extraCell = $('<th class="extra" />');
      $('.grid-field__filter-header th:last .action').each(function () {
        $(this).detach();
        $extraCell.append($(this));
      });
      $('.grid-field__filter-header').append($extraCell);
    },

    injectSearchButton: function injectSearchButton(visible) {
      var hasLegacyFilterHeader = this.find('.grid-field__filter-header').length > 0;
      var content = void 0;
      if (visible) {
        content = '<span class="non-sortable"></span>';
        this.addClass('show-filter').find('.grid-field__filter-header, .grid-field__search-holder').removeClass('grid-field__search-holder--hidden');
        if (!hasLegacyFilterHeader) {
          this.find(':button[name=showFilter]').hide();
        }
      } else {
        content = '<button type="button" title="Open search and filter" name="showFilter" class="btn btn-secondary font-icon-search btn--no-text btn--icon-lg grid-field__filter-open"></button>';
        this.removeClass('show-filter').find('.grid-field__filter-header, .grid-field__search-holder').addClass('grid-field__search-holder--hidden');
      }
      if (hasLegacyFilterHeader) {
        this.find('.sortable-header th:last').html(content);
      }
    }
  });

  $('.grid-field *').entwine({
    getGridField: function getGridField() {
      return this.closest('.grid-field');
    }
  });

  $('.gridfield-actionmenu__container').entwine({
    Timer: null,
    Component: null,
    Actions: null,

    onmatch: function onmatch() {
      this._super();

      var actions = [];

      $('.action-menu--handled', this.parent()).each(function () {
        var action = $(this).detach();
        actions.push(action);
      });

      this.setActions(actions);

      var cmsContent = this.closest('.cms-content').attr('id');
      var context = cmsContent ? { context: cmsContent } : {};

      var GridFieldActions = (0, _Injector.loadComponent)('GridFieldActions', context);
      this.setComponent(GridFieldActions);

      this.refresh();
    },
    onunmatch: function onunmatch() {
      this._super();

      var container = this[0];
      if (container) {
        _reactDom2.default.unmountComponentAtNode(container);
      }

      var actions = this.getActions();
      var actionContainer = this.parent();
      if (actions) {
        $(actions).each(function () {
          $(this).appendTo(actionContainer);
        });
      }
    },
    refresh: function refresh() {
      var schema = this.data('schema');

      var GridFieldActions = this.getComponent();

      _reactDom2.default.render(_react2.default.createElement(GridFieldActions, { schema: schema }), this[0]);
    }
  });

  $('.grid-field :button[name=showFilter]').entwine({
    onclick: function onclick(e) {
      this.closest('.grid-field').find('.grid-field__filter-header, .grid-field__search-holder').removeClass('grid-field__search-holder--hidden').find(':input:first').focus();

      this.closest('.grid-field').addClass('show-filter');
      this.parent().html('<span class="non-sortable"></span>');
      e.preventDefault();
    }
  });

  $('.grid-field .ss-gridfield-item').entwine({
    onclick: function onclick(e) {
      if (e.target.classList.contains('action-menu__toggle')) {
        this._super(e);
        return false;
      }

      if ($(e.target).closest('.action').length) {
        this._super(e);
        return false;
      }

      var formLink = this.find('.edit-link, .view-link');
      if (formLink.length) this.getGridField().showDetailView(formLink.prop('href'));
    },
    onmouseover: function onmouseover() {
      if (this.find('.edit-link, .view-link').length) this.css('cursor', 'pointer');
    },
    onmouseout: function onmouseout() {
      this.css('cursor', 'default');
    }
  });

  $('.grid-field .action.action_import:button').entwine({
    onclick: function onclick(e) {
      e.preventDefault();
      this.openmodal();
    },
    onmatch: function onmatch() {
      this._super();

      if (this.data('state') === 'open') {
        this.openmodal();
      }
    },
    onunmatch: function onunmatch() {
      this._super();
    },

    openmodal: function openmodal() {
      var modal = $(this.data('target'));
      var newModal = $(this.data('modal'));
      if (modal.length < 1) {
        modal = newModal;
        modal.appendTo(document.body);
      } else {
        modal.innerHTML = newModal.innerHTML;
      }

      var backdrop = $('.modal-backdrop');
      if (backdrop.length < 1) {
        backdrop = $('<div class="modal-backdrop fade"></div>');
        backdrop.appendTo(document.body);
      }

      function closeModal() {
        backdrop.removeClass('show');
        modal.removeClass('show');
        setTimeout(function () {
          backdrop.remove();
        }, 150);
      }

      modal.find('[data-dismiss]').add('.modal-backdrop').on('click', function () {
        closeModal();
      });

      $(document).on('keydown', function (e) {
        if (e.keyCode === 27) {
          closeModal();
        }
      });

      setTimeout(function () {
        backdrop.addClass('show');
        modal.addClass('show');
      }, 0);
    }
  });

  $('.grid-field .action:button').entwine({
    onclick: function onclick(e) {
      var filterState = 'show';
      var triggerChange = true;

      if (this.is(':disabled')) {
        e.preventDefault();
        return;
      }

      if (this.hasClass('ss-gridfield-button-close') || !this.closest('.grid-field').hasClass('show-filter')) {
        filterState = 'hidden';
      }

      if (this.hasClass('ss-gridfield-pagination-action') || this.hasClass('grid-field__sort')) {
        triggerChange = false;
      }

      var successCallback = function successCallback(data, status, response) {
        var messageText = response.getResponseHeader('X-Message-Text');
        var messageType = response.getResponseHeader('X-Message-Type');
        if (messageText && messageType) {
          var formEditError = $("#Form_EditForm_error");
          formEditError.addClass(messageType);
          formEditError.html(messageText);
          formEditError.show();
        }
      };

      var data = [{
        name: this.attr('name'),
        value: this.val(),
        filter: filterState,
        triggerChange: triggerChange
      }];

      var actionState = this.data('action-state');
      if (actionState) {
        data.push({
          name: 'ActionState',
          value: JSON.stringify(actionState)
        });
      }

      this.getGridField().reload({ data: data }, successCallback);

      e.preventDefault();
    },

    actionurl: function actionurl() {
      var btn = this.closest(':button'),
          grid = this.getGridField(),
          form = this.closest('form'),
          data = form.find(':input.gridstate').serialize(),
          csrf = form.find('input[name="SecurityID"]').val();

      data += "&" + encodeURIComponent(btn.attr('name')) + '=' + encodeURIComponent(btn.val());

      if (csrf) {
        data += "&SecurityID=" + encodeURIComponent(csrf);
      }

      var actionState = this.data('action-state');
      if (actionState) {
        data += '&ActionState=' + encodeURIComponent(JSON.stringify(actionState));
      }

      if (window.location.search) {
        data = window.location.search.replace(/^\?/, '') + '&' + data;
      }

      var connector = grid.data('url').indexOf('?') == -1 ? '?' : '&';

      return $.path.makeUrlAbsolute(grid.data('url') + connector + data, $('base').attr('href'));
    }

  });

  $('.grid-field .add-existing-autocompleter').entwine({
    onbuttoncreate: function onbuttoncreate() {
      var self = this;

      this.toggleDisabled();

      this.find('input[type="text"]').on('keyup', function () {
        self.toggleDisabled();
      });
    },
    onunmatch: function onunmatch() {
      this.find('input[type="text"]').off('keyup');
    },
    toggleDisabled: function toggleDisabled() {
      var $button = this.find('.ss-ui-button'),
          $input = this.find('input[type="text"]'),
          inputHasValue = $input.val() !== '',
          buttonDisabled = $button.is(':disabled');

      if (inputHasValue && buttonDisabled || !inputHasValue && !buttonDisabled) {
        $button.attr("disabled", !buttonDisabled);
      }
    }
  });

  $('.grid-field .grid-field__col-compact .action--delete, .grid-field .grid-field__col-compact .action--archive, .cms-edit-form .btn-toolbar .action--delete, .cms-edit-form .btn-toolbar .action--archive').entwine({
    onclick: function onclick(e) {
      var confirmMessage = $(this).hasClass('action--archive') ? _i18n2.default._t('Admin.ARCHIVECONFIRMMESSAGE', 'Are you sure you want to archive this record?') : _i18n2.default._t('Admin.DELETECONFIRMMESSAGE', 'Are you sure you want to delete this record?');

      if (!confirm(confirmMessage)) {
        e.preventDefault();
        return false;
      } else {
        this._super(e);
      }
    }
  });

  $('.grid-field .grid-print-button.action:button').entwine({
    UUID: null,
    onmatch: function onmatch() {
      this._super();
      this.setUUID(new Date().getTime());
    },
    onunmatch: function onunmatch() {
      this._super();
    },
    onclick: function onclick(e) {
      var url = this.actionurl();
      window.open(url);
      e.preventDefault();
      return false;
    }
  });

  $('.ss-gridfield-print-iframe').entwine({
    onmatch: function onmatch() {
      this._super();

      this.hide().bind('load', function () {
        this.focus();
        var ifWin = this.contentWindow || this;
        ifWin.print();
      });
    },
    onunmatch: function onunmatch() {
      this._super();
    }
  });

  $('.grid-field .action.no-ajax, .grid-field .no-ajax .action:button').entwine({
    onclick: function onclick(e) {
      window.location.href = this.actionurl();
      e.preventDefault();
      return false;
    }
  });

  $('.grid-field .action-detail').entwine({
    onclick: function onclick() {
      this.getGridField().showDetailView($(this).prop('href'));
      return false;
    }
  });

  $('.grid-field[data-selectable]').entwine({
    getSelectedItems: function getSelectedItems() {
      return this.find('.ss-gridfield-item.ui-selected');
    },

    getSelectedIDs: function getSelectedIDs() {
      return $.map(this.getSelectedItems(), function (el) {
        return $(el).data('id');
      });
    }
  });
  $('.grid-field[data-selectable] .ss-gridfield-items').entwine({
    onadd: function onadd() {
      this._super();

      this.selectable();
    },
    onremove: function onremove() {
      this._super();
      if (this.data('selectable')) this.selectable('destroy');
    }
  });

  $('.js-injector-boot .grid-field .grid-field__search-holder').entwine({
    Component: null,

    onmatch: function onmatch() {
      this._super();

      this.prependTo(this.parent());

      var cmsContent = this.closest('.cms-content').attr('id');
      var context = cmsContent ? { context: cmsContent } : {};

      var Search = (0, _Injector.loadComponent)('Search', context);
      this.setComponent(Search);

      this.refresh();
    },
    onunmatch: function onunmatch() {
      this._super();

      var container = this[0];
      if (container) {
        _reactDom2.default.unmountComponentAtNode(container);
      }
    },
    close: function close() {
      var props = this.data('schema');

      var ajaxData = [{
        name: props.clearAction,
        value: '',
        filter: 'hidden',
        triggerChange: false
      }];

      if (props.clearActionState) {
        ajaxData.push({
          name: 'ActionState',
          value: props.clearActionState
        });
      }

      this.getGridField().reload({ data: ajaxData });
    },
    search: function search(data) {
      var props = this.data('schema');

      var ajaxData = [{
        name: props.searchAction,
        value: '',
        filter: 'show',
        triggerChange: false
      }];

      if (props.searchActionState) {
        ajaxData.push({
          name: 'ActionState',
          value: props.searchActionState
        });
      }

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = Object.entries(data)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _ref = _step.value;

          var _ref2 = _slicedToArray(_ref, 2);

          var key = _ref2[0];
          var value = _ref2[1];

          if (value) {
            var name = 'filter[' + props.gridfield + '][' + key + ']';
            ajaxData.push({ name: name, value: value });
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      this.getGridField().reload({ data: ajaxData });
    },
    refresh: function refresh() {
      var _this = this;

      var props = this.data('schema');
      var Search = this.getComponent();
      var handleHide = function handleHide() {
        return _this.close();
      };
      var handleSearch = function handleSearch(data) {
        return _this.search(data);
      };
      var idName = String(props.gridfield).replace(/\-/g, '.');

      _reactDom2.default.render(_react2.default.createElement(Search, _extends({
        id: props.gridfield + 'Search',
        display: 'VISIBLE',
        displayBehavior: 'HIDEABLE',
        filterPrefix: 'Search__',
        onHide: handleHide,
        onSearch: handleSearch
      }, props)), this[0]);
    }
  });

  $('.js-injector-boot .grid-field .search-box__content-field').entwine({
    onkeydown: function onkeydown(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
      }
    }
  });

  $('.grid-field .grid-field__filter-header :input').entwine({
    onmatch: function onmatch() {
      var filterbtn = this.closest('.extra').find('.ss-gridfield-button-filter'),
          resetbtn = this.closest('.extra').find('.ss-gridfield-button-reset');

      if (this.val()) {
        filterbtn.addClass('filtered');
        resetbtn.addClass('filtered');
      }
      this._super();
    },
    onunmatch: function onunmatch() {
      this._super();
    },
    onkeydown: function onkeydown(e) {
      if (this.closest('.ss-gridfield-button-reset').length) return;

      var filterbtn = this.closest('.extra').find('.ss-gridfield-button-filter'),
          resetbtn = this.closest('.extra').find('.ss-gridfield-button-reset');

      if (e.keyCode == '13') {
        var btns = this.closest('.grid-field__filter-header').find('.ss-gridfield-button-filter');
        var filterState = 'show';
        if (this.hasClass('ss-gridfield-button-close') || !this.closest('.grid-field').hasClass('show-filter')) {
          filterState = 'hidden';
        }

        var ajaxData = [{
          name: btns.attr('name'),
          value: btns.val(),
          filter: filterState,
          triggerChange: false
        }];

        if (btns.data('action-state')) {
          ajaxData.push({
            name: 'ActionState',
            value: JSON.stringify(btns.data('action-state'))
          });
        }

        this.getGridField().reload({
          data: ajaxData
        });
        return false;
      } else {
        filterbtn.addClass('hover-alike');
        resetbtn.addClass('hover-alike');
      }
    }
  });

  $(".grid-field .relation-search").entwine({
    onfocusin: function onfocusin(event) {
      this.autocomplete({
        source: function source(request, response) {
          var searchField = $(this.element);
          var form = $(this.element).closest("form");
          $.ajax({
            headers: {
              "X-Pjax": 'Partial'
            },
            dataType: 'json',
            type: "GET",
            url: $(searchField).data('searchUrl'),
            data: encodeURIComponent(searchField.attr('name')) + '=' + encodeURIComponent(searchField.val()),
            success: response,
            error: function error(e) {
              alert(_i18n2.default._t('Admin.ERRORINTRANSACTION', 'An error occured while fetching data from the server\n Please try again later.'));
            }
          });
        },
        select: function select(event, ui) {
          var hiddenField = $('<input type="hidden" name="relationID" class="action_gridfield_relationfind no-change-track" />');
          hiddenField.val(ui.item.id);
          $(this).closest(".grid-field").find(".action_gridfield_relationfind").replaceWith(hiddenField);
          var addbutton = $(this).closest(".grid-field").find(".action_gridfield_relationadd");

          addbutton.removeAttr('disabled');
        }
      });
    }
  });

  $(".grid-field .pagination-page-number input").entwine({
    onkeydown: function onkeydown(event) {
      if (event.keyCode == 13) {
        event.preventDefault();
        var newpage = parseInt($(this).val(), 10);

        var gridfield = $(this).getGridField();
        gridfield.setState('GridFieldPaginator', { currentPage: newpage });
        gridfield.reload();

        return false;
      }
    }
  });
});

/***/ }),

/***/ "./client/src/legacy/HtmlEditorField.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {

var _jquery = __webpack_require__(2);

var _jquery2 = _interopRequireDefault(_jquery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ss = typeof window.ss !== 'undefined' ? window.ss : {};

ss.editorWrappers = {};
ss.editorWrappers.tinyMCE = function () {
  var editorID;

  return {
    init: function init(ID) {
      editorID = ID;

      this.create();
    },

    destroy: function destroy() {
      tinymce.EditorManager.execCommand('mceRemoveEditor', false, editorID);
    },

    getInstance: function getInstance() {
      return tinymce.EditorManager.get(editorID);
    },

    onopen: function onopen() {},

    onclose: function onclose() {},

    getConfig: function getConfig() {
      var selector = "#" + editorID,
          config = (0, _jquery2.default)(selector).data('config'),
          self = this;

      config.selector = selector;

      config.setup = function (ed) {
        ed.on('change', function () {
          self.save();
        });
      };
      return config;
    },

    save: function save() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      var instance = this.getInstance();
      instance.save();

      if (!options.silent) {
        (0, _jquery2.default)(instance.getElement()).trigger("change");
        instance.getElement().dispatchEvent(new Event('input', { bubbles: true }));
      }
    },

    create: function create() {
      var timeLastScrolled = void 0;
      var showAfterScrollFunc = void 0;
      var initialOffset = void 0;

      function showAfterScroll(panel, initialOffset) {
        var finalOffset = $(panel).scrollTop();

        $('.mce-floatpanel').each(function (i, el) {
          var oldPosition = parseFloat(el.style.top);
          $(el).css('top', oldPosition - (finalOffset - initialOffset) + 'px');
        });
        $('.mce-floatpanel').css('opacity', '1');

        timeLastScrolled = undefined;
      };

      function hideOnScroll(e) {
        var panel = e.target;

        if (!timeLastScrolled || (new Date() - timeLastScrolled) / 100 > 500) {
          initialOffset = $(panel).scrollTop();
          $('.mce-floatpanel').css('opacity', '0');
        } else {
          window.clearTimeout(showAfterScrollFunc);
        }
        timeLastScrolled = new Date();

        showAfterScrollFunc = window.setTimeout(function () {
          return showAfterScroll(panel, initialOffset);
        }, 500);
      }

      var config = this.getConfig();

      if (typeof config.baseURL !== 'undefined') {
        tinymce.EditorManager.baseURL = config.baseURL;
      }

      tinymce.init(config).then(function (editors) {
        if (editors.length > 0 && editors[0].container) {
          var scrollPanel = $(editors[0].container).closest('.panel--scrollable');
          scrollPanel.on('scroll', function (e) {
            return hideOnScroll(e);
          });
        }
      });
    },

    repaint: function repaint() {},

    isDirty: function isDirty() {
      return this.getInstance().isDirty();
    },

    getContent: function getContent() {
      return this.getInstance().getContent();
    },

    getDOM: function getDOM() {
      return this.getInstance().getElement();
    },

    getContainer: function getContainer() {
      return this.getInstance().getContainer();
    },

    getSelectedNode: function getSelectedNode() {
      return this.getInstance().selection.getNode();
    },

    selectNode: function selectNode(node) {
      this.getInstance().selection.select(node);
    },

    setContent: function setContent(html, opts) {
      this.getInstance().setContent(html, opts);
    },

    insertContent: function insertContent(html, opts) {
      this.getInstance().insertContent(html, opts);
    },

    replaceContent: function replaceContent(html, opts) {
      this.getInstance().execCommand('mceReplaceContent', false, html, opts);
    },

    insertLink: function insertLink(attrs, opts, linkText) {
      if (linkText) {
        var linkEl = this.getInstance().dom.create('a', attrs, linkText);
        this.getInstance().selection.setNode(linkEl);
      } else {
        this.getInstance().execCommand("mceInsertLink", false, attrs, opts);
      }
    },

    removeLink: function removeLink() {
      this.getInstance().execCommand('unlink', false);
    },

    cleanLink: function cleanLink(href, node) {
      var settings = this.getConfig,
          cb = settings['urlconverter_callback'],
          cu = tinyMCE.settings['convert_urls'];
      if (cb) href = eval(cb + "(href, node, true);");

      if (cu && href.match(new RegExp('^' + tinyMCE.settings['document_base_url'] + '(.*)$'))) {
        href = RegExp.$1;
      }

      if (href.match(/^javascript:\s*mctmp/)) href = '';

      return href;
    },

    createBookmark: function createBookmark() {
      return this.getInstance().selection.getBookmark();
    },

    moveToBookmark: function moveToBookmark(bookmark) {
      this.getInstance().selection.moveToBookmark(bookmark);
      this.getInstance().focus();
    },

    blur: function blur() {
      this.getInstance().selection.collapse();
    },

    addUndo: function addUndo() {
      this.getInstance().undoManager.add();
    }
  };
};

ss.editorWrappers['default'] = ss.editorWrappers.tinyMCE;

_jquery2.default.entwine('ss', function ($) {
  $('textarea.htmleditor').entwine({

    Editor: null,

    onadd: function onadd() {
      var edClass = this.data('editor') || 'default',
          ed = ss.editorWrappers[edClass]();
      this.setEditor(ed);

      ed.init(this.attr('id'));

      this._super();
    },

    onmatch: function onmatch() {
      if (!this.getEditor()) {
        this.onadd();
      }
      this._super();
    },

    onremove: function onremove() {
      this.getEditor().destroy();
      this._super();
    },

    onunmatch: function onunmatch() {
      if (this.getEditor()) {
        this.onremove();
      }
      this._super();
    },

    'from .cms-edit-form': {
      onbeforesubmitform: function onbeforesubmitform() {
        this.getEditor().save({ silent: true });
        this._super();
      }
    },

    openLinkDialog: function openLinkDialog() {
      this.openDialog('link');
    },

    openMediaDialog: function openMediaDialog() {
      this.openDialog('media');
    },

    openEmbedDialog: function openEmbedDialog() {
      this.openDialog('embed');
    },

    openDialog: function openDialog(type) {
      if (type === 'media' && window.InsertMediaModal) {
        var dialog = $('#insert-media-react__dialog-wrapper');

        if (!dialog.length) {
          dialog = $('<div id="insert-media-react__dialog-wrapper" class="insert-link__dialog-wrapper" />');
          $('body').append(dialog);
        }

        dialog.setElement(this);
        dialog.open();
        return;
      }

      if (type === 'embed' && window.InsertEmbedModal) {
        var _dialog = $('#insert-embed-react__dialog-wrapper');

        if (!_dialog.length) {
          _dialog = $('<div id="insert-embed-react__dialog-wrapper" />');
          $('body').append(_dialog);
        }

        _dialog.setElement(this);
        _dialog.open();
        return;
      }

      throw new Error('Dialog named ' + type + ' is not available.');
    }
  });
});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ }),

/***/ "./client/src/legacy/LeftAndMain.ActionTabSet.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _jquery = __webpack_require__(2);

var _jquery2 = _interopRequireDefault(_jquery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_jquery2.default.entwine('ss', function ($) {
  $('.ss-tabset.ss-ui-action-tabset').entwine({
    IgnoreTabState: true,

    onadd: function onadd() {
      this._super();

      this.tabs({ 'collapsible': true, 'active': false });
    },

    onremove: function onremove() {
      var frame = $('.cms-container').find('iframe');
      frame.each(function (index, iframe) {
        try {
          $(iframe).contents().off('click.ss-ui-action-tabset');
        } catch (e) {
          console.warn('Unable to access iframe, possible https mis-match');
        }
      });
      $(document).off('click.ss-ui-action-tabset');

      this._super();
    },

    'ontabsbeforeactivate': function ontabsbeforeactivate(event, ui) {
      this.riseUp(event, ui);
    },

    onclick: function onclick(event, ui) {
      this.attachCloseHandler(event, ui);
    },

    attachCloseHandler: function attachCloseHandler(event, ui) {
      var that = this,
          frame = $('.cms-container').find('iframe'),
          _closeHandler;

      _closeHandler = function closeHandler(event) {
        var panel, frame;
        panel = $(event.target).closest('.ss-ui-action-tabset .ui-tabs-panel');

        if (!$(event.target).closest(that).length && !panel.length) {
          that.tabs('option', 'active', false);
          frame = $('.cms-container').find('iframe');
          frame.each(function (index, iframe) {
            $(iframe).contents().off('click.ss-ui-action-tabset', _closeHandler);
          });
          $(document).off('click.ss-ui-action-tabset', _closeHandler);
        }
      };

      $(document).on('click.ss-ui-action-tabset', _closeHandler);

      if (frame.length > 0) {
        frame.each(function (index, iframe) {
          $(iframe).contents().on('click.ss-ui-action-tabset', _closeHandler);
        });
      }
    },

    riseUp: function riseUp(event, ui) {
      var elHeight, trigger, endOfWindow, elPos, activePanel, activeTab, topPosition, containerSouth, padding;

      elHeight = $(this).find('.ui-tabs-panel').outerHeight();
      trigger = $(this).find('.ui-tabs-nav').outerHeight();
      endOfWindow = $(window).height() + $(document).scrollTop() - trigger;
      elPos = $(this).find('.ui-tabs-nav').offset().top;

      activePanel = ui.newPanel;
      activeTab = ui.newTab;

      if (elPos + elHeight >= endOfWindow && elPos - elHeight > 0) {
        this.addClass('rise-up');

        if (activeTab.position() !== null) {
          topPosition = -activePanel.outerHeight();
          containerSouth = activePanel.parents('.toolbar--south');
          if (containerSouth) {
            padding = activeTab.offset().top - containerSouth.offset().top;
            topPosition = topPosition - padding;
          }
          $(activePanel).css('top', topPosition + "px");
        }
      } else {
        this.removeClass('rise-up');
        if (activeTab.position() !== null) {
          $(activePanel).css('bottom', '100%');
        }
      }
      return false;
    }
  });

  $('.cms-content-actions .ss-tabset.ss-ui-action-tabset').entwine({
    'ontabsbeforeactivate': function ontabsbeforeactivate(event, ui) {
      this._super(event, ui);

      if ($(ui.newPanel).length > 0) {
        $(ui.newPanel).css('left', ui.newTab.position().left + "px");
      }
    }
  });

  $('.cms-actions-row.ss-tabset.ss-ui-action-tabset').entwine({
    'ontabsbeforeactivate': function ontabsbeforeactivate(event, ui) {
      this._super(event, ui);

      $(this).closest('.ss-ui-action-tabset').removeClass('tabset-open tabset-open-last');
    }
  });

  $('.cms-content-fields .ss-tabset.ss-ui-action-tabset').entwine({
    'ontabsbeforeactivate': function ontabsbeforeactivate(event, ui) {
      this._super(event, ui);
      if ($(ui.newPanel).length > 0) {
        if ($(ui.newTab).hasClass("last")) {
          $(ui.newPanel).css({ 'left': 'auto', 'right': '0px' });

          $(ui.newPanel).parent().addClass('tabset-open-last');
        } else {
          $(ui.newPanel).css('left', ui.newTab.position().left + "px");

          if ($(ui.newTab).hasClass("first")) {
            $(ui.newPanel).css('left', "0px");
            $(ui.newPanel).parent().addClass('tabset-open');
          }
        }
      }
    }
  });

  $('.cms-tree-view-sidebar .cms-actions-row.ss-tabset.ss-ui-action-tabset').entwine({
    'from .ui-tabs-nav li': {
      onhover: function onhover(e) {
        $(e.target).parent().find('li .active').removeClass('active');
        $(e.target).find('a').addClass('active');
      }
    },

    'ontabsbeforeactivate': function ontabsbeforeactivate(event, ui) {
      this._super(event, ui);

      $(ui.newPanel).css({ 'left': 'auto', 'right': 'auto' });

      if ($(ui.newPanel).length > 0) {
        $(ui.newPanel).parent().addClass('tabset-open');
      }
    }
  });
});

/***/ }),

/***/ "./client/src/legacy/LeftAndMain.BatchActions.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(jQuery) {

var _jquery = __webpack_require__(2);

var _jquery2 = _interopRequireDefault(_jquery);

var _i18n = __webpack_require__(3);

var _i18n2 = _interopRequireDefault(_i18n);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_jquery2.default.entwine('ss.tree', function ($) {
  $('#Form_BatchActionsForm').entwine({
    Actions: [],

    getTree: function getTree() {
      return $('.cms-tree');
    },

    fromTree: {
      oncheck_node: function oncheck_node(e, data) {
        this.serializeFromTree();
      },
      onuncheck_node: function onuncheck_node(e, data) {
        this.serializeFromTree();
      }
    },

    onmatch: function onmatch() {
      var self = this;

      self.getTree().bind('load_node.jstree', function (e, data) {
        self.refreshSelected();
      });
    },

    onunmatch: function onunmatch() {
      var self = this;

      self.getTree().unbind('load_node.jstree');
    },

    registerDefault: function registerDefault() {
      this.register('publish', function (ids) {
        var confirmed = confirm(_i18n2.default.inject(_i18n2.default._t("Admin.BATCH_PUBLISH_PROMPT", "You have {num} page(s) selected.\n\nDo you really want to publish?"), { 'num': ids.length }));
        return confirmed ? ids : false;
      });

      this.register('unpublish', function (ids) {
        var confirmed = confirm(_i18n2.default.inject(_i18n2.default._t("Admin.BATCH_UNPUBLISH_PROMPT", "You have {num} page(s) selected.\n\nDo you really want to unpublish"), { 'num': ids.length }));
        return confirmed ? ids : false;
      });

      this.register('delete', function (ids) {
        var confirmed = confirm(_i18n2.default.inject(_i18n2.default._t("Admin.BATCH_DELETE_PROMPT", "You have {num} page(s) selected.\n\nAre you sure you want to delete these pages?\n\nThese pages and all of their children pages will be deleted and sent to the archive."), { 'num': ids.length }));
        return confirmed ? ids : false;
      });

      this.register('restore', function (ids) {
        var confirmed = confirm(_i18n2.default.inject(_i18n2.default._t("Admin.BATCH_RESTORE_PROMPT", "You have {num} page(s) selected.\n\nDo you really want to restore to stage?\n\nChildren of archived pages will be restored to the root level, unless those pages are also being restored."), { 'num': ids.length }));
        return confirmed ? ids : false;
      });
    },

    onadd: function onadd() {
      this.registerDefault();
      this._super();
    },

    register: function register(type, callback) {
      this.trigger('register', { type: type, callback: callback });
      var actions = this.getActions();
      actions[type] = callback;
      this.setActions(actions);
    },

    unregister: function unregister(type) {
      this.trigger('unregister', { type: type });

      var actions = this.getActions();
      if (actions[type]) delete actions[type];
      this.setActions(actions);
    },

    refreshSelected: function refreshSelected(rootNode) {
      var self = this,
          st = this.getTree(),
          ids = this.getIDs(),
          allIds = [],
          viewMode = $('.cms-content-batchactions-button'),
          actionUrl = this.find(':input[name=Action]').val();

      if (rootNode == null) rootNode = st;

      for (var idx in ids) {
        $($(st).getNodeByID(idx)).addClass('selected').attr('selected', 'selected');
      }

      if (!actionUrl || actionUrl == -1 || !viewMode.hasClass('active')) {
        $(rootNode).find('li').each(function () {
          $(this).setEnabled(true);
        });
        return;
      }

      $(rootNode).find('li').each(function () {
        allIds.push($(this).data('id'));
        $(this).addClass('treeloading').setEnabled(false);
      });

      var actionUrlParts = $.path.parseUrl(actionUrl);
      var applicablePagesUrl = actionUrlParts.hrefNoSearch + '/applicablepages/';
      applicablePagesUrl = $.path.addSearchParams(applicablePagesUrl, actionUrlParts.search);
      applicablePagesUrl = $.path.addSearchParams(applicablePagesUrl, { csvIDs: allIds.join(',') });
      jQuery.getJSON(applicablePagesUrl, function (applicableIDs) {
        jQuery(rootNode).find('li').each(function () {
          $(this).removeClass('treeloading');

          var id = $(this).data('id');
          if (id == 0 || $.inArray(id, applicableIDs) >= 0) {
            $(this).setEnabled(true);
          } else {
            $(this).removeClass('selected').setEnabled(false);
            $(this).prop('selected', false);
          }
        });

        self.serializeFromTree();
      });
    },

    serializeFromTree: function serializeFromTree() {
      var tree = this.getTree(),
          ids = tree.getSelectedIDs();

      this.setIDs(ids);

      return true;
    },

    setIDs: function setIDs(ids) {
      this.find(':input[name=csvIDs]').val(ids ? ids.join(',') : null);
    },

    getIDs: function getIDs() {
      var value = this.find(':input[name=csvIDs]').val();
      return value ? value.split(',') : [];
    },

    onsubmit: function onsubmit(e) {
      var self = this,
          ids = this.getIDs(),
          tree = this.getTree(),
          actions = this.getActions();

      if (!ids || !ids.length) {
        alert(_i18n2.default._t('Admin.SELECTONEPAGE', 'Please select at least one page'));
        e.preventDefault();
        return false;
      }

      var actionURL = this.find(':input[name=Action]').val();
      if (!actionURL) {
        e.preventDefault();
        return false;
      }

      var type = actionURL.split('/').filter(function (n) {
        return !!n;
      }).pop();
      if (actions[type]) {
        ids = actions[type].apply(this, [ids]);
      }

      if (!ids || !ids.length) {
        e.preventDefault();
        return false;
      }

      this.setIDs(ids);

      tree.find('li').removeClass('failed');

      var button = this.find(':submit:first');
      button.addClass('loading');

      jQuery.ajax({
        url: actionURL,
        type: 'POST',
        data: this.serializeArray(),
        complete: function complete(xmlhttp, status) {
          button.removeClass('loading');

          tree.jstree('refresh', -1);
          self.setIDs([]);

          self.find(':input[name=Action]').val('').change();

          var msg = xmlhttp.getResponseHeader('X-Status');
          if (msg) statusMessage(decodeURIComponent(msg), status == 'success' ? 'good' : 'bad');
        },
        success: function success(data, status) {
          var id, node;

          if (data.modified) {
            var modifiedNodes = [];
            for (id in data.modified) {
              node = tree.getNodeByID(id);
              tree.jstree('set_text', node, data.modified[id]['TreeTitle']);
              modifiedNodes.push(node);
            }
            $(modifiedNodes).effect('highlight');
          }
          if (data.deleted) {
            for (id in data.deleted) {
              node = tree.getNodeByID(id);
              if (node.length) tree.jstree('delete_node', node);
            }
          }
          if (data.error) {
            for (id in data.error) {
              node = tree.getNodeByID(id);
              $(node).addClass('failed');
            }
          }
        },
        dataType: 'json'
      });

      e.preventDefault();
      return false;
    }

  });

  $('.cms-content-batchactions-button').entwine({
    onmatch: function onmatch() {
      this._super();
      this.updateTree();
    },
    onunmatch: function onunmatch() {
      this._super();
    },
    onclick: function onclick(e) {
      this.updateTree();
    },
    updateTree: function updateTree() {
      var tree = $('.cms-tree'),
          form = $('#Form_BatchActionsForm');

      this._super();

      if (this.data('active')) {
        tree.addClass('multiple');
        tree.removeClass('draggable');
        form.serializeFromTree();
      } else {
        tree.removeClass('multiple');
        tree.addClass('draggable');
      }

      $('#Form_BatchActionsForm').refreshSelected();
    }
  });

  $('#Form_BatchActionsForm select[name=Action]').entwine({
    onchange: function onchange(e) {
      var form = $(e.target.form),
          btn = form.find(':submit'),
          selected = $(e.target).val();

      $('#Form_BatchActionsForm').refreshSelected();

      this.trigger("chosen:updated");

      this._super(e);
    }
  });
});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ }),

/***/ "./client/src/legacy/LeftAndMain.Content.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _jquery = __webpack_require__(2);

var _jquery2 = _interopRequireDefault(_jquery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_jquery2.default.entwine('ss', function ($) {
  $('.cms-content').entwine({

    onadd: function onadd() {
      var self = this;

      this.find('.cms-tabset').redrawTabs();
      this._super();
    },

    redraw: function redraw() {
      if (window.debug) console.log('redraw', this.attr('class'), this.get(0));

      this.add(this.find('.cms-tabset')).redrawTabs();
      this.find('.cms-content-header').redraw();
      this.find('.cms-content-actions').redraw();
    }
  });

  $('.cms-content .cms-tree').entwine({
    onadd: function onadd() {
      var self = this;

      this._super();

      this.bind('select_node.jstree', function (e, data) {
        var node = data.rslt.obj,
            loadedNodeID = self.find(':input[name=ID]').val(),
            origEvent = data.args[2],
            container = $('.cms-container');

        if (!origEvent) {
          return false;
        }

        if ($(node).hasClass('disabled')) return false;

        if ($(node).data('id') == loadedNodeID) return;

        var url = $(node).find('a:first').attr('href');
        if (url && url != '#') {
          url = url.split('?')[0];

          self.jstree('deselect_all');
          self.jstree('uncheck_all');

          if ($.path.isExternal($(node).find('a:first'))) url = url = $.path.makeUrlAbsolute(url, $('base').attr('href'));

          if (document.location.search) url = $.path.addSearchParams(url, document.location.search.replace(/^\?/, ''));

          container.loadPanel(url);
        } else {
          self.removeForm();
        }
      });
    }
  });

  $('.cms-content .cms-content-fields').entwine({
    redraw: function redraw() {
      if (window.debug) console.log('redraw', this.attr('class'), this.get(0));
    }
  });

  $('.cms-content .cms-content-actions').entwine({
    redraw: function redraw() {
      if (window.debug) console.log('redraw', this.attr('class'), this.get(0));

      this.height('auto');
      var paddingTop = parseInt(this.css('padding-top'), 10);
      var paddingBottom = parseInt(this.css('padding-bottom'), 10);
      this.height(this.innerHeight() - paddingTop - paddingBottom);
    }
  });
});

/***/ }),

/***/ "./client/src/legacy/LeftAndMain.EditForm.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(jQuery) {

var _jquery = __webpack_require__(2);

var _jquery2 = _interopRequireDefault(_jquery);

var _i18n = __webpack_require__(3);

var _i18n2 = _interopRequireDefault(_i18n);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var currBeforeUnload = window.onbeforeunload;

window.onbeforeunload = function (e) {
  var form = (0, _jquery2.default)('.cms-edit-form');
  form.trigger('beforesubmitform');
  if (form.is('.changed') && !form.is('.discardchanges')) {
    return _i18n2.default._t('Admin.CONFIRMUNSAVEDSHORT');
  }

  if (typeof currBeforeUnload === 'function') {
    return currBeforeUnload();
  }

  return undefined;
};

_jquery2.default.entwine('ss', function ($) {
  $('.cms-edit-form').entwine({
    PlaceholderHtml: '',

    ChangeTrackerOptions: {
      ignoreFieldSelector: '.no-change-track, .ss-upload :input, .cms-navigator :input'
    },

    ValidationErrorShown: false,

    onadd: function onadd() {
      var self = this;

      this.attr("autocomplete", "off");

      this._setupChangeTracker();

      for (var overrideAttr in { 'action': true, 'method': true, 'enctype': true, 'name': true }) {
        var el = this.find(':input[name=' + '_form_' + overrideAttr + ']');
        if (el) {
          this.attr(overrideAttr, el.val());
          el.remove();
        }
      }

      this.setValidationErrorShown(false);

      this._super();
    },
    'from .cms-tabset': {
      onafterredrawtabs: function onafterredrawtabs() {
        if (this.hasClass('validationerror')) {
          var tabError = this.find('.message.validation, .message.required').first().closest('.tab');
          $('.cms-container').clearCurrentTabState();
          var $tabSet = tabError.closest('.ss-tabset');

          if (!$tabSet.length) {
            $tabSet = tabError.closest('.cms-tabset');
          }

          if ($tabSet.length) {
            $tabSet.tabs('option', 'active', tabError.index('.tab'));
          } else if (!this.getValidationErrorShown()) {
            this.setValidationErrorShown(true);
            errorMessage(ss.i18n._t('Admin.VALIDATIONERROR', 'Validation Error'));
          }
        }
      }
    },
    onremove: function onremove() {
      this.changetracker('destroy');
      this._super();
    },
    onmatch: function onmatch() {
      this._super();
    },
    onunmatch: function onunmatch() {
      this._super();
    },
    redraw: function redraw() {
      if (window.debug) console.log('redraw', this.attr('class'), this.get(0));

      this.add(this.find('.cms-tabset')).redrawTabs();
      this.find('.cms-content-header').redraw();
    },

    _setupChangeTracker: function _setupChangeTracker() {
      this.changetracker(this.getChangeTrackerOptions());
    },

    confirmUnsavedChanges: function confirmUnsavedChanges() {
      this.trigger('beforesubmitform');
      if (!this.is('.changed') || this.is('.discardchanges')) {
        return true;
      }
      if (this.find('.btn-toolbar :submit.btn--loading.loading').length > 0) {
        return true;
      }
      var confirmed = confirm(_i18n2.default._t('Admin.CONFIRMUNSAVED'));
      if (confirmed) {
        this.addClass('discardchanges');
      }
      return confirmed;
    },

    onsubmit: function onsubmit(e, button) {
      if (this.prop("target") != "_blank") {
        if (button) this.closest('.cms-container').submitForm(this, button);
        return false;
      }
    },

    validate: function validate() {
      var isValid = true;
      this.trigger('validate', { isValid: isValid });

      return isValid;
    },

    'from .htmleditor': {
      oneditorinit: function oneditorinit(e) {
        var self = this,
            field = $(e.target).closest('.field.htmleditor'),
            editor = field.find('textarea.htmleditor').getEditor().getInstance();

        editor.onClick.add(function (e) {
          self.saveFieldFocus(field.attr('id'));
        });
      }
    },

    'from .cms-edit-form :input:not(:submit)': {
      onclick: function onclick(e) {
        this.saveFieldFocus($(e.target).attr('id'));
      },
      onfocus: function onfocus(e) {
        this.saveFieldFocus($(e.target).attr('id'));
      }
    },

    'from .cms-edit-form .treedropdown *': {
      onfocusin: function onfocusin(e) {
        var field = $(e.target).closest('.field.treedropdown');
        this.saveFieldFocus(field.attr('id'));
      }
    },

    'from .cms-edit-form .dropdown .chosen-container a': {
      onfocusin: function onfocusin(e) {
        var field = $(e.target).closest('.field.dropdown');
        this.saveFieldFocus(field.attr('id'));
      }
    },

    'from .cms-container': {
      ontabstaterestored: function ontabstaterestored(e) {
        this.restoreFieldFocus();
      }
    },

    saveFieldFocus: function saveFieldFocus(selected) {
      if (typeof window.sessionStorage == "undefined" || window.sessionStorage === null) return;

      var id = $(this).attr('id'),
          focusElements = [];

      focusElements.push({
        id: id,
        selected: selected
      });

      if (focusElements) {
        try {
          window.sessionStorage.setItem(id, JSON.stringify(focusElements));
        } catch (err) {
          if (err.code === DOMException.QUOTA_EXCEEDED_ERR && window.sessionStorage.length === 0) {
            return;
          } else {
            throw err;
          }
        }
      }
    },

    restoreFieldFocus: function restoreFieldFocus() {
      if (typeof window.sessionStorage == "undefined" || window.sessionStorage === null) return;

      var self = this,
          hasSessionStorage = typeof window.sessionStorage !== "undefined" && window.sessionStorage,
          sessionData = hasSessionStorage ? window.sessionStorage.getItem(this.attr('id')) : null,
          sessionStates = sessionData ? JSON.parse(sessionData) : false,
          elementID,
          tabbed = this.find('.ss-tabset').length !== 0,
          activeTab,
          elementTab,
          toggleComposite,
          scrollY;

      if (hasSessionStorage && sessionStates.length > 0) {
        $.each(sessionStates, function (i, sessionState) {
          if (self.is('#' + sessionState.id)) {
            elementID = $('#' + sessionState.selected);
          }
        });

        if ($(elementID).length < 1) {
          this.focusFirstInput();
          return;
        }

        activeTab = $(elementID).closest('.ss-tabset').find('.ui-tabs-nav .ui-tabs-active .ui-tabs-anchor').attr('id');
        elementTab = 'tab-' + $(elementID).closest('.ss-tabset .ui-tabs-panel').attr('id');

        if (tabbed && elementTab !== activeTab) {
          return;
        }

        toggleComposite = $(elementID).closest('.togglecomposite');

        if (toggleComposite.length > 0) {
          toggleComposite.accordion('activate', toggleComposite.find('.ui-accordion-header'));
        }

        scrollY = $(elementID).position().top;

        if (!$(elementID).is(':visible')) {
          elementID = '#' + $(elementID).closest('.field').attr('id');
          scrollY = $(elementID).position().top;
        }

        $(elementID).focus();

        if (scrollY > $(window).height() / 2) {
          self.find('.cms-content-fields').scrollTop(scrollY);
        }
      } else {
        this.focusFirstInput();
      }
    },

    focusFirstInput: function focusFirstInput() {
      this.find(':input:not(:submit)[data-skip-autofocus!="true"]').filter(':visible:first').focus();
    }
  });

  $('.cms-edit-form .btn-toolbar input.action[type=submit], .cms-edit-form .btn-toolbar button.action').entwine({
    onclick: function onclick(e) {
      if (this.is(':disabled')) {
        e.preventDefault();
        return false;
      }

      if (this._super(e) !== false && !e.defaultPrevented && !e.isDefaultPrevented()) {
        this.parents('form').trigger('submit', [this]);
        e.preventDefault();
        return false;
      }
    }
  });

  $('.cms-edit-form .btn-toolbar input.action[type=submit].ss-ui-action-cancel, .cms-edit-form .btn-toolbar button.action.ss-ui-action-cancel').entwine({
    onclick: function onclick(e) {
      if (window.history.length > 1) {
        window.history.back();
      } else {
        this.parents('form').trigger('submit', [this]);
      }
      e.preventDefault();
    }
  });

  $('.cms-edit-form .btn-toolbar button[name=action_doUnpublish].btn.action').entwine({
    onclick: function onclick(e) {
      var owners = this.data('owners');
      if (owners && parseInt(owners) > 0) {
        var message = [_i18n2.default.inject(_i18n2.default._t('Admin.OWNED_WARNING_1', 'You are unpublishing content that is being used in {count} other published section(s).'), { count: owners }), _i18n2.default._t('Admin.OWNED_WARNING_2', 'This could cause a published page to have missing components on the live site.'), _i18n2.default._t('Admin.OWNED_WARNING_3', 'Do you want to unpublish anyway?')];
        if (window.confirm(message.join('\n\n'))) {
          this._super();
        } else {
          e.preventDefault();
        }
      } else {
        this._super();
      }
    }
  });

  $('.cms-edit-form .ss-tabset').entwine({
    onmatch: function onmatch() {
      if (!this.hasClass('ss-ui-action-tabset')) {
        var tabs = this.find("> ul:first");

        if (tabs.children("li").length == 1) {
          tabs.hide().parent().addClass("ss-tabset-tabshidden");
        }
      }

      this._super();
    },
    onunmatch: function onunmatch() {
      this._super();
    }
  });

  $('.cms-edit-form [name="CanViewType"], ' + '.cms-edit-form [name="CanEditType"], ' + '.cms-edit-form [name="CanCreateTopLevelType"]').entwine({
    onmatch: function onmatch() {
      if (this.val() === 'OnlyTheseUsers') {
        if (this.is(':checked')) {
          this.showList(true);
        } else {
          this.hideList(true);
        }
      }
    },
    onchange: function onchange(e) {
      if (e.target.value === 'OnlyTheseUsers') {
        this.showList();
      } else {
        this.hideList();
      }
    },
    showList: function showList(instant) {
      var holder = this.closest('.field');
      var list = holder.next().filter('.listbox, .treedropdown, .treemultiselect');
      holder.addClass('field--merge-below');
      if (instant) {
        list.show().css('overflow', 'visible');
      } else {
        list.slideDown(function () {
          list.css('overflow', 'visible');
        });
      }
    },
    hideList: function hideList(instant) {
      var holder = this.closest('.field');
      var list = holder.next().filter('.listbox, .treedropdown, .treemultiselect');
      list.css('overflow', 'hidden');
      if (instant) {
        list.hide().css('display', 'none');
        holder.removeClass('field--merge-below');
      } else {
        list.slideUp(function () {
          holder.removeClass('field--merge-below');
        });
      }
    }
  });
});

var errorMessage = function errorMessage(text) {
  jQuery.noticeAdd({ text: text, type: 'error', stayTime: 5000, inEffect: { left: '0', opacity: 'show' } });
};
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ }),

/***/ "./client/src/legacy/LeftAndMain.FieldDescriptionToggle.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _jquery = __webpack_require__(2);

var _jquery2 = _interopRequireDefault(_jquery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_jquery2.default.entwine('ss', function ($) {

  $('.cms-description-toggle').entwine({
    onadd: function onadd() {
      var shown = false,
          fieldId = this.prop('id').substr(0, this.prop('id').indexOf('_Holder')),
          $trigger = this.find('.cms-description-trigger'),
          $description = this.find('.description');

      if (this.hasClass('description-toggle-enabled')) {
        return;
      }

      if ($trigger.length === 0) {
        $trigger = this.find('.middleColumn').first().after('<label class="right" for="' + fieldId + '"><a class="cms-description-trigger" href="javascript:void(0)"><span class="btn-icon-information"></span></a></label>').next();
      }

      this.addClass('description-toggle-enabled');

      $trigger.on('click', function () {
        $description[shown ? 'hide' : 'show']();
        shown = !shown;
      });

      $description.hide();
    }
  });
});

/***/ }),

/***/ "./client/src/legacy/LeftAndMain.FieldHelp.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _jquery = __webpack_require__(2);

var _jquery2 = _interopRequireDefault(_jquery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_jquery2.default.entwine('ss', function ($) {
  $(".cms .field.cms-description-tooltip").entwine({
    onmatch: function onmatch() {
      this._super();

      var descriptionEl = this.find('.description'),
          inputEl,
          tooltipEl;
      if (descriptionEl.length) {
        this.attr('title', descriptionEl.text()).tooltip({ content: descriptionEl.html() });
        descriptionEl.remove();
      }
    }
  });

  $(".cms .field.cms-description-tooltip :input").entwine({
    onfocusin: function onfocusin(e) {
      this.closest('.field').tooltip('open');
    },
    onfocusout: function onfocusout(e) {
      this.closest('.field').tooltip('close');
    }
  });
});

/***/ }),

/***/ "./client/src/legacy/LeftAndMain.Menu.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _jquery = __webpack_require__(2);

var _jquery2 = _interopRequireDefault(_jquery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_jquery2.default.entwine('ss', function ($) {
  $('.cms-panel.cms-menu').entwine({

    togglePanel: function togglePanel(doExpand, silent, doSaveState) {
      $('.cms-menu__list').children('li').each(function () {
        if (doExpand) {
          $(this).children('ul').each(function () {
            $(this).removeClass('collapsed-flyout');
            if ($(this).data('collapse')) {
              $(this).removeData('collapse');
              $(this).addClass('collapse');
            }
          });
        } else {
          $(this).children('ul').each(function () {
            $(this).addClass('collapsed-flyout');
            $(this).hasClass('collapse');
            $(this).removeClass('collapse');
            $(this).data('collapse', true);
          });
        }
      });

      this.toggleFlyoutState(doExpand);

      this._super(doExpand, silent, doSaveState);
    },
    toggleFlyoutState: function toggleFlyoutState(bool) {
      if (bool) {
        $('.collapsed').find('li').show();

        $('.cms-menu__list').find('.child-flyout-indicator').hide();
      } else {
        $('.collapsed-flyout').find('li').each(function () {
          $(this).hide();
        });

        var par = $('.cms-menu__list ul.collapsed-flyout').parent();
        if (par.children('.child-flyout-indicator').length === 0) par.append('<span class="child-flyout-indicator"></span>').fadeIn();
        par.children('.child-flyout-indicator').fadeIn();
      }
    },
    siteTreePresent: function siteTreePresent() {
      return $('#cms-content-tools-CMSMain').length > 0;
    },

    getPersistedStickyState: function getPersistedStickyState() {
      var persistedState, cookieValue;

      if ($.cookie !== void 0) {
        cookieValue = $.cookie('cms-menu-sticky');

        if (cookieValue !== void 0 && cookieValue !== null) {
          persistedState = cookieValue === 'true';
        }
      }

      return persistedState;
    },

    setPersistedStickyState: function setPersistedStickyState(isSticky) {
      if ($.cookie !== void 0) {
        $.cookie('cms-menu-sticky', isSticky, { path: '/', expires: 31 });
      }
    },

    getEvaluatedCollapsedState: function getEvaluatedCollapsedState() {
      var shouldCollapse,
          manualState = this.getPersistedCollapsedState(),
          menuIsSticky = $('.cms-menu').getPersistedStickyState(),
          automaticState = this.siteTreePresent();

      if (manualState === void 0) {
        shouldCollapse = automaticState;
      } else if (manualState !== automaticState && menuIsSticky) {
        shouldCollapse = manualState;
      } else {
        shouldCollapse = automaticState;
      }

      return shouldCollapse;
    },

    onadd: function onadd() {
      var self = this;

      setTimeout(function () {
        self.togglePanel(!self.getEvaluatedCollapsedState(), false, false);
      }, 0);

      $(window).on('ajaxComplete', function (e) {
        setTimeout(function () {
          self.togglePanel(!self.getEvaluatedCollapsedState(), false, false);
        }, 0);
      });

      this._super();
    }
  });

  $('.cms-menu__list').entwine({
    onmatch: function onmatch() {
      var self = this;

      this.find('li.current').select();

      this.updateItems();

      this._super();
    },
    onunmatch: function onunmatch() {
      this._super();
    },

    updateMenuFromResponse: function updateMenuFromResponse(xhr) {
      var controller = xhr.getResponseHeader('X-Controller');
      if (controller) {
        var item = this.find('li#Menu-' + controller.replace(/\\/g, '-').replace(/[^a-zA-Z0-9\-_:.]+/, ''));
        if (!item.hasClass('current')) item.select();
      }
      this.updateItems();
    },

    'from .cms-container': {
      onafterstatechange: function onafterstatechange(e, data) {
        this.updateMenuFromResponse(data.xhr);
      },
      onaftersubmitform: function onaftersubmitform(e, data) {
        this.updateMenuFromResponse(data.xhr);
      }
    },

    'from .cms-edit-form': {
      onrelodeditform: function onrelodeditform(e, data) {
        this.updateMenuFromResponse(data.xmlhttp);
      }
    },

    getContainingPanel: function getContainingPanel() {
      return this.closest('.cms-panel');
    },

    fromContainingPanel: {
      ontoggle: function ontoggle(e) {
        this.toggleClass('collapsed', $(e.target).hasClass('collapsed'));

        $('.cms-container').trigger('windowresize');

        if (this.hasClass('collapsed')) this.find('li.children.opened').removeClass('opened');

        if (!this.hasClass('collapsed')) {
          $('.toggle-children.opened').closest('li').addClass('opened');
        }
      }
    },

    updateItems: function updateItems() {
      var editPageItem = this.find('#Menu-CMSMain');

      editPageItem[editPageItem.is('.current') ? 'show' : 'hide']();

      var currentID = $('.cms-content input[name=ID]').val();
      if (currentID) {
        this.find('li').each(function () {
          if ($.isFunction($(this).setRecordID)) $(this).setRecordID(currentID);
        });
      }
    }
  });

  $('.cms-menu__list li').entwine({
    toggleFlyout: function toggleFlyout(bool) {
      var fly = $(this);

      if (fly.children('ul').first().hasClass('collapsed-flyout')) {
        if (bool) {
          if (!fly.children('ul').first().children('li').first().hasClass('clone')) {

            var li = fly.clone();
            li.addClass('clone').css({});

            li.children('ul').first().remove();

            li.find('span').not('.text').remove();

            li.find('a').first().unbind('click');

            fly.children('ul').prepend(li);
          }

          $('.collapsed-flyout').show();
          fly.addClass('opened');
          fly.children('ul').find('li').fadeIn('fast');
        } else {
          if (li) {
            li.remove();
          }
          $('.collapsed-flyout').hide();
          fly.removeClass('opened');
          fly.find('toggle-children').removeClass('opened');
          fly.children('ul').find('li').hide();
        }
      }
    }
  });

  $('.cms-menu__list li').hoverIntent(function () {
    $(this).toggleFlyout(true);
  }, function () {
    $(this).toggleFlyout(false);
  });

  $('.cms-menu__list .toggle').entwine({
    onclick: function onclick(e) {
      e.preventDefault();
      $(this).toogleFlyout(true);
    }
  });

  $('.cms-menu__list li').entwine({
    onmatch: function onmatch() {
      if (this.find('ul').length) {
        this.find('a:first').append('<span class="toggle-children"><span class="toggle-children-icon"></span></span>');
      }
      this._super();
    },
    onunmatch: function onunmatch() {
      this._super();
    },
    toggle: function toggle() {
      this[this.hasClass('opened') ? 'close' : 'open']();
    },

    open: function open() {
      var parent = this.getMenuItem();
      if (parent) parent.open();
      if (this.find('li.clone')) {
        this.find('li.clone').remove();
      }
      this.addClass('opened').find('ul').show();
      this.find('.toggle-children').addClass('opened');
    },
    close: function close() {
      this.removeClass('opened').find('ul').hide();
      this.find('.toggle-children').removeClass('opened');
    },
    select: function select() {
      var parent = this.getMenuItem();
      this.addClass('current').open();

      this.siblings().removeClass('current').close();
      this.siblings().find('li').removeClass('current');
      if (parent) {
        var parentSiblings = parent.siblings();
        parent.addClass('current');
        parentSiblings.removeClass('current').close();
        parentSiblings.find('li').removeClass('current').close();
      }

      this.getMenu().updateItems();

      this.trigger('select');
    }
  });

  $('.cms-menu__list *').entwine({
    getMenu: function getMenu() {
      return this.parents('.cms-menu__list:first');
    }
  });

  $('.cms-menu__list li *').entwine({
    getMenuItem: function getMenuItem() {
      return this.parents('li:first');
    }
  });

  $('.cms-menu__list li a').entwine({
    onclick: function onclick(e) {
      var isExternal = $.path.isExternal(this.attr('href'));
      if (e.which > 1 || isExternal) return;

      if (this.attr('target') == "_blank") {
        return;
      }

      e.preventDefault();

      var item = this.getMenuItem();

      var url = this.attr('href');
      if (!isExternal) url = $('base').attr('href') + url;

      var children = item.find('li');
      if (children.length) {
        children.first().find('a').click();
      } else {
        document.location.href = url;
      }

      item.select();
    }
  });

  $('.cms-menu__list li .toggle-children').entwine({
    onclick: function onclick(e) {
      var li = this.closest('li');
      li.toggle();
      return false;
    }
  });

  $('.cms .profile-link').entwine({
    onclick: function onclick() {
      $('.cms-container').loadPanel(this.attr('href'));
      $('.cms-menu__list li').removeClass('current').close();
      return false;
    }
  });

  $('.cms-menu .sticky-toggle__button').entwine({

    onadd: function onadd() {
      var isSticky = $('.cms-menu').getPersistedStickyState() ? true : false;

      this.toggleCSS(isSticky);
      this.toggleIndicator(isSticky);

      this._super();
    },

    toggleCSS: function toggleCSS(isSticky) {
      this[isSticky ? 'addClass' : 'removeClass']('active');
    },

    toggleIndicator: function toggleIndicator(isSticky) {
      this.next('.sticky-toggle__status').text(isSticky ? 'fixed' : 'auto');
    },

    onclick: function onclick() {
      var $menu = this.closest('.cms-menu'),
          persistedCollapsedState = $menu.getPersistedCollapsedState(),
          persistedStickyState = $menu.getPersistedStickyState(),
          newStickyState = persistedStickyState === void 0 ? !this.hasClass('active') : !persistedStickyState;

      if (persistedCollapsedState === void 0) {
        $menu.setPersistedCollapsedState($menu.hasClass('collapsed'));
      } else if (persistedCollapsedState !== void 0 && newStickyState === false) {
        $menu.clearPersistedCollapsedState();
      }

      $menu.setPersistedStickyState(newStickyState);

      this.toggleCSS(newStickyState);
      this.toggleIndicator(newStickyState);

      this._super();
    }
  });

  $('.cms-help__menu').entwine({
    onclick: function onclick() {
      var expandedState = this.attr('aria-expanded') === 'true';

      this.attr('aria-expanded', !expandedState);
      $('.cms-help__toggle').toggleClass('cms-help__toggle--show');
    }
  });
});

/***/ }),

/***/ "./client/src/legacy/LeftAndMain.MobileMenuToggle.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _jquery = __webpack_require__(2);

var _jquery2 = _interopRequireDefault(_jquery);

var _MobileMenuToggleContainer = __webpack_require__("./client/src/components/MobileMenuToggle/MobileMenuToggleContainer.js");

var _MobileMenuToggleContainer2 = _interopRequireDefault(_MobileMenuToggleContainer);

var _MobileMenuActions = __webpack_require__("./client/src/state/mobileMenu/MobileMenuActions.js");

var _reactDom = __webpack_require__(10);

var _reactDom2 = _interopRequireDefault(_reactDom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_jquery2.default.entwine('ss', function ($) {

  $('.js-react-boot').entwine({

    onmatch: function onmatch() {
      var menuToggleWrapper = $('.cms-mobile-menu-toggle-wrapper');
      if (menuToggleWrapper.length > 0) {
        _reactDom2.default.render(React.createElement(_MobileMenuToggleContainer2.default, { store: window.ss.store, controls: 'cms-menu' }), menuToggleWrapper[0]);
      }

      var store = window.ss.store;
      var menu = $('.cms-menu');
      var menuOverlay = $('.cms-menu-mobile-overlay');
      store.subscribe(function () {
        var state = store.getState();
        var isOpen = state.mobileMenu.isOpen;
        menu.toggleClass('cms-menu--open', isOpen).attr('aria-expanded', isOpen);
        menuOverlay.attr('aria-expanded', isOpen);
      });
    }
  });

  $('.cms-menu-mobile-overlay').entwine({
    onclick: function onclick() {
      var store = window.ss.store;

      store.dispatch((0, _MobileMenuActions.closeMobileMenu)());
    }
  });
});

/***/ }),

/***/ "./client/src/legacy/LeftAndMain.Panel.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _jquery = __webpack_require__(2);

var _jquery2 = _interopRequireDefault(_jquery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_jquery2.default.entwine('ss', function ($) {
  $.entwine.warningLevel = $.entwine.WARN_LEVEL_BESTPRACTISE;

  $('.cms-panel').entwine({

    WidthExpanded: null,

    WidthCollapsed: null,

    canSetCookie: function canSetCookie() {
      return $.cookie !== void 0 && this.attr('id') !== void 0;
    },

    getPersistedCollapsedState: function getPersistedCollapsedState() {
      var isCollapsed, cookieValue;

      if (this.canSetCookie()) {
        cookieValue = $.cookie('cms-panel-collapsed-' + this.attr('id'));

        if (cookieValue !== void 0 && cookieValue !== null) {
          isCollapsed = cookieValue === 'true';
        }
      }

      return isCollapsed;
    },

    setPersistedCollapsedState: function setPersistedCollapsedState(newState) {
      if (this.canSetCookie()) {
        $.cookie('cms-panel-collapsed-' + this.attr('id'), newState, { path: '/', expires: 31 });
      }
    },

    clearPersistedCollapsedState: function clearPersistedCollapsedState() {
      if (this.canSetCookie()) {
        $.cookie('cms-panel-collapsed-' + this.attr('id'), '', { path: '/', expires: -1 });
      }
    },

    getInitialCollapsedState: function getInitialCollapsedState() {
      var isCollapsed = this.getPersistedCollapsedState();

      if (isCollapsed === void 0) {
        isCollapsed = this.hasClass('collapsed');
      }

      return isCollapsed;
    },

    onadd: function onadd() {
      var collapsedContent, container;

      if (!this.find('.cms-panel-content').length) throw new Exception('Content panel for ".cms-panel" not found');

      if (!this.find('.cms-panel-toggle').length) {
        container = $("<div class='toolbar toolbar--south cms-panel-toggle'></div>").append('<a class="toggle-expand" href="#" data-toggle="tooltip" title="' + i18n._t('Admin.EXPANDPANEL', 'Expand Panel') + '"><span>&raquo;</span></a>').append('<a class="toggle-collapse" href="#" data-toggle="tooltip" title="' + i18n._t('Admin.COLLAPSEPANEL', 'Collapse Panel') + '"><span>&laquo;</span></a>');

        this.append(container);
      }

      this.setWidthExpanded(this.find('.cms-panel-content').innerWidth());

      collapsedContent = this.find('.cms-panel-content-collapsed');
      this.setWidthCollapsed(collapsedContent.length ? collapsedContent.innerWidth() : this.find('.toggle-expand').innerWidth());

      this.togglePanel(!this.getInitialCollapsedState(), true, false);

      this._super();
    },

    togglePanel: function togglePanel(doExpand, silent, doSaveState) {
      var newWidth, collapsedContent;

      if (!silent) {
        this.trigger('beforetoggle.sspanel', doExpand);
        this.trigger(doExpand ? 'beforeexpand' : 'beforecollapse');
      }

      this.toggleClass('collapsed', !doExpand);
      newWidth = doExpand ? this.getWidthExpanded() : this.getWidthCollapsed();

      this.width(newWidth);
      collapsedContent = this.find('.cms-panel-content-collapsed');
      if (collapsedContent.length) {
        this.find('.cms-panel-content')[doExpand ? 'show' : 'hide']();
        this.find('.cms-panel-content-collapsed')[doExpand ? 'hide' : 'show']();
      }

      if (doSaveState !== false) {
        this.setPersistedCollapsedState(!doExpand);
      }

      this.trigger('toggle', doExpand);
      this.trigger(doExpand ? 'expand' : 'collapse');
    },

    expandPanel: function expandPanel(force) {
      if (!force && !this.hasClass('collapsed')) return;

      this.togglePanel(true);
    },

    collapsePanel: function collapsePanel(force) {
      if (!force && this.hasClass('collapsed')) return;

      this.togglePanel(false);
    }
  });

  $('.cms-panel.collapsed .cms-panel-toggle').entwine({
    onclick: function onclick(e) {
      this.expandPanel();
      e.preventDefault();
    }
  });

  $('.cms-panel *').entwine({
    getPanel: function getPanel() {
      return this.parents('.cms-panel:first');
    }
  });

  $('.cms-panel .toggle-expand').entwine({
    onclick: function onclick(e) {
      e.preventDefault();
      e.stopPropagation();

      this.getPanel().expandPanel();

      this._super(e);
    }
  });

  $('.cms-panel .toggle-collapse').entwine({
    onclick: function onclick(e) {
      e.preventDefault();
      e.stopPropagation();

      this.getPanel().collapsePanel();

      this._super(e);
    }
  });

  $('.cms-content-tools.collapsed').entwine({
    onclick: function onclick(e) {
      this.expandPanel();
      this._super(e);
    }
  });
});

/***/ }),

/***/ "./client/src/legacy/LeftAndMain.Preview.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _jquery = __webpack_require__(2);

var _jquery2 = _interopRequireDefault(_jquery);

var _i18n = __webpack_require__(3);

var _i18n2 = _interopRequireDefault(_i18n);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_jquery2.default.entwine('ss.preview', function ($) {
  $('.cms-preview').entwine({
    AllowedStates: ['StageLink', 'LiveLink', 'ArchiveLink'],

    CurrentStateName: null,

    CurrentSizeName: 'auto',

    IsPreviewEnabled: false,

    DefaultMode: 'split',

    Sizes: {
      auto: {
        width: '100%',
        height: '100%'
      },
      mobile: {
        width: '335px',
        height: '568px'
      },
      mobileLandscape: {
        width: '583px',
        height: '320px'
      },
      tablet: {
        width: '783px',
        height: '1024px'
      },
      tabletLandscape: {
        width: '1039px',
        height: '768px'
      },
      desktop: {
        width: '1024px',
        height: '800px'
      }
    },

    changeState: function changeState(stateName, save) {
      var self = this,
          states = this._getNavigatorStates();
      if (save !== false) {
        $.each(states, function (index, state) {
          self.saveState('state', stateName);
        });
      }

      this.setCurrentStateName(stateName);
      this._loadCurrentState();
      this.redraw();

      return this;
    },

    changeMode: function changeMode(modeName, save) {
      var container = $('.cms-container').entwine('.ss');

      if (modeName == 'split') {
        container.splitViewMode();
        this.setIsPreviewEnabled(true);
        this._loadCurrentState();
      } else if (modeName == 'content') {
        container.contentViewMode();
        this.setIsPreviewEnabled(false);
      } else if (modeName == 'preview') {
        container.previewMode();
        this.setIsPreviewEnabled(true);
        this._loadCurrentState();
      } else {
        throw 'Invalid mode: ' + modeName;
      }

      if (save !== false) this.saveState('mode', modeName);

      this.redraw();

      return this;
    },

    changeSize: function changeSize(sizeName) {
      var sizes = this.getSizes();

      this.setCurrentSizeName(sizeName);
      this.removeClass('auto desktop tablet mobile').addClass(sizeName);

      this.saveState('size', sizeName);

      this.redraw();

      return this;
    },

    redraw: function redraw() {

      if (window.debug) console.log('redraw', this.attr('class'), this.get(0));

      var currentStateName = this.getCurrentStateName();
      if (currentStateName) {
        this.find('.cms-preview-states').changeVisibleState(currentStateName);
      }

      var layoutOptions = $('.cms-container').entwine('.ss').getLayoutOptions();
      if (layoutOptions) {
        $('.preview-mode-selector').changeVisibleMode(layoutOptions.mode);
      }

      var currentSizeName = this.getCurrentSizeName();
      if (currentSizeName) {
        this.find('.preview-size-selector').changeVisibleSize(this.getCurrentSizeName());
      }

      return this;
    },

    saveState: function saveState(name, value) {
      if (this._supportsLocalStorage()) window.localStorage.setItem('cms-preview-state-' + name, value);
    },

    loadState: function loadState(name) {
      if (this._supportsLocalStorage()) return window.localStorage.getItem('cms-preview-state-' + name);
    },

    disablePreview: function disablePreview() {
      this.setPendingURL(null);
      this._loadUrl('about:blank');
      this._block();
      this.changeMode('content', false);
      this.setIsPreviewEnabled(false);
      return this;
    },

    enablePreview: function enablePreview() {
      if (!this.getIsPreviewEnabled()) {
        this.setIsPreviewEnabled(true);

        if ($.browser.msie && $.browser.version.slice(0, 3) <= 7) {
          this.changeMode('content');
        } else {
          this.changeMode(this.getDefaultMode(), false);
        }
      }
      return this;
    },

    getOrAppendFontFixStyleElement: function getOrAppendFontFixStyleElement() {
      var style = $('#FontFixStyleElement');
      if (!style.length) {
        style = $('<style type="text/css" id="FontFixStyleElement" disabled="disabled">' + ':before,:after{content:none !important}' + '</style>').appendTo('head');
      }

      return style;
    },

    onadd: function onadd() {
      var self = this,
          iframe = this.find('iframe');

      iframe.addClass('center');
      iframe.bind('load', function () {
        self._adjustIframeForPreview();

        self._loadCurrentPage();

        $(this).removeClass('loading');
      });

      if ($.browser.msie && 8 === parseInt($.browser.version, 10)) {
        iframe.bind('readystatechange', function (e) {
          if (iframe[0].readyState == 'interactive') {
            self.getOrAppendFontFixStyleElement().removeAttr('disabled');
            setTimeout(function () {
              self.getOrAppendFontFixStyleElement().attr('disabled', 'disabled');
            }, 0);
          }
        });
      }

      this._unblock();

      this.disablePreview();

      this._super();
    },

    _supportsLocalStorage: function _supportsLocalStorage() {
      var uid = new Date();
      var storage;
      var result;
      try {
        (storage = window.localStorage).setItem(uid, uid);
        result = storage.getItem(uid) == uid;
        storage.removeItem(uid);
        return result && storage;
      } catch (exception) {
        console.warn('localStorge is not available due to current browser / system settings.');
      }
    },

    onforcecontent: function onforcecontent() {
      this.changeMode('content', false);
    },

    onenable: function onenable() {
      var $viewModeSelector = $('.preview-mode-selector');

      $viewModeSelector.removeClass('split-disabled');
      $viewModeSelector.find('.disabled-tooltip').hide();
    },

    ondisable: function ondisable() {
      var $viewModeSelector = $('.preview-mode-selector');

      $viewModeSelector.addClass('split-disabled');
      $viewModeSelector.find('.disabled-tooltip').show();
    },

    _block: function _block() {
      this.find('.preview-note').show();
      this.find('.cms-preview-overlay').show();
      return this;
    },

    _unblock: function _unblock() {
      this.find('.preview-note').hide();
      this.find('.cms-preview-overlay').hide();
      return this;
    },

    _initialiseFromContent: function _initialiseFromContent() {
      var mode, size;

      if (!$('.cms-previewable').length) {
        this.disablePreview();
      } else {
        mode = this.loadState('mode');
        size = this.loadState('size');

        this._moveNavigator();
        if (!mode || mode != 'content') {
          this.enablePreview();
          this._loadCurrentState();
        }
        this.redraw();

        if (mode) this.changeMode(mode);
        if (size) this.changeSize(size);
      }
      return this;
    },

    'from .cms-container': {
      onafterstatechange: function onafterstatechange(e, data) {
        if (data.xhr.getResponseHeader('X-ControllerURL')) return;

        this._initialiseFromContent();
      }
    },

    PendingURL: null,

    oncolumnvisibilitychanged: function oncolumnvisibilitychanged() {
      var url = this.getPendingURL();
      if (url && !this.is('.column-hidden')) {
        this.setPendingURL(null);
        this._loadUrl(url);
        this._unblock();
      }
    },

    'from .cms-container .cms-edit-form': {
      onaftersubmitform: function onaftersubmitform() {
        this._initialiseFromContent();
      }
    },

    _loadUrl: function _loadUrl(url) {
      this.find('iframe').addClass('loading').attr('src', url);
      return this;
    },

    _getNavigatorStates: function _getNavigatorStates() {
      var urlMap = $.map(this.getAllowedStates(), function (name) {
        var stateLink = $('.cms-preview-states .state-name[data-name=' + name + ']');
        if (stateLink.length) {
          return {
            name: name,
            url: stateLink.attr('href'),
            active: stateLink.hasClass('active')
          };
        } else {
          return null;
        }
      });

      return urlMap;
    },

    _loadCurrentState: function _loadCurrentState() {
      if (!this.getIsPreviewEnabled()) return this;

      var states = this._getNavigatorStates();
      var currentStateName = this.getCurrentStateName();
      var currentState = null;

      if (states) {
        currentState = $.grep(states, function (state, index) {
          return currentStateName === state.name || !currentStateName && state.active;
        });
      }

      var url = null;

      if (currentState[0]) {
        url = currentState[0].url;
      } else if (states.length) {
        this.setCurrentStateName(states[0].name);
        url = states[0].url;
      } else {
        this.setCurrentStateName(null);
      }

      if (url) {
        var urlFrag = url.split('#');
        var urlBits = urlFrag.shift().split(/[?&]/);
        var urlBase = urlBits.shift();
        urlBits.push('CMSPreview=1');
        urlFrag = urlFrag.length ? '#' + urlFrag.join('#') : '';
        url = urlBase + '?' + urlBits.join('&') + urlFrag;
      }

      if (this.is('.column-hidden')) {
        this.setPendingURL(url);
        this._loadUrl('about:blank');
        this._block();
      } else {
        this.setPendingURL(null);

        if (url) {
          this._loadUrl(url);
          this._unblock();
        } else {
          this._block();
        }
      }

      return this;
    },

    _moveNavigator: function _moveNavigator() {
      var previewEl = $('.cms-preview .cms-preview-controls');
      var navigatorEl = $('.cms-edit-form .cms-navigator');

      if (navigatorEl.length && previewEl.length) {
        previewEl.html($('.cms-edit-form .cms-navigator').detach());
      } else {
        this._block();
      }
    },

    _loadCurrentPage: function _loadCurrentPage() {
      if (!this.getIsPreviewEnabled()) return;

      var doc,
          containerEl = $('.cms-container');
      try {
        doc = this.find('iframe')[0].contentDocument;
      } catch (e) {
        console.warn('Unable to access iframe, possible https mis-match');
      }
      if (!doc) {
        return;
      }

      var id = $(doc).find('meta[name=x-page-id]').attr('content');
      var editLink = $(doc).find('meta[name=x-cms-edit-link]').attr('content');
      var contentPanel = $('.cms-content');

      if (id && contentPanel.find(':input[name=ID]').val() != id) {
        $('.cms-container').entwine('.ss').loadPanel(editLink);
      }
    },

    _adjustIframeForPreview: function _adjustIframeForPreview() {
      var iframe = this.find('iframe')[0],
          doc;
      if (!iframe) {
        return;
      }

      try {
        doc = iframe.contentDocument;
      } catch (e) {
        console.warn('Unable to access iframe, possible https mis-match');
      }
      if (!doc) {
        return;
      }

      var links = doc.getElementsByTagName('A');
      for (var i = 0; i < links.length; i++) {
        var href = links[i].getAttribute('href');
        if (!href) continue;

        if (href.match(/^http:\/\//)) links[i].setAttribute('target', '_blank');
      }

      var navi = doc.getElementById('SilverStripeNavigator');
      if (navi) navi.style.display = 'none';
      var naviMsg = doc.getElementById('SilverStripeNavigatorMessage');
      if (naviMsg) naviMsg.style.display = 'none';

      this.trigger('afterIframeAdjustedForPreview', [doc]);
    }
  });

  $('.cms-edit-form').entwine({
    onadd: function onadd() {
      this._super();
      $('.cms-preview')._initialiseFromContent();
    }
  });

  $('.cms-preview-states').entwine({
    changeVisibleState: function changeVisibleState(state) {
      this.find('[data-name="' + state + '"]').addClass('active').siblings().removeClass('active');
    }
  });

  $('.cms-preview-states .state-name').entwine({
    onclick: function onclick(e) {
      if (e.which == 1) {
        var targetStateName = $(this).attr('data-name');

        this.addClass('active').siblings().removeClass('active');

        $('.cms-preview').changeState(targetStateName);

        e.preventDefault();
      }
    }
  });

  $('.preview-mode-selector').entwine({
    changeVisibleMode: function changeVisibleMode(mode) {
      this.find('select').val(mode).trigger('chosen:updated')._addIcon();
    }
  });

  $('.preview-mode-selector select').entwine({
    onchange: function onchange(e) {
      this._super(e);
      e.preventDefault();

      var targetStateName = $(this).val();
      $('.cms-preview').changeMode(targetStateName);
    }
  });

  $('.cms-container--content-mode').entwine({
    onmatch: function onmatch() {
      if ($('.cms-preview .result-selected').hasClass('font-icon-columns')) {
        statusMessage(_i18n2.default._t('Admin.DISABLESPLITVIEW', "Screen too small to show site preview in split mode"), "error");
      }
      this._super();
    }
  });

  $('.preview-size-selector').entwine({
    changeVisibleSize: function changeVisibleSize(size) {
      this.find('select').val(size).trigger('chosen:updated')._addIcon();
    }
  });

  $('.preview-size-selector select').entwine({
    onchange: function onchange(e) {
      e.preventDefault();

      var targetSizeName = $(this).val();
      $('.cms-preview').changeSize(targetSizeName);
    }
  });

  $('.preview-selector select.preview-dropdown').entwine({
    'onchosen:ready': function onchosenReady() {
      this._super();
      this._addIcon();
    },

    _addIcon: function _addIcon() {
      var selected = this.find(':selected');
      var iconClass = selected.attr('data-icon');

      var target = this.parent().find('.chosen-container a.chosen-single');
      var oldIcon = target.attr('data-icon');
      if (typeof oldIcon !== 'undefined') {
        target.removeClass(oldIcon);
      }
      target.addClass(iconClass);
      target.attr('data-icon', iconClass);

      return this;
    }
  });

  $('.preview-mode-selector .chosen-drop li:last-child').entwine({
    onmatch: function onmatch() {
      if ($('.preview-mode-selector').hasClass('split-disabled')) {
        this.parent().append('<div class="disabled-tooltip"></div>');
      } else {
        this.parent().append('<div class="disabled-tooltip" style="display: none;"></div>');
      }
    }
  });

  $('.preview-device-outer').entwine({
    onclick: function onclick() {
      this.parent('.preview__device').toggleClass('rotate');
    }
  });
});

/***/ }),

/***/ "./client/src/legacy/LeftAndMain.Tree.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _jquery = __webpack_require__(2);

var _jquery2 = _interopRequireDefault(_jquery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_jquery2.default.entwine('ss.tree', function ($) {

  $('.cms-tree').entwine({

    Hints: null,

    IsUpdatingTree: false,

    IsLoaded: false,

    onadd: function onadd() {
      this._super();

      if ($.isNumeric(this.data('jstree_instance_id'))) return;

      var hints = this.attr('data-hints');
      if (hints) this.setHints($.parseJSON(hints));

      var self = this;
      this.jstree(this.getTreeConfig()).bind('loaded.jstree', function (e, data) {
        self.setIsLoaded(true);

        data.inst._set_settings({ 'html_data': { 'ajax': {
              'url': self.data('urlTree'),
              'data': function data(node) {
                var params = self.data('searchparams') || [];

                params = $.grep(params, function (n, i) {
                  return n.name != 'ID' && n.name != 'value';
                });
                params.push({ name: 'ID', value: $(node).data("id") ? $(node).data("id") : 0 });
                params.push({ name: 'ajax', value: 1 });
                return params;
              }
            } } });

        self.updateFromEditForm();
        self.css('visibility', 'visible');

        data.inst.hide_checkboxes();
      }).bind('before.jstree', function (e, data) {
        if (data.func == 'start_drag') {
          if (!self.hasClass('draggable') || self.hasClass('multiselect')) {
            e.stopImmediatePropagation();
            return false;
          }
        }

        if ($.inArray(data.func, ['check_node', 'uncheck_node'])) {
          var node = $(data.args[0]).parents('li:first');
          var allowedChildren = node.find('li:not(.disabled)');

          if (node.hasClass('disabled') && allowedChildren == 0) {
            e.stopImmediatePropagation();
            return false;
          }
        }
      }).bind('move_node.jstree', function (e, data) {
        if (self.getIsUpdatingTree()) return;

        var movedNode = data.rslt.o,
            newParentNode = data.rslt.np,
            oldParentNode = data.inst._get_parent(movedNode),
            newParentID = $(newParentNode).data('id') || 0,
            nodeID = $(movedNode).data('id');
        var siblingIDs = $.map($(movedNode).siblings().andSelf(), function (el) {
          return $(el).data('id');
        });

        $.ajax({
          'url': $.path.addSearchParams(self.data('urlSavetreenode'), self.data('extraParams')),
          'type': 'POST',
          'data': {
            ID: nodeID,
            ParentID: newParentID,
            SiblingIDs: siblingIDs
          },
          success: function success() {
            if ($('.cms-edit-form :input[name=ID]').val() == nodeID) {
              $('.cms-edit-form :input[name=ParentID]').val(newParentID);
            }
            self.updateNodesFromServer([nodeID]);
          },
          statusCode: {
            403: function _() {
              $.jstree.rollback(data.rlbk);
            }
          }
        });
      }).bind('select_node.jstree check_node.jstree uncheck_node.jstree', function (e, data) {
        $(document).triggerHandler(e, data);
      });
    },
    onremove: function onremove() {
      this.jstree('destroy');
      this._super();
    },

    'from .cms-container': {
      onafterstatechange: function onafterstatechange(e) {
        this.updateFromEditForm();
      }
    },

    'from .cms-container form': {
      onaftersubmitform: function onaftersubmitform(e) {
        var _this = this;

        var id = $('.cms-edit-form :input[name=ID]').val();

        var node = this.find('[data-id=' + id + ']');
        var ids = [+id];
        node.find('li').each(function () {
          ids.push($(this).data('id'));
        });

        var chunks = [];
        var chunkSize = 50;
        while (ids.length) {
          var chunk = ids.slice(0, chunkSize);
          chunks.push(chunk);
          ids = ids.slice(chunkSize);
        }

        chunks.map(function (chunk) {
          return _this.updateNodesFromServer(chunk, false);
        }).reduce(function (chain, curr) {
          return chain.then(curr);
        }, Promise.resolve());
      }
    },

    getTreeConfig: function getTreeConfig() {
      var self = this;
      return {
        'core': {
          'initially_open': ['record-0'],
          'animation': 0,
          'html_titles': true
        },
        'html_data': {},
        'ui': {
          "select_limit": 1,
          'initially_select': [this.find('.current').attr('id')]
        },
        "crrm": {
          'move': {
            'check_move': function check_move(data) {
              var movedNode = $(data.o),
                  newParent = $(data.np),
                  isMovedOntoContainer = data.ot.get_container()[0] == data.np[0],
                  movedNodeClass = movedNode.getClassname(),
                  newParentClass = newParent.getClassname(),
                  hints = self.getHints(),
                  disallowedChildren = [],
                  hintKey = newParentClass ? newParentClass : 'Root',
                  hint = hints && typeof hints[hintKey] != 'undefined' ? hints[hintKey] : null;

              if (hint && movedNode.attr('class').match(/VirtualPage-([^\s]*)/)) movedNodeClass = RegExp.$1;

              if (hint) disallowedChildren = typeof hint.disallowedChildren != 'undefined' ? hint.disallowedChildren : [];
              var isAllowed = movedNode.data('id') !== 0 && !movedNode.hasClass('status-archived') && (!isMovedOntoContainer || data.p == 'inside') && !newParent.hasClass('nochildren') && (!disallowedChildren.length || $.inArray(movedNodeClass, disallowedChildren) == -1);

              return isAllowed;
            }
          }
        },
        'dnd': {
          "drop_target": false,
          "drag_target": false
        },
        'checkbox': {
          'two_state': true
        },
        'themes': {
          'theme': 'apple',
          'url': $('body').data('frameworkpath') + '/admin/thirdparty/jstree/themes/apple/style.css'
        },

        'plugins': ['html_data', 'ui', 'dnd', 'crrm', 'themes', 'checkbox']
      };
    },

    search: function search(params, callback) {
      if (params) this.data('searchparams', params);else this.removeData('searchparams');
      this.jstree('refresh', -1, callback);
    },

    getNodeByID: function getNodeByID(id) {
      return this.find('*[data-id=' + id + ']');
    },

    createNode: function createNode(html, data, callback) {
      var self = this,
          parentNode = data.ParentID !== void 0 ? self.getNodeByID(data.ParentID) : false,
          newNode = $(html);

      var properties = { data: '' };
      if (newNode.hasClass('jstree-open')) {
        properties.state = 'open';
      } else if (newNode.hasClass('jstree-closed')) {
        properties.state = 'closed';
      }
      this.jstree('create_node', parentNode.length ? parentNode : -1, 'last', properties, function (node) {
        var origClasses = node.attr('class');

        for (var i = 0; i < newNode[0].attributes.length; i++) {
          var attr = newNode[0].attributes[i];
          node.attr(attr.name, attr.value);
        }

        node.addClass(origClasses).html(newNode.html());
        callback(node);
      });
    },

    updateNode: function updateNode(node, html, data) {
      html = html.replace(/<!--[\s\S]*?-->/g, '');

      var self = this,
          newNode = $(html);

      var nextNode = data.NextID ? this.getNodeByID(data.NextID) : false;
      var prevNode = data.PrevID ? this.getNodeByID(data.PrevID) : false;
      var parentNode = data.ParentID ? this.getNodeByID(data.ParentID) : false;

      $.each(['id', 'style', 'class', 'data-pagetype'], function (i, attrName) {
        node.attr(attrName, newNode.attr(attrName));
      });

      var origChildren = node.children('ul').detach();
      node.html(newNode.html()).append(origChildren);

      if (nextNode && nextNode.length) {
        this.jstree('move_node', node, nextNode, 'before');
      } else if (prevNode && prevNode.length) {
        this.jstree('move_node', node, prevNode, 'after');
      } else {
        this.jstree('move_node', node, parentNode.length ? parentNode : -1);
      }
    },

    updateFromEditForm: function updateFromEditForm() {
      var node,
          id = $('.cms-edit-form :input[name=ID]').val();
      if (id) {
        node = this.getNodeByID(id);
        if (node.length) {
          this.jstree('deselect_all');
          this.jstree('select_node', node);
        } else {
          this.updateNodesFromServer([id]);
        }
      } else {
        this.jstree('deselect_all');
      }
    },

    updateNodesFromServer: function updateNodesFromServer(ids) {
      var _this2 = this;

      var blocking = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

      if (!this.getIsLoaded()) return;

      if (blocking && this.getIsUpdatingTree()) return;

      var self = this,
          i,
          includesNewNode = false;
      this.setIsUpdatingTree(true);
      self.jstree('save_selected');

      var correctStateFn = function correctStateFn(node) {
        self.getNodeByID(node.data('id')).not(node).remove();

        self.jstree('deselect_all');
        self.jstree('select_node', node);
      };

      self.jstree('open_node', this.getNodeByID(0));
      self.jstree('save_opened');
      self.jstree('save_selected');

      return new Promise(function (resolve) {
        $.ajax({
          url: $.path.addSearchParams(_this2.data('urlUpdatetreenodes'), 'ids=' + ids.join(',')),
          dataType: 'json',
          success: function success(data, xhr) {
            resolve(data);
            $.each(data, function (nodeId, nodeData) {
              var node = self.getNodeByID(nodeId);

              if (!nodeData) {
                self.jstree('delete_node', node);
                return;
              }

              if (node.length) {
                self.updateNode(node, nodeData.html, nodeData);
                setTimeout(function () {
                  correctStateFn(node);
                }, 500);
              } else {
                includesNewNode = true;

                if (nodeData.ParentID && !self.find('li[data-id=' + nodeData.ParentID + ']').length) {
                  self.jstree('load_node', -1, function () {
                    newNode = self.find('li[data-id=' + nodeId + ']');
                    correctStateFn(newNode);
                  });
                } else {
                  self.createNode(nodeData.html, nodeData, function (newNode) {
                    correctStateFn(newNode);
                  });
                }
              }
            });

            if (!includesNewNode) {
              self.jstree('deselect_all');
              self.jstree('reselect');
              self.jstree('reopen');
            }
          },
          complete: function complete() {
            self.setIsUpdatingTree(false);
          }
        });
      });
    }

  });

  $('.cms-tree.multiple').entwine({
    onmatch: function onmatch() {
      this._super();
      this.jstree('show_checkboxes');
    },
    onunmatch: function onunmatch() {
      this._super();
      this.jstree('uncheck_all');
      this.jstree('hide_checkboxes');
    },

    getSelectedIDs: function getSelectedIDs() {
      return $(this).jstree('get_checked').not('.disabled').map(function () {
        return $(this).data('id');
      }).get();
    }
  });

  $('.cms-tree li').entwine({
    setEnabled: function setEnabled(bool) {
      this.toggleClass('disabled', !bool);
    },

    getClassname: function getClassname() {
      var matches = this.attr('class').match(/class-([^\s]*)/i);
      return matches ? matches[1] : '';
    },

    getID: function getID() {
      return this.data('id');
    }
  });
});

/***/ }),

/***/ "./client/src/legacy/LeftAndMain.TreeDropdownField.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _jquery = __webpack_require__(2);

var _jquery2 = _interopRequireDefault(_jquery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_jquery2.default.entwine('ss', function ($) {
  $('.TreeDropdownField').entwine({
    'from .cms-container form': {
      onaftersubmitform: function onaftersubmitform(e) {
        this.find('.tree-holder').empty();
        this._super();
      }
    }
  });
});

/***/ }),

/***/ "./client/src/legacy/LeftAndMain.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(jQuery) {

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _jquery = __webpack_require__(2);

var _jquery2 = _interopRequireDefault(_jquery);

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _reactDom = __webpack_require__(10);

var _reactDom2 = _interopRequireDefault(_reactDom);

var _IframeDialog = __webpack_require__("./client/src/components/IframeDialog/IframeDialog.js");

var _IframeDialog2 = _interopRequireDefault(_IframeDialog);

var _Search = __webpack_require__(31);

var _Search2 = _interopRequireDefault(_Search);

var _Loading = __webpack_require__(30);

var _Loading2 = _interopRequireDefault(_Loading);

var _schemaFieldValues = __webpack_require__(13);

var _Injector = __webpack_require__(9);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

__webpack_require__("./client/src/legacy/ssui.core.js");

_jquery2.default.noConflict();

window.ss = window.ss || {};

window.ss.debounce = function (func, wait, immediate) {
  var timeout, context, args;

  var later = function later() {
    timeout = null;
    if (!immediate) func.apply(context, args);
  };

  return function () {
    var callNow = immediate && !timeout;

    context = this;
    args = arguments;

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);

    if (callNow) {
      func.apply(context, args);
    }
  };
};

(0, _jquery2.default)(window).bind('resize.leftandmain', function (e) {
  (0, _jquery2.default)('.cms-container').trigger('windowresize');
});

_jquery2.default.entwine.warningLevel = _jquery2.default.entwine.WARN_LEVEL_BESTPRACTISE;

_jquery2.default.entwine('ss', function ($) {
  $(window).on("message", function (e) {
    var target,
        event = e.originalEvent,
        data = null;

    try {
      data = _typeof(event.data) === 'object' ? event.data : JSON.parse(event.data);
    } catch (e) {}

    if (!data || $.path.parseUrl(window.location.href).domain !== $.path.parseUrl(event.origin).domain) return;

    target = typeof data.target === 'undefined' ? $(window) : $(data.target);

    switch (data.type) {
      case 'event':
        target.trigger(data.event, data.data);
        break;
      case 'callback':
        target[data.callback].call(target, data.data);
        break;
    }
  });

  var positionLoadingSpinner = function positionLoadingSpinner() {
    var offset = 120;
    var spinner = $('.ss-loading-screen .loading-animation');
    var top = ($(window).height() - spinner.height()) / 2;
    spinner.css('top', top + offset);
    spinner.show();
  };

  var applyChosen = function applyChosen(el) {
    if (el.is(':visible')) {
      el.addClass('has-chosen').chosen({
        allow_single_deselect: true,
        disable_search_threshold: 20,
        display_disabled_options: true,
        width: '100%'
      });
    } else {
      setTimeout(function () {
        el.show();
        applyChosen(el);
      }, 500);
    }
  };

  var isSameUrl = function isSameUrl(url1, url2) {
    var baseUrl = $('base').attr('href');
    url1 = $.path.isAbsoluteUrl(url1) ? url1 : $.path.makeUrlAbsolute(url1, baseUrl), url2 = $.path.isAbsoluteUrl(url2) ? url2 : $.path.makeUrlAbsolute(url2, baseUrl);
    var url1parts = $.path.parseUrl(url1),
        url2parts = $.path.parseUrl(url2);
    return url1parts.pathname.replace(/\/*$/, '') == url2parts.pathname.replace(/\/*$/, '') && url1parts.search == url2parts.search;
  };

  var ajaxCompleteEvent = window.ss.debounce(function () {
    $(window).trigger('ajaxComplete');
  }, 1000, true);

  $(window).bind('resize', positionLoadingSpinner).trigger('resize');

  $(document).ajaxComplete(function (e, xhr, settings) {
    var origUrl = document.URL,
        url = xhr.getResponseHeader('X-ControllerURL'),
        destUrl = settings.url,
        msg = xhr.getResponseHeader('X-Status') !== null ? xhr.getResponseHeader('X-Status') : xhr.statusText,
        msgType = xhr.status < 200 || xhr.status > 399 ? 'bad' : 'good',
        ignoredMessages = ['OK', 'success', 'HTTP/2.0 200'];

    if (url !== null && (!isSameUrl(origUrl, url) || !isSameUrl(destUrl, url))) {
      window.ss.router.show(url, {
        id: new Date().getTime() + String(Math.random()).replace(/\D/g, ''),
        pjax: xhr.getResponseHeader('X-Pjax') ? xhr.getResponseHeader('X-Pjax') : settings.headers['X-Pjax']
      });
    }

    if (xhr.getResponseHeader('X-Reauthenticate')) {
      $('.cms-container').showLoginDialog();
      return;
    }

    if (xhr.status !== 0 && msg && $.inArray(msg, ignoredMessages) === -1) {
      statusMessage(decodeURIComponent(msg), msgType);
    }

    ajaxCompleteEvent(this);
  });

  $('.cms-container').entwine({
    StateChangeXHR: null,

    FragmentXHR: {},

    StateChangeCount: 0,

    LayoutOptions: {
      minContentWidth: 940,
      minPreviewWidth: 400,
      mode: 'content'
    },

    onadd: function onadd() {
      if ($.browser.msie && parseInt($.browser.version, 10) < 8) {
        $('.ss-loading-screen').append('<p class="ss-loading-incompat-warning"><span class="notice">' + 'Your browser is not compatible with the CMS interface. Please use Internet Explorer 8+, Google Chrome or Mozilla Firefox.' + '</span></p>').css('z-index', $('.ss-loading-screen').css('z-index') + 1);
        $('.loading-animation').remove();

        this._super();
        return;
      }

      this.redraw();

      $('.ss-loading-screen').hide();
      $('body').removeClass('loading');
      $(window).unbind('resize', positionLoadingSpinner);
      this.restoreTabState();
      this._super();
    },

    'onwindowresize': function onwindowresize() {
      this.redraw();
    },

    'from .cms-panel': {
      ontoggle: function ontoggle() {
        this.redraw();
      }
    },

    'from .cms-container': {
      onaftersubmitform: function onaftersubmitform() {
        this.redraw();
      }
    },

    updateLayoutOptions: function updateLayoutOptions(newSpec) {
      var spec = this.getLayoutOptions();

      var dirty = false;

      for (var k in newSpec) {
        if (spec[k] !== newSpec[k]) {
          spec[k] = newSpec[k];
          dirty = true;
        }
      }

      if (dirty) this.redraw();
    },

    clearViewMode: function clearViewMode() {
      this.removeClass('cms-container--split-mode');
      this.removeClass('cms-container--preview-mode');
      this.removeClass('cms-container--content-mode');
    },

    splitViewMode: function splitViewMode() {
      this.updateLayoutOptions({
        mode: 'split'
      });
    },

    contentViewMode: function contentViewMode() {
      this.updateLayoutOptions({
        mode: 'content'
      });
    },

    previewMode: function previewMode() {
      this.updateLayoutOptions({
        mode: 'preview'
      });
    },

    RedrawSuppression: false,

    redraw: function redraw() {
      if (this.getRedrawSuppression()) return;

      if (window.debug) console.log('redraw', this.attr('class'), this.get(0));

      var changed = this.setProperMode();

      if (!changed) {
        this.find('.cms-panel-layout').redraw();
        this.find('.cms-content-fields[data-layout-type]').redraw();
        this.find('.cms-edit-form[data-layout-type]').redraw();
        this.find('.cms-preview').redraw();
        this.find('.cms-content').redraw();
      }
    },

    setProperMode: function setProperMode() {
      var options = this.getLayoutOptions();
      var mode = options.mode;
      this.clearViewMode();

      var content = this.find('.cms-content');
      var preview = this.find('.cms-preview');

      content.css({ 'min-width': 0 });
      preview.css({ 'min-width': 0 });

      if (content.width() + preview.width() >= options.minContentWidth + options.minPreviewWidth) {
        content.css({ 'min-width': options.minContentWidth });
        preview.css({ 'min-width': options.minPreviewWidth });
        preview.trigger('enable');
      } else {
        preview.trigger('disable');
        if (mode == 'split') {
          preview.trigger('forcecontent');
          return true;
        }
      }

      this.addClass('cms-container--' + mode + '-mode');
      return false;
    },

    checkCanNavigate: function checkCanNavigate(selectors) {
      var contentEls = this._findFragments(selectors || ['Content']),
          trackedEls = contentEls.find(':data(changetracker)').add(contentEls.filter(':data(changetracker)')),
          safe = true;

      if (!trackedEls.length) {
        return true;
      }

      trackedEls.each(function () {
        if (!$(this).confirmUnsavedChanges()) {
          safe = false;
        }
      });

      return safe;
    },

    loadPanel: function loadPanel(url) {
      var title = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
      var data = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var forceReload = arguments[3];
      var forceReferer = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : document.URL;

      if (!this.checkCanNavigate(data.pjax ? data.pjax.split(',') : ['Content'])) {
        return;
      }

      this.saveTabState();

      data.__forceReferer = forceReferer;

      if (forceReload) {
        data.__forceReload = 1 + Math.random();
      }

      window.ss.router.show(url, data);
    },

    reloadCurrentPanel: function reloadCurrentPanel() {
      this.loadPanel(document.URL, null, null, true);
    },

    submitForm: function submitForm(form, button, callback, ajaxOptions) {
      var self = this;

      if (!button) button = this.find('.btn-toolbar :submit[name=action_save]');

      if (!button) button = this.find('.btn-toolbar :submit:first');

      form.trigger('beforesubmitform');
      this.trigger('submitform', { form: form, button: button });

      $(button).addClass('btn--loading loading');

      if ($(button).is('button')) {
        $(button).data('original-text', $(button).text());

        $(button).append($('<div class="btn__loading-icon">' + '<span class="btn__circle btn__circle--1" />' + '<span class="btn__circle btn__circle--2" />' + '<span class="btn__circle btn__circle--3" />' + '</div>'));

        $(button).css($(button).outerWidth() + 'px');
      }

      var validationResult = form.validate();

      var clearButton = function clearButton() {
        $(button).removeClass('btn--loading loading');
        $(button).find('.btn__loading-icon').remove();
        $(button).css('width', 'auto');
        $(button).text($(button).data('original-text'));
      };

      if (typeof validationResult !== 'undefined' && !validationResult) {
        statusMessage("Validation failed.", "bad");
        clearButton();
      }

      var formData = form.serializeArray();

      formData.push({ name: $(button).attr('name'), value: '1' });

      formData.push({ name: 'BackURL', value: document.URL.replace(/\/$/, '') });

      this.saveTabState();

      jQuery.ajax(jQuery.extend({
        headers: { "X-Pjax": "CurrentForm,Breadcrumbs" },
        url: form.attr('action'),
        data: formData,
        type: 'POST',
        complete: function complete() {
          clearButton();
        },
        success: function success(data, status, xhr) {
          clearButton();
          form.removeClass('changed');
          if (callback) callback(data, status, xhr);

          var newContentEls = self.handleAjaxResponse(data, status, xhr);
          if (!newContentEls) return;

          newContentEls.filter('form').trigger('aftersubmitform', { status: status, xhr: xhr, formData: formData });
        }
      }, ajaxOptions));

      return false;
    },

    LastState: null,

    PauseState: false,

    handleStateChange: function handleStateChange(event) {
      var historyState = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : window.history.state;

      if (this.getPauseState()) {
        return;
      }

      if (this.getStateChangeXHR()) {
        this.getStateChangeXHR().abort();
      }

      var self = this,
          fragments = historyState.pjax || 'Content',
          headers = {},
          fragmentsArr = fragments.split(','),
          contentEls = this._findFragments(fragmentsArr);

      this.setStateChangeCount(this.getStateChangeCount() + 1);

      if (!this.checkCanNavigate()) {
        var lastState = this.getLastState();

        this.setPauseState(true);

        if (lastState && lastState.path) {
          window.ss.router.show(lastState.path);
        } else {
          window.ss.router.back();
        }

        this.setPauseState(false);

        return;
      }

      this.setLastState(historyState);

      if (contentEls.length < fragmentsArr.length) {
        fragments = 'Content', fragmentsArr = ['Content'];
        contentEls = this._findFragments(fragmentsArr);
      }

      this.trigger('beforestatechange', { state: historyState, element: contentEls });

      headers['X-Pjax'] = fragments;

      if (typeof historyState.__forceReferer !== 'undefined') {
        var url = historyState.__forceReferer;

        try {
          url = decodeURI(url);
        } catch (e) {} finally {
          headers['X-Backurl'] = encodeURI(url);
        }
      }

      contentEls.addClass('loading');

      var promise = $.ajax({
        headers: headers,
        url: historyState.path || document.URL
      }).done(function (data, status, xhr) {
        var els = self.handleAjaxResponse(data, status, xhr, historyState);
        self.trigger('afterstatechange', { data: data, status: status, xhr: xhr, element: els, state: historyState });
      }).always(function () {
        self.setStateChangeXHR(null);

        contentEls.removeClass('loading');
      });

      this.setStateChangeXHR(promise);

      return promise;
    },

    loadFragment: function loadFragment(url, pjaxFragments) {

      var self = this,
          xhr,
          headers = {},
          baseUrl = $('base').attr('href'),
          fragmentXHR = this.getFragmentXHR();

      if (typeof fragmentXHR[pjaxFragments] !== 'undefined' && fragmentXHR[pjaxFragments] !== null) {
        fragmentXHR[pjaxFragments].abort();
        fragmentXHR[pjaxFragments] = null;
      }

      url = $.path.isAbsoluteUrl(url) ? url : $.path.makeUrlAbsolute(url, baseUrl);
      headers['X-Pjax'] = pjaxFragments;

      xhr = $.ajax({
        headers: headers,
        url: url,
        success: function success(data, status, xhr) {
          var elements = self.handleAjaxResponse(data, status, xhr, null);

          self.trigger('afterloadfragment', { data: data, status: status, xhr: xhr, elements: elements });
        },
        error: function error(xhr, status, _error) {
          self.trigger('loadfragmenterror', { xhr: xhr, status: status, error: _error });
        },
        complete: function complete() {
          var fragmentXHR = self.getFragmentXHR();
          if (typeof fragmentXHR[pjaxFragments] !== 'undefined' && fragmentXHR[pjaxFragments] !== null) {
            fragmentXHR[pjaxFragments] = null;
          }
        }
      });

      fragmentXHR[pjaxFragments] = xhr;

      return xhr;
    },

    handleAjaxResponse: function handleAjaxResponse(data, status, xhr, state) {
      var self = this,
          url,
          selectedTabs,
          guessFragment,
          fragment,
          $data;

      if (xhr.getResponseHeader('X-Reload') && xhr.getResponseHeader('X-ControllerURL')) {
        var baseUrl = $('base').attr('href'),
            rawURL = xhr.getResponseHeader('X-ControllerURL'),
            url = $.path.isAbsoluteUrl(rawURL) ? rawURL : $.path.makeUrlAbsolute(rawURL, baseUrl);

        document.location.href = url;
        return;
      }

      if (!data) return;

      var title = xhr.getResponseHeader('X-Title');
      if (title) document.title = decodeURIComponent(title.replace(/\+/g, ' '));

      var newFragments = {},
          newContentEls;

      if (xhr.getResponseHeader('Content-Type').match(/^((text)|(application))\/json[ \t]*;?/i)) {
        newFragments = data;
      } else {
        fragment = document.createDocumentFragment();

        jQuery.clean([data], document, fragment, []);
        $data = $(jQuery.merge([], fragment.childNodes));

        guessFragment = 'Content';
        if ($data.is('form') && !$data.is('[data-pjax-fragment~=Content]')) guessFragment = 'CurrentForm';

        newFragments[guessFragment] = $data;
      }

      this.setRedrawSuppression(true);
      try {
        $.each(newFragments, function (newFragment, html) {
          var contentEl = $('[data-pjax-fragment]').filter(function () {
            return $.inArray(newFragment, $(this).data('pjaxFragment').split(' ')) != -1;
          }),
              newContentEl = $(html);

          if (newContentEls) newContentEls.add(newContentEl);else newContentEls = newContentEl;

          if (newContentEl.find('.cms-container').length) {
            throw 'Content loaded via ajax is not allowed to contain tags matching the ".cms-container" selector to avoid infinite loops';
          }

          var origStyle = contentEl.attr('style');
          var origParent = contentEl.parent();
          var layoutClasses = ['east', 'west', 'center', 'north', 'south', 'column-hidden'];
          var elemClasses = contentEl.attr('class');
          var origLayoutClasses = [];
          if (elemClasses) {
            origLayoutClasses = $.grep(elemClasses.split(' '), function (val) {
              return $.inArray(val, layoutClasses) >= 0;
            });
          }

          newContentEl.removeClass(layoutClasses.join(' ')).addClass(origLayoutClasses.join(' '));
          if (origStyle) newContentEl.attr('style', origStyle);

          var styles = newContentEl.find('style').detach();
          if (styles.length) $(document).find('head').append(styles);

          contentEl.replaceWith(newContentEl);
        });

        var newForm = newContentEls.filter('form');
        if (newForm.hasClass('cms-tabset')) newForm.removeClass('cms-tabset').addClass('cms-tabset');
      } finally {
        this.setRedrawSuppression(false);
      }

      this.redraw();
      this.restoreTabState(state && typeof state.tabState !== 'undefined' ? state.tabState : null);

      return newContentEls;
    },

    _findFragments: function _findFragments(fragments) {
      return $('[data-pjax-fragment]').filter(function () {
        var i,
            nodeFragments = $(this).data('pjaxFragment').split(' ');
        for (i in fragments) {
          if ($.inArray(fragments[i], nodeFragments) != -1) return true;
        }
        return false;
      });
    },

    refresh: function refresh() {
      $(window).trigger('statechange');

      $(this).redraw();
    },

    saveTabState: function saveTabState() {
      if (typeof window.sessionStorage == "undefined" || window.sessionStorage === null) return;

      var selectedTabs = [],
          url = this._tabStateUrl();
      this.find('.cms-tabset,.ss-tabset').each(function (i, el) {
        var id = $(el).attr('id');
        if (!id) return;
        if (!$(el).data('tabs')) return;
        if ($(el).data('ignoreTabState') || $(el).getIgnoreTabState()) return;

        selectedTabs.push({ id: id, selected: $(el).tabs('option', 'selected') });
      });

      if (selectedTabs) {
        var tabsUrl = 'tabs-' + url;
        try {
          window.sessionStorage.setItem(tabsUrl, JSON.stringify(selectedTabs));
        } catch (err) {
          if (err.code === DOMException.QUOTA_EXCEEDED_ERR && window.sessionStorage.length === 0) {
            return;
          } else {
            throw err;
          }
        }
      }
    },

    restoreTabState: function restoreTabState(overrideStates) {
      var self = this,
          url = this._tabStateUrl(),
          hasSessionStorage = typeof window.sessionStorage !== "undefined" && window.sessionStorage,
          sessionData = hasSessionStorage ? window.sessionStorage.getItem('tabs-' + url) : null,
          sessionStates = sessionData ? JSON.parse(sessionData) : false;

      this.find('.cms-tabset, .ss-tabset').each(function () {
        var index,
            tab,
            tabset = $(this),
            tabsetId = tabset.attr('id'),
            forcedTab = tabset.children('ul').children('li.ss-tabs-force-active');

        if (!tabset.data('tabs')) {
          return;
        }

        tabset.tabs('refresh');

        if (forcedTab.length) {
          index = forcedTab.first().index();
        } else if (overrideStates && overrideStates[tabsetId]) {
          tab = tabset.find(overrideStates[tabsetId].tabSelector);
          if (tab.length) {
            index = tab.index();
          }
        } else if (sessionStates) {
          $.each(sessionStates, function (i, state) {
            if (tabsetId == state.id) {
              index = state.selected;
            }
          });
        }
        if (index !== null) {
          tabset.tabs('option', 'active', index);
          self.trigger('tabstaterestored');
        }
      });
    },

    clearTabState: function clearTabState(url) {
      if (typeof window.sessionStorage == "undefined") return;

      var s = window.sessionStorage;
      if (url) {
        s.removeItem('tabs-' + url);
      } else {
        for (var i = 0; i < s.length; i++) {
          if (s.key(i).match(/^tabs-/)) s.removeItem(s.key(i));
        }
      }
    },

    clearCurrentTabState: function clearCurrentTabState() {
      this.clearTabState(this._tabStateUrl());
    },

    _tabStateUrl: function _tabStateUrl() {
      return window.location.href.replace(/\?.*/, '').replace(/#.*/, '').replace($('base').attr('href'), '');
    },

    showLoginDialog: function showLoginDialog() {
      var dialog = $('.leftandmain__login-dialog');
      if (dialog.length) {
        dialog.destroy();
      }

      dialog = $('<div class="leftandmain__login-dialog" />');
      $('body').append(dialog);
      dialog.open();
    }
  });

  $('.leftandmain__login-dialog').entwine({
    destroy: function destroy() {
      this.close();
      this.remove();
    },
    close: function close() {
      this.renderModal(false);
    },
    open: function open() {
      this.renderModal(true);
    },
    renderModal: function renderModal(isOpen) {
      var tempid = $('body').data('member-tempid');
      var url = $.path.addSearchParams('CMSSecurity/login', {
        tempid: tempid,
        BackURL: window.location.href
      });

      _reactDom2.default.render(_react2.default.createElement(_IframeDialog2.default, {
        title: i18n._t('Admin.CMS_LOGIN_TITLE', 'Login'),
        className: 'login-dialog',
        bodyClassName: 'login-dialog__body',
        iframeId: 'login-dialog-iframe',
        iframeClassName: 'login-dialog__body__iframe',
        isOpen: isOpen,
        url: url
      }), this[0]);
    },
    reauthenticate: function reauthenticate(data) {
      if (typeof data.SecurityID !== 'undefined') {
        $(':input[name=SecurityID]').val(data.SecurityID);
      }

      if (typeof data.TempID !== 'undefined') {
        $('body').data('member-tempid', data.TempID);
      }
      this.close();
    }
  });

  $('form.loading,.cms-content.loading,.cms-content-fields.loading,.cms-content-view.loading,.ss-gridfield-item.loading').entwine({
    onmatch: function onmatch() {
      this._super();
      var container = $('<div class="cms-loading-container"/>');
      this.append(container);
      _reactDom2.default.render(_react2.default.createElement(_Loading2.default, null), container[0]);
    },
    onunmatch: function onunmatch() {
      this._super();
      var container = this.find('.cms-loading-container');
      if (container && container.length) {
        _reactDom2.default.unmountComponentAtNode(container[0]);
        container.remove();
      }
    }
  });

  $('.cms .cms-panel-link').entwine({
    onclick: function onclick(e) {
      if ($(this).hasClass('external-link')) {
        e.stopPropagation();

        return;
      }

      var href = this.attr('href'),
          url = href && !href.match(/^#/) ? href : this.data('href'),
          data = { pjax: this.data('pjaxTarget') };

      $('.cms-container').loadPanel(url, null, data);
      e.preventDefault();
    }
  });

  $('.cms button.action.discard-confirmation').entwine({
    onclick: function onclick(e) {
      if (!$('.cms-container').checkCanNavigate()) {
        e.preventDefault();
      }
    }
  });

  $('.cms .ss-ui-button-ajax').entwine({
    onclick: function onclick(e) {
      $(this).removeClass('ui-button-text-only');
      $(this).addClass('ss-ui-button-loading ui-button-text-icons');

      var loading = $(this).find(".ss-ui-loading-icon");

      if (loading.length < 1) {
        loading = $("<span></span>").addClass('ss-ui-loading-icon ui-button-icon-primary ui-icon');

        $(this).prepend(loading);
      }

      loading.show();

      var href = this.attr('href'),
          url = href ? href : this.data('href');

      jQuery.ajax({
        url: url,

        complete: function complete(xmlhttp, status) {
          var msg = xmlhttp.getResponseHeader('X-Status') ? xmlhttp.getResponseHeader('X-Status') : xmlhttp.responseText;

          try {
            if (typeof msg != "undefined" && msg !== null) eval(msg);
          } catch (e) {}

          loading.hide();

          $(".cms-container").refresh();

          $(this).removeClass('ss-ui-button-loading ui-button-text-icons');
          $(this).addClass('ui-button-text-only');
        },
        dataType: 'html'
      });
      e.preventDefault();
    }
  });

  $('.cms .ss-ui-dialog-link').entwine({
    UUID: null,
    onmatch: function onmatch() {
      this._super();
      this.setUUID(new Date().getTime());
    },
    onunmatch: function onunmatch() {
      this._super();
    },
    onclick: function onclick() {
      this._super();

      var self = this,
          id = 'ss-ui-dialog-' + this.getUUID();
      var dialog = $('#' + id);
      if (!dialog.length) {
        dialog = $('<div class="ss-ui-dialog" id="' + id + '" />');
        $('body').append(dialog);
      }

      var extraClass = this.data('popupclass') ? this.data('popupclass') : '';

      dialog.ssdialog({ iframeUrl: this.attr('href'), autoOpen: true, dialogExtraClass: extraClass });
      return false;
    }
  });

  $('.cms .field.date input.text').entwine({
    onmatch: function onmatch() {
      var holder = $(this).parents('.field.date:first'),
          config = holder.data();
      if (!config.showcalendar) {
        this._super();
        return;
      }

      config.showOn = 'button';
      if (config.locale && $.datepicker.regional[config.locale]) {
        config = $.extend(config, $.datepicker.regional[config.locale], {});
      }

      if (!this.prop('disabled') && !this.prop('readonly')) {
        $(this).datepicker(config);
      }

      this._super();
    },
    onunmatch: function onunmatch() {
      this._super();
    }
  });

  $('.cms .field.dropdown select, .cms .field select[multiple], .form__fieldgroup-item select.dropdown').entwine({
    onmatch: function onmatch() {
      if (this.is('.no-chosen')) {
        this._super();
        return;
      }

      if (!this.data('placeholder')) this.data('placeholder', ' ');

      this.removeClass('has-chosen').chosen("destroy");
      this.siblings('.chosen-container').remove();

      applyChosen(this);

      this._super();
    },
    onunmatch: function onunmatch() {
      this._super();
    }
  });

  $(".cms-panel-layout").entwine({
    redraw: function redraw() {
      if (window.debug) console.log('redraw', this.attr('class'), this.get(0));
    }
  });

  $('.cms .grid-field:not([cms-loading-ignore-url-params])').entwine({
    showDetailView: function showDetailView(url) {
      var params = window.location.search.replace(/^\?/, '');
      if (params) url = $.path.addSearchParams(url, params);
      $('.cms-container').loadPanel(url);
    }
  });

  $(".cms-search-form button[type=reset], .cms-search-form input[type=reset]").entwine({
    onclick: function onclick(e) {
      e.preventDefault();

      var form = $(this).parents('form');

      form.clearForm();
      form.find(".dropdown select").prop('selectedIndex', 0).trigger("chosen:updated");
      form.submit();
    }
  });

  window._panelDeferredCache = {};
  $('.cms-panel-deferred').entwine({
    onadd: function onadd() {
      this._super();
      this.redraw();
    },
    onremove: function onremove() {
      if (window.debug) console.log('saving', this.data('url'), this);

      if (!this.data('deferredNoCache')) window._panelDeferredCache[this.data('url')] = this.html();
      this._super();
    },
    redraw: function redraw() {
      if (window.debug) console.log('redraw', this.attr('class'), this.get(0));

      var self = this,
          url = this.data('url');
      if (!url) throw 'Elements of class .cms-panel-deferred need a "data-url" attribute';

      this._super();

      if (!this.data('deferredNoCache') && typeof window._panelDeferredCache[url] !== 'undefined') {
        this.html(window._panelDeferredCache[url]);
      } else {
        this.addClass('loading');
        $.ajax({
          url: url,
          complete: function complete() {
            self.removeClass('loading');
          },
          success: function success(data, status, xhr) {
            self.html(data);
          }
        });
      }
    }
  });

  $('.cms-tabset').entwine({
    onadd: function onadd() {
      this.redrawTabs();
      this._super();
    },
    onremove: function onremove() {
      if (this.data('tabs')) this.tabs('destroy');
      this._super();
    },
    redrawTabs: function redrawTabs() {
      this.rewriteHashlinks();

      var id = this.attr('id'),
          activeTab = this.find('ul:first .ui-tabs-active');

      if (!this.data('tabs')) this.tabs({
        active: activeTab.index() != -1 ? activeTab.index() : 0,
        beforeLoad: function beforeLoad(e, ui) {
          return false;
        },
        beforeActivate: function beforeActivate(e, ui) {
          var link = ui.oldTab.find('.cms-panel-link');

          if (link && link.length === 1) {
            return false;
          }
        },
        activate: function activate(e, ui) {
          var actions = $(this).closest('form').find('.btn-toolbar');
          if ($(ui.newTab).closest('li').hasClass('readonly')) {
            actions.fadeOut();
          } else {
            actions.show();
          }
        }
      });
      this.trigger('afterredrawtabs');
    },

    rewriteHashlinks: function rewriteHashlinks() {
      $(this).find('ul a').each(function () {
        if (!$(this).attr('href')) return;
        var matches = $(this).attr('href').match(/#.*/);
        if (!matches) return;
        $(this).attr('href', document.location.href.replace(/#.*/, '') + matches[0]);
      });
    }
  });

  $('#filters-button').entwine({
    onmatch: function onmatch() {
      this._super();

      this.data('collapsed', true);
      this.data('animating', false);
    },
    onunmatch: function onunmatch() {
      this._super();
    },
    showHide: function showHide() {
      var self = this,
          $filters = $('.cms-content-filters').first(),
          collapsed = this.data('collapsed');

      if (collapsed) {
        this.addClass('active');
        $filters.removeClass('cms-content-filters--hidden');
      } else {
        this.removeClass('active');
        $filters.addClass('cms-content-filters--hidden');
      }
      self.data('collapsed', !collapsed);
    },
    onclick: function onclick() {
      this.showHide();
    }
  });

  $('.js-injector-boot .search-holder').entwine({
    Component: null,

    onmatch: function onmatch() {
      this._super();

      var cmsContent = this.closest('.cms-content').attr('id');
      var context = cmsContent ? { context: cmsContent } : {};

      var Search = (0, _Injector.loadComponent)('Search', context);
      this.setComponent(Search);

      this.refresh();

      var props = this.data('schema');
    },
    onunmatch: function onunmatch() {
      this._super();

      var container = this[0];
      if (container) {
        _reactDom2.default.unmountComponentAtNode(container);
      }
    },
    onfocusin: function onfocusin() {
      this.css('z-index', '100');
    },
    onfocusout: function onfocusout() {
      this.css('z-index', '');
    },
    close: function close() {
      $('#filters-button').showHide();
      var props = this.data('schema');

      if (props.filters) {
        var url = $('.cms-search-form').attr('action');
        var container = this.closest('.cms-container');
        container.loadPanel(url, "", {}, true);
      }
    },
    search: function search(data) {
      this._super();
      var url = $('.cms-search-form').attr('action');

      if (url && data) {
        var params = [];
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = Object.entries(data)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var _ref = _step.value;

            var _ref2 = _slicedToArray(_ref, 2);

            var key = _ref2[0];
            var value = _ref2[1];

            if (value) {
              params['q[' + key + ']'] = value;
            }
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }

        if (Object.keys(params).length === 0) {
          params['q[' + this.data('schema').name + ']'] = "";
        }
        url = $.path.addSearchParams(url, params);

        $('.cms-panel-deferred.cms-content-view').data('deferredNoCache', true);

        var container = this.closest('.cms-container');
        container.loadPanel(url, "", {}, true);
      }
    },
    refresh: function refresh() {
      var _this = this;

      var props = this.data('schema');
      var Search = this.getComponent();
      var handleHide = function handleHide() {
        return _this.close();
      };
      var handleSearch = function handleSearch(data) {
        return _this.search(data);
      };
      var narrowView = this.closest('.cms-content-tools').attr('id') === 'cms-content-tools-CMSMain';

      _reactDom2.default.render(_react2.default.createElement(Search, _extends({
        id: 'Search',
        identifier: 'Search',
        display: 'VISIBLE',
        displayBehavior: "HIDEABLE",
        filterPrefix: 'Search__',
        onHide: handleHide,
        onSearch: handleSearch,
        borders: {
          left: !narrowView
        }
      }, props)), this[0]);
    }
  });
});

var statusMessage = function statusMessage(text, type) {
  text = jQuery('<div/>').text(text).html();
  jQuery.noticeAdd({ text: text, type: type, stayTime: 5000, inEffect: { left: '0', opacity: 'show' } });
};
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ }),

/***/ "./client/src/legacy/ModelAdmin.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _jquery = __webpack_require__(2);

var _jquery2 = _interopRequireDefault(_jquery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

__webpack_require__("./client/src/legacy/LeftAndMain.js");

_jquery2.default.entwine('ss', function ($) {
  $('.cms-content-tools #Form_SearchForm').entwine({
    onsubmit: function onsubmit(e) {
      this.trigger('beforeSubmit');
    }
  });

  $('.importSpec').entwine({
    onmatch: function onmatch() {
      this.find('div.details').hide();
      this.find('a.detailsLink').click(function () {
        $('#' + $(this).attr('href').replace(/.*#/, '')).slideToggle();
        return false;
      });

      this._super();
    },
    onunmatch: function onunmatch() {
      this._super();
    }
  });

  $('.cms .btn.clear-search').entwine({
    onclick: function onclick(e) {
      e.preventDefault();
      var container = this.parents('.cms-container');
      container.loadPanel(this.attr('href'), '', {}, true, false);
    }
  });
});

/***/ }),

/***/ "./client/src/legacy/PermissionCheckboxSetField.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _jquery = __webpack_require__(2);

var _jquery2 = _interopRequireDefault(_jquery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_jquery2.default.entwine('ss', function ($) {
	$('.permissioncheckboxset .valADMIN input').entwine({
		onmatch: function onmatch() {
			this._super();
		},
		onunmatch: function onunmatch() {
			this._super();
		},
		onclick: function onclick(e) {
			this.toggleCheckboxes();
		},
		toggleCheckboxes: function toggleCheckboxes() {
			var checkboxes = $(this).parents('.field:eq(0)').find('.checkbox').not(this);

			if ($(this).is(':checked')) {
				checkboxes.each(function () {
					$(this).data('SecurityAdmin.oldChecked', $(this).attr('checked'));
					$(this).data('SecurityAdmin.oldDisabled', $(this).attr('disabled'));
					$(this).attr('disabled', 'disabled');
					$(this).attr('checked', 'checked');
				});
			} else {
				checkboxes.each(function () {
					var oldChecked = $(this).data('SecurityAdmin.oldChecked');
					var oldDisabled = $(this).data('SecurityAdmin.oldDisabled');
					if (oldChecked !== null) $(this).attr('checked', oldChecked);
					if (oldDisabled !== null) $(this).attr('disabled', oldDisabled);
				});
			}
		}
	});

	$('.permissioncheckboxset .valCMS_ACCESS_LeftAndMain input').entwine({
		getCheckboxesExceptThisOne: function getCheckboxesExceptThisOne() {
			return $(this).parents('.field:eq(0)').find('li').filter(function (i) {
				var klass = $(this).attr('class');
				return klass ? klass.match(/CMS_ACCESS_/) : false;
			}).find('.checkbox').not(this);
		},
		onadd: function onadd() {
			this.toggleCheckboxes();
			this._super();
		},
		onclick: function onclick(e) {
			this.toggleCheckboxes();
		},
		toggleCheckboxes: function toggleCheckboxes() {
			var checkboxes = this.getCheckboxesExceptThisOne();
			if ($(this).is(':checked')) {
				checkboxes.each(function () {
					$(this).data('PermissionCheckboxSetField.oldChecked', $(this).is(':checked'));
					$(this).data('PermissionCheckboxSetField.oldDisabled', $(this).is(':disabled'));
					$(this).prop('disabled', 'disabled');
					$(this).prop('checked', 'checked');
				});
			} else {
				checkboxes.each(function () {
					$(this).prop('checked', $(this).data('PermissionCheckboxSetField.oldChecked'));
					$(this).prop('disabled', $(this).data('PermissionCheckboxSetField.oldDisabled'));
				});
			}
		}
	});
});

/***/ }),

/***/ "./client/src/legacy/SecurityAdmin.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _jquery = __webpack_require__(2);

var _jquery2 = _interopRequireDefault(_jquery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

__webpack_require__("./client/src/legacy/LeftAndMain.js");
__webpack_require__("./client/src/legacy/PermissionCheckboxSetField.js");

var refreshAfterImport = function refreshAfterImport(e) {
  var existingFormMessage = (0, _jquery2.default)((0, _jquery2.default)(this).contents()).find('.message');
  if (existingFormMessage && existingFormMessage.html()) {
    var memberTableField = (0, _jquery2.default)(window.parent.document).find('#Form_EditForm_Members').get(0);
    if (memberTableField) memberTableField.refresh();

    var tree = (0, _jquery2.default)(window.parent.document).find('.cms-tree').get(0);
    if (tree) tree.reload();
  }
};

(0, _jquery2.default)('#MemberImportFormIframe, #GroupImportFormIframe').entwine({
  onadd: function onadd() {
    this._super();

    (0, _jquery2.default)(this).bind('load', refreshAfterImport);
  }
});

_jquery2.default.entwine('ss', function ($) {
  $('.permissioncheckboxset .checkbox[value=ADMIN]').entwine({
    onadd: function onadd() {
      this.toggleCheckboxes();
      this._super();
    },

    onclick: function onclick(e) {
      this.toggleCheckboxes();
    },

    toggleCheckboxes: function toggleCheckboxes() {
      var self = this,
          checkboxes = this.parents('.field:eq(0)').find('.checkbox').not(this);

      if (this.is(':checked')) {
        checkboxes.each(function () {
          $(this).data('SecurityAdmin.oldChecked', $(this).is(':checked'));
          $(this).data('SecurityAdmin.oldDisabled', $(this).is(':disabled'));
          $(this).prop('disabled', true);
          $(this).prop('checked', true);
        });
      } else {
        checkboxes.each(function () {
          $(this).prop('checked', $(this).data('SecurityAdmin.oldChecked'));
          $(this).prop('disabled', $(this).data('SecurityAdmin.oldDisabled'));
        });
      }
    }
  });
});

/***/ }),

/***/ "./client/src/legacy/SelectionGroup.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _jquery = __webpack_require__(2);

var _jquery2 = _interopRequireDefault(_jquery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _jquery2.default)(document).ready(function () {
  (0, _jquery2.default)('ul.SelectionGroup input.selector, ul.selection-group input.selector').live('click', function () {
    var li = (0, _jquery2.default)(this).closest('li');
    li.addClass('selected');

    var prev = li.prevAll('li.selected');
    if (prev.length) {
      prev.removeClass('selected');
    }
    var next = li.nextAll('li.selected');
    if (next.length) {
      next.removeClass('selected');
    }

    (0, _jquery2.default)(this).focus();
  });
});

/***/ }),

/***/ "./client/src/legacy/TabSet.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _jquery = __webpack_require__(2);

var _jquery2 = _interopRequireDefault(_jquery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

__webpack_require__("./thirdparty/jquery-ui/jquery-ui.js");
__webpack_require__("./thirdparty/jquery-cookie/jquery.cookie.js");
__webpack_require__("./thirdparty/jquery-entwine/dist/jquery.entwine-dist.js");

_jquery2.default.entwine('ss', function ($) {
	$('.ss-tabset').entwine({
		IgnoreTabState: false,

		onadd: function onadd() {
			var hash = window.location.hash;

			this.on("tabsactivate", function (event, _ref) {
				var newPanel = _ref.newPanel;

				this.lazyLoadGridFields(newPanel);
			}.bind(this));
			this.on("tabscreate", function (event, _ref2) {
				var panel = _ref2.panel;

				this.lazyLoadGridFields(panel);
			}.bind(this));

			this.redrawTabs();

			if (hash !== '') {
				this.openTabFromURL(hash);
			}

			this._super();
		},

		onremove: function onremove() {
			if (this.data('tabs')) this.tabs('destroy');
			this._super();
		},

		redrawTabs: function redrawTabs() {
			this.rewriteHashlinks();
			this.tabs();
		},

		openTabFromURL: function openTabFromURL(hash) {
			var $trigger;

			$.each(this.find('.ui-tabs-anchor'), function () {
				if (this.href.indexOf(hash) !== -1 && $(hash).length === 1) {
					$trigger = $(this);
					return false;
				}
			});

			if ($trigger === void 0) {
				return;
			}

			$(document).ready('ajaxComplete', function () {
				$trigger.click();
			});
		},

		rewriteHashlinks: function rewriteHashlinks() {
			$(this).find('ul a').each(function () {
				if (!$(this).attr('href')) return;

				var matches = $(this).attr('href').match(/#.*/);
				if (!matches) return;
				$(this).attr('href', document.location.href.replace(/#.*/, '') + matches[0]);
			});
		},

		lazyLoadGridFields: function lazyLoadGridFields(panel) {
			var _this = this;

			panel.find('.grid-field--lazy-loadable').each(function (i, el) {
				var gridfield = $(el);

				if (gridfield.closest('.ss-tabset').is(_this)) {
					$(el).lazyload();
				}
			});
		}

	});

	$('.ui-tabs-active .ui-tabs-anchor').entwine({
		onmatch: function onmatch() {
			this.addClass('nav-link active');
		},
		onunmatch: function onunmatch() {
			this.removeClass('active');
		}
	});
});

/***/ }),

/***/ "./client/src/legacy/ToggleCompositeField.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _jquery = __webpack_require__(2);

var _jquery2 = _interopRequireDefault(_jquery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

__webpack_require__("./thirdparty/jquery-ui/jquery-ui.js");

_jquery2.default.entwine('ss', function ($) {
	$('.ss-toggle').entwine({
		onadd: function onadd() {
			this._super();

			this.accordion({
				heightStyle: "content",
				collapsible: true,
				active: this.hasClass("ss-toggle-start-closed") ? false : 0
			});
		},
		onremove: function onremove() {
			if (this.data('accordion')) this.accordion('destroy');
			this._super();
		},

		getTabSet: function getTabSet() {
			return this.closest(".ss-tabset");
		},

		fromTabSet: {
			ontabsshow: function ontabsshow() {
				this.accordion("resize");
			}
		}
	});
});

/***/ }),

/***/ "./client/src/legacy/TreeDropdownField/TreeDropdownFieldEntwine.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _jquery = __webpack_require__(2);

var _jquery2 = _interopRequireDefault(_jquery);

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _reactDom = __webpack_require__(10);

var _reactDom2 = _interopRequireDefault(_reactDom);

var _schemaFieldValues = __webpack_require__(13);

var _TreeDropdownField = __webpack_require__(33);

var _Injector = __webpack_require__(9);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_jquery2.default.entwine('ss', function ($) {
  $('.js-injector-boot .TreeDropdownField').entwine({
    Value: null,
    Timer: null,
    Component: null,

    onmatch: function onmatch() {
      this._super();

      var cmsContent = this.closest('.cms-content').attr('id');
      var context = cmsContent ? { context: cmsContent } : {};

      var TreeDropdownField = (0, _Injector.loadComponent)('TreeDropdownField', context);
      this.setComponent(TreeDropdownField);

      var state = this.data('state') || {};
      var schema = this.data('schema') || {};
      var isMultiple = schema.data && schema.data.multiple;

      if (isMultiple) {
        this.setValue(state.value && state.value !== _TreeDropdownField.MULTI_EMPTY_VALUE ? state.value.map(function (next) {
          return Number(next);
        }) : []);
      } else {
        this.setValue(state.value ? Number(state.value) : '');
      }

      this.refresh();
    },
    onunmatch: function onunmatch() {
      this._super();

      var container = this[0];
      if (container) {
        _reactDom2.default.unmountComponentAtNode(container);
      }
    },
    refresh: function refresh() {
      var _this = this;

      var props = this.getAttributes();

      var onChange = function onChange(value) {
        _this.setValue(value);

        _this.refresh();

        clearTimeout(_this.getTimer());
        var timer = setTimeout(function () {
          _this.find('input').trigger('change');
        }, 0);
        _this.setTimer(timer);
      };

      var TreeDropdownField = this.getComponent();

      _reactDom2.default.render(_react2.default.createElement(TreeDropdownField, _extends({}, props, {
        onChange: onChange,
        value: this.getValue(),
        noHolder: true
      })), this[0]);
    },
    getAttributes: function getAttributes() {
      var state = this.data('state');
      var schema = this.data('schema');
      return (0, _schemaFieldValues.schemaMerge)(schema, state);
    }
  });
});

/***/ }),

/***/ "./client/src/legacy/UsedOnTable/UsedOnTableEntwine.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _jquery = __webpack_require__(2);

var _jquery2 = _interopRequireDefault(_jquery);

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _reactDom = __webpack_require__(10);

var _reactDom2 = _interopRequireDefault(_reactDom);

var _schemaFieldValues = __webpack_require__(13);

var _Injector = __webpack_require__(9);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_jquery2.default.entwine('ss', function ($) {
  $('.js-injector-boot .used-on__polyfill-holder').entwine({
    Timer: null,
    Component: null,

    onmatch: function onmatch() {
      this._super();

      var cmsContent = this.closest('.cms-content').attr('id');
      var context = cmsContent ? { context: cmsContent } : {};

      var UsedOnTable = (0, _Injector.loadComponent)('UsedOnTable', context);
      this.setComponent(UsedOnTable);

      this.refresh();
    },
    onunmatch: function onunmatch() {
      this._super();

      var container = this[0];
      if (container) {
        _reactDom2.default.unmountComponentAtNode(container);
      }
    },
    refresh: function refresh() {
      var props = this.getAttributes();

      var UsedOnTable = this.getComponent();

      _reactDom2.default.render(_react2.default.createElement(UsedOnTable, props), this[0]);
    },
    getAttributes: function getAttributes() {
      var state = this.data('state');
      var schema = this.data('schema');
      return (0, _schemaFieldValues.schemaMerge)(schema, state);
    }
  });
});

/***/ }),

/***/ "./client/src/legacy/sspath.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _jquery = __webpack_require__(2);

var _jquery2 = _interopRequireDefault(_jquery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var $window = (0, _jquery2.default)(window),
    $html = (0, _jquery2.default)('html'),
    $head = (0, _jquery2.default)('head'),
    path = {
  urlParseRE: /^(((([^:\/#\?]+:)?(?:(\/\/)((?:(([^:@\/#\?]+)(?:\:([^:@\/#\?]+))?)@)?(([^:\/#\?\]\[]+|\[[^\/\]@#?]+\])(?:\:([0-9]+))?))?)?)?((\/?(?:[^\/\?#]+\/+)*)([^\?#]*)))?(\?[^#]+)?)(#.*)?/,

  parseUrl: function parseUrl(url) {
    if (_jquery2.default.type(url) === "object") {
      return url;
    }

    var matches = path.urlParseRE.exec(url || "") || [];

    return {
      href: matches[0] || "",
      hrefNoHash: matches[1] || "",
      hrefNoSearch: matches[2] || "",
      domain: matches[3] || "",
      protocol: matches[4] || "",
      doubleSlash: matches[5] || "",
      authority: matches[6] || "",
      username: matches[8] || "",
      password: matches[9] || "",
      host: matches[10] || "",
      hostname: matches[11] || "",
      port: matches[12] || "",
      pathname: matches[13] || "",
      directory: matches[14] || "",
      filename: matches[15] || "",
      search: matches[16] || "",
      hash: matches[17] || ""
    };
  },

  makePathAbsolute: function makePathAbsolute(relPath, absPath) {
    if (relPath && relPath.charAt(0) === "/") {
      return relPath;
    }

    relPath = relPath || "";
    absPath = absPath ? absPath.replace(/^\/|(\/[^\/]*|[^\/]+)$/g, "") : "";

    var absStack = absPath ? absPath.split("/") : [],
        relStack = relPath.split("/");
    for (var i = 0; i < relStack.length; i++) {
      var d = relStack[i];
      switch (d) {
        case ".":
          break;
        case "..":
          if (absStack.length) {
            absStack.pop();
          }
          break;
        default:
          absStack.push(d);
          break;
      }
    }
    return "/" + absStack.join("/");
  },

  isSameDomain: function isSameDomain(absUrl1, absUrl2) {
    return path.parseUrl(absUrl1).domain === path.parseUrl(absUrl2).domain;
  },

  isRelativeUrl: function isRelativeUrl(url) {
    return path.parseUrl(url).protocol === "";
  },

  isAbsoluteUrl: function isAbsoluteUrl(url) {
    return path.parseUrl(url).protocol !== "";
  },

  makeUrlAbsolute: function makeUrlAbsolute(relUrl, absUrl) {
    if (!path.isRelativeUrl(relUrl)) {
      return relUrl;
    }

    var relObj = path.parseUrl(relUrl),
        absObj = path.parseUrl(absUrl),
        protocol = relObj.protocol || absObj.protocol,
        doubleSlash = relObj.protocol ? relObj.doubleSlash : relObj.doubleSlash || absObj.doubleSlash,
        authority = relObj.authority || absObj.authority,
        hasPath = relObj.pathname !== "",
        pathname = path.makePathAbsolute(relObj.pathname || absObj.filename, absObj.pathname),
        search = relObj.search || !hasPath && absObj.search || "",
        hash = relObj.hash;

    return protocol + doubleSlash + authority + pathname + search + hash;
  },

  addSearchParams: function addSearchParams(url, params) {
    var u = path.parseUrl(url),
        params = typeof params === "string" ? path.convertSearchToArray(params) : params,
        newParams = _jquery2.default.extend(path.convertSearchToArray(u.search), params),
        paramStr = path.convertObjectToSearch(newParams);

    return u.hrefNoSearch + '?' + paramStr + (u.hash || "");
  },

  getSearchParams: function getSearchParams(url) {
    var u = path.parseUrl(url);
    return path.convertSearchToArray(u.search);
  },

  convertSearchToArray: function convertSearchToArray(search) {
    var parts,
        i,
        tmp,
        params = {};
    search = search.replace(/^\?/, '');
    parts = search ? search.split('&') : [];
    for (i = 0; i < parts.length; i++) {
      tmp = parts[i].split('=');
      params[decodeURIComponent(tmp[0])] = decodeURIComponent(tmp[1]);
    }
    return params;
  },

  convertObjectToSearch: function convertObjectToSearch(params) {
    var encodedParts = [];
    for (var key in params) {
      encodedParts.push(encodeURIComponent(key) + '=' + encodeURIComponent(params[key]));
    }
    return encodedParts.join('&');
  },


  convertUrlToDataUrl: function convertUrlToDataUrl(absUrl) {
    var u = path.parseUrl(absUrl);
    if (path.isEmbeddedPage(u)) {
      return u.hash.split(dialogHashKey)[0].replace(/^#/, "");
    } else if (path.isSameDomain(u, document)) {
      return u.hrefNoHash.replace(document.domain, "");
    }
    return absUrl;
  },

  get: function get(newPath) {
    if (newPath === undefined) {
      newPath = location.hash;
    }
    return path.stripHash(newPath).replace(/[^\/]*\.[^\/*]+$/, '');
  },

  getFilePath: function getFilePath(path) {
    var splitkey = '&' + _jquery2.default.mobile.subPageUrlKey;
    return path && path.split(splitkey)[0].split(dialogHashKey)[0];
  },

  set: function set(path) {
    location.hash = path;
  },

  isPath: function isPath(url) {
    return (/\//.test(url)
    );
  },

  clean: function clean(url) {
    return url.replace(document.domain, "");
  },

  stripHash: function stripHash(url) {
    return url.replace(/^#/, "");
  },

  cleanHash: function cleanHash(hash) {
    return path.stripHash(hash.replace(/\?.*$/, "").replace(dialogHashKey, ""));
  },

  isExternal: function isExternal(url) {
    var u = path.parseUrl(url);
    return u.protocol && u.domain !== document.domain ? true : false;
  },

  hasProtocol: function hasProtocol(url) {
    return (/^(:?\w+:)/.test(url)
    );
  }
};

_jquery2.default.path = path;

/***/ }),

/***/ "./client/src/legacy/ssui.core.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(jQuery) {

var _jquery = __webpack_require__(2);

var _jquery2 = _interopRequireDefault(_jquery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

__webpack_require__("./thirdparty/jquery-ui/jquery-ui.js");

_jquery2.default.widget("ssui.ssdialog", _jquery2.default.ui.dialog, {
  options: {
    iframeUrl: '',
    reloadOnOpen: true,
    dialogExtraClass: '',

    modal: true,
    bgiframe: true,
    autoOpen: false,
    autoPosition: true,
    minWidth: 500,
    maxWidth: 800,
    minHeight: 300,
    maxHeight: 700,
    widthRatio: 0.8,
    heightRatio: 0.8,
    resizable: false
  },
  _create: function _create() {
    _jquery2.default.ui.dialog.prototype._create.call(this);

    var self = this;

    var iframe = (0, _jquery2.default)('<iframe marginWidth="0" marginHeight="0" frameBorder="0" scrolling="auto"></iframe>');
    iframe.bind('load', function (e) {
      if ((0, _jquery2.default)(this).attr('src') == 'about:blank') return;

      iframe.addClass('loaded').show();
      self._resizeIframe();
      self.uiDialog.removeClass('loading');
    }).hide();

    if (this.options.dialogExtraClass) this.uiDialog.addClass(this.options.dialogExtraClass);
    this.element.append(iframe);

    if (this.options.iframeUrl) this.element.css('overflow', 'hidden');
  },
  open: function open() {
    _jquery2.default.ui.dialog.prototype.open.call(this);

    var self = this,
        iframe = this.element.children('iframe');

    if (this.options.iframeUrl && (!iframe.hasClass('loaded') || this.options.reloadOnOpen)) {
      iframe.hide();
      iframe.attr('src', this.options.iframeUrl);
      this.uiDialog.addClass('loading');
    }

    (0, _jquery2.default)(window).bind('resize.ssdialog', function () {
      self._resizeIframe();
    });
  },
  close: function close() {
    _jquery2.default.ui.dialog.prototype.close.call(this);

    this.uiDialog.unbind('resize.ssdialog');
    (0, _jquery2.default)(window).unbind('resize.ssdialog');
  },
  _resizeIframe: function _resizeIframe() {
    var opts = {},
        newWidth,
        newHeight,
        iframe = this.element.children('iframe');;
    if (this.options.widthRatio) {
      newWidth = (0, _jquery2.default)(window).width() * this.options.widthRatio;
      if (this.options.minWidth && newWidth < this.options.minWidth) {
        opts.width = this.options.minWidth;
      } else if (this.options.maxWidth && newWidth > this.options.maxWidth) {
        opts.width = this.options.maxWidth;
      } else {
        opts.width = newWidth;
      }
    }
    if (this.options.heightRatio) {
      newHeight = (0, _jquery2.default)(window).height() * this.options.heightRatio;
      if (this.options.minHeight && newHeight < this.options.minHeight) {
        opts.height = this.options.minHeight;
      } else if (this.options.maxHeight && newHeight > this.options.maxHeight) {
        opts.height = this.options.maxHeight;
      } else {
        opts.height = newHeight;
      }
    }

    if (!jQuery.isEmptyObject(opts)) {
      this._setOptions(opts);

      iframe.attr('width', opts.width - parseFloat(this.element.css('paddingLeft')) - parseFloat(this.element.css('paddingRight')));
      iframe.attr('height', opts.height - parseFloat(this.element.css('paddingTop')) - parseFloat(this.element.css('paddingBottom')));

      if (this.options.autoPosition) {
        this._setOption("position", this.options.position);
      }
    }
  }
});

_jquery2.default.widget("ssui.titlebar", {
  _create: function _create() {
    this.originalTitle = this.element.attr('title');

    var self = this;
    var options = this.options;

    var title = options.title || this.originalTitle || '&nbsp;';
    var titleId = _jquery2.default.ui.dialog.getTitleId(this.element);

    this.element.parent().addClass('ui-dialog');

    var uiDialogTitlebar = this.element.addClass('ui-dialog-titlebar ' + 'ui-widget-header ' + 'ui-corner-all ' + 'ui-helper-clearfix');

    if (options.closeButton) {
      var uiDialogTitlebarClose = (0, _jquery2.default)('<a href="#"/>').addClass('ui-dialog-titlebar-close ' + 'ui-corner-all').attr('role', 'button').hover(function () {
        uiDialogTitlebarClose.addClass('ui-state-hover');
      }, function () {
        uiDialogTitlebarClose.removeClass('ui-state-hover');
      }).focus(function () {
        uiDialogTitlebarClose.addClass('ui-state-focus');
      }).blur(function () {
        uiDialogTitlebarClose.removeClass('ui-state-focus');
      }).mousedown(function (ev) {
        ev.stopPropagation();
      }).appendTo(uiDialogTitlebar);

      var uiDialogTitlebarCloseText = (this.uiDialogTitlebarCloseText = (0, _jquery2.default)('<span/>')).addClass('ui-icon ' + 'ui-icon-closethick').text(options.closeText).appendTo(uiDialogTitlebarClose);
    }

    var uiDialogTitle = (0, _jquery2.default)('<span/>').addClass('ui-dialog-title').attr('id', titleId).html(title).prependTo(uiDialogTitlebar);

    uiDialogTitlebar.find("*").add(uiDialogTitlebar).disableSelection();
  },

  destroy: function destroy() {
    this.element.unbind('.dialog').removeData('dialog').removeClass('ui-dialog-content ui-widget-content').hide().appendTo('body');

    this.originalTitle && this.element.attr('title', this.originalTitle);
  }
});

_jquery2.default.extend(_jquery2.default.ssui.titlebar, {
  version: "0.0.1",
  options: {
    title: '',
    closeButton: false,
    closeText: 'close'
  },

  uuid: 0,

  getTitleId: function getTitleId($el) {
    return 'ui-dialog-title-' + ($el.attr('id') || ++this.uuid);
  }
});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ }),

/***/ "./client/src/lib/Injector.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.graphqlTemplates = exports.loadComponent = exports.injectGraphql = exports.inject = exports.withInjector = exports.provideContext = exports.provideInjector = undefined;

var _provideInjector = __webpack_require__("./client/src/lib/dependency-injection/provideInjector.js");

var _provideInjector2 = _interopRequireDefault(_provideInjector);

var _provideContext = __webpack_require__("./client/src/lib/dependency-injection/provideContext.js");

var _provideContext2 = _interopRequireDefault(_provideContext);

var _withInjector = __webpack_require__("./client/src/lib/dependency-injection/withInjector.js");

var _withInjector2 = _interopRequireDefault(_withInjector);

var _inject = __webpack_require__("./client/src/lib/dependency-injection/inject.js");

var _inject2 = _interopRequireDefault(_inject);

var _injectGraphql = __webpack_require__("./client/src/lib/dependency-injection/injectGraphql.js");

var _injectGraphql2 = _interopRequireDefault(_injectGraphql);

var _templates = __webpack_require__("./client/src/lib/dependency-injection/graphql/templates.js");

var graphqlTemplates = _interopRequireWildcard(_templates);

var _loadComponent = __webpack_require__("./client/src/lib/dependency-injection/loadComponent.js");

var _loadComponent2 = _interopRequireDefault(_loadComponent);

var _Container = __webpack_require__("./client/src/lib/dependency-injection/Container.js");

var _Container2 = _interopRequireDefault(_Container);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.provideInjector = _provideInjector2.default;
exports.provideContext = _provideContext2.default;
exports.withInjector = _withInjector2.default;
exports.inject = _inject2.default;
exports.injectGraphql = _injectGraphql2.default;
exports.loadComponent = _loadComponent2.default;
exports.graphqlTemplates = graphqlTemplates;
exports.default = _Container2.default;

/***/ }),

/***/ "./client/src/lib/Validator.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _validator = __webpack_require__(57);

var _validator2 = _interopRequireDefault(_validator);

var _i18n = __webpack_require__(3);

var _i18n2 = _interopRequireDefault(_i18n);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Validator = function () {
  function Validator(values) {
    _classCallCheck(this, Validator);

    this.setValues(values);
  }

  _createClass(Validator, [{
    key: 'setValues',
    value: function setValues(values) {
      this.values = values;
    }
  }, {
    key: 'getFieldValue',
    value: function getFieldValue(name) {
      var value = this.values[name];

      if (typeof value !== 'string') {
        if (typeof value === 'undefined' || value === null || value === false) {
          value = '';
        } else {
          value = value.toString();
        }
      }

      return value;
    }
  }, {
    key: 'validateValue',
    value: function validateValue(value, rule, config) {
      if (value === '') {
        return rule !== 'required';
      }
      switch (rule) {
        case 'equals':
          {
            var otherValue = this.getFieldValue(config.field);
            return _validator2.default.equals(value, otherValue);
          }
        case 'numeric':
          {
            return _validator2.default.isNumeric(value);
          }
        case 'date':
          {
            return _validator2.default.isDate(value);
          }
        case 'alphanumeric':
          {
            return _validator2.default.isAlphanumeric(value);
          }
        case 'alpha':
          {
            return _validator2.default.isAlpha(value);
          }
        case 'regex':
          {
            return _validator2.default.matches(value, config.pattern);
          }
        case 'max':
          {
            return value.length <= config.length;
          }
        case 'email':
          {
            return _validator2.default.isEmail(value);
          }
        default:
          {
            console.warn('Unknown validation rule used: \'' + rule + '\'');
            return false;
          }
      }
    }
  }, {
    key: 'validateFieldSchema',
    value: function validateFieldSchema(fieldSchema) {
      return this.validateField(fieldSchema.name, fieldSchema.validation, fieldSchema.leftTitle !== null ? fieldSchema.leftTitle : fieldSchema.title, fieldSchema.customValidationMessage);
    }
  }, {
    key: 'getMessage',
    value: function getMessage(rule, config) {
      var name = config.title;
      var message = typeof config.message === 'string' ? config.message : _i18n2.default._t('Admin.VALIDATOR_MESSAGE_' + rule.toUpperCase(), _i18n2.default._t('Admin.VALIDATOR_MESSAGE_DEFAULT', '{name} is not a valid value.'));

      return _i18n2.default.inject(message, { name: name });
    }
  }, {
    key: 'validateField',
    value: function validateField(name, rules, title, overrideMessage) {
      var _this = this;

      var response = { valid: true, errors: [] };

      if (!rules) {
        return response;
      }

      var value = this.getFieldValue(name);

      if (value === '' && rules.required) {
        var config = Object.assign({ title: title !== '' ? title : name }, rules.required);
        var message = overrideMessage || this.getMessage('required', config);
        return {
          valid: false,
          errors: [message]
        };
      }

      Object.entries(rules).forEach(function (ruleEntry) {
        var _ruleEntry = _slicedToArray(ruleEntry, 2),
            rule = _ruleEntry[0],
            initConfig = _ruleEntry[1];

        var config = Object.assign({ title: name }, { title: title }, initConfig);

        if (rule === 'required') {
          return;
        }

        var valid = _this.validateValue(value, rule, config);
        if (!valid) {
          var _message = _this.getMessage(rule, config);
          response.valid = false;
          response.errors.push(_message);
        }
      });

      if (overrideMessage && !response.valid) {
        response.errors = [overrideMessage];
      }

      return response;
    }
  }]);

  return Validator;
}();

exports.default = Validator;

/***/ }),

/***/ "./client/src/lib/castStringToElement.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.mapHighlight = mapHighlight;
exports.default = castStringToElement;

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function mapHighlight(haystack, needle, Tag) {
  var index = 0;
  var search = haystack;
  var results = [];
  var part = needle.toLocaleLowerCase();

  while (index !== -1) {
    index = search.toLocaleLowerCase().indexOf(part);

    if (index !== -1) {
      var next = index + needle.length;
      var start = search.substring(0, index);
      var found = search.substring(index, next);
      var end = search.substring(next);

      if (start.length) {
        results.push(start);
      }
      results.push(Tag ? _react2.default.createElement(
        Tag,
        { key: results.length / 2 },
        found
      ) : found);
      search = end;
    }
  }
  results.push(search);

  return results;
}

function castStringToElement(Container, value) {
  var props = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  if (value && typeof value.react !== 'undefined') {
    return _react2.default.createElement(
      Container,
      props,
      value.react
    );
  }

  if (value && typeof value.html !== 'undefined') {
    if (value.html !== null) {
      var html = { __html: value.html };
      return _react2.default.createElement(Container, _extends({}, props, { dangerouslySetInnerHTML: html }));
    }
    return null;
  }

  var body = null;
  if (value && typeof value.text !== 'undefined') {
    body = value.text;
  } else {
    body = value;
  }

  if (body && (typeof body === 'undefined' ? 'undefined' : _typeof(body)) === 'object') {
    throw new Error('Unsupported string value ' + JSON.stringify(body));
  }

  if (body !== null && typeof body !== 'undefined') {
    return _react2.default.createElement(
      Container,
      props,
      body
    );
  }
  return null;
}

/***/ }),

/***/ "./client/src/lib/constants.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var SPLITMODE_BREAKPOINT = exports.SPLITMODE_BREAKPOINT = 800;

/***/ }),

/***/ "./client/src/lib/createClassMap.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var createClassMap = function createClassMap(classesStr) {
  var classConfig = {};
  if (classesStr) {
    classesStr.split(' ').forEach(function (className) {
      if (className !== '') {
        classConfig[className] = true;
      }
    });
  }
  return classConfig;
};

exports.default = createClassMap;

/***/ }),

/***/ "./client/src/lib/createErrorBlock.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createErrorBlock = exports.createErrorHtml = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var createErrorHtml = function createErrorHtml(errors) {
  return {
    type: 'error',
    value: {
      react: errors.map(function (error, index) {
        return _react2.default.createElement(
          'span',
          { key: index, className: 'form__validation-message' },
          error
        );
      })
    }
  };
};

var createErrorBlock = function createErrorBlock(errors) {
  return Object.entries(errors).reduce(function (prev, curr) {
    var _curr = _slicedToArray(curr, 2),
        fieldName = _curr[0],
        messages = _curr[1];

    if (!messages || !messages.length) {
      return prev;
    }
    var messageList = Array.isArray(messages) ? messages : [messages];
    return _extends({}, prev, _defineProperty({}, fieldName, createErrorHtml(messageList)));
  }, {});
};

exports.default = createErrorBlock;
exports.createErrorHtml = createErrorHtml;
exports.createErrorBlock = createErrorBlock;

/***/ }),

/***/ "./client/src/lib/dependency-injection/ApolloGraphqlManager.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _graphqlTag = __webpack_require__(40);

var _graphqlTag2 = _interopRequireDefault(_graphqlTag);

var _helpers = __webpack_require__("./client/src/lib/dependency-injection/graphql/helpers.js");

var _ApolloGraphqlProxy = __webpack_require__("./client/src/lib/dependency-injection/ApolloGraphqlProxy.js");

var _ApolloGraphqlProxy2 = _interopRequireDefault(_ApolloGraphqlProxy);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TEMPLATE_OVERRIDE = '__TEMPLATE_OVERRIDE__';
var protectedConfig = ['templateName', 'fields', 'params', 'fragments'];
var deferredApolloConfig = ['options', 'props', 'variables', 'skip', 'update'];
var configDefaults = {
  params: {},
  args: {},
  fields: [],
  fragments: [],
  pagination: true,
  apolloConfig: {}
};

var ApolloGraphqlManager = function () {
  function ApolloGraphqlManager(config, templates, fragments) {
    _classCallCheck(this, ApolloGraphqlManager);

    var mergedConfig = _extends({}, configDefaults, config);

    mergedConfig.fields = [].concat(_toConsumableArray(mergedConfig.fields));

    var apolloConfig = mergedConfig.apolloConfig,
        otherConfig = _objectWithoutProperties(mergedConfig, ['apolloConfig']);

    this.config = otherConfig;
    this.apolloConfigInitValues = apolloConfig;
    this.apolloConfigTransforms = {};
    this.templates = _extends({}, templates) || {};
    this.fragments = _extends({}, fragments) || {};

    this.reduceApolloConfig = this.reduceApolloConfig.bind(this);
  }

  _createClass(ApolloGraphqlManager, [{
    key: 'setConfig',
    value: function setConfig(name, value) {
      if (protectedConfig.includes(name)) {
        throw new Error('Tried to set protected config values: \'' + name + '\', which is discouraged.');
      }
      this.config = _extends({}, this.config, _defineProperty({}, name, value));

      return this;
    }
  }, {
    key: 'transformApolloConfig',
    value: function transformApolloConfig(config, callback) {
      var transformList = this.apolloConfigTransforms[config] || [];

      this.apolloConfigTransforms = _extends({}, this.apolloConfigTransforms, _defineProperty({}, config, [].concat(_toConsumableArray(transformList), [callback])));

      return this;
    }
  }, {
    key: 'addParam',
    value: function addParam(name, type) {
      if (!name || !type) {
        throw new Error('addParam must be passed a name and type parameter');
      }
      return this.addParams(_defineProperty({}, name, type));
    }
  }, {
    key: 'addParams',
    value: function addParams() {
      var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      var existing = this.config.params;
      this.config.params = _extends({}, existing, params);

      return this;
    }
  }, {
    key: 'addArg',
    value: function addArg(name, variableName) {
      var path = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _helpers.ROOT_FIELD;

      return this.addArgs(_defineProperty({}, name, variableName), path);
    }
  }, {
    key: 'addArgs',
    value: function addArgs() {
      var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var path = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _helpers.ROOT_FIELD;

      var existing = this.config.args[path] || {};
      this.config.args[path] = _extends({}, existing, args);

      return this;
    }
  }, {
    key: 'addField',
    value: function addField(field) {
      var path = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _helpers.ROOT_FIELD;

      return this.addFields([field], path);
    }
  }, {
    key: 'addFields',
    value: function addFields() {
      var _this = this;

      var fields = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      var path = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _helpers.ROOT_FIELD;

      var fieldArray = [];
      path.split('/').forEach(function (part) {
        if (part === _helpers.ROOT_FIELD) {
          fieldArray = _this.config.fields;
        } else {
          var index = fieldArray.indexOf(part);
          var next = fieldArray[index + 1];
          if (index === -1 || !Array.isArray(next)) {
            throw new Error('Invalid path to field: ' + path);
          }

          fieldArray = next;
        }
      });
      fields.forEach(function (f) {
        return fieldArray.push(f);
      });
      return this;
    }
  }, {
    key: 'useFragment',
    value: function useFragment(name) {
      this.config.fragments = [].concat(_toConsumableArray(this.config.fragments), [name]);

      return this;
    }
  }, {
    key: 'useTemplate',
    value: function useTemplate(name) {
      if (!Object.keys(this.templates).includes(name)) {
        throw new Error('\nTried to use template \'' + name + '\', which could not be found. Please make sure that it is registered with your Injector.\n      ');
      }

      this.config.templateName = name;

      return this;
    }
  }, {
    key: 'addTempFragment',
    value: function addTempFragment(name, fragment) {
      this.fragments = _extends({}, this.fragments, _defineProperty({}, name, fragment));

      return this.useFragment(name);
    }
  }, {
    key: 'setTemplate',
    value: function setTemplate(strings) {
      for (var _len = arguments.length, expressions = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        expressions[_key - 1] = arguments[_key];
      }

      this.config.templateName = TEMPLATE_OVERRIDE;

      this.templates = _extends({}, this.templates, _defineProperty({}, TEMPLATE_OVERRIDE, {
        strings: strings,
        expressions: expressions
      }));

      return this;
    }
  }, {
    key: 'getRawTemplate',
    value: function getRawTemplate(name) {
      return this.templates[name];
    }
  }, {
    key: 'coallesceData',
    value: function coallesceData(type, oldValue, newValue) {
      switch (type) {
        case 'options':
        case 'props':
        case 'variables':
        case 'context':
        case 'optimisticResponse':
          return _extends({}, oldValue || {}, newValue || {});
        case 'refetchQueries':
          return [].concat(_toConsumableArray(oldValue || []), _toConsumableArray(newValue || []));
        case 'skip':
          return typeof newValue === 'boolean' ? newValue : oldValue;
        case 'pollInterval':
          return typeof newValue === 'number' ? newValue : oldValue;
        case 'fetchPolicy':
          return (typeof newValue === 'undefined' ? 'undefined' : _typeof(newValue)) === 'object' ? newValue : oldValue;
        case 'name':
          return typeof newValue === 'string' ? newValue : oldValue;
        case 'withRef':
        case 'notifyOnNetworkStatusChange':
          return newValue || oldValue;

        default:
          return null;
      }
    }
  }, {
    key: 'reduceApolloConfig',
    value: function reduceApolloConfig(prev, key) {
      var _this2 = this;

      var calculateValue = function calculateValue(oldValue, transform) {
        var newValue = transform(oldValue);

        return _this2.coallesceData(key, oldValue, newValue);
      };
      var value = this.apolloConfigInitValues[key];
      var transforms = this.apolloConfigTransforms[key] || [];

      if (deferredApolloConfig.includes(key)) {
        var deferredValue = function deferredValue() {
          for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            args[_key2] = arguments[_key2];
          }

          var oldValue = value.apply(undefined, args);
          var bootedTransformers = transforms.map(function (transform) {
            return transform.apply(undefined, args);
          });

          if (key === 'update') {
            return null;
          }
          return bootedTransformers.reduce(calculateValue, oldValue);
        };

        return _extends({}, prev, _defineProperty({}, key, deferredValue));
      }

      if (typeof value === 'undefined' || value === null) {
        return prev;
      }

      var newValue = transforms.reduce(calculateValue, value);

      return _extends({}, prev, _defineProperty({}, key, newValue));
    }
  }, {
    key: 'getConfig',
    value: function getConfig() {
      return _extends({}, this.config, {
        availableFragments: _extends({}, this.fragments)
      });
    }
  }, {
    key: 'getApolloConfig',
    value: function getApolloConfig() {
      var keys = [].concat(_toConsumableArray(Object.keys(this.apolloConfigInitValues)), _toConsumableArray(Object.keys(this.apolloConfigTransforms))).filter(function (key, index, list) {
        return list.indexOf(key) === index;
      });

      return keys.reduce(this.reduceApolloConfig, {});
    }
  }, {
    key: 'getGraphqlAST',
    value: function getGraphqlAST() {
      var config = this.getConfig();
      var template = this.getRawTemplate(config.templateName);

      var expressed = template.expressions.map(function (expression) {
        if (typeof expression !== 'function') {
          return expression;
        }

        return expression(config);
      });

      return _graphqlTag2.default.apply(undefined, [template.strings].concat(_toConsumableArray(expressed)));
    }
  }, {
    key: 'getContainer',
    value: function getContainer() {
      return new _ApolloGraphqlProxy2.default(this.getGraphqlAST(), this.getApolloConfig());
    }
  }]);

  return ApolloGraphqlManager;
}();

exports.default = ApolloGraphqlManager;

/***/ }),

/***/ "./client/src/lib/dependency-injection/ApolloGraphqlProxy.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _reactApollo = __webpack_require__(22);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ApolloGraphqlProxy = function () {
  function ApolloGraphqlProxy(graphqlAST, apolloConfig) {
    _classCallCheck(this, ApolloGraphqlProxy);

    this.graphqlAST = graphqlAST;
    this.apolloConfig = apolloConfig;
  }

  _createClass(ApolloGraphqlProxy, [{
    key: 'getApolloHOC',
    value: function getApolloHOC() {
      return (0, _reactApollo.graphql)(this.graphqlAST, this.apolloConfig);
    }
  }, {
    key: 'getGraphqlAST',
    value: function getGraphqlAST() {
      return this.graphqlAST;
    }
  }, {
    key: 'getApolloConfig',
    value: function getApolloConfig() {
      return this.apolloConfig;
    }
  }]);

  return ApolloGraphqlProxy;
}();

exports.default = ApolloGraphqlProxy;

/***/ }),

/***/ "./client/src/lib/dependency-injection/Container.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _buildInjectorContainer = __webpack_require__("./client/src/lib/dependency-injection/buildInjectorContainer.js");

var _buildInjectorContainer2 = _interopRequireDefault(_buildInjectorContainer);

var _buildComponentContainer = __webpack_require__("./client/src/lib/dependency-injection/buildComponentContainer.js");

var _buildComponentContainer2 = _interopRequireDefault(_buildComponentContainer);

var _buildReducerContainer = __webpack_require__("./client/src/lib/dependency-injection/buildReducerContainer.js");

var _buildReducerContainer2 = _interopRequireDefault(_buildReducerContainer);

var _buildFormContainer = __webpack_require__("./client/src/lib/dependency-injection/buildFormContainer.js");

var _buildFormContainer2 = _interopRequireDefault(_buildFormContainer);

var _buildApolloGraphqlScaffoldingContainer = __webpack_require__("./client/src/lib/dependency-injection/buildApolloGraphqlScaffoldingContainer.js");

var _buildApolloGraphqlScaffoldingContainer2 = _interopRequireDefault(_buildApolloGraphqlScaffoldingContainer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Injector = (0, _buildInjectorContainer2.default)();

Injector.register('component', (0, _buildComponentContainer2.default)());
Injector.register('reducer', (0, _buildReducerContainer2.default)());
Injector.register('form', (0, _buildFormContainer2.default)());
Injector.register('query', (0, _buildApolloGraphqlScaffoldingContainer2.default)());

exports.default = Injector;

/***/ }),

/***/ "./client/src/lib/dependency-injection/FormStateManager.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _classnames = __webpack_require__(4);

var _classnames2 = _interopRequireDefault(_classnames);

var _createClassMap = __webpack_require__("./client/src/lib/createClassMap.js");

var _createClassMap2 = _interopRequireDefault(_createClassMap);

var _setIn = __webpack_require__("./node_modules/redux-form/lib/structure/plain/setIn.js");

var _setIn2 = _interopRequireDefault(_setIn);

var _reduxForm = __webpack_require__(12);

var _schemaFieldValues = __webpack_require__(13);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var getFormState = function getFormState(state) {
  return state;
};

var FormStateManager = function () {
  function FormStateManager(schema, reduxFormState) {
    _classCallCheck(this, FormStateManager);

    var state = schema.state || {};
    var fields = state.fields || [];

    this.schema = _extends({}, schema, {
      state: _extends({}, state, {
        fields: [].concat(_toConsumableArray(fields))
      })
    });
    this.mockGlobalState = (0, _setIn2.default)({}, schema.name, reduxFormState);
  }

  _createClass(FormStateManager, [{
    key: 'getFieldByName',
    value: function getFieldByName(fieldName) {
      var schemaForm = _extends({
        fields: [],
        actions: []
      }, this.schema.schema);
      var fields = [].concat(_toConsumableArray(schemaForm.fields), _toConsumableArray(schemaForm.actions));
      var schema = (0, _schemaFieldValues.findField)(fields, fieldName);
      var state = this.schema.state.fields.find(function (field) {
        return field.name === fieldName;
      });

      return (0, _schemaFieldValues.schemaMerge)(schema, state);
    }
  }, {
    key: 'mutateField',
    value: function mutateField(fieldName, updater) {
      var fieldList = this.schema.state.fields || [];
      var fieldIndex = fieldList.findIndex(function (field) {
        return field.name === fieldName;
      });

      if (fieldIndex < 0) {
        return this;
      }

      var fields = [].concat(_toConsumableArray(fieldList));
      var field = this.getFieldByName(fieldName);
      fields[fieldIndex] = (0, _schemaFieldValues.schemaMerge)(field, updater(field));

      this.schema.state.fields = fields;

      return this;
    }
  }, {
    key: 'updateField',
    value: function updateField(fieldName, update) {
      return this.mutateField(fieldName, function (field) {
        return _extends({}, field, update);
      });
    }
  }, {
    key: 'updateFields',
    value: function updateFields(updates) {
      var _this = this;

      Object.keys(updates).forEach(function (key) {
        _this.updateField(key, updates[key]);
      });

      return this;
    }
  }, {
    key: 'setFieldComponent',
    value: function setFieldComponent(fieldName, component) {
      return this.updateField(fieldName, { component: component });
    }
  }, {
    key: 'setFieldClass',
    value: function setFieldClass(fieldName, className) {
      var active = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return this.mutateField(fieldName, function (field) {
        var classConfig = (0, _createClassMap2.default)(field.extraClass);
        classConfig[className] = active;
        return _extends({}, field, {
          extraClass: (0, _classnames2.default)(classConfig)
        });
      });
    }
  }, {
    key: 'addFieldClass',
    value: function addFieldClass(fieldName, className) {
      return this.setFieldClass(fieldName, className, true);
    }
  }, {
    key: 'removeFieldClass',
    value: function removeFieldClass(fieldName, className) {
      return this.setFieldClass(fieldName, className, false);
    }
  }, {
    key: 'getValues',
    value: function getValues() {
      return (0, _reduxForm.getFormValues)(this.schema.name, getFormState)(this.mockGlobalState) || {};
    }
  }, {
    key: 'getValue',
    value: function getValue(fieldName) {
      return this.getValues()[fieldName];
    }
  }, {
    key: 'isDirty',
    value: function isDirty() {
      return (0, _reduxForm.isDirty)(this.schema.name, getFormState)(this.mockGlobalState);
    }
  }, {
    key: 'isPristine',
    value: function isPristine() {
      return (0, _reduxForm.isPristine)(this.schema.name, getFormState)(this.mockGlobalState);
    }
  }, {
    key: 'isValid',
    value: function isValid() {
      return (0, _reduxForm.isValid)(this.schema.name, getFormState)(this.mockGlobalState);
    }
  }, {
    key: 'isInvalid',
    value: function isInvalid() {
      return (0, _reduxForm.isInvalid)(this.schema.name, getFormState)(this.mockGlobalState);
    }
  }, {
    key: 'getState',
    value: function getState() {
      return this.schema;
    }
  }]);

  return FormStateManager;
}();

exports.default = FormStateManager;

/***/ }),

/***/ "./client/src/lib/dependency-injection/FormValidationManager.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var FormValidationManager = function () {
  function FormValidationManager(values) {
    _classCallCheck(this, FormValidationManager);

    this.values = values;
    this.errorMap = {};
  }

  _createClass(FormValidationManager, [{
    key: "addError",
    value: function addError(fieldName, message) {
      if (!this.fieldExists(fieldName)) {
        throw new Error("Tried to add error to non-existent field: " + fieldName);
      }
      if (!this.errorMap[fieldName]) {
        this.errorMap[fieldName] = [];
      }

      this.errorMap[fieldName] = [].concat(_toConsumableArray(this.errorMap[fieldName]), [message]);

      return this;
    }
  }, {
    key: "addErrors",
    value: function addErrors(map) {
      var _this = this;

      Object.entries(map).forEach(function (entry) {
        var _entry = _slicedToArray(entry, 1),
            fieldName = _entry[0];

        var _entry2 = _slicedToArray(entry, 2),
            messages = _entry2[1];

        if (!Array.isArray(messages)) {
          messages = [messages];
        }
        messages.forEach(function (message) {
          return _this.addError(fieldName, message);
        });
      });

      return this;
    }
  }, {
    key: "clearErrors",
    value: function clearErrors(fieldName) {
      if (!this.fieldExists(fieldName)) {
        throw new Error("Tried to clear errors for non-existent field: " + fieldName);
      }

      delete this.errorMap[fieldName];

      return this;
    }
  }, {
    key: "hasError",
    value: function hasError(fieldName) {
      return this.fieldExists(fieldName) && !!this.getErrors(fieldName).length;
    }
  }, {
    key: "fieldExists",
    value: function fieldExists(field) {
      return Object.keys(this.values).includes(field);
    }
  }, {
    key: "getErrors",
    value: function getErrors(fieldName) {
      if (!this.fieldExists(fieldName)) {
        throw new Error("Tried to get errors for non-existent field: " + fieldName);
      }

      return this.errorMap[fieldName] || [];
    }
  }, {
    key: "reset",
    value: function reset() {
      this.errorMap = {};
    }
  }, {
    key: "getState",
    value: function getState() {
      return this.errorMap;
    }
  }]);

  return FormValidationManager;
}();

exports.default = FormValidationManager;

/***/ }),

/***/ "./client/src/lib/dependency-injection/MiddlewareRegistry.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GLOBAL_CONTEXT = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _toposort = __webpack_require__("./node_modules/toposort/index.js");

var _toposort2 = _interopRequireDefault(_toposort);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BEFORE = 'before';

var AFTER = 'after';

var GRAPH_HEAD = '__HEAD__';

var GRAPH_TAIL = '__TAIL__';

var PRIORITIES = [BEFORE, AFTER];

var GLOBAL_CONTEXT = '__GLOBAL__';

var WILDCARD = '*';

var validateMeta = function validateMeta(meta) {
  PRIORITIES.forEach(function (k) {
    if (typeof meta[k] !== 'undefined' && typeof meta[k] !== 'string' && !Array.isArray(meta[k])) {
      throw new Error('Middleware key ' + k + ' must be a string or array');
    }
  });
};

var checkWildcard = function checkWildcard(middleware) {
  var wildcard = null;
  PRIORITIES.forEach(function (PRIORITY) {
    if (middleware[PRIORITY].includes(WILDCARD)) {
      if (middleware[PRIORITY].length > 1) {
        throw new Error('\n          Key ' + PRIORITY + ' on ' + middleware.name + ' should only specify one key \n          if using the "' + WILDCARD + '" wildcard\n        ');
      } else if (wildcard) {
        throw new Error('\n          Cannot specify a ' + PRIORITY + ' rule on ' + middleware.name + ' if a wildcard \n          has been specified\n        ');
      } else {
        wildcard = PRIORITY;
      }
    }
  });

  return wildcard;
};

var MiddlewareRegistry = function () {
  function MiddlewareRegistry() {
    _classCallCheck(this, MiddlewareRegistry);

    this._middlewares = [];
    this._contextCache = {};
  }

  _createClass(MiddlewareRegistry, [{
    key: 'sort',
    value: function sort() {
      var _this = this;

      var GRAPH_INIT = [GRAPH_HEAD, GRAPH_TAIL];
      var graph = [GRAPH_INIT];
      var sortedMiddlewares = [];
      this._middlewares.forEach(function (middleware) {
        var name = middleware.name;

        var wildcard = checkWildcard(middleware);
        if (wildcard === AFTER) {
          graph.push([GRAPH_TAIL, name]);
        } else if (wildcard === BEFORE) {
          graph.push([name, GRAPH_HEAD]);
        } else {
          graph.push([name, GRAPH_TAIL]);
          graph.push([GRAPH_HEAD, name]);

          middleware[BEFORE].forEach(function (beforeEntry) {
            graph.push([name, beforeEntry]);
          });
          middleware[AFTER].forEach(function (afterEntry) {
            graph.push([afterEntry, name]);
          });
        }
      });

      (0, _toposort2.default)(graph).filter(function (item) {
        return !GRAPH_INIT.includes(item);
      }).forEach(function (name) {
        sortedMiddlewares = sortedMiddlewares.concat(_this._middlewares.filter(function (m) {
          return m.name === name;
        }));
      });

      this._middlewares = sortedMiddlewares;

      return this;
    }
  }, {
    key: 'add',
    value: function add(meta, factory, contextList) {
      validateMeta(meta);

      this._contextCache = {};
      var context = contextList;
      if (!context || !context.length) {
        context = [GLOBAL_CONTEXT];
      } else if (!Array.isArray(context)) {
        context = [context];
      }

      var normalised = _extends({}, meta, { factory: factory, context: context });

      PRIORITIES.forEach(function (k) {
        if (!Array.isArray(meta[k])) {
          normalised[k] = meta[k] ? [meta[k]] : [];
        } else {
          normalised[k] = meta[k];
        }
      });

      if (PRIORITIES.every(function (p) {
        return !normalised[p].length;
      })) {
        normalised[AFTER] = [GRAPH_HEAD];
        normalised[BEFORE] = [GRAPH_TAIL];
      }

      this._middlewares.push(normalised);

      return this;
    }
  }, {
    key: 'getMatchesForContext',
    value: function getMatchesForContext() {
      var context = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : GLOBAL_CONTEXT;

      if (!this._contextCache[context]) {
        var requestedContext = context.split('.');
        this._contextCache[context] = this._middlewares.filter(function (middleware) {
          return middleware.context[0] === GLOBAL_CONTEXT || middleware.context.every(function (part, index) {
            return part === WILDCARD || requestedContext[index] === part;
          });
        });
      }
      return this._contextCache[context];
    }
  }]);

  return MiddlewareRegistry;
}();

exports.GLOBAL_CONTEXT = GLOBAL_CONTEXT;
exports.default = MiddlewareRegistry;

/***/ }),

/***/ "./client/src/lib/dependency-injection/applyFormMiddleware.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _Injector = __webpack_require__("./client/src/lib/Injector.js");

var _Injector2 = _interopRequireDefault(_Injector);

var _getIn = __webpack_require__("./node_modules/redux-form/lib/structure/plain/getIn.js");

var _getIn2 = _interopRequireDefault(_getIn);

var _setIn = __webpack_require__("./node_modules/redux-form/lib/structure/plain/setIn.js");

var _setIn2 = _interopRequireDefault(_setIn);

var _reduxForm = __webpack_require__(12);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var omittedActions = [_reduxForm.actionTypes.REGISTER_FIELD, _reduxForm.actionTypes.DESTROY];

var applyFormMiddleware = function applyFormMiddleware(reducer) {
  return function () {
    return function (state, action) {
      var reducedState = reducer(state, action);
      var formName = action.meta && action.meta.form;

      if (!formName || omittedActions.includes(action.type)) {
        return reducedState;
      }

      var formSchemaMiddleware = _Injector2.default.form.getSchema(formName);
      if (!formSchemaMiddleware) {
        return reducedState;
      }

      var reduxFormState = (0, _getIn2.default)(reducedState.formState, formName);
      if (!reduxFormState) {
        return reducedState;
      }

      var newState = _extends({}, reducedState);

      var schemaEntries = Object.entries(reducedState.formSchemas).filter(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2),
            entry = _ref2[1];

        return entry.name === formName;
      });

      if (!schemaEntries.length) {
        return reducedState;
      }

      schemaEntries.forEach(function (_ref3) {
        var _ref4 = _slicedToArray(_ref3, 2),
            schemaKey = _ref4[0],
            formSchemaState = _ref4[1];

        var updates = formSchemaMiddleware(formSchemaState, reduxFormState);

        if (!updates.state || !Array.isArray(updates.state.fields)) {
          throw new Error('\n      One more calls to alterSchema did not return a properly formed schema state\n      object. Check your calls to Injector.transform() which could affect \'' + schemaKey + '\'.\n    ');
        }

        newState = (0, _setIn2.default)(newState, 'formSchemas.' + schemaKey + '.state', updates.state);
      });

      return newState;
    };
  };
};

exports.default = applyFormMiddleware;

/***/ }),

/***/ "./client/src/lib/dependency-injection/buildApolloGraphqlContainer.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _buildBaseContainer = __webpack_require__("./client/src/lib/dependency-injection/buildBaseContainer.js");

var _buildBaseContainer2 = _interopRequireDefault(_buildBaseContainer);

var _ApolloGraphqlManager = __webpack_require__("./client/src/lib/dependency-injection/ApolloGraphqlManager.js");

var _ApolloGraphqlManager2 = _interopRequireDefault(_ApolloGraphqlManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var buildApolloGraphqlContainer = function buildApolloGraphqlContainer() {
  var base = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (0, _buildBaseContainer2.default)();
  var initialTemplates = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var initialFragments = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  return _extends({}, base, {
    templates: _extends({}, initialTemplates),

    fragments: _extends({}, initialFragments),

    scaffold: function scaffold(key, config, _ref) {
      var force = _ref.force;

      throw new Error('This API endpoint is not available yet');
    },
    register: function register(key, config) {
      var _base$register;

      var templateName = config.templateName;


      if (!templateName || !this.templates[templateName]) {
        throw new Error('\nTried to register a new query \'' + key + '\' without a defined template \'' + templateName + '\'. Please ensure the\ntemplateName config is defined and that you have registered the template before registering a query.\n      ');
      }

      for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        args[_key - 2] = arguments[_key];
      }

      return (_base$register = base.register).call.apply(_base$register, [this, key, config].concat(_toConsumableArray(args)));
    },
    registerTemplate: function registerTemplate(templateName) {
      var _this = this;

      var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
          force = _ref2.force;

      base.isProtected.call(this);
      return function (strings) {
        for (var _len2 = arguments.length, expressions = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
          expressions[_key2 - 1] = arguments[_key2];
        }

        if (_this.templates[templateName] && !force) {
          throw new Error('\nTried to register template \'' + templateName + '\' more than once. This practice is discouraged. Consider\nusing Injector.update() to enhance the template rather than override it completely.\nOtherwise, invoke the registerTemplate() function with \'{ force: true }\' as the second argument.\n        ');
        }
        _this.templates = _extends({}, _this.templates, _defineProperty({}, templateName, {
          strings: strings,
          expressions: expressions
        }));
      };
    },
    registerFragment: function registerFragment(fragmentName, fragmentString) {
      var _ref3 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
          force = _ref3.force;

      base.isProtected.call(this);
      if (this.fragments[fragmentName] && !force) {
        throw new Error('\nTried to register fragment \'' + fragmentName + '\' more than once. This practice is discouraged. Consider\nadding a new fragment or using Injector.update() to enhance the template you\'re working with.\nOtherwise, invoke the registerFragment() function with \'{ force: true }\' as the third argument.\n      ');
      }
      this.fragments = _extends({}, this.fragments, _defineProperty({}, fragmentName, fragmentString));
    },
    getTemplates: function getTemplates() {
      return _extends({}, this.templates);
    },
    getFragments: function getFragments() {
      return _extends({}, this.fragments);
    },
    getProcessedManager: function getProcessedManager(key, middlewareMatches) {
      var factories = middlewareMatches.map(function (middleware) {
        return middleware.factory;
      }).reverse();
      var config = this.services[key];

      var manager = new _ApolloGraphqlManager2.default(config, _extends({}, this.templates), _extends({}, this.fragments));
      factories.forEach(function (factory) {
        factory(manager);
      }, config);

      return manager;
    },
    getFactory: function getFactory(key, middlewareMatches) {
      return this.getProcessedManager(key, middlewareMatches).getContainer();
    }
  });
};

exports.default = buildApolloGraphqlContainer;

/***/ }),

/***/ "./client/src/lib/dependency-injection/buildApolloGraphqlScaffoldingContainer.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _templates;

var _buildBaseContainer = __webpack_require__("./client/src/lib/dependency-injection/buildBaseContainer.js");

var _buildBaseContainer2 = _interopRequireDefault(_buildBaseContainer);

var _buildApolloGraphqlContainer = __webpack_require__("./client/src/lib/dependency-injection/buildApolloGraphqlContainer.js");

var _buildApolloGraphqlContainer2 = _interopRequireDefault(_buildApolloGraphqlContainer);

var _buildCreateMutation = __webpack_require__("./client/src/lib/dependency-injection/graphql/buildCreateMutation.js");

var _buildCreateMutation2 = _interopRequireDefault(_buildCreateMutation);

var _buildReadQuery = __webpack_require__("./client/src/lib/dependency-injection/graphql/buildReadQuery.js");

var _buildReadQuery2 = _interopRequireDefault(_buildReadQuery);

var _buildReadOneQuery = __webpack_require__("./client/src/lib/dependency-injection/graphql/buildReadOneQuery.js");

var _buildReadOneQuery2 = _interopRequireDefault(_buildReadOneQuery);

var _buildUpdateMutation = __webpack_require__("./client/src/lib/dependency-injection/graphql/buildUpdateMutation.js");

var _buildUpdateMutation2 = _interopRequireDefault(_buildUpdateMutation);

var _buildDeleteMutation = __webpack_require__("./client/src/lib/dependency-injection/graphql/buildDeleteMutation.js");

var _buildDeleteMutation2 = _interopRequireDefault(_buildDeleteMutation);

var _buildBaseQuery = __webpack_require__("./client/src/lib/dependency-injection/graphql/buildBaseQuery.js");

var _buildBaseQuery2 = _interopRequireDefault(_buildBaseQuery);

var _templates2 = __webpack_require__("./client/src/lib/dependency-injection/graphql/templates.js");

var _tags = __webpack_require__("./client/src/lib/dependency-injection/graphql/tags.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var templates = (_templates = {}, _defineProperty(_templates, _templates2.CREATE, (0, _buildCreateMutation2.default)(_tags.captureTag)), _defineProperty(_templates, _templates2.READ, (0, _buildReadQuery2.default)(_tags.captureTag)), _defineProperty(_templates, _templates2.READ_ONE, (0, _buildReadOneQuery2.default)(_tags.captureTag)), _defineProperty(_templates, _templates2.UPDATE, (0, _buildUpdateMutation2.default)(_tags.captureTag)), _defineProperty(_templates, _templates2.DELETE, (0, _buildDeleteMutation2.default)(_tags.captureTag)), _defineProperty(_templates, _templates2.QUERY, (0, _buildBaseQuery2.default)(_tags.captureTag)), _templates);

var buildApolloGraphqlScaffoldingContainer = function buildApolloGraphqlScaffoldingContainer() {
  var base = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (0, _buildBaseContainer2.default)();
  return (0, _buildApolloGraphqlContainer2.default)(base, templates);
};
exports.default = buildApolloGraphqlScaffoldingContainer;

/***/ }),

/***/ "./client/src/lib/dependency-injection/buildBaseContainer.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _MiddlewareRegistry = __webpack_require__("./client/src/lib/dependency-injection/MiddlewareRegistry.js");

var _MiddlewareRegistry2 = _interopRequireDefault(_MiddlewareRegistry);

var _redux = __webpack_require__(7);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

var buildBaseContainer = function buildBaseContainer() {
  return {
    middlewareRegistries: {},

    services: {},

    factories: {},

    factoryCache: {},

    initialised: false,

    isProtected: function isProtected() {
      if (this.initialised) {
        throw new Error('Cannot mutate DI container after it has been initialised');
      }
    },
    get: function get(key, context) {
      if (!this.initialised) {
        throw new Error('\n      Injector.get(): Attempted to access DI layer before it was initialised.\n      Did you forget to invoke Injector.load()?');
      }
      var factory = this.factories[key];
      if (!factory) {
        throw new Error('Injector.get(): Component ' + key + ' does not exist');
      }

      return factory(context);
    },
    customise: function customise(meta, key, factory) {
      this.isProtected();

      var _key$split = key.split('.'),
          _key$split2 = _toArray(_key$split),
          serviceName = _key$split2[0],
          context = _key$split2.slice(1);

      var registry = this.middlewareRegistries[serviceName];
      if (!registry) {
        registry = new _MiddlewareRegistry2.default();
        this.middlewareRegistries = _extends({}, this.middlewareRegistries, _defineProperty({}, serviceName, registry));
      }
      registry.add(meta, factory, context);
    },
    load: function load() {
      var _this = this;

      this.isProtected();
      this.factories = Object.keys(this.services).reduce(function (factories, key) {
        var middleware = _this.middlewareRegistries[key];
        if (middleware) {
          middleware.sort();

          return _extends({}, factories, _defineProperty({}, key, function () {
            var context = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _MiddlewareRegistry.GLOBAL_CONTEXT;

            var cacheKey = key + '__' + context;
            if (!_this.factoryCache[cacheKey]) {
              var matches = middleware.getMatchesForContext(context);
              _this.factoryCache[cacheKey] = _this.getFactory(key, matches);
            }

            return _this.factoryCache[cacheKey];
          }));
        }
        return _extends({}, factories, _defineProperty({}, key, function () {
          return _this.getFactory(key, []);
        }));
      }, {});

      this.initialised = true;
    },
    register: function register(key, value) {
      var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
          force = _ref.force;

      this.isProtected();

      if (this.services[key] && force !== true) {
        throw new Error('\n      Tried to register service \'' + key + '\' more than once. This practice is discouraged. Consider\n      using Injector.update() to enhance the service rather than override it completely.\n      Otherwise, invoke the register() function with { force: true } as the third argument.\n     ');
      }
      this.services = _extends({}, this.services, _defineProperty({}, key, value));
    },
    registerMany: function registerMany(map) {
      var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
          force = _ref2.force;

      this.isProtected();

      var mapKeys = Object.keys(map);
      var existing = Object.keys(this.services).filter(function (service) {
        return mapKeys.includes(service);
      });
      if (existing.length && force !== true) {
        var list = existing.join(', ');

        throw new Error('\n      Tried to register services (' + list + ') more than once. This practice is discouraged. Consider\n      using Injector.update() to enhance the service rather than override it completely.\n      Otherwise, invoke the register() function with { force: true } as the third argument.\n     ');
      }
      this.services = _extends({}, this.services, map);
    },
    transform: function transform(name, callback) {
      var priorities = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      this.isProtected();

      callback(this.createTransformer(name, priorities));
    },
    createTransformer: function createTransformer(name, priorities) {
      var _this2 = this;

      return function (key, wrapper) {
        _this2.customise(_extends({ name: name }, priorities), key, wrapper);
      };
    },
    getFactory: function getFactory(key, middlewareMatches) {
      var service = this.services[key];
      var middlewares = middlewareMatches.map(function (m) {
        return m.factory;
      });
      return _redux.compose.apply(undefined, _toConsumableArray(middlewares))(service);
    }
  };
};

exports.default = buildBaseContainer;

/***/ }),

/***/ "./client/src/lib/dependency-injection/buildComponentContainer.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _buildBaseContainer = __webpack_require__("./client/src/lib/dependency-injection/buildBaseContainer.js");

var _buildBaseContainer2 = _interopRequireDefault(_buildBaseContainer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var createDisplayName = function createDisplayName(original, transforms) {
  var componentName = original.displayName || original.name || 'Component';
  var names = [componentName].concat(_toConsumableArray(transforms));

  return names.reduce(function (acc, curr) {
    return curr + '(' + acc + ')';
  });
};

var buildComponentContainer = function buildComponentContainer() {
  var base = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (0, _buildBaseContainer2.default)();
  return _extends({}, base, {
    get: function get(key, context) {
      var _base$get;

      for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        args[_key - 2] = arguments[_key];
      }

      var service = (_base$get = base.get).call.apply(_base$get, [this, key, context].concat(_toConsumableArray(args)));

      if (service.displayName && service.displayName.match(/\]$/)) {
        return service;
      }

      var componentName = service.displayName || service.name || 'Component';
      var componentKey = context ? '[' + context + ']' : '';

      service.displayName = '' + componentName + componentKey;

      return service;
    },
    createTransformer: function createTransformer(name, priorities) {
      var _this = this;

      return function (key, wrapper, displayName) {
        _this.customise(_extends({ name: name }, priorities, { displayName: displayName }), key, wrapper);
      };
    },
    getFactory: function getFactory(key, middlewareMatches) {
      var factory = base.getFactory.call(this, key, middlewareMatches);
      var names = middlewareMatches.map(function (middleware) {
        return middleware.displayName || middleware.name;
      });
      factory.displayName = createDisplayName(this.services[key], names);

      return factory;
    }
  });
};

exports.default = buildComponentContainer;

/***/ }),

/***/ "./client/src/lib/dependency-injection/buildFormContainer.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VALIDATION_MIDDLEWARE_SERVICE = exports.SCHEMA_MIDDLEWARE_SERVICE = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _buildBaseContainer = __webpack_require__("./client/src/lib/dependency-injection/buildBaseContainer.js");

var _buildBaseContainer2 = _interopRequireDefault(_buildBaseContainer);

var _FormStateManager = __webpack_require__("./client/src/lib/dependency-injection/FormStateManager.js");

var _FormStateManager2 = _interopRequireDefault(_FormStateManager);

var _FormValidationManager = __webpack_require__("./client/src/lib/dependency-injection/FormValidationManager.js");

var _FormValidationManager2 = _interopRequireDefault(_FormValidationManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var SCHEMA_MIDDLEWARE_SERVICE = 'FormSchemaMiddleware';
var VALIDATION_MIDDLEWARE_SERVICE = 'FormValidationMiddleware';

var buildFormContainer = function buildFormContainer() {
  var _services;

  var base = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (0, _buildBaseContainer2.default)();
  return _extends({}, base, {
    services: (_services = {}, _defineProperty(_services, SCHEMA_MIDDLEWARE_SERVICE, function (state) {
      return state;
    }), _defineProperty(_services, VALIDATION_MIDDLEWARE_SERVICE, function (values) {
      var errors = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      return errors;
    }), _services),

    register: function register() {
      throw new Error('\n      Attempted to register a service on Injector.form. This container accepts only two\n      services by design (' + SCHEMA_MIDDLEWARE_SERVICE + ' and ' + VALIDATION_MIDDLEWARE_SERVICE + ') \n      for updating form schema and adding validation, respectively. Consider using a more\n      generic container, e.g. Injector.reducer.\n    ');
    },
    registerMany: function registerMany() {
      this.register();
    },
    getSchema: function getSchema(context) {
      var _base$get;

      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      return (_base$get = base.get).call.apply(_base$get, [this, SCHEMA_MIDDLEWARE_SERVICE, context].concat(_toConsumableArray(args)));
    },
    getValidation: function getValidation(context) {
      var _base$get2;

      for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        args[_key2 - 1] = arguments[_key2];
      }

      return (_base$get2 = base.get).call.apply(_base$get2, [this, VALIDATION_MIDDLEWARE_SERVICE, context].concat(_toConsumableArray(args)));
    },
    createTransformer: function createTransformer(name, priorities) {
      var _this = this;

      var factory = function factory(serviceName) {
        return function (context, wrapper) {
          return base.customise.call(_this, _extends({ name: name }, priorities), serviceName + '.' + context, wrapper);
        };
      };

      return {
        alterSchema: factory(SCHEMA_MIDDLEWARE_SERVICE),
        addValidation: factory(VALIDATION_MIDDLEWARE_SERVICE)
      };
    },
    getFactory: function getFactory(key, middlewareMatches) {
      var factories = middlewareMatches.map(function (middleware) {
        return middleware.factory;
      });
      if (key === SCHEMA_MIDDLEWARE_SERVICE) {
        return this.getSchemaReducer(factories);
      } else if (key === VALIDATION_MIDDLEWARE_SERVICE) {
        return this.getValidationReducer(factories);
      }
      throw new Error('Invalid service for form injector: ' + key);
    },
    getSchemaReducer: function getSchemaReducer(factories) {
      return function (formSchemaState, reduxFormState) {
        return factories.reduce(function (currentState, currentFactory) {
          var manager = new _FormStateManager2.default(currentState, reduxFormState);
          var modifications = currentFactory(manager);
          return _extends({}, currentState, modifications);
        }, formSchemaState);
      };
    },
    getValidationReducer: function getValidationReducer(factories) {
      return function (values, schema) {
        var validation = new _FormValidationManager2.default(values);
        factories.forEach(function (factory) {
          return factory(values, validation, schema);
        });

        return validation.getState();
      };
    }
  });
};

exports.SCHEMA_MIDDLEWARE_SERVICE = SCHEMA_MIDDLEWARE_SERVICE;
exports.VALIDATION_MIDDLEWARE_SERVICE = VALIDATION_MIDDLEWARE_SERVICE;
exports.default = buildFormContainer;

/***/ }),

/***/ "./client/src/lib/dependency-injection/buildInjectorContainer.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var buildInjectorContainer = function buildInjectorContainer() {
  return {
    services: {},

    initialised: false,

    callbacks: [],

    register: function register(key, value) {
      var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
          force = _ref.force;

      if (this.initialised) {
        throw new Error('Cannot mutate DI container after it has been initialised');
      }
      if (this.services[key] && force !== true) {
        throw new Error('\n      Tried to register service ' + key + ' more than once. This practice is discouraged. Consider\n      using Injector.update() to enhance the service rather than override it completely.\n      Otherwise, invoke the register() function with { force: true } as the third argument.\n     ');
      }

      if (typeof this[key] !== 'undefined' && !this.services[key]) {
        throw new Error('\n      Tried to register service ' + key + ' which is a reserved keyword. This would affect the behaviour\n      of this API class, so it is forbidden to register with Injector.\n      ');
      }

      var requiredMethods = ['load', 'createTransformer', 'get', 'register'];
      if (!requiredMethods.every(function (method) {
        return typeof value[method] === 'function';
      })) {
        throw new Error('\n      Tried to register service ' + key + ' that is not a valid object, Injector requires an object\n      which contains the following methods: ' + requiredMethods.join(', ') + '\n      ');
      }

      this.services[key] = value;

      this[key] = value;
    },
    load: function load() {
      if (this.initialised) {
        throw new Error('Cannot mutate DI container after it has been initialised');
      }
      Object.values(this.services).forEach(function (service) {
        return service.load();
      });

      this.initialised = true;
      this.callbacks.forEach(function (callback) {
        callback();
      });
      this.callbacks = [];
    },
    transform: function transform(name, callback) {
      var priorities = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      if (this.initialised) {
        throw new Error('Cannot mutate DI container after it has been initialised');
      }

      var updater = Object.entries(this.services).reduce(function (updateContainer, _ref2) {
        var _ref3 = _slicedToArray(_ref2, 2),
            serviceName = _ref3[0],
            service = _ref3[1];

        return _extends({}, updateContainer, _defineProperty({}, serviceName, service.createTransformer(name, priorities)));
      }, {});
      callback(updater);
    },
    ready: function ready(callback) {
      if (typeof callback !== 'function') {
        throw new Error('Callback provided is not a function');
      }
      if (this.initialised) {
        callback();
        return;
      }

      this.callbacks = [].concat(_toConsumableArray(this.callbacks), [callback]);
    }
  };
};

exports.default = buildInjectorContainer;

/***/ }),

/***/ "./client/src/lib/dependency-injection/buildReducerContainer.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _buildBaseContainer = __webpack_require__("./client/src/lib/dependency-injection/buildBaseContainer.js");

var _buildBaseContainer2 = _interopRequireDefault(_buildBaseContainer);

var _MiddlewareRegistry = __webpack_require__("./client/src/lib/dependency-injection/MiddlewareRegistry.js");

var _MiddlewareRegistry2 = _interopRequireDefault(_MiddlewareRegistry);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var buildReducerContainer = function buildReducerContainer() {
  var base = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (0, _buildBaseContainer2.default)();
  return _extends({}, base, {
    store: null,

    setStore: function setStore(store) {
      this.store = store;
    },
    customise: function customise(meta, key, factory) {
      var _this = this;

      this.isProtected();

      var registry = this.middlewareRegistries[key];
      if (!registry) {
        registry = new _MiddlewareRegistry2.default();
        this.middlewareRegistries = _extends({}, this.middlewareRegistries, _defineProperty({}, key, registry));
      }
      var enhancedFactory = function enhancedFactory(service) {
        var getState = _this.store && _this.store.getState;

        return factory(service)(getState);
      };
      registry.add(meta, enhancedFactory);
    },
    getAll: function getAll() {
      var newFactories = this.initialised ? Object.entries(this.factories).reduce(function (prev, _ref) {
        var _ref2 = _slicedToArray(_ref, 2),
            key = _ref2[0],
            factory = _ref2[1];

        return _extends({}, prev, _defineProperty({}, key, factory()));
      }, {}) : Object.entries(this.services).reduce(function (prev, _ref3) {
        var _ref4 = _slicedToArray(_ref3, 2),
            key = _ref4[0],
            service = _ref4[1];

        return _extends({}, prev, _defineProperty({}, key, service));
      }, {});

      return newFactories;
    }
  });
};

exports.default = buildReducerContainer;

/***/ }),

/***/ "./client/src/lib/dependency-injection/graphql/buildBaseQuery.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _templateObject = _taggedTemplateLiteral(['', ' ', '', ' {\n    ', '(', ') {\n      ', '\n    }\n  }\n  ', ''], ['', ' ', '', ' {\n    ', '(', ') {\n      ', '\n    }\n  }\n  ', '']);

var _tags = __webpack_require__("./client/src/lib/dependency-injection/graphql/tags.js");

var _helpers = __webpack_require__("./client/src/lib/dependency-injection/graphql/helpers.js");

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var getOperationName = function getOperationName(_ref) {
  var operationName = _ref.operationName,
      queryName = _ref.queryName;
  return operationName || '' + queryName.charAt(0).toUpperCase() + queryName.slice(1);
};

var getQueryName = function getQueryName(_ref2) {
  var queryName = _ref2.queryName;
  return queryName;
};

var getQueryType = function getQueryType(_ref3) {
  var queryType = _ref3.queryType;
  return queryType;
};

var buildReadQuery = function buildReadQuery() {
  var tag = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _tags.defaultTag;
  return tag(_templateObject, getQueryType, getOperationName, _helpers.getVariables, getQueryName, _helpers.getParams, _helpers.getFields, _helpers.getFragments);
};

exports.default = buildReadQuery;

/***/ }),

/***/ "./client/src/lib/dependency-injection/graphql/buildCreateMutation.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _templateObject = _taggedTemplateLiteral(['mutation Create', '(\n    $Input:', 'CreateInputType!\n  ) {\n    create', '(\n      Input: $Input\n    ) {\n      ', '\n    }\n  }\n  ', ''], ['mutation Create', '(\n    $Input:', 'CreateInputType!\n  ) {\n    create', '(\n      Input: $Input\n    ) {\n      ', '\n    }\n  }\n  ', '']);

var _tags = __webpack_require__("./client/src/lib/dependency-injection/graphql/tags.js");

var _helpers = __webpack_require__("./client/src/lib/dependency-injection/graphql/helpers.js");

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var buildCreateMutation = function buildCreateMutation() {
  var tag = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _tags.defaultTag;
  return tag(_templateObject, _helpers.getSingularName, _helpers.getSingularName, _helpers.getSingularName, _helpers.getFields, _helpers.getFragments);
};

exports.default = buildCreateMutation;

/***/ }),

/***/ "./client/src/lib/dependency-injection/graphql/buildDeleteMutation.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _templateObject = _taggedTemplateLiteral(['mutation Delete', '($IDs:[ID]!) {\n    delete', '(IDs: $IDs)\n  }'], ['mutation Delete', '($IDs:[ID]!) {\n    delete', '(IDs: $IDs)\n  }']);

var _tags = __webpack_require__("./client/src/lib/dependency-injection/graphql/tags.js");

var _helpers = __webpack_require__("./client/src/lib/dependency-injection/graphql/helpers.js");

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var buildDeleteMutation = function buildDeleteMutation() {
  var tag = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _tags.defaultTag;
  return tag(_templateObject, _helpers.getSingularName, _helpers.getSingularName);
};

exports.default = buildDeleteMutation;

/***/ }),

/***/ "./client/src/lib/dependency-injection/graphql/buildReadOneQuery.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _templateObject = _taggedTemplateLiteral(['query ReadOne', '($ID: ID!)  {\n    readOne', '(ID: $ID) {\n      ', '\n    }\n  }\n  ', ''], ['query ReadOne', '($ID: ID!)  {\n    readOne', '(ID: $ID) {\n      ', '\n    }\n  }\n  ', '']);

var _tags = __webpack_require__("./client/src/lib/dependency-injection/graphql/tags.js");

var _helpers = __webpack_require__("./client/src/lib/dependency-injection/graphql/helpers.js");

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var buildReadOneQuery = function buildReadOneQuery() {
  var tag = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _tags.defaultTag;
  return tag(_templateObject, _helpers.getSingularName, _helpers.getSingularName, _helpers.getFields, _helpers.getFragments);
};

exports.default = buildReadOneQuery;

/***/ }),

/***/ "./client/src/lib/dependency-injection/graphql/buildReadQuery.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _templateObject = _taggedTemplateLiteral(['query Read', '', ' {\n    read', '', ' {\n      ', '\n    }\n  }\n  ', ''], ['query Read', '', ' {\n    read', '', ' {\n      ', '\n    }\n  }\n  ', '']);

var _tags = __webpack_require__("./client/src/lib/dependency-injection/graphql/tags.js");

var _helpers = __webpack_require__("./client/src/lib/dependency-injection/graphql/helpers.js");

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var buildReadQuery = function buildReadQuery() {
  var tag = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _tags.defaultTag;
  return tag(_templateObject, _helpers.getPluralName, _helpers.getVariables, _helpers.getPluralName, _helpers.getRootParams, _helpers.getFields, _helpers.getFragments);
};

exports.default = buildReadQuery;

/***/ }),

/***/ "./client/src/lib/dependency-injection/graphql/buildUpdateMutation.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _templateObject = _taggedTemplateLiteral(['mutation Update', '(\n    $Input:', 'UpdateInputType!\n    ', '\n  ) {\n    update', '(\n      Input: $Input\n      ', '\n    ) {\n      ', '\n    }\n  }\n  ', ''], ['mutation Update', '(\n    $Input:', 'UpdateInputType!\n    ', '\n  ) {\n    update', '(\n      Input: $Input\n      ', '\n    ) {\n      ', '\n    }\n  }\n  ', '']);

var _tags = __webpack_require__("./client/src/lib/dependency-injection/graphql/tags.js");

var _helpers = __webpack_require__("./client/src/lib/dependency-injection/graphql/helpers.js");

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var buildUpdateMutation = function buildUpdateMutation() {
  var tag = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _tags.defaultTag;
  return tag(_templateObject, _helpers.getSingularName, _helpers.getSingularName, _helpers.getVariables, _helpers.getSingularName, _helpers.getParams, _helpers.getFields, _helpers.getFragments);
};

exports.default = buildUpdateMutation;

/***/ }),

/***/ "./client/src/lib/dependency-injection/graphql/helpers.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var ROOT_FIELD = exports.ROOT_FIELD = 'root';

var paginationFields = {
  limit: 'Int',
  offset: 'Int'
};

var paginateFields = function paginateFields(fields) {
  return 'edges { node { ' + fields.join(' ') + ' } } pageInfo { totalCount }';
};

var getSingularName = exports.getSingularName = function getSingularName(_ref) {
  var singularName = _ref.singularName;
  return singularName;
};

var getPluralName = exports.getPluralName = function getPluralName(_ref2) {
  var pluralName = _ref2.pluralName;
  return pluralName;
};

var getVariables = exports.getVariables = function getVariables(_ref3) {
  var params = _ref3.params,
      _ref3$pagination = _ref3.pagination,
      pagination = _ref3$pagination === undefined ? true : _ref3$pagination;

  var items = pagination ? _extends({}, params, paginationFields) : params;

  var varList = Object.entries(items).map(function (_ref4) {
    var _ref5 = _slicedToArray(_ref4, 2),
        key = _ref5[0],
        type = _ref5[1];

    return '$' + key + ': ' + type;
  });

  return varList.length ? '(' + varList.join(', ') + ')' : '';
};

var getParams = exports.getParams = function getParams(_ref6) {
  var params = _ref6.params,
      _ref6$pagination = _ref6.pagination,
      pagination = _ref6$pagination === undefined ? true : _ref6$pagination;

  var items = pagination ? _extends({}, params, paginationFields) : params;
  var paramList = Object.entries(items).map(function (_ref7) {
    var _ref8 = _slicedToArray(_ref7, 2),
        paramName = _ref8[0],
        varName = _ref8[1];

    return paramName + ': $' + varName;
  });

  return paramList.length ? '(' + paramList.join(', ') + ')' : '';
};

var getRootParams = exports.getRootParams = function getRootParams(_ref9) {
  var args = _ref9.args,
      _ref9$pagination = _ref9.pagination,
      pagination = _ref9$pagination === undefined ? true : _ref9$pagination;

  var fieldParams = args[ROOT_FIELD] || {};

  return getParams({ params: fieldParams, pagination: pagination });
};

var getFields = exports.getFields = function getFields(_ref10) {
  var args = _ref10.args,
      fields = _ref10.fields,
      _ref10$pagination = _ref10.pagination,
      pagination = _ref10$pagination === undefined ? true : _ref10$pagination;
  var stack = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [ROOT_FIELD];

  var strings = fields.map(function (field, i) {
    if (Array.isArray(field)) {
      return '\n      {\n        ' + getFields({ args: args, fields: field, pagination: false }, [].concat(_toConsumableArray(stack), [fields[i - 1]])) + '\n      }';
    }
    var path = [].concat(_toConsumableArray(stack), [field]);
    var key = path.join('/');
    var fieldParams = args[key] || {};

    var str = '' + field + getParams({ params: fieldParams, pagination: false });

    return str;
  });

  if (pagination) {
    return paginateFields(strings);
  }

  return strings.join(' ');
};

var getFragments = exports.getFragments = function getFragments(_ref11) {
  var availableFragments = _ref11.availableFragments,
      _ref11$fragments = _ref11.fragments,
      fragments = _ref11$fragments === undefined ? [] : _ref11$fragments;
  return Object.entries(availableFragments).reduce(function (capturedFragments, _ref12) {
    var _ref13 = _slicedToArray(_ref12, 2),
        key = _ref13[0],
        fragment = _ref13[1];

    return fragments.includes(key) ? capturedFragments + ' ' + fragment : capturedFragments;
  }, '');
};

/***/ }),

/***/ "./client/src/lib/dependency-injection/graphql/tags.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var captureTag = exports.captureTag = function captureTag(strings) {
  for (var _len = arguments.length, expressions = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    expressions[_key - 1] = arguments[_key];
  }

  return {
    strings: strings,
    expressions: expressions
  };
};

var defaultTag = exports.defaultTag = function defaultTag(strings) {
  for (var _len2 = arguments.length, expressions = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
    expressions[_key2 - 1] = arguments[_key2];
  }

  return strings.map(function (partial, index) {
    return '' + partial + (expressions[index] === 0 ? expressions[index] : expressions[index] || '');
  }).join('');
};

var processTag = exports.processTag = function processTag(config) {
  return function (strings) {
    for (var _len3 = arguments.length, expressions = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
      expressions[_key3 - 1] = arguments[_key3];
    }

    var expressed = expressions.map(function (expression) {
      if (typeof expression !== 'function') {
        return expression;
      }
      return expression(config);
    });

    return defaultTag.apply(undefined, [strings].concat(_toConsumableArray(expressed)));
  };
};

/***/ }),

/***/ "./client/src/lib/dependency-injection/graphql/templates.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var CREATE = exports.CREATE = 'scaffoldCreate';
var READ = exports.READ = 'scaffoldRead';
var READ_ONE = exports.READ_ONE = 'scaffoldReadOne';
var UPDATE = exports.UPDATE = 'scaffoldUpdate';
var DELETE = exports.DELETE = 'scaffoldDelete';
var QUERY = exports.QUERY = 'baseQuery';

/***/ }),

/***/ "./client/src/lib/dependency-injection/inject.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _injectorContext = __webpack_require__("./client/src/lib/dependency-injection/injectorContext.js");

var _injectorContext2 = _interopRequireDefault(_injectorContext);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var defaultContext = function defaultContext(props, injectorContext) {
  return injectorContext;
};

var inject = function inject(dependencies, mapDependenciesToProps) {
  var getContext = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : defaultContext;
  return function (InjectingComponent) {
    if (dependencies && !Array.isArray(dependencies)) {
      throw new Error('\n      withInjector() passed an argument for dependencies that is ' + (typeof deps === 'undefined' ? 'undefined' : _typeof(deps)) + '. \n      Must be an array of named dependencies.\n    ');
    }

    if (mapDependenciesToProps && typeof mapDependenciesToProps !== 'function') {
      throw new Error('\n      Second parameter of inject() [mapDependenciesToProps] must be a function, taking the resolved\n      dependencies as enumerated arguments, and returning a map of prop names to dependencies.\n    ');
    }

    if (typeof getContext !== 'function') {
      throw new Error('\n      Third parameter of inject() [getContext] must be a function, taking the component\'s props\n      and current inject context as parameters, and returning a string representing the Injector\n      context to use throughout the component.\n    ');
    }

    var Injector = function (_Component) {
      _inherits(Injector, _Component);

      function Injector(props, context) {
        _classCallCheck(this, Injector);

        var _this = _possibleConstructorReturn(this, (Injector.__proto__ || Object.getPrototypeOf(Injector)).call(this, props, context));

        _this.state = {
          context: getContext(props, context.injector.context)
        };
        return _this;
      }

      _createClass(Injector, [{
        key: 'getChildContext',
        value: function getChildContext() {
          return {
            injector: _extends({}, this.context.injector, {
              context: this.state.context
            })
          };
        }
      }, {
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps, nextContext) {
          var newContext = getContext(nextProps, nextContext.injector.context);

          if (newContext !== this.state.context) {
            this.setState({
              context: newContext
            });
          }
        }
      }, {
        key: 'render',
        value: function render() {
          var _this2 = this;

          var props = {};
          if (dependencies) {
            var get = this.context.injector.get;

            var resolved = dependencies.map(function (dep) {
              return get(dep, _this2.state.context);
            });

            if (mapDependenciesToProps) {
              props = mapDependenciesToProps.apply(undefined, _toConsumableArray(resolved));
            } else {
              dependencies.forEach(function (dep, index) {
                props[dep] = resolved[index];
              });
            }

            if (!props || (typeof props === 'undefined' ? 'undefined' : _typeof(props)) !== 'object') {
              throw new Error('\n            mapDepedenciesToProps parameter passed to inject()\n            should return an object that maps prop names to dependencies\n          ');
            }
          }
          var newProps = _extends({}, props, this.props);
          return _react2.default.createElement(InjectingComponent, newProps);
        }
      }]);

      return Injector;
    }(_react.Component);

    Injector.contextTypes = _injectorContext2.default;

    Injector.childContextTypes = _injectorContext2.default;

    return Injector;
  };
};

exports.default = inject;

/***/ }),

/***/ "./client/src/lib/dependency-injection/injectGraphql.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _Container = __webpack_require__("./client/src/lib/dependency-injection/Container.js");

var _Container2 = _interopRequireDefault(_Container);

var _withInjector = __webpack_require__("./client/src/lib/dependency-injection/withInjector.js");

var _withInjector2 = _interopRequireDefault(_withInjector);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var injectGraphql = function injectGraphql(key, context) {
  return function (DataHandler) {
    var GraphqlInjector = function (_Component) {
      _inherits(GraphqlInjector, _Component);

      function GraphqlInjector(props) {
        _classCallCheck(this, GraphqlInjector);

        var _this = _possibleConstructorReturn(this, (GraphqlInjector.__proto__ || Object.getPrototypeOf(GraphqlInjector)).call(this, props));

        _this.state = {
          target: null,
          error: false
        };
        return _this;
      }

      _createClass(GraphqlInjector, [{
        key: 'componentWillMount',
        value: function componentWillMount() {
          var _this2 = this;

          _Container2.default.ready(function () {
            var error = true;
            var target = null;
            try {
              var graphqlContainer = _this2.context.injector.query(key, context);
              var apolloHOC = graphqlContainer.getApolloHOC();
              target = apolloHOC(DataHandler);
              error = false;
            } catch (e) {
              _this2.setState({ target: target, error: error });

              throw e;
            }

            _this2.setState({ target: target, error: error });
          });
        }
      }, {
        key: 'render',
        value: function render() {
          if (this.state.error) {
            var query = [key, context].join('.');
            var message = 'Error loading \'' + query + '\', perhaps it wasn\'t registered properly?';
            return _react2.default.createElement(
              'div',
              null,
              message
            );
          }

          var Target = this.state.target;
          if (Target) {
            return _react2.default.createElement(Target, this.props);
          }

          return null;
        }
      }]);

      return GraphqlInjector;
    }(_react.Component);

    return (0, _withInjector2.default)(GraphqlInjector);
  };
};

exports.default = injectGraphql;

/***/ }),

/***/ "./client/src/lib/dependency-injection/injectorContext.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _propTypes = __webpack_require__(1);

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  injector: _propTypes2.default.shape({
    get: _propTypes2.default.func,
    context: _propTypes2.default.string,
    validate: _propTypes2.default.func
  })
};

/***/ }),

/***/ "./client/src/lib/dependency-injection/loadComponent.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _reactRedux = __webpack_require__(5);

var _reactApollo = __webpack_require__(22);

var _provideInjector = __webpack_require__("./client/src/lib/dependency-injection/provideInjector.js");

var _provideInjector2 = _interopRequireDefault(_provideInjector);

var _withInjector = __webpack_require__("./client/src/lib/dependency-injection/withInjector.js");

var _withInjector2 = _interopRequireDefault(_withInjector);

var _Container = __webpack_require__("./client/src/lib/dependency-injection/Container.js");

var _Container2 = _interopRequireDefault(_Container);

var _NotFoundComponent = __webpack_require__("./client/src/components/NotFoundComponent/NotFoundComponent.js");

var _NotFoundComponent2 = _interopRequireDefault(_NotFoundComponent);

var _injectorContext = __webpack_require__("./client/src/lib/dependency-injection/injectorContext.js");

var _injectorContext2 = _interopRequireDefault(_injectorContext);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var loadComponent = function loadComponent(targetName) {
  var context = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var overrideInjector = arguments[2];

  var LegacyLoader = function (_Component) {
    _inherits(LegacyLoader, _Component);

    function LegacyLoader(props) {
      _classCallCheck(this, LegacyLoader);

      var _this = _possibleConstructorReturn(this, (LegacyLoader.__proto__ || Object.getPrototypeOf(LegacyLoader)).call(this, props));

      _this.state = {
        target: null,
        error: false
      };
      return _this;
    }

    _createClass(LegacyLoader, [{
      key: 'getChildContext',
      value: function getChildContext() {
        var injectorContext = context && context.context;
        if (!injectorContext) {
          return this.context;
        }
        return {
          injector: _extends({}, this.context.injector, {
            context: injectorContext
          })
        };
      }
    }, {
      key: 'componentWillMount',
      value: function componentWillMount() {
        var _this2 = this;

        _Container2.default.ready(function () {
          if (typeof targetName === 'string') {
            var error = true;
            var target = null;
            try {
              target = _this2.context.injector.get(targetName, context && context.context);
              error = false;
            } catch (e) {
              _this2.setState({ target: target, error: error });

              throw e;
            }

            _this2.setState({ target: target, error: error });
            return;
          }

          _this2.setState({ target: targetName });
        });
      }
    }, {
      key: 'render',
      value: function render() {
        var Target = this.state.target;
        if (this.state.error) {
          var NotFound = _NotFoundComponent2.default;
          try {
            NotFound = this.context.injector.get('NotFoundComponent');
          } catch (e) {}
          return _react2.default.createElement(NotFound, _extends({}, this.props, { itemName: targetName }));
        }

        if (Target) {
          if (context) {
            var fullContext = _extends({}, window.ss, context);
            var store = fullContext.store,
                client = fullContext.apolloClient;

            return _react2.default.createElement(
              _reactApollo.ApolloProvider,
              { client: client },
              _react2.default.createElement(
                _reactRedux.Provider,
                { store: store },
                _react2.default.createElement(Target, this.props)
              )
            );
          }
          return _react2.default.createElement(Target, this.props);
        }
        return null;
      }
    }]);

    return LegacyLoader;
  }(_react.Component);

  LegacyLoader.childContextTypes = _injectorContext2.default;

  var contextInjector = overrideInjector || _provideInjector2.default;

  return contextInjector((0, _withInjector2.default)(LegacyLoader));
};

exports.default = loadComponent;

/***/ }),

/***/ "./client/src/lib/dependency-injection/provideContext.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _injectorContext = __webpack_require__("./client/src/lib/dependency-injection/injectorContext.js");

var _injectorContext2 = _interopRequireDefault(_injectorContext);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var provideContext = function provideContext(context) {
  return function (ContextualComponent) {
    var ContextProvider = function (_Component) {
      _inherits(ContextProvider, _Component);

      function ContextProvider() {
        _classCallCheck(this, ContextProvider);

        return _possibleConstructorReturn(this, (ContextProvider.__proto__ || Object.getPrototypeOf(ContextProvider)).apply(this, arguments));
      }

      _createClass(ContextProvider, [{
        key: 'getChildContext',
        value: function getChildContext() {
          return {
            injector: _extends({}, this.context.injector, {
              context: context
            })
          };
        }
      }, {
        key: 'render',
        value: function render() {
          return _react2.default.createElement(ContextualComponent, this.props);
        }
      }]);

      return ContextProvider;
    }(_react.Component);

    ContextProvider.contextTypes = _injectorContext2.default;

    ContextProvider.childContextTypes = _injectorContext2.default;

    return ContextProvider;
  };
};

exports.default = provideContext;

/***/ }),

/***/ "./client/src/lib/dependency-injection/provideInjector.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _Container = __webpack_require__("./client/src/lib/dependency-injection/Container.js");

var _Container2 = _interopRequireDefault(_Container);

var _injectorContext = __webpack_require__("./client/src/lib/dependency-injection/injectorContext.js");

var _injectorContext2 = _interopRequireDefault(_injectorContext);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function provideInjector(Injectable) {
  var injectorContainer = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _Container2.default;

  var InjectorProvider = function (_Component) {
    _inherits(InjectorProvider, _Component);

    function InjectorProvider() {
      _classCallCheck(this, InjectorProvider);

      return _possibleConstructorReturn(this, (InjectorProvider.__proto__ || Object.getPrototypeOf(InjectorProvider)).apply(this, arguments));
    }

    _createClass(InjectorProvider, [{
      key: 'getChildContext',
      value: function getChildContext() {
        var component = injectorContainer.component,
            form = injectorContainer.form,
            query = injectorContainer.query;


        return {
          injector: {
            query: query.get.bind(query),
            get: component.get.bind(component),
            validate: form.getValidation.bind(form)
          }
        };
      }
    }, {
      key: 'render',
      value: function render() {
        return _react2.default.createElement(Injectable, this.props);
      }
    }]);

    return InjectorProvider;
  }(_react.Component);

  InjectorProvider.childContextTypes = _injectorContext2.default;

  return InjectorProvider;
}

exports.default = provideInjector;

/***/ }),

/***/ "./client/src/lib/dependency-injection/withInjector.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _injectorContext = __webpack_require__("./client/src/lib/dependency-injection/injectorContext.js");

var _injectorContext2 = _interopRequireDefault(_injectorContext);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var withInjector = function withInjector(Component) {
  Component.contextTypes = _extends({}, Component.contextTypes || {}, _injectorContext2.default);

  Component.displayName = 'withInjector(\n    ' + (Component.displayName || Component.name || 'Component') + '\n  )';

  return Component;
};

exports.default = withInjector;

/***/ }),

/***/ "./client/src/state/breadcrumbs/BreadcrumbsActionTypes.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  SET_BREADCRUMBS: 'SET_BREADCRUMBS'
};

/***/ }),

/***/ "./client/src/state/breadcrumbs/BreadcrumbsReducer.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _deepFreezeStrict = __webpack_require__(11);

var _deepFreezeStrict2 = _interopRequireDefault(_deepFreezeStrict);

var _BreadcrumbsActionTypes = __webpack_require__("./client/src/state/breadcrumbs/BreadcrumbsActionTypes.js");

var _BreadcrumbsActionTypes2 = _interopRequireDefault(_BreadcrumbsActionTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var initialState = (0, _deepFreezeStrict2.default)([]);

function reducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments[1];

  switch (action.type) {
    case _BreadcrumbsActionTypes2.default.SET_BREADCRUMBS:
      return (0, _deepFreezeStrict2.default)(Object.assign([], action.payload.breadcrumbs));

    default:
      return state;
  }
}

exports.default = reducer;

/***/ }),

/***/ "./client/src/state/config/ConfigActionTypes.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  SET_CONFIG: 'SET_CONFIG'
};

/***/ }),

/***/ "./client/src/state/config/ConfigActions.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setConfig = setConfig;

var _ConfigActionTypes = __webpack_require__("./client/src/state/config/ConfigActionTypes.js");

var _ConfigActionTypes2 = _interopRequireDefault(_ConfigActionTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function setConfig(config) {
  return {
    type: _ConfigActionTypes2.default.SET_CONFIG,
    payload: { config: config }
  };
}

/***/ }),

/***/ "./client/src/state/config/ConfigReducer.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _deepFreezeStrict = __webpack_require__(11);

var _deepFreezeStrict2 = _interopRequireDefault(_deepFreezeStrict);

var _ConfigActionTypes = __webpack_require__("./client/src/state/config/ConfigActionTypes.js");

var _ConfigActionTypes2 = _interopRequireDefault(_ConfigActionTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function configReducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var action = arguments[1];

  switch (action.type) {
    case _ConfigActionTypes2.default.SET_CONFIG:
      return (0, _deepFreezeStrict2.default)(Object.assign({}, state, action.payload.config));

    default:
      return state;
  }
}

exports.default = configReducer;

/***/ }),

/***/ "./client/src/state/mobileMenu/MobileMenuActionTypes.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  TOGGLE_MENU: 'TOGGLE_MENU',
  OPEN_MENU: 'OPEN_MENU',
  CLOSE_MENU: 'CLOSE_MENU'
};

/***/ }),

/***/ "./client/src/state/mobileMenu/MobileMenuActions.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toggleMobileMenu = toggleMobileMenu;
exports.openMobileMenu = openMobileMenu;
exports.closeMobileMenu = closeMobileMenu;

var _MobileMenuActionTypes = __webpack_require__("./client/src/state/mobileMenu/MobileMenuActionTypes.js");

var _MobileMenuActionTypes2 = _interopRequireDefault(_MobileMenuActionTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function toggleMobileMenu() {
  return {
    type: _MobileMenuActionTypes2.default.TOGGLE_MENU,
    payload: null
  };
}

function openMobileMenu() {
  return {
    type: _MobileMenuActionTypes2.default.OPEN_MENU,
    payload: null
  };
}

function closeMobileMenu() {
  return {
    type: _MobileMenuActionTypes2.default.CLOSE_MENU,
    payload: null
  };
}

/***/ }),

/***/ "./client/src/state/mobileMenu/MobileMenuReducer.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _deepFreezeStrict = __webpack_require__(11);

var _deepFreezeStrict2 = _interopRequireDefault(_deepFreezeStrict);

var _MobileMenuActionTypes = __webpack_require__("./client/src/state/mobileMenu/MobileMenuActionTypes.js");

var _MobileMenuActionTypes2 = _interopRequireDefault(_MobileMenuActionTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var initialState = {
  isOpen: false
};

function reducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments[1];

  switch (action.type) {
    case _MobileMenuActionTypes2.default.TOGGLE_MENU:
      {
        return (0, _deepFreezeStrict2.default)(_extends({}, state, { isOpen: !state.isOpen }));
      }

    case _MobileMenuActionTypes2.default.OPEN_MENU:
      {
        return (0, _deepFreezeStrict2.default)(_extends({}, state, { isOpen: true }));
      }

    case _MobileMenuActionTypes2.default.CLOSE_MENU:
      {
        return (0, _deepFreezeStrict2.default)(_extends({}, state, { isOpen: false }));
      }

    default:
      {
        return state;
      }
  }
}

exports.default = reducer;

/***/ }),

/***/ "./client/src/state/records/RecordsActionTypes.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  FETCH_RECORDS_REQUEST: 'FETCH_RECORDS_REQUEST',
  FETCH_RECORDS_FAILURE: 'FETCH_RECORDS_FAILURE',
  FETCH_RECORDS_SUCCESS: 'FETCH_RECORDS_SUCCESS',
  FETCH_RECORD_REQUEST: 'FETCH_RECORD_REQUEST',
  FETCH_RECORD_FAILURE: 'FETCH_RECORD_FAILURE',
  FETCH_RECORD_SUCCESS: 'FETCH_RECORD_SUCCESS',
  DELETE_RECORD_REQUEST: 'DELETE_RECORD_REQUEST',
  DELETE_RECORD_FAILURE: 'DELETE_RECORD_FAILURE',
  DELETE_RECORD_SUCCESS: 'DELETE_RECORD_SUCCESS'
};

/***/ }),

/***/ "./client/src/state/records/RecordsReducer.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _deepFreezeStrict = __webpack_require__(11);

var _deepFreezeStrict2 = _interopRequireDefault(_deepFreezeStrict);

var _RecordsActionTypes = __webpack_require__("./client/src/state/records/RecordsActionTypes.js");

var _RecordsActionTypes2 = _interopRequireDefault(_RecordsActionTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var initialState = {};

function recordsReducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments[1];

  switch (action.type) {
    case _RecordsActionTypes2.default.FETCH_RECORDS_SUCCESS:
      {
        var recordType = action.payload.recordType;
        if (!recordType) {
          throw new Error('Undefined record type');
        }
        var records = action.payload.data._embedded[recordType] || [];
        return (0, _deepFreezeStrict2.default)(_extends({}, state, _defineProperty({}, recordType, records)));
      }

    case _RecordsActionTypes2.default.FETCH_RECORD_SUCCESS:
      {
        var _recordType = action.payload.recordType;
        var newRecord = action.payload.data;
        if (!_recordType) {
          throw new Error('Undefined record type');
        }
        if (!newRecord) {
          throw new Error('Undefined record data given');
        }
        var _records = state[_recordType] || [];

        if (_records.find(function (next) {
          return next.ID === newRecord.ID;
        })) {
          return (0, _deepFreezeStrict2.default)(_extends({}, state, _defineProperty({}, _recordType, _records.map(function (next) {
            return next.ID === newRecord.ID ? newRecord : next;
          }))));
        }
        return (0, _deepFreezeStrict2.default)(_extends({}, state, _defineProperty({}, _recordType, [].concat(_toConsumableArray(_records), [newRecord]))));
      }

    case _RecordsActionTypes2.default.DELETE_RECORD_SUCCESS:
      {
        var _recordType2 = action.payload.recordType;
        if (!_recordType2) {
          throw new Error('Undefined record type');
        }
        var _records2 = state[_recordType2].filter(function (record) {
          return record.ID !== action.payload.id;
        });

        return (0, _deepFreezeStrict2.default)(_extends({}, state, _defineProperty({}, _recordType2, _records2)));
      }

    default:
      {
        return state;
      }
  }
}

exports.default = recordsReducer;

/***/ }),

/***/ "./client/src/state/schema/SchemaActionTypes.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var ACTION_TYPES = {
  SET_SCHEMA: 'SET_SCHEMA',
  SET_SCHEMA_STATE_OVERRIDES: 'SET_SCHEMA_STATE_OVERRIDES',
  SET_SCHEMA_LOADING: 'SET_SCHEMA_LOADING'
};

exports.default = ACTION_TYPES;

/***/ }),

/***/ "./client/src/state/schema/SchemaReducer.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = schemaReducer;

var _deepFreezeStrict = __webpack_require__(11);

var _deepFreezeStrict2 = _interopRequireDefault(_deepFreezeStrict);

var _SchemaActionTypes = __webpack_require__("./client/src/state/schema/SchemaActionTypes.js");

var _SchemaActionTypes2 = _interopRequireDefault(_SchemaActionTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var initialState = (0, _deepFreezeStrict2.default)({});

function schemaReducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

  switch (action.type) {
    case _SchemaActionTypes2.default.SET_SCHEMA:
      {
        var oldSchema = state[action.payload.id] || {};

        return (0, _deepFreezeStrict2.default)(_extends({}, state, _defineProperty({}, action.payload.id, _extends({}, oldSchema, action.payload))));
      }

    case _SchemaActionTypes2.default.SET_SCHEMA_STATE_OVERRIDES:
      {
        var schema = state[action.payload.id] || {};
        var stateOverride = action.payload.stateOverride;

        if (!stateOverride || !stateOverride.fields) {
          return state;
        }

        return (0, _deepFreezeStrict2.default)(_extends({}, state, _defineProperty({}, action.payload.id, _extends({}, schema, {
          stateOverride: stateOverride
        }))));
      }

    case _SchemaActionTypes2.default.SET_SCHEMA_LOADING:
      {
        var _schema = state[action.payload.id] || {};
        var metadata = _schema.metadata || {};

        return (0, _deepFreezeStrict2.default)(_extends({}, state, _defineProperty({}, action.payload.id, _extends({}, _schema, {
          metadata: _extends({}, metadata, {
            loading: action.payload.loading
          })
        }))));
      }

    default:
      return state;
  }
}

/***/ }),

/***/ "./client/src/state/tabs/TabsActionTypes.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  TABS_ACTIVATE_TAB: 'TABS_ACTIVATE_TAB'
};

/***/ }),

/***/ "./client/src/state/tabs/TabsReducer.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = tabsReducer;

var _deepFreezeStrict = __webpack_require__(11);

var _deepFreezeStrict2 = _interopRequireDefault(_deepFreezeStrict);

var _reduxFieldReducer = __webpack_require__(35);

var _reduxFieldReducer2 = _interopRequireDefault(_reduxFieldReducer);

var _TabsActionTypes = __webpack_require__("./client/src/state/tabs/TabsActionTypes.js");

var _TabsActionTypes2 = _interopRequireDefault(_TabsActionTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var initialState = (0, _deepFreezeStrict2.default)({ fields: {} });

var initialFieldState = (0, _deepFreezeStrict2.default)({
  activeTab: null
});

function tabsReducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

  var reduceField = (0, _reduxFieldReducer2.default)(state, action, initialFieldState);

  switch (action.type) {
    case _TabsActionTypes2.default.TABS_ACTIVATE_TAB:
      {
        return reduceField(function () {
          return { activeTab: action.payload.tab };
        });
      }

    default:
      return state;
  }
}

/***/ }),

/***/ "./client/src/state/treeDropdownField/TreeDropdownFieldActionTypes.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  TREEFIELD_SET_VISIBLE: 'TREEDROPDOWNFIELD_SET_VISIBLE',
  TREEFIELD_UPDATED_TREE: 'TREEDROPDOWNFIELD_UPDATED_TREE',
  TREEFIELD_UPDATING_TREE: 'TREEDROPDOWNFIELD_UPDATING_TREE',
  TREEFIELD_UPDATE_FAILED: 'TREEFIELD_UPDATE_FAILED',
  TREEFIELD_SET_SEARCH: 'TREEFIELD_SET_SEARCH',
  TREEFIELD_ADD_SELECTED_VALUES: 'TREEFIELD_ADD_SELECTED_VALUES'
};

/***/ }),

/***/ "./client/src/state/treeDropdownField/TreeDropdownFieldActions.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setVisible = setVisible;
exports.beginTreeUpdating = beginTreeUpdating;
exports.updateTree = updateTree;
exports.updateTreeFailed = updateTreeFailed;
exports.setSearch = setSearch;
exports.addSelectedValues = addSelectedValues;

var _TreeDropdownFieldActionTypes = __webpack_require__("./client/src/state/treeDropdownField/TreeDropdownFieldActionTypes.js");

var _TreeDropdownFieldActionTypes2 = _interopRequireDefault(_TreeDropdownFieldActionTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function setVisible(fieldId, path) {
  return {
    type: _TreeDropdownFieldActionTypes2.default.TREEFIELD_SET_VISIBLE,
    payload: { fieldId: fieldId, path: path }
  };
}

function beginTreeUpdating(fieldId, path) {
  return {
    type: _TreeDropdownFieldActionTypes2.default.TREEFIELD_UPDATING_TREE,
    payload: { fieldId: fieldId, path: path }
  };
}

function updateTree(fieldId, path, tree) {
  return {
    type: _TreeDropdownFieldActionTypes2.default.TREEFIELD_UPDATED_TREE,
    payload: { fieldId: fieldId, path: path, tree: tree }
  };
}

function updateTreeFailed(fieldId, path) {
  return {
    type: _TreeDropdownFieldActionTypes2.default.TREEFIELD_UPDATE_FAILED,
    payload: { fieldId: fieldId, path: path }
  };
}

function setSearch(fieldId, search) {
  return {
    type: _TreeDropdownFieldActionTypes2.default.TREEFIELD_SET_SEARCH,
    payload: { fieldId: fieldId, search: search }
  };
}

function addSelectedValues(fieldId, values) {
  return {
    type: _TreeDropdownFieldActionTypes2.default.TREEFIELD_ADD_SELECTED_VALUES,
    payload: { fieldId: fieldId, values: values }
  };
}

/***/ }),

/***/ "./client/src/state/treeDropdownField/TreeDropdownFieldReducer.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = treeDropdownFieldReducer;

var _deepFreezeStrict = __webpack_require__(11);

var _deepFreezeStrict2 = _interopRequireDefault(_deepFreezeStrict);

var _reduxFieldReducer = __webpack_require__(35);

var _reduxFieldReducer2 = _interopRequireDefault(_reduxFieldReducer);

var _TreeDropdownFieldActionTypes = __webpack_require__("./client/src/state/treeDropdownField/TreeDropdownFieldActionTypes.js");

var _TreeDropdownFieldActionTypes2 = _interopRequireDefault(_TreeDropdownFieldActionTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

var initialState = (0, _deepFreezeStrict2.default)({ fields: {} });

var initialFieldState = (0, _deepFreezeStrict2.default)({
  visible: [],

  tree: {},

  loading: [],

  failed: [],

  search: '',

  selectedValues: []
});

function mergeTree(base, path, tree) {
  if (path.length === 0) {
    return tree;
  }

  var _path = _toArray(path),
      nextID = _path[0],
      subPath = _path.slice(1);

  if (!base.children) {
    return base;
  }

  return (0, _deepFreezeStrict2.default)(_extends({}, base, {
    children: base.children.map(function (subTree) {
      return subTree.id === nextID ? mergeTree(subTree, subPath, tree) : subTree;
    })
  }));
}

function idFromPath(path) {
  if (path.length) {
    return path[path.length - 1];
  }
  return 0;
}

function treeDropdownFieldReducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

  var reduceField = (0, _reduxFieldReducer2.default)(state, action, initialFieldState);

  var removeFromList = function removeFromList(list, remove) {
    return list.filter(function (next) {
      return next !== remove;
    });
  };

  var addToList = function addToList(list, add) {
    if (list.find(function (next) {
      return next === add;
    })) {
      return list;
    }
    var newList = [].concat(_toConsumableArray(list), [add]);

    return newList.sort();
  };

  switch (action.type) {
    case _TreeDropdownFieldActionTypes2.default.TREEFIELD_SET_VISIBLE:
      {
        return reduceField(function () {
          return { visible: action.payload.path };
        });
      }

    case _TreeDropdownFieldActionTypes2.default.TREEFIELD_UPDATING_TREE:
      {
        return reduceField(function (field) {
          return {
            loading: addToList(field.loading, idFromPath(action.payload.path)),
            failed: removeFromList(field.failed, idFromPath(action.payload.path))
          };
        });
      }

    case _TreeDropdownFieldActionTypes2.default.TREEFIELD_UPDATED_TREE:
      {
        return reduceField(function (field) {
          return {
            tree: mergeTree(field.tree, action.payload.path, action.payload.tree),

            loading: removeFromList(field.loading, idFromPath(action.payload.path)),
            failed: removeFromList(field.failed, idFromPath(action.payload.path))
          };
        });
      }

    case _TreeDropdownFieldActionTypes2.default.TREEFIELD_UPDATE_FAILED:
      {
        return reduceField(function (field) {
          return {
            loading: removeFromList(field.loading, idFromPath(action.payload.path)),
            failed: addToList(field.failed, idFromPath(action.payload.path))
          };
        });
      }

    case _TreeDropdownFieldActionTypes2.default.TREEFIELD_SET_SEARCH:
      {
        return reduceField(function (field) {
          return _extends({}, field, {
            search: action.payload.search
          });
        });
      }

    case _TreeDropdownFieldActionTypes2.default.TREEFIELD_ADD_SELECTED_VALUES:
      {
        var values = action.payload.values || [];
        return reduceField(function (field) {
          return _extends({}, field, {
            selectedValues: [].concat(_toConsumableArray(field.selectedValues.filter(function (value) {
              return !values.find(function (item) {
                return item.id === value.id;
              });
            })), _toConsumableArray(values)).sort(function (a, b) {
              return a.id - b.id;
            })
          });
        });
      }

    default:
      return state;
  }
}

/***/ }),

/***/ "./client/src/state/unsavedForms/UnsavedFormsActionTypes.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  ADD_FORM_CHANGED: 'ADD_FORM_CHANGED',
  REMOVE_FORM_CHANGED: 'REMOVE_FORM_CHANGED'
};

/***/ }),

/***/ "./client/src/state/unsavedForms/UnsavedFormsReducer.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _deepFreezeStrict = __webpack_require__(11);

var _deepFreezeStrict2 = _interopRequireDefault(_deepFreezeStrict);

var _reduxForm = __webpack_require__(12);

var _UnsavedFormsActionTypes = __webpack_require__("./client/src/state/unsavedForms/UnsavedFormsActionTypes.js");

var _UnsavedFormsActionTypes2 = _interopRequireDefault(_UnsavedFormsActionTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function unsavedFormsReducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var action = arguments[1];

  var formName = action.meta && action.meta.form;

  switch (action.type) {
    case _UnsavedFormsActionTypes2.default.ADD_FORM_CHANGED:
    case _reduxForm.actionTypes.CHANGE:
      {
        return (0, _deepFreezeStrict2.default)([].concat(_toConsumableArray(state.filter(function (form) {
          return form.name !== formName;
        })), [{ name: formName }]));
      }

    case _UnsavedFormsActionTypes2.default.REMOVE_FORM_CHANGED:
    case _reduxForm.actionTypes.STOP_SUBMIT:
      {
        return (0, _deepFreezeStrict2.default)([].concat(_toConsumableArray(state.filter(function (form) {
          return form.name !== formName;
        }))));
      }

    case _reduxForm.actionTypes.DESTROY:
      {
        return (0, _deepFreezeStrict2.default)([].concat(_toConsumableArray(state.filter(function (form) {
          return !formName.includes(form.name);
        }))));
      }

    default:
      {
        return state;
      }
  }
}

exports.default = unsavedFormsReducer;

/***/ }),

/***/ "./client/src/state/usedOn/usedOnActions.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.saveUsedOn = saveUsedOn;
exports.loadUsedOnFailed = loadUsedOnFailed;
exports.loadUsedOn = loadUsedOn;

var _i18n = __webpack_require__(3);

var _i18n2 = _interopRequireDefault(_i18n);

var _usedOnTypes = __webpack_require__("./client/src/state/usedOn/usedOnTypes.js");

var _usedOnTypes2 = _interopRequireDefault(_usedOnTypes);

var _isomorphicFetch = __webpack_require__(15);

var _isomorphicFetch2 = _interopRequireDefault(_isomorphicFetch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function saveUsedOn(identifier, usedOn) {
  return {
    type: _usedOnTypes2.default.SAVE_USED_ON,
    payload: { identifier: identifier, usedOn: usedOn }
  };
}

function loadUsedOnFailed(identifier, error) {
  return {
    type: _usedOnTypes2.default.LOAD_USED_ON_FAILED,
    payload: {
      identifier: identifier,
      error: error.message
    }
  };
}

function loadUsedOn(identifier, method, url) {
  var settings = {
    method: method,
    headers: {
      Accept: 'application/json'
    },
    credentials: 'same-origin'
  };

  return function (dispatch) {
    if (!identifier || !method || !url) {
      var message = _i18n2.default._t('Admin.NOT_AVAILABLE_USED_DATA', 'The usage data is currently unavailable.');
      return Promise.resolve(dispatch(loadUsedOnFailed(identifier, message)));
    }

    dispatch({
      type: _usedOnTypes2.default.LOAD_USED_ON,
      payload: { identifier: identifier }
    });

    return (0, _isomorphicFetch2.default)(url, settings).then(function (response) {
      return response.json();
    }).then(function (usedOn) {
      dispatch(saveUsedOn(identifier, usedOn));
    }).catch(function (error) {
      dispatch(loadUsedOnFailed(identifier, error));
    });
  };
}

/***/ }),

/***/ "./client/src/state/usedOn/usedOnReducer.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _usedOnTypes = __webpack_require__("./client/src/state/usedOn/usedOnTypes.js");

var _usedOnTypes2 = _interopRequireDefault(_usedOnTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var initialState = {
  loading: [],
  usedOn: {},
  errors: {}
};

function usedOnReducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments[1];

  var identifier = action && action.payload && action.payload.identifier;

  if (!identifier) {
    return state;
  }

  switch (action.type) {
    case _usedOnTypes2.default.SAVE_USED_ON:
      {
        var usedOn = action.payload.usedOn;

        return _extends({}, state, {
          loading: state.loading.filter(function (loading) {
            return loading !== identifier;
          }),
          usedOn: _extends({}, state.usedOn, _defineProperty({}, identifier, usedOn.usage))
        });
      }
    case _usedOnTypes2.default.LOAD_USED_ON:
      {
        if (state.loading.includes(identifier)) {
          return state;
        }
        return _extends({}, state, {
          loading: [].concat(_toConsumableArray(state.loading), [identifier]),

          errors: Object.entries(state.errors).reduce(function (result, _ref) {
            var _ref2 = _slicedToArray(_ref, 2),
                key = _ref2[0],
                error = _ref2[1];

            if (key === identifier) {
              return result;
            }
            return _extends({}, result, _defineProperty({}, key, error));
          }, {})
        });
      }
    case _usedOnTypes2.default.LOAD_USED_ON_FAILED:
      {
        var error = action.payload.error;

        return _extends({}, state, {
          loading: state.loading.filter(function (loading) {
            return loading !== identifier;
          }),
          errors: _extends({}, state.errors, _defineProperty({}, identifier, error))
        });
      }
    default:
      {
        return state;
      }
  }
}

exports.default = usedOnReducer;

/***/ }),

/***/ "./client/src/state/usedOn/usedOnTypes.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var ACTION_TYPES = {
  LOAD_USED_ON: 'LOAD_USED_ON',
  SAVE_USED_ON: 'SAVE_USED_ON',
  LOAD_USED_ON_FAILED: 'LOAD_USED_ON_FAILED'
};

exports.default = ACTION_TYPES;

/***/ }),

/***/ "./client/src/state/viewMode/ViewModeActionTypes.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  SELECT_EDIT: 'SELECT_EDIT',
  SELECT_PREVIEW: 'SELECT_PREVIEW',
  SELECT_SPLIT: 'SELECT_SPLIT',
  SPLIT_AVAILABLE: 'SPLIT_AVAILABLE'
};

/***/ }),

/***/ "./client/src/state/viewMode/ViewModeReducer.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _ViewModeActionTypes = __webpack_require__("./client/src/state/viewMode/ViewModeActionTypes.js");

var _ViewModeActionTypes2 = _interopRequireDefault(_ViewModeActionTypes);

var _constants = __webpack_require__("./client/src/lib/constants.js");

var _ViewModeStates = __webpack_require__("./client/src/state/viewMode/ViewModeStates.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var initialState = {
  activeState: _ViewModeStates.VIEW_MODE_STATES.SPLIT,
  splitAvailable: true,
  lockState: false
};

function reducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments[1];

  switch (action.type) {
    case _ViewModeActionTypes2.default.SELECT_EDIT:
      {
        return _extends({}, state, {
          activeState: _ViewModeStates.VIEW_MODE_STATES.EDIT,
          lockState: true
        });
      }

    case _ViewModeActionTypes2.default.SELECT_PREVIEW:
      {
        return _extends({}, state, {
          activeState: _ViewModeStates.VIEW_MODE_STATES.PREVIEW,
          lockState: true
        });
      }

    case _ViewModeActionTypes2.default.SELECT_SPLIT:
      {
        return _extends({}, state, {
          activeState: _ViewModeStates.VIEW_MODE_STATES.SPLIT,
          lockState: false
        });
      }

    case _ViewModeActionTypes2.default.SPLIT_AVAILABLE:
      {
        var splitAvailable = action.payload.panelWidth > _constants.SPLITMODE_BREAKPOINT;
        var activeState = state.activeState;

        if (!state.lockState && activeState === _ViewModeStates.VIEW_MODE_STATES.SPLIT && !splitAvailable) {
          activeState = _ViewModeStates.VIEW_MODE_STATES.EDIT;
        } else if (!state.lockState && activeState === _ViewModeStates.VIEW_MODE_STATES.EDIT && splitAvailable) {
          activeState = _ViewModeStates.VIEW_MODE_STATES.SPLIT;
        }

        return _extends({}, state, {
          splitAvailable: splitAvailable,
          activeState: activeState
        });
      }

    default:
      {
        return state;
      }
  }
}

exports.default = reducer;

/***/ }),

/***/ "./client/src/state/viewMode/ViewModeStates.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var VIEW_MODE_STATES = exports.VIEW_MODE_STATES = {
  EDIT: 'edit',
  PREVIEW: 'preview',
  SPLIT: 'split'
};

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?{\"presets\":[[\"env\",{\"modules\":false}],\"react\"],\"plugins\":[\"transform-object-rest-spread\"],\"comments\":false,\"cacheDirectory\":true}!./client/src/components/Accordion/Accordion.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Accordion = function Accordion(props) {
  return _react2.default.createElement(
    "div",
    {
      className: "accordion",
      role: "tablist",
      "aria-multiselectable": "true"
    },
    props.children
  );
};

exports.default = Accordion;

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?{\"presets\":[[\"env\",{\"modules\":false}],\"react\"],\"plugins\":[\"transform-object-rest-spread\"],\"comments\":false,\"cacheDirectory\":true}!./client/src/components/Accordion/AccordionBlock.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var AccordionBlock = function AccordionBlock(props) {
  var headerID = props.groupid + '_Header';
  var listID = props.groupid + '_Items';
  var listIDAttr = listID.replace(/\\/g, '_');
  var headerIDAttr = headerID.replace(/\\/g, '_');

  var groupProps = {
    id: listIDAttr,
    'aria-expanded': true,
    className: 'list-group list-group-flush collapse show',
    role: 'tabpanel',
    'aria-labelledby': headerID
  };
  return _react2.default.createElement(
    'div',
    { className: 'accordion__block' },
    _react2.default.createElement(
      'a',
      {
        className: 'accordion__title',
        'data-toggle': 'collapse',
        href: '#' + listIDAttr,
        'aria-expanded': 'true',
        'aria-controls': listID,
        id: headerIDAttr,
        role: 'tab'
      },
      props.title
    ),
    _react2.default.createElement(
      'div',
      groupProps,
      props.children
    )
  );
};

exports.default = AccordionBlock;

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?{\"presets\":[[\"env\",{\"modules\":false}],\"react\"],\"plugins\":[\"transform-object-rest-spread\"],\"comments\":false,\"cacheDirectory\":true}!./client/src/components/Badge/Badge.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.statuses = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _classnames = __webpack_require__(4);

var _classnames2 = _interopRequireDefault(_classnames);

var _propTypes = __webpack_require__(1);

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var statuses = exports.statuses = ['default', 'info', 'success', 'warning', 'danger', 'primary', 'secondary'];

var Badge = function (_PureComponent) {
  _inherits(Badge, _PureComponent);

  function Badge() {
    _classCallCheck(this, Badge);

    return _possibleConstructorReturn(this, (Badge.__proto__ || Object.getPrototypeOf(Badge)).apply(this, arguments));
  }

  _createClass(Badge, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          status = _props.status,
          inverted = _props.inverted,
          className = _props.className,
          message = _props.message;

      if (!status) {
        return null;
      }

      var invertedClass = inverted ? 'badge-' + status + '--inverted' : '';

      var compiledClassNames = (0, _classnames2.default)(className, 'badge', 'badge-' + status, invertedClass);
      return _react2.default.createElement(
        'span',
        { className: compiledClassNames },
        message
      );
    }
  }]);

  return Badge;
}(_react.PureComponent);

Badge.propTypes = {
  message: _propTypes2.default.node,
  status: _propTypes2.default.oneOf(statuses),
  className: _propTypes2.default.string,
  inverted: _propTypes2.default.bool
};

Badge.defaultProps = {
  status: 'default',
  className: 'badge-pill',
  inverted: false
};

exports.default = Badge;

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?{\"presets\":[[\"env\",{\"modules\":false}],\"react\"],\"plugins\":[\"transform-object-rest-spread\"],\"comments\":false,\"cacheDirectory\":true}!./client/src/components/Breadcrumb/Breadcrumb.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Component = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _reactRedux = __webpack_require__(5);

var _propTypes = __webpack_require__(1);

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Breadcrumb = function (_Component) {
  _inherits(Breadcrumb, _Component);

  function Breadcrumb() {
    _classCallCheck(this, Breadcrumb);

    return _possibleConstructorReturn(this, (Breadcrumb.__proto__ || Object.getPrototypeOf(Breadcrumb)).apply(this, arguments));
  }

  _createClass(Breadcrumb, [{
    key: 'getLastCrumb',
    value: function getLastCrumb() {
      return this.props.crumbs && this.props.crumbs[this.props.crumbs.length - 1];
    }
  }, {
    key: 'renderBreadcrumbs',
    value: function renderBreadcrumbs() {
      if (!this.props.crumbs) {
        return null;
      }

      return this.props.crumbs.slice(0, -1).map(function (crumb) {
        return _react2.default.createElement(
          'li',
          { key: crumb.text, className: 'breadcrumb__item' },
          _react2.default.createElement(
            'a',
            {
              className: 'breadcrumb__item-title',
              href: crumb.href,
              onClick: crumb.onClick
            },
            crumb.text
          )
        );
      });
    }
  }, {
    key: 'renderLastCrumb',
    value: function renderLastCrumb() {
      var crumb = this.getLastCrumb();
      if (!crumb) {
        return null;
      }

      var iconClassNames = ['breadcrumb__icon'];
      if (crumb.icon) {
        iconClassNames.push(crumb.icon.className);
      }

      return _react2.default.createElement(
        'div',
        { className: 'breadcrumb__item breadcrumb__item--last' },
        _react2.default.createElement(
          'h2',
          { className: 'breadcrumb__item-title' },
          crumb.text,
          crumb.icon && _react2.default.createElement('span', {
            className: iconClassNames.join(' '),
            role: 'button',
            tabIndex: 0,
            onClick: crumb.icon.onClick
          })
        )
      );
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        { className: 'breadcrumb__container fill-height flexbox-area-grow' },
        this.props.crumbs && this.props.crumbs.length > 1 && _react2.default.createElement(
          'div',
          { className: 'breadcrumb__list-container' },
          _react2.default.createElement(
            'ol',
            { className: 'breadcrumb' },
            this.renderBreadcrumbs()
          )
        ),
        this.renderLastCrumb()
      );
    }
  }]);

  return Breadcrumb;
}(_react.Component);

Breadcrumb.propTypes = {
  crumbs: _propTypes2.default.arrayOf(_propTypes2.default.shape({
    onClick: _propTypes2.default.func,
    text: _propTypes2.default.string,
    icon: _propTypes2.default.shape({
      className: _propTypes2.default.string,
      onClick: _propTypes2.default.func,
      action: function action(props) {
        if (props.action) {
          throw new Error('action: no longer used');
        }
      }
    })
  }))
};

function mapStateToProps(state) {
  return {
    crumbs: state.breadcrumbs
  };
}

exports.Component = Breadcrumb;
exports.default = (0, _reactRedux.connect)(mapStateToProps)(Breadcrumb);

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?{\"presets\":[[\"env\",{\"modules\":false}],\"react\"],\"plugins\":[\"transform-object-rest-spread\"],\"comments\":false,\"cacheDirectory\":true}!./client/src/components/CheckboxSetField/CheckboxSetField.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Component = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _OptionField = __webpack_require__("./client/src/components/OptionsetField/OptionField.js");

var _OptionField2 = _interopRequireDefault(_OptionField);

var _FieldHolder = __webpack_require__(8);

var _FieldHolder2 = _interopRequireDefault(_FieldHolder);

var _propTypes = __webpack_require__(1);

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CheckboxSet = function (_Component) {
  _inherits(CheckboxSet, _Component);

  function CheckboxSet(props) {
    _classCallCheck(this, CheckboxSet);

    var _this = _possibleConstructorReturn(this, (CheckboxSet.__proto__ || Object.getPrototypeOf(CheckboxSet)).call(this, props));

    _this.getItemKey = _this.getItemKey.bind(_this);
    _this.getOptionProps = _this.getOptionProps.bind(_this);
    _this.handleChange = _this.handleChange.bind(_this);
    _this.getValues = _this.getValues.bind(_this);
    return _this;
  }

  _createClass(CheckboxSet, [{
    key: 'getItemKey',
    value: function getItemKey(item, index) {
      return this.props.id + '-' + (item.value || 'empty' + index);
    }
  }, {
    key: 'getValues',
    value: function getValues() {
      var values = this.props.value;

      if (!Array.isArray(values)) {
        if (typeof values === 'string') {
          values = values.length ? [values] : [];
        }
        if (typeof values === 'number') {
          values = [values];
        }
      }

      if (values) {
        return values.map(function (value) {
          return '' + value;
        });
      }
      return [];
    }
  }, {
    key: 'getOptionProps',
    value: function getOptionProps(item, index) {
      var values = this.getValues();
      var key = this.getItemKey(item, index);

      return {
        key: key,
        id: key,
        name: this.props.name,
        className: this.props.itemClass,
        disabled: item.disabled || this.props.disabled,
        readOnly: this.props.readOnly,
        onChange: this.handleChange,
        value: values.indexOf('' + item.value) > -1,
        title: item.title,
        type: 'checkbox'
      };
    }
  }, {
    key: 'handleChange',
    value: function handleChange(event, field) {
      var _this2 = this;

      if (typeof this.props.onChange === 'function') {
        var oldValue = this.getValues();
        var value = this.props.source.filter(function (item, index) {
          if (_this2.getItemKey(item, index) === field.id) {
            return field.value === 1;
          }
          return oldValue.indexOf('' + item.value) > -1;
        }).map(function (item) {
          return '' + item.value;
        });

        this.props.onChange(event, { id: this.props.id, value: value });
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      if (!this.props.source) {
        return null;
      }
      return _react2.default.createElement(
        'div',
        null,
        this.props.source.map(function (item, index) {
          return _react2.default.createElement(_OptionField2.default, _extends({}, _this3.getOptionProps(item, index), { hideLabels: true }));
        })
      );
    }
  }]);

  return CheckboxSet;
}(_react.Component);

CheckboxSet.propTypes = {
  className: _propTypes2.default.string,
  extraClass: _propTypes2.default.string,
  itemClass: _propTypes2.default.string,
  id: _propTypes2.default.string,
  name: _propTypes2.default.string.isRequired,
  source: _propTypes2.default.arrayOf(_propTypes2.default.shape({
    value: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.number]),
    title: _propTypes2.default.any,
    disabled: _propTypes2.default.bool
  })),
  onChange: _propTypes2.default.func,
  value: _propTypes2.default.any,
  readOnly: _propTypes2.default.bool,
  disabled: _propTypes2.default.bool
};

CheckboxSet.defaultProps = {
  extraClass: '',
  className: '',
  value: []
};

exports.Component = CheckboxSet;


var CheckboxSetField = function CheckboxSetField(props) {
  var FieldHolder = (0, _FieldHolder2.default)(CheckboxSet);
  return _react2.default.createElement(FieldHolder, props);
};

exports.default = CheckboxSetField;

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?{\"presets\":[[\"env\",{\"modules\":false}],\"react\"],\"plugins\":[\"transform-object-rest-spread\"],\"comments\":false,\"cacheDirectory\":true}!./client/src/components/FieldHolder/FieldHolder.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _reactstrap = __webpack_require__(6);

var _castStringToElement = __webpack_require__("./client/src/lib/castStringToElement.js");

var _castStringToElement2 = _interopRequireDefault(_castStringToElement);

var _classnames2 = __webpack_require__(4);

var _classnames3 = _interopRequireDefault(_classnames2);

var _propTypes = __webpack_require__(1);

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function fieldHolder(Field) {
  var FieldHolder = function (_Component) {
    _inherits(FieldHolder, _Component);

    function FieldHolder() {
      _classCallCheck(this, FieldHolder);

      return _possibleConstructorReturn(this, (FieldHolder.__proto__ || Object.getPrototypeOf(FieldHolder)).apply(this, arguments));
    }

    _createClass(FieldHolder, [{
      key: 'getMessage',
      value: function getMessage() {
        var message = null;
        if (this.props.message && this.props.message.value) {
          message = this.props.message;
        }

        var meta = this.props.meta;
        if (meta && meta.error && meta.touched && (!message || meta.dirty)) {
          message = meta.error;
        }

        return message;
      }
    }, {
      key: 'getHolderProps',
      value: function getHolderProps() {
        var _classnames;

        return {
          className: (0, _classnames3.default)((_classnames = {
            field: true
          }, _defineProperty(_classnames, this.props.extraClass, true), _defineProperty(_classnames, 'readonly', this.props.readOnly), _classnames)),
          id: this.props.holderId
        };
      }
    }, {
      key: 'renderDescription',
      value: function renderDescription() {
        if (this.props.description === null) {
          return null;
        }

        return (0, _castStringToElement2.default)('div', this.props.description, { className: 'form__field-description' });
      }
    }, {
      key: 'renderMessage',
      value: function renderMessage() {
        var message = this.getMessage();
        if (!message) {
          return null;
        }

        var classNames = (0, _classnames3.default)(['form__field-message', 'form__field-message--' + message.type]);
        var body = (0, _castStringToElement2.default)('div', message.value);
        return _react2.default.createElement(
          'div',
          { className: classNames },
          body
        );
      }
    }, {
      key: 'renderLeftTitle',
      value: function renderLeftTitle() {
        var labelText = this.props.leftTitle !== null ? this.props.leftTitle : this.props.title;

        if (!labelText || this.props.hideLabels) {
          return null;
        }

        return (0, _castStringToElement2.default)(_reactstrap.Label, labelText, {
          className: 'form__field-label',
          for: this.props.id
        });
      }
    }, {
      key: 'renderRightTitle',
      value: function renderRightTitle() {
        if (!this.props.rightTitle || this.props.hideLabels) {
          return null;
        }

        return (0, _castStringToElement2.default)(_reactstrap.Label, this.props.rightTitle, {
          className: 'form__field-label',
          for: this.props.id
        });
      }
    }, {
      key: 'renderField',
      value: function renderField() {
        var hasMessage = Boolean(this.getMessage());
        var props = _extends({}, this.props, {
          extraClass: (0, _classnames3.default)(this.props.extraClass, { 'is-invalid': hasMessage })
        });

        var field = _react2.default.createElement(Field, props);
        var prefix = this.props.data.prefix;
        var suffix = this.props.data.suffix;
        if (!prefix && !suffix) {
          return field;
        }
        return _react2.default.createElement(
          _reactstrap.InputGroup,
          null,
          prefix && _react2.default.createElement(
            _reactstrap.InputGroupAddon,
            { addonType: 'prepend' },
            prefix
          ),
          field,
          suffix && _react2.default.createElement(
            _reactstrap.InputGroupAddon,
            { addonType: 'append' },
            suffix
          )
        );
      }
    }, {
      key: 'render',
      value: function render() {
        if (this.props.noHolder) {
          return this.renderField();
        }
        return _react2.default.createElement(
          _reactstrap.FormGroup,
          this.getHolderProps(),
          this.renderLeftTitle(),
          _react2.default.createElement(
            'div',
            { className: 'form__field-holder' },
            this.renderField(),
            this.renderMessage(),
            this.renderDescription()
          ),
          this.renderRightTitle()
        );
      }
    }]);

    return FieldHolder;
  }(_react.Component);

  FieldHolder.propTypes = {
    leftTitle: _propTypes2.default.any,
    rightTitle: _propTypes2.default.any,
    title: _propTypes2.default.any,
    extraClass: _propTypes2.default.string,
    holderId: _propTypes2.default.string,
    id: _propTypes2.default.string,
    name: _propTypes2.default.string,
    description: _propTypes2.default.any,
    hideLabels: _propTypes2.default.bool,
    message: _propTypes2.default.shape({
      extraClass: _propTypes2.default.string,
      value: _propTypes2.default.any,
      type: _propTypes2.default.string
    }),
    data: _propTypes2.default.oneOfType([_propTypes2.default.array, _propTypes2.default.shape({
      prefix: _propTypes2.default.string,
      suffix: _propTypes2.default.string
    })])
  };

  FieldHolder.defaultProps = {
    className: '',
    extraClass: '',
    leftTitle: null,
    rightTitle: null,
    title: '',
    description: null,
    hideLabels: false,
    noHolder: false,
    message: null,
    data: {}
  };

  return FieldHolder;
}

exports.default = fieldHolder;

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?{\"presets\":[[\"env\",{\"modules\":false}],\"react\"],\"plugins\":[\"transform-object-rest-spread\"],\"comments\":false,\"cacheDirectory\":true}!./client/src/components/Focusedzone/Focusedzone.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(1);

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Focusedzone = function (_Component) {
  _inherits(Focusedzone, _Component);

  function Focusedzone(props) {
    _classCallCheck(this, Focusedzone);

    var _this = _possibleConstructorReturn(this, (Focusedzone.__proto__ || Object.getPrototypeOf(Focusedzone)).call(this, props));

    _this.wasClicked = false;

    _this.handleElementClick = _this.handleElementClick.bind(_this);
    _this.handleDocumentClick = _this.handleDocumentClick.bind(_this);
    return _this;
  }

  _createClass(Focusedzone, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var element = this.container;

      element.addEventListener('click', this.handleElementClick);
      document.addEventListener('click', this.handleDocumentClick);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      var element = this.container;
      element.removeEventListener('click', this.handleElementClick);
      document.removeEventListener('click', this.handleDocumentClick);
    }
  }, {
    key: 'handleElementClick',
    value: function handleElementClick() {
      this.wasClicked = true;
    }
  }, {
    key: 'handleDocumentClick',
    value: function handleDocumentClick() {
      if (!this.wasClicked) {
        this.props.onClickOut();
      }
      this.wasClicked = false;
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      return _react2.default.createElement(
        'div',
        {
          className: this.props.className,
          ref: function ref(container) {
            _this2.container = container;
          }
        },
        this.props.children
      );
    }
  }]);

  return Focusedzone;
}(_react.Component);

Focusedzone.propTypes = {
  children: _propTypes2.default.any,
  className: _propTypes2.default.string,
  onClickOut: _propTypes2.default.func.isRequired
};

Focusedzone.defaultProps = {
  className: ''
};

exports.default = Focusedzone;

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?{\"presets\":[[\"env\",{\"modules\":false}],\"react\"],\"plugins\":[\"transform-object-rest-spread\"],\"comments\":false,\"cacheDirectory\":true}!./client/src/components/Form/Form.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Component = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _FormAlert = __webpack_require__(19);

var _FormAlert2 = _interopRequireDefault(_FormAlert);

var _propTypes = __webpack_require__(1);

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Form = function (_Component) {
  _inherits(Form, _Component);

  function Form() {
    _classCallCheck(this, Form);

    return _possibleConstructorReturn(this, (Form.__proto__ || Object.getPrototypeOf(Form)).apply(this, arguments));
  }

  _createClass(Form, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      if (!this.props.autoFocus) {
        return;
      }

      if (this.form) {
        var input = this.form.querySelector('input:not([type=hidden]), select, textarea');
        if (input) {
          input.focus();
          if (input.select) {
            input.select();
          }
        }
      }
    }
  }, {
    key: 'renderMessages',
    value: function renderMessages() {
      if (Array.isArray(this.props.messages)) {
        return this.props.messages.map(function (message, index) {
          return _react2.default.createElement(_FormAlert2.default, _extends({
            key: index,
            className: !index ? 'message-box--panel-top' : ''
          }, message));
        });
      }
      return null;
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var valid = this.props.valid !== false;
      var fields = this.props.mapFieldsToComponents(this.props.fields);
      var actions = this.props.mapActionsToComponents(this.props.actions);
      var messages = this.renderMessages();
      var FormTag = this.props.formTag;

      var className = ['form'];
      if (valid === false) {
        className.push('form--invalid');
      }
      if (this.props.attributes && this.props.attributes.className) {
        className.push(this.props.attributes.className);
      }
      var formProps = _extends({}, this.props.attributes, {
        onSubmit: this.props.handleSubmit,
        className: className.join(' ')
      });

      return _react2.default.createElement(
        FormTag,
        _extends({}, formProps, {
          ref: function ref(form) {
            _this2.form = form;_this2.props.setDOM(form);
          },
          role: 'form'
        }),
        fields && _react2.default.createElement(
          'fieldset',
          this.props.fieldHolder,
          messages,
          this.props.afterMessages,
          fields
        ),
        actions && actions.length ? _react2.default.createElement(
          'div',
          this.props.actionHolder,
          actions
        ) : null
      );
    }
  }]);

  return Form;
}(_react.Component);

Form.propTypes = {
  autoFocus: _propTypes2.default.bool,
  setDOM: _propTypes2.default.func,
  valid: _propTypes2.default.bool,
  actions: _propTypes2.default.array,
  fieldHolder: _propTypes2.default.shape({
    className: _propTypes2.default.string
  }),
  actionHolder: _propTypes2.default.shape({
    className: _propTypes2.default.string
  }),
  extraClass: _propTypes2.default.string,
  afterMessages: _propTypes2.default.node,
  attributes: _propTypes2.default.shape({
    action: _propTypes2.default.string.isRequired,
    className: _propTypes2.default.string,
    encType: _propTypes2.default.string,
    id: _propTypes2.default.string,
    method: _propTypes2.default.string.isRequired
  }),
  fields: _propTypes2.default.array.isRequired,

  handleSubmit: _propTypes2.default.func,
  mapActionsToComponents: _propTypes2.default.func.isRequired,
  mapFieldsToComponents: _propTypes2.default.func.isRequired,
  messages: _propTypes2.default.arrayOf(_propTypes2.default.shape({
    extraClass: _propTypes2.default.string,
    value: _propTypes2.default.any,
    type: _propTypes2.default.string
  })),
  formTag: _propTypes2.default.oneOfType([_propTypes2.default.func, _propTypes2.default.string])
};

Form.defaultProps = {
  setDOM: function setDOM() {
    return null;
  },
  formTag: 'form',
  actionHolder: {
    className: 'btn-toolbar'
  }
};

exports.Component = Form;
exports.default = Form;

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?{\"presets\":[[\"env\",{\"modules\":false}],\"react\"],\"plugins\":[\"transform-object-rest-spread\"],\"comments\":false,\"cacheDirectory\":true}!./client/src/components/Form/FormConstants.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  CSRF_HEADER: 'X-SecurityID' };

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?{\"presets\":[[\"env\",{\"modules\":false}],\"react\"],\"plugins\":[\"transform-object-rest-spread\"],\"comments\":false,\"cacheDirectory\":true}!./client/src/components/FormAction/FormAction.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _castStringToElement = __webpack_require__("./client/src/lib/castStringToElement.js");

var _castStringToElement2 = _interopRequireDefault(_castStringToElement);

var _classnames = __webpack_require__(4);

var _classnames2 = _interopRequireDefault(_classnames);

var _propTypes = __webpack_require__(1);

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var FormAction = function (_Component) {
  _inherits(FormAction, _Component);

  function FormAction(props) {
    _classCallCheck(this, FormAction);

    var _this = _possibleConstructorReturn(this, (FormAction.__proto__ || Object.getPrototypeOf(FormAction)).call(this, props));

    _this.handleClick = _this.handleClick.bind(_this);
    return _this;
  }

  _createClass(FormAction, [{
    key: 'getButtonProps',
    value: function getButtonProps() {
      var _props = this.props,
          attributes = _props.attributes,
          id = _props.id,
          name = _props.name;

      var buttonAttributes = typeof attributes === 'undefined' ? {} : attributes;
      return _extends({}, buttonAttributes, {
        id: id,
        name: name,
        className: this.getButtonClasses(),
        disabled: this.isDisabled(),
        onClick: this.handleClick
      });
    }
  }, {
    key: 'getButtonClasses',
    value: function getButtonClasses() {
      var _props2 = this.props,
          title = _props2.title,
          loading = _props2.loading,
          extraClass = _props2.extraClass;


      var buttonClasses = {
        btn: true,
        'btn--no-text': typeof title !== 'string',
        'btn--loading': loading,
        disabled: this.isDisabled()
      };

      var style = this.getButtonStyle();

      if (style) {
        buttonClasses['btn-' + style] = true;
      }

      var icon = this.getIcon();
      if (icon) {
        buttonClasses['font-icon-' + icon] = true;
      }

      if (typeof extraClass === 'string') {
        buttonClasses[extraClass] = true;
      }

      return (0, _classnames2.default)(buttonClasses);
    }
  }, {
    key: 'getButtonStyle',
    value: function getButtonStyle() {
      if (typeof this.props.data.buttonStyle !== 'undefined') {
        return this.props.data.buttonStyle;
      }

      if (typeof this.props.buttonStyle !== 'undefined') {
        return this.props.buttonStyle;
      }

      var extraClasses = this.props.extraClass.split(' ');

      if (extraClasses.find(function (className) {
        return className.indexOf('btn-') > -1;
      })) {
        return null;
      }

      if (this.isPrimary()) {
        return 'primary';
      }

      return 'secondary';
    }
  }, {
    key: 'getIcon',
    value: function getIcon() {
      return this.props.icon || this.props.data.icon || null;
    }
  }, {
    key: 'getLoadingIcon',
    value: function getLoadingIcon() {
      if (this.props.loading) {
        return _react2.default.createElement(
          'div',
          { className: 'btn__loading-icon' },
          _react2.default.createElement('span', { className: 'btn__circle btn__circle--1' }),
          _react2.default.createElement('span', { className: 'btn__circle btn__circle--2' }),
          _react2.default.createElement('span', { className: 'btn__circle btn__circle--3' })
        );
      }

      return null;
    }
  }, {
    key: 'isDisabled',
    value: function isDisabled() {
      var _props3 = this.props,
          disabled = _props3.disabled,
          readOnly = _props3.readOnly;


      return disabled || readOnly;
    }
  }, {
    key: 'isPrimary',
    value: function isPrimary() {
      var _props4 = this.props,
          extraClass = _props4.extraClass,
          name = _props4.name;


      var extraClasses = extraClass.split(' ');
      return name === 'action_save' || !!extraClasses.find(function (className) {
        return className === 'ss-ui-action-constructive';
      });
    }
  }, {
    key: 'handleClick',
    value: function handleClick(event) {
      if (typeof this.props.onClick === 'function') {
        this.props.onClick(event, this.props.name || this.props.id);
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var title = this.props.title;


      return _react2.default.createElement(
        'button',
        this.getButtonProps(),
        this.getLoadingIcon(),
        (0, _castStringToElement2.default)('span', title, { className: 'btn__title' })
      );
    }
  }]);

  return FormAction;
}(_react.Component);

FormAction.propTypes = {
  id: _propTypes2.default.string,
  name: _propTypes2.default.string,
  onClick: _propTypes2.default.func,
  title: _propTypes2.default.string,
  type: _propTypes2.default.string,
  loading: _propTypes2.default.bool,
  icon: _propTypes2.default.string,
  disabled: _propTypes2.default.bool,
  readOnly: _propTypes2.default.bool,
  data: _propTypes2.default.oneOfType([_propTypes2.default.array, _propTypes2.default.shape({
    buttonStyle: _propTypes2.default.string
  })]),
  extraClass: _propTypes2.default.string,
  attributes: _propTypes2.default.object
};

FormAction.defaultProps = {
  title: '',
  icon: '',
  extraClass: '',
  attributes: {},
  data: {},
  disabled: false,
  readOnly: false
};

exports.default = FormAction;

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?{\"presets\":[[\"env\",{\"modules\":false}],\"react\"],\"plugins\":[\"transform-object-rest-spread\"],\"comments\":false,\"cacheDirectory\":true}!./client/src/components/FormAlert/FormAlert.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _reactstrap = __webpack_require__(6);

var _castStringToElement = __webpack_require__("./client/src/lib/castStringToElement.js");

var _castStringToElement2 = _interopRequireDefault(_castStringToElement);

var _classnames = __webpack_require__(4);

var _classnames2 = _interopRequireDefault(_classnames);

var _propTypes = __webpack_require__(1);

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var FormAlert = function (_Component) {
  _inherits(FormAlert, _Component);

  function FormAlert(props) {
    _classCallCheck(this, FormAlert);

    var _this = _possibleConstructorReturn(this, (FormAlert.__proto__ || Object.getPrototypeOf(FormAlert)).call(this, props));

    _this.handleClosed = _this.handleClosed.bind(_this);

    _this.state = {
      visible: true
    };
    return _this;
  }

  _createClass(FormAlert, [{
    key: 'getMessageStyle',
    value: function getMessageStyle() {
      switch (this.props.type) {
        case 'good':
        case 'success':
          return 'success';
        case 'info':
          return 'info';
        case 'warn':
        case 'warning':
          return 'warning';
        default:
          return 'danger';
      }
    }
  }, {
    key: 'getMessageProps',
    value: function getMessageProps() {
      var type = this.props.type || 'no-type';

      return {
        className: (0, _classnames2.default)(['message-box', 'message-box--' + type, this.props.className, this.props.extraClass]),
        color: this.getMessageStyle(),
        toggle: this.props.closeLabel ? this.handleClosed : null,
        isOpen: this.props.closeLabel ? this.state.visible : true
      };
    }
  }, {
    key: 'handleClosed',
    value: function handleClosed() {
      if (typeof this.props.onClosed === 'function') {
        this.props.onClosed();
      } else {
        this.setState({ visible: false });
      }
    }
  }, {
    key: 'render',
    value: function render() {
      if (typeof this.props.visible !== 'boolean' && this.state.visible || this.props.visible) {
        var body = (0, _castStringToElement2.default)('div', this.props.value);
        if (body) {
          return _react2.default.createElement(
            _reactstrap.Alert,
            this.getMessageProps(),
            body
          );
        }
      }
      return null;
    }
  }]);

  return FormAlert;
}(_react.Component);

FormAlert.propTypes = {
  extraClass: _propTypes2.default.string,
  value: _propTypes2.default.any,
  type: _propTypes2.default.string,
  onClosed: _propTypes2.default.func,
  closeLabel: _propTypes2.default.string,
  visible: _propTypes2.default.bool
};

FormAlert.defaultProps = {
  extraClass: '',
  className: ''
};

exports.default = FormAlert;

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?{\"presets\":[[\"env\",{\"modules\":false}],\"react\"],\"plugins\":[\"transform-object-rest-spread\"],\"comments\":false,\"cacheDirectory\":true}!./client/src/components/FormBuilder/FormBuilder.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.schemaPropType = exports.basePropTypes = exports.Component = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(1);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _merge = __webpack_require__(20);

var _merge2 = _interopRequireDefault(_merge);

var _schemaFieldValues = __webpack_require__(13);

var _schemaFieldValues2 = _interopRequireDefault(_schemaFieldValues);

var _createErrorBlock = __webpack_require__("./client/src/lib/createErrorBlock.js");

var _Backend = __webpack_require__(26);

var _Backend2 = _interopRequireDefault(_Backend);

var _Injector = __webpack_require__(9);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var FormBuilder = function (_Component) {
  _inherits(FormBuilder, _Component);

  function FormBuilder(props) {
    _classCallCheck(this, FormBuilder);

    var _this = _possibleConstructorReturn(this, (FormBuilder.__proto__ || Object.getPrototypeOf(FormBuilder)).call(this, props));

    var schemaStructure = props.schema.schema;
    _this.state = { submittingAction: null };
    _this.submitApi = _Backend2.default.createEndpointFetcher({
      url: schemaStructure.attributes.action,
      method: schemaStructure.attributes.method
    });
    _this.mapActionsToComponents = _this.mapActionsToComponents.bind(_this);
    _this.mapFieldsToComponents = _this.mapFieldsToComponents.bind(_this);
    _this.handleSubmit = _this.handleSubmit.bind(_this);
    _this.handleAction = _this.handleAction.bind(_this);
    _this.buildComponent = _this.buildComponent.bind(_this);
    _this.validateForm = _this.validateForm.bind(_this);
    return _this;
  }

  _createClass(FormBuilder, [{
    key: 'getComponentForDataType',
    value: function getComponentForDataType(dataType, name) {
      var _this2 = this;

      var identifier = this.props.identifier;

      var get = function get(type) {
        return _this2.context.injector.get(type, identifier + '.' + name);
      };

      switch (dataType) {
        case 'Integer':
        case 'Decimal':
          return get('NumberField');
        case 'String':
        case 'Text':
          return get('TextField');
        case 'Date':
          return get('DateField');
        case 'Time':
          return get('TimeField');
        case 'Datetime':
          return get('DatetimeField');
        case 'Hidden':
          return get('HiddenField');
        case 'SingleSelect':
          return get('SingleSelectField');
        case 'Custom':
          return get('GridField');
        case 'Structural':
          return get('CompositeField');
        case 'Boolean':
          return get('CheckboxField');
        case 'MultiSelect':
          return get('CheckboxSetField');
        default:
          return null;
      }
    }
  }, {
    key: 'validateForm',
    value: function validateForm(values) {
      if (typeof this.props.validate === 'function') {
        return this.props.validate(values);
      }

      var schema = this.props.schema && this.props.schema.schema;
      if (!schema) {
        return {};
      }

      var validationMiddleware = this.context.injector.validate(this.props.identifier);

      var middlewareValidationResult = {};
      if (validationMiddleware) {
        middlewareValidationResult = validationMiddleware(values, this.props.schema.schema) || {};
      }

      return (0, _createErrorBlock.createErrorBlock)(middlewareValidationResult);
    }
  }, {
    key: 'buildComponent',
    value: function buildComponent(props) {
      var inputProps = props.input || {};
      var componentProps = _extends({}, props, props.input, {
        onChange: inputProps.onChange ? function (event, payload) {
          inputProps.onChange(payload ? payload.value : event);
        } : null
      });
      delete componentProps.input;
      var identifier = this.props.identifier;
      var name = componentProps.name;

      var SchemaComponent = componentProps.schemaComponent !== null ? this.context.injector.get(componentProps.schemaComponent, identifier + '.' + name) : this.getComponentForDataType(componentProps.schemaType, name);

      if (SchemaComponent === null) {
        return null;
      } else if (componentProps.schemaComponent !== null && SchemaComponent === undefined) {
        throw Error('Component not found in injector: ' + componentProps.schemaComponent);
      }

      var createFn = this.props.createFn;
      if (typeof createFn === 'function') {
        return createFn(SchemaComponent, componentProps);
      }
      return _react2.default.createElement(SchemaComponent, _extends({ key: componentProps.id }, componentProps));
    }
  }, {
    key: 'mapFieldsToComponents',
    value: function mapFieldsToComponents(fields) {
      var _this3 = this;

      var FieldComponent = this.props.baseFieldComponent;
      return fields.map(function (field) {
        var props = field;
        if (field.children) {
          props = Object.assign({}, field, { children: _this3.mapFieldsToComponents(field.children) });
        }
        props = Object.assign({
          onAutofill: _this3.props.onAutofill,
          formid: _this3.props.form
        }, props);

        if (field.schemaType === 'Structural' || field.readOnly === true) {
          return _this3.buildComponent(props);
        }

        return _react2.default.createElement(FieldComponent, _extends({ key: props.id }, props, { component: _this3.buildComponent }));
      });
    }
  }, {
    key: 'handleAction',
    value: function handleAction(event) {
      if (typeof this.props.onAction === 'function') {
        this.props.onAction(event, this.props.values);
      }

      if (!event.isPropagationStopped()) {
        this.setState({ submittingAction: event.currentTarget.name });
      }
    }
  }, {
    key: 'handleSubmit',
    value: function handleSubmit(data) {
      var _this4 = this;

      var action = '';
      if (this.state.submittingAction) {
        action = this.state.submittingAction;
      } else if (this.props.schema.schema.actions[0]) {
        action = this.props.schema.schema.actions[0].name;
      }

      var dataWithAction = Object.assign({}, data, action ? _defineProperty({}, action, 1) : {});
      var requestedSchema = this.props.responseRequestedSchema.join();
      var headers = {
        'X-Formschema-Request': requestedSchema,
        'X-Requested-With': 'XMLHttpRequest'
      };

      var submitFn = function submitFn(customData) {
        return _this4.submitApi(customData || dataWithAction, headers).then(function (formSchema) {
          _this4.setState({ submittingAction: null });
          return formSchema;
        }).catch(function (reason) {
          _this4.setState({ submittingAction: null });
          throw reason;
        });
      };

      if (typeof this.props.onSubmit === 'function') {
        return this.props.onSubmit(dataWithAction, action, submitFn);
      }

      return submitFn();
    }
  }, {
    key: 'mapActionsToComponents',
    value: function mapActionsToComponents(actions) {
      var _this5 = this;

      return actions.map(function (action) {
        var props = Object.assign({}, action);

        if (action.children) {
          props.children = _this5.mapActionsToComponents(action.children);
        } else {
          props.onClick = _this5.handleAction;

          if (_this5.props.submitting && _this5.state.submittingAction === action.name) {
            props.loading = true;
          }
        }

        return _this5.buildComponent(props);
      });
    }
  }, {
    key: 'normalizeFields',
    value: function normalizeFields(fields, state) {
      var _this6 = this;

      return fields.map(function (field) {
        var fieldState = state && state.fields ? state.fields.find(function (item) {
          return item.id === field.id;
        }) : {};
        var data = _merge2.default.recursive(true, (0, _schemaFieldValues.schemaMerge)(field, fieldState), {
          schemaComponent: fieldState && fieldState.component ? fieldState.component : field.component
        });
        if (field.children) {
          data.children = _this6.normalizeFields(field.children, state);
        }

        return data;
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this7 = this;

      var schema = this.props.schema.schema;
      var state = this.props.schema.state;
      var BaseFormComponent = this.props.baseFormComponent;

      var attributes = _extends({}, schema.attributes, {
        className: schema.attributes.class,
        encType: schema.attributes.enctype,

        noValidate: true
      });
      delete attributes.class;
      delete attributes.enctype;

      var _props = this.props,
          asyncValidate = _props.asyncValidate,
          fieldHolder = _props.fieldHolder,
          actionHolder = _props.actionHolder,
          onSubmitFail = _props.onSubmitFail,
          onSubmitSuccess = _props.onSubmitSuccess,
          shouldAsyncValidate = _props.shouldAsyncValidate,
          touchOnBlur = _props.touchOnBlur,
          touchOnChange = _props.touchOnChange,
          persistentSubmitErrors = _props.persistentSubmitErrors,
          form = _props.form,
          afterMessages = _props.afterMessages,
          autoFocus = _props.autoFocus,
          formTag = _props.formTag;


      var props = {
        form: form,
        afterMessages: afterMessages,
        fields: this.normalizeFields(schema.fields, state),
        fieldHolder: fieldHolder,
        actions: this.normalizeFields(schema.actions, state),
        actionHolder: actionHolder,
        attributes: attributes,
        data: schema.data,
        initialValues: (0, _schemaFieldValues2.default)(schema, state),
        onSubmit: this.handleSubmit,
        valid: state && state.valid,
        messages: state && Array.isArray(state.messages) ? state.messages : [],
        mapActionsToComponents: this.mapActionsToComponents,
        mapFieldsToComponents: this.mapFieldsToComponents,
        asyncValidate: asyncValidate,
        onSubmitFail: onSubmitFail,
        onSubmitSuccess: onSubmitSuccess,
        shouldAsyncValidate: shouldAsyncValidate,
        touchOnBlur: touchOnBlur,
        touchOnChange: touchOnChange,
        persistentSubmitErrors: persistentSubmitErrors,
        validate: this.validateForm,
        autoFocus: autoFocus,
        setDOM: function setDOM(formDOM) {
          _this7.formDOM = formDOM;
        },
        formTag: formTag
      };

      return _react2.default.createElement(BaseFormComponent, props);
    }
  }]);

  return FormBuilder;
}(_react.Component);

var schemaPropType = _propTypes2.default.shape({
  id: _propTypes2.default.string,
  schema: _propTypes2.default.shape({
    attributes: _propTypes2.default.shape({
      class: _propTypes2.default.string,
      enctype: _propTypes2.default.string
    }),
    fields: _propTypes2.default.array.isRequired
  }),
  state: _propTypes2.default.shape({
    fields: _propTypes2.default.array
  }),
  loading: _propTypes2.default.boolean,
  stateOverride: _propTypes2.default.shape({
    fields: _propTypes2.default.array
  })
});

var basePropTypes = {
  createFn: _propTypes2.default.func,
  onSubmit: _propTypes2.default.func,
  onAction: _propTypes2.default.func,
  asyncValidate: _propTypes2.default.func,
  onSubmitFail: _propTypes2.default.func,
  onSubmitSuccess: _propTypes2.default.func,
  shouldAsyncValidate: _propTypes2.default.func,
  touchOnBlur: _propTypes2.default.bool,
  touchOnChange: _propTypes2.default.bool,
  persistentSubmitErrors: _propTypes2.default.bool,
  validate: _propTypes2.default.func,
  values: _propTypes2.default.object,
  submitting: _propTypes2.default.bool,
  baseFormComponent: _propTypes2.default.func.isRequired,
  baseFieldComponent: _propTypes2.default.func.isRequired,
  responseRequestedSchema: _propTypes2.default.arrayOf(_propTypes2.default.oneOf(['schema', 'state', 'errors', 'auto'])),
  identifier: function identifier(props, propName, componentName) {
    if (!/^[A-Za-z0-9_.]+$/.test(props[propName])) {
      return new Error('\n        Invalid identifier supplied to ' + componentName + '. Must be a set of\n        dot-separated alphanumeric strings.\n      ');
    }

    return null;
  }
};

FormBuilder.propTypes = Object.assign({}, basePropTypes, {
  form: _propTypes2.default.string.isRequired,
  schema: schemaPropType.isRequired,
  autoFocus: _propTypes2.default.bool
});

FormBuilder.defaultProps = {
  responseRequestedSchema: ['auto'],
  autoFocus: false
};

exports.Component = FormBuilder;
exports.basePropTypes = basePropTypes;
exports.schemaPropType = schemaPropType;
exports.default = (0, _Injector.withInjector)(FormBuilder);

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?{\"presets\":[[\"env\",{\"modules\":false}],\"react\"],\"plugins\":[\"transform-object-rest-spread\"],\"comments\":false,\"cacheDirectory\":true}!./client/src/components/FormBuilderModal/FormBuilderModal.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _i18n = __webpack_require__(3);

var _i18n2 = _interopRequireDefault(_i18n);

var _reactstrap = __webpack_require__(6);

var _FormBuilderLoader = __webpack_require__(28);

var _FormBuilderLoader2 = _interopRequireDefault(_FormBuilderLoader);

var _castStringToElement = __webpack_require__("./client/src/lib/castStringToElement.js");

var _castStringToElement2 = _interopRequireDefault(_castStringToElement);

var _classnames = __webpack_require__(4);

var _classnames2 = _interopRequireDefault(_classnames);

var _propTypes = __webpack_require__(1);

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var noop = function noop() {
  return null;
};

var FormBuilderModal = function (_Component) {
  _inherits(FormBuilderModal, _Component);

  function FormBuilderModal(props) {
    _classCallCheck(this, FormBuilderModal);

    var _this = _possibleConstructorReturn(this, (FormBuilderModal.__proto__ || Object.getPrototypeOf(FormBuilderModal)).call(this, props));

    _this.handleSubmit = _this.handleSubmit.bind(_this);
    _this.handleHide = _this.handleHide.bind(_this);
    _this.clearResponse = _this.clearResponse.bind(_this);
    _this.handleLoadingError = _this.handleLoadingError.bind(_this);
    return _this;
  }

  _createClass(FormBuilderModal, [{
    key: 'getForm',
    value: function getForm() {
      if (!this.props.schemaUrl) {
        return null;
      }
      return _react2.default.createElement(_FormBuilderLoader2.default, {
        fieldHolder: { className: (0, _classnames2.default)('modal-body', this.props.bodyClassName) },
        actionHolder: { className: 'modal-footer' },
        autoFocus: this.props.autoFocus,
        schemaUrl: this.props.schemaUrl,
        onSubmit: this.handleSubmit,
        onAction: this.props.onAction,
        onLoadingError: this.handleLoadingError,
        identifier: this.props.identifier
      });
    }
  }, {
    key: 'getResponse',
    value: function getResponse() {
      if (!this.state || !this.state.response) {
        return null;
      }

      var className = '';

      if (this.state.error) {
        className = this.props.responseClassBad;
      } else {
        className = this.props.responseClassGood;
      }

      return _react2.default.createElement(
        'div',
        { className: className },
        (0, _castStringToElement2.default)('span', { html: this.state.response })
      );
    }
  }, {
    key: 'clearResponse',
    value: function clearResponse() {
      this.setState({
        response: null
      });
    }
  }, {
    key: 'handleLoadingError',
    value: function handleLoadingError(schema) {
      var providesOnLoadingError = this.props.onLoadingError !== noop;
      if (this.props.showErrorMessage || !providesOnLoadingError) {
        var error = schema.errors && schema.errors[0];
        this.setState({
          response: error.value,
          error: true
        });
      }
      if (providesOnLoadingError) {
        this.props.onLoadingError(schema);
      }
    }
  }, {
    key: 'handleHide',
    value: function handleHide() {
      this.clearResponse();
      if (typeof this.props.onClosed === 'function') {
        this.props.onClosed();
      }
    }
  }, {
    key: 'handleSubmit',
    value: function handleSubmit(data, action, submitFn) {
      var _this2 = this;

      this.clearResponse();
      var promise = null;
      if (typeof this.props.onSubmit === 'function') {
        promise = this.props.onSubmit(data, action, submitFn);
      } else {
        promise = submitFn();
      }

      if (promise) {
        promise.then(function (response) {
          if (response) {
            _this2.setState({
              response: response.message,
              error: false
            });
          }
          return response;
        }).catch(function (errorPromise) {
          errorPromise.then(function (errorText) {
            _this2.setState({
              response: errorText,
              error: true
            });
          });
        });
      } else {
        throw new Error('Promise was not returned for submitting');
      }

      return promise;
    }
  }, {
    key: 'renderHeader',
    value: function renderHeader() {
      if (this.props.title !== false) {
        return _react2.default.createElement(
          _reactstrap.ModalHeader,
          { toggle: this.handleHide },
          this.props.title
        );
      }

      if (this.props.showCloseButton === true && typeof this.props.onClosed === 'function') {
        return _react2.default.createElement('button', {
          type: 'button',
          className: 'close modal__close-button',
          onClick: this.handleHide,
          'aria-label': _i18n2.default._t('Admin.CLOSE', 'Close')
        });
      }

      return null;
    }
  }, {
    key: 'render',
    value: function render() {
      var form = this.getForm();
      var response = this.getResponse();

      return _react2.default.createElement(
        _reactstrap.Modal,
        {
          isOpen: this.props.isOpen,
          toggle: this.handleHide,
          className: this.props.className,
          modalClassName: this.props.modalClassName,
          size: this.props.size
        },
        this.renderHeader(),
        response,
        form,
        this.props.children
      );
    }
  }]);

  return FormBuilderModal;
}(_react.Component);

FormBuilderModal.propTypes = {
  autoFocus: _propTypes2.default.bool,
  isOpen: _propTypes2.default.bool,
  title: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.bool]),
  className: _propTypes2.default.string,
  bodyClassName: _propTypes2.default.string,
  modalClassName: _propTypes2.default.string,
  showCloseButton: _propTypes2.default.bool,
  size: _propTypes2.default.string,
  onClosed: _propTypes2.default.func,
  schemaUrl: _propTypes2.default.string,
  onSubmit: _propTypes2.default.func,
  onAction: _propTypes2.default.func,
  responseClassGood: _propTypes2.default.string,
  responseClassBad: _propTypes2.default.string,
  identifier: _propTypes2.default.string,

  showErrorMessage: _propTypes2.default.bool,
  onLoadingError: _propTypes2.default.func
};

FormBuilderModal.defaultProps = {
  showErrorMessage: false,
  showCloseButton: true,
  onLoadingError: noop,
  isOpen: false,
  title: null,
  modalClassName: 'form-builder-modal',
  responseClassGood: 'alert alert-success',
  responseClassBad: 'alert alert-danger'
};

exports.default = FormBuilderModal;

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?{\"presets\":[[\"env\",{\"modules\":false}],\"react\"],\"plugins\":[\"transform-object-rest-spread\"],\"comments\":false,\"cacheDirectory\":true}!./client/src/components/GridField/GridField.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _i18n = __webpack_require__(3);

var _i18n2 = _interopRequireDefault(_i18n);

var _redux = __webpack_require__(7);

var _reactRedux = __webpack_require__(5);

var _GridFieldTable = __webpack_require__("./client/src/components/GridField/GridFieldTable.js");

var _GridFieldTable2 = _interopRequireDefault(_GridFieldTable);

var _GridFieldHeader = __webpack_require__("./client/src/components/GridField/GridFieldHeader.js");

var _GridFieldHeader2 = _interopRequireDefault(_GridFieldHeader);

var _GridFieldHeaderCell = __webpack_require__("./client/src/components/GridField/GridFieldHeaderCell.js");

var _GridFieldHeaderCell2 = _interopRequireDefault(_GridFieldHeaderCell);

var _GridFieldRow = __webpack_require__("./client/src/components/GridField/GridFieldRow.js");

var _GridFieldRow2 = _interopRequireDefault(_GridFieldRow);

var _GridFieldCell = __webpack_require__("./client/src/components/GridField/GridFieldCell.js");

var _GridFieldCell2 = _interopRequireDefault(_GridFieldCell);

var _GridFieldAction = __webpack_require__("./client/src/components/GridField/GridFieldAction.js");

var _GridFieldAction2 = _interopRequireDefault(_GridFieldAction);

var _FormConstants = __webpack_require__("./client/src/components/Form/FormConstants.js");

var _FormConstants2 = _interopRequireDefault(_FormConstants);

var _RecordsActions = __webpack_require__(50);

var actions = _interopRequireWildcard(_RecordsActions);

var _castStringToElement = __webpack_require__("./client/src/lib/castStringToElement.js");

var _castStringToElement2 = _interopRequireDefault(_castStringToElement);

var _propTypes = __webpack_require__(1);

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var NotYetLoaded = [];

var GridField = function (_Component) {
  _inherits(GridField, _Component);

  function GridField(props) {
    _classCallCheck(this, GridField);

    var _this = _possibleConstructorReturn(this, (GridField.__proto__ || Object.getPrototypeOf(GridField)).call(this, props));

    _this.deleteRecord = _this.deleteRecord.bind(_this);
    _this.editRecord = _this.editRecord.bind(_this);
    return _this;
  }

  _createClass(GridField, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var data = this.props.data;

      this.props.actions.fetchRecords(data.recordType, data.collectionReadEndpoint.method, data.collectionReadEndpoint.url);
    }
  }, {
    key: 'createRowActions',
    value: function createRowActions(record) {
      return _react2.default.createElement(
        _GridFieldCell2.default,
        { className: 'grid-field__cell--actions', key: 'Actions' },
        _react2.default.createElement(_GridFieldAction2.default, {
          icon: 'cog',
          onClick: this.editRecord,
          record: record
        }),
        _react2.default.createElement(_GridFieldAction2.default, {
          icon: 'cancel',
          onClick: this.deleteRecord,
          record: record
        })
      );
    }
  }, {
    key: 'createCell',
    value: function createCell(record, column) {
      var handleDrillDown = this.props.data.onDrillDown;
      var cellProps = {
        className: handleDrillDown ? 'grid-field__cell--drillable' : '',
        onDrillDown: handleDrillDown ? function (event) {
          return handleDrillDown(event, record);
        } : null,
        key: '' + column.name,
        width: column.width
      };
      var val = column.field.split('.').reduce(function (a, b) {
        return a[b];
      }, record);
      return (0, _castStringToElement2.default)(_GridFieldCell2.default, val, cellProps);
    }
  }, {
    key: 'createRow',
    value: function createRow(record) {
      var _this2 = this;

      var rowProps = {
        className: this.props.data.onDrillDown ? 'grid-field__row--drillable' : '',
        key: '' + record.ID
      };
      var cells = this.props.data.columns.map(function (column) {
        return _this2.createCell(record, column);
      });
      var rowActions = this.createRowActions(record);

      return _react2.default.createElement(
        _GridFieldRow2.default,
        rowProps,
        cells,
        rowActions
      );
    }
  }, {
    key: 'deleteRecord',
    value: function deleteRecord(event, id) {
      event.preventDefault();
      var headers = {};
      headers[_FormConstants2.default.CSRF_HEADER] = this.props.config.SecurityID;

      if (!confirm(_i18n2.default._t('CampaignAdmin.DELETECAMPAIGN', 'Are you sure you want to delete this record?'))) {
        return;
      }

      this.props.actions.deleteRecord(this.props.data.recordType, id, this.props.data.itemDeleteEndpoint.method, this.props.data.itemDeleteEndpoint.url, headers);
    }
  }, {
    key: 'editRecord',
    value: function editRecord(event, id) {
      event.preventDefault();

      if (!this.props.data) {
        return;
      }
      if (typeof this.props.data.onEditRecord === 'function') {
        this.props.data.onEditRecord(event, id);
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      if (this.props.records === NotYetLoaded) {
        return _react2.default.createElement(
          'div',
          null,
          _i18n2.default._t('CampaignAdmin.LOADING', 'Loading...')
        );
      }

      if (!this.props.records.length) {
        return _react2.default.createElement(
          'div',
          null,
          _i18n2.default._t('CampaignAdmin.NO_RECORDS', 'No campaigns created yet.')
        );
      }

      var actionPlaceholder = _react2.default.createElement('th', { key: 'holder', className: 'grid-field__action-placeholder' });
      var headerCells = this.props.data.columns.map(function (column) {
        return _react2.default.createElement(
          _GridFieldHeaderCell2.default,
          { key: column.name },
          column.name
        );
      });
      var header = _react2.default.createElement(
        _GridFieldHeader2.default,
        null,
        headerCells.concat(actionPlaceholder)
      );
      var rows = this.props.records.map(function (record) {
        return _this3.createRow(record);
      });

      return _react2.default.createElement(_GridFieldTable2.default, { header: header, rows: rows });
    }
  }]);

  return GridField;
}(_react.Component);

GridField.propTypes = {
  data: _propTypes2.default.shape({
    recordType: _propTypes2.default.string.isRequired,
    headerColumns: _propTypes2.default.array,
    collectionReadEndpoint: _propTypes2.default.object,
    onDrillDown: _propTypes2.default.func,
    onEditRecord: _propTypes2.default.func
  })
};

function mapStateToProps(state, ownProps) {
  var recordType = ownProps.data && ownProps.data.recordType;
  return {
    config: state.config,
    records: recordType && state.records[recordType] ? state.records[recordType] : NotYetLoaded
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: (0, _redux.bindActionCreators)(actions, dispatch)
  };
}

exports.default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(GridField);

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?{\"presets\":[[\"env\",{\"modules\":false}],\"react\"],\"plugins\":[\"transform-object-rest-spread\"],\"comments\":false,\"cacheDirectory\":true}!./client/src/components/GridField/GridFieldCell.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _classnames = __webpack_require__(4);

var _classnames2 = _interopRequireDefault(_classnames);

var _propTypes = __webpack_require__(1);

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var GridFieldCell = function (_Component) {
  _inherits(GridFieldCell, _Component);

  function GridFieldCell(props) {
    _classCallCheck(this, GridFieldCell);

    var _this = _possibleConstructorReturn(this, (GridFieldCell.__proto__ || Object.getPrototypeOf(GridFieldCell)).call(this, props));

    _this.handleDrillDown = _this.handleDrillDown.bind(_this);
    return _this;
  }

  _createClass(GridFieldCell, [{
    key: 'handleDrillDown',
    value: function handleDrillDown(event) {
      if (typeof this.props.onDrillDown === 'function') {
        this.props.onDrillDown(event);
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var classNames = ['grid-field__cell', this.props.className];

      var _props = this.props,
          onDrillDown = _props.onDrillDown,
          props = _objectWithoutProperties(_props, ['onDrillDown']);

      return _react2.default.createElement('td', _extends({}, props, {
        className: (0, _classnames2.default)(classNames),
        onClick: this.handleDrillDown
      }));
    }
  }]);

  return GridFieldCell;
}(_react.Component);

GridFieldCell.propTypes = {
  className: _propTypes2.default.string,
  onDrillDown: _propTypes2.default.func
};

exports.default = GridFieldCell;

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?{\"presets\":[[\"env\",{\"modules\":false}],\"react\"],\"plugins\":[\"transform-object-rest-spread\"],\"comments\":false,\"cacheDirectory\":true}!./client/src/components/GridField/GridFieldHeader.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _GridFieldRow = __webpack_require__("./client/src/components/GridField/GridFieldRow.js");

var _GridFieldRow2 = _interopRequireDefault(_GridFieldRow);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var GridFieldHeader = function GridFieldHeader(props) {
  return _react2.default.createElement(
    _GridFieldRow2.default,
    null,
    props.children
  );
};

exports.default = GridFieldHeader;

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?{\"presets\":[[\"env\",{\"modules\":false}],\"react\"],\"plugins\":[\"transform-object-rest-spread\"],\"comments\":false,\"cacheDirectory\":true}!./client/src/components/GridField/GridFieldHeaderCell.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var GridFieldHeaderCell = function GridFieldHeaderCell(props) {
  return _react2.default.createElement(
    'th',
    null,
    props.children
  );
};

exports.default = GridFieldHeaderCell;

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?{\"presets\":[[\"env\",{\"modules\":false}],\"react\"],\"plugins\":[\"transform-object-rest-spread\"],\"comments\":false,\"cacheDirectory\":true}!./client/src/components/GridField/GridFieldRow.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var GridFieldRow = function GridFieldRow(props) {
  var className = 'grid-field__row ' + props.className;
  return _react2.default.createElement(
    'tr',
    { tabIndex: 0, className: className },
    props.children
  );
};

exports.default = GridFieldRow;

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?{\"presets\":[[\"env\",{\"modules\":false}],\"react\"],\"plugins\":[\"transform-object-rest-spread\"],\"comments\":false,\"cacheDirectory\":true}!./client/src/components/GridField/GridFieldTable.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(1);

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var GridFieldTable = function (_Component) {
  _inherits(GridFieldTable, _Component);

  function GridFieldTable() {
    _classCallCheck(this, GridFieldTable);

    return _possibleConstructorReturn(this, (GridFieldTable.__proto__ || Object.getPrototypeOf(GridFieldTable)).apply(this, arguments));
  }

  _createClass(GridFieldTable, [{
    key: 'generateHeader',
    value: function generateHeader() {
      if (typeof this.props.header !== 'undefined') {
        return this.props.header;
      }

      if (typeof this.props.data !== 'undefined') {}

      return null;
    }
  }, {
    key: 'generateRows',
    value: function generateRows() {
      if (typeof this.props.rows !== 'undefined') {
        return this.props.rows;
      }

      if (typeof this.props.data !== 'undefined') {}

      return null;
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        { className: 'grid-field' },
        _react2.default.createElement(
          'table',
          { className: 'table table-hover grid-field__table' },
          _react2.default.createElement(
            'thead',
            null,
            this.generateHeader()
          ),
          _react2.default.createElement(
            'tbody',
            null,
            this.generateRows()
          )
        )
      );
    }
  }]);

  return GridFieldTable;
}(_react.Component);

GridFieldTable.propTypes = {
  data: _propTypes2.default.object,
  header: _propTypes2.default.object,
  rows: _propTypes2.default.array
};

exports.default = GridFieldTable;

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?{\"presets\":[[\"env\",{\"modules\":false}],\"react\"],\"plugins\":[\"transform-object-rest-spread\"],\"comments\":false,\"cacheDirectory\":true}!./client/src/components/HiddenField/HiddenField.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _reactstrap = __webpack_require__(6);

var _classnames = __webpack_require__(4);

var _classnames2 = _interopRequireDefault(_classnames);

var _propTypes = __webpack_require__(1);

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var HiddenField = function (_Component) {
  _inherits(HiddenField, _Component);

  function HiddenField() {
    _classCallCheck(this, HiddenField);

    return _possibleConstructorReturn(this, (HiddenField.__proto__ || Object.getPrototypeOf(HiddenField)).apply(this, arguments));
  }

  _createClass(HiddenField, [{
    key: 'getInputProps',
    value: function getInputProps() {
      return {
        className: (0, _classnames2.default)(this.props.className, this.props.extraClass),
        id: this.props.id,
        name: this.props.name,
        type: 'hidden',
        value: this.props.value
      };
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(_reactstrap.Input, this.getInputProps());
    }
  }]);

  return HiddenField;
}(_react.Component);

HiddenField.propTypes = {
  id: _propTypes2.default.string,
  extraClass: _propTypes2.default.string,
  name: _propTypes2.default.string.isRequired,
  value: _propTypes2.default.any
};

HiddenField.defaultProps = {
  className: '',
  extraClass: '',
  value: ''
};

exports.default = HiddenField;

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?{\"presets\":[[\"env\",{\"modules\":false}],\"react\"],\"plugins\":[\"transform-object-rest-spread\"],\"comments\":false,\"cacheDirectory\":true}!./client/src/components/ListGroup/ListGroup.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _ListGroupItem = __webpack_require__("./client/src/components/ListGroup/ListGroupItem.js");

var _ListGroupItem2 = _interopRequireDefault(_ListGroupItem);

var _propTypes = __webpack_require__(1);

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ListGroup = function ListGroup(props) {
  return _react2.default.createElement(
    'div',
    { className: 'list-group' },
    props.items.map(function (item) {
      return _react2.default.createElement(_ListGroupItem2.default, item);
    })
  );
};

ListGroup.propTypes = {
  items: _propTypes2.default.array
};

exports.default = ListGroup;

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?{\"presets\":[[\"env\",{\"modules\":false}],\"react\"],\"plugins\":[\"transform-object-rest-spread\"],\"comments\":false,\"cacheDirectory\":true}!./client/src/components/ListGroup/ListGroupItem.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(1);

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ListGroupItem = function (_Component) {
  _inherits(ListGroupItem, _Component);

  function ListGroupItem(props) {
    _classCallCheck(this, ListGroupItem);

    var _this = _possibleConstructorReturn(this, (ListGroupItem.__proto__ || Object.getPrototypeOf(ListGroupItem)).call(this, props));

    _this.handleClick = _this.handleClick.bind(_this);
    return _this;
  }

  _createClass(ListGroupItem, [{
    key: 'handleClick',
    value: function handleClick(event) {
      if (this.props.onClick) {
        this.props.onClick(event, this.props.onClickArg);
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var className = 'list-group-item ' + this.props.className;
      return _react2.default.createElement(
        'a',
        { role: 'button', tabIndex: 0, className: className, onClick: this.handleClick },
        this.props.children
      );
    }
  }]);

  return ListGroupItem;
}(_react.Component);

ListGroupItem.propTypes = {
  onClickArg: _propTypes2.default.any,
  onClick: _propTypes2.default.func
};

exports.default = ListGroupItem;

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?{\"presets\":[[\"env\",{\"modules\":false}],\"react\"],\"plugins\":[\"transform-object-rest-spread\"],\"comments\":false,\"cacheDirectory\":true}!./client/src/components/LiteralField/LiteralField.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(1);

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var LiteralField = function (_Component) {
  _inherits(LiteralField, _Component);

  function LiteralField() {
    _classCallCheck(this, LiteralField);

    return _possibleConstructorReturn(this, (LiteralField.__proto__ || Object.getPrototypeOf(LiteralField)).apply(this, arguments));
  }

  _createClass(LiteralField, [{
    key: 'getContent',
    value: function getContent() {
      return { __html: this.props.value };
    }
  }, {
    key: 'getInputProps',
    value: function getInputProps() {
      return {
        className: this.props.className + ' ' + this.props.extraClass,
        id: this.props.id,
        name: this.props.name
      };
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement('div', _extends({}, this.getInputProps(), {
        dangerouslySetInnerHTML: this.getContent()
      }));
    }
  }]);

  return LiteralField;
}(_react.Component);

LiteralField.propTypes = {
  id: _propTypes2.default.string,
  name: _propTypes2.default.string.isRequired,
  extraClass: _propTypes2.default.string,
  value: _propTypes2.default.string
};

LiteralField.defaultProps = {
  extraClass: '',
  className: ''
};

exports.default = LiteralField;

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?{\"presets\":[[\"env\",{\"modules\":false}],\"react\"],\"plugins\":[\"transform-object-rest-spread\"],\"comments\":false,\"cacheDirectory\":true}!./client/src/components/Loading/Loading.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(1);

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Loading = function (_PureComponent) {
  _inherits(Loading, _PureComponent);

  function Loading() {
    _classCallCheck(this, Loading);

    return _possibleConstructorReturn(this, (Loading.__proto__ || Object.getPrototypeOf(Loading)).apply(this, arguments));
  }

  _createClass(Loading, [{
    key: 'render',
    value: function render() {
      var containerClass = this.props.containerClass;


      return _react2.default.createElement(
        'div',
        { className: containerClass },
        _react2.default.createElement('div', { key: 'overlay', className: 'cms-content-loading-overlay ui-widget-overlay-light' }),
        _react2.default.createElement(
          'div',
          { key: 'spinner', className: 'cms-content-loading-spinner' },
          _react2.default.createElement(
            'div',
            { className: 'spinner' },
            _react2.default.createElement(
              'svg',
              {
                xmlns: 'http://www.w3.org/2000/svg',
                xmlnsXlink: 'http://www.w3.org/1999/xlink',
                viewBox: '0 0 30 30',
                width: '30',
                height: '30',
                className: 'spinner__animation'
              },
              _react2.default.createElement(
                'g',
                null,
                _react2.default.createElement(
                  'defs',
                  null,
                  _react2.default.createElement('path', {
                    id: 'spinner__animation__outline',
                    d: 'M17.6,9.8c-2.3,1.7-2.8,5-1.1,7.3l4.2-3.1 c1.1-0.8,2.7-0.6,3.6,0.5c0.8,1.1,0.6,2.7-0.5,3.6l-6.2,4.6 c-2.3,1.7-2.8,5-1.1,7.3l10.4-7.7c3.4-2.6,4.1-7.4,1.6-10.8 C25.9,8,21.1,7.3,17.6,9.8z M13.4,12.9L9.3,16c-1.1,0.8-2.7,0.6-3.6-0.5 s-0.6-2.7,0.5-3.6l6.2-4.6c2.3-1.7,2.8-5,1.1-7.3L3.1,7.7 c-3.4,2.6-4.1,7.4-1.6,10.8c2.6,3.4,7.4,4.1,10.8,1.6 C14.7,18.4,15.1,15.2,13.4,12.9z'
                  }),
                  _react2.default.createElement(
                    'clipPath',
                    { id: 'spinner__animation__mask' },
                    _react2.default.createElement('use', { xlinkHref: window.location + '#spinner__animation__outline' })
                  )
                ),
                _react2.default.createElement('use', {
                  className: 'spinner__animation__empty',
                  xlinkHref: window.location + '#spinner__animation__outline'
                }),
                _react2.default.createElement('path', {
                  className: 'spinner__animation__fill',
                  clipPath: 'url(' + window.location + '#spinner__animation__mask)',
                  d: 'M15,2.1L4.7,9.8c-2.3,1.7-2.8,4.9-1.1,7.2 s4.9,2.8,7.2,1.1l8.3-6.1c2.3-1.7,5.5-1.2,7.2,1.1 s1.2,5.5-1.1,7.2L15,27.9'
                })
              )
            )
          )
        )
      );
    }
  }]);

  return Loading;
}(_react.PureComponent);

Loading.propTypes = {
  containerClass: _propTypes2.default.string
};

Loading.defaultProps = {
  containerClass: 'flexbox-area-grow'
};

exports.default = Loading;

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?{\"presets\":[[\"env\",{\"modules\":false}],\"react\"],\"plugins\":[\"transform-object-rest-spread\"],\"comments\":false,\"cacheDirectory\":true}!./client/src/components/PopoverField/PopoverField.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _reactstrap = __webpack_require__(6);

var _classnames3 = __webpack_require__(4);

var _classnames4 = _interopRequireDefault(_classnames3);

var _propTypes = __webpack_require__(1);

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PopoverField = function (_Component) {
  _inherits(PopoverField, _Component);

  function PopoverField(props) {
    _classCallCheck(this, PopoverField);

    var _this = _possibleConstructorReturn(this, (PopoverField.__proto__ || Object.getPrototypeOf(PopoverField)).call(this, props));

    _this.toggle = _this.toggle.bind(_this);

    _this.state = {
      isOpen: false
    };
    return _this;
  }

  _createClass(PopoverField, [{
    key: 'getPlacement',
    value: function getPlacement() {
      var placement = this.props.data.placement;
      return placement || 'bottom';
    }
  }, {
    key: 'getContainer',
    value: function getContainer() {
      if (this.props.container) {
        return this.props.container;
      }
      return this.wrapper;
    }
  }, {
    key: 'toggle',
    value: function toggle() {
      var toggleCallback = this.props.toggleCallback;


      this.setState({
        isOpen: !this.state.isOpen
      }, toggleCallback);
    }
  }, {
    key: 'render',
    value: function render() {
      var _classnames,
          _classnames2,
          _this2 = this;

      var placement = this.getPlacement();

      var buttonClasses = (0, _classnames4.default)((_classnames = {
        btn: true,
        'btn-secondary': true
      }, _defineProperty(_classnames, this.props.className, true), _defineProperty(_classnames, this.props.buttonClassName, true), _defineProperty(_classnames, 'btn--no-focus', this.state.isOpen), _defineProperty(_classnames, 'font-icon-dot-3 btn--no-text', !this.props.title), _defineProperty(_classnames, 'btn--icon-' + this.props.buttonSize, !this.props.title), _classnames));

      var buttonProps = {
        id: this.props.id,
        type: 'button',
        className: buttonClasses,
        onClick: this.toggle,
        title: this.props.data.buttonTooltip
      };

      var wrapperClasses = (0, _classnames4.default)((_classnames2 = {}, _defineProperty(_classnames2, this.props.className, true), _defineProperty(_classnames2, 'popover-container', true), _defineProperty(_classnames2, 'popover-field', true), _classnames2));

      return _react2.default.createElement(
        'div',
        { className: wrapperClasses, ref: function ref(wrapper) {
            _this2.wrapper = wrapper;
          } },
        _react2.default.createElement(
          _reactstrap.Button,
          buttonProps,
          this.props.title
        ),
        _react2.default.createElement(
          _reactstrap.Popover,
          {
            id: this.props.id + '_Popover',
            placement: placement,
            isOpen: this.state.isOpen,
            target: this.props.id,
            toggle: this.toggle,
            className: this.props.popoverClassName,
            container: this.getContainer()
          },
          _react2.default.createElement(
            _reactstrap.PopoverHeader,
            null,
            this.props.data.popoverTitle
          ),
          _react2.default.createElement(
            _reactstrap.PopoverBody,
            null,
            this.props.children
          )
        )
      );
    }
  }]);

  return PopoverField;
}(_react.Component);

PopoverField.propTypes = {
  id: _propTypes2.default.string.isRequired,
  title: _propTypes2.default.any,
  container: _propTypes2.default.any,
  className: _propTypes2.default.string,
  buttonClassName: _propTypes2.default.string,
  popoverClassName: _propTypes2.default.string,
  buttonSize: _propTypes2.default.oneOf(['sm', 'md', 'large', 'xl']),
  data: _propTypes2.default.oneOfType([_propTypes2.default.array, _propTypes2.default.shape({
    popoverTitle: _propTypes2.default.string,
    buttonTooltip: _propTypes2.default.string,
    placement: _propTypes2.default.oneOf(['top', 'bottom', 'left', 'right'])
  })]),
  toggleCallback: _propTypes2.default.func
};

PopoverField.defaultProps = {
  data: {},
  className: '',
  buttonClassName: '',
  popoverClassName: '',
  buttonSize: 'xl',
  toggleCallback: function toggleCallback() {}
};

exports.default = PopoverField;

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?{\"presets\":[[\"env\",{\"modules\":false}],\"react\"],\"plugins\":[\"transform-object-rest-spread\"],\"comments\":false,\"cacheDirectory\":true}!./client/src/components/Preview/Preview.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Component = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _i18n = __webpack_require__(3);

var _i18n2 = _interopRequireDefault(_i18n);

var _ActionMenu = __webpack_require__("./client/src/components/ActionMenu/ActionMenu.js");

var _ActionMenu2 = _interopRequireDefault(_ActionMenu);

var _classnames = __webpack_require__(4);

var _classnames2 = _interopRequireDefault(_classnames);

var _Injector = __webpack_require__(9);

var _propTypes = __webpack_require__(1);

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Preview = function (_Component) {
  _inherits(Preview, _Component);

  function Preview(props) {
    _classCallCheck(this, Preview);

    var _this = _possibleConstructorReturn(this, (Preview.__proto__ || Object.getPrototypeOf(Preview)).call(this, props));

    _this.handleBackClick = _this.handleBackClick.bind(_this);
    return _this;
  }

  _createClass(Preview, [{
    key: 'handleBackClick',
    value: function handleBackClick(event) {
      if (typeof this.props.onBack === 'function') {
        event.preventDefault();
        this.props.onBack(event);
      }
    }
  }, {
    key: 'buildToolbarButtons',
    value: function buildToolbarButtons() {
      var toolbarButtons = [];
      if (this.props.itemLinks && this.props.itemLinks.edit) {
        var editUrl = this.props.itemLinks.edit.href;
        toolbarButtons.push(_react2.default.createElement(
          'a',
          { key: 'edit', href: editUrl, className: 'btn btn-outline-secondary font-icon-edit' },
          _react2.default.createElement(
            'span',
            { className: 'btn__title' },
            _i18n2.default._t('Admin.EDIT', 'Edit')
          )
        ));
      }
      return toolbarButtons;
    }
  }, {
    key: 'renderMoreActions',
    value: function renderMoreActions() {
      if (!this.props.moreActions || this.props.moreActions.length === 0) {
        return null;
      }
      return _react2.default.createElement(
        _ActionMenu2.default,
        null,
        this.props.moreActions
      );
    }
  }, {
    key: 'renderBody',
    value: function renderBody() {
      var previewUrl = null;
      var previewType = '';

      if (this.props.itemLinks && this.props.itemLinks.preview) {
        if (this.props.itemLinks.preview.Stage) {
          previewUrl = this.props.itemLinks.preview.Stage.href;
          previewType = this.props.itemLinks.preview.Stage.type;
        } else if (this.props.itemLinks.preview.Live) {
          previewUrl = this.props.itemLinks.preview.Live.href;
          previewType = this.props.itemLinks.preview.Live.type;
        }
      }

      if (!this.props.itemId) {
        return _react2.default.createElement(
          'div',
          { className: 'preview__overlay' },
          _react2.default.createElement(
            'h3',
            { className: 'preview__overlay-text' },
            _i18n2.default._t('Admin.NO_PREVIEW', 'No preview available.')
          )
        );
      }

      if (!previewUrl) {
        return _react2.default.createElement(
          'div',
          { className: 'preview__overlay' },
          _react2.default.createElement(
            'h3',
            { className: 'preview__overlay-text' },
            _i18n2.default._t('Admin.NO_ITEM_PREVIEW', 'There is no preview available for this item.')
          )
        );
      }

      if (previewType && previewType.indexOf('image/') === 0) {
        return _react2.default.createElement(
          'div',
          { className: 'preview__file-container panel--scrollable' },
          _react2.default.createElement('img', { alt: previewUrl, className: 'preview__file--fits-space', src: previewUrl })
        );
      }

      return _react2.default.createElement('iframe', { className: 'flexbox-area-grow preview__iframe', src: previewUrl });
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          className = _props.className,
          ViewModeComponent = _props.ViewModeComponent;


      var classNames = (0, _classnames2.default)('preview', className);
      return _react2.default.createElement(
        'div',
        { className: classNames },
        this.renderBody(),
        _react2.default.createElement(
          'div',
          { className: 'toolbar toolbar--south' },
          _react2.default.createElement(
            'div',
            { className: 'btn-toolbar' },
            this.buildToolbarButtons(),
            _react2.default.createElement(ViewModeComponent, { id: 'view-mode-toggle-in-preview-nb', area: 'preview' }),
            this.renderMoreActions()
          )
        )
      );
    }
  }]);

  return Preview;
}(_react.Component);

Preview.propTypes = {
  className: _propTypes2.default.string,
  itemLinks: _propTypes2.default.object,
  itemId: _propTypes2.default.number,
  onBack: _propTypes2.default.func,
  moreActions: _propTypes2.default.arrayOf(_propTypes2.default.element),
  ViewModeComponent: _propTypes2.default.oneOfType([_propTypes2.default.node, _propTypes2.default.func])
};

Preview.defaultProps = {
  className: 'flexbox-area-grow fill-height'
};

exports.Component = Preview;
exports.default = (0, _Injector.inject)(['ViewModeToggle'], function (ViewModeToggle) {
  return {
    ViewModeComponent: ViewModeToggle
  };
}, function () {
  return 'Admin.Preview';
})(Preview);

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?{\"presets\":[[\"env\",{\"modules\":false}],\"react\"],\"plugins\":[\"transform-object-rest-spread\"],\"comments\":false,\"cacheDirectory\":true}!./client/src/components/ResizeAware/ResizeAware.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _resizeObserverPolyfill = __webpack_require__("./node_modules/resize-observer-polyfill/dist/ResizeObserver.es.js");

var _resizeObserverPolyfill2 = _interopRequireDefault(_resizeObserverPolyfill);

var _propTypes = __webpack_require__(1);

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ResizeAware = function (_Component) {
  _inherits(ResizeAware, _Component);

  function ResizeAware(props) {
    _classCallCheck(this, ResizeAware);

    var _this = _possibleConstructorReturn(this, (ResizeAware.__proto__ || Object.getPrototypeOf(ResizeAware)).call(this, props));

    _this.render = _this.render.bind(_this);
    _this.handleResize = _this.handleResize.bind(_this);

    _this.state = {};

    _this.observer = new _resizeObserverPolyfill2.default(function (entries) {
      return entries.forEach(function (_ref) {
        var contentRect = _ref.contentRect;
        return _this.handleResize(contentRect);
      });
    });
    return _this;
  }

  _createClass(ResizeAware, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.observer.observe(this.container);

      var sizes = {
        width: this.container.offsetWidth,
        height: this.container.offsetHeight
      };
      this.handleResize(sizes);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.observer.disconnect();
    }
  }, {
    key: 'handleResize',
    value: function handleResize(sizes) {
      var _state = this.state,
          width = _state.width,
          height = _state.height;

      if (width !== sizes.width || height !== sizes.height) {
        this.setState(sizes);
      }

      if (this.props.onResize) {
        this.props.onResize(sizes);
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _sizes,
          _this2 = this;

      var _props = this.props,
          children = _props.children,
          onlyEvent = _props.onlyEvent,
          component = _props.component,
          onResize = _props.onResize,
          widthPropName = _props.widthPropName,
          heightPropName = _props.heightPropName,
          props = _objectWithoutProperties(_props, ['children', 'onlyEvent', 'component', 'onResize', 'widthPropName', 'heightPropName']);

      var _state2 = this.state,
          width = _state2.width,
          height = _state2.height;


      var hasCustomComponent = typeof component !== 'string';

      var widthProp = [widthPropName || 'width'];
      var heightProp = [heightPropName || 'height'];

      var sizes = (_sizes = {}, _defineProperty(_sizes, widthProp, width), _defineProperty(_sizes, heightProp, height), _sizes);

      return (0, _react.createElement)(component, _extends(_defineProperty({}, hasCustomComponent ? 'getRef' : 'ref', function (el) {
        _this2.container = el;
      }), hasCustomComponent && sizes, props), typeof children === 'function' ? children({ width: width, height: height }) : _react.Children.map(children, function (child) {
        return (0, _react.isValidElement)(child) ? (0, _react.cloneElement)(child, !onlyEvent ? sizes : null) : child;
      }));
    }
  }]);

  return ResizeAware;
}(_react.Component);

exports.default = ResizeAware;


ResizeAware.propTypes = {
  component: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.func]),
  onResize: _propTypes2.default.func
};

ResizeAware.defaultProps = {
  component: 'div'
};

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?{\"presets\":[[\"env\",{\"modules\":false}],\"react\"],\"plugins\":[\"transform-object-rest-spread\"],\"comments\":false,\"cacheDirectory\":true}!./client/src/components/Search/Search.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hasFilters = exports.Component = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _i18n = __webpack_require__(3);

var _i18n2 = _interopRequireDefault(_i18n);

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _reactRedux = __webpack_require__(5);

var _reactDom = __webpack_require__(10);

var _reactDom2 = _interopRequireDefault(_reactDom);

var _redux = __webpack_require__(7);

var _SchemaActions = __webpack_require__(16);

var schemaActions = _interopRequireWildcard(_SchemaActions);

var _reduxForm = __webpack_require__(12);

var _immutable = __webpack_require__("./node_modules/redux-form/lib/immutable.js");

var _lib = __webpack_require__("./node_modules/redux-form/lib/index.js");

var _getIn = __webpack_require__("./node_modules/redux-form/lib/structure/plain/getIn.js");

var _getIn2 = _interopRequireDefault(_getIn);

var _Focusedzone = __webpack_require__("./client/src/components/Focusedzone/Focusedzone.js");

var _Focusedzone2 = _interopRequireDefault(_Focusedzone);

var _getFormState = __webpack_require__(17);

var _getFormState2 = _interopRequireDefault(_getFormState);

var _SearchBox = __webpack_require__("./client/src/components/Search/SearchBox.js");

var _SearchBox2 = _interopRequireDefault(_SearchBox);

var _SearchForm = __webpack_require__("./client/src/components/Search/SearchForm.js");

var _SearchForm2 = _interopRequireDefault(_SearchForm);

var _SearchToggle = __webpack_require__("./client/src/components/Search/SearchToggle.js");

var _SearchToggle2 = _interopRequireDefault(_SearchToggle);

var _mapFormSchemaToTags = __webpack_require__("./client/src/components/Search/utilities/mapFormSchemaToTags.js");

var _mapFormSchemaToTags2 = _interopRequireDefault(_mapFormSchemaToTags);

var _propTypes = __webpack_require__(1);

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DISPLAY = {
  NONE: 'NONE',
  VISIBLE: 'VISIBLE',
  EXPANDED: 'EXPANDED'
};
var BEHAVIOR = {
  NONE: 'NONE',
  HIDEABLE: 'HIDEABLE',
  TOGGLABLE: 'TOGGLABLE'
};

function hasFilters(filters) {
  return filters && Object.keys(filters).length > 0;
}

var Search = function (_Component) {
  _inherits(Search, _Component);

  function Search(props) {
    _classCallCheck(this, Search);

    var _this = _possibleConstructorReturn(this, (Search.__proto__ || Object.getPrototypeOf(Search)).call(this, props));

    _this.expand = _this.expand.bind(_this);
    _this.handleChange = _this.handleChange.bind(_this);
    _this.getData = _this.getData.bind(_this);
    _this.doSearch = _this.doSearch.bind(_this);
    _this.focusInput = _this.focusInput.bind(_this);
    _this.focusFirstFormField = _this.focusFirstFormField.bind(_this);
    _this.hide = _this.hide.bind(_this);
    _this.show = _this.show.bind(_this);
    _this.toggle = _this.toggle.bind(_this);
    _this.open = _this.open.bind(_this);
    _this.searchTermIsDirty = _this.searchTermIsDirty.bind(_this);
    _this.clearFilters = _this.clearFilters.bind(_this);
    _this.clearSearchBox = _this.clearSearchBox.bind(_this);
    _this.clearFormFilter = _this.clearFormFilter.bind(_this);
    _this.focusFormFilter = _this.focusFormFilter.bind(_this);
    _this.formatTagData = _this.formatTagData.bind(_this);

    var term = props.term || props.filters && props.filters['' + props.filterPrefix + props.name] || '';

    _this.state = {
      display: props.display,
      searchText: term,
      initialSearchText: term
    };
    return _this;
  }

  _createClass(Search, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      this.setOverrides(this.props);
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(props) {
      if (props && !hasFilters(props.filters) && hasFilters(this.props.filters)) {
        this.clearFormData(props);
      } else if (JSON.stringify(props.filters) !== JSON.stringify(this.props.filters)) {
        this.setOverrides(props);
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.setOverrides();
    }
  }, {
    key: 'setOverrides',
    value: function setOverrides(props) {
      if (props && (!hasFilters(props.filters) || this.props.formSchemaUrl !== props.formSchemaUrl)) {
        var schemaUrl = props && props.formSchemaUrl || this.props.formSchemaUrl;
        if (schemaUrl) {
          this.props.actions.schema.setSchemaStateOverrides(schemaUrl, null);
        }
      }

      if (props && hasFilters(props.filters) && props.formSchemaUrl) {
        var filters = props.filters || {};
        var overrides = {
          fields: Object.keys(filters).map(function (name) {
            var value = filters[name];
            return { name: name, value: value };
          })
        };

        this.props.actions.schema.setSchemaStateOverrides(props.formSchemaUrl, overrides);
      }
    }
  }, {
    key: 'getData',
    value: function getData() {
      var ignoreSearchTerm = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      var _props = this.props,
          name = _props.name,
          filterPrefix = _props.filterPrefix,
          formData = _props.formData;
      var searchText = this.state.searchText;

      var data = {};

      Object.keys(formData).forEach(function (key) {
        var value = formData[key];
        if (value) {
          data[key] = value;
        }
      });

      if (!ignoreSearchTerm && searchText && typeof formData['' + filterPrefix + name] === 'undefined') {
        data['' + filterPrefix + name] = searchText.trim();
      }

      return data;
    }
  }, {
    key: 'handleChange',
    value: function handleChange(event) {
      var value = event.target.value;
      if (this.state.searchText !== value) {
        this.setState({ searchText: value });
      }

      var _props2 = this.props,
          schemaName = _props2.schemaName,
          name = _props2.name,
          filterPrefix = _props2.filterPrefix,
          actions = _props2.actions,
          formData = _props2.formData;

      if (typeof formData['' + filterPrefix + name] !== 'undefined') {
        actions.reduxForm.change(schemaName, '' + filterPrefix + name, value);
      }
    }
  }, {
    key: 'focusInput',
    value: function focusInput() {
      if (this.state.display === DISPLAY.NONE) {
        return;
      }

      var node = _reactDom2.default.findDOMNode(this);
      if (!node) {
        return;
      }

      var input = node.querySelector('.search-box__content-field');

      if (input !== document.activeElement) {
        input.focus();
        if (input.select) {
          input.select();
        }
      }
    }
  }, {
    key: 'focusFirstFormField',
    value: function focusFirstFormField() {
      var filter = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'input, textarea, select, button';

      if (this.state.display !== DISPLAY.EXPANDED) {
        return;
      }

      var node = _reactDom2.default.findDOMNode(this);
      if (!node) {
        return;
      }

      var form = node.querySelector('.search-form');
      if (!form) {
        return;
      }

      var input = form.querySelector(filter);
      if (input) {
        input.focus();
        if (input.select) {
          input.select();
        }
      }
    }
  }, {
    key: 'clearFormData',
    value: function clearFormData(props) {
      if (this.state.searchText !== '') {
        this.setState({ searchText: '' });
      }

      var formSchemaUrl = props && props.formSchemaUrl || this.props.formSchemaUrl;
      if (formSchemaUrl) {
        var identifier = props && props.identifier || this.props.identifier;
        this.props.actions.reduxForm.initialize(identifier, {}, Object.keys(this.props.formData));
        this.props.actions.reduxForm.reset(identifier);
      }
    }
  }, {
    key: 'clearFormFilter',
    value: function clearFormFilter(key) {
      var tag = this.props.tagData[key];
      var clearables = _defineProperty({}, key, undefined);
      if (Array.isArray(tag.linkedFields)) {
        tag.linkedFields.forEach(function (linkFieldkey) {
          clearables[linkFieldkey] = undefined;
        });
      }
      this.doSearch(clearables);
    }
  }, {
    key: 'focusFormFilter',
    value: function focusFormFilter(key) {
      var _this2 = this;

      var tag = this.props.tagData[key];
      var selector = tag.focusSelector || '[name=' + key + ']';
      this.expand();
      setTimeout(function () {
        return _this2.focusFirstFormField(selector);
      }, 50);
    }
  }, {
    key: 'open',
    value: function open() {
      this.show();
      this.focusInput();
    }
  }, {
    key: 'hide',
    value: function hide() {
      if (this.props.onHide) {
        this.props.onHide();
      } else if (this.state.display !== DISPLAY.NONE) {
        this.setState({ display: DISPLAY.NONE });
      }
    }
  }, {
    key: 'show',
    value: function show() {
      if (this.state.display !== DISPLAY.VISIBLE) {
        this.setState({ display: DISPLAY.VISIBLE });
      }

      var _props3 = this.props,
          schemaName = _props3.schemaName,
          formData = _props3.formData,
          name = _props3.name,
          actions = _props3.actions;

      if (typeof formData[name] !== 'undefined') {
        actions.reduxForm.change(schemaName, name, this.state.searchText);
      }
    }
  }, {
    key: 'expand',
    value: function expand() {
      if (this.state.display !== DISPLAY.EXPANDED) {
        this.setState({ display: DISPLAY.EXPANDED });
      }
    }
  }, {
    key: 'toggle',
    value: function toggle() {
      switch (this.state.display) {
        case DISPLAY.VISIBLE:
          this.expand();
          setTimeout(this.focusFirstFormField, 50);
          break;
        case DISPLAY.EXPANDED:
          this.show();
          break;
        default:
      }
    }
  }, {
    key: 'searchTermIsDirty',
    value: function searchTermIsDirty() {
      var _state = this.state,
          searchText = _state.searchText,
          initialSearchText = _state.initialSearchText;

      return searchText.trim() !== initialSearchText.trim();
    }
  }, {
    key: 'doSearch',
    value: function doSearch() {
      var overrides = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var _props4 = this.props,
          formSchemaUrl = _props4.formSchemaUrl,
          identifier = _props4.identifier,
          name = _props4.name,
          filterPrefix = _props4.filterPrefix;

      var searchData = {};
      var fieldData = this.getData();

      Object.entries(fieldData).forEach(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2),
            key = _ref2[0],
            value = _ref2[1];

        var newKey = key;
        var newValue = value;

        if (overrides.hasOwnProperty(key)) {
          newValue = overrides[key];
        }

        if (filterPrefix.length > 0 && key.startsWith(filterPrefix)) {
          newKey = key.substring(filterPrefix.length);
        }

        if (!filterPrefix.length > 0 || key !== name || typeof fieldData['' + filterPrefix + name] === 'undefined') {
          searchData[newKey] = newValue;
        }
      });

      var searchText = searchData[name] || '';

      var formData = Object.assign({}, this.getData(true), overrides);

      if (this.state.display !== DISPLAY.VISIBLE || this.state.initialSearchText !== searchText || this.state.searchText !== searchText) {
        this.setState({
          display: DISPLAY.VISIBLE,
          initialSearchText: searchText,
          searchText: searchText
        });
      }

      this.props.actions.schema.setSchemaStateOverrides(formSchemaUrl, { fields: [] });
      this.props.actions.reduxForm.initialize(identifier, formData);

      this.props.onSearch(searchData);
    }
  }, {
    key: 'clearFilters',
    value: function clearFilters() {
      this.clearFormData();
      this.focusFirstFormField();
    }
  }, {
    key: 'clearSearchBox',
    value: function clearSearchBox() {
      this.clearFormData();
      this.focusInput();
    }
  }, {
    key: 'formatTagData',
    value: function formatTagData() {
      var _props5 = this.props,
          tagData = _props5.tagData,
          name = _props5.name,
          filterPrefix = _props5.filterPrefix;

      var tagDataCopy = Object.assign({}, tagData);
      var nameKey = '' + filterPrefix + name;

      if (tagDataCopy && tagDataCopy[nameKey]) {
        delete tagDataCopy[nameKey];
      }

      return tagDataCopy ? Object.values(tagDataCopy).map(function (_ref3) {
        var key = _ref3.key,
            label = _ref3.label,
            value = _ref3.value;
        return { key: key, label: label, value: value };
      }) : [];
    }
  }, {
    key: 'render',
    value: function render() {
      var _props6 = this.props,
          formSchemaUrl = _props6.formSchemaUrl,
          forceFilters = _props6.forceFilters,
          id = _props6.id,
          displayBehavior = _props6.displayBehavior,
          identifier = _props6.identifier,
          formIsDirty = _props6.formIsDirty,
          tagData = _props6.tagData,
          name = _props6.name,
          props = _objectWithoutProperties(_props6, ['formSchemaUrl', 'forceFilters', 'id', 'displayBehavior', 'identifier', 'formIsDirty', 'tagData', 'name']);

      if (this.state.display === DISPLAY.NONE) {
        if (displayBehavior === BEHAVIOR.TOGGLABLE) {
          return _react2.default.createElement(_SearchToggle2.default, { onToggle: this.show });
        }
        return _react2.default.createElement('div', null);
      }

      var formId = id + '_ExtraFields';
      var searchText = this.state.searchText;

      var expanded = this.state.display === DISPLAY.EXPANDED;
      var visible = this.state.display === DISPLAY.VISIBLE;

      var hideable = [BEHAVIOR.HIDEABLE, BEHAVIOR.TOGGLABLE].includes(displayBehavior);

      var dirty = formIsDirty || this.searchTermIsDirty();
      var data = this.getData();
      var clearable = Object.keys(data).length > 0;

      return _react2.default.createElement(
        _Focusedzone2.default,
        { onClickOut: this.show, className: 'search' },
        _react2.default.createElement(
          _SearchBox2.default,
          _extends({}, props, {
            name: 'SearchBox__' + name,
            onChange: this.handleChange,
            onSearch: this.doSearch,
            onToggleFilter: this.toggle,
            onHideFilter: this.show,
            onHide: this.hide,
            onClear: this.clearSearchBox,
            searchText: searchText,
            hideable: hideable,
            expanded: expanded,
            id: id + '_searchbox',
            showFilters: Boolean(forceFilters || formSchemaUrl),
            dirty: dirty,
            clearable: clearable,
            onTagDelete: this.clearFormFilter,
            onTagClick: this.focusFormFilter,
            tagData: this.formatTagData()
          }),
          _react2.default.createElement(_SearchForm2.default, {
            id: formId,
            identifier: identifier,
            visible: visible,
            expanded: expanded,
            formSchemaUrl: formSchemaUrl,
            onSearch: this.doSearch,
            onClear: this.clearFilters,
            clearable: clearable
          })
        )
      );
    }
  }]);

  return Search;
}(_react.Component);

Search.propTypes = {
  onSearch: _propTypes2.default.func,
  onHide: _propTypes2.default.func,

  id: _propTypes2.default.string.isRequired,
  display: _propTypes2.default.oneOf(Object.values(DISPLAY)),
  formSchemaUrl: _propTypes2.default.string,
  filters: _propTypes2.default.object,
  formData: _propTypes2.default.object,
  placeholder: _propTypes2.default.string,
  displayBehavior: _propTypes2.default.oneOf(Object.values(BEHAVIOR)),
  term: _propTypes2.default.string,
  name: _propTypes2.default.string,
  filterPrefix: _propTypes2.default.string,
  forceFilters: _propTypes2.default.bool,
  formIsDirty: _propTypes2.default.bool,
  identifier: _propTypes2.default.string,
  schemaName: _propTypes2.default.string,
  tagHandlers: _propTypes2.default.object,
  borders: _propTypes2.default.shape({
    top: _propTypes2.default.bool,
    right: _propTypes2.default.bool,
    bottom: _propTypes2.default.bool,
    left: _propTypes2.default.bool
  })
};

Search.defaultProps = {
  placeholder: _i18n2.default._t('Admin.SEARCH', 'Search'),
  display: DISPLAY.VISIBLE,
  displayBehavior: BEHAVIOR.NONE,
  filters: {},
  formData: {},
  term: '',
  filterPrefix: '',
  forceFilters: false,
  name: 'searchTerm',
  identifier: 'Admin.SearchForm'
};

function mapStateToProps(state, ownProps) {
  var schema = state.form.formSchemas[ownProps.formSchemaUrl];
  if (!schema || !schema.name) {
    return { formData: {} };
  }

  var schemaName = schema.name;

  var form = (0, _getIn2.default)((0, _getFormState2.default)(state), schemaName);

  var formData = form && form.values || {};
  var tagData = (0, _mapFormSchemaToTags2.default)(schema, ownProps.filters, ownProps.tagHandlers || {});
  var formIsDirty = (0, _immutable.isDirty)(schemaName, _getFormState2.default)(state);

  return { formData: formData, formIsDirty: formIsDirty, schemaName: schemaName, tagData: tagData };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      schema: (0, _redux.bindActionCreators)(schemaActions, dispatch),
      reduxForm: (0, _redux.bindActionCreators)({ reset: _reduxForm.reset, initialize: _reduxForm.initialize, change: _lib.change }, dispatch)
    }
  };
}

exports.Component = Search;
exports.hasFilters = hasFilters;
exports.default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(Search);

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?{\"presets\":[[\"env\",{\"modules\":false}],\"react\"],\"plugins\":[\"transform-object-rest-spread\"],\"comments\":false,\"cacheDirectory\":true}!./client/src/components/Search/SearchToggle.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Component = undefined;

var _i18n = __webpack_require__(3);

var _i18n2 = _interopRequireDefault(_i18n);

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _reactstrap = __webpack_require__(6);

var _classnames = __webpack_require__(4);

var _classnames2 = _interopRequireDefault(_classnames);

var _propTypes = __webpack_require__(1);

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var label = _i18n2.default._t('Admin.SHOW_SEARCH', 'Show search');

var toggleBtnClasses = function toggleBtnClasses(toggled) {
  return (0, _classnames2.default)('btn--no-text', 'search-toggle', 'font-icon-search', 'btn--icon-lg', { 'search-toggle__active': toggled });
};

var SearchToggle = function SearchToggle(_ref) {
  var onToggle = _ref.onToggle,
      toggled = _ref.toggled;
  return _react2.default.createElement(
    _reactstrap.Button,
    {
      title: label,
      onClick: onToggle,
      className: toggleBtnClasses(toggled)
    },
    _react2.default.createElement(
      'span',
      { className: 'sr-only' },
      label
    )
  );
};

SearchToggle.propTypes = {
  onToggle: _propTypes2.default.func,
  toggled: _propTypes2.default.bool
};

exports.Component = SearchToggle;
exports.default = SearchToggle;

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?{\"presets\":[[\"env\",{\"modules\":false}],\"react\"],\"plugins\":[\"transform-object-rest-spread\"],\"comments\":false,\"cacheDirectory\":true}!./client/src/components/Tag/CompactTagList.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _TagList = __webpack_require__(32);

var _TagList2 = _interopRequireDefault(_TagList);

var _SummaryTag = __webpack_require__("./client/src/components/Tag/SummaryTag.js");

var _SummaryTag2 = _interopRequireDefault(_SummaryTag);

var _ResizeAware = __webpack_require__(23);

var _ResizeAware2 = _interopRequireDefault(_ResizeAware);

var _classnames = __webpack_require__(4);

var _classnames2 = _interopRequireDefault(_classnames);

var _reactDom = __webpack_require__(10);

var _reactDom2 = _interopRequireDefault(_reactDom);

var _propTypes = __webpack_require__(1);

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CompactTagList = function (_Component) {
  _inherits(CompactTagList, _Component);

  function CompactTagList(props) {
    _classCallCheck(this, CompactTagList);

    var _this = _possibleConstructorReturn(this, (CompactTagList.__proto__ || Object.getPrototypeOf(CompactTagList)).call(this, props));

    _this.render = _this.render.bind(_this);
    _this.onResize = _this.onResize.bind(_this);
    _this.refreshShowSummaryView = _this.refreshShowSummaryView.bind(_this);
    _this.getPlaceholderSize = _this.getPlaceholderSize.bind(_this);

    _this.state = {
      showSummaryView: false
    };
    return _this;
  }

  _createClass(CompactTagList, [{
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      var placeholderWidth = this.getPlaceholderSize();
      this.refreshShowSummaryView(placeholderWidth);
    }
  }, {
    key: 'onResize',
    value: function onResize(tagListDimension) {
      this.refreshShowSummaryView(tagListDimension.width);
    }
  }, {
    key: 'getPlaceholderSize',
    value: function getPlaceholderSize() {
      var node = _reactDom2.default.findDOMNode(this);
      if (!node) {
        return 0;
      }

      var placeholder = node.querySelector('.compact-tag-list__placeholder');

      if (placeholder) {
        return placeholder.getBoundingClientRect().width;
      }

      return 0;
    }
  }, {
    key: 'refreshShowSummaryView',
    value: function refreshShowSummaryView(placeholderWidth) {
      var maxWidth = this.props.maxSize;
      var showSummaryView = maxWidth < placeholderWidth;

      if (this.state.showSummaryView !== showSummaryView) {
        this.setState(function () {
          return { showSummaryView: showSummaryView };
        });
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          maxSize = _props.maxSize,
          onSummary = _props.onSummary,
          listProps = _objectWithoutProperties(_props, ['maxSize', 'onSummary']);

      var showSummaryView = this.state.showSummaryView;
      var count = this.props.tags.length;
      var classes = (0, _classnames2.default)('compact-tag-list', { 'compact-tag-list__show-summary-view': showSummaryView });

      return _react2.default.createElement(
        'div',
        { className: classes },
        _react2.default.createElement(
          _ResizeAware2.default,
          { onResize: this.onResize, className: 'compact-tag-list__placeholder', 'aria-hidden': true },
          _react2.default.createElement(_TagList2.default, _extends({}, listProps, { focusable: false }))
        ),
        _react2.default.createElement(
          'div',
          { className: 'compact-tag-list__visible' },
          showSummaryView ? _react2.default.createElement(_SummaryTag2.default, { count: count, onClick: onSummary, onNext: listProps.onHolderFocus }) : _react2.default.createElement(_TagList2.default, listProps)
        )
      );
    }
  }]);

  return CompactTagList;
}(_react.Component);

CompactTagList.propTypes = Object.assign({}, _TagList2.default.propTypes, {
  maxSize: _propTypes2.default.number,
  onSummary: _propTypes2.default.func
});

CompactTagList.defaultProps = {
  maxSize: 0,
  onSummary: function onSummary() {}
};

exports.default = CompactTagList;

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?{\"presets\":[[\"env\",{\"modules\":false}],\"react\"],\"plugins\":[\"transform-object-rest-spread\"],\"comments\":false,\"cacheDirectory\":true}!./client/src/components/Tag/Tag.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _reactstrap = __webpack_require__(6);

var _classnames = __webpack_require__(4);

var _classnames2 = _interopRequireDefault(_classnames);

var _i18n = __webpack_require__(3);

var _i18n2 = _interopRequireDefault(_i18n);

var _propTypes = __webpack_require__(1);

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var _onKeyDown = function _onKeyDown(e, key, onDeleteKey, onBackSpace, onPrevious, onNext) {
  switch (e.key) {
    case 'Backspace':
      e.preventDefault();
      onBackSpace(key);
      break;
    case 'Delete':
      e.preventDefault();
      onDeleteKey(key);
      break;
    case 'ArrowLeft':
      e.preventDefault();
      onPrevious(key);
      break;
    case 'ArrowRight':
      e.preventDefault();
      onNext(key);
      break;
    default:
      break;
  }
};

var makeLabel = function makeLabel(key, label, value) {
  return (label || key) + (value ? ': ' + value : '');
};

var Tag = function Tag(_ref) {
  var _onClick = _ref.onClick,
      onDelete = _ref.onDelete,
      onDeleteKey = _ref.onDeleteKey,
      onBackSpace = _ref.onBackSpace,
      onPrevious = _ref.onPrevious,
      onNext = _ref.onNext,
      deletable = _ref.deletable,
      dataKey = _ref.dataKey,
      label = _ref.label,
      value = _ref.value,
      children = _ref.children,
      focusable = _ref.focusable,
      props = _objectWithoutProperties(_ref, ['onClick', 'onDelete', 'onDeleteKey', 'onBackSpace', 'onPrevious', 'onNext', 'deletable', 'dataKey', 'label', 'value', 'children', 'focusable']);

  var title = makeLabel(dataKey, label, value);
  return _react2.default.createElement(
    _reactstrap.Button,
    _extends({}, props, {
      role: 'button',
      className: (0, _classnames2.default)('tag-component', 'btn-sm', { 'tag-component--deletable': deletable }),
      onClick: function onClick(e) {
        e.preventDefault();_onClick(dataKey);
      },
      tabIndex: focusable ? 0 : undefined,
      onKeyDown: function onKeyDown(e) {
        _onKeyDown(e, dataKey, onDeleteKey, onBackSpace, onPrevious, onNext);
      },
      title: title
    }),
    deletable && _react2.default.createElement(DeleteButton, { onDelete: onDelete, dataKey: dataKey }),
    children || title
  );
};

var focusOnParent = function focusOnParent(e) {
  e.target.parentElement.focus();
};

var DeleteButton = function DeleteButton(_ref2) {
  var dataKey = _ref2.dataKey,
      onDelete = _ref2.onDelete;
  return _react2.default.createElement(_reactstrap.Button, {
    onClick: function onClick(e) {
      e.stopPropagation();e.preventDefault();onDelete(dataKey);
    },
    'aria-label': _i18n2.default._t('Admin.REMOVE_TAG', 'Remove Tag'),
    title: _i18n2.default._t('Admin.REMOVE_TAG', 'Remove Tag'),
    onFocus: focusOnParent,
    tabIndex: -1,
    className: 'tag-component__delete font-icon-cancel btn--no-text btn--icon-sm'
  });
};

Tag.propTypes = {
  onClick: _propTypes2.default.func,
  onDelete: _propTypes2.default.func,
  onDeleteKey: _propTypes2.default.func,
  onBackSpace: _propTypes2.default.func,
  onPrevious: _propTypes2.default.func,
  onNext: _propTypes2.default.func,
  deletable: _propTypes2.default.bool,
  dataKey: _propTypes2.default.string,
  label: _propTypes2.default.string,
  value: _propTypes2.default.string,
  focusable: _propTypes2.default.bool
};

Tag.defaultProps = {
  tag: 'span',
  deletable: false,
  onClick: function onClick() {},
  onDelete: function onDelete() {},
  onDeleteKey: function onDeleteKey() {},
  onBackSpace: function onBackSpace() {},
  onPrevious: function onPrevious() {},
  onNext: function onNext() {},
  focusable: true
};

exports.default = Tag;

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?{\"presets\":[[\"env\",{\"modules\":false}],\"react\"],\"plugins\":[\"transform-object-rest-spread\"],\"comments\":false,\"cacheDirectory\":true}!./client/src/components/Tag/TagList.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Component = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _Tag = __webpack_require__(24);

var _Tag2 = _interopRequireDefault(_Tag);

var _TagPropType = __webpack_require__("./client/src/components/Tag/TagPropType.js");

var _TagPropType2 = _interopRequireDefault(_TagPropType);

var _propTypes = __webpack_require__(1);

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var FORWARD = true;

var BACKWARD = false;

var moveFocus = function moveFocus(direction) {
  var sibling = document.activeElement[direction ? 'nextElementSibling' : 'previousElementSibling'];

  if (sibling) {
    sibling.focus();
    return true;
  }

  return false;
};

var TagList = function TagList(_ref) {
  var tags = _ref.tags,
      deletable = _ref.deletable,
      focusable = _ref.focusable,
      onTagDelete = _ref.onTagDelete,
      onTagClick = _ref.onTagClick,
      onHolderFocus = _ref.onHolderFocus;

  var onDeleteKey = function onDeleteKey(key) {
    moveFocus(FORWARD) || onHolderFocus();
    onTagDelete(key);
  };

  var onBackSpace = function onBackSpace(key) {
    moveFocus(BACKWARD) || moveFocus(FORWARD) || onHolderFocus();
    onTagDelete(key);
  };

  return _react2.default.createElement(
    'ul',
    { className: 'tag-list' },
    tags.map(function (props) {
      return _react2.default.createElement(_Tag2.default, _extends({}, props, {
        tag: 'li',
        deletable: deletable,
        dataKey: props.key,
        focusable: focusable,
        onDelete: onTagDelete,
        onDeleteKey: deletable && onTagDelete ? onDeleteKey : undefined,
        onBackSpace: deletable && onTagDelete ? onBackSpace : undefined,

        onNext: function onNext() {
          moveFocus(FORWARD) || onHolderFocus();
        },
        onPrevious: function onPrevious() {
          moveFocus(BACKWARD);
        },
        onClick: onTagClick
      }));
    })
  );
};

TagList.propTypes = {
  onTagClick: _propTypes2.default.func,
  onTagDelete: _propTypes2.default.func,
  onHolderFocus: _propTypes2.default.func,
  deletable: _propTypes2.default.bool,
  tags: _propTypes2.default.arrayOf(_TagPropType2.default),
  focusable: _propTypes2.default.bool
};

TagList.defaultProps = {
  deletable: false,
  focusable: true,
  onTagDelete: function onTagDelete() {},
  onTagClick: function onTagClick() {},
  onHolderFocus: function onHolderFocus() {}
};

exports.Component = TagList;
exports.default = TagList;

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?{\"presets\":[[\"env\",{\"modules\":false}],\"react\"],\"plugins\":[\"transform-object-rest-spread\"],\"comments\":false,\"cacheDirectory\":true}!./client/src/components/TextField/TextField.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Component = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _FieldHolder = __webpack_require__(8);

var _FieldHolder2 = _interopRequireDefault(_FieldHolder);

var _InputField2 = __webpack_require__("./client/src/components/InputField/InputField.js");

var _InputField3 = _interopRequireDefault(_InputField2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TextField = function (_InputField) {
  _inherits(TextField, _InputField);

  function TextField() {
    _classCallCheck(this, TextField);

    return _possibleConstructorReturn(this, (TextField.__proto__ || Object.getPrototypeOf(TextField)).apply(this, arguments));
  }

  _createClass(TextField, [{
    key: 'getInputProps',
    value: function getInputProps() {
      var props = _get(TextField.prototype.__proto__ || Object.getPrototypeOf(TextField.prototype), 'getInputProps', this).call(this);

      if (this.isMultiline()) {
        Object.assign(props, {
          type: 'textarea',
          rows: this.props.data.rows,
          cols: this.props.data.columns
        });
      }

      return props;
    }
  }, {
    key: 'isMultiline',
    value: function isMultiline() {
      return this.props.data && this.props.data.rows > 1;
    }
  }]);

  return TextField;
}(_InputField3.default);

exports.Component = TextField;
exports.default = (0, _FieldHolder2.default)(TextField);

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?{\"presets\":[[\"env\",{\"modules\":false}],\"react\"],\"plugins\":[\"transform-object-rest-spread\"],\"comments\":false,\"cacheDirectory\":true}!./client/src/components/Toolbar/Toolbar.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(1);

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Toolbar = function (_Component) {
  _inherits(Toolbar, _Component);

  function Toolbar(props) {
    _classCallCheck(this, Toolbar);

    var _this = _possibleConstructorReturn(this, (Toolbar.__proto__ || Object.getPrototypeOf(Toolbar)).call(this, props));

    _this.handleBackButtonClick = _this.handleBackButtonClick.bind(_this);
    return _this;
  }

  _createClass(Toolbar, [{
    key: 'handleBackButtonClick',
    value: function handleBackButtonClick(event) {
      if (typeof this.props.onBackButtonClick !== 'undefined') {
        this.props.onBackButtonClick(event);
        return;
      }

      event.preventDefault();
    }
  }, {
    key: 'render',
    value: function render() {
      var buttonClassNames = ['btn', 'btn-secondary', 'action', 'font-icon-left-open-big', 'toolbar__back-button', 'btn--no-text'];
      var backButtonProps = {
        className: buttonClassNames.join(' '),
        onClick: this.handleBackButtonClick,
        href: '#',
        type: 'button'
      };

      return _react2.default.createElement(
        'div',
        { className: 'toolbar toolbar--north' },
        _react2.default.createElement(
          'div',
          { className: 'toolbar__navigation fill-width' },
          this.props.showBackButton && _react2.default.createElement('button', backButtonProps),
          this.props.children
        )
      );
    }
  }]);

  return Toolbar;
}(_react.Component);

Toolbar.propTypes = {
  onBackButtonClick: _propTypes2.default.func,
  showBackButton: _propTypes2.default.bool,
  breadcrumbs: _propTypes2.default.array
};

Toolbar.defaultProps = {
  showBackButton: false
};

exports.default = Toolbar;

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?{\"presets\":[[\"env\",{\"modules\":false}],\"react\"],\"plugins\":[\"transform-object-rest-spread\"],\"comments\":false,\"cacheDirectory\":true}!./client/src/components/TreeDropdownField/TreeDropdownField.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findTreeByPath = exports.findTreeByID = exports.findTreePath = exports.SINGLE_EMPTY_VALUE = exports.MULTI_EMPTY_VALUE = exports.ConnectedTreeDropdownField = exports.Component = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(1);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactRedux = __webpack_require__(5);

var _redux = __webpack_require__(7);

var _FieldHolder = __webpack_require__(8);

var _FieldHolder2 = _interopRequireDefault(_FieldHolder);

var _isomorphicFetch = __webpack_require__(15);

var _isomorphicFetch2 = _interopRequireDefault(_isomorphicFetch);

var _reactSelect = __webpack_require__(49);

var _reactSelect2 = _interopRequireDefault(_reactSelect);

var _TreeDropdownFieldActions = __webpack_require__("./client/src/state/treeDropdownField/TreeDropdownFieldActions.js");

var treeDropdownFieldActions = _interopRequireWildcard(_TreeDropdownFieldActions);

var _TreeDropdownFieldMenu = __webpack_require__("./client/src/components/TreeDropdownField/TreeDropdownFieldMenu.js");

var _TreeDropdownFieldMenu2 = _interopRequireDefault(_TreeDropdownFieldMenu);

var _TreeDropdownFieldNode = __webpack_require__("./client/src/components/TreeDropdownField/TreeDropdownFieldNode.js");

var _TreeDropdownFieldNode2 = _interopRequireDefault(_TreeDropdownFieldNode);

var _url = __webpack_require__("./node_modules/url/url.js");

var _url2 = _interopRequireDefault(_url);

var _reactstrap = __webpack_require__(6);

var _castStringToElement = __webpack_require__("./client/src/lib/castStringToElement.js");

var _treeUtils = __webpack_require__("./client/src/components/TreeDropdownField/treeUtils.js");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SEARCH_DELAY = 500;
var MULTI_EMPTY_VALUE = 'unchanged';

var SINGLE_EMPTY_VALUE = 0;

var TreeDropdownField = function (_Component) {
  _inherits(TreeDropdownField, _Component);

  function TreeDropdownField(props) {
    _classCallCheck(this, TreeDropdownField);

    var _this = _possibleConstructorReturn(this, (TreeDropdownField.__proto__ || Object.getPrototypeOf(TreeDropdownField)).call(this, props));

    _this.render = _this.render.bind(_this);
    _this.renderMenu = _this.renderMenu.bind(_this);
    _this.renderOption = _this.renderOption.bind(_this);

    _this.getBreadcrumbs = _this.getBreadcrumbs.bind(_this);
    _this.getDropdownOptions = _this.getDropdownOptions.bind(_this);
    _this.getVisibleTree = _this.getVisibleTree.bind(_this);

    _this.handleBack = _this.handleBack.bind(_this);
    _this.handleChange = _this.handleChange.bind(_this);
    _this.handleKeyDown = _this.handleKeyDown.bind(_this);
    _this.handleNavigate = _this.handleNavigate.bind(_this);
    _this.handleSearchChange = _this.handleSearchChange.bind(_this);
    _this.handleSearchReset = _this.handleSearchReset.bind(_this);
    _this.handleOpen = _this.handleOpen.bind(_this);
    _this.handleClose = _this.handleClose.bind(_this);

    _this.callFetch = _this.callFetch.bind(_this);
    _this.lazyLoad = _this.lazyLoad.bind(_this);
    _this.filterOptions = _this.filterOptions.bind(_this);

    _this.state = {
      opened: false
    };

    _this.searchTimer = null;
    return _this;
  }

  _createClass(TreeDropdownField, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      if (!this.props.readOnly && !this.props.disabled) {
        this.initialise();
      }

      var id = this.props.id;
      var values = this.props.data.multiple ? this.props.data.valueObjects || [] : [this.props.data.valueObject];
      var selected = values.filter(function (item) {
        return item;
      });

      if (selected.length) {
        this.props.actions.treeDropdownField.addSelectedValues(id, selected);
      }
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (this.props.readOnly || this.props.disabled) {
        return;
      }

      var reload = false;
      var visible = [];

      if (this.props.search !== nextProps.search) {
        reload = true;
        visible = nextProps.visible;
      }

      if (nextProps.data.urlTree !== this.props.data.urlTree) {
        reload = true;
      }

      if (nextProps.data.cacheKey !== this.props.data.cacheKey) {
        reload = true;
      }

      if (reload) {
        this.loadTree(visible, nextProps.search, nextProps);
      }
    }
  }, {
    key: 'getVisibleTree',
    value: function getVisibleTree() {
      return this.props.findTreeByPath(this.props.tree, this.props.visible);
    }
  }, {
    key: 'getBreadcrumbs',
    value: function getBreadcrumbs() {
      var path = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.props.visible;

      var breadcrumbs = [];

      if (!path) {
        return breadcrumbs;
      }

      var node = this.props.tree;

      var _loop = function _loop(next) {
        if (!node.children) {
          return 'break';
        }
        node = node.children.find(function (child) {
          return child.id === next;
        });
        if (!node) {
          return 'break';
        }
        breadcrumbs.push(node);
      };

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = path[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var next = _step.value;

          var _ret = _loop(next);

          if (_ret === 'break') break;
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return breadcrumbs;
    }
  }, {
    key: 'getDropdownOptions',
    value: function getDropdownOptions() {
      var value = this.props.value;
      var node = this.getVisibleTree();
      var options = node ? [].concat(_toConsumableArray(node.children)) : [];

      var selectedOptions = this.props.selectedValues.filter(function (selected) {
        return selected.id === value || Array.isArray(value) && value.find(function (item) {
          return item === selected.id;
        });
      });

      if (!this.state.opened && this.props.data.showSelectedPath) {
        options = selectedOptions.map(function (selected) {
          return _extends({}, selected, {
            title: selected.titlePath || selected.title
          });
        });
      } else if (selectedOptions.length) {
        options = [].concat(_toConsumableArray(selectedOptions.filter(function (selected) {
          return !options.find(function (item) {
            return item.id === selected.id;
          });
        })), _toConsumableArray(options));
      }

      options.unshift({
        id: this.props.data.multiple ? '' : SINGLE_EMPTY_VALUE,
        title: this.props.data.hasEmptyDefault ? this.props.data.emptyString : null,
        disabled: !options.length || !this.props.data.hasEmptyDefault
      });

      return options;
    }
  }, {
    key: 'getPath',
    value: function getPath(id) {
      var treePath = this.props.findTreePath(this.props.tree, id);
      var breadcrumbs = this.getBreadcrumbs(treePath);

      return breadcrumbs.reduce(function (prev, path) {
        return '' + prev + (path.contextString || '') + path.title + '/';
      }, '');
    }
  }, {
    key: 'initialise',
    value: function initialise() {
      var _this2 = this;

      return this.loadTree([], this.props.search).then(function (treeData) {
        var newPath = [];
        if (!_this2.props.data.multiple && _this2.props.value) {
          newPath = _this2.props.findTreePath(treeData, _this2.props.value);
          if (newPath) {
            newPath.pop();
          } else {
            newPath = [];
          }
        }
        _this2.props.actions.treeDropdownField.setVisible(_this2.props.id, newPath);
      });
    }
  }, {
    key: 'callFetch',
    value: function callFetch(path) {
      var search = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
      var props = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this.props;

      var fetchURL = _url2.default.parse(props.data.urlTree, true);
      if (props.data.showSearch && search.length) {
        fetchURL.query.search = search;
        fetchURL.query.flatList = '1';
      }

      if (path.length) {
        fetchURL.query.ID = path[path.length - 1];
      } else if (!props.data.multiple && props.value) {
        fetchURL.query.forceValue = props.value;
      }
      fetchURL.query.format = 'json';
      fetchURL.search = null;
      var fetchURLString = _url2.default.format(fetchURL);
      return (0, _isomorphicFetch2.default)(fetchURLString, {
        credentials: 'same-origin'
      }).then(function (response) {
        return response.json();
      });
    }
  }, {
    key: 'lazyLoad',
    value: function lazyLoad(path) {
      var _this3 = this;

      var foundPrev = path.find(function (pathNode) {
        return _this3.props.loading.indexOf(pathNode) > -1 || _this3.props.failed.indexOf(pathNode) > -1;
      });
      if (foundPrev) {
        return Promise.resolve({});
      }

      var foundTree = this.props.findTreeByPath(this.props.tree, path);

      if (foundTree && (foundTree.count === 0 || foundTree.children.length)) {
        return Promise.resolve({});
      }

      return this.loadTree(path);
    }
  }, {
    key: 'loadTree',
    value: function loadTree(path) {
      var search = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
      var props = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this.props;

      props.actions.treeDropdownField.beginTreeUpdating(props.id, path);

      return this.callFetch(path, search, props).then(function (treeData) {
        props.actions.treeDropdownField.updateTree(props.id, path, treeData);

        return treeData;
      }).catch(function (error) {
        props.actions.treeDropdownField.updateTreeFailed(props.id, path);
        if (typeof props.onLoadingError === 'function') {
          return props.onLoadingError({
            errors: [{
              value: error.message,
              type: 'error'
            }]
          });
        }
        throw error;
      });
    }
  }, {
    key: 'hasSearch',
    value: function hasSearch() {
      return this.props.data.showSearch && Boolean(this.props.search);
    }
  }, {
    key: 'filterOptions',
    value: function filterOptions(options) {
      var _this4 = this;

      var parent = this.getVisibleTree();

      return options.filter(function (option) {
        if ((option.id === SINGLE_EMPTY_VALUE || option.id === '') && (!_this4.props.data.hasEmptyDefault || _this4.props.visible.length || _this4.hasSearch())) {
          return false;
        }
        var title = option.title && option.title.toLocaleLowerCase();

        var search = _this4.props.search.toLocaleLowerCase();

        return search ? title && title.includes(search) : !parent || !option.id || parent.children.find(function (child) {
          return child.id === option.id;
        });
      });
    }
  }, {
    key: 'handleOpen',
    value: function handleOpen() {
      this.setState({ opened: true });

      this.handleSearchReset();
    }
  }, {
    key: 'handleClose',
    value: function handleClose() {
      this.setState({ opened: false });
    }
  }, {
    key: 'handleSearchReset',
    value: function handleSearchReset() {
      clearTimeout(this.searchTimer);
      this.props.actions.treeDropdownField.setSearch(this.props.id, '');
    }
  }, {
    key: 'handleSearchChange',
    value: function handleSearchChange(value) {
      var _this5 = this;

      clearTimeout(this.searchTimer);

      this.searchTimer = setTimeout(function () {
        _this5.props.actions.treeDropdownField.setSearch(_this5.props.id, value);
      }, SEARCH_DELAY);
    }
  }, {
    key: 'handleChange',
    value: function handleChange(value) {
      var mappedValue = null;

      this.handleSearchReset();
      if (this.props.data.multiple) {
        mappedValue = MULTI_EMPTY_VALUE;

        if (value && value.length) {
          var uniqueValues = value && value.filter(function (item, index) {
            return value.findIndex(function (next) {
              return next.id === item.id;
            }) === index;
          });
          mappedValue = uniqueValues.map(function (item) {
            return item.id;
          });

          this.props.actions.treeDropdownField.addSelectedValues(this.props.id, uniqueValues);
        }
      } else {
        var id = value ? value.id : null;
        var tree = this.getVisibleTree() || this.props.tree;
        var object = tree.children.find(function (item) {
          return item.id === id;
        });
        if (object) {
          if (this.props.data.showSelectedPath) {
            object = _extends({}, object, {
              titlePath: this.getPath(id)
            });
          }
          this.props.actions.treeDropdownField.addSelectedValues(this.props.id, [object]);
        }

        mappedValue = id || SINGLE_EMPTY_VALUE;
      }

      if (typeof this.props.onChange === 'function') {
        this.props.onChange(mappedValue);
      }
    }
  }, {
    key: 'handleNavigate',
    value: function handleNavigate(event, id) {
      event.stopPropagation();
      event.nativeEvent.stopImmediatePropagation();
      event.preventDefault();

      if (this.hasSearch()) {
        return;
      }

      var path = this.props.findTreePath(this.props.tree, id);
      if (!path) {
        path = this.props.visible.slice(0);
        path.push(id);
      }

      this.lazyLoad(path);
      this.props.actions.treeDropdownField.setVisible(this.props.id, path);
    }
  }, {
    key: 'handleKeyDown',
    value: function handleKeyDown(event) {
      if (this.hasSearch()) {
        if (event.keyCode === 27) {
          this.handleSearchReset(event);
        }
        return;
      }

      var focused = this.selectField.getFocusedOption();
      if (!focused) {
        return;
      }

      switch (event.keyCode) {
        case 37:
          this.handleBack(event);
          break;
        case 39:
          if (focused.count) {
            this.handleNavigate(event, focused.id);
          }
          break;
        default:
          break;
      }
    }
  }, {
    key: 'handleBack',
    value: function handleBack(event) {
      event.stopPropagation();
      event.preventDefault();

      if (this.hasSearch()) {
        return;
      }

      var path = this.props.visible;

      if (path.length) {
        path = path.slice(0, path.length - 1);
      }

      this.lazyLoad(path);
      this.props.actions.treeDropdownField.setVisible(this.props.id, path);
    }
  }, {
    key: 'renderMenu',
    value: function renderMenu(renderMenuOptions) {
      var visibleTree = this.getVisibleTree() || {};
      var loading = this.props.loading.indexOf(visibleTree.id || 0) > -1;
      var failed = this.props.failed.indexOf(visibleTree.id || 0) > -1;
      var breadcrumbs = this.getBreadcrumbs();

      return _react2.default.createElement(_TreeDropdownFieldMenu2.default, {
        loading: loading,
        failed: failed,
        tree: visibleTree,
        breadcrumbs: breadcrumbs,
        renderMenuOptions: renderMenuOptions,
        onBack: this.handleBack,
        search: this.hasSearch(),
        value: this.props.value
      });
    }
  }, {
    key: 'renderOption',
    value: function renderOption(tree) {
      var _this6 = this;

      var button = null;
      if (tree.count && !this.hasSearch()) {
        var handleNavigate = function handleNavigate(event) {
          return _this6.handleNavigate(event, tree.id);
        };
        button = _react2.default.createElement(
          'button',
          {
            className: 'treedropdownfield__option-button fill-width',
            onClick: handleNavigate,
            onMouseDown: handleNavigate,
            onTouchStart: handleNavigate
          },
          _react2.default.createElement('span', { className: 'treedropdownfield__option-count-icon font-icon-right-open-big' })
        );
      }

      var Highlight = function Highlight(_ref) {
        var children = _ref.children;
        return _react2.default.createElement(
          'span',
          { className: 'treedropdownfield__option-title--highlighted' },
          children
        );
      };
      var title = this.props.search.length ? (0, _castStringToElement.mapHighlight)(tree.title, this.props.search, Highlight) : tree.title;

      var subtitle = null;
      if (this.hasSearch()) {
        subtitle = tree.contextString;

        if (!subtitle && this.props.data.hasEmptyDefault && !this.props.visible.length) {
          subtitle = this.props.data.emptyString;
        }
      }

      return _react2.default.createElement(
        'div',
        { className: 'treedropdownfield__option fill-width' },
        _react2.default.createElement(
          'div',
          { className: 'treedropdownfield__option-title-box flexbox-area-grow fill-height' },
          _react2.default.createElement(
            'span',
            { className: 'treedropdownfield__option-title' },
            title
          ),
          subtitle && _react2.default.createElement(
            'span',
            { className: 'treedropdownfield__option-context' },
            subtitle
          )
        ),
        button
      );
    }
  }, {
    key: 'renderReadOnly',
    value: function renderReadOnly() {
      var _this7 = this;

      var inputProps = {
        id: this.props.id,
        readOnly: this.props.readOnly,
        disabled: this.props.disabled
      };
      var className = this.props.extraClass ? 'treedropdownfield ' + this.props.extraClass : 'treedropdownfield';
      var title = this.props.data.hasEmptyDefault ? this.props.data.emptyString : '';
      var selected = this.props.selectedValues;

      if (this.props.data.multiple) {
        var values = this.props.value.map(function (value) {
          return selected.find(function (item) {
            return item.id === value;
          }) || value;
        });

        title = values.map(function (value) {
          return value.title;
        }).join(', ');
      } else {
        var value = selected.find(function (item) {
          return item.id === _this7.props.value;
        });
        title = this.props.value;

        if (value && typeof value.title === 'string') {
          title = value.title;
        }
      }

      return _react2.default.createElement(
        'div',
        { className: className },
        _react2.default.createElement(
          'span',
          { className: 'treedropdownfield__title' },
          title
        ),
        _react2.default.createElement(_reactstrap.Input, _extends({
          type: 'hidden',
          name: this.props.name,
          value: this.props.value
        }, inputProps))
      );
    }
  }, {
    key: 'render',
    value: function render() {
      var _this8 = this;

      if (this.props.readOnly || this.props.disabled) {
        return this.renderReadOnly();
      }

      var inputProps = {
        id: this.props.id
      };
      var className = this.props.extraClass ? 'treedropdownfield ' + this.props.extraClass : 'treedropdownfield';
      var options = this.getDropdownOptions();
      var value = this.props.value;

      if (this.props.data.multiple) {
        value = this.props.value ? this.props.selectedValues.filter(function (item) {
          return value.includes(item.id);
        }) : [];
      }

      var resetValue = this.props.data.hasEmptyDefault && !this.props.visible.length ? '' : null;
      var showSearch = typeof this.props.data.showSearch !== 'undefined' ? this.props.data.showSearch : false;

      return _react2.default.createElement(_reactSelect2.default, {
        searchable: showSearch,
        multi: this.props.data.multiple,
        className: className,
        name: this.props.name,
        options: options,
        inputProps: inputProps,
        menuRenderer: this.renderMenu,
        filterOptions: this.filterOptions,
        optionRenderer: this.renderOption,
        onChange: this.handleChange,
        onOpen: this.handleOpen,
        onClose: this.handleClose,
        onBlurResetsInput: true,
        onInputKeyDown: this.handleKeyDown,
        onInputChange: this.handleSearchChange,
        isLoading: Boolean(this.props.loading.length),
        value: value,
        resetValue: resetValue,
        joinValues: true,
        ref: function ref(select) {
          _this8.selectField = select;
        },
        placeholder: this.props.data.emptyString,
        labelKey: 'title',
        valueKey: 'id'
      });
    }
  }]);

  return TreeDropdownField;
}(_react.Component);

TreeDropdownField.propTypes = {
  extraClass: _propTypes2.default.string,
  id: _propTypes2.default.string,
  name: _propTypes2.default.string.isRequired,
  onChange: _propTypes2.default.func,
  value: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.number, _propTypes2.default.array]),
  readOnly: _propTypes2.default.bool,
  disabled: _propTypes2.default.bool,
  tree: _propTypes2.default.shape(_TreeDropdownFieldNode2.default.propTypes),
  findTreeByPath: _propTypes2.default.func,
  findTreePath: _propTypes2.default.func,
  visible: _propTypes2.default.array,
  loading: _propTypes2.default.array,
  failed: _propTypes2.default.array,
  selectedValues: _propTypes2.default.array,
  data: _propTypes2.default.shape({
    cacheKey: _propTypes2.default.string,
    urlTree: _propTypes2.default.string.isRequired,
    emptyString: _propTypes2.default.string,
    valueObject: _propTypes2.default.shape(_TreeDropdownFieldNode2.default.propTypes),
    valueObjects: _propTypes2.default.arrayOf(_propTypes2.default.shape(_TreeDropdownFieldNode2.default.propTypes)),
    hasEmptyDefault: _propTypes2.default.bool,
    showSearch: _propTypes2.default.bool,
    multiple: _propTypes2.default.bool,
    showSelectedPath: _propTypes2.default.bool
  }),
  onLoadingError: _propTypes2.default.func,
  search: _propTypes2.default.string,
  actions: _propTypes2.default.shape({
    treeDropdownField: _propTypes2.default.object
  })
};

TreeDropdownField.defaultProps = {
  value: '',
  extraClass: '',
  className: '',
  tree: {},
  visible: [],
  loading: [],
  failed: [],
  findTreeByPath: _treeUtils.findTreeByPath,
  findTreePath: _treeUtils.findTreePath
};

function mapStateToProps(state, ownProps) {
  var id = ownProps.id;
  var field = state.treeDropdownField.fields[id] ? state.treeDropdownField.fields[id] : {
    tree: {},
    visible: [],
    loading: [],
    failed: [],
    search: '',
    selectedValues: []
  };

  var value = ownProps.value;

  if (ownProps.data.multiple && ownProps.value === MULTI_EMPTY_VALUE) {
    value = [];
  }

  if (!ownProps.data.multiple && !ownProps.value) {
    value = SINGLE_EMPTY_VALUE;
  }

  return _extends({}, field, { value: value });
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      treeDropdownField: (0, _redux.bindActionCreators)(treeDropdownFieldActions, dispatch)
    }
  };
}

var ConnectedTreeDropdownField = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(TreeDropdownField);

exports.Component = TreeDropdownField;
exports.ConnectedTreeDropdownField = ConnectedTreeDropdownField;
exports.MULTI_EMPTY_VALUE = MULTI_EMPTY_VALUE;
exports.SINGLE_EMPTY_VALUE = SINGLE_EMPTY_VALUE;
exports.findTreePath = _treeUtils.findTreePath;
exports.findTreeByID = _treeUtils.findTreeByID;
exports.findTreeByPath = _treeUtils.findTreeByPath;
exports.default = (0, _FieldHolder2.default)(ConnectedTreeDropdownField);

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?{\"presets\":[[\"env\",{\"modules\":false}],\"react\"],\"plugins\":[\"transform-object-rest-spread\"],\"comments\":false,\"cacheDirectory\":true}!./client/src/components/TreeDropdownField/TreeDropdownFieldMenu.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(1);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _i18n = __webpack_require__(3);

var _i18n2 = _interopRequireDefault(_i18n);

var _classnames = __webpack_require__(4);

var _classnames2 = _interopRequireDefault(_classnames);

var _TreeDropdownFieldNode = __webpack_require__("./client/src/components/TreeDropdownField/TreeDropdownFieldNode.js");

var _TreeDropdownFieldNode2 = _interopRequireDefault(_TreeDropdownFieldNode);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TreeDropdownFieldMenu = function (_Component) {
  _inherits(TreeDropdownFieldMenu, _Component);

  function TreeDropdownFieldMenu(props) {
    _classCallCheck(this, TreeDropdownFieldMenu);

    var _this = _possibleConstructorReturn(this, (TreeDropdownFieldMenu.__proto__ || Object.getPrototypeOf(TreeDropdownFieldMenu)).call(this, props));

    _this.render = _this.render.bind(_this);
    _this.renderOption = _this.renderOption.bind(_this);
    _this.renderBreadcrumbs = _this.renderBreadcrumbs.bind(_this);
    _this.handleBack = _this.handleBack.bind(_this);
    return _this;
  }

  _createClass(TreeDropdownFieldMenu, [{
    key: 'handleBack',
    value: function handleBack(event) {
      if (typeof this.props.onBack === 'function') {
        this.props.onBack(event);
      } else {
        event.stopPropagation();
        event.preventDefault();
      }
    }
  }, {
    key: 'renderBreadcrumbs',
    value: function renderBreadcrumbs() {
      if (this.props.breadcrumbs.length === 0) {
        return null;
      }

      var breadcrumbs = this.props.breadcrumbs.map(function (item) {
        return item.title;
      }).join(' / ');
      var icon = this.props.search ? 'font-icon-search' : 'font-icon-left-open-big';
      var button = _react2.default.createElement(
        'button',
        { className: 'treedropdownfield__breadcrumbs-button' },
        _react2.default.createElement('span', { className: 'icon ' + icon })
      );

      return _react2.default.createElement(
        'div',
        {
          className: 'Select-option treedropdownfield__breadcrumbs flexbox-area-grow fill-width',
          onClick: this.handleBack,
          role: 'button',
          tabIndex: 0
        },
        button,
        _react2.default.createElement(
          'span',
          { className: 'treedropdownfield__breadcrumbs-crumbs flexbox-area-grow' },
          breadcrumbs
        )
      );
    }
  }, {
    key: 'renderOption',
    value: function renderOption(tree, index) {
      if (!this.props.renderMenuOptions) {
        return null;
      }
      var _props$renderMenuOpti = this.props.renderMenuOptions,
          focusedOption = _props$renderMenuOpti.focusedOption,
          instancePrefix = _props$renderMenuOpti.instancePrefix,
          onFocus = _props$renderMenuOpti.onFocus,
          onSelect = _props$renderMenuOpti.onSelect,
          optionClassName = _props$renderMenuOpti.optionClassName,
          optionComponent = _props$renderMenuOpti.optionComponent,
          optionRenderer = _props$renderMenuOpti.optionRenderer,
          onOptionRef = _props$renderMenuOpti.onOptionRef;

      var Option = optionComponent;
      var value = this.props.value;

      var isSelected = value === tree.id;
      if (Array.isArray(value)) {
        isSelected = value.includes(tree.id);
      }
      var isFocused = focusedOption && tree.id === focusedOption.id;
      var optionClass = (0, _classnames2.default)(optionClassName, {
        treedropdownfield__option: true,
        'Select-option': true,
        'is-selected': isSelected,
        'is-focused': isFocused,
        'is-disabled': tree.disabled
      });

      return _react2.default.createElement(
        Option,
        {
          className: optionClass,
          instancePrefix: instancePrefix,
          isDisabled: tree.disabled,
          isFocused: isFocused,
          isSelected: isSelected,
          key: 'option-' + tree.id + '-' + index,
          onFocus: onFocus,
          onSelect: onSelect,
          option: tree,
          optionIndex: index,
          ref: function ref(_ref) {
            onOptionRef(_ref, isFocused);
          }
        },
        optionRenderer(tree, index)
      );
    }
  }, {
    key: 'render',
    value: function render() {
      var classes = (0, _classnames2.default)([this.props.className, 'treedropdownfield__menu']);

      if (this.props.loading) {
        return _react2.default.createElement(
          'div',
          { className: classes },
          _react2.default.createElement(
            'div',
            { className: 'Select-option flexbox-area-grow fill-width' },
            _react2.default.createElement(
              'span',
              { className: 'Select-loading-zone', 'aria-hidden': 'true' },
              _react2.default.createElement('span', { className: 'Select-loading' })
            ),
            _react2.default.createElement(
              'span',
              { className: 'treedropdownfield__menu-loading flexbox-area-grow' },
              _i18n2.default._t('Admin.TREEDROPDOWN_LOADING', 'Loading...')
            )
          )
        );
      }
      if (this.props.failed) {
        return _react2.default.createElement(
          'div',
          { className: classes },
          _react2.default.createElement(
            'div',
            { className: 'Select-option' },
            _i18n2.default._t('Admin.TREEDROPDOWN_FAILED', 'Failed to load')
          )
        );
      }
      if (this.props.tree.count === 0) {
        return _react2.default.createElement(
          'div',
          { className: classes },
          _react2.default.createElement(
            'div',
            { className: 'Select-option' },
            _i18n2.default._t('Admin.TREEDROPDOWN_NO_CHILDREN', 'No children')
          )
        );
      }

      var breadcrumbs = this.renderBreadcrumbs();
      var options = this.props.renderMenuOptions && this.props.renderMenuOptions.options;

      var children = options ? options.filter(function (option) {
        return option.title !== null;
      }).map(this.renderOption) : null;

      return _react2.default.createElement(
        'div',
        { className: classes },
        breadcrumbs,
        children
      );
    }
  }]);

  return TreeDropdownFieldMenu;
}(_react.Component);

TreeDropdownFieldMenu.propTypes = {
  className: _propTypes2.default.string,
  breadcrumbs: _propTypes2.default.arrayOf(_propTypes2.default.shape(_TreeDropdownFieldNode2.default.propTypes)),
  loading: _propTypes2.default.bool,
  failed: _propTypes2.default.bool,
  tree: _propTypes2.default.shape(_TreeDropdownFieldNode2.default.propTypes),
  renderMenuOptions: _propTypes2.default.object,
  onBack: _propTypes2.default.func,
  search: _propTypes2.default.bool,
  value: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.number, _propTypes2.default.array])
};

exports.default = TreeDropdownFieldMenu;

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?{\"presets\":[[\"env\",{\"modules\":false}],\"react\"],\"plugins\":[\"transform-object-rest-spread\"],\"comments\":false,\"cacheDirectory\":true}!./client/src/components/TreeDropdownField/TreeDropdownFieldNode.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _propTypes = __webpack_require__(1);

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TreeDropdownFieldNode = function TreeDropdownFieldNode() {
  return null;
};

TreeDropdownFieldNode.propTypes = {
  id: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.number]),
  title: _propTypes2.default.string,
  titlePath: _propTypes2.default.string,
  disabled: _propTypes2.default.bool,
  parentid: _propTypes2.default.number,
  count: _propTypes2.default.number,
  depth: _propTypes2.default.number,
  expanded: _propTypes2.default.bool,
  limited: _propTypes2.default.bool,
  marked: _propTypes2.default.bool,
  opened: _propTypes2.default.bool,
  children: _propTypes2.default.array
};

exports.default = TreeDropdownFieldNode;

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?{\"presets\":[[\"env\",{\"modules\":false}],\"react\"],\"plugins\":[\"transform-object-rest-spread\"],\"comments\":false,\"cacheDirectory\":true}!./client/src/components/ViewModeToggle/ViewModeToggle.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Component = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(1);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactstrap = __webpack_require__(6);

var _i18n = __webpack_require__(3);

var _i18n2 = _interopRequireDefault(_i18n);

var _reactRedux = __webpack_require__(5);

var _redux = __webpack_require__(7);

var _ViewModeActions = __webpack_require__(55);

var _ViewModeStates = __webpack_require__("./client/src/state/viewMode/ViewModeStates.js");

var _classnames = __webpack_require__(4);

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ViewModeToggle = function (_Component) {
  _inherits(ViewModeToggle, _Component);

  function ViewModeToggle(props) {
    _classCallCheck(this, ViewModeToggle);

    var _this = _possibleConstructorReturn(this, (ViewModeToggle.__proto__ || Object.getPrototypeOf(ViewModeToggle)).call(this, props));

    _this.toggle = _this.toggle.bind(_this);
    _this.state = {
      dropdownOpen: false
    };

    _this.handleSplitSelect = _this.handleSplitSelect.bind(_this);
    _this.handlePreviewSelect = _this.handlePreviewSelect.bind(_this);
    _this.handleEditSelect = _this.handleEditSelect.bind(_this);
    return _this;
  }

  _createClass(ViewModeToggle, [{
    key: 'getIconClass',
    value: function getIconClass() {
      var _props = this.props,
          activeState = _props.activeState,
          editIconClass = _props.editIconClass,
          previewIconClass = _props.previewIconClass,
          splitIconClass = _props.splitIconClass;


      switch (activeState) {
        case _ViewModeStates.VIEW_MODE_STATES.EDIT:
          return editIconClass;
        case _ViewModeStates.VIEW_MODE_STATES.PREVIEW:
          return previewIconClass;
        default:
          return splitIconClass;
      }
    }
  }, {
    key: 'getTitle',
    value: function getTitle() {
      var activeState = this.props.activeState;


      switch (activeState) {
        case _ViewModeStates.VIEW_MODE_STATES.EDIT:
          return _i18n2.default._t('Admin.EDIT_MODE', 'Edit mode');
        case _ViewModeStates.VIEW_MODE_STATES.PREVIEW:
          return _i18n2.default._t('Admin.PREVIEW_MODE', 'Preview mode');
        default:
          return _i18n2.default._t('Admin.SPLIT_MODE', 'Split mode');
      }
    }
  }, {
    key: 'toggle',
    value: function toggle() {
      this.setState(function (prevState) {
        return {
          dropdownOpen: !prevState.dropdownOpen
        };
      });
    }
  }, {
    key: 'handleSplitSelect',
    value: function handleSplitSelect() {
      this.props.onSplitSelect();
    }
  }, {
    key: 'handlePreviewSelect',
    value: function handlePreviewSelect() {
      this.props.onPreviewSelect();
    }
  }, {
    key: 'handleEditSelect',
    value: function handleEditSelect() {
      this.props.onEditSelect();
    }
  }, {
    key: 'renderSplitDropdownItem',
    value: function renderSplitDropdownItem() {
      var _props2 = this.props,
          activeState = _props2.activeState,
          splitAvailable = _props2.splitAvailable,
          splitIconClass = _props2.splitIconClass;


      var itemClass = (0, _classnames2.default)('btn', 'icon-view', 'first', splitIconClass, {
        'viewmode-toggle__button': true,
        'viewmode-toggle--selected': activeState === _ViewModeStates.VIEW_MODE_STATES.SPLIT,
        disabled: !splitAvailable
      });

      return _react2.default.createElement(
        _reactstrap.DropdownItem,
        {
          type: 'button',
          disabled: !splitAvailable,
          className: itemClass,
          value: _ViewModeStates.VIEW_MODE_STATES.SPLIT,
          onClick: this.handleSplitSelect,
          id: 'splitModeButton'
        },
        _i18n2.default._t('Admin.SPLIT_MODE', 'Split mode')
      );
    }
  }, {
    key: 'renderEditDropDownItem',
    value: function renderEditDropDownItem() {
      var _props3 = this.props,
          activeState = _props3.activeState,
          editIconClass = _props3.editIconClass;

      var itemClass = (0, _classnames2.default)('btn', 'icon-view', 'last', 'viewmode-toggle__button', editIconClass, { 'viewmode-toggle--selected': activeState === _ViewModeStates.VIEW_MODE_STATES.EDIT });

      return _react2.default.createElement(
        _reactstrap.DropdownItem,
        {
          type: 'button',
          className: itemClass,
          value: 'content',
          onClick: this.handleEditSelect
        },
        _i18n2.default._t('Admin.EDIT_MODE', 'Edit mode')
      );
    }
  }, {
    key: 'renderPreviewDropDownItem',
    value: function renderPreviewDropDownItem() {
      var _props4 = this.props,
          activeState = _props4.activeState,
          previewIconClass = _props4.previewIconClass;

      var itemClass = (0, _classnames2.default)('btn', 'icon-view', 'viewmode-toggle__button', previewIconClass, { 'viewmode-toggle--selected': activeState === _ViewModeStates.VIEW_MODE_STATES.PREVIEW });

      return _react2.default.createElement(
        _reactstrap.DropdownItem,
        {
          type: 'button',
          className: itemClass,
          value: 'preview',
          onClick: this.handlePreviewSelect
        },
        _i18n2.default._t('Admin.PREVIEW_MODE', 'Preview mode')
      );
    }
  }, {
    key: 'render',
    value: function render() {
      var _props5 = this.props,
          activeState = _props5.activeState,
          area = _props5.area,
          splitAvailable = _props5.splitAvailable,
          dropdownToggleProps = _props5.dropdownToggleProps;

      if (area === _ViewModeStates.VIEW_MODE_STATES.EDIT && activeState === _ViewModeStates.VIEW_MODE_STATES.SPLIT) {
        return null;
      }

      var toggleClassName = (0, _classnames2.default)(this.getIconClass(), 'btn', 'viewmode-toggle__dropdown', dropdownToggleProps.classname);

      return _react2.default.createElement(
        _reactstrap.Dropdown,
        {
          isOpen: this.state.dropdownOpen,
          toggle: this.toggle,
          className: 'viewmode-toggle'
        },
        _react2.default.createElement(
          _reactstrap.DropdownToggle,
          _extends({
            className: toggleClassName,
            caret: true
          }, dropdownToggleProps),
          _react2.default.createElement(
            'span',
            { className: 'viewmode-toggle__chosen-view-title' },
            this.getTitle()
          )
        ),
        _react2.default.createElement(
          _reactstrap.DropdownMenu,
          null,
          this.renderSplitDropdownItem(),
          this.renderEditDropDownItem(),
          this.renderPreviewDropDownItem(),
          !splitAvailable && _react2.default.createElement(
            'div',
            { className: 'disabled-tooltip' },
            _react2.default.createElement(
              'span',
              { className: 'disabled-tooltip-span' },
              _i18n2.default._t('Admin.SCREEN_TOO_SMALL', 'Screen size too small')
            )
          )
        )
      );
    }
  }]);

  return ViewModeToggle;
}(_react.Component);

ViewModeToggle.propTypes = {
  activeState: _propTypes2.default.oneOf(Object.values(_ViewModeStates.VIEW_MODE_STATES)),
  area: _propTypes2.default.string.isRequired,
  splitAvailable: _propTypes2.default.bool,
  onPreviewSelect: _propTypes2.default.func,
  onEditSelect: _propTypes2.default.func,
  onSplitSelect: _propTypes2.default.func,
  editIconClass: _propTypes2.default.string,
  previewIconClass: _propTypes2.default.string,
  splitIconClass: _propTypes2.default.string
};

ViewModeToggle.defaultProps = {
  splitAvailable: true,
  editIconClass: 'font-icon-edit-write',
  previewIconClass: 'font-icon-eye',
  splitIconClass: 'font-icon-columns',
  dropdownToggleProps: {}
};

function mapStateToProps(state) {
  return {
    activeState: state.viewMode.activeState,
    splitAvailable: state.viewMode.splitAvailable
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onSplitSelect: function onSplitSelect() {
      dispatch((0, _ViewModeActions.selectSplitMode)());
    },
    onEditSelect: function onEditSelect() {
      dispatch((0, _ViewModeActions.selectEditMode)());
    },
    onPreviewSelect: function onPreviewSelect() {
      dispatch((0, _ViewModeActions.selectPreviewMode)());
    }
  };
}

exports.Component = ViewModeToggle;
exports.default = (0, _redux.compose)((0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps))(ViewModeToggle);

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?{\"presets\":[[\"env\",{\"modules\":false}],\"react\"],\"plugins\":[\"transform-object-rest-spread\"],\"comments\":false,\"cacheDirectory\":true}!./client/src/containers/FormBuilderLoader/FormBuilderLoader.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Component = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _i18n = __webpack_require__(3);

var _i18n2 = _interopRequireDefault(_i18n);

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(1);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactRedux = __webpack_require__(5);

var _redux = __webpack_require__(7);

var _isomorphicFetch = __webpack_require__(15);

var _isomorphicFetch2 = _interopRequireDefault(_isomorphicFetch);

var _deepFreezeStrict = __webpack_require__(11);

var _deepFreezeStrict2 = _interopRequireDefault(_deepFreezeStrict);

var _reduxForm = __webpack_require__(12);

var _schemaFieldValues = __webpack_require__(13);

var _schemaFieldValues2 = _interopRequireDefault(_schemaFieldValues);

var _createErrorBlock = __webpack_require__("./client/src/lib/createErrorBlock.js");

var _SchemaActions = __webpack_require__(16);

var schemaActions = _interopRequireWildcard(_SchemaActions);

var _merge = __webpack_require__(20);

var _merge2 = _interopRequireDefault(_merge);

var _FormBuilder = __webpack_require__(39);

var _FormBuilder2 = _interopRequireDefault(_FormBuilder);

var _getIn = __webpack_require__("./node_modules/redux-form/lib/structure/plain/getIn.js");

var _getIn2 = _interopRequireDefault(_getIn);

var _Injector = __webpack_require__(9);

var _getFormState = __webpack_require__(17);

var _getFormState2 = _interopRequireDefault(_getFormState);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function createFormIdentifierFromProps(_ref) {
  var identifier = _ref.identifier,
      _ref$schema = _ref.schema,
      schema = _ref$schema === undefined ? {} : _ref$schema;

  return [identifier, schema.schema && schema.schema.name].filter(function (id) {
    return id;
  }).join('.');
}

var FormBuilderLoader = function (_Component) {
  _inherits(FormBuilderLoader, _Component);

  function FormBuilderLoader(props) {
    _classCallCheck(this, FormBuilderLoader);

    var _this = _possibleConstructorReturn(this, (FormBuilderLoader.__proto__ || Object.getPrototypeOf(FormBuilderLoader)).call(this, props));

    _this.handleSubmit = _this.handleSubmit.bind(_this);
    _this.reduceSchemaErrors = _this.reduceSchemaErrors.bind(_this);
    _this.handleAutofill = _this.handleAutofill.bind(_this);
    return _this;
  }

  _createClass(FormBuilderLoader, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _props = this.props,
          schema = _props.schema,
          refetchSchemaOnMount = _props.refetchSchemaOnMount;


      if (refetchSchemaOnMount || !schema) {
        this.fetch();
      }
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps) {
      if (this.props.schemaUrl !== prevProps.schemaUrl) {
        this.fetch();
      }
    }
  }, {
    key: 'getMessages',
    value: function getMessages(state) {
      var messages = {};

      if (state && state.fields) {
        state.fields.forEach(function (field) {
          if (field.message) {
            messages[field.name] = field.message;
          }
        });
      }
      return messages;
    }
  }, {
    key: 'getIdentifier',
    value: function getIdentifier() {
      var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.props;

      return createFormIdentifierFromProps(props);
    }
  }, {
    key: 'handleSubmit',
    value: function handleSubmit(data, action, submitFn) {
      var _this2 = this;

      var promise = null;

      var newSubmitFn = function newSubmitFn() {
        return submitFn().then(function (formSchema) {
          var schema = formSchema;
          if (schema) {
            var explicitUpdatedState = typeof schema.state !== 'undefined';

            schema = _this2.reduceSchemaErrors(schema);
            _this2.props.actions.schema.setSchema(_this2.props.schemaUrl, schema, _this2.getIdentifier());

            if (explicitUpdatedState) {
              var schemaRef = schema.schema || _this2.props.schema.schema;
              var formData = (0, _schemaFieldValues2.default)(schemaRef, schema.state);
              _this2.props.actions.reduxForm.initialize(_this2.getIdentifier(), formData);
            }
          }
          return schema;
        });
      };

      if (typeof this.props.onSubmit === 'function') {
        promise = this.props.onSubmit(data, action, newSubmitFn);
      } else {
        promise = newSubmitFn();
      }

      if (!promise) {
        throw new Error('Promise was not returned for submitting');
      }

      return promise.then(function (formSchema) {
        if (!formSchema || !formSchema.state) {
          return formSchema;
        }
        var messages = _this2.getMessages(formSchema.state);

        if (Object.keys(messages).length) {
          throw new _reduxForm.SubmissionError(messages);
        }
        return formSchema;
      });
    }
  }, {
    key: 'reduceSchemaErrors',
    value: function reduceSchemaErrors(schema) {
      if (!schema.errors) {
        return schema;
      }

      var reduced = _extends({}, schema);
      if (!reduced.state) {
        reduced = _extends({}, reduced, {
          state: this.props.schema.state
        });
      }

      reduced = _extends({}, reduced, {
        state: _extends({}, reduced.state, {
          fields: reduced.state.fields.map(function (field) {
            var message = schema.errors.find(function (error) {
              return error.field === field.name;
            });
            if (message) {
              message = (0, _createErrorBlock.createErrorHtml)([message.value]);
            }
            return _extends({}, field, {
              message: message
            });
          })
        }),

        messages: schema.errors.filter(function (error) {
          return !error.field;
        })
      });

      delete reduced.errors;
      return (0, _deepFreezeStrict2.default)(reduced);
    }
  }, {
    key: 'overrideStateData',
    value: function overrideStateData(state) {
      if (!this.props.stateOverrides || !state) {
        return state;
      }
      var fieldOverrides = this.props.stateOverrides.fields;
      var fields = state.fields;
      if (fieldOverrides && fields) {
        fields = fields.map(function (field) {
          var fieldOverride = fieldOverrides.find(function (override) {
            return override.name === field.name;
          });

          return fieldOverride ? _merge2.default.recursive(true, field, fieldOverride) : field;
        });
      }

      return Object.assign({}, state, this.props.stateOverrides, { fields: fields });
    }
  }, {
    key: 'callFetch',
    value: function callFetch(headerValues) {
      return (0, _isomorphicFetch2.default)(this.props.schemaUrl, {
        headers: {
          'X-FormSchema-Request': headerValues.join(','),
          Accept: 'application/json'
        },
        credentials: 'same-origin'
      }).then(function (response) {
        if (response.status >= 200 && response.status < 300) {
          return response.json();
        }
        return new Promise(function (resolve, reject) {
          return response.json().then(function (json) {
            reject({
              status: response.status,
              statusText: response.statusText,
              json: json
            });
          }).catch(function () {
            reject({
              status: response.status,
              statusText: response.statusText,
              json: {}
            });
          });
        });
      });
    }
  }, {
    key: 'fetch',
    value: function fetch() {
      var schema = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

      var _this3 = this;

      var state = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      var errors = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      if (this.props.loading) {
        return Promise.resolve({});
      }

      var headerValues = ['auto', schema && 'schema', state && 'state', errors && 'errors'].filter(function (header) {
        return header;
      });

      this.props.actions.schema.setSchemaLoading(this.props.schemaUrl, true);

      if (typeof this.props.onFetchingSchema === 'function') {
        this.props.onFetchingSchema();
      }

      return this.callFetch(headerValues).then(function (formSchema) {
        _this3.props.actions.schema.setSchemaLoading(_this3.props.schemaUrl, false);

        if (formSchema.errors) {
          if (typeof _this3.props.onLoadingError === 'function') {
            _this3.props.onLoadingError(formSchema);
          }
        } else if (typeof _this3.props.onLoadingSuccess === 'function') {
          _this3.props.onLoadingSuccess();
        }

        if (typeof formSchema.id !== 'undefined' && formSchema.state) {
          var overriddenSchema = Object.assign({}, formSchema, {
            state: _this3.overrideStateData(formSchema.state)
          });

          var identifier = createFormIdentifierFromProps(_extends({}, _this3.props, {
            schema: _extends({}, _this3.props.schema, overriddenSchema)
          }));

          _this3.props.actions.schema.setSchema(_this3.props.schemaUrl, overriddenSchema, identifier);

          var schemaData = formSchema.schema || _this3.props.schema.schema;
          var formData = (0, _schemaFieldValues2.default)(schemaData, overriddenSchema.state);

          _this3.props.actions.reduxForm.initialize(identifier, formData, false, { keepSubmitSucceeded: true });

          if (typeof _this3.props.onReduxFormInit === 'function') {
            _this3.props.onReduxFormInit();
          }

          return overriddenSchema;
        }
        return formSchema;
      }).catch(function (error) {
        _this3.props.actions.schema.setSchemaLoading(_this3.props.schemaUrl, false);
        if (typeof _this3.props.onLoadingError === 'function') {
          return _this3.props.onLoadingError(_this3.normaliseError(error));
        }

        throw error;
      });
    }
  }, {
    key: 'normaliseError',
    value: function normaliseError(error) {
      if (error.json && error.json.errors) {
        return error.json;
      }

      if (error.status && error.statusText) {
        return {
          errors: [{
            code: error.status,
            value: error.statusText,
            type: 'error'
          }]
        };
      }

      var message = error.message || _i18n2.default._t('Admin.UNKNOWN_ERROR', 'An unknown error has occurred.');
      return {
        errors: [{
          value: message,
          type: 'error'
        }]
      };
    }
  }, {
    key: 'handleAutofill',
    value: function handleAutofill(field, value) {
      this.props.actions.reduxForm.autofill(this.getIdentifier(), field, value);
    }
  }, {
    key: 'render',
    value: function render() {
      var Loading = this.props.loadingComponent;

      if (!this.props.schema || !this.props.schema.schema || this.props.loading) {
        return _react2.default.createElement(Loading, { containerClass: 'loading--form flexbox-area-grow' });
      }

      var props = Object.assign({}, this.props, {
        form: this.getIdentifier(),
        onSubmitSuccess: this.props.onSubmitSuccess,
        onSubmit: this.handleSubmit,
        onAutofill: this.handleAutofill,
        autoFocus: this.props.autoFocus
      });

      return _react2.default.createElement(_FormBuilder2.default, props);
    }
  }]);

  return FormBuilderLoader;
}(_react.Component);

FormBuilderLoader.propTypes = Object.assign({}, _FormBuilder.basePropTypes, {
  actions: _propTypes2.default.shape({
    schema: _propTypes2.default.object,
    reduxFrom: _propTypes2.default.object
  }),
  autoFocus: _propTypes2.default.bool,
  identifier: _propTypes2.default.string.isRequired,
  schemaUrl: _propTypes2.default.string.isRequired,
  schema: _FormBuilder.schemaPropType,
  refetchSchemaOnMount: _propTypes2.default.bool.isRequired,
  form: _propTypes2.default.string,
  submitting: _propTypes2.default.bool,
  onFetchingSchema: _propTypes2.default.func,
  onReduxFormInit: _propTypes2.default.func,
  loadingComponent: _propTypes2.default.oneOfType([_propTypes2.default.func, _propTypes2.default.node]).isRequired
});

FormBuilderLoader.defaultProps = {
  refetchSchemaOnMount: true
};

function mapStateToProps(state, ownProps) {
  var schema = state.form.formSchemas[ownProps.schemaUrl];
  var identifier = createFormIdentifierFromProps(_extends({}, ownProps, { schema: schema }));
  var reduxFormState = (0, _getIn2.default)((0, _getFormState2.default)(state), identifier);

  var submitting = reduxFormState && reduxFormState.submitting;
  var values = reduxFormState && reduxFormState.values;

  var stateOverrides = schema && schema.stateOverride;
  var loading = schema && schema.metadata && schema.metadata.loading;
  return { schema: schema, submitting: submitting, values: values, stateOverrides: stateOverrides, loading: loading };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      schema: (0, _redux.bindActionCreators)(schemaActions, dispatch),
      reduxForm: (0, _redux.bindActionCreators)({ autofill: _reduxForm.autofill, initialize: _reduxForm.initialize }, dispatch)
    }
  };
}

exports.Component = FormBuilderLoader;
exports.default = (0, _redux.compose)((0, _Injector.inject)(['ReduxForm', 'ReduxFormField', 'Loading'], function (ReduxForm, ReduxFormField, Loading) {
  return {
    loadingComponent: Loading,
    baseFormComponent: ReduxForm,
    baseFieldComponent: ReduxFormField
  };
}, function (_ref2) {
  var identifier = _ref2.identifier;
  return identifier;
}), (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps))(FormBuilderLoader);

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?{\"presets\":[[\"env\",{\"modules\":false}],\"react\"],\"plugins\":[\"transform-object-rest-spread\"],\"comments\":false,\"cacheDirectory\":true}!./client/src/containers/InsertLinkModal/InsertLinkModal.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createInsertLinkModal = exports.InsertLinkModal = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(1);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _redux = __webpack_require__(7);

var _reactRedux = __webpack_require__(5);

var _FormBuilderModal = __webpack_require__(29);

var _FormBuilderModal2 = _interopRequireDefault(_FormBuilderModal);

var _fileSchemaModalHandler = __webpack_require__(37);

var _fileSchemaModalHandler2 = _interopRequireDefault(_fileSchemaModalHandler);

var _SchemaActions = __webpack_require__(16);

var schemaActions = _interopRequireWildcard(_SchemaActions);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var InsertLinkModal = function (_Component) {
  _inherits(InsertLinkModal, _Component);

  function InsertLinkModal(props) {
    _classCallCheck(this, InsertLinkModal);

    var _this = _possibleConstructorReturn(this, (InsertLinkModal.__proto__ || Object.getPrototypeOf(InsertLinkModal)).call(this, props));

    _this.handleSubmit = _this.handleSubmit.bind(_this);
    if (!props.isOpen) {
      props.setOverrides(null);
    }
    return _this;
  }

  _createClass(InsertLinkModal, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(props) {
      if (props.isOpen && !this.props.isOpen || !props.isOpen && this.props.isOpen) {
        props.setOverrides(props.isOpen ? props : null);
      }
    }
  }, {
    key: 'getModalProps',
    value: function getModalProps() {
      var props = Object.assign({}, this.props, {
        onSubmit: this.handleSubmit,
        onClosed: this.props.onClosed,
        autoFocus: true,
        showErrorMessage: true
      });
      delete props.onInsert;
      delete props.sectionConfig;

      return props;
    }
  }, {
    key: 'handleSubmit',
    value: function handleSubmit(data, action) {
      switch (action) {
        case 'action_cancel':
          {
            this.props.onClosed();
            break;
          }
        default:
          {
            this.props.onInsert(data, action);
          }
      }

      return Promise.resolve();
    }
  }, {
    key: 'render',
    value: function render() {
      var modalProps = this.getModalProps();
      return _react2.default.createElement(_FormBuilderModal2.default, modalProps);
    }
  }]);

  return InsertLinkModal;
}(_react.Component);

InsertLinkModal.propTypes = {
  isOpen: _propTypes2.default.bool,
  schemaUrl: _propTypes2.default.string,
  onInsert: _propTypes2.default.func.isRequired,
  onClosed: _propTypes2.default.func.isRequired,
  setOverrides: _propTypes2.default.func.isRequired,
  actions: _propTypes2.default.object,
  requireLinkText: _propTypes2.default.bool,
  currentPageID: _propTypes2.default.number
};

InsertLinkModal.defaultProps = {};

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      schema: (0, _redux.bindActionCreators)(schemaActions, dispatch)
    }
  };
}

var createInsertLinkModal = function createInsertLinkModal(sectionConfigKey, formName) {
  function mapStateToProps(state, ownProps) {
    var sectionConfig = state.config.sections.find(function (section) {
      return section.name === sectionConfigKey;
    });
    var requireTextFieldUrl = ownProps.requireLinkText ? '?requireLinkText' : '';

    var schemaUrl = ('' + sectionConfig.form[formName].schemaUrl + requireTextFieldUrl).replace(/:pageid/, ownProps.currentPageID);

    return {
      sectionConfig: sectionConfig,
      schemaUrl: schemaUrl
    };
  }

  return (0, _redux.compose)((0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps), _fileSchemaModalHandler2.default)(InsertLinkModal);
};

exports.InsertLinkModal = InsertLinkModal;
exports.createInsertLinkModal = createInsertLinkModal;
exports.default = (0, _redux.compose)((0, _reactRedux.connect)(function () {
  return {};
}, mapDispatchToProps), _fileSchemaModalHandler2.default)(InsertLinkModal);

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?{\"presets\":[[\"env\",{\"modules\":false}],\"react\"],\"plugins\":[\"transform-object-rest-spread\"],\"comments\":false,\"cacheDirectory\":true}!./client/src/containers/InsertLinkModal/fileSchemaModalHandler.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ConnectedFileSchemaHandler = exports.FileSchemaHandler = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(1);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _redux = __webpack_require__(7);

var _SchemaActions = __webpack_require__(16);

var schemaActions = _interopRequireWildcard(_SchemaActions);

var _reactRedux = __webpack_require__(5);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var FileSchemaHandler = function (_Component) {
  _inherits(FileSchemaHandler, _Component);

  function FileSchemaHandler(props) {
    _classCallCheck(this, FileSchemaHandler);

    var _this = _possibleConstructorReturn(this, (FileSchemaHandler.__proto__ || Object.getPrototypeOf(FileSchemaHandler)).call(this, props));

    _this.setOverrides = _this.setOverrides.bind(_this);
    return _this;
  }

  _createClass(FileSchemaHandler, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      this.setOverrides(this.props);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.setOverrides();
    }
  }, {
    key: 'setOverrides',
    value: function setOverrides() {
      var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

      if (!props) {
        var schemaUrl = this.props.schemaUrl;
        if (schemaUrl) {
          this.props.actions.schema.setSchemaStateOverrides(schemaUrl, null);
        }
      } else if (props.schemaUrl) {
        var attrs = Object.assign({}, props.fileAttributes);

        delete attrs.ID;

        var overrides = {
          fields: Object.entries(attrs).map(function (field) {
            var _field = _slicedToArray(field, 2),
                name = _field[0],
                value = _field[1];

            return { name: name, value: value };
          })
        };

        this.props.actions.schema.setSchemaStateOverrides(props.schemaUrl, overrides);
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var TargetComponent = this.props.Component;
      var props = Object.assign({}, this.props);

      delete props.Component;

      return _react2.default.createElement(TargetComponent, _extends({ setOverrides: this.setOverrides }, props));
    }
  }]);

  return FileSchemaHandler;
}(_react.Component);

FileSchemaHandler.propTypes = {
  fileAttributes: _propTypes2.default.object,
  Component: _propTypes2.default.oneOfType([_propTypes2.default.element, _propTypes2.default.func]),
  schemaUrl: _propTypes2.default.string,
  actions: _propTypes2.default.object
};

function mapDispatchToProps(dispatch, props) {
  var actions = props && props.actions || {};
  return {
    actions: _extends({}, actions, {
      schema: (0, _redux.bindActionCreators)(schemaActions, dispatch)
    })
  };
}

var ConnectedFileSchemaHandler = (0, _reactRedux.connect)(function () {
  return {};
}, mapDispatchToProps())(FileSchemaHandler);

function fileSchemaModalHandler(AssetAdmin) {
  function mapStateToProps() {
    return {
      Component: AssetAdmin
    };
  }

  return (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(FileSchemaHandler);
}

exports.FileSchemaHandler = FileSchemaHandler;
exports.ConnectedFileSchemaHandler = ConnectedFileSchemaHandler;
exports.default = fileSchemaModalHandler;

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?{\"presets\":[[\"env\",{\"modules\":false}],\"react\"],\"plugins\":[\"transform-object-rest-spread\"],\"comments\":false,\"cacheDirectory\":true}!./client/src/lib/Backend.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _isomorphicFetch = __webpack_require__(15);

var _isomorphicFetch2 = _interopRequireDefault(_isomorphicFetch);

var _es6Promise = __webpack_require__("./node_modules/es6-promise/dist/es6-promise.js");

var _es6Promise2 = _interopRequireDefault(_es6Promise);

var _qs = __webpack_require__(34);

var _qs2 = _interopRequireDefault(_qs);

var _merge = __webpack_require__(20);

var _merge2 = _interopRequireDefault(_merge);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

_es6Promise2.default.polyfill();

function checkStatus(response) {
  var ret = null;
  var error = null;
  if (response.status >= 200 && response.status < 300) {
    ret = response;
  } else {
    error = new Error(response.statusText);
    error.response = response;
    throw error;
  }

  return ret;
}

function encodeBody(data) {
  var encodedData = null;
  if (data instanceof FormData || typeof data === 'string') {
    encodedData = data;
  } else if (data && (typeof data === 'undefined' ? 'undefined' : _typeof(data)) === 'object') {
    encodedData = JSON.stringify(data);
  } else {
    throw new Error('Invalid body type');
  }
  return encodedData;
}

function encode(contentType, data) {
  switch (contentType) {
    case 'application/x-www-form-urlencoded':
      return _qs2.default.stringify(data);

    case 'application/json':
    case 'application/x-json':
    case 'application/x-javascript':
    case 'text/javascript':
    case 'text/x-javascript':
    case 'text/x-json':
      return JSON.stringify(data);

    default:
      throw new Error('Can\'t encode format: ' + contentType);
  }
}

function decode(contentType, text) {
  switch (contentType) {
    case 'application/x-www-form-urlencoded':
      return _qs2.default.parse(text);

    case 'application/json':
    case 'application/x-json':
    case 'application/x-javascript':
    case 'text/javascript':
    case 'text/x-javascript':
    case 'text/x-json':
      return JSON.parse(text);

    default:
      throw new Error('Can\'t decode format: ' + contentType);
  }
}

function addQuerystring(url, querystring) {
  if (querystring === '') {
    return url;
  }

  if (url.match(/\?/)) {
    return url + '&' + querystring;
  }

  return url + '?' + querystring;
}

function parseResponse(response) {
  return response.text().then(function (body) {
    return decode(response.headers.get('Content-Type'), body);
  });
}

function applySchemaToData(payloadSchema, data) {
  return Object.keys(data).reduce(function (prev, key) {
    var schema = payloadSchema[key];

    if (schema && (schema.remove === true || schema.querystring === true)) {
      return prev;
    }

    return Object.assign(prev, _defineProperty({}, key, data[key]));
  }, {});
}

function applySchemaToUrl(payloadSchema, url, data) {
  var opts = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : { setFromData: false };

  var newUrl = url;

  var queryData = Object.keys(data).reduce(function (prev, key) {
    var schema = payloadSchema[key];
    var includeThroughSetFromData = opts.setFromData === true && !(schema && schema.remove === true);
    var includeThroughSpec = schema && schema.querystring === true && schema.remove !== true;
    if (includeThroughSetFromData || includeThroughSpec) {
      return Object.assign(prev, _defineProperty({}, key, data[key]));
    }

    return prev;
  }, {});
  var encodedQuery = encode('application/x-www-form-urlencoded', queryData);

  newUrl = addQuerystring(newUrl, encodedQuery);

  newUrl = Object.keys(payloadSchema).reduce(function (prev, key) {
    var replacement = payloadSchema[key].urlReplacement;
    if (replacement) {
      return prev.replace(replacement, data[key]);
    }

    return prev;
  }, newUrl);

  return newUrl;
}

var Backend = function () {
  function Backend() {
    _classCallCheck(this, Backend);

    this.fetch = _isomorphicFetch2.default;
  }

  _createClass(Backend, [{
    key: 'createEndpointFetcher',
    value: function createEndpointFetcher(endpointSpec) {
      var _this = this;

      var refinedSpec = Object.assign({
        method: 'get',
        payloadFormat: 'application/x-www-form-urlencoded',
        responseFormat: 'application/json',
        payloadSchema: {},
        defaultData: {}
      }, endpointSpec);

      var formatShortcuts = {
        json: 'application/json',
        urlencoded: 'application/x-www-form-urlencoded'
      };
      ['payloadFormat', 'responseFormat'].forEach(function (key) {
        if (formatShortcuts[refinedSpec[key]]) refinedSpec[key] = formatShortcuts[refinedSpec[key]];
      });

      return function () {
        var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var headers = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        var mergedHeaders = Object.assign({}, headers, {
          Accept: refinedSpec.responseFormat,
          'Content-Type': refinedSpec.payloadFormat
        });

        var mergedData = _merge2.default.recursive({}, refinedSpec.defaultData, data);

        var url = applySchemaToUrl(refinedSpec.payloadSchema, refinedSpec.url, mergedData, { setFromData: refinedSpec.method.toLowerCase() === 'get' });

        var encodedData = refinedSpec.method.toLowerCase() !== 'get' ? encode(refinedSpec.payloadFormat, applySchemaToData(refinedSpec.payloadSchema, mergedData)) : '';

        var args = refinedSpec.method.toLowerCase() === 'get' ? [url, mergedHeaders] : [url, encodedData, mergedHeaders];

        return _this[refinedSpec.method.toLowerCase()].apply(_this, args).then(parseResponse);
      };
    }
  }, {
    key: 'get',
    value: function get(url) {
      var headers = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      return this.fetch(url, {
        method: 'get',
        credentials: 'same-origin',
        headers: headers
      }).then(checkStatus);
    }
  }, {
    key: 'post',
    value: function post(url) {
      var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var headers = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      var defaultHeaders = { 'Content-Type': 'application/x-www-form-urlencoded' };
      return this.fetch(url, {
        method: 'post',
        credentials: 'same-origin',
        body: encodeBody(data),
        headers: Object.assign({}, defaultHeaders, headers)
      }).then(checkStatus);
    }
  }, {
    key: 'put',
    value: function put(url) {
      var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var headers = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      return this.fetch(url, {
        method: 'put',
        credentials: 'same-origin',
        body: encodeBody(data),
        headers: headers
      }).then(checkStatus);
    }
  }, {
    key: 'delete',
    value: function _delete(url) {
      var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var headers = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      return this.fetch(url, {
        method: 'delete',
        credentials: 'same-origin',
        body: encodeBody(data),
        headers: headers
      }).then(checkStatus);
    }
  }]);

  return Backend;
}();

var backend = new Backend();

exports.default = backend;

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?{\"presets\":[[\"env\",{\"modules\":false}],\"react\"],\"plugins\":[\"transform-object-rest-spread\"],\"comments\":false,\"cacheDirectory\":true}!./client/src/lib/Config.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Config = function () {
  function Config() {
    _classCallCheck(this, Config);
  }

  _createClass(Config, null, [{
    key: "get",
    value: function get(key) {
      return window.ss.config[key];
    }
  }, {
    key: "getAll",
    value: function getAll() {
      return window.ss.config;
    }
  }, {
    key: "getSection",
    value: function getSection(key) {
      return window.ss.config.sections.find(function (section) {
        return section.name === key;
      });
    }
  }, {
    key: "getCurrentSection",
    value: function getCurrentSection() {}
  }]);

  return Config;
}();

exports.default = Config;

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?{\"presets\":[[\"env\",{\"modules\":false}],\"react\"],\"plugins\":[\"transform-object-rest-spread\"],\"comments\":false,\"cacheDirectory\":true}!./client/src/lib/DataFormat.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.decodeQuery = decodeQuery;
exports.fileSize = fileSize;
exports.getFileExtension = getFileExtension;

var _i18n = __webpack_require__(3);

var _i18n2 = _interopRequireDefault(_i18n);

var _qs = __webpack_require__(34);

var _qs2 = _interopRequireDefault(_qs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function decodeQuery(query) {
  return _qs2.default.parse(query.replace(/^\?/, ''));
}

function fileSize(size) {
  var number = null;
  var metric = '';

  if (size < 1024) {
    number = size;
    metric = 'bytes';
  } else if (size < 1024 * 10) {
    number = Math.round(size / 1024 * 10) / 10;
    metric = 'KB';
  } else if (size < 1024 * 1024) {
    number = Math.round(size / 1024);
    metric = 'KB';
  } else if (size < 1024 * 1024 * 10) {
    number = Math.round(size / (1024 * 1024) * 10) / 10;
    metric = 'MB';
  } else if (size < 1024 * 1024 * 1024) {
    number = Math.round(size / (1024 * 1024));
    metric = 'MB';
  }
  if (!number && number !== 0 || !metric) {
    number = Math.round(size / (1024 * 1024 * 1024) * 10) / 10;
    metric = 'GB';
  }

  if (isNaN(number)) {
    return _i18n2.default._t('Admin.NO_SIZE', 'N/A');
  }
  return number + ' ' + metric;
}

function getFileExtension(filename) {
  return (/[.]/.exec(filename) ? filename.replace(/^.+[.]/, '') : ''
  );
}

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?{\"presets\":[[\"env\",{\"modules\":false}],\"react\"],\"plugins\":[\"transform-object-rest-spread\"],\"comments\":false,\"cacheDirectory\":true}!./client/src/lib/Injector.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.graphqlTemplates = exports.loadComponent = exports.injectGraphql = exports.inject = exports.withInjector = exports.provideContext = exports.provideInjector = undefined;

var _provideInjector = __webpack_require__("./client/src/lib/dependency-injection/provideInjector.js");

var _provideInjector2 = _interopRequireDefault(_provideInjector);

var _provideContext = __webpack_require__("./client/src/lib/dependency-injection/provideContext.js");

var _provideContext2 = _interopRequireDefault(_provideContext);

var _withInjector = __webpack_require__("./client/src/lib/dependency-injection/withInjector.js");

var _withInjector2 = _interopRequireDefault(_withInjector);

var _inject = __webpack_require__("./client/src/lib/dependency-injection/inject.js");

var _inject2 = _interopRequireDefault(_inject);

var _injectGraphql = __webpack_require__("./client/src/lib/dependency-injection/injectGraphql.js");

var _injectGraphql2 = _interopRequireDefault(_injectGraphql);

var _templates = __webpack_require__("./client/src/lib/dependency-injection/graphql/templates.js");

var graphqlTemplates = _interopRequireWildcard(_templates);

var _loadComponent = __webpack_require__("./client/src/lib/dependency-injection/loadComponent.js");

var _loadComponent2 = _interopRequireDefault(_loadComponent);

var _Container = __webpack_require__("./client/src/lib/dependency-injection/Container.js");

var _Container2 = _interopRequireDefault(_Container);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.provideInjector = _provideInjector2.default;
exports.provideContext = _provideContext2.default;
exports.withInjector = _withInjector2.default;
exports.inject = _inject2.default;
exports.injectGraphql = _injectGraphql2.default;
exports.loadComponent = _loadComponent2.default;
exports.graphqlTemplates = graphqlTemplates;
exports.default = _Container2.default;

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?{\"presets\":[[\"env\",{\"modules\":false}],\"react\"],\"plugins\":[\"transform-object-rest-spread\"],\"comments\":false,\"cacheDirectory\":true}!./client/src/lib/ReactRouteRegister.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ReactRouteRegister = function () {
  function ReactRouteRegister() {
    _classCallCheck(this, ReactRouteRegister);

    this.reset();
  }

  _createClass(ReactRouteRegister, [{
    key: 'reset',
    value: function reset() {
      var _this = this;

      this.childRoutes = [];
      this.rootRoute = {
        path: '/',
        routes: function routes() {
          return _this.getChildRoutes();
        }
      };
    }
  }, {
    key: 'updateRootRoute',
    value: function updateRootRoute(route) {
      this.rootRoute = Object.assign({}, this.rootRoute, route);
    }
  }, {
    key: 'add',
    value: function add(route) {
      var parentPaths = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

      if (route.path === this.rootRoute.path && Array.isArray(route.routes)) {
        this.childRoutes = route.routes.concat(this.childRoutes);
        return;
      }

      var routes = this.findChildRoute(parentPaths);

      var newRoute = Object.assign({}, { routes: [] }, route);

      var splatRoute = newRoute.routes[newRoute.routes.length - 1];
      if (!splatRoute || splatRoute.path !== '**') {
        splatRoute = { path: '**' };
        newRoute.routes.push(splatRoute);
      }

      var newRouteIndex = routes.findIndex(function (childRoute) {
        return childRoute.path === route.path;
      });
      if (newRouteIndex >= 0) {
        routes[newRouteIndex] = newRoute;
      } else {
        routes.unshift(newRoute);
      }
    }
  }, {
    key: 'findChildRoute',
    value: function findChildRoute(parentPaths) {
      var childRoutes = this.childRoutes;

      if (parentPaths) {
        parentPaths.forEach(function (path) {
          var nextParent = childRoutes.find(function (childRoute) {
            return childRoute.path === path;
          });
          if (!nextParent) {
            throw new Error('Parent path ' + path + ' could not be found.');
          }
          childRoutes = nextParent.routes;
        });
      }

      return childRoutes;
    }
  }, {
    key: 'getRootRoute',
    value: function getRootRoute() {
      return this.rootRoute;
    }
  }, {
    key: 'getChildRoutes',
    value: function getChildRoutes() {
      return this.childRoutes;
    }
  }, {
    key: 'remove',
    value: function remove(path) {
      var parentPaths = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

      var childRoutes = this.findChildRoute(parentPaths);
      var routeIndex = childRoutes.findIndex(function (childRoute) {
        return childRoute.path === path;
      });
      if (routeIndex < 0) {
        return null;
      }

      return childRoutes.splice(routeIndex, 1)[0];
    }
  }]);

  return ReactRouteRegister;
}();

window.ss = window.ss || {};
window.ss.routeRegister = window.ss.routeRegister || new ReactRouteRegister();

exports.default = window.ss.routeRegister;

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?{\"presets\":[[\"env\",{\"modules\":false}],\"react\"],\"plugins\":[\"transform-object-rest-spread\"],\"comments\":false,\"cacheDirectory\":true}!./client/src/lib/Router.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _page = __webpack_require__(43);

var _page2 = _interopRequireDefault(_page);

var _url = __webpack_require__("./node_modules/url/url.js");

var _url2 = _interopRequireDefault(_url);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function resolveURLToBase(path) {
  var absoluteBase = _page2.default.getAbsoluteBase();
  var absolutePath = _url2.default.resolve(absoluteBase, path);

  if (absolutePath.indexOf(absoluteBase) !== 0) {
    return absolutePath;
  }

  return absolutePath.substring(absoluteBase.length - 1);
}

function show(pageShow) {
  return function (path, state, dispatch, push) {
    return pageShow(_page2.default.resolveURLToBase(path), state, dispatch, push);
  };
}

function routeAppliesToCurrentLocation(route) {
  var r = new _page2.default.Route(route);
  return r.match(_page2.default.current, {});
}

function getAbsoluteBase() {
  return _page2.default.absoluteBaseURL;
}

function setAbsoluteBase(base) {
  _page2.default.absoluteBaseURL = base;

  var a = document.createElement('a');
  a.href = base;
  var basePath = a.pathname;

  basePath = basePath.replace(/\/$/, '');
  if (basePath.match(/^[^\/]/)) {
    basePath = '/' + basePath;
  }
  _page2.default.base(basePath);
}

if (!_page2.default.oldshow) {
  _page2.default.oldshow = _page2.default.show;
}
_page2.default.setAbsoluteBase = setAbsoluteBase.bind(_page2.default);
_page2.default.getAbsoluteBase = getAbsoluteBase.bind(_page2.default);
_page2.default.resolveURLToBase = resolveURLToBase.bind(_page2.default);
_page2.default.show = show(_page2.default.oldshow);
_page2.default.routeAppliesToCurrentLocation = routeAppliesToCurrentLocation;

window.ss = window.ss || {};
window.ss.router = window.ss.router || _page2.default;

exports.default = window.ss.router;

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?{\"presets\":[[\"env\",{\"modules\":false}],\"react\"],\"plugins\":[\"transform-object-rest-spread\"],\"comments\":false,\"cacheDirectory\":true}!./client/src/lib/ShortcodeSerialiser.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _i18n = __webpack_require__(3);

var _i18n2 = _interopRequireDefault(_i18n);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var stringifyRegex = function stringifyRegex(regexp) {
  return regexp.toString().slice(1, -1);
};
var SHORTCODE_ATTRS = stringifyRegex(/((?:[,\s]+(?:[a-z0-9\-_]+)=(?:(?:[a-z0-9\-_]+)|(?:\d+\.\d+)|(?:'[^']*')|(?:"[^"]*")))*)/);

var SHORTCODE_ATTR = /[,\s]+([a-z0-9\-_]+)=(?:([a-z0-9\-_]+)|(\d+\.\d+)|(?:'([^']*)')|(?:"([^"]*)"))/;
var SHORTCODE_OPEN = stringifyRegex(/\[%s/);
var SHORTCODE_RIGHT_BRACKET = '\\]';
var SHORTCODE_CLOSE = stringifyRegex(/\[\s*\/\s*%s\s*]/);
var SHORTCODE_CONTENT = stringifyRegex(/((?:.|\n|)*?)/);
var SHORTCODE_SPACE = stringifyRegex(/\s*/);


var ShortcodeSerialiser = {
  match: function match(name, wrapped, content) {
    var open = _i18n2.default.sprintf(SHORTCODE_OPEN, name);
    var pattern = '' + open + SHORTCODE_ATTRS + SHORTCODE_SPACE + SHORTCODE_RIGHT_BRACKET;
    if (wrapped) {
      pattern = '' + pattern + SHORTCODE_CONTENT + _i18n2.default.sprintf(SHORTCODE_CLOSE, name);
    }

    var regex = new RegExp(pattern, 'i');
    var match = regex.exec(content);
    if (!match) {
      return null;
    }

    var properties = this.parseProperties(match[1]);
    return {
      name: name,
      wrapped: wrapped,
      properties: properties,
      original: match[0],
      content: wrapped ? match[2] : null
    };
  },
  parseProperties: function parseProperties(input) {
    var unmatched = input;
    var result = {};
    var match = unmatched.match(SHORTCODE_ATTR);
    while (match) {
      var key = match[1] || '';
      var value = match[2] || match[3] || match[4] || match[5] || '';
      if (key) {
        result[key] = value;
      }

      var idx = unmatched.indexOf(match[0]);
      unmatched = unmatched.substr(idx + match[0].length);
      match = unmatched.match(SHORTCODE_ATTR);
    }
    return result;
  },
  serialise: function serialise(object) {
    var attributesafe = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    var rule = attributesafe ? { sep: ',', quote: '', replacer: /[^a-z0-9\-_.]/gi } : { sep: ' ', quote: '"', replacer: /"/g };
    var attrs = Object.entries(object.properties).map(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 2),
          name = _ref2[0],
          value = _ref2[1];

      return value ? '' + rule.sep + name + '=' + rule.quote + ('' + value).replace(rule.replacer, '') + rule.quote : null;
    }).filter(function (attr) {
      return attr !== null;
    }).join('');

    if (object.wrapped) {
      return '[' + object.name + attrs + ']' + object.content + '[/' + object.name + ']';
    }
    return '[' + object.name + attrs + ']';
  }
};

exports.default = ShortcodeSerialiser;

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?{\"presets\":[[\"env\",{\"modules\":false}],\"react\"],\"plugins\":[\"transform-object-rest-spread\"],\"comments\":false,\"cacheDirectory\":true}!./client/src/lib/SilverStripeComponent.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var warned = false;
var timer = null;

var SilverStripeComponent = function (_Component) {
  _inherits(SilverStripeComponent, _Component);

  function SilverStripeComponent() {
    _classCallCheck(this, SilverStripeComponent);

    var _this = _possibleConstructorReturn(this, (SilverStripeComponent.__proto__ || Object.getPrototypeOf(SilverStripeComponent)).call(this));

    clearTimeout(timer);
    if (!warned && "development" !== 'production') {
      timer = setTimeout(function () {
        console.warn('SilverStripeComponent will be removed');
        warned = true;
      });
    }
    return _this;
  }

  _createClass(SilverStripeComponent, [{
    key: 'render',
    value: function render() {
      return null;
    }
  }]);

  return SilverStripeComponent;
}(_react.Component);

SilverStripeComponent.propTypes = {};

exports.default = SilverStripeComponent;

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?{\"presets\":[[\"env\",{\"modules\":false}],\"react\"],\"plugins\":[\"transform-object-rest-spread\"],\"comments\":false,\"cacheDirectory\":true}!./client/src/lib/TinyMCEActionRegistrar.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var createIdentifier = function createIdentifier(configId, menu) {
  return configId ? configId + '.' + menu : menu;
};

var TinyMCEActionRegistrar = function () {
  function TinyMCEActionRegistrar() {
    _classCallCheck(this, TinyMCEActionRegistrar);

    this.actions = {};

    this.editorCommandsToUrlTestsMap = {};

    this.defaultCommand = 'sslinkexternal';
  }

  _createClass(TinyMCEActionRegistrar, [{
    key: 'addAction',
    value: function addAction(menu, action, configId) {
      var priority = action.priority || 50;
      var name = createIdentifier(configId, menu);
      var actions = this.getActions(menu, configId, true);

      if (!actions.find(function (registeredAction) {
        return action.text === registeredAction.text;
      })) {
        this.actions[name] = [].concat(_toConsumableArray(this.getActions(menu, configId, false)), [_extends({}, action, { priority: priority })]);
      }
      return this;
    }
  }, {
    key: 'getActions',
    value: function getActions(menu, configId) {
      var includingGlobal = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      var actions = (!configId || includingGlobal) && this.actions[menu] ? this.actions[menu] : [];
      var name = createIdentifier(configId, menu);
      if (configId && this.actions[name]) {
        actions = [].concat(_toConsumableArray(actions), _toConsumableArray(this.actions[name]));
      }
      return actions;
    }
  }, {
    key: 'getSortedActions',
    value: function getSortedActions(menu, configId) {
      var includingGlobal = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      var actions = this.getActions(menu, configId, includingGlobal);
      return actions.sort(function (a, b) {
        if (a.priority !== b.priority) {
          return a.priority < b.priority;
        }

        return a.text.toLocaleLowerCase() > b.text.toLocaleLowerCase();
      });
    }
  }, {
    key: 'addCommandWithUrlTest',
    value: function addCommandWithUrlTest(command, test) {
      this.editorCommandsToUrlTestsMap[command] = test;
      return this;
    }
  }, {
    key: 'setDefaultCommand',
    value: function setDefaultCommand(command) {
      this.defaultCommand = command;

      return this;
    }
  }, {
    key: 'getDefaultCommand',
    value: function getDefaultCommand() {
      return this.defaultCommand;
    }
  }, {
    key: 'getEditorCommandFromUrl',
    value: function getEditorCommandFromUrl(url) {
      var _this = this;

      var command = this.getDefaultCommand();

      var commands = Object.keys(this.editorCommandsToUrlTestsMap);
      var matchedCmd = commands.find(function (cmd) {
        return _this.editorCommandsToUrlTestsMap[cmd] && _this.editorCommandsToUrlTestsMap[cmd].test(url);
      });
      if (matchedCmd) {
        command = matchedCmd;
      }

      return command;
    }
  }]);

  return TinyMCEActionRegistrar;
}();

window.ss = window.ss || {};
window.ss.tinymceactions = window.ss.tinymceactions || new TinyMCEActionRegistrar();

exports.default = window.ss.tinymceactions;

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?{\"presets\":[[\"env\",{\"modules\":false}],\"react\"],\"plugins\":[\"transform-object-rest-spread\"],\"comments\":false,\"cacheDirectory\":true}!./client/src/lib/formatWrittenNumber.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = formatWrittenNumber;

var _i18n = __webpack_require__(3);

var _i18n2 = _interopRequireDefault(_i18n);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function formatWrittenNumber(num) {
  var parsed = Number(num);
  if (num !== null && parsed >= 0 && parsed < 10) {
    return [_i18n2.default._t('Admin.WRITTEN_NUMBER_ZERO', 'zero'), _i18n2.default._t('Admin.WRITTEN_NUMBER_ONE', 'one'), _i18n2.default._t('Admin.WRITTEN_NUMBER_TWO', 'two'), _i18n2.default._t('Admin.WRITTEN_NUMBER_THREE', 'three'), _i18n2.default._t('Admin.WRITTEN_NUMBER_FOUR', 'four'), _i18n2.default._t('Admin.WRITTEN_NUMBER_FIVE', 'five'), _i18n2.default._t('Admin.WRITTEN_NUMBER_SIX', 'six'), _i18n2.default._t('Admin.WRITTEN_NUMBER_SEVEN', 'seven'), _i18n2.default._t('Admin.WRITTEN_NUMBER_EIGHT', 'eight'), _i18n2.default._t('Admin.WRITTEN_NUMBER_NINE', 'nine')][parsed];
  } else if (parsed) {
    return String(parsed);
  }

  return null;
}

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?{\"presets\":[[\"env\",{\"modules\":false}],\"react\"],\"plugins\":[\"transform-object-rest-spread\"],\"comments\":false,\"cacheDirectory\":true}!./client/src/lib/getFormState.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getFormState;
function getFormState(state) {
  var formState = state.form && state.form.formState;
  return formState || {};
}

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?{\"presets\":[[\"env\",{\"modules\":false}],\"react\"],\"plugins\":[\"transform-object-rest-spread\"],\"comments\":false,\"cacheDirectory\":true}!./client/src/lib/reduxFieldReducer.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getFieldReducer;

var _deepFreezeStrict = __webpack_require__(11);

var _deepFreezeStrict2 = _interopRequireDefault(_deepFreezeStrict);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function getFieldReducer(state, action) {
  var initialFieldState = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  return function (fieldReducer) {
    if (!action.payload.fieldId) {
      throw new Error('Invalid fieldId');
    }

    var fields = state.fields || {};
    var field = fields[action.payload.fieldId] ? state.fields[action.payload.fieldId] : initialFieldState;

    return (0, _deepFreezeStrict2.default)(Object.assign({}, state, {
      fields: Object.assign({}, fields, _defineProperty({}, action.payload.fieldId, Object.assign({}, field, fieldReducer(field))))
    }));
  };
}

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?{\"presets\":[[\"env\",{\"modules\":false}],\"react\"],\"plugins\":[\"transform-object-rest-spread\"],\"comments\":false,\"cacheDirectory\":true}!./client/src/lib/schemaFieldValues.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.schemaMerge = schemaMerge;
exports.findField = findField;
exports.default = schemaFieldValues;

var _merge = __webpack_require__(20);

var _merge2 = _interopRequireDefault(_merge);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function schemaMerge(schema, state) {
  if (typeof state === 'undefined') {
    return schema;
  }
  return _merge2.default.recursive(true, schema, state);
}

function findField(fields, name) {
  if (!fields) {
    return null;
  }

  return fields.reduce(function (prev, field) {
    if (prev) {
      return prev;
    }
    return findField(field.children, name);
  }, fields.find(function (field) {
    return field.name === name || field.name === name + '[]';
  }));
}

function schemaFieldValues(schema, state) {
  if (!state) {
    return {};
  }

  return state.fields.reduce(function (prev, curr) {
    var match = findField(schema.fields, curr.name);

    if (!match) {
      return prev;
    }

    if (match.type === 'Structural' || match.readOnly === true) {
      return prev;
    }

    return Object.assign({}, prev, _defineProperty({}, curr.name, curr.value));
  }, {});
}

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?{\"presets\":[[\"env\",{\"modules\":false}],\"react\"],\"plugins\":[\"transform-object-rest-spread\"],\"comments\":false,\"cacheDirectory\":true}!./client/src/lib/withDragDropContext.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _reactDnd = __webpack_require__(45);

var _reactDndHtml5Backend = __webpack_require__(46);

var _reactDndHtml5Backend2 = _interopRequireDefault(_reactDndHtml5Backend);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (0, _reactDnd.DragDropContext)(_reactDndHtml5Backend2.default);

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?{\"presets\":[[\"env\",{\"modules\":false}],\"react\"],\"plugins\":[\"transform-object-rest-spread\"],\"comments\":false,\"cacheDirectory\":true}!./client/src/state/breadcrumbs/BreadcrumbsActions.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setBreadcrumbs = setBreadcrumbs;

var _BreadcrumbsActionTypes = __webpack_require__("./client/src/state/breadcrumbs/BreadcrumbsActionTypes.js");

var _BreadcrumbsActionTypes2 = _interopRequireDefault(_BreadcrumbsActionTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function setBreadcrumbs(breadcrumbs) {
  return {
    type: _BreadcrumbsActionTypes2.default.SET_BREADCRUMBS,
    payload: { breadcrumbs: breadcrumbs }
  };
}

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?{\"presets\":[[\"env\",{\"modules\":false}],\"react\"],\"plugins\":[\"transform-object-rest-spread\"],\"comments\":false,\"cacheDirectory\":true}!./client/src/state/records/RecordsActionTypes.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  FETCH_RECORDS_REQUEST: 'FETCH_RECORDS_REQUEST',
  FETCH_RECORDS_FAILURE: 'FETCH_RECORDS_FAILURE',
  FETCH_RECORDS_SUCCESS: 'FETCH_RECORDS_SUCCESS',
  FETCH_RECORD_REQUEST: 'FETCH_RECORD_REQUEST',
  FETCH_RECORD_FAILURE: 'FETCH_RECORD_FAILURE',
  FETCH_RECORD_SUCCESS: 'FETCH_RECORD_SUCCESS',
  DELETE_RECORD_REQUEST: 'DELETE_RECORD_REQUEST',
  DELETE_RECORD_FAILURE: 'DELETE_RECORD_FAILURE',
  DELETE_RECORD_SUCCESS: 'DELETE_RECORD_SUCCESS'
};

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?{\"presets\":[[\"env\",{\"modules\":false}],\"react\"],\"plugins\":[\"transform-object-rest-spread\"],\"comments\":false,\"cacheDirectory\":true}!./client/src/state/records/RecordsActions.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchRecords = fetchRecords;
exports.fetchRecord = fetchRecord;
exports.deleteRecord = deleteRecord;

var _Backend = __webpack_require__(26);

var _Backend2 = _interopRequireDefault(_Backend);

var _RecordsActionTypes = __webpack_require__("./client/src/state/records/RecordsActionTypes.js");

var _RecordsActionTypes2 = _interopRequireDefault(_RecordsActionTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function populate(template, params) {
  return Object.keys(params).reduce(function (result, name) {
    return result.replace(':' + name, params[name]);
  }, template);
}

function fetchRecords(recordType, method, url) {
  var payload = { recordType: recordType };
  var headers = { Accept: 'application/json' };
  var methodToLowerCase = method.toLowerCase();

  return function (dispatch) {
    dispatch({
      type: _RecordsActionTypes2.default.FETCH_RECORDS_REQUEST,
      payload: payload
    });

    var args = methodToLowerCase === 'get' ? [populate(url, payload), headers] : [populate(url, payload), {}, headers];

    return _Backend2.default[methodToLowerCase].apply(_Backend2.default, args).then(function (response) {
      return response.json();
    }).then(function (json) {
      dispatch({
        type: _RecordsActionTypes2.default.FETCH_RECORDS_SUCCESS,
        payload: { recordType: recordType, data: json }
      });
    }).catch(function (err) {
      dispatch({
        type: _RecordsActionTypes2.default.FETCH_RECORDS_FAILURE,
        payload: { error: err, recordType: recordType }
      });
      throw err;
    });
  };
}

function fetchRecord(recordType, method, url) {
  var payload = { recordType: recordType };
  var headers = { Accept: 'application/json' };
  var methodToLowerCase = method.toLowerCase();

  return function (dispatch) {
    dispatch({
      type: _RecordsActionTypes2.default.FETCH_RECORD_REQUEST,
      payload: payload
    });

    var args = methodToLowerCase === 'get' ? [populate(url, payload), headers] : [populate(url, payload), {}, headers];

    return _Backend2.default[methodToLowerCase].apply(_Backend2.default, args).then(function (response) {
      return response.json();
    }).then(function (json) {
      dispatch({
        type: _RecordsActionTypes2.default.FETCH_RECORD_SUCCESS,
        payload: { recordType: recordType, data: json }
      });
    }).catch(function (err) {
      dispatch({
        type: _RecordsActionTypes2.default.FETCH_RECORD_FAILURE,
        payload: { error: err, recordType: recordType }
      });
      throw err;
    });
  };
}

function deleteRecord(recordType, id, method, url) {
  var headers = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};

  var payload = { recordType: recordType, id: id };
  var methodToLowerCase = method.toLowerCase();
  var args = methodToLowerCase === 'get' ? [populate(url, payload), headers] : [populate(url, payload), {}, headers];

  return function (dispatch) {
    dispatch({
      type: _RecordsActionTypes2.default.DELETE_RECORD_REQUEST,
      payload: payload
    });
    return _Backend2.default[methodToLowerCase].apply(_Backend2.default, args).then(function () {
      dispatch({
        type: _RecordsActionTypes2.default.DELETE_RECORD_SUCCESS,
        payload: { recordType: recordType, id: id }
      });
    }).catch(function (err) {
      dispatch({
        type: _RecordsActionTypes2.default.DELETE_RECORD_FAILURE,
        payload: { error: err, recordType: recordType, id: id }
      });
      throw err;
    });
  };
}

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?{\"presets\":[[\"env\",{\"modules\":false}],\"react\"],\"plugins\":[\"transform-object-rest-spread\"],\"comments\":false,\"cacheDirectory\":true}!./client/src/state/schema/SchemaActions.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.setSchema = setSchema;
exports.setSchemaStateOverrides = setSchemaStateOverrides;
exports.setSchemaLoading = setSchemaLoading;

var _SchemaActionTypes = __webpack_require__("./client/src/state/schema/SchemaActionTypes.js");

var _SchemaActionTypes2 = _interopRequireDefault(_SchemaActionTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function setSchema(id) {
  var schema = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var name = arguments[2];

  return {
    type: _SchemaActionTypes2.default.SET_SCHEMA,
    payload: _extends({}, schema, {
      id: id,
      name: name
    })
  };
}

function setSchemaStateOverrides(id, stateOverride) {
  return {
    type: _SchemaActionTypes2.default.SET_SCHEMA_STATE_OVERRIDES,
    payload: {
      id: id,
      stateOverride: stateOverride
    }
  };
}

function setSchemaLoading(id, loading) {
  return {
    type: _SchemaActionTypes2.default.SET_SCHEMA_LOADING,
    payload: {
      id: id,
      loading: loading
    }
  };
}

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?{\"presets\":[[\"env\",{\"modules\":false}],\"react\"],\"plugins\":[\"transform-object-rest-spread\"],\"comments\":false,\"cacheDirectory\":true}!./client/src/state/tabs/TabsActions.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.activateTab = activateTab;

var _TabsActionTypes = __webpack_require__("./client/src/state/tabs/TabsActionTypes.js");

var _TabsActionTypes2 = _interopRequireDefault(_TabsActionTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function activateTab(fieldId, tab) {
  return {
    type: _TabsActionTypes2.default.TABS_ACTIVATE_TAB,
    payload: { fieldId: fieldId, tab: tab }
  };
}

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?{\"presets\":[[\"env\",{\"modules\":false}],\"react\"],\"plugins\":[\"transform-object-rest-spread\"],\"comments\":false,\"cacheDirectory\":true}!./client/src/state/unsavedForms/UnsavedFormsActions.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addFormChanged = addFormChanged;
exports.removeFormChanged = removeFormChanged;

var _UnsavedFormsActionTypes = __webpack_require__("./client/src/state/unsavedForms/UnsavedFormsActionTypes.js");

var _UnsavedFormsActionTypes2 = _interopRequireDefault(_UnsavedFormsActionTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function addFormChanged(form) {
  return {
    type: _UnsavedFormsActionTypes2.default.ADD_FORM_CHANGED,
    meta: { form: form }
  };
}

function removeFormChanged(form) {
  return {
    type: _UnsavedFormsActionTypes2.default.REMOVE_FORM_CHANGED,
    meta: { form: form }
  };
}

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?{\"presets\":[[\"env\",{\"modules\":false}],\"react\"],\"plugins\":[\"transform-object-rest-spread\"],\"comments\":false,\"cacheDirectory\":true}!./client/src/state/viewMode/ViewModeActions.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.selectEditMode = selectEditMode;
exports.selectPreviewMode = selectPreviewMode;
exports.selectSplitMode = selectSplitMode;
exports.enableOrDisableSplitMode = enableOrDisableSplitMode;

var _ViewModeActionTypes = __webpack_require__("./client/src/state/viewMode/ViewModeActionTypes.js");

var _ViewModeActionTypes2 = _interopRequireDefault(_ViewModeActionTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function selectEditMode() {
  return {
    type: _ViewModeActionTypes2.default.SELECT_EDIT
  };
}

function selectPreviewMode() {
  return {
    type: _ViewModeActionTypes2.default.SELECT_PREVIEW
  };
}

function selectSplitMode() {
  return {
    type: _ViewModeActionTypes2.default.SELECT_SPLIT
  };
}

function enableOrDisableSplitMode(panelWidth) {
  return {
    type: _ViewModeActionTypes2.default.SPLIT_AVAILABLE,
    payload: { panelWidth: panelWidth }
  };
}

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?{\"presets\":[[\"env\",{\"modules\":false}],\"react\"],\"plugins\":[\"transform-object-rest-spread\"],\"comments\":false,\"cacheDirectory\":true}!./client/src/state/viewMode/ViewModeStates.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var VIEW_MODE_STATES = exports.VIEW_MODE_STATES = {
  EDIT: 'edit',
  PREVIEW: 'preview',
  SPLIT: 'split'
};

/***/ }),

/***/ "./node_modules/expose-loader/index.js?Accordion!./client/src/components/Accordion/Accordion.js-exposed":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["Accordion"] = __webpack_require__("./node_modules/babel-loader/lib/index.js?{\"presets\":[[\"env\",{\"modules\":false}],\"react\"],\"plugins\":[\"transform-object-rest-spread\"],\"comments\":false,\"cacheDirectory\":true}!./client/src/components/Accordion/Accordion.js");
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./node_modules/expose-loader/index.js?AccordionBlock!./client/src/components/Accordion/AccordionBlock.js-exposed":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["AccordionBlock"] = __webpack_require__("./node_modules/babel-loader/lib/index.js?{\"presets\":[[\"env\",{\"modules\":false}],\"react\"],\"plugins\":[\"transform-object-rest-spread\"],\"comments\":false,\"cacheDirectory\":true}!./client/src/components/Accordion/AccordionBlock.js");
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./node_modules/expose-loader/index.js?Backend!./client/src/lib/Backend.js-exposed":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["Backend"] = __webpack_require__("./node_modules/babel-loader/lib/index.js?{\"presets\":[[\"env\",{\"modules\":false}],\"react\"],\"plugins\":[\"transform-object-rest-spread\"],\"comments\":false,\"cacheDirectory\":true}!./client/src/lib/Backend.js");
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./node_modules/expose-loader/index.js?Badge!./client/src/components/Badge/Badge.js-exposed":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["Badge"] = __webpack_require__("./node_modules/babel-loader/lib/index.js?{\"presets\":[[\"env\",{\"modules\":false}],\"react\"],\"plugins\":[\"transform-object-rest-spread\"],\"comments\":false,\"cacheDirectory\":true}!./client/src/components/Badge/Badge.js");
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./node_modules/expose-loader/index.js?Breadcrumb!./client/src/components/Breadcrumb/Breadcrumb.js-exposed":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["Breadcrumb"] = __webpack_require__("./node_modules/babel-loader/lib/index.js?{\"presets\":[[\"env\",{\"modules\":false}],\"react\"],\"plugins\":[\"transform-object-rest-spread\"],\"comments\":false,\"cacheDirectory\":true}!./client/src/components/Breadcrumb/Breadcrumb.js");
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./node_modules/expose-loader/index.js?BreadcrumbsActions!./client/src/state/breadcrumbs/BreadcrumbsActions.js-exposed":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["BreadcrumbsActions"] = __webpack_require__("./node_modules/babel-loader/lib/index.js?{\"presets\":[[\"env\",{\"modules\":false}],\"react\"],\"plugins\":[\"transform-object-rest-spread\"],\"comments\":false,\"cacheDirectory\":true}!./client/src/state/breadcrumbs/BreadcrumbsActions.js");
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./node_modules/expose-loader/index.js?CheckboxSetField!./client/src/components/CheckboxSetField/CheckboxSetField.js-exposed":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["CheckboxSetField"] = __webpack_require__("./node_modules/babel-loader/lib/index.js?{\"presets\":[[\"env\",{\"modules\":false}],\"react\"],\"plugins\":[\"transform-object-rest-spread\"],\"comments\":false,\"cacheDirectory\":true}!./client/src/components/CheckboxSetField/CheckboxSetField.js");
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./node_modules/expose-loader/index.js?CompactTagList!./client/src/components/Tag/CompactTagList.js-exposed":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["CompactTagList"] = __webpack_require__("./node_modules/babel-loader/lib/index.js?{\"presets\":[[\"env\",{\"modules\":false}],\"react\"],\"plugins\":[\"transform-object-rest-spread\"],\"comments\":false,\"cacheDirectory\":true}!./client/src/components/Tag/CompactTagList.js");
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./node_modules/expose-loader/index.js?Config!./client/src/lib/Config.js-exposed":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["Config"] = __webpack_require__("./node_modules/babel-loader/lib/index.js?{\"presets\":[[\"env\",{\"modules\":false}],\"react\"],\"plugins\":[\"transform-object-rest-spread\"],\"comments\":false,\"cacheDirectory\":true}!./client/src/lib/Config.js");
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./node_modules/expose-loader/index.js?DataFormat!./client/src/lib/DataFormat.js-exposed":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["DataFormat"] = __webpack_require__("./node_modules/babel-loader/lib/index.js?{\"presets\":[[\"env\",{\"modules\":false}],\"react\"],\"plugins\":[\"transform-object-rest-spread\"],\"comments\":false,\"cacheDirectory\":true}!./client/src/lib/DataFormat.js");
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./node_modules/expose-loader/index.js?FieldHolder!./client/src/components/FieldHolder/FieldHolder.js-exposed":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["FieldHolder"] = __webpack_require__("./node_modules/babel-loader/lib/index.js?{\"presets\":[[\"env\",{\"modules\":false}],\"react\"],\"plugins\":[\"transform-object-rest-spread\"],\"comments\":false,\"cacheDirectory\":true}!./client/src/components/FieldHolder/FieldHolder.js");
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./node_modules/expose-loader/index.js?FileSchemaModalHandler!./client/src/containers/InsertLinkModal/fileSchemaModalHandler.js-exposed":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["FileSchemaModalHandler"] = __webpack_require__("./node_modules/babel-loader/lib/index.js?{\"presets\":[[\"env\",{\"modules\":false}],\"react\"],\"plugins\":[\"transform-object-rest-spread\"],\"comments\":false,\"cacheDirectory\":true}!./client/src/containers/InsertLinkModal/fileSchemaModalHandler.js");
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./node_modules/expose-loader/index.js?Focusedzone!./client/src/components/Focusedzone/Focusedzone.js-exposed":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["Focusedzone"] = __webpack_require__("./node_modules/babel-loader/lib/index.js?{\"presets\":[[\"env\",{\"modules\":false}],\"react\"],\"plugins\":[\"transform-object-rest-spread\"],\"comments\":false,\"cacheDirectory\":true}!./client/src/components/Focusedzone/Focusedzone.js");
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./node_modules/expose-loader/index.js?Form!./client/src/components/Form/Form.js-exposed":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["Form"] = __webpack_require__("./node_modules/babel-loader/lib/index.js?{\"presets\":[[\"env\",{\"modules\":false}],\"react\"],\"plugins\":[\"transform-object-rest-spread\"],\"comments\":false,\"cacheDirectory\":true}!./client/src/components/Form/Form.js");
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./node_modules/expose-loader/index.js?FormAction!./client/src/components/FormAction/FormAction.js-exposed":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["FormAction"] = __webpack_require__("./node_modules/babel-loader/lib/index.js?{\"presets\":[[\"env\",{\"modules\":false}],\"react\"],\"plugins\":[\"transform-object-rest-spread\"],\"comments\":false,\"cacheDirectory\":true}!./client/src/components/FormAction/FormAction.js");
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./node_modules/expose-loader/index.js?FormAlert!./client/src/components/FormAlert/FormAlert.js-exposed":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["FormAlert"] = __webpack_require__("./node_modules/babel-loader/lib/index.js?{\"presets\":[[\"env\",{\"modules\":false}],\"react\"],\"plugins\":[\"transform-object-rest-spread\"],\"comments\":false,\"cacheDirectory\":true}!./client/src/components/FormAlert/FormAlert.js");
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./node_modules/expose-loader/index.js?FormBuilder!./client/src/components/FormBuilder/FormBuilder.js-exposed":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["FormBuilder"] = __webpack_require__("./node_modules/babel-loader/lib/index.js?{\"presets\":[[\"env\",{\"modules\":false}],\"react\"],\"plugins\":[\"transform-object-rest-spread\"],\"comments\":false,\"cacheDirectory\":true}!./client/src/components/FormBuilder/FormBuilder.js");
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./node_modules/expose-loader/index.js?FormBuilderLoader!./client/src/containers/FormBuilderLoader/FormBuilderLoader.js-exposed":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["FormBuilderLoader"] = __webpack_require__("./node_modules/babel-loader/lib/index.js?{\"presets\":[[\"env\",{\"modules\":false}],\"react\"],\"plugins\":[\"transform-object-rest-spread\"],\"comments\":false,\"cacheDirectory\":true}!./client/src/containers/FormBuilderLoader/FormBuilderLoader.js");
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./node_modules/expose-loader/index.js?FormBuilderModal!./client/src/components/FormBuilderModal/FormBuilderModal.js-exposed":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["FormBuilderModal"] = __webpack_require__("./node_modules/babel-loader/lib/index.js?{\"presets\":[[\"env\",{\"modules\":false}],\"react\"],\"plugins\":[\"transform-object-rest-spread\"],\"comments\":false,\"cacheDirectory\":true}!./client/src/components/FormBuilderModal/FormBuilderModal.js");
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./node_modules/expose-loader/index.js?FormConstants!./client/src/components/Form/FormConstants.js-exposed":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["FormConstants"] = __webpack_require__("./node_modules/babel-loader/lib/index.js?{\"presets\":[[\"env\",{\"modules\":false}],\"react\"],\"plugins\":[\"transform-object-rest-spread\"],\"comments\":false,\"cacheDirectory\":true}!./client/src/components/Form/FormConstants.js");
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./node_modules/expose-loader/index.js?GridField!./client/src/components/GridField/GridField.js-exposed":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["GridField"] = __webpack_require__("./node_modules/babel-loader/lib/index.js?{\"presets\":[[\"env\",{\"modules\":false}],\"react\"],\"plugins\":[\"transform-object-rest-spread\"],\"comments\":false,\"cacheDirectory\":true}!./client/src/components/GridField/GridField.js");
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./node_modules/expose-loader/index.js?GridFieldCell!./client/src/components/GridField/GridFieldCell.js-exposed":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["GridFieldCell"] = __webpack_require__("./node_modules/babel-loader/lib/index.js?{\"presets\":[[\"env\",{\"modules\":false}],\"react\"],\"plugins\":[\"transform-object-rest-spread\"],\"comments\":false,\"cacheDirectory\":true}!./client/src/components/GridField/GridFieldCell.js");
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./node_modules/expose-loader/index.js?GridFieldHeader!./client/src/components/GridField/GridFieldHeader.js-exposed":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["GridFieldHeader"] = __webpack_require__("./node_modules/babel-loader/lib/index.js?{\"presets\":[[\"env\",{\"modules\":false}],\"react\"],\"plugins\":[\"transform-object-rest-spread\"],\"comments\":false,\"cacheDirectory\":true}!./client/src/components/GridField/GridFieldHeader.js");
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./node_modules/expose-loader/index.js?GridFieldHeaderCell!./client/src/components/GridField/GridFieldHeaderCell.js-exposed":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["GridFieldHeaderCell"] = __webpack_require__("./node_modules/babel-loader/lib/index.js?{\"presets\":[[\"env\",{\"modules\":false}],\"react\"],\"plugins\":[\"transform-object-rest-spread\"],\"comments\":false,\"cacheDirectory\":true}!./client/src/components/GridField/GridFieldHeaderCell.js");
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./node_modules/expose-loader/index.js?GridFieldRow!./client/src/components/GridField/GridFieldRow.js-exposed":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["GridFieldRow"] = __webpack_require__("./node_modules/babel-loader/lib/index.js?{\"presets\":[[\"env\",{\"modules\":false}],\"react\"],\"plugins\":[\"transform-object-rest-spread\"],\"comments\":false,\"cacheDirectory\":true}!./client/src/components/GridField/GridFieldRow.js");
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./node_modules/expose-loader/index.js?GridFieldTable!./client/src/components/GridField/GridFieldTable.js-exposed":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["GridFieldTable"] = __webpack_require__("./node_modules/babel-loader/lib/index.js?{\"presets\":[[\"env\",{\"modules\":false}],\"react\"],\"plugins\":[\"transform-object-rest-spread\"],\"comments\":false,\"cacheDirectory\":true}!./client/src/components/GridField/GridFieldTable.js");
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./node_modules/expose-loader/index.js?HiddenField!./client/src/components/HiddenField/HiddenField.js-exposed":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["HiddenField"] = __webpack_require__("./node_modules/babel-loader/lib/index.js?{\"presets\":[[\"env\",{\"modules\":false}],\"react\"],\"plugins\":[\"transform-object-rest-spread\"],\"comments\":false,\"cacheDirectory\":true}!./client/src/components/HiddenField/HiddenField.js");
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./node_modules/expose-loader/index.js?Injector!./client/src/lib/Injector.js-exposed":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["Injector"] = __webpack_require__("./node_modules/babel-loader/lib/index.js?{\"presets\":[[\"env\",{\"modules\":false}],\"react\"],\"plugins\":[\"transform-object-rest-spread\"],\"comments\":false,\"cacheDirectory\":true}!./client/src/lib/Injector.js");
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./node_modules/expose-loader/index.js?InsertLinkModal!./client/src/containers/InsertLinkModal/InsertLinkModal.js-exposed":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["InsertLinkModal"] = __webpack_require__("./node_modules/babel-loader/lib/index.js?{\"presets\":[[\"env\",{\"modules\":false}],\"react\"],\"plugins\":[\"transform-object-rest-spread\"],\"comments\":false,\"cacheDirectory\":true}!./client/src/containers/InsertLinkModal/InsertLinkModal.js");
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./node_modules/expose-loader/index.js?ListGroup!./client/src/components/ListGroup/ListGroup.js-exposed":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["ListGroup"] = __webpack_require__("./node_modules/babel-loader/lib/index.js?{\"presets\":[[\"env\",{\"modules\":false}],\"react\"],\"plugins\":[\"transform-object-rest-spread\"],\"comments\":false,\"cacheDirectory\":true}!./client/src/components/ListGroup/ListGroup.js");
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./node_modules/expose-loader/index.js?ListGroupItem!./client/src/components/ListGroup/ListGroupItem.js-exposed":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["ListGroupItem"] = __webpack_require__("./node_modules/babel-loader/lib/index.js?{\"presets\":[[\"env\",{\"modules\":false}],\"react\"],\"plugins\":[\"transform-object-rest-spread\"],\"comments\":false,\"cacheDirectory\":true}!./client/src/components/ListGroup/ListGroupItem.js");
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./node_modules/expose-loader/index.js?LiteralField!./client/src/components/LiteralField/LiteralField.js-exposed":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["LiteralField"] = __webpack_require__("./node_modules/babel-loader/lib/index.js?{\"presets\":[[\"env\",{\"modules\":false}],\"react\"],\"plugins\":[\"transform-object-rest-spread\"],\"comments\":false,\"cacheDirectory\":true}!./client/src/components/LiteralField/LiteralField.js");
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./node_modules/expose-loader/index.js?Loading!./client/src/components/Loading/Loading.js-exposed":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["Loading"] = __webpack_require__("./node_modules/babel-loader/lib/index.js?{\"presets\":[[\"env\",{\"modules\":false}],\"react\"],\"plugins\":[\"transform-object-rest-spread\"],\"comments\":false,\"cacheDirectory\":true}!./client/src/components/Loading/Loading.js");
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./node_modules/expose-loader/index.js?PopoverField!./client/src/components/PopoverField/PopoverField.js-exposed":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["PopoverField"] = __webpack_require__("./node_modules/babel-loader/lib/index.js?{\"presets\":[[\"env\",{\"modules\":false}],\"react\"],\"plugins\":[\"transform-object-rest-spread\"],\"comments\":false,\"cacheDirectory\":true}!./client/src/components/PopoverField/PopoverField.js");
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./node_modules/expose-loader/index.js?Preview!./client/src/components/Preview/Preview.js-exposed":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["Preview"] = __webpack_require__("./node_modules/babel-loader/lib/index.js?{\"presets\":[[\"env\",{\"modules\":false}],\"react\"],\"plugins\":[\"transform-object-rest-spread\"],\"comments\":false,\"cacheDirectory\":true}!./client/src/components/Preview/Preview.js");
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./node_modules/expose-loader/index.js?ReactRouteRegister!./client/src/lib/ReactRouteRegister.js-exposed":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["ReactRouteRegister"] = __webpack_require__("./node_modules/babel-loader/lib/index.js?{\"presets\":[[\"env\",{\"modules\":false}],\"react\"],\"plugins\":[\"transform-object-rest-spread\"],\"comments\":false,\"cacheDirectory\":true}!./client/src/lib/ReactRouteRegister.js");
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./node_modules/expose-loader/index.js?RecordsActionTypes!./client/src/state/records/RecordsActionTypes.js-exposed":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["RecordsActionTypes"] = __webpack_require__("./node_modules/babel-loader/lib/index.js?{\"presets\":[[\"env\",{\"modules\":false}],\"react\"],\"plugins\":[\"transform-object-rest-spread\"],\"comments\":false,\"cacheDirectory\":true}!./client/src/state/records/RecordsActionTypes.js");
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./node_modules/expose-loader/index.js?RecordsActions!./client/src/state/records/RecordsActions.js-exposed":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["RecordsActions"] = __webpack_require__("./node_modules/babel-loader/lib/index.js?{\"presets\":[[\"env\",{\"modules\":false}],\"react\"],\"plugins\":[\"transform-object-rest-spread\"],\"comments\":false,\"cacheDirectory\":true}!./client/src/state/records/RecordsActions.js");
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./node_modules/expose-loader/index.js?ResizeAware!./client/src/components/ResizeAware/ResizeAware.js-exposed":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["ResizeAware"] = __webpack_require__("./node_modules/babel-loader/lib/index.js?{\"presets\":[[\"env\",{\"modules\":false}],\"react\"],\"plugins\":[\"transform-object-rest-spread\"],\"comments\":false,\"cacheDirectory\":true}!./client/src/components/ResizeAware/ResizeAware.js");
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./node_modules/expose-loader/index.js?Router!./client/src/lib/Router.js-exposed":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["Router"] = __webpack_require__("./node_modules/babel-loader/lib/index.js?{\"presets\":[[\"env\",{\"modules\":false}],\"react\"],\"plugins\":[\"transform-object-rest-spread\"],\"comments\":false,\"cacheDirectory\":true}!./client/src/lib/Router.js");
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./node_modules/expose-loader/index.js?SchemaActions!./client/src/state/schema/SchemaActions.js-exposed":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["SchemaActions"] = __webpack_require__("./node_modules/babel-loader/lib/index.js?{\"presets\":[[\"env\",{\"modules\":false}],\"react\"],\"plugins\":[\"transform-object-rest-spread\"],\"comments\":false,\"cacheDirectory\":true}!./client/src/state/schema/SchemaActions.js");
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./node_modules/expose-loader/index.js?Search!./client/src/components/Search/Search.js-exposed":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["Search"] = __webpack_require__("./node_modules/babel-loader/lib/index.js?{\"presets\":[[\"env\",{\"modules\":false}],\"react\"],\"plugins\":[\"transform-object-rest-spread\"],\"comments\":false,\"cacheDirectory\":true}!./client/src/components/Search/Search.js");
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./node_modules/expose-loader/index.js?SearchToggle!./client/src/components/Search/SearchToggle.js-exposed":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["SearchToggle"] = __webpack_require__("./node_modules/babel-loader/lib/index.js?{\"presets\":[[\"env\",{\"modules\":false}],\"react\"],\"plugins\":[\"transform-object-rest-spread\"],\"comments\":false,\"cacheDirectory\":true}!./client/src/components/Search/SearchToggle.js");
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./node_modules/expose-loader/index.js?ShortcodeSerialiser!./client/src/lib/ShortcodeSerialiser.js-exposed":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["ShortcodeSerialiser"] = __webpack_require__("./node_modules/babel-loader/lib/index.js?{\"presets\":[[\"env\",{\"modules\":false}],\"react\"],\"plugins\":[\"transform-object-rest-spread\"],\"comments\":false,\"cacheDirectory\":true}!./client/src/lib/ShortcodeSerialiser.js");
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./node_modules/expose-loader/index.js?SilverStripeComponent!./client/src/lib/SilverStripeComponent.js-exposed":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["SilverStripeComponent"] = __webpack_require__("./node_modules/babel-loader/lib/index.js?{\"presets\":[[\"env\",{\"modules\":false}],\"react\"],\"plugins\":[\"transform-object-rest-spread\"],\"comments\":false,\"cacheDirectory\":true}!./client/src/lib/SilverStripeComponent.js");
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./node_modules/expose-loader/index.js?TabsActions!./client/src/state/tabs/TabsActions.js-exposed":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["TabsActions"] = __webpack_require__("./node_modules/babel-loader/lib/index.js?{\"presets\":[[\"env\",{\"modules\":false}],\"react\"],\"plugins\":[\"transform-object-rest-spread\"],\"comments\":false,\"cacheDirectory\":true}!./client/src/state/tabs/TabsActions.js");
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./node_modules/expose-loader/index.js?Tag!./client/src/components/Tag/Tag.js-exposed":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["Tag"] = __webpack_require__("./node_modules/babel-loader/lib/index.js?{\"presets\":[[\"env\",{\"modules\":false}],\"react\"],\"plugins\":[\"transform-object-rest-spread\"],\"comments\":false,\"cacheDirectory\":true}!./client/src/components/Tag/Tag.js");
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./node_modules/expose-loader/index.js?TagList!./client/src/components/Tag/TagList.js-exposed":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["TagList"] = __webpack_require__("./node_modules/babel-loader/lib/index.js?{\"presets\":[[\"env\",{\"modules\":false}],\"react\"],\"plugins\":[\"transform-object-rest-spread\"],\"comments\":false,\"cacheDirectory\":true}!./client/src/components/Tag/TagList.js");
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./node_modules/expose-loader/index.js?TextField!./client/src/components/TextField/TextField.js-exposed":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["TextField"] = __webpack_require__("./node_modules/babel-loader/lib/index.js?{\"presets\":[[\"env\",{\"modules\":false}],\"react\"],\"plugins\":[\"transform-object-rest-spread\"],\"comments\":false,\"cacheDirectory\":true}!./client/src/components/TextField/TextField.js");
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./node_modules/expose-loader/index.js?TinyMCEActionRegistrar!./client/src/lib/TinyMCEActionRegistrar.js-exposed":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["TinyMCEActionRegistrar"] = __webpack_require__("./node_modules/babel-loader/lib/index.js?{\"presets\":[[\"env\",{\"modules\":false}],\"react\"],\"plugins\":[\"transform-object-rest-spread\"],\"comments\":false,\"cacheDirectory\":true}!./client/src/lib/TinyMCEActionRegistrar.js");
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./node_modules/expose-loader/index.js?Toolbar!./client/src/components/Toolbar/Toolbar.js-exposed":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["Toolbar"] = __webpack_require__("./node_modules/babel-loader/lib/index.js?{\"presets\":[[\"env\",{\"modules\":false}],\"react\"],\"plugins\":[\"transform-object-rest-spread\"],\"comments\":false,\"cacheDirectory\":true}!./client/src/components/Toolbar/Toolbar.js");
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./node_modules/expose-loader/index.js?TreeDropdownField!./client/src/components/TreeDropdownField/TreeDropdownField.js-exposed":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["TreeDropdownField"] = __webpack_require__("./node_modules/babel-loader/lib/index.js?{\"presets\":[[\"env\",{\"modules\":false}],\"react\"],\"plugins\":[\"transform-object-rest-spread\"],\"comments\":false,\"cacheDirectory\":true}!./client/src/components/TreeDropdownField/TreeDropdownField.js");
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./node_modules/expose-loader/index.js?TreeDropdownFieldMenu!./client/src/components/TreeDropdownField/TreeDropdownFieldMenu.js-exposed":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["TreeDropdownFieldMenu"] = __webpack_require__("./node_modules/babel-loader/lib/index.js?{\"presets\":[[\"env\",{\"modules\":false}],\"react\"],\"plugins\":[\"transform-object-rest-spread\"],\"comments\":false,\"cacheDirectory\":true}!./client/src/components/TreeDropdownField/TreeDropdownFieldMenu.js");
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./node_modules/expose-loader/index.js?TreeDropdownFieldNode!./client/src/components/TreeDropdownField/TreeDropdownFieldNode.js-exposed":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["TreeDropdownFieldNode"] = __webpack_require__("./node_modules/babel-loader/lib/index.js?{\"presets\":[[\"env\",{\"modules\":false}],\"react\"],\"plugins\":[\"transform-object-rest-spread\"],\"comments\":false,\"cacheDirectory\":true}!./client/src/components/TreeDropdownField/TreeDropdownFieldNode.js");
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./node_modules/expose-loader/index.js?UnsavedFormsActions!./client/src/state/unsavedForms/UnsavedFormsActions.js-exposed":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["UnsavedFormsActions"] = __webpack_require__("./node_modules/babel-loader/lib/index.js?{\"presets\":[[\"env\",{\"modules\":false}],\"react\"],\"plugins\":[\"transform-object-rest-spread\"],\"comments\":false,\"cacheDirectory\":true}!./client/src/state/unsavedForms/UnsavedFormsActions.js");
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./node_modules/expose-loader/index.js?ViewModeActions!./client/src/state/viewMode/ViewModeActions.js-exposed":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["ViewModeActions"] = __webpack_require__("./node_modules/babel-loader/lib/index.js?{\"presets\":[[\"env\",{\"modules\":false}],\"react\"],\"plugins\":[\"transform-object-rest-spread\"],\"comments\":false,\"cacheDirectory\":true}!./client/src/state/viewMode/ViewModeActions.js");
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./node_modules/expose-loader/index.js?ViewModeStates!./client/src/state/viewMode/ViewModeStates.js-exposed":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["ViewModeStates"] = __webpack_require__("./node_modules/babel-loader/lib/index.js?{\"presets\":[[\"env\",{\"modules\":false}],\"react\"],\"plugins\":[\"transform-object-rest-spread\"],\"comments\":false,\"cacheDirectory\":true}!./client/src/state/viewMode/ViewModeStates.js");
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./node_modules/expose-loader/index.js?ViewModeToggle!./client/src/components/ViewModeToggle/ViewModeToggle.js-exposed":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["ViewModeToggle"] = __webpack_require__("./node_modules/babel-loader/lib/index.js?{\"presets\":[[\"env\",{\"modules\":false}],\"react\"],\"plugins\":[\"transform-object-rest-spread\"],\"comments\":false,\"cacheDirectory\":true}!./client/src/components/ViewModeToggle/ViewModeToggle.js");
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./node_modules/expose-loader/index.js?formatWrittenNumber!./client/src/lib/formatWrittenNumber.js-exposed":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["formatWrittenNumber"] = __webpack_require__("./node_modules/babel-loader/lib/index.js?{\"presets\":[[\"env\",{\"modules\":false}],\"react\"],\"plugins\":[\"transform-object-rest-spread\"],\"comments\":false,\"cacheDirectory\":true}!./client/src/lib/formatWrittenNumber.js");
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./node_modules/expose-loader/index.js?getFormState!./client/src/lib/getFormState.js-exposed":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["getFormState"] = __webpack_require__("./node_modules/babel-loader/lib/index.js?{\"presets\":[[\"env\",{\"modules\":false}],\"react\"],\"plugins\":[\"transform-object-rest-spread\"],\"comments\":false,\"cacheDirectory\":true}!./client/src/lib/getFormState.js");
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./node_modules/expose-loader/index.js?reduxFieldReducer!./client/src/lib/reduxFieldReducer.js-exposed":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["reduxFieldReducer"] = __webpack_require__("./node_modules/babel-loader/lib/index.js?{\"presets\":[[\"env\",{\"modules\":false}],\"react\"],\"plugins\":[\"transform-object-rest-spread\"],\"comments\":false,\"cacheDirectory\":true}!./client/src/lib/reduxFieldReducer.js");
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./node_modules/expose-loader/index.js?schemaFieldValues!./client/src/lib/schemaFieldValues.js-exposed":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["schemaFieldValues"] = __webpack_require__("./node_modules/babel-loader/lib/index.js?{\"presets\":[[\"env\",{\"modules\":false}],\"react\"],\"plugins\":[\"transform-object-rest-spread\"],\"comments\":false,\"cacheDirectory\":true}!./client/src/lib/schemaFieldValues.js");
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./node_modules/expose-loader/index.js?withDragDropContext!./client/src/lib/withDragDropContext.js-exposed":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["withDragDropContext"] = __webpack_require__("./node_modules/babel-loader/lib/index.js?{\"presets\":[[\"env\",{\"modules\":false}],\"react\"],\"plugins\":[\"transform-object-rest-spread\"],\"comments\":false,\"cacheDirectory\":true}!./client/src/lib/withDragDropContext.js");
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ 11:
/***/ (function(module, exports) {

module.exports = DeepFreezeStrict;

/***/ }),

/***/ 12:
/***/ (function(module, exports) {

module.exports = ReduxForm;

/***/ }),

/***/ 13:
/***/ (function(module, exports) {

module.exports = schemaFieldValues;

/***/ }),

/***/ 14:
/***/ (function(module, exports) {

module.exports = moment;

/***/ }),

/***/ 15:
/***/ (function(module, exports) {

module.exports = IsomorphicFetch;

/***/ }),

/***/ 16:
/***/ (function(module, exports) {

module.exports = SchemaActions;

/***/ }),

/***/ 17:
/***/ (function(module, exports) {

module.exports = getFormState;

/***/ }),

/***/ 18:
/***/ (function(module, exports) {

module.exports = Config;

/***/ }),

/***/ 19:
/***/ (function(module, exports) {

module.exports = FormAlert;

/***/ }),

/***/ 20:
/***/ (function(module, exports) {

module.exports = merge;

/***/ }),

/***/ 21:
/***/ (function(module, exports) {

module.exports = modernizr;

/***/ }),

/***/ 22:
/***/ (function(module, exports) {

module.exports = ReactApollo;

/***/ }),

/***/ 23:
/***/ (function(module, exports) {

module.exports = ResizeAware;

/***/ }),

/***/ 24:
/***/ (function(module, exports) {

module.exports = Tag;

/***/ }),

/***/ 26:
/***/ (function(module, exports) {

module.exports = Backend;

/***/ }),

/***/ 27:
/***/ (function(module, exports) {

module.exports = CompactTagList;

/***/ }),

/***/ 28:
/***/ (function(module, exports) {

module.exports = FormBuilderLoader;

/***/ }),

/***/ 29:
/***/ (function(module, exports) {

module.exports = FormBuilderModal;

/***/ }),

/***/ 3:
/***/ (function(module, exports) {

module.exports = i18n;

/***/ }),

/***/ 30:
/***/ (function(module, exports) {

module.exports = Loading;

/***/ }),

/***/ 31:
/***/ (function(module, exports) {

module.exports = Search;

/***/ }),

/***/ 32:
/***/ (function(module, exports) {

module.exports = TagList;

/***/ }),

/***/ 33:
/***/ (function(module, exports) {

module.exports = TreeDropdownField;

/***/ }),

/***/ 34:
/***/ (function(module, exports) {

module.exports = qs;

/***/ }),

/***/ 35:
/***/ (function(module, exports) {

module.exports = reduxFieldReducer;

/***/ }),

/***/ 36:
/***/ (function(module, exports) {

module.exports = Badge;

/***/ }),

/***/ 37:
/***/ (function(module, exports) {

module.exports = FileSchemaModalHandler;

/***/ }),

/***/ 38:
/***/ (function(module, exports) {

module.exports = FormAction;

/***/ }),

/***/ 39:
/***/ (function(module, exports) {

module.exports = FormBuilder;

/***/ }),

/***/ 40:
/***/ (function(module, exports) {

module.exports = GraphQLTag;

/***/ }),

/***/ 41:
/***/ (function(module, exports) {

module.exports = GridField;

/***/ }),

/***/ 42:
/***/ (function(module, exports) {

module.exports = LiteralField;

/***/ }),

/***/ 43:
/***/ (function(module, exports) {

module.exports = Page;

/***/ }),

/***/ 44:
/***/ (function(module, exports) {

module.exports = Preview;

/***/ }),

/***/ 45:
/***/ (function(module, exports) {

module.exports = ReactDND;

/***/ }),

/***/ 46:
/***/ (function(module, exports) {

module.exports = ReactDNDHtml5Backend;

/***/ }),

/***/ 47:
/***/ (function(module, exports) {

module.exports = ReactRouteRegister;

/***/ }),

/***/ 48:
/***/ (function(module, exports) {

module.exports = ReactRouterDom;

/***/ }),

/***/ 49:
/***/ (function(module, exports) {

module.exports = ReactSelect;

/***/ }),

/***/ 50:
/***/ (function(module, exports) {

module.exports = RecordsActions;

/***/ }),

/***/ 51:
/***/ (function(module, exports) {

module.exports = ReduxThunk;

/***/ }),

/***/ 52:
/***/ (function(module, exports) {

module.exports = Router;

/***/ }),

/***/ 53:
/***/ (function(module, exports) {

module.exports = SearchToggle;

/***/ }),

/***/ 54:
/***/ (function(module, exports) {

module.exports = TabsActions;

/***/ }),

/***/ 55:
/***/ (function(module, exports) {

module.exports = ViewModeActions;

/***/ }),

/***/ 56:
/***/ (function(module, exports) {

module.exports = ViewModeToggle;

/***/ }),

/***/ 57:
/***/ (function(module, exports) {

module.exports = validator;

/***/ }),

/***/ 58:
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),

/***/ 6:
/***/ (function(module, exports) {

module.exports = Reactstrap;

/***/ }),

/***/ 8:
/***/ (function(module, exports) {

module.exports = FieldHolder;

/***/ }),

/***/ 9:
/***/ (function(module, exports) {

module.exports = Injector;

/***/ })

},["./client/src/bundles/bundle.js"]);
//# sourceMappingURL=bundle.js.map