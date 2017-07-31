webpackJsonp([0],{

/***/ 100:
/***/ (function(module, exports) {

module.exports = ReduxForm;

/***/ }),

/***/ 1000:
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

var _redux = __webpack_require__(41);

var _SchemaActions = __webpack_require__(248);

var schemaActions = _interopRequireWildcard(_SchemaActions);

var _reactRedux = __webpack_require__(42);

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
  fileAttributes: _react.PropTypes.object,
  Component: _react.PropTypes.oneOfType([_react.PropTypes.element, _react.PropTypes.func]),
  schemaUrl: _react.PropTypes.string,
  actions: _react.PropTypes.object
};

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      schema: (0, _redux.bindActionCreators)(schemaActions, dispatch)
    }
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

/***/ 1002:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _isomorphicFetch = __webpack_require__(179);

var _isomorphicFetch2 = _interopRequireDefault(_isomorphicFetch);

var _es6Promise = __webpack_require__(469);

var _es6Promise2 = _interopRequireDefault(_es6Promise);

var _qs = __webpack_require__(249);

var _qs2 = _interopRequireDefault(_qs);

var _merge = __webpack_require__(153);

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

/***/ 1003:
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

/***/ 1004:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.decodeQuery = decodeQuery;
exports.fileSize = fileSize;
exports.getFileExtension = getFileExtension;

var _i18n = __webpack_require__(23);

var _i18n2 = _interopRequireDefault(_i18n);

var _qs = __webpack_require__(249);

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

/***/ 1005:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.inject = exports.withInjector = exports.provideInjector = undefined;

var _provideInjector = __webpack_require__(407);

var _provideInjector2 = _interopRequireDefault(_provideInjector);

var _withInjector = __webpack_require__(408);

var _withInjector2 = _interopRequireDefault(_withInjector);

var _inject = __webpack_require__(405);

var _inject2 = _interopRequireDefault(_inject);

var _Container = __webpack_require__(258);

var _Container2 = _interopRequireDefault(_Container);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.provideInjector = _provideInjector2.default;
exports.withInjector = _withInjector2.default;
exports.inject = _inject2.default;
exports.default = _Container2.default;

/***/ }),

/***/ 1006:
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

        getChildRoutes: function getChildRoutes(location, cb) {
          cb(null, _this.childRoutes);
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

      var childRoutes = this.findChildRoute(parentPaths);

      var newRoute = Object.assign({}, { childRoutes: [] }, route);

      var splatRoute = newRoute.childRoutes[newRoute.childRoutes.length - 1];
      if (!splatRoute || splatRoute.path !== '**') {
        splatRoute = { path: '**' };
        newRoute.childRoutes.push(splatRoute);
      }

      var newRouteIndex = childRoutes.findIndex(function (childRoute) {
        return childRoute.path === route.path;
      });
      if (newRouteIndex >= 0) {
        childRoutes[newRouteIndex] = newRoute;
      } else {
        childRoutes.unshift(newRoute);
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
          childRoutes = nextParent.childRoutes;
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

/***/ 1007:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _page = __webpack_require__(1902);

var _page2 = _interopRequireDefault(_page);

var _url = __webpack_require__(385);

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

/***/ 1008:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _i18n = __webpack_require__(23);

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

/***/ 1009:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _jQuery = __webpack_require__(16);

var _jQuery2 = _interopRequireDefault(_jQuery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SilverStripeComponent = function (_Component) {
  _inherits(SilverStripeComponent, _Component);

  function SilverStripeComponent() {
    _classCallCheck(this, SilverStripeComponent);

    return _possibleConstructorReturn(this, (SilverStripeComponent.__proto__ || Object.getPrototypeOf(SilverStripeComponent)).apply(this, arguments));
  }

  _createClass(SilverStripeComponent, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      if (typeof this.props.cmsEvents === 'undefined') {
        return;
      }

      this.cmsEvents = this.props.cmsEvents;

      for (var cmsEvent in this.cmsEvents) {
        if ({}.hasOwnProperty.call(this.cmsEvents, cmsEvent)) {
          (0, _jQuery2.default)(document).on(cmsEvent, this.cmsEvents[cmsEvent].bind(this));
        }
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      for (var cmsEvent in this.cmsEvents) {
        if ({}.hasOwnProperty.call(this.cmsEvents, cmsEvent)) {
          (0, _jQuery2.default)(document).off(cmsEvent);
        }
      }
    }
  }, {
    key: 'emitCmsEvent',
    value: function emitCmsEvent(componentEvent, data) {
      (0, _jQuery2.default)(document).trigger(componentEvent, data);
    }
  }]);

  return SilverStripeComponent;
}(_react.Component);

SilverStripeComponent.propTypes = {
  cmsEvents: _react2.default.PropTypes.object
};

exports.default = SilverStripeComponent;

/***/ }),

/***/ 1010:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TinyMCEActionRegistrar = function () {
  function TinyMCEActionRegistrar() {
    _classCallCheck(this, TinyMCEActionRegistrar);

    this.actions = {};

    this.editorCommandsToUrlTestsMap = {};

    this.defaultCommand = 'sslinkexternal';
  }

  _createClass(TinyMCEActionRegistrar, [{
    key: 'addAction',
    value: function addAction(menu, action) {
      this.actions[menu] = this.getActions(menu).concat([action]);
      return this;
    }
  }, {
    key: 'getActions',
    value: function getActions(menu) {
      return this.actions[menu] || [];
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

/***/ 1011:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = formatWrittenNumber;

var _i18n = __webpack_require__(23);

var _i18n2 = _interopRequireDefault(_i18n);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function formatWrittenNumber(num) {
  var parsed = parseInt(num, 10);
  if (parsed >= 0 && parsed < 10) {
    return [_i18n2.default._t('Admin.WRITTEN_NUMBER_ZERO', 'zero'), _i18n2.default._t('Admin.WRITTEN_NUMBER_ONE', 'one'), _i18n2.default._t('Admin.WRITTEN_NUMBER_TWO', 'two'), _i18n2.default._t('Admin.WRITTEN_NUMBER_THREE', 'three'), _i18n2.default._t('Admin.WRITTEN_NUMBER_FOUR', 'four'), _i18n2.default._t('Admin.WRITTEN_NUMBER_FIVE', 'five'), _i18n2.default._t('Admin.WRITTEN_NUMBER_SIX', 'six'), _i18n2.default._t('Admin.WRITTEN_NUMBER_SEVEN', 'seven'), _i18n2.default._t('Admin.WRITTEN_NUMBER_EIGHT', 'eight'), _i18n2.default._t('Admin.WRITTEN_NUMBER_NINE', 'nine')][parsed];
  } else if (!!parsed) {
    return String(parsed);
  }

  return null;
}

/***/ }),

/***/ 1012:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getFormState;
function getFormState(state) {
  return state.form && state.form.formState || {};
}

/***/ }),

/***/ 1013:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getFieldReducer;

var _deepFreezeStrict = __webpack_require__(85);

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

/***/ 1014:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.schemaMerge = schemaMerge;
exports.findField = findField;
exports.default = schemaFieldValues;

var _merge = __webpack_require__(153);

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
  var result = null;
  if (!fields) {
    return result;
  }

  result = fields.find(function (field) {
    return field.name === name;
  });

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = fields[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var field = _step.value;

      if (result) {
        break;
      }
      result = findField(field.children, name);
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

  return result;
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

    return Object.assign({}, prev, _defineProperty({}, match.name, curr.value));
  }, {});
}

/***/ }),

/***/ 1015:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setBreadcrumbs = setBreadcrumbs;

var _BreadcrumbsActionTypes = __webpack_require__(409);

var _BreadcrumbsActionTypes2 = _interopRequireDefault(_BreadcrumbsActionTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function setBreadcrumbs(breadcrumbs) {
  return {
    type: _BreadcrumbsActionTypes2.default.SET_BREADCRUMBS,
    payload: { breadcrumbs: breadcrumbs }
  };
}

/***/ }),

/***/ 1016:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  CREATE_RECORD: 'CREATE_RECORD',
  UPDATE_RECORD: 'UPDATE_RECORD',
  DELETE_RECORD: 'DELETE_RECORD',
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

/***/ 1017:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchRecords = fetchRecords;
exports.fetchRecord = fetchRecord;
exports.deleteRecord = deleteRecord;

var _RecordsActionTypes = __webpack_require__(413);

var _RecordsActionTypes2 = _interopRequireDefault(_RecordsActionTypes);

var _Backend = __webpack_require__(951);

var _Backend2 = _interopRequireDefault(_Backend);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function populate(str, params) {
  var names = ['id'];
  return names.reduce(function (acc, name) {
    return acc.replace(':' + name, params[name]);
  }, str);
}

function fetchRecords(recordType, method, url) {
  var payload = { recordType: recordType };
  var headers = { Accept: 'text/json' };
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
  var headers = { Accept: 'text/json' };
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

/***/ 1018:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.setSchema = setSchema;
exports.setSchemaStateOverrides = setSchemaStateOverrides;
exports.setSchemaLoading = setSchemaLoading;

var _SchemaActionTypes = __webpack_require__(414);

var _SchemaActionTypes2 = _interopRequireDefault(_SchemaActionTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function setSchema(id, schema, name) {
  return {
    type: _SchemaActionTypes2.default.SET_SCHEMA,
    payload: _extends({
      id: id
    }, schema, {
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

/***/ 1019:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addFormChanged = addFormChanged;
exports.removeFormChanged = removeFormChanged;

var _UnsavedFormsActionTypes = __webpack_require__(417);

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

/***/ 126:
/***/ (function(module, exports) {

module.exports = ReactApollo;

/***/ }),

/***/ 13:
/***/ (function(module, exports) {

module.exports = SilverStripeComponent;

/***/ }),

/***/ 153:
/***/ (function(module, exports) {

module.exports = merge;

/***/ }),

/***/ 16:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var jQuery = typeof window.jQuery !== 'undefined' ? window.jQuery : null;

module.exports = jQuery;

/***/ }),

/***/ 179:
/***/ (function(module, exports) {

module.exports = IsomorphicFetch;

/***/ }),

/***/ 180:
/***/ (function(module, exports) {

module.exports = modernizr;

/***/ }),

/***/ 181:
/***/ (function(module, exports) {

module.exports = moment;

/***/ }),

/***/ 188:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = __webpack_require__(0);

var TreeDropdownFieldNode = function TreeDropdownFieldNode() {
  return null;
};

TreeDropdownFieldNode.propTypes = {
  id: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.number]),
  title: _react.PropTypes.string,
  disabled: _react.PropTypes.bool,
  parentid: _react.PropTypes.number,
  count: _react.PropTypes.number,
  depth: _react.PropTypes.number,
  expanded: _react.PropTypes.bool,
  limited: _react.PropTypes.bool,
  marked: _react.PropTypes.bool,
  opened: _react.PropTypes.bool,
  children: _react.PropTypes.array
};

exports.default = TreeDropdownFieldNode;

/***/ }),

/***/ 1894:
/***/ (function(module, exports) {

module.exports = ApolloClient;

/***/ }),

/***/ 1895:
/***/ (function(module, exports) {

module.exports = Backend;

/***/ }),

/***/ 1896:
/***/ (function(module, exports) {

module.exports = BootstrapCollapse;

/***/ }),

/***/ 1897:
/***/ (function(module, exports) {

module.exports = FormAction;

/***/ }),

/***/ 1898:
/***/ (function(module, exports) {

module.exports = FormBuilder;

/***/ }),

/***/ 1899:
/***/ (function(module, exports) {

module.exports = FormBuilderLoader;

/***/ }),

/***/ 1900:
/***/ (function(module, exports) {

module.exports = GridField;

/***/ }),

/***/ 1901:
/***/ (function(module, exports) {

module.exports = LiteralField;

/***/ }),

/***/ 1902:
/***/ (function(module, exports) {

module.exports = Page;

/***/ }),

/***/ 1903:
/***/ (function(module, exports) {

module.exports = ReactRouteRegister;

/***/ }),

/***/ 1904:
/***/ (function(module, exports) {

module.exports = ReactRouter;

/***/ }),

/***/ 1905:
/***/ (function(module, exports) {

module.exports = RecordsActions;

/***/ }),

/***/ 1906:
/***/ (function(module, exports) {

module.exports = ReduxThunk;

/***/ }),

/***/ 1907:
/***/ (function(module, exports) {

module.exports = Router;

/***/ }),

/***/ 1908:
/***/ (function(module, exports) {

module.exports = reduxFieldReducer;

/***/ }),

/***/ 1909:
/***/ (function(module, exports) {

module.exports = validator;

/***/ }),

/***/ 1910:
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),

/***/ 1911:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _classnames = __webpack_require__(4);

var _classnames2 = _interopRequireDefault(_classnames);

var _createClassMap = __webpack_require__(954);

var _createClassMap2 = _interopRequireDefault(_createClassMap);

var _getFormState = __webpack_require__(961);

var _getFormState2 = _interopRequireDefault(_getFormState);

var _reduxForm = __webpack_require__(100);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var FormStateManager = function () {
  function FormStateManager(schema, globalState) {
    _classCallCheck(this, FormStateManager);

    this.schema = _extends({}, schema, {
      state: _extends({}, schema.state)
    });
    this.globalState = globalState;
  }

  _createClass(FormStateManager, [{
    key: 'getFieldByName',
    value: function getFieldByName(fieldName) {
      return this.schema.state.fields.find(function (field) {
        return field.name === fieldName;
      });
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
      var field = fieldList[fieldIndex];
      var fields = [].concat(_toConsumableArray(fieldList));
      fields[fieldIndex] = _extends({}, updater(field));
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
      return (0, _reduxForm.getFormValues)(this.schema.name, _getFormState2.default)(this.globalState) || {};
    }
  }, {
    key: 'getValue',
    value: function getValue(fieldName) {
      return this.getValues()[fieldName];
    }
  }, {
    key: 'isDirty',
    value: function isDirty() {
      return (0, _reduxForm.isDirty)(this.schema.name, _getFormState2.default)(this.globalState);
    }
  }, {
    key: 'isPristine',
    value: function isPristine() {
      return (0, _reduxForm.isPristine)(this.schema.name, _getFormState2.default)(this.globalState);
    }
  }, {
    key: 'isValid',
    value: function isValid() {
      return (0, _reduxForm.isValid)(this.schema.name, _getFormState2.default)(this.globalState);
    }
  }, {
    key: 'isInvalid',
    value: function isInvalid() {
      return (0, _reduxForm.isInvalid)(this.schema.name, _getFormState2.default)(this.globalState);
    }
  }, {
    key: 'getState',
    value: function getState() {
      return this.schema.state;
    }
  }]);

  return FormStateManager;
}();

exports.default = FormStateManager;

/***/ }),

/***/ 23:
/***/ (function(module, exports) {

module.exports = i18n;

/***/ }),

/***/ 248:
/***/ (function(module, exports) {

module.exports = SchemaActions;

/***/ }),

/***/ 249:
/***/ (function(module, exports) {

module.exports = qs;

/***/ }),

/***/ 250:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(jQuery) {

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _jQuery = __webpack_require__(16);

var _jQuery2 = _interopRequireDefault(_jQuery);

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _reactDom = __webpack_require__(26);

var _reactDom2 = _interopRequireDefault(_reactDom);

var _IframeDialog = __webpack_require__(928);

var _IframeDialog2 = _interopRequireDefault(_IframeDialog);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

__webpack_require__(392);

_jQuery2.default.noConflict();

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

(0, _jQuery2.default)(window).bind('resize.leftandmain', function (e) {
  (0, _jQuery2.default)('.cms-container').trigger('windowresize');
});

_jQuery2.default.entwine.warningLevel = _jQuery2.default.entwine.WARN_LEVEL_BESTPRACTISE;

_jQuery2.default.entwine('ss', function ($) {
  $(window).on("message", function (e) {
    var target,
        event = e.originalEvent,
        data = _typeof(event.data) === 'object' ? event.data : JSON.parse(event.data);

    if ($.path.parseUrl(window.location.href).domain !== $.path.parseUrl(event.origin).domain) return;

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
    renderModal: function renderModal(show) {
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
        show: show,
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

  $('form.loading,.cms-content.loading,.cms-content-fields.loading,.cms-content-view.loading').entwine({
    onmatch: function onmatch() {
      this.append('<div class="cms-content-loading-overlay ui-widget-overlay-light"></div><div class="cms-content-loading-spinner"></div>');
      this._super();
    },
    onunmatch: function onunmatch() {
      this.find('.cms-content-loading-overlay,.cms-content-loading-spinner').remove();
      this._super();
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

  $('.cms .grid-field').entwine({
    showDetailView: function showDetailView(url) {
      var params = window.location.search.replace(/^\?/, '');
      if (params) url = $.path.addSearchParams(url, params);
      $('.cms-container').loadPanel(url);
    }
  });

  $('.cms-search-form').entwine({
    onsubmit: function onsubmit(e) {
      var nonEmptyInputs, url;

      nonEmptyInputs = this.find(':input:not(:submit)').filter(function () {
        var vals = $.grep($(this).fieldValue(), function (val) {
          return val;
        });
        return vals.length;
      });

      url = this.attr('action');

      if (nonEmptyInputs.length) {
        url = $.path.addSearchParams(url, nonEmptyInputs.serialize().replace('+', '%20'));
      }

      var container = this.closest('.cms-container');
      container.find('.cms-edit-form').tabs('select', 0);
      container.loadPanel(url, "", {}, true);

      return false;
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

      if (!this.children().length) {
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
        $filters.css('display', 'block');
      } else {
        this.removeClass('active');
        $filters.css('display', '');
      }
      self.data('collapsed', !collapsed);
    },
    onclick: function onclick() {
      this.showHide();
    }
  });
});

var statusMessage = function statusMessage(text, type) {
  text = jQuery('<div/>').text(text).html();
  jQuery.noticeAdd({ text: text, type: type, stayTime: 5000, inEffect: { left: '0', opacity: 'show' } });
};
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(27)))

/***/ }),

/***/ 251:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _jQuery = __webpack_require__(16);

var _jQuery2 = _interopRequireDefault(_jQuery);

var _i18n = __webpack_require__(23);

var _i18n2 = _interopRequireDefault(_i18n);

var _moment = __webpack_require__(181);

var _moment2 = _interopRequireDefault(_moment);

var _modernizr = __webpack_require__(180);

var _modernizr2 = _interopRequireDefault(_modernizr);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

__webpack_require__(125);

_jQuery2.default.entwine('ss', function (jQuery) {
  jQuery('input[type=date]').entwine({
    onadd: function onadd() {
      if (_modernizr2.default.inputtypes.date) {
        return;
      }

      if (this.prop('disabled') || this.prop('readonly') || this.hasClass('hasDatepicker')) {
        return;
      }

      var hiddenInput = jQuery('<input/>', { type: 'hidden', name: this.attr('name'), value: this.val() });
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

/***/ 255:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DateField = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _FieldHolder = __webpack_require__(44);

var _FieldHolder2 = _interopRequireDefault(_FieldHolder);

var _TextField2 = __webpack_require__(402);

var _moment = __webpack_require__(181);

var _moment2 = _interopRequireDefault(_moment);

var _modernizr = __webpack_require__(180);

var _modernizr2 = _interopRequireDefault(_modernizr);

var _i18n = __webpack_require__(23);

var _i18n2 = _interopRequireDefault(_i18n);

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
    key: 'hasNativeSupport',
    value: function hasNativeSupport() {
      return _modernizr2.default.inputtypes.date;
    }
  }, {
    key: 'getInputProps',
    value: function getInputProps() {
      var placeholder = _i18n2.default.inject(_i18n2.default._t('Admin.FormatExample', 'Example: {format}'), { format: (0, _moment2.default)().endOf('month').format(localFormat) });
      var props = {};

      var val = this.props.value;

      if (!this.props.data.html5 || this.hasNativeSupport() && this.props.data.html5) {
        val = this.props.value;
      } else {
        val = this.getLocalisedValue();
      }

      Object.assign(props, _get(DateField.prototype.__proto__ || Object.getPrototypeOf(DateField.prototype), 'getInputProps', this).call(this), {
        type: this.props.data.html5 ? 'date' : 'text',

        defaultValue: val,
        placeholder: placeholder
      });

      delete props.value;

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

      if (!this.props.data.html5 || this.hasNativeSupport() && this.props.data.html5) {
        isoValue = enteredValue;
      } else {
        isoValue = this.convertToIso(enteredValue);
      }

      if (typeof this.props.onChange === 'function') {
        this.triggerChange(isoValue);
      }
    }
  }, {
    key: 'triggerChange',
    value: function triggerChange(value) {
      this.props.onChange(value);
    }
  }, {
    key: 'convertToIso',
    value: function convertToIso(localDate) {
      _moment2.default.locale(this.props.lang);
      var isoDate = '';

      if (localDate) {
        var dateObject = (0, _moment2.default)(localDate, [localFormat, 'YYYY-MM-DD']);
        if (dateObject.isValid()) {
          isoDate = dateObject.format('YYYY-MM-DD');
        }
      }

      return isoDate;
    }
  }, {
    key: 'convertToLocalised',
    value: function convertToLocalised(isoDate) {
      _moment2.default.locale(this.props.lang);
      var localDate = '';
      if (isoDate) {
        var dateObject = (0, _moment2.default)(isoDate);
        if (dateObject.isValid()) {
          localDate = dateObject.format(localFormat);
        }
      }
      return localDate;
    }
  }]);

  return DateField;
}(_TextField2.TextField);

DateField.propTypes = {
  lang: _react2.default.PropTypes.string,
  data: _react2.default.PropTypes.shape({
    html5: _react2.default.PropTypes.boolean
  })
};

DateField.defaultProps = {
  data: {}
};

exports.DateField = DateField;
exports.default = (0, _FieldHolder2.default)(DateField);

/***/ }),

/***/ 256:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _SilverStripeComponent = __webpack_require__(13);

var _SilverStripeComponent2 = _interopRequireDefault(_SilverStripeComponent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var GridFieldRow = function (_SilverStripeComponen) {
  _inherits(GridFieldRow, _SilverStripeComponen);

  function GridFieldRow() {
    _classCallCheck(this, GridFieldRow);

    return _possibleConstructorReturn(this, (GridFieldRow.__proto__ || Object.getPrototypeOf(GridFieldRow)).apply(this, arguments));
  }

  _createClass(GridFieldRow, [{
    key: 'render',
    value: function render() {
      var className = 'grid-field__row ' + this.props.className;
      return _react2.default.createElement(
        'tr',
        { tabIndex: '0', className: className },
        this.props.children
      );
    }
  }]);

  return GridFieldRow;
}(_SilverStripeComponent2.default);

exports.default = GridFieldRow;

/***/ }),

/***/ 257:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _SilverStripeComponent = __webpack_require__(13);

var _SilverStripeComponent2 = _interopRequireDefault(_SilverStripeComponent);

var _castStringToElement = __webpack_require__(86);

var _castStringToElement2 = _interopRequireDefault(_castStringToElement);

var _reactBootstrapSs = __webpack_require__(38);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var OptionField = function (_SilverStripeComponen) {
  _inherits(OptionField, _SilverStripeComponen);

  function OptionField(props) {
    _classCallCheck(this, OptionField);

    var _this = _possibleConstructorReturn(this, (OptionField.__proto__ || Object.getPrototypeOf(OptionField)).call(this, props));

    _this.handleChange = _this.handleChange.bind(_this);
    return _this;
  }

  _createClass(OptionField, [{
    key: 'handleChange',
    value: function handleChange(event) {
      if (typeof this.props.onChange === 'function') {
        this.props.onChange(event, {
          id: this.props.id,
          value: event.target.checked ? 1 : 0
        });
      } else if (typeof this.props.onClick === 'function') {
        this.props.onClick(event, {
          id: this.props.id,
          value: event.target.checked ? 1 : 0
        });
      }
    }
  }, {
    key: 'getInputProps',
    value: function getInputProps() {
      var classNames = [this.props.className, this.props.extraClass];

      if (!!this.props.value) {
        classNames.push('checked');
      }

      return {
        id: this.props.id,
        name: this.props.name,
        disabled: this.props.disabled,
        readOnly: this.props.readOnly,
        className: classNames.join(' '),
        onChange: this.handleChange,
        checked: !!this.props.value,
        value: 1
      };
    }
  }, {
    key: 'render',
    value: function render() {
      var labelText = this.props.leftTitle !== null ? this.props.leftTitle : this.props.title;

      var Option = null;

      switch (this.props.type) {
        case 'checkbox':
          Option = _reactBootstrapSs.Checkbox;
          break;
        case 'radio':
          Option = _reactBootstrapSs.Radio;
          break;
        default:
          throw new Error('Invalid OptionField type: ' + this.props.type);
      }

      var label = typeof labelText === 'string' ? { react: _react2.default.createElement(
          'span',
          null,
          labelText
        ) } : labelText;

      return (0, _castStringToElement2.default)(Option, label, this.getInputProps());
    }
  }]);

  return OptionField;
}(_SilverStripeComponent2.default);

OptionField.propTypes = {
  type: _react2.default.PropTypes.oneOf(['checkbox', 'radio']),
  leftTitle: _react2.default.PropTypes.any,
  title: _react2.default.PropTypes.any,
  extraClass: _react2.default.PropTypes.string,
  id: _react2.default.PropTypes.string,
  name: _react2.default.PropTypes.string.isRequired,
  onChange: _react2.default.PropTypes.func,
  value: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.string, _react2.default.PropTypes.number, _react2.default.PropTypes.bool]),
  readOnly: _react2.default.PropTypes.bool,
  disabled: _react2.default.PropTypes.bool
};

OptionField.defaultProps = {
  extraClass: '',
  className: '',
  type: 'radio',
  leftTitle: null
};

exports.default = OptionField;

/***/ }),

/***/ 258:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _buildInjectorContainer = __webpack_require__(959);

var _buildInjectorContainer2 = _interopRequireDefault(_buildInjectorContainer);

var _buildComponentContainer = __webpack_require__(957);

var _buildComponentContainer2 = _interopRequireDefault(_buildComponentContainer);

var _buildReducerContainer = __webpack_require__(960);

var _buildReducerContainer2 = _interopRequireDefault(_buildReducerContainer);

var _buildFormContainer = __webpack_require__(958);

var _buildFormContainer2 = _interopRequireDefault(_buildFormContainer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Injector = (0, _buildInjectorContainer2.default)();

Injector.register('component', (0, _buildComponentContainer2.default)());
Injector.register('reducer', (0, _buildReducerContainer2.default)());
Injector.register('form', (0, _buildFormContainer2.default)());

exports.default = Injector;

/***/ }),

/***/ 259:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _MiddlewareRegistry = __webpack_require__(404);

var _MiddlewareRegistry2 = _interopRequireDefault(_MiddlewareRegistry);

var _redux = __webpack_require__(41);

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
      this.factories = Object.entries(this.services).reduce(function (factories, _ref) {
        var _ref2 = _slicedToArray(_ref, 2),
            key = _ref2[0],
            service = _ref2[1];

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
          return service;
        }));
      }, {});

      this.initialised = true;
    },
    register: function register(key, value) {
      var _ref3 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
          force = _ref3.force;

      this.isProtected();

      if (this.services[key] && force !== true) {
        throw new Error('\n      Tried to register service ' + key + ' more than once. This practice is discouraged. Consider\n      using Injector.update() to enhance the service rather than override it completely.\n      Otherwise, invoke the register() function with { force: true } as the third argument.\n     ');
      }
      this.services = _extends({}, this.services, _defineProperty({}, key, value));
    },
    registerMany: function registerMany(map) {
      var _ref4 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
          force = _ref4.force;

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

/***/ 38:
/***/ (function(module, exports) {

module.exports = ReactBootstrap;

/***/ }),

/***/ 391:
/***/ (function(module, exports) {

module.exports = FormAlert;

/***/ }),

/***/ 392:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(jQuery) {

var _jQuery = __webpack_require__(16);

var _jQuery2 = _interopRequireDefault(_jQuery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

__webpack_require__(154);

_jQuery2.default.widget("ssui.ssdialog", _jQuery2.default.ui.dialog, {
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
    _jQuery2.default.ui.dialog.prototype._create.call(this);

    var self = this;

    var iframe = (0, _jQuery2.default)('<iframe marginWidth="0" marginHeight="0" frameBorder="0" scrolling="auto"></iframe>');
    iframe.bind('load', function (e) {
      if ((0, _jQuery2.default)(this).attr('src') == 'about:blank') return;

      iframe.addClass('loaded').show();
      self._resizeIframe();
      self.uiDialog.removeClass('loading');
    }).hide();

    if (this.options.dialogExtraClass) this.uiDialog.addClass(this.options.dialogExtraClass);
    this.element.append(iframe);

    if (this.options.iframeUrl) this.element.css('overflow', 'hidden');
  },
  open: function open() {
    _jQuery2.default.ui.dialog.prototype.open.call(this);

    var self = this,
        iframe = this.element.children('iframe');

    if (this.options.iframeUrl && (!iframe.hasClass('loaded') || this.options.reloadOnOpen)) {
      iframe.hide();
      iframe.attr('src', this.options.iframeUrl);
      this.uiDialog.addClass('loading');
    }

    (0, _jQuery2.default)(window).bind('resize.ssdialog', function () {
      self._resizeIframe();
    });
  },
  close: function close() {
    _jQuery2.default.ui.dialog.prototype.close.call(this);

    this.uiDialog.unbind('resize.ssdialog');
    (0, _jQuery2.default)(window).unbind('resize.ssdialog');
  },
  _resizeIframe: function _resizeIframe() {
    var opts = {},
        newWidth,
        newHeight,
        iframe = this.element.children('iframe');;
    if (this.options.widthRatio) {
      newWidth = (0, _jQuery2.default)(window).width() * this.options.widthRatio;
      if (this.options.minWidth && newWidth < this.options.minWidth) {
        opts.width = this.options.minWidth;
      } else if (this.options.maxWidth && newWidth > this.options.maxWidth) {
        opts.width = this.options.maxWidth;
      } else {
        opts.width = newWidth;
      }
    }
    if (this.options.heightRatio) {
      newHeight = (0, _jQuery2.default)(window).height() * this.options.heightRatio;
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

_jQuery2.default.widget("ssui.titlebar", {
  _create: function _create() {
    this.originalTitle = this.element.attr('title');

    var self = this;
    var options = this.options;

    var title = options.title || this.originalTitle || '&nbsp;';
    var titleId = _jQuery2.default.ui.dialog.getTitleId(this.element);

    this.element.parent().addClass('ui-dialog');

    var uiDialogTitlebar = this.element.addClass('ui-dialog-titlebar ' + 'ui-widget-header ' + 'ui-corner-all ' + 'ui-helper-clearfix');

    if (options.closeButton) {
      var uiDialogTitlebarClose = (0, _jQuery2.default)('<a href="#"/>').addClass('ui-dialog-titlebar-close ' + 'ui-corner-all').attr('role', 'button').hover(function () {
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

      var uiDialogTitlebarCloseText = (this.uiDialogTitlebarCloseText = (0, _jQuery2.default)('<span/>')).addClass('ui-icon ' + 'ui-icon-closethick').text(options.closeText).appendTo(uiDialogTitlebarClose);
    }

    var uiDialogTitle = (0, _jQuery2.default)('<span/>').addClass('ui-dialog-title').attr('id', titleId).html(title).prependTo(uiDialogTitlebar);

    uiDialogTitlebar.find("*").add(uiDialogTitlebar).disableSelection();
  },

  destroy: function destroy() {
    this.element.unbind('.dialog').removeData('dialog').removeClass('ui-dialog-content ui-widget-content').hide().appendTo('body');

    this.originalTitle && this.element.attr('title', this.originalTitle);
  }
});

_jQuery2.default.extend(_jQuery2.default.ssui.titlebar, {
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
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(27)))

/***/ }),

/***/ 401:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _SilverStripeComponent = __webpack_require__(13);

var _SilverStripeComponent2 = _interopRequireDefault(_SilverStripeComponent);

var _castStringToElement = __webpack_require__(86);

var _castStringToElement2 = _interopRequireDefault(_castStringToElement);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CompositeField = function (_SilverStripeComponen) {
  _inherits(CompositeField, _SilverStripeComponen);

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
}(_SilverStripeComponent2.default);

CompositeField.propTypes = {
  data: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.array, _react2.default.PropTypes.shape({
    tag: _react2.default.PropTypes.string,
    legend: _react2.default.PropTypes.string
  })]),
  extraClass: _react2.default.PropTypes.string
};

CompositeField.defaultProps = {
  className: '',
  extraClass: ''
};

exports.default = CompositeField;

/***/ }),

/***/ 402:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TextField = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _SilverStripeComponent = __webpack_require__(13);

var _SilverStripeComponent2 = _interopRequireDefault(_SilverStripeComponent);

var _FieldHolder = __webpack_require__(44);

var _FieldHolder2 = _interopRequireDefault(_FieldHolder);

var _reactBootstrapSs = __webpack_require__(38);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TextField = function (_SilverStripeComponen) {
  _inherits(TextField, _SilverStripeComponen);

  function TextField(props) {
    _classCallCheck(this, TextField);

    var _this = _possibleConstructorReturn(this, (TextField.__proto__ || Object.getPrototypeOf(TextField)).call(this, props));

    _this.handleChange = _this.handleChange.bind(_this);
    return _this;
  }

  _createClass(TextField, [{
    key: 'render',
    value: function render() {
      return _react2.default.createElement(_reactBootstrapSs.FormControl, this.getInputProps());
    }
  }, {
    key: 'getInputProps',
    value: function getInputProps() {
      var props = {
        bsClass: this.props.bsClass,
        className: this.props.className + ' ' + this.props.extraClass,
        id: this.props.id,
        name: this.props.name,
        disabled: this.props.disabled,
        readOnly: this.props.readOnly,
        value: this.props.value,
        placeholder: this.props.placeholder,
        autoFocus: this.props.autoFocus
      };

      if (this.isMultiline()) {
        Object.assign(props, {
          componentClass: 'textarea',
          rows: this.props.data.rows,
          cols: this.props.data.columns
        });
      } else {
        Object.assign(props, {
          componentClass: 'input',
          type: this.props.type ? this.props.type : null
        });
      }

      if (!this.props.readOnly) {
        Object.assign(props, {
          onChange: this.handleChange
        });
      }

      return props;
    }
  }, {
    key: 'isMultiline',
    value: function isMultiline() {
      return this.props.data && this.props.data.rows > 1;
    }
  }, {
    key: 'handleChange',
    value: function handleChange(event) {
      if (typeof this.props.onChange === 'function') {
        this.props.onChange(event, { id: this.props.id, value: event.target.value });
      }
    }
  }]);

  return TextField;
}(_SilverStripeComponent2.default);

TextField.propTypes = {
  extraClass: _react2.default.PropTypes.string,
  id: _react2.default.PropTypes.string,
  name: _react2.default.PropTypes.string.isRequired,
  onChange: _react2.default.PropTypes.func,
  value: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.string, _react2.default.PropTypes.number]),
  readOnly: _react2.default.PropTypes.bool,
  disabled: _react2.default.PropTypes.bool,
  placeholder: _react2.default.PropTypes.string,
  type: _react2.default.PropTypes.string,
  autoFocus: _react2.default.PropTypes.bool
};

TextField.defaultProps = {
  value: '',
  extraClass: '',
  className: '',
  type: 'text'
};

exports.TextField = TextField;
exports.default = (0, _FieldHolder2.default)(TextField);

/***/ }),

/***/ 403:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _i18n = __webpack_require__(23);

var _i18n2 = _interopRequireDefault(_i18n);

var _classnames = __webpack_require__(4);

var _classnames2 = _interopRequireDefault(_classnames);

var _TreeDropdownFieldNode = __webpack_require__(188);

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
          onClick: this.handleBack
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

      var isSelected = this.props.value.includes(tree.id);
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
      if (this.props.loading) {
        return _react2.default.createElement(
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
        );
      }
      if (this.props.failed) {
        return _react2.default.createElement(
          'div',
          { className: 'Select-option' },
          _i18n2.default._t('Admin.TREEDROPDOWN_FAILED', 'Failed to load')
        );
      }
      if (this.props.tree.count === 0) {
        return _react2.default.createElement(
          'div',
          { className: 'Select-option' },
          _i18n2.default._t('Admin.TREEDROPDOWN_NO_CHILDREN', 'No children')
        );
      }

      var breadcrumbs = this.renderBreadcrumbs();
      var options = this.props.renderMenuOptions && this.props.renderMenuOptions.options;

      var children = options ? options.filter(function (option) {
        return option.title !== null;
      }).map(this.renderOption) : null;

      return _react2.default.createElement(
        'div',
        { className: 'treedropdownfield__menu' },
        breadcrumbs,
        children
      );
    }
  }]);

  return TreeDropdownFieldMenu;
}(_react.Component);

TreeDropdownFieldMenu.propTypes = {
  className: _react.PropTypes.string,
  breadcrumbs: _react.PropTypes.arrayOf(_react.PropTypes.shape(_TreeDropdownFieldNode2.default.propTypes)),
  loading: _react.PropTypes.bool,
  failed: _react.PropTypes.bool,
  tree: _react.PropTypes.shape(_TreeDropdownFieldNode2.default.propTypes),
  renderMenuOptions: _react.PropTypes.object,
  onBack: _react.PropTypes.func,
  search: _react.PropTypes.bool,
  value: _react.PropTypes.array
};

exports.default = TreeDropdownFieldMenu;

/***/ }),

/***/ 404:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GLOBAL_CONTEXT = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _toposort = __webpack_require__(1842);

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

/***/ 405:
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

var _injectorContext = __webpack_require__(406);

var _injectorContext2 = _interopRequireDefault(_injectorContext);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var inject = function inject(dependencies, mapDependenciesToProps, getContext) {
  return function (Component) {
    if (dependencies && !Array.isArray(dependencies)) {
      throw new Error('\n      withInjector() passed an argument for dependencies that is ' + (typeof deps === 'undefined' ? 'undefined' : _typeof(deps)) + '. \n      Must be a string or array of named dependencies.\n    ');
    }

    if (mapDependenciesToProps && typeof mapDependenciesToProps !== 'function') {
      throw new Error('\n      Second parameter of inject() [mapDependenciesToProps] must be a function, taking the resolved\n      dependencies as enumerated arguments, and returning a map of prop names to dependencies.\n    ');
    }

    if (getContext && typeof getContext !== 'function') {
      throw new Error('\n      Third parameter of inject() [getContext] must be a function, taking the component\'s props\n      as the single parameter, and returning a string representing the Injector\n      context to use throughout the component.\n    ');
    }

    var Injected = function (_React$Component) {
      _inherits(Injected, _React$Component);

      function Injected() {
        _classCallCheck(this, Injected);

        return _possibleConstructorReturn(this, (Injected.__proto__ || Object.getPrototypeOf(Injected)).apply(this, arguments));
      }

      _createClass(Injected, [{
        key: 'render',
        value: function render() {
          var _this2 = this;

          var props = {};
          var context = getContext ? getContext(this.props) : null;
          if (dependencies) {
            var resolved = dependencies.map(function (dep) {
              return _this2.context.injector.get(dep, context);
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
          var newProps = _extends({}, this.props, props);
          return _react2.default.createElement(Component, newProps);
        }
      }]);

      return Injected;
    }(_react2.default.Component);

    Injected.contextTypes = _injectorContext2.default;
    Injected.displayName = 'inject(\n    ' + (Component.displayName || Component.name || 'Component') + '\n  )';

    return Injected;
  };
};

exports.default = inject;

/***/ }),

/***/ 406:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  injector: _react2.default.PropTypes.shape({
    get: _react2.default.PropTypes.func
  })
};

/***/ }),

/***/ 407:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _Container = __webpack_require__(258);

var _Container2 = _interopRequireDefault(_Container);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function provideInjector(Component) {
  var InjectorProvider = function (_React$Component) {
    _inherits(InjectorProvider, _React$Component);

    function InjectorProvider() {
      _classCallCheck(this, InjectorProvider);

      return _possibleConstructorReturn(this, (InjectorProvider.__proto__ || Object.getPrototypeOf(InjectorProvider)).apply(this, arguments));
    }

    _createClass(InjectorProvider, [{
      key: 'getChildContext',
      value: function getChildContext() {
        var component = _Container2.default.component,
            form = _Container2.default.form;
        var get = component.get;


        return {
          injector: {
            get: get.bind(component),
            validate: form.getValidation.bind(form)
          }
        };
      }
    }, {
      key: 'render',
      value: function render() {
        return _react2.default.createElement(Component, this.props);
      }
    }]);

    return InjectorProvider;
  }(_react2.default.Component);

  InjectorProvider.childContextTypes = {
    injector: _react2.default.PropTypes.shape({
      get: _react2.default.PropTypes.func
    })
  };

  return InjectorProvider;
}

exports.default = provideInjector;

/***/ }),

/***/ 408:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _injectorContext = __webpack_require__(406);

var _injectorContext2 = _interopRequireDefault(_injectorContext);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var withInjector = function withInjector(Component) {
  Component.contextTypes = _extends({}, Component.contextTypes, _injectorContext2.default);

  Component.displayName = 'withInjector(\n    ' + (Component.displayName || Component.name || 'Component') + '\n  )';

  return Component;
};

exports.default = withInjector;

/***/ }),

/***/ 409:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  SET_BREADCRUMBS: 'SET_BREADCRUMBS'
};

/***/ }),

/***/ 410:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  SET_CONFIG: 'SET_CONFIG'
};

/***/ }),

/***/ 411:
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

/***/ 412:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toggleMobileMenu = toggleMobileMenu;
exports.openMobileMenu = openMobileMenu;
exports.closeMobileMenu = closeMobileMenu;

var _MobileMenuActionTypes = __webpack_require__(411);

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

/***/ 413:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  CREATE_RECORD: 'CREATE_RECORD',
  UPDATE_RECORD: 'UPDATE_RECORD',
  DELETE_RECORD: 'DELETE_RECORD',
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

/***/ 414:
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

/***/ 415:
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

/***/ 416:
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

var _TreeDropdownFieldActionTypes = __webpack_require__(415);

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

/***/ 417:
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

/***/ 44:
/***/ (function(module, exports) {

module.exports = FieldHolder;

/***/ }),

/***/ 45:
/***/ (function(module, exports) {

module.exports = Injector;

/***/ }),

/***/ 762:
/***/ (function(module, exports) {

module.exports = Config;

/***/ }),

/***/ 763:
/***/ (function(module, exports) {

module.exports = FormBuilderModal;

/***/ }),

/***/ 764:
/***/ (function(module, exports) {

module.exports = ReactRouterRedux;

/***/ }),

/***/ 765:
/***/ (function(module, exports) {

module.exports = ReactSelect;

/***/ }),

/***/ 766:
/***/ (function(module, exports) {

module.exports = getFormState;

/***/ }),

/***/ 767:
/***/ (function(module, exports) {

module.exports = schemaFieldValues;

/***/ }),

/***/ 768:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _BootRoutes = __webpack_require__(907);

var _BootRoutes2 = _interopRequireDefault(_BootRoutes);

var _Injector = __webpack_require__(45);

var _Injector2 = _interopRequireDefault(_Injector);

var _redux = __webpack_require__(41);

var _reduxThunk = __webpack_require__(1906);

var _reduxThunk2 = _interopRequireDefault(_reduxThunk);

var _Config = __webpack_require__(762);

var _Config2 = _interopRequireDefault(_Config);

var _buildApolloClient = __webpack_require__(909);

var _buildApolloClient2 = _interopRequireDefault(_buildApolloClient);

var _ConfigActions = __webpack_require__(963);

var _registerComponents = __webpack_require__(910);

var _registerComponents2 = _interopRequireDefault(_registerComponents);

var _registerReducers = __webpack_require__(911);

var _registerReducers2 = _interopRequireDefault(_registerReducers);

var _applyDevtools = __webpack_require__(908);

var _applyDevtools2 = _interopRequireDefault(_applyDevtools);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

window.ss = window.ss || {};

function appBoot() {
  var baseUrl = _Config2.default.get('absoluteBaseUrl');
  var apolloClient = (0, _buildApolloClient2.default)(baseUrl);
  var apolloReducer = apolloClient.reducer();

  (0, _registerComponents2.default)();
  (0, _registerReducers2.default)({
    apollo: apolloReducer
  });
  var middleware = [_reduxThunk2.default, apolloClient.middleware()];
  var debugging = _Config2.default.get('debugging');
  var runMiddleware = _redux.applyMiddleware.apply(undefined, middleware);

  if (debugging) {
    runMiddleware = (0, _applyDevtools2.default)(runMiddleware);
  }

  var createStoreWithMiddleware = runMiddleware(_redux.createStore);

  var rootReducer = (0, _redux.combineReducers)(_Injector2.default.reducer.getAll());
  var store = createStoreWithMiddleware(rootReducer, {});

  store.dispatch((0, _ConfigActions.setConfig)(_Config2.default.getAll()));
  _Injector2.default.reducer.setStore(store);

  window.ss.store = store;
  window.ss.apolloClient = apolloClient;

  if (window.jQuery) {
    window.jQuery('body').addClass('js-react-boot');
  }

  var routes = new _BootRoutes2.default(store, apolloClient);

  window.setTimeout(function () {
    _Injector2.default.load();
    routes.start(window.location.pathname);

    var newReducer = (0, _redux.combineReducers)(_Injector2.default.reducer.getAll());
    store.replaceReducer(newReducer);
  }, 0);
}
window.onload = appBoot;

/***/ }),

/***/ 770:
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
			var langName = this.getLocale().replace(/_[\w]+/i, '');
			var defaultlangName = this.defaultLocale.replace(/_[\w]+/i, '');

			if (this.lang && this.lang[this.getLocale()] && this.lang[this.getLocale()][entity]) {
				return this.lang[this.getLocale()][entity];
			} else if (this.lang && this.lang[langName] && this.lang[langName][entity]) {
				return this.lang[langName][entity];
			} else if (this.lang && this.lang[this.defaultLocale] && this.lang[this.defaultLocale][entity]) {
				return this.lang[this.defaultLocale][entity];
			} else if (this.lang && this.lang[defaultlangName] && this.lang[defaultlangName][entity]) {
				return this.lang[defaultlangName][entity];
			} else if (fallbackString) {
				return fallbackString;
			} else {
				return '';
			}
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
			var rawLocale;
			var detectedLocale;

			rawLocale = document.body.getAttribute('lang');

			if (!rawLocale) {
				var metas = document.getElementsByTagName('meta');

				for (var i = 0; i < metas.length; i++) {
					if (metas[i].attributes['http-equiv'] && metas[i].attributes['http-equiv'].nodeValue.toLowerCase() == 'content-language') {
						rawLocale = metas[i].attributes['content'].nodeValue;
					}
				}
			}

			if (!rawLocale) {
				rawLocale = this.defaultLocale;
			}

			var rawLocaleParts = rawLocale.match(/([^-|_]*)[-|_](.*)/);

			if (rawLocale.length == 2) {
				for (var compareLocale in i18n.lang) {
					if (compareLocale.substr(0, 2).toLowerCase() == rawLocale.toLowerCase()) {
						detectedLocale = compareLocale;
						break;
					}
				}
			} else if (rawLocaleParts) {
				detectedLocale = rawLocaleParts[1].toLowerCase() + '_' + rawLocaleParts[2].toUpperCase();
			}

			return detectedLocale;
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

/***/ 771:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _jQuery = __webpack_require__(16);

var _jQuery2 = _interopRequireDefault(_jQuery);

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _reactDom = __webpack_require__(26);

var _reactDom2 = _interopRequireDefault(_reactDom);

var _reactRedux = __webpack_require__(42);

var _Injector = __webpack_require__(45);

var _FormBuilderModal = __webpack_require__(763);

var _FormBuilderModal2 = _interopRequireDefault(_FormBuilderModal);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var InjectableFormBuilderModal = (0, _Injector.provideInjector)(_FormBuilderModal2.default);

_jQuery2.default.entwine('ss', function ($) {
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
    _renderModal: function _renderModal(show) {
      var _this = this;

      var handleHide = function handleHide() {
        return _this.close();
      };
      var handleSubmit = function handleSubmit() {
        return _this._handleSubmitModal.apply(_this, arguments);
      };
      var id = $('form.cms-edit-form :input[name=ID]').val();
      var store = window.ss.store;
      var sectionConfigKey = 'SilverStripe\\CMS\\Controllers\\CMSPageEditController';
      var sectionConfig = store.getState().config.sections.find(function (section) {
        return section.name === sectionConfigKey;
      });
      var modalSchemaUrl = sectionConfig.form.AddToCampaignForm.schemaUrl + '/' + id;

      _reactDom2.default.render(_react2.default.createElement(
        _reactRedux.Provider,
        { store: store },
        _react2.default.createElement(InjectableFormBuilderModal, {
          title: 'Add to campaign',
          show: show,
          handleSubmit: handleSubmit,
          handleHide: handleHide,
          schemaUrl: modalSchemaUrl,
          bodyClassName: 'modal__dialog',
          className: 'add-to-campaign-modal',
          responseClassBad: 'modal__response modal__response--error',
          responseClassGood: 'modal__response modal__response--good',
          identifier: 'Admin.AddToCampaign'
        })
      ), this[0]);
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

/***/ 772:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _jQuery = __webpack_require__(16);

var _jQuery2 = _interopRequireDefault(_jQuery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _jQuery2.default)(document).on('click', '.confirmedpassword .showOnClick a', function () {
	var $container = (0, _jQuery2.default)('.showOnClickContainer', (0, _jQuery2.default)(this).parent());

	$container.toggle('fast', function () {
		$container.find('input[type="hidden"]').val($container.is(":visible") ? 1 : 0);
	});

	return false;
});

/***/ }),

/***/ 773:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _jQuery = __webpack_require__(16);

var _jQuery2 = _interopRequireDefault(_jQuery);

var _i18n = __webpack_require__(23);

var _i18n2 = _interopRequireDefault(_i18n);

var _moment = __webpack_require__(181);

var _moment2 = _interopRequireDefault(_moment);

var _modernizr = __webpack_require__(180);

var _modernizr2 = _interopRequireDefault(_modernizr);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

__webpack_require__(125);

_jQuery2.default.entwine('ss', function (jQuery) {
  jQuery('input[type=datetime-local]').entwine({
    onadd: function onadd() {
      if (_modernizr2.default.inputtypes['datetime-local']) {
        return;
      }

      if (this.prop('disabled') || this.prop('readonly') || this.hasClass('hasDatepicker')) {
        return;
      }

      var hiddenInput = jQuery('<input/>', { type: 'hidden', name: this.attr('name'), value: this.val() });
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

/***/ 774:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _jQuery = __webpack_require__(16);

var _jQuery2 = _interopRequireDefault(_jQuery);

var _i18n = __webpack_require__(23);

var _i18n2 = _interopRequireDefault(_i18n);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

__webpack_require__(154);
__webpack_require__(125);

_jQuery2.default.entwine('ss', function ($) {
  $('.grid-field').entwine({

    reload: function reload(ajaxOpts, successCallback) {
      var self = this,
          form = this.closest('form'),
          focusedElName = this.find(':input:focus').attr('name'),
          data = form.find(':input').serializeArray();

      if (!ajaxOpts) ajaxOpts = {};
      if (!ajaxOpts.data) ajaxOpts.data = [];
      ajaxOpts.data = ajaxOpts.data.concat(data);

      if (window.location.search) {
        ajaxOpts.data = window.location.search.replace(/^\?/, '') + '&' + $.param(ajaxOpts.data);
      }

      form.addClass('loading');

      $.ajax($.extend({}, {
        headers: { "X-Pjax": 'CurrentField' },
        type: "POST",
        url: this.data('url'),
        dataType: 'html',
        success: function success(data) {
          self.empty().append($(data).children());

          if (focusedElName) self.find(':input[name="' + focusedElName + '"]').focus();

          if (self.find('.filter-header').length) {
            var content;
            if (ajaxOpts.data[0].filter == "show") {
              content = '<span class="non-sortable"></span>';
              self.addClass('show-filter').find('.filter-header').show();
            } else {
              content = '<button type="button" title="Open search and filter" name="showFilter" class="btn btn-secondary font-icon-search btn--no-text btn--icon-large grid-field__filter-open"></button>';
              self.removeClass('show-filter').find('.filter-header').hide();
            }

            self.find('.sortable-header th:last').html(content);
          }

          form.removeClass('loading');
          if (successCallback) successCallback.apply(this, arguments);
          self.trigger('reload', self);
        },
        error: function error(e) {
          alert(_i18n2.default._t('Admin.ERRORINTRANSACTION'));
          form.removeClass('loading');
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
    }
  });

  $('.grid-field *').entwine({
    getGridField: function getGridField() {
      return this.closest('.grid-field');
    }
  });

  $('.grid-field :button[name=showFilter]').entwine({
    onclick: function onclick(e) {
      this.closest('.grid-field__table').find('.filter-header').show().find(':input:first').focus();

      this.closest('.grid-field').addClass('show-filter');
      this.parent().html('<span class="non-sortable"></span>');
      e.preventDefault();
    }
  });

  $('.grid-field .ss-gridfield-item').entwine({
    onclick: function onclick(e) {
      if ($(e.target).closest('.action').length) {
        this._super(e);
        return false;
      }

      var editLink = this.find('.edit-link');
      if (editLink.length) this.getGridField().showDetailView(editLink.prop('href'));
    },
    onmouseover: function onmouseover() {
      if (this.find('.edit-link').length) this.css('cursor', 'pointer');
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

      modal.find('[data-dismiss]').on('click', function () {
        backdrop.removeClass('in');
        modal.removeClass('in');
        setTimeout(function () {
          backdrop.remove();
        }, 150);
      });

      setTimeout(function () {
        backdrop.addClass('in');
        modal.addClass('in');
      }, 0);
    }
  });

  $('.grid-field .action:button').entwine({
    onclick: function onclick(e) {
      var filterState = 'show';
      if (this.is(':disabled')) {
        e.preventDefault();
        return;
      }

      if (this.hasClass('ss-gridfield-button-close') || !this.closest('.grid-field').hasClass('show-filter')) {
        filterState = 'hidden';
      }

      this.getGridField().reload({
        data: [{ name: this.attr('name'), value: this.val(), filter: filterState }]
      });

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

  $('.grid-field .grid-field__col-compact .action.gridfield-button-delete, .cms-edit-form .btn-toolbar button.action.action-delete').entwine({
    onclick: function onclick(e) {
      if (!confirm(_i18n2.default._t('Admin.DELETECONFIRMMESSAGE'))) {
        e.preventDefault();
        return false;
      } else {
        this._super(e);
      }
    }
  });

  $('.grid-field .grid-print-button .action:button').entwine({
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

  $('.grid-field .filter-header :input').entwine({
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
        var btns = this.closest('.filter-header').find('.ss-gridfield-button-filter');
        var filterState = 'show';
        if (this.hasClass('ss-gridfield-button-close') || !this.closest('.grid-field').hasClass('show-filter')) {
          filterState = 'hidden';
        }

        this.getGridField().reload({ data: [{ name: btns.attr('name'), value: btns.val(), filter: filterState }] });
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
          var hiddenField = $('<input type="hidden" name="relationID" class="action_gridfield_relationfind" />');
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

/***/ 775:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _jquery = __webpack_require__(27);

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
      var instance = this.getInstance();
      instance.save();

      (0, _jquery2.default)(instance.getElement()).trigger("change");
    },

    create: function create() {
      var config = this.getConfig();

      if (typeof config.baseURL !== 'undefined') {
        tinymce.EditorManager.baseURL = config.baseURL;
      }
      tinymce.init(config);
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

    insertLink: function insertLink(attrs, opts) {
      this.getInstance().execCommand("mceInsertLink", false, attrs, opts);
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

    onremove: function onremove() {
      this.getEditor().destroy();
      this._super();
    },

    'from .cms-edit-form': {
      onbeforesubmitform: function onbeforesubmitform() {
        this.getEditor().save();
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
          dialog = $('<div id="insert-media-react__dialog-wrapper" />');
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

/***/ }),

/***/ 776:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _jQuery = __webpack_require__(16);

var _jQuery2 = _interopRequireDefault(_jQuery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_jQuery2.default.entwine('ss', function ($) {
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

/***/ 777:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(jQuery) {

var _jQuery = __webpack_require__(16);

var _jQuery2 = _interopRequireDefault(_jQuery);

var _i18n = __webpack_require__(23);

var _i18n2 = _interopRequireDefault(_i18n);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_jQuery2.default.entwine('ss.tree', function ($) {
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
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(27)))

/***/ }),

/***/ 778:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _jQuery = __webpack_require__(16);

var _jQuery2 = _interopRequireDefault(_jQuery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_jQuery2.default.entwine('ss', function ($) {
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

  $('.cms-content .cms-content-header, .cms-content .cms-content-actions').entwine({
    redraw: function redraw() {
      if (window.debug) console.log('redraw', this.attr('class'), this.get(0));

      this.height('auto');
      this.height(this.innerHeight() - this.css('padding-top') - this.css('padding-bottom'));
    }
  });
});

/***/ }),

/***/ 779:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(jQuery) {

var _jQuery = __webpack_require__(16);

var _jQuery2 = _interopRequireDefault(_jQuery);

var _i18n = __webpack_require__(23);

var _i18n2 = _interopRequireDefault(_i18n);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var currBeforeUnload = window.onbeforeunload;

window.onbeforeunload = function (e) {
  var form = (0, _jQuery2.default)('.cms-edit-form');
  form.trigger('beforesubmitform');
  if (form.is('.changed') && !form.is('.discardchanges')) {
    return _i18n2.default._t('Admin.CONFIRMUNSAVEDSHORT');
  }

  if (typeof currBeforeUnload === 'function') {
    return currBeforeUnload();
  }

  return undefined;
};

_jQuery2.default.entwine('ss', function ($) {
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
      var list = holder.next().filter('.listbox');
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
      var list = holder.next().filter('.listbox');
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
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(27)))

/***/ }),

/***/ 780:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _jQuery = __webpack_require__(16);

var _jQuery2 = _interopRequireDefault(_jQuery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_jQuery2.default.entwine('ss', function ($) {

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

/***/ 781:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _jQuery = __webpack_require__(16);

var _jQuery2 = _interopRequireDefault(_jQuery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_jQuery2.default.entwine('ss', function ($) {
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

/***/ 782:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _jQuery = __webpack_require__(16);

var _jQuery2 = _interopRequireDefault(_jQuery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_jQuery2.default.entwine('ss', function ($) {
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

  $('.cms-menu .sticky-toggle').entwine({

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
      this.next('.sticky-status-indicator').text(isSticky ? 'fixed' : 'auto');
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
});

/***/ }),

/***/ 783:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _jQuery = __webpack_require__(16);

var _jQuery2 = _interopRequireDefault(_jQuery);

var _MobileMenuToggleContainer = __webpack_require__(933);

var _MobileMenuToggleContainer2 = _interopRequireDefault(_MobileMenuToggleContainer);

var _MobileMenuActions = __webpack_require__(412);

var _reactDom = __webpack_require__(26);

var _reactDom2 = _interopRequireDefault(_reactDom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_jQuery2.default.entwine('ss', function ($) {

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

/***/ 784:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _jQuery = __webpack_require__(16);

var _jQuery2 = _interopRequireDefault(_jQuery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_jQuery2.default.entwine('ss', function ($) {
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

/***/ 785:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _jQuery = __webpack_require__(16);

var _jQuery2 = _interopRequireDefault(_jQuery);

var _i18n = __webpack_require__(23);

var _i18n2 = _interopRequireDefault(_i18n);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_jQuery2.default.entwine('ss.preview', function ($) {
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
        url += (url.indexOf('?') === -1 ? '?' : '&') + 'CMSPreview=1';
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

/***/ 786:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _jQuery = __webpack_require__(16);

var _jQuery2 = _interopRequireDefault(_jQuery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_jQuery2.default.entwine('ss.tree', function ($) {

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
        var id = $('.cms-edit-form :input[name=ID]').val();

        this.updateNodesFromServer([id]);
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
      if (this.getIsUpdatingTree() || !this.getIsLoaded()) return;

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

      $.ajax({
        url: $.path.addSearchParams(this.data('urlUpdatetreenodes'), 'ids=' + ids.join(',')),
        dataType: 'json',
        success: function success(data, xhr) {
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

/***/ 787:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _jQuery = __webpack_require__(16);

var _jQuery2 = _interopRequireDefault(_jQuery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_jQuery2.default.entwine('ss', function ($) {
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

/***/ 788:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _jQuery = __webpack_require__(16);

var _jQuery2 = _interopRequireDefault(_jQuery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

__webpack_require__(250);

_jQuery2.default.entwine('ss', function ($) {
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

/***/ 789:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _jQuery = __webpack_require__(16);

var _jQuery2 = _interopRequireDefault(_jQuery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

__webpack_require__(250);
__webpack_require__(946);

var refreshAfterImport = function refreshAfterImport(e) {
  var existingFormMessage = (0, _jQuery2.default)((0, _jQuery2.default)(this).contents()).find('.message');
  if (existingFormMessage && existingFormMessage.html()) {
    var memberTableField = (0, _jQuery2.default)(window.parent.document).find('#Form_EditForm_Members').get(0);
    if (memberTableField) memberTableField.refresh();

    var tree = (0, _jQuery2.default)(window.parent.document).find('.cms-tree').get(0);
    if (tree) tree.reload();
  }
};

(0, _jQuery2.default)('#MemberImportFormIframe, #GroupImportFormIframe').entwine({
  onadd: function onadd() {
    this._super();

    (0, _jQuery2.default)(this).bind('load', refreshAfterImport);
  }
});

_jQuery2.default.entwine('ss', function ($) {
  $('.permissioncheckboxset .checkbox[value=ADMIN]').entwine({
    onmatch: function onmatch() {
      this.toggleCheckboxes();

      this._super();
    },
    onunmatch: function onunmatch() {
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

/***/ 790:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _jQuery = __webpack_require__(16);

var _jQuery2 = _interopRequireDefault(_jQuery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _jQuery2.default)(document).ready(function () {
  (0, _jQuery2.default)('ul.SelectionGroup input.selector, ul.selection-group input.selector').live('click', function () {
    var li = (0, _jQuery2.default)(this).closest('li');
    li.addClass('selected');

    var prev = li.prevAll('li.selected');
    if (prev.length) {
      prev.removeClass('selected');
    }
    var next = li.nextAll('li.selected');
    if (next.length) {
      next.removeClass('selected');
    }

    (0, _jQuery2.default)(this).focus();
  });
});

/***/ }),

/***/ 791:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _jQuery = __webpack_require__(16);

var _jQuery2 = _interopRequireDefault(_jQuery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

__webpack_require__(154);
__webpack_require__(393);
__webpack_require__(125);

_jQuery2.default.entwine('ss', function ($) {
	$('.ss-tabset').entwine({
		IgnoreTabState: false,

		onadd: function onadd() {
			var hash = window.location.hash;

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

/***/ 792:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _jQuery = __webpack_require__(16);

var _jQuery2 = _interopRequireDefault(_jQuery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

__webpack_require__(154);

_jQuery2.default.entwine('ss', function ($) {
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

/***/ 793:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(jQuery) {

var _jQuery = __webpack_require__(16);

var _jQuery2 = _interopRequireDefault(_jQuery);

var _i18n = __webpack_require__(23);

var _i18n2 = _interopRequireDefault(_i18n);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

__webpack_require__(125);
__webpack_require__(394);

_jQuery2.default.entwine('ss', function ($) {
	var windowWidth, windowHeight;
	$(window).bind('resize.treedropdownfield', function () {
		var cb = function cb() {
			$('.TreeDropdownField').closePanel();
		};

		if ($.browser.msie && parseInt($.browser.version, 10) < 9) {
			var newWindowWidth = $(window).width(),
			    newWindowHeight = $(window).height();
			if (newWindowWidth != windowWidth || newWindowHeight != windowHeight) {
				windowWidth = newWindowWidth;
				windowHeight = newWindowHeight;
				cb();
			}
		} else {
			cb();
		}
	});

	var strings = {
		'openlink': _i18n2.default._t('TreeDropdownField.OpenLink'),
		'fieldTitle': '(' + _i18n2.default._t('TreeDropdownField.FieldTitle') + ')',
		'searchFieldTitle': '(' + _i18n2.default._t('TreeDropdownField.SearchFieldTitle') + ')'
	};

	var _clickTestFn = function _clickTestFn(e) {
		if (!$(e.target).parents('.TreeDropdownField').length) $('.TreeDropdownField').closePanel();
	};

	$('.TreeDropdownField').entwine({
		CurrentXhr: null,

		onadd: function onadd() {
			this.append('<span class="treedropdownfield-title"></span>' + '<div class="treedropdownfield-toggle-panel-link"><a href="#" class="ui-icon ui-icon-triangle-1-s"></a></div>' + '<div class="treedropdownfield-panel"><div class="tree-holder"></div></div>');

			var linkTitle = strings.openLink;
			if (linkTitle) this.find("treedropdownfield-toggle-panel-link a").attr('title', linkTitle);
			if (this.data('title')) this.setTitle(this.data('title'));

			this.getPanel().hide();
			this._super();
		},
		getPanel: function getPanel() {
			return this.find('.treedropdownfield-panel');
		},
		openPanel: function openPanel() {
			$('.TreeDropdownField').closePanel();

			$('body').bind('click', _clickTestFn);

			var panel = this.getPanel(),
			    tree = this.find('.tree-holder');

			panel.css('width', this.width());

			panel.show();

			var toggle = this.find(".treedropdownfield-toggle-panel-link");
			toggle.addClass('treedropdownfield-open-tree');
			this.addClass("treedropdownfield-open-tree");

			toggle.find("a").removeClass('ui-icon-triangle-1-s').addClass('ui-icon-triangle-1-n');

			if (tree.is(':empty') && !panel.hasClass('loading')) {
				this.loadTree(null, this._riseUp);
			} else {
				this._riseUp();
			}

			this.trigger('panelshow');
		},
		_riseUp: function _riseUp() {
			var container = this,
			    dropdown = this.getPanel(),
			    toggle = this.find(".treedropdownfield-toggle-panel-link"),
			    offsetTop = toggle.innerHeight(),
			    elHeight,
			    elPos,
			    endOfWindow;

			if (toggle.length > 0) {
				endOfWindow = $(window).height() + $(document).scrollTop() - toggle.innerHeight();
				elPos = toggle.offset().top;
				elHeight = dropdown.innerHeight();

				if (elPos + elHeight > endOfWindow && elPos - elHeight > 0) {
					container.addClass('treedropdownfield-with-rise');
					offsetTop = -dropdown.outerHeight();
				} else {
					container.removeClass('treedropdownfield-with-rise');
				}
			}
			dropdown.css({ "top": offsetTop + "px" });
		},
		closePanel: function closePanel() {
			jQuery('body').unbind('click', _clickTestFn);

			var toggle = this.find(".treedropdownfield-toggle-panel-link");
			toggle.removeClass('treedropdownfield-open-tree');
			this.removeClass('treedropdownfield-open-tree treedropdownfield-with-rise');

			toggle.find("a").removeClass('ui-icon-triangle-1-n').addClass('ui-icon-triangle-1-s');

			this.getPanel().hide();
			this.trigger('panelhide');
		},
		togglePanel: function togglePanel() {
			this[this.getPanel().is(':visible') ? 'closePanel' : 'openPanel']();
		},
		setTitle: function setTitle(title) {
			title = title || this.data('title') || strings.fieldTitle;

			this.find('.treedropdownfield-title').html(title);
			this.data('title', title);
		},
		getTitle: function getTitle() {
			return this.find('.treedropdownfield-title').text();
		},

		updateTitle: function updateTitle() {
			var self = this,
			    tree = self.find('.tree-holder'),
			    val = this.getValue();
			var updateFn = function updateFn() {
				var val = self.getValue();
				if (val) {

					var node = tree.find('*[data-id="' + val + '"]'),
					    title = node.children('a').find("span.jstree_pageicon") ? node.children('a').find("span.item").html() : null;
					if (!title) title = node.length > 0 ? tree.jstree('get_text', node[0]) : null;

					if (title) {
						self.setTitle(title);
						self.data('title', title);
					}
					if (node) tree.jstree('select_node', node);
				} else {
					self.setTitle(self.data('empty-title'));
					self.removeData('title');
				}
			};

			if (!tree.is(':empty') || !val) updateFn();else this.loadTree({ forceValue: val }, updateFn);
		},
		setValue: function setValue(val) {
			this.data('metadata', $.extend(this.data('metadata'), { id: val }));
			this.find(':input:hidden').val(val).trigger('valueupdated').trigger('change');
		},
		getValue: function getValue() {
			return this.find(':input:hidden').val();
		},
		loadTree: function loadTree(params, callback) {
			var self = this,
			    panel = this.getPanel(),
			    treeHolder = $(panel).find('.tree-holder'),
			    params = params ? $.extend({}, this.getRequestParams(), params) : this.getRequestParams(),
			    xhr;

			if (this.getCurrentXhr()) this.getCurrentXhr().abort();
			panel.addClass('loading');
			xhr = $.ajax({
				url: this.data('urlTree'),
				data: params,
				complete: function complete(xhr, status) {
					panel.removeClass('loading');
				},
				success: function success(html, status, xhr) {
					treeHolder.html(html);
					var firstLoad = true;
					treeHolder.jstree('destroy').bind('loaded.jstree', function (e, data) {
						var val = self.getValue(),
						    selectNode = treeHolder.find('*[data-id="' + val + '"]'),
						    currentNode = data.inst.get_selected();
						if (val && selectNode != currentNode) data.inst.select_node(selectNode);
						firstLoad = false;
						if (callback) callback.apply(self);
					}).jstree(self.getTreeConfig()).bind('select_node.jstree', function (e, data) {
						var node = data.rslt.obj,
						    id = $(node).data('id');
						if (!firstLoad && self.getValue() == id) {
							self.data('metadata', null);
							self.setTitle(null);
							self.setValue(null);
							data.inst.deselect_node(node);
						} else {
							self.data('metadata', $.extend({ id: id }, $(node).getMetaData()));
							self.setTitle(data.inst.get_text(node));
							self.setValue(id);
						}

						if (!firstLoad) self.closePanel();
						firstLoad = false;
					});

					self.setCurrentXhr(null);
				}
			});
			this.setCurrentXhr(xhr);
		},
		getTreeConfig: function getTreeConfig() {
			var self = this;
			return {
				'core': {
					'html_titles': true,

					'animation': 0
				},
				'html_data': {
					'data': this.getPanel().find('.tree-holder').html(),
					'ajax': {
						'url': function url(node) {
							var url = $.path.parseUrl(self.data('urlTree')).hrefNoSearch;
							return url + '/' + ($(node).data("id") ? $(node).data("id") : 0);
						},
						'data': function data(node) {
							var query = $.query.load(self.data('urlTree')).keys;
							var params = self.getRequestParams();
							params = $.extend({}, query, params, { ajax: 1 });
							return params;
						}
					}
				},
				'ui': {
					"select_limit": 1,
					'initially_select': [this.getPanel().find('.current').attr('id')]
				},
				'themes': {
					'theme': 'apple'
				},
				'types': {
					'types': {
						'default': {
							'check_node': function check_node(node) {
								return !node.hasClass('disabled');
							},
							'uncheck_node': function uncheck_node(node) {
								return !node.hasClass('disabled');
							},
							'select_node': function select_node(node) {
								return !node.hasClass('disabled');
							},
							'deselect_node': function deselect_node(node) {
								return !node.hasClass('disabled');
							}
						}
					}
				},
				'plugins': ['html_data', 'ui', 'themes', 'types']
			};
		},

		getRequestParams: function getRequestParams() {
			return {};
		}
	});

	$('.TreeDropdownField .tree-holder li').entwine({
		getMetaData: function getMetaData() {
			var matches = this.attr('class').match(/class-([^\s]*)/i);
			var klass = matches ? matches[1] : '';
			return { ClassName: klass };
		}
	});

	$('.TreeDropdownField *').entwine({
		getField: function getField() {
			return this.parents('.TreeDropdownField:first');
		}
	});

	$('.TreeDropdownField').entwine({
		onclick: function onclick(e) {
			this.togglePanel();

			return false;
		}
	});

	$('.TreeDropdownField .treedropdownfield-panel').entwine({
		onclick: function onclick(e) {
			return false;
		}
	});

	$('.TreeDropdownField.searchable').entwine({
		onadd: function onadd() {
			this._super();
			var title = _i18n2.default._t('TreeDropdownField.ENTERTOSEARCH');
			this.find('.treedropdownfield-panel').prepend($('<input type="text" class="search treedropdownfield-search" data-skip-autofocus="true" placeholder="' + title + '" value="" />'));
		},
		search: function search(str, callback) {
			this.openPanel();
			this.loadTree({ search: str }, callback);
		},
		cancelSearch: function cancelSearch() {
			this.closePanel();
			this.loadTree();
		}
	});

	$('.TreeDropdownField.searchable input.search').entwine({
		onkeydown: function onkeydown(e) {
			var field = this.getField();
			if (e.keyCode == 13) {
				field.search(this.val());
				return false;
			} else if (e.keyCode == 27) {
				field.cancelSearch();
			}
		}
	});

	$('.TreeDropdownField.multiple').entwine({
		getTreeConfig: function getTreeConfig() {
			var cfg = this._super();
			cfg.checkbox = { override_ui: true, two_state: true };
			cfg.plugins.push('checkbox');
			cfg.ui.select_limit = -1;
			return cfg;
		},
		loadTree: function loadTree(params, callback) {
			var self = this,
			    panel = this.getPanel(),
			    treeHolder = $(panel).find('.tree-holder');
			var params = params ? $.extend({}, this.getRequestParams(), params) : this.getRequestParams(),
			    xhr;

			if (this.getCurrentXhr()) this.getCurrentXhr().abort();
			panel.addClass('loading');
			xhr = $.ajax({
				url: this.data('urlTree'),
				data: params,
				complete: function complete(xhr, status) {
					panel.removeClass('loading');
				},
				success: function success(html, status, xhr) {
					treeHolder.html(html);
					var firstLoad = true;
					self.setCurrentXhr(null);
					treeHolder.jstree('destroy').bind('loaded.jstree', function (e, data) {
						$.each(self.getValue(), function (i, val) {
							data.inst.check_node(treeHolder.find('*[data-id=' + val + ']'));
						});
						firstLoad = false;
						if (callback) callback.apply(self);
					}).jstree(self.getTreeConfig()).bind('uncheck_node.jstree check_node.jstree', function (e, data) {
						var nodes = data.inst.get_checked(null, true);
						self.setValue($.map(nodes, function (el, i) {
							return $(el).data('id');
						}));
						self.setTitle($.map(nodes, function (el, i) {
							return data.inst.get_text(el);
						}));
						self.data('metadata', $.map(nodes, function (el, i) {
							return { id: $(el).data('id'), metadata: $(el).getMetaData() };
						}));
					});
				}
			});
			this.setCurrentXhr(xhr);
		},
		getValue: function getValue() {
			var val = this._super();
			return val.split(/ *, */);
		},
		setValue: function setValue(val) {
			this._super($.isArray(val) ? val.join(',') : val);
		},
		setTitle: function setTitle(title) {
			this._super($.isArray(title) ? title.join(', ') : title);
		},
		updateTitle: function updateTitle() {}
	});

	$('.TreeDropdownField input[type=hidden]').entwine({
		onadd: function onadd() {
			this._super();
			this.bind('change.TreeDropdownField', function () {
				$(this).getField().updateTitle();
			});
		},
		onremove: function onremove() {
			this._super();
			this.unbind('.TreeDropdownField');
		}
	});
});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(27)))

/***/ }),

/***/ 794:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _jQuery = __webpack_require__(16);

var _jQuery2 = _interopRequireDefault(_jQuery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var $window = (0, _jQuery2.default)(window),
    $html = (0, _jQuery2.default)('html'),
    $head = (0, _jQuery2.default)('head'),
    path = {
  urlParseRE: /^(((([^:\/#\?]+:)?(?:(\/\/)((?:(([^:@\/#\?]+)(?:\:([^:@\/#\?]+))?)@)?(([^:\/#\?\]\[]+|\[[^\/\]@#?]+\])(?:\:([0-9]+))?))?)?)?((\/?(?:[^\/\?#]+\/+)*)([^\?#]*)))?(\?[^#]+)?)(#.*)?/,

  parseUrl: function parseUrl(url) {
    if (_jQuery2.default.type(url) === "object") {
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
        newParams = _jQuery2.default.extend(path.convertSearchToArray(u.search), params);
    return u.hrefNoSearch + '?' + _jQuery2.default.param(newParams) + (u.hash || "");
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
    var splitkey = '&' + _jQuery2.default.mobile.subPageUrlKey;
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

_jQuery2.default.path = path;

/***/ }),

/***/ 797:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["Accordion"] = __webpack_require__(970);
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ }),

/***/ 798:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["AccordionBlock"] = __webpack_require__(971);
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ }),

/***/ 800:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["Backend"] = __webpack_require__(1002);
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ }),

/***/ 801:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["Badge"] = __webpack_require__(972);
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ }),

/***/ 803:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["Breadcrumb"] = __webpack_require__(973);
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ }),

/***/ 804:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["BreadcrumbsActions"] = __webpack_require__(1015);
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ }),

/***/ 805:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["Config"] = __webpack_require__(1003);
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ }),

/***/ 806:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["DataFormat"] = __webpack_require__(1004);
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ }),

/***/ 808:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["FieldHolder"] = __webpack_require__(974);
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ }),

/***/ 809:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["FileSchemaModalHandler"] = __webpack_require__(1000);
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ }),

/***/ 810:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["Focusedzone"] = __webpack_require__(975);
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ }),

/***/ 811:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["Form"] = __webpack_require__(976);
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ }),

/***/ 812:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["FormAction"] = __webpack_require__(978);
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ }),

/***/ 813:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["FormAlert"] = __webpack_require__(979);
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ }),

/***/ 814:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["FormBuilder"] = __webpack_require__(980);
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ }),

/***/ 815:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["FormBuilderLoader"] = __webpack_require__(998);
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ }),

/***/ 816:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["FormBuilderModal"] = __webpack_require__(981);
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ }),

/***/ 817:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["FormConstants"] = __webpack_require__(977);
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ }),

/***/ 820:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["GridField"] = __webpack_require__(982);
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ }),

/***/ 821:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["GridFieldCell"] = __webpack_require__(983);
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ }),

/***/ 822:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["GridFieldHeader"] = __webpack_require__(984);
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ }),

/***/ 823:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["GridFieldHeaderCell"] = __webpack_require__(985);
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ }),

/***/ 824:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["GridFieldRow"] = __webpack_require__(986);
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ }),

/***/ 825:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["GridFieldTable"] = __webpack_require__(987);
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ }),

/***/ 826:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["HiddenField"] = __webpack_require__(988);
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ }),

/***/ 827:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["Injector"] = __webpack_require__(1005);
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ }),

/***/ 828:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["InsertLinkModal"] = __webpack_require__(999);
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ }),

/***/ 830:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["ListGroup"] = __webpack_require__(989);
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ }),

/***/ 831:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["ListGroupItem"] = __webpack_require__(990);
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ }),

/***/ 832:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["LiteralField"] = __webpack_require__(991);
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ }),

/***/ 834:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["Preview"] = __webpack_require__(992);
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ }),

/***/ 844:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["ReactRouteRegister"] = __webpack_require__(1006);
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ }),

/***/ 848:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["RecordsActionTypes"] = __webpack_require__(1016);
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ }),

/***/ 849:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["RecordsActions"] = __webpack_require__(1017);
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ }),

/***/ 85:
/***/ (function(module, exports) {

module.exports = DeepFreezeStrict;

/***/ }),

/***/ 853:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["Router"] = __webpack_require__(1007);
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ }),

/***/ 854:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["SchemaActions"] = __webpack_require__(1018);
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ }),

/***/ 855:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["ShortcodeSerialiser"] = __webpack_require__(1008);
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ }),

/***/ 856:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["SilverStripeComponent"] = __webpack_require__(1009);
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ }),

/***/ 858:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["TextField"] = __webpack_require__(993);
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ }),

/***/ 859:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["TinyMCEActionRegistrar"] = __webpack_require__(1010);
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ }),

/***/ 86:
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

/***/ 860:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["Toolbar"] = __webpack_require__(994);
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ }),

/***/ 861:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["TreeDropdownField"] = __webpack_require__(995);
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ }),

/***/ 862:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["TreeDropdownFieldMenu"] = __webpack_require__(996);
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ }),

/***/ 863:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["TreeDropdownFieldNode"] = __webpack_require__(997);
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ }),

/***/ 864:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["UnsavedFormsActions"] = __webpack_require__(1019);
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ }),

/***/ 866:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["formatWrittenNumber"] = __webpack_require__(1011);
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ }),

/***/ 867:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["getFormState"] = __webpack_require__(1012);
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ }),

/***/ 874:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["reduxFieldReducer"] = __webpack_require__(1013);
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ }),

/***/ 875:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["schemaFieldValues"] = __webpack_require__(1014);
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ }),

/***/ 907:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _jQuery = __webpack_require__(16);

var _jQuery2 = _interopRequireDefault(_jQuery);

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _reactDom = __webpack_require__(26);

var _reactDom2 = _interopRequireDefault(_reactDom);

var _reactRouter = __webpack_require__(1904);

var _useBeforeUnload = __webpack_require__(309);

var _useBeforeUnload2 = _interopRequireDefault(_useBeforeUnload);

var _createBrowserHistory = __webpack_require__(305);

var _createBrowserHistory2 = _interopRequireDefault(_createBrowserHistory);

var _Config = __webpack_require__(762);

var _Config2 = _interopRequireDefault(_Config);

var _Router = __webpack_require__(1907);

var _Router2 = _interopRequireDefault(_Router);

var _ReactRouteRegister = __webpack_require__(1903);

var _ReactRouteRegister2 = _interopRequireDefault(_ReactRouteRegister);

var _App = __webpack_require__(941);

var _App2 = _interopRequireDefault(_App);

var _reactRouterRedux = __webpack_require__(764);

var _reactApollo = __webpack_require__(126);

var _i18n = __webpack_require__(23);

var _i18n2 = _interopRequireDefault(_i18n);

var _reduxForm = __webpack_require__(100);

var _getFormState = __webpack_require__(766);

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
      var history = (0, _reactRouterRedux.syncHistoryWithStore)((0, _reactRouter.useRouterHistory)((0, _useBeforeUnload2.default)(_createBrowserHistory2.default))({
        basename: _Config2.default.get('baseUrl')
      }), this.store);
      history.listenBeforeUnload(this.handleBeforeUnload);
      history.listenBefore(this.handleBeforeRoute);

      _reactDom2.default.render(_react2.default.createElement(
        _reactApollo.ApolloProvider,
        { store: this.store, client: this.client },
        _react2.default.createElement(_reactRouter.Router, {
          history: history,
          routes: _ReactRouteRegister2.default.getRootRoute()
        })
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
            (0, _jQuery2.default)('.cms-container').entwine('ss').handleStateChange(null, ctx.state);
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

/***/ 908:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = applyDevtools;

var _redux = __webpack_require__(41);

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

/***/ 909:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _apolloClient = __webpack_require__(1894);

var _apolloClient2 = _interopRequireDefault(_apolloClient);

var _networkInterface = __webpack_require__(187);

var _qs = __webpack_require__(249);

var _qs2 = _interopRequireDefault(_qs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function buildApolloClient(baseUrl) {
  var networkInterface = (0, _apolloClient.createNetworkInterface)({
    uri: baseUrl + 'graphql/',
    opts: {
      credentials: 'same-origin',
      headers: {
        accept: 'application/json'
      }
    }
  });
  var apolloClient = new _apolloClient2.default({
    shouldBatch: true,
    addTypename: true,
    dataIdFromObject: function dataIdFromObject(o) {
      if (o.id >= 0 && o.__typename) {
        return o.__typename + ':' + o.id;
      }
      return null;
    },
    networkInterface: networkInterface
  });

  networkInterface.use([{
    applyMiddleware: function applyMiddleware(req, next) {
      var entries = (0, _networkInterface.printRequest)(req.request);

      req.options.headers = Object.assign({}, req.options.headers, {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      });

      req.options.body = _qs2.default.stringify(Object.assign({}, entries, { variables: JSON.stringify(entries.variables) }));
      next();
    }
  }]);

  return apolloClient;
}

exports.default = buildApolloClient;

/***/ }),

/***/ 910:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _reduxForm = __webpack_require__(100);

var _Injector = __webpack_require__(45);

var _Injector2 = _interopRequireDefault(_Injector);

var _TextField = __webpack_require__(402);

var _TextField2 = _interopRequireDefault(_TextField);

var _HiddenField = __webpack_require__(926);

var _HiddenField2 = _interopRequireDefault(_HiddenField);

var _DateField = __webpack_require__(255);

var _DateField2 = _interopRequireDefault(_DateField);

var _TimeField = __webpack_require__(939);

var _TimeField2 = _interopRequireDefault(_TimeField);

var _DatetimeField = __webpack_require__(916);

var _DatetimeField2 = _interopRequireDefault(_DatetimeField);

var _CheckboxField = __webpack_require__(914);

var _CheckboxField2 = _interopRequireDefault(_CheckboxField);

var _CheckboxSetField = __webpack_require__(915);

var _CheckboxSetField2 = _interopRequireDefault(_CheckboxSetField);

var _OptionsetField = __webpack_require__(934);

var _OptionsetField2 = _interopRequireDefault(_OptionsetField);

var _GridField = __webpack_require__(1900);

var _GridField2 = _interopRequireDefault(_GridField);

var _SingleSelectField = __webpack_require__(936);

var _SingleSelectField2 = _interopRequireDefault(_SingleSelectField);

var _PopoverField = __webpack_require__(935);

var _PopoverField2 = _interopRequireDefault(_PopoverField);

var _HeaderField = __webpack_require__(925);

var _HeaderField2 = _interopRequireDefault(_HeaderField);

var _LiteralField = __webpack_require__(1901);

var _LiteralField2 = _interopRequireDefault(_LiteralField);

var _HtmlReadonlyField = __webpack_require__(927);

var _HtmlReadonlyField2 = _interopRequireDefault(_HtmlReadonlyField);

var _LookupField = __webpack_require__(931);

var _LookupField2 = _interopRequireDefault(_LookupField);

var _CompositeField = __webpack_require__(401);

var _CompositeField2 = _interopRequireDefault(_CompositeField);

var _LabelField = __webpack_require__(929);

var _LabelField2 = _interopRequireDefault(_LabelField);

var _Tabs = __webpack_require__(938);

var _Tabs2 = _interopRequireDefault(_Tabs);

var _TabItem = __webpack_require__(937);

var _TabItem2 = _interopRequireDefault(_TabItem);

var _FormAction = __webpack_require__(1897);

var _FormAction2 = _interopRequireDefault(_FormAction);

var _FieldGroup = __webpack_require__(917);

var _FieldGroup2 = _interopRequireDefault(_FieldGroup);

var _TreeDropdownField = __webpack_require__(940);

var _TreeDropdownField2 = _interopRequireDefault(_TreeDropdownField);

var _Form = __webpack_require__(918);

var _Form2 = _interopRequireDefault(_Form);

var _Form3 = __webpack_require__(942);

var _Form4 = _interopRequireDefault(_Form3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  _Injector2.default.component.registerMany({
    TextField: _TextField2.default,
    HiddenField: _HiddenField2.default,
    DateField: _DateField2.default,
    TimeField: _TimeField2.default,
    DatetimeField: _DatetimeField2.default,
    CheckboxField: _CheckboxField2.default,
    CheckboxSetField: _CheckboxSetField2.default,
    OptionsetField: _OptionsetField2.default,
    GridField: _GridField2.default,
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
    ReduxForm: _Form4.default,
    ReduxFormField: _reduxForm.Field,
    Form: _Form2.default
  });
};

/***/ }),

/***/ 911:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _Injector = __webpack_require__(45);

var _Injector2 = _interopRequireDefault(_Injector);

var _redux = __webpack_require__(41);

var _reduxForm = __webpack_require__(100);

var _reactRouterRedux = __webpack_require__(764);

var _ConfigReducer = __webpack_require__(964);

var _ConfigReducer2 = _interopRequireDefault(_ConfigReducer);

var _SchemaReducer = __webpack_require__(967);

var _SchemaReducer2 = _interopRequireDefault(_SchemaReducer);

var _RecordsReducer = __webpack_require__(966);

var _RecordsReducer2 = _interopRequireDefault(_RecordsReducer);

var _BreadcrumbsReducer = __webpack_require__(962);

var _BreadcrumbsReducer2 = _interopRequireDefault(_BreadcrumbsReducer);

var _TreeDropdownFieldReducer = __webpack_require__(968);

var _TreeDropdownFieldReducer2 = _interopRequireDefault(_TreeDropdownFieldReducer);

var _MobileMenuReducer = __webpack_require__(965);

var _MobileMenuReducer2 = _interopRequireDefault(_MobileMenuReducer);

var _UnsavedFormsReducer = __webpack_require__(969);

var _UnsavedFormsReducer2 = _interopRequireDefault(_UnsavedFormsReducer);

var _applyFormMiddleware = __webpack_require__(956);

var _applyFormMiddleware2 = _interopRequireDefault(_applyFormMiddleware);

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
    routing: _reactRouterRedux.routerReducer,
    treeDropdownField: _TreeDropdownFieldReducer2.default,
    mobileMenu: _MobileMenuReducer2.default,
    unsavedForms: _UnsavedFormsReducer2.default
  }, extra));

  _Injector2.default.transform('admin', function (updater) {
    updater.reducer('form', _applyFormMiddleware2.default);
  });
};

/***/ }),

/***/ 912:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(770);

__webpack_require__(856);
__webpack_require__(800);
__webpack_require__(827);
__webpack_require__(874);
__webpack_require__(875);
__webpack_require__(867);
__webpack_require__(813);
__webpack_require__(808);
__webpack_require__(811);
__webpack_require__(817);
__webpack_require__(812);
__webpack_require__(854);
__webpack_require__(814);
__webpack_require__(815);
__webpack_require__(816);
__webpack_require__(828);
__webpack_require__(809);
__webpack_require__(849);
__webpack_require__(820);
__webpack_require__(821);
__webpack_require__(822);
__webpack_require__(823);
__webpack_require__(824);
__webpack_require__(825);
__webpack_require__(797);
__webpack_require__(798);
__webpack_require__(826);
__webpack_require__(830);
__webpack_require__(831);
__webpack_require__(858);
__webpack_require__(832);
__webpack_require__(860);
__webpack_require__(803);
__webpack_require__(863);
__webpack_require__(862);
__webpack_require__(861);
__webpack_require__(804);
__webpack_require__(848);
__webpack_require__(864);
__webpack_require__(801);
__webpack_require__(834);
__webpack_require__(810);
__webpack_require__(805);
__webpack_require__(806);
__webpack_require__(844);
__webpack_require__(853);
__webpack_require__(859);
__webpack_require__(855);
__webpack_require__(866);

__webpack_require__(794);
__webpack_require__(392);
__webpack_require__(250);
__webpack_require__(776);
__webpack_require__(784);
__webpack_require__(786);
__webpack_require__(778);
__webpack_require__(779);
__webpack_require__(782);
__webpack_require__(783);
__webpack_require__(785);
__webpack_require__(777);
__webpack_require__(781);
__webpack_require__(780);
__webpack_require__(787);
__webpack_require__(771);
__webpack_require__(789);
__webpack_require__(788);

__webpack_require__(772);
__webpack_require__(790);
__webpack_require__(251);
__webpack_require__(792);
__webpack_require__(793);
__webpack_require__(251);
__webpack_require__(773);
__webpack_require__(775);
__webpack_require__(791);
__webpack_require__(774);

__webpack_require__(768);

/***/ }),

/***/ 914:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _OptionField = __webpack_require__(257);

var _OptionField2 = _interopRequireDefault(_OptionField);

var _FieldHolder = __webpack_require__(44);

var _FieldHolder2 = _interopRequireDefault(_FieldHolder);

var _SilverStripeComponent = __webpack_require__(13);

var _SilverStripeComponent2 = _interopRequireDefault(_SilverStripeComponent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CheckboxField = function (_SilverStripeComponen) {
  _inherits(CheckboxField, _SilverStripeComponen);

  function CheckboxField() {
    _classCallCheck(this, CheckboxField);

    return _possibleConstructorReturn(this, (CheckboxField.__proto__ || Object.getPrototypeOf(CheckboxField)).apply(this, arguments));
  }

  _createClass(CheckboxField, [{
    key: 'render',
    value: function render() {
      var FieldHolder = (0, _FieldHolder2.default)(_OptionField2.default);

      return _react2.default.createElement(FieldHolder, _extends({}, this.props, { type: 'checkbox', hideLabels: true }));
    }
  }]);

  return CheckboxField;
}(_SilverStripeComponent2.default);

exports.default = CheckboxField;

/***/ }),

/***/ 915:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CheckboxSetField = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _SilverStripeComponent = __webpack_require__(13);

var _SilverStripeComponent2 = _interopRequireDefault(_SilverStripeComponent);

var _OptionField = __webpack_require__(257);

var _OptionField2 = _interopRequireDefault(_OptionField);

var _FieldHolder = __webpack_require__(44);

var _FieldHolder2 = _interopRequireDefault(_FieldHolder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CheckboxSetField = function (_SilverStripeComponen) {
  _inherits(CheckboxSetField, _SilverStripeComponen);

  function CheckboxSetField(props) {
    _classCallCheck(this, CheckboxSetField);

    var _this = _possibleConstructorReturn(this, (CheckboxSetField.__proto__ || Object.getPrototypeOf(CheckboxSetField)).call(this, props));

    _this.getItemKey = _this.getItemKey.bind(_this);
    _this.getOptionProps = _this.getOptionProps.bind(_this);
    _this.handleChange = _this.handleChange.bind(_this);
    _this.getValues = _this.getValues.bind(_this);
    return _this;
  }

  _createClass(CheckboxSetField, [{
    key: 'getItemKey',
    value: function getItemKey(item, index) {
      return this.props.id + '-' + (item.value || 'empty' + index);
    }
  }, {
    key: 'getValues',
    value: function getValues() {
      var values = this.props.value;

      if (!Array.isArray(values) && (values || typeof values === 'string' || typeof values === 'number')) {
        values = [values];
      }

      if (values) {
        return values.map(function (value) {
          return '' + value;
        });
      }
      return [];
    }
  }, {
    key: 'handleChange',
    value: function handleChange(event, field) {
      var _this2 = this;

      if (typeof this.props.onChange === 'function') {
        var oldValue = this.getValues();
        var newValue = this.props.source.filter(function (item, index) {
          if (_this2.getItemKey(item, index) === field.id) {
            return field.value === 1;
          }
          return oldValue.indexOf('' + item.value) > -1;
        }).map(function (item) {
          return '' + item.value;
        });

        this.props.onChange(newValue);
      }
    }
  }, {
    key: 'getOptionProps',
    value: function getOptionProps(item, index) {
      var oldValue = this.getValues();
      var key = this.getItemKey(item, index);

      return {
        key: key,
        id: key,
        name: this.props.name,
        className: this.props.itemClass,
        disabled: item.disabled || this.props.disabled,
        readOnly: this.props.readOnly,
        onChange: this.handleChange,
        value: oldValue.indexOf('' + item.value) > -1,
        title: item.title,
        type: 'checkbox'
      };
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
          return _react2.default.createElement(_OptionField2.default, _this3.getOptionProps(item, index));
        })
      );
    }
  }]);

  return CheckboxSetField;
}(_SilverStripeComponent2.default);

CheckboxSetField.propTypes = {
  className: _react2.default.PropTypes.string,
  extraClass: _react2.default.PropTypes.string,
  itemClass: _react2.default.PropTypes.string,
  id: _react2.default.PropTypes.string,
  name: _react2.default.PropTypes.string.isRequired,
  source: _react2.default.PropTypes.arrayOf(_react2.default.PropTypes.shape({
    value: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.string, _react2.default.PropTypes.number]),
    title: _react2.default.PropTypes.any,
    disabled: _react2.default.PropTypes.bool
  })),
  onChange: _react2.default.PropTypes.func,
  value: _react2.default.PropTypes.any,
  readOnly: _react2.default.PropTypes.bool,
  disabled: _react2.default.PropTypes.bool
};

CheckboxSetField.defaultProps = {
  extraClass: '',
  className: '',
  value: []
};

exports.CheckboxSetField = CheckboxSetField;
exports.default = (0, _FieldHolder2.default)(CheckboxSetField);

/***/ }),

/***/ 916:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DatetimeField = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _FieldHolder = __webpack_require__(44);

var _FieldHolder2 = _interopRequireDefault(_FieldHolder);

var _DateField2 = __webpack_require__(255);

var _moment = __webpack_require__(181);

var _moment2 = _interopRequireDefault(_moment);

var _modernizr = __webpack_require__(180);

var _modernizr2 = _interopRequireDefault(_modernizr);

var _i18n = __webpack_require__(23);

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
      var placeholder = _i18n2.default.inject(_i18n2.default._t('Admin.FormatExample', 'Example: {format}'), { format: (0, _moment2.default)().endOf('month').format(localFormat) });
      return Object.assign({}, _get(DatetimeField.prototype.__proto__ || Object.getPrototypeOf(DatetimeField.prototype), 'getInputProps', this).call(this), {
        type: this.props.data.html5 ? 'datetime-local' : 'text',
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
      return _modernizr2.default.inputtypes['datetime-local'];
    }
  }, {
    key: 'triggerChange',
    value: function triggerChange(value) {
      if (/^\d{4}-\d\d-\d\dT\d\d:\d\d$/.test(value)) {
        this.props.onChange(value + ':00');
      } else {
        this.props.onChange(value);
      }
    }
  }, {
    key: 'convertToLocalised',
    value: function convertToLocalised(isoTime) {
      _moment2.default.locale(this.props.lang);
      var localTime = '';
      if (isoTime) {
        var timeObject = (0, _moment2.default)(isoTime);
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
        var timeObject = (0, _moment2.default)(localTime, [localFormat, _moment2.default.ISO_8601]);
        if (timeObject.isValid()) {
          isoTime = timeObject.format('YYYY-MM-DDTHH:mm:ss');
        }
      }
      return isoTime;
    }
  }]);

  return DatetimeField;
}(_DateField2.DateField);

DatetimeField.propTypes = {
  lang: _react2.default.PropTypes.string,
  data: _react2.default.PropTypes.shape({
    html5: _react2.default.PropTypes.boolean
  })
};

DatetimeField.defaultProps = {
  data: {}
};

exports.DatetimeField = DatetimeField;
exports.default = (0, _FieldHolder2.default)(DatetimeField);

/***/ }),

/***/ 917:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FieldGroup = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _CompositeField2 = __webpack_require__(401);

var _CompositeField3 = _interopRequireDefault(_CompositeField2);

var _FieldHolder = __webpack_require__(44);

var _FieldHolder2 = _interopRequireDefault(_FieldHolder);

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

exports.FieldGroup = FieldGroup;
exports.default = (0, _FieldHolder2.default)(FieldGroup);

/***/ }),

/***/ 918:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _reactDom = __webpack_require__(26);

var _reactDom2 = _interopRequireDefault(_reactDom);

var _FormAlert = __webpack_require__(391);

var _FormAlert2 = _interopRequireDefault(_FormAlert);

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

      var node = _reactDom2.default.findDOMNode(this);
      if (node) {
        var input = node.querySelector('input, select, textarea');
        if (input) {
          input.focus();
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
      var valid = this.props.valid !== false;
      var fields = this.props.mapFieldsToComponents(this.props.fields);
      var actions = this.props.mapActionsToComponents(this.props.actions);
      var messages = this.renderMessages();

      var className = ['form'];
      if (valid === false) {
        className.push('form--invalid');
      }
      if (this.props.attributes && this.props.attributes.className) {
        className.push(this.props.attributes.className);
      }
      var formProps = Object.assign({}, this.props.attributes, {
        onSubmit: this.props.handleSubmit,
        className: className.join(' ')
      });

      return _react2.default.createElement(
        'form',
        formProps,
        fields && _react2.default.createElement(
          'fieldset',
          null,
          messages,
          this.props.afterMessages,
          fields
        ),
        actions && actions.length ? _react2.default.createElement(
          'div',
          { className: 'btn-toolbar', role: 'group' },
          actions
        ) : null
      );
    }
  }]);

  return Form;
}(_react.Component);

Form.propTypes = {
  autoFocus: _react.PropTypes.bool,
  valid: _react.PropTypes.bool,
  actions: _react.PropTypes.array,
  afterMessages: _react.PropTypes.node,
  attributes: _react.PropTypes.shape({
    action: _react.PropTypes.string.isRequired,
    className: _react.PropTypes.string,
    encType: _react.PropTypes.string,
    id: _react.PropTypes.string,
    method: _react.PropTypes.string.isRequired
  }),
  fields: _react.PropTypes.array.isRequired,
  handleSubmit: _react.PropTypes.func,
  mapActionsToComponents: _react.PropTypes.func.isRequired,
  mapFieldsToComponents: _react.PropTypes.func.isRequired,
  messages: _react.PropTypes.arrayOf(_react.PropTypes.shape({
    extraClass: _react.PropTypes.string,
    value: _react.PropTypes.any,
    type: _react.PropTypes.string
  }))
};

exports.default = Form;

/***/ }),

/***/ 919:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  CSRF_HEADER: 'X-SecurityID' };

/***/ }),

/***/ 920:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _SilverStripeComponent = __webpack_require__(13);

var _SilverStripeComponent2 = _interopRequireDefault(_SilverStripeComponent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var GridFieldAction = function (_SilverStripeComponen) {
  _inherits(GridFieldAction, _SilverStripeComponen);

  function GridFieldAction(props) {
    _classCallCheck(this, GridFieldAction);

    var _this = _possibleConstructorReturn(this, (GridFieldAction.__proto__ || Object.getPrototypeOf(GridFieldAction)).call(this, props));

    _this.handleClick = _this.handleClick.bind(_this);
    return _this;
  }

  _createClass(GridFieldAction, [{
    key: 'render',
    value: function render() {
      return _react2.default.createElement('button', {
        className: 'grid-field__icon-action font-icon-' + this.props.icon + ' btn--icon-large',
        onClick: this.handleClick
      });
    }
  }, {
    key: 'handleClick',
    value: function handleClick(event) {
      this.props.handleClick(event, this.props.record.ID);
    }
  }]);

  return GridFieldAction;
}(_SilverStripeComponent2.default);

GridFieldAction.PropTypes = {
  handleClick: _react2.default.PropTypes.func.isRequired
};

exports.default = GridFieldAction;

/***/ }),

/***/ 921:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _SilverStripeComponent = __webpack_require__(13);

var _SilverStripeComponent2 = _interopRequireDefault(_SilverStripeComponent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var GridFieldCell = function (_SilverStripeComponen) {
  _inherits(GridFieldCell, _SilverStripeComponen);

  function GridFieldCell(props) {
    _classCallCheck(this, GridFieldCell);

    var _this = _possibleConstructorReturn(this, (GridFieldCell.__proto__ || Object.getPrototypeOf(GridFieldCell)).call(this, props));

    _this.handleDrillDown = _this.handleDrillDown.bind(_this);
    return _this;
  }

  _createClass(GridFieldCell, [{
    key: 'render',
    value: function render() {
      var classNames = ['grid-field__cell'];

      if (typeof this.props.className !== 'undefined') {
        classNames.push(this.props.className);
      }

      var props = {
        className: classNames.join(' '),
        onClick: this.handleDrillDown
      };

      return _react2.default.createElement(
        'td',
        props,
        this.props.children
      );
    }
  }, {
    key: 'handleDrillDown',
    value: function handleDrillDown(event) {
      if (typeof this.props.handleDrillDown === 'undefined') {
        return;
      }

      this.props.handleDrillDown(event);
    }
  }]);

  return GridFieldCell;
}(_SilverStripeComponent2.default);

GridFieldCell.PropTypes = {
  className: _react2.default.PropTypes.string,
  width: _react2.default.PropTypes.number,
  handleDrillDown: _react2.default.PropTypes.func
};

exports.default = GridFieldCell;

/***/ }),

/***/ 922:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _SilverStripeComponent = __webpack_require__(13);

var _SilverStripeComponent2 = _interopRequireDefault(_SilverStripeComponent);

var _GridFieldRow = __webpack_require__(256);

var _GridFieldRow2 = _interopRequireDefault(_GridFieldRow);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var GridFieldHeader = function (_SilverStripeComponen) {
  _inherits(GridFieldHeader, _SilverStripeComponen);

  function GridFieldHeader() {
    _classCallCheck(this, GridFieldHeader);

    return _possibleConstructorReturn(this, (GridFieldHeader.__proto__ || Object.getPrototypeOf(GridFieldHeader)).apply(this, arguments));
  }

  _createClass(GridFieldHeader, [{
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        _GridFieldRow2.default,
        null,
        this.props.children
      );
    }
  }]);

  return GridFieldHeader;
}(_SilverStripeComponent2.default);

exports.default = GridFieldHeader;

/***/ }),

/***/ 923:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _SilverStripeComponent = __webpack_require__(13);

var _SilverStripeComponent2 = _interopRequireDefault(_SilverStripeComponent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var GridFieldHeaderCell = function (_SilverStripeComponen) {
  _inherits(GridFieldHeaderCell, _SilverStripeComponen);

  function GridFieldHeaderCell() {
    _classCallCheck(this, GridFieldHeaderCell);

    return _possibleConstructorReturn(this, (GridFieldHeaderCell.__proto__ || Object.getPrototypeOf(GridFieldHeaderCell)).apply(this, arguments));
  }

  _createClass(GridFieldHeaderCell, [{
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'th',
        null,
        this.props.children
      );
    }
  }]);

  return GridFieldHeaderCell;
}(_SilverStripeComponent2.default);

GridFieldHeaderCell.PropTypes = {
  width: _react2.default.PropTypes.number
};

exports.default = GridFieldHeaderCell;

/***/ }),

/***/ 924:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _SilverStripeComponent = __webpack_require__(13);

var _SilverStripeComponent2 = _interopRequireDefault(_SilverStripeComponent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var GridFieldTable = function (_SilverStripeComponen) {
  _inherits(GridFieldTable, _SilverStripeComponen);

  function GridFieldTable() {
    _classCallCheck(this, GridFieldTable);

    return _possibleConstructorReturn(this, (GridFieldTable.__proto__ || Object.getPrototypeOf(GridFieldTable)).apply(this, arguments));
  }

  _createClass(GridFieldTable, [{
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
  }, {
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
  }]);

  return GridFieldTable;
}(_SilverStripeComponent2.default);

GridFieldTable.propTypes = {
  data: _react2.default.PropTypes.object,
  header: _react2.default.PropTypes.object,
  rows: _react2.default.PropTypes.array
};

exports.default = GridFieldTable;

/***/ }),

/***/ 925:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _SilverStripeComponent = __webpack_require__(13);

var _SilverStripeComponent2 = _interopRequireDefault(_SilverStripeComponent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var HeaderField = function (_SilverStripeComponen) {
  _inherits(HeaderField, _SilverStripeComponen);

  function HeaderField() {
    _classCallCheck(this, HeaderField);

    return _possibleConstructorReturn(this, (HeaderField.__proto__ || Object.getPrototypeOf(HeaderField)).apply(this, arguments));
  }

  _createClass(HeaderField, [{
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
  }, {
    key: 'getInputProps',
    value: function getInputProps() {
      return {
        className: this.props.className + ' ' + this.props.extraClass,
        id: this.props.id
      };
    }
  }]);

  return HeaderField;
}(_SilverStripeComponent2.default);

HeaderField.propTypes = {
  extraClass: _react2.default.PropTypes.string,
  id: _react2.default.PropTypes.string,
  data: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.array, _react2.default.PropTypes.shape({
    headingLevel: _react2.default.PropTypes.number,
    title: _react2.default.PropTypes.string
  })]).isRequired
};

HeaderField.defaultProps = {
  className: '',
  extraClass: ''
};

exports.default = HeaderField;

/***/ }),

/***/ 926:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _SilverStripeComponent = __webpack_require__(13);

var _SilverStripeComponent2 = _interopRequireDefault(_SilverStripeComponent);

var _reactBootstrapSs = __webpack_require__(38);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var HiddenField = function (_SilverStripeComponen) {
  _inherits(HiddenField, _SilverStripeComponen);

  function HiddenField() {
    _classCallCheck(this, HiddenField);

    return _possibleConstructorReturn(this, (HiddenField.__proto__ || Object.getPrototypeOf(HiddenField)).apply(this, arguments));
  }

  _createClass(HiddenField, [{
    key: 'getInputProps',
    value: function getInputProps() {
      return {
        bsClass: this.props.bsClass,
        componentClass: 'input',
        className: this.props.className + ' ' + this.props.extraClass,
        id: this.props.id,
        name: this.props.name,
        type: 'hidden',
        value: this.props.value
      };
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(_reactBootstrapSs.FormControl, this.getInputProps());
    }
  }]);

  return HiddenField;
}(_SilverStripeComponent2.default);

HiddenField.propTypes = {
  id: _react2.default.PropTypes.string,
  extraClass: _react2.default.PropTypes.string,
  name: _react2.default.PropTypes.string.isRequired,
  value: _react2.default.PropTypes.any
};

HiddenField.defaultProps = {
  className: '',
  extraClass: '',
  value: ''
};

exports.default = HiddenField;

/***/ }),

/***/ 927:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HtmlReadonlyField = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _SilverStripeComponent = __webpack_require__(13);

var _SilverStripeComponent2 = _interopRequireDefault(_SilverStripeComponent);

var _FieldHolder = __webpack_require__(44);

var _FieldHolder2 = _interopRequireDefault(_FieldHolder);

var _reactBootstrapSs = __webpack_require__(38);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var HtmlReadonlyField = function (_SilverStripeComponen) {
  _inherits(HtmlReadonlyField, _SilverStripeComponen);

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
        bsClass: this.props.bsClass,
        componentClass: this.props.componentClass,

        className: this.props.className + ' ' + this.props.extraClass,
        id: this.props.id,
        name: this.props.name
      };
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(_reactBootstrapSs.FormControl.Static, _extends({}, this.getInputProps(), { dangerouslySetInnerHTML: this.getContent() }));
    }
  }]);

  return HtmlReadonlyField;
}(_SilverStripeComponent2.default);

HtmlReadonlyField.propTypes = {
  id: _react2.default.PropTypes.string,
  name: _react2.default.PropTypes.string.isRequired,
  extraClass: _react2.default.PropTypes.string,
  value: _react2.default.PropTypes.string
};

HtmlReadonlyField.defaultProps = {
  extraClass: '',
  className: ''
};

exports.HtmlReadonlyField = HtmlReadonlyField;
exports.default = (0, _FieldHolder2.default)(HtmlReadonlyField);

/***/ }),

/***/ 928:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _reactBootstrapSs = __webpack_require__(38);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var IframeDialog = function (_Component) {
  _inherits(IframeDialog, _Component);

  function IframeDialog() {
    _classCallCheck(this, IframeDialog);

    return _possibleConstructorReturn(this, (IframeDialog.__proto__ || Object.getPrototypeOf(IframeDialog)).apply(this, arguments));
  }

  _createClass(IframeDialog, [{
    key: 'renderHeader',
    value: function renderHeader() {
      var title = this.props.title;
      if (title) {
        return _react2.default.createElement(
          _reactBootstrapSs.Modal.Header,
          null,
          _react2.default.createElement(
            _reactBootstrapSs.Modal.Title,
            null,
            title
          )
        );
      }
      return null;
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        _reactBootstrapSs.Modal,
        {
          show: this.props.show,
          onHide: this.props.onHide,
          className: this.props.className,
          dialogClassName: this.props.dialogClassName
        },
        this.renderHeader(),
        _react2.default.createElement(
          _reactBootstrapSs.Modal.Body,
          { className: this.props.bodyClassName },
          _react2.default.createElement('iframe', {
            id: this.props.iframeId,
            className: this.props.iframeClassName,
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
  url: _react.PropTypes.string.isRequired,
  onHide: _react.PropTypes.func,
  show: _react.PropTypes.bool,
  title: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.bool]),
  dialogClassName: _react.PropTypes.string,
  iframeId: _react.PropTypes.string,
  iframeClassName: _react.PropTypes.string,
  className: _react.PropTypes.string,
  bodyClassName: _react.PropTypes.string
};

IframeDialog.defaultProps = {
  show: false,
  title: null
};

exports.default = IframeDialog;

/***/ }),

/***/ 929:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var LabelField = function LabelField(_ref) {
  var id = _ref.id,
      className = _ref.className,
      title = _ref.title,
      extraClass = _ref.extraClass;

  var props = {
    id: id,
    className: className + ' ' + extraClass
  };

  return _react2.default.createElement(
    'label',
    props,
    title
  );
};

LabelField.propTypes = {
  id: _react.PropTypes.number,
  className: _react.PropTypes.string,
  extraClass: _react.PropTypes.string,
  title: _react.PropTypes.node
};

LabelField.defaultProps = {
  className: '',
  extraClass: ''
};

exports.default = LabelField;

/***/ }),

/***/ 930:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _SilverStripeComponent = __webpack_require__(13);

var _SilverStripeComponent2 = _interopRequireDefault(_SilverStripeComponent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ListGroupItem = function (_SilverStripeComponen) {
  _inherits(ListGroupItem, _SilverStripeComponen);

  function ListGroupItem(props) {
    _classCallCheck(this, ListGroupItem);

    var _this = _possibleConstructorReturn(this, (ListGroupItem.__proto__ || Object.getPrototypeOf(ListGroupItem)).call(this, props));

    _this.handleClick = _this.handleClick.bind(_this);
    return _this;
  }

  _createClass(ListGroupItem, [{
    key: 'render',
    value: function render() {
      var className = 'list-group-item ' + this.props.className;
      return _react2.default.createElement(
        'a',
        { tabIndex: '0', className: className, onClick: this.handleClick },
        this.props.children
      );
    }
  }, {
    key: 'handleClick',
    value: function handleClick(event) {
      if (this.props.handleClick) {
        this.props.handleClick(event, this.props.handleClickArg);
      }
    }
  }]);

  return ListGroupItem;
}(_SilverStripeComponent2.default);

ListGroupItem.propTypes = {
  handleClickArg: _react2.default.PropTypes.any,
  handleClick: _react2.default.PropTypes.func
};

exports.default = ListGroupItem;

/***/ }),

/***/ 931:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LookupField = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _SilverStripeComponent = __webpack_require__(13);

var _SilverStripeComponent2 = _interopRequireDefault(_SilverStripeComponent);

var _reactBootstrapSs = __webpack_require__(38);

var _FieldHolder = __webpack_require__(44);

var _FieldHolder2 = _interopRequireDefault(_FieldHolder);

var _i18n = __webpack_require__(23);

var _i18n2 = _interopRequireDefault(_i18n);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var LookupField = function (_SilverStripeComponen) {
  _inherits(LookupField, _SilverStripeComponen);

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
        _reactBootstrapSs.FormControl.Static,
        this.getFieldProps(),
        this.getValueCSV() || none
      );
    }
  }]);

  return LookupField;
}(_SilverStripeComponent2.default);

LookupField.propTypes = {
  extraClass: _react2.default.PropTypes.string,
  id: _react2.default.PropTypes.string,
  name: _react2.default.PropTypes.string.isRequired,
  source: _react2.default.PropTypes.arrayOf(_react2.default.PropTypes.shape({
    value: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.string, _react2.default.PropTypes.number]),
    title: _react2.default.PropTypes.any,
    disabled: _react2.default.PropTypes.bool
  })),
  value: _react2.default.PropTypes.any
};

LookupField.defaultProps = {
  extraClass: '',
  className: '',
  value: []
};

exports.LookupField = LookupField;
exports.default = (0, _FieldHolder2.default)(LookupField);

/***/ }),

/***/ 932:
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
          'aria-expanded': !!this.props.isOpen
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
  isOpen: _react2.default.PropTypes.bool.isRequired,
  onClick: _react2.default.PropTypes.func.isRequired,
  controls: _react2.default.PropTypes.string
};

MobileMenuToggle.defaultProps = {
  isOpen: false,
  controls: ''
};

exports.default = MobileMenuToggle;

/***/ }),

/***/ 933:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _MobileMenuActions = __webpack_require__(412);

var _reactRedux = __webpack_require__(42);

var _MobileMenuToggle = __webpack_require__(932);

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

/***/ 934:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.OptionsetField = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _SilverStripeComponent = __webpack_require__(13);

var _SilverStripeComponent2 = _interopRequireDefault(_SilverStripeComponent);

var _OptionField = __webpack_require__(257);

var _OptionField2 = _interopRequireDefault(_OptionField);

var _FieldHolder = __webpack_require__(44);

var _FieldHolder2 = _interopRequireDefault(_FieldHolder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var OptionsetField = function (_SilverStripeComponen) {
  _inherits(OptionsetField, _SilverStripeComponen);

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
      return this.props.id + '-' + (item.value || 'empty' + index);
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

          this.props.onChange(sourceItem.value);
        }
      }
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
          return _react2.default.createElement(_OptionField2.default, _this3.getOptionProps(item, index));
        })
      );
    }
  }]);

  return OptionsetField;
}(_SilverStripeComponent2.default);

OptionsetField.propTypes = {
  extraClass: _react2.default.PropTypes.string,
  itemClass: _react2.default.PropTypes.string,
  id: _react2.default.PropTypes.string,
  name: _react2.default.PropTypes.string.isRequired,
  source: _react2.default.PropTypes.arrayOf(_react2.default.PropTypes.shape({
    value: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.string, _react2.default.PropTypes.number]),
    title: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.string, _react2.default.PropTypes.number]),
    disabled: _react2.default.PropTypes.bool
  })),
  onChange: _react2.default.PropTypes.func,
  value: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.string, _react2.default.PropTypes.number]),
  readOnly: _react2.default.PropTypes.bool,
  disabled: _react2.default.PropTypes.bool
};

OptionsetField.defaultProps = {
  extraClass: '',
  className: '',
  itemClass: ''
};

exports.OptionsetField = OptionsetField;
exports.default = (0, _FieldHolder2.default)(OptionsetField);

/***/ }),

/***/ 935:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _reactBootstrapSs = __webpack_require__(38);

var _SilverStripeComponent = __webpack_require__(13);

var _SilverStripeComponent2 = _interopRequireDefault(_SilverStripeComponent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PopoverField = function (_SilverStripeComponen) {
  _inherits(PopoverField, _SilverStripeComponen);

  function PopoverField(props) {
    _classCallCheck(this, PopoverField);

    var _this = _possibleConstructorReturn(this, (PopoverField.__proto__ || Object.getPrototypeOf(PopoverField)).call(this, props));

    _this.handleShow = _this.handleShow.bind(_this);
    _this.handleHide = _this.handleHide.bind(_this);

    _this.state = {
      showing: false
    };
    return _this;
  }

  _createClass(PopoverField, [{
    key: 'handleShow',
    value: function handleShow() {
      this.setState({
        showing: true
      });
    }
  }, {
    key: 'handleHide',
    value: function handleHide() {
      this.setState({
        showing: false
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var placement = this.getPlacement();
      var overlay = _react2.default.createElement(
        _reactBootstrapSs.Popover,
        { id: this.props.id + '_Popover', className: 'fade in popover-' + placement,
          title: this.props.data.popoverTitle
        },
        this.props.children
      );

      var buttonClasses = ['btn', 'btn-secondary'];
      if (this.state.showing) {
        buttonClasses.push('btn--no-focus');
      }

      if (!this.props.title) {
        buttonClasses.push('font-icon-dot-3 btn--no-text btn--icon-xl');
      }

      var buttonProps = {
        id: this.props.id,
        type: 'button',
        className: buttonClasses.join(' ')
      };
      if (this.props.data.buttonTooltip) {
        buttonProps.title = this.props.data.buttonTooltip;
      }

      return _react2.default.createElement(
        _reactBootstrapSs.OverlayTrigger,
        { rootClose: true, trigger: 'click',
          placement: placement, overlay: overlay,
          onEnter: this.handleShow,
          onExited: this.handleHide
        },
        _react2.default.createElement(
          'button',
          buttonProps,
          this.props.title
        )
      );
    }
  }, {
    key: 'getPlacement',
    value: function getPlacement() {
      var placement = this.props.data.placement;
      return placement || 'bottom';
    }
  }]);

  return PopoverField;
}(_SilverStripeComponent2.default);

PopoverField.propTypes = {
  id: _react2.default.PropTypes.string,
  title: _react2.default.PropTypes.any,
  data: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.array, _react2.default.PropTypes.shape({
    popoverTitle: _react2.default.PropTypes.string,
    buttonTooltip: _react2.default.PropTypes.string,
    placement: _react2.default.PropTypes.oneOf(['top', 'right', 'bottom', 'left'])
  })])
};

exports.default = PopoverField;

/***/ }),

/***/ 936:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SingleSelectField = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _SilverStripeComponent = __webpack_require__(13);

var _SilverStripeComponent2 = _interopRequireDefault(_SilverStripeComponent);

var _FieldHolder = __webpack_require__(44);

var _FieldHolder2 = _interopRequireDefault(_FieldHolder);

var _i18n = __webpack_require__(23);

var _i18n2 = _interopRequireDefault(_i18n);

var _reactBootstrapSs = __webpack_require__(38);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SingleSelectField = function (_SilverStripeComponen) {
  _inherits(SingleSelectField, _SilverStripeComponen);

  function SingleSelectField(props) {
    _classCallCheck(this, SingleSelectField);

    var _this = _possibleConstructorReturn(this, (SingleSelectField.__proto__ || Object.getPrototypeOf(SingleSelectField)).call(this, props));

    _this.handleChange = _this.handleChange.bind(_this);
    return _this;
  }

  _createClass(SingleSelectField, [{
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
  }, {
    key: 'getReadonlyField',
    value: function getReadonlyField() {
      var _this2 = this;

      var label = this.props.source && this.props.source.find(function (item) {
        return item.value === _this2.props.value;
      });

      label = typeof label === 'string' ? label : this.props.value;

      return _react2.default.createElement(
        _reactBootstrapSs.FormControl.Static,
        this.getInputProps(),
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
        _reactBootstrapSs.FormControl,
        this.getInputProps(),
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
        bsClass: this.props.bsClass,

        className: this.props.className + ' ' + this.props.extraClass + ' no-chosen',
        id: this.props.id,
        name: this.props.name,
        disabled: this.props.disabled
      };

      if (!this.props.readOnly) {
        Object.assign(props, {
          onChange: this.handleChange,
          value: this.props.value,
          componentClass: 'select'
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
  }]);

  return SingleSelectField;
}(_SilverStripeComponent2.default);

SingleSelectField.propTypes = {
  id: _react2.default.PropTypes.string,
  name: _react2.default.PropTypes.string.isRequired,
  onChange: _react2.default.PropTypes.func,
  value: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.string, _react2.default.PropTypes.number]),
  readOnly: _react2.default.PropTypes.bool,
  disabled: _react2.default.PropTypes.bool,
  source: _react2.default.PropTypes.arrayOf(_react2.default.PropTypes.shape({
    value: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.string, _react2.default.PropTypes.number]),
    title: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.string, _react2.default.PropTypes.number]),
    disabled: _react2.default.PropTypes.bool
  })),
  data: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.array, _react2.default.PropTypes.shape({
    hasEmptyDefault: _react2.default.PropTypes.bool,
    emptyString: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.string, _react2.default.PropTypes.number])
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

exports.SingleSelectField = SingleSelectField;
exports.default = (0, _FieldHolder2.default)(SingleSelectField);

/***/ }),

/***/ 937:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _SilverStripeComponent = __webpack_require__(13);

var _SilverStripeComponent2 = _interopRequireDefault(_SilverStripeComponent);

var _reactBootstrapSs = __webpack_require__(38);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TabItem = function (_SilverStripeComponen) {
  _inherits(TabItem, _SilverStripeComponen);

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
          disabled = _props.disabled,
          bsClass = _props.bsClass,
          onEnter = _props.onEnter,
          onEntering = _props.onEntering,
          onEntered = _props.onEntered,
          onExit = _props.onExit,
          onExiting = _props.onExiting,
          onExited = _props.onExited,
          animation = _props.animation,
          unmountOnExit = _props.unmountOnExit;


      return {
        eventKey: name,
        className: className + ' ' + extraClass,
        disabled: disabled,
        bsClass: bsClass,
        onEnter: onEnter,
        onEntering: onEntering,
        onEntered: onEntered,
        onExit: onExit,
        onExiting: onExiting,
        onExited: onExited,
        animation: animation,
        unmountOnExit: unmountOnExit
      };
    }
  }, {
    key: 'render',
    value: function render() {
      var tabProps = this.getTabProps();
      return _react2.default.createElement(
        _reactBootstrapSs.Tab.Pane,
        tabProps,
        this.props.children
      );
    }
  }]);

  return TabItem;
}(_SilverStripeComponent2.default);

TabItem.propTypes = {
  name: _react2.default.PropTypes.string.isRequired,
  extraClass: _react2.default.PropTypes.string,
  tabClassName: _react2.default.PropTypes.string
};

TabItem.defaultProps = {
  className: '',
  extraClass: ''
};

exports.default = TabItem;

/***/ }),

/***/ 938:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _SilverStripeComponent = __webpack_require__(13);

var _SilverStripeComponent2 = _interopRequireDefault(_SilverStripeComponent);

var _reactBootstrapSs = __webpack_require__(38);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Tabs = function (_SilverStripeComponen) {
  _inherits(Tabs, _SilverStripeComponen);

  function Tabs() {
    _classCallCheck(this, Tabs);

    return _possibleConstructorReturn(this, (Tabs.__proto__ || Object.getPrototypeOf(Tabs)).apply(this, arguments));
  }

  _createClass(Tabs, [{
    key: 'getContainerProps',
    value: function getContainerProps() {
      var _props = this.props,
          activeKey = _props.activeKey,
          onSelect = _props.onSelect,
          className = _props.className,
          extraClass = _props.extraClass,
          id = _props.id;

      var combinedClassName = className + ' ' + extraClass;

      return {
        activeKey: activeKey,
        className: combinedClassName,
        defaultActiveKey: this.getDefaultActiveKey(),
        onSelect: onSelect,
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
    key: 'renderTab',
    value: function renderTab(child) {
      if (child.props.title === null) {
        return null;
      }
      return _react2.default.createElement(
        _reactBootstrapSs.NavItem,
        { eventKey: child.props.name,
          disabled: child.props.disabled,
          className: child.props.tabClassName
        },
        child.props.title
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
        _reactBootstrapSs.Nav,
        { bsStyle: this.props.bsStyle, role: 'tablist' },
        tabs
      );
    }
  }, {
    key: 'render',
    value: function render() {
      var containerProps = this.getContainerProps();
      var nav = this.renderNav();

      return _react2.default.createElement(
        _reactBootstrapSs.Tab.Container,
        containerProps,
        _react2.default.createElement(
          'div',
          { className: 'wrapper' },
          nav,
          _react2.default.createElement(
            _reactBootstrapSs.Tab.Content,
            { animation: this.props.animation },
            this.props.children
          )
        )
      );
    }
  }]);

  return Tabs;
}(_SilverStripeComponent2.default);

Tabs.propTypes = {
  id: _react2.default.PropTypes.string.isRequired,
  defaultActiveKey: _react2.default.PropTypes.string,
  extraClass: _react2.default.PropTypes.string
};

Tabs.defaultProps = {
  bsStyle: 'tabs',
  className: '',
  extraClass: ''
};

exports.default = Tabs;

/***/ }),

/***/ 939:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TimeField = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _FieldHolder = __webpack_require__(44);

var _FieldHolder2 = _interopRequireDefault(_FieldHolder);

var _DateField2 = __webpack_require__(255);

var _moment = __webpack_require__(181);

var _moment2 = _interopRequireDefault(_moment);

var _modernizr = __webpack_require__(180);

var _modernizr2 = _interopRequireDefault(_modernizr);

var _i18n = __webpack_require__(23);

var _i18n2 = _interopRequireDefault(_i18n);

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
      var props = {};
      Object.assign(props, _get(TimeField.prototype.__proto__ || Object.getPrototypeOf(TimeField.prototype), 'getInputProps', this).call(this));
      Object.assign(props, {
        type: this.props.data.html5 ? 'time' : 'text',
        placeholder: placeholder
      });
      return props;
    }
  }, {
    key: 'isMultiline',
    value: function isMultiline() {
      return false;
    }
  }, {
    key: 'hasNativeSupport',
    value: function hasNativeSupport() {
      return _modernizr2.default.inputtypes.time;
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
}(_DateField2.DateField);

TimeField.propTypes = {
  lang: _react2.default.PropTypes.string,
  data: _react2.default.PropTypes.shape({
    html5: _react2.default.PropTypes.boolean
  })
};

TimeField.defaultProps = {
  data: {}
};

exports.TimeField = TimeField;
exports.default = (0, _FieldHolder2.default)(TimeField);

/***/ }),

/***/ 940:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SINGLE_EMPTY_VALUE = exports.MULTI_EMPTY_VALUE = exports.ConnectedTreeDropdownField = exports.TreeDropdownField = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _reactRedux = __webpack_require__(42);

var _redux = __webpack_require__(41);

var _FieldHolder = __webpack_require__(44);

var _FieldHolder2 = _interopRequireDefault(_FieldHolder);

var _isomorphicFetch = __webpack_require__(179);

var _isomorphicFetch2 = _interopRequireDefault(_isomorphicFetch);

var _reactSelect = __webpack_require__(765);

var _reactSelect2 = _interopRequireDefault(_reactSelect);

var _TreeDropdownFieldActions = __webpack_require__(416);

var treeDropdownFieldActions = _interopRequireWildcard(_TreeDropdownFieldActions);

var _TreeDropdownFieldMenu = __webpack_require__(403);

var _TreeDropdownFieldMenu2 = _interopRequireDefault(_TreeDropdownFieldMenu);

var _TreeDropdownFieldNode = __webpack_require__(188);

var _TreeDropdownFieldNode2 = _interopRequireDefault(_TreeDropdownFieldNode);

var _url = __webpack_require__(385);

var _url2 = _interopRequireDefault(_url);

var _reactBootstrapSs = __webpack_require__(38);

var _castStringToElement = __webpack_require__(86);

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

    _this.callFetch = _this.callFetch.bind(_this);
    _this.lazyLoad = _this.lazyLoad.bind(_this);
    _this.filterOptions = _this.filterOptions.bind(_this);
    _this.findTreeByID = _this.findTreeByID.bind(_this);
    _this.findTreeByPath = _this.findTreeByPath.bind(_this);
    _this.findTreePath = _this.findTreePath.bind(_this);

    _this.searchTimer = null;
    return _this;
  }

  _createClass(TreeDropdownField, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      if (!this.props.readOnly && !this.props.disabled) {
        this.loadTree([], this.props.search).then(function (treeData) {
          if (_this2.props.data.multiple && _this2.props.value) {
            var newPath = _this2.findTreePath(treeData, _this2.props.value);
            if (newPath) {
              newPath.pop();
              _this2.props.actions.treeDropdownField.setVisible(_this2.props.id, newPath);
            }
          }
        });
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

      if (nextProps.data.cacheKey !== this.props.data.cacheKey) {
        reload = true;
      }

      if (reload) {
        this.loadTree(visible, nextProps.search);
      }
    }
  }, {
    key: 'getVisibleTree',
    value: function getVisibleTree() {
      return this.findTreeByPath(this.props.tree, this.props.visible);
    }
  }, {
    key: 'getBreadcrumbs',
    value: function getBreadcrumbs() {
      var breadcrumbs = [];

      var node = this.props.tree;
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        var _loop = function _loop() {
          var next = _step.value;

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

        for (var _iterator = this.props.visible[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _ret = _loop();

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

      if (this.props.data.hasEmptyDefault && !this.props.visible.length && !this.hasSearch()) {
        options.unshift({
          id: '',
          title: this.props.data.emptyString,
          disabled: false
        });
      }

      if (this.props.selectedValues) {
        var selectedOptions = this.props.selectedValues.filter(function (selected) {
          var selectedValue = selected.id === value || Array.isArray(value) && value.find(function (item) {
            return item === selected.id;
          });

          if (!selectedValue) {
            return false;
          }
          var option = options.find(function (item) {
            return item.id === selected.id;
          });

          return !option;
        });

        if (selectedOptions.length) {
          options = [].concat(_toConsumableArray(selectedOptions), _toConsumableArray(options));
        }
      }

      if (options.length) {
        return options;
      }

      return [{
        id: null,
        title: null,
        disabled: true
      }];
    }
  }, {
    key: 'callFetch',
    value: function callFetch(path) {
      var search = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

      var fetchURL = _url2.default.parse(this.props.data.urlTree, true);
      if (this.props.data.showSearch && search.length) {
        fetchURL.query.search = search;
        fetchURL.query.flatList = '1';
      }
      if (path.length) {
        fetchURL.query.ID = path[path.length - 1];
      }
      fetchURL.query.format = 'json';
      var fetchURLString = _url2.default.format(fetchURL);
      return (0, _isomorphicFetch2.default)(fetchURLString, {
        credentials: 'same-origin'
      }).then(function (response) {
        return response.json();
      });
    }
  }, {
    key: 'findTreeByPath',
    value: function findTreeByPath(tree, path) {
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
        return this.findTreeByPath(subTree, subPath);
      }

      return null;
    }
  }, {
    key: 'findTreeByID',
    value: function findTreeByID(tree, id) {
      if (!id || !tree || !tree.children || Object.keys(tree).length === 0) {
        return null;
      }

      if (tree.id === id) {
        return tree;
      }
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = tree.children[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var child = _step2.value;

          var found = this.findTreeByID(child, id);
          if (found !== null) {
            return found;
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
    }
  }, {
    key: 'findTreePath',
    value: function findTreePath(tree, id) {
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
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = tree.children[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var child = _step3.value;

          var childPath = this.findTreePath(child, id);

          if (childPath !== null) {
            if (tree.id) {
              childPath.unshift(tree.id);
            }
            return childPath;
          }
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return) {
            _iterator3.return();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }

      return null;
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

      var foundTree = this.findTreeByPath(this.props.tree, path);

      if (foundTree && (foundTree.count === 0 || foundTree.children.length)) {
        return Promise.resolve({});
      }

      return this.loadTree(path);
    }
  }, {
    key: 'loadTree',
    value: function loadTree(path) {
      var _this4 = this;

      var search = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

      this.props.actions.treeDropdownField.beginTreeUpdating(this.props.id, path);

      return this.callFetch(path, search).then(function (treeData) {
        _this4.props.actions.treeDropdownField.updateTree(_this4.props.id, path, treeData);

        return treeData;
      }).catch(function (error) {
        _this4.props.actions.treeDropdownField.updateTreeFailed(_this4.props.id, path);
        if (typeof _this4.props.onLoadingError === 'function') {
          return _this4.props.onLoadingError({
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
      var _this5 = this;

      var parent = this.getVisibleTree();

      return options.filter(function (option) {
        var title = option.title && option.title.toLocaleLowerCase();

        var search = _this5.props.search.toLocaleLowerCase();

        return search ? title && title.includes(search) : !parent || !option.id || parent.children.find(function (child) {
          return child.id === option.id;
        });
      });
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
      var _this6 = this;

      clearTimeout(this.searchTimer);

      this.searchTimer = setTimeout(function () {
        _this6.props.actions.treeDropdownField.setSearch(_this6.props.id, value);
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
            return value.indexOf(item) === index;
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
      event.preventDefault();

      if (this.hasSearch()) {
        return;
      }

      var path = this.findTreePath(this.props.tree, id);
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
      var value = this.props.data.multiple ? this.props.value : [this.props.value];

      return _react2.default.createElement(_TreeDropdownFieldMenu2.default, {
        loading: loading,
        failed: failed,
        tree: visibleTree,
        breadcrumbs: breadcrumbs,
        renderMenuOptions: renderMenuOptions,
        onBack: this.handleBack,
        search: this.hasSearch(),
        value: value
      });
    }
  }, {
    key: 'renderOption',
    value: function renderOption(tree) {
      var _this7 = this;

      var button = null;
      if (tree.count && !this.hasSearch()) {
        var handleNavigate = function handleNavigate(event) {
          return _this7.handleNavigate(event, tree.id);
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
      var _this8 = this;

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
          return item.id === _this8.props.value;
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
        _react2.default.createElement(_reactBootstrapSs.FormControl, _extends({
          type: 'hidden',
          name: this.props.name,
          value: this.props.value
        }, inputProps))
      );
    }
  }, {
    key: 'render',
    value: function render() {
      var _this9 = this;

      if (this.props.readOnly || this.props.disabled) {
        return this.renderReadOnly();
      }

      var inputProps = {
        id: this.props.id
      };
      var className = this.props.extraClass ? 'treedropdownfield ' + this.props.extraClass : 'treedropdownfield';
      var options = this.getDropdownOptions();
      var value = this.props.data.multiple ? this.props.selectedValues.filter(function (item) {
        return _this9.props.value.includes(item.id);
      }) : this.props.value;
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
        onOpen: this.handleSearchReset,
        onBlurResetsInput: true,
        onInputKeyDown: this.handleKeyDown,
        onInputChange: this.handleSearchChange,
        isLoading: Boolean(this.props.loading.length),
        value: value,
        resetValue: resetValue,
        ref: function ref(select) {
          _this9.selectField = select;
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
  extraClass: _react.PropTypes.string,
  id: _react.PropTypes.string,
  name: _react.PropTypes.string.isRequired,
  onChange: _react.PropTypes.func,
  value: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.number, _react.PropTypes.array]),
  readOnly: _react.PropTypes.bool,
  disabled: _react.PropTypes.bool,
  tree: _react.PropTypes.shape(_TreeDropdownFieldNode2.default.propTypes),
  visible: _react.PropTypes.array,
  loading: _react.PropTypes.array,
  failed: _react.PropTypes.array,
  selectedValues: _react.PropTypes.array,
  data: _react.PropTypes.shape({
    cacheKey: _react.PropTypes.string,
    urlTree: _react.PropTypes.string.isRequired,
    emptyString: _react.PropTypes.string,
    valueObject: _react.PropTypes.shape(_TreeDropdownFieldNode2.default.propTypes),
    valueObjects: _react.PropTypes.arrayOf(_react.PropTypes.shape(_TreeDropdownFieldNode2.default.propTypes)),
    hasEmptyDefault: _react.PropTypes.bool,
    showSearch: _react.PropTypes.bool,
    multiple: _react.PropTypes.bool
  }),
  onLoadingError: _react.PropTypes.func,
  search: _react.PropTypes.string,
  actions: _react.PropTypes.shape({
    treeDropdownField: _react.PropTypes.object
  })
};

TreeDropdownField.defaultProps = {
  value: '',
  extraClass: '',
  className: '',
  tree: {},
  visible: [],
  loading: [],
  failed: []
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

  if (!ownProps.data.multiple && ownProps.value === SINGLE_EMPTY_VALUE) {
    value = '';
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

exports.TreeDropdownField = TreeDropdownField;
exports.ConnectedTreeDropdownField = ConnectedTreeDropdownField;
exports.MULTI_EMPTY_VALUE = MULTI_EMPTY_VALUE;
exports.SINGLE_EMPTY_VALUE = SINGLE_EMPTY_VALUE;
exports.default = (0, _FieldHolder2.default)(ConnectedTreeDropdownField);

/***/ }),

/***/ 941:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _SilverStripeComponent = __webpack_require__(13);

var _SilverStripeComponent2 = _interopRequireDefault(_SilverStripeComponent);

var _Injector = __webpack_require__(45);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var App = function (_SilverStripeComponen) {
  _inherits(App, _SilverStripeComponen);

  function App() {
    _classCallCheck(this, App);

    return _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).apply(this, arguments));
  }

  _createClass(App, [{
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        { className: 'app' },
        this.props.children
      );
    }
  }]);

  return App;
}(_SilverStripeComponent2.default);

exports.default = (0, _Injector.provideInjector)(App);

/***/ }),

/***/ 942:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _reduxForm = __webpack_require__(100);

var _Injector = __webpack_require__(45);

var _getFormState = __webpack_require__(766);

var _getFormState2 = _interopRequireDefault(_getFormState);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var InjectableForm = function InjectableForm(props) {
  var FormComponent = props.formComponent;
  var newProps = _extends({}, props);
  delete newProps.formComponent;

  return _react2.default.createElement(FormComponent, newProps);
};

InjectableForm.propTypes = {
  formComponent: _react2.default.PropTypes.func.isRequired
};

var InjectedForm = (0, _Injector.inject)(['Form'], function (formComponent) {
  return { formComponent: formComponent };
})(InjectableForm);

exports.default = (0, _reduxForm.reduxForm)({
  getFormState: _getFormState2.default
})(InjectedForm);

/***/ }),

/***/ 943:
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

var _redux = __webpack_require__(41);

var _SchemaActions = __webpack_require__(248);

var schemaActions = _interopRequireWildcard(_SchemaActions);

var _reactRedux = __webpack_require__(42);

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
  fileAttributes: _react.PropTypes.object,
  Component: _react.PropTypes.oneOfType([_react.PropTypes.element, _react.PropTypes.func]),
  schemaUrl: _react.PropTypes.string,
  actions: _react.PropTypes.object
};

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      schema: (0, _redux.bindActionCreators)(schemaActions, dispatch)
    }
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

/***/ 946:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _jQuery = __webpack_require__(16);

var _jQuery2 = _interopRequireDefault(_jQuery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_jQuery2.default.entwine('ss', function ($) {
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
		onmatch: function onmatch() {
			this.toggleCheckboxes();

			this._super();
		},
		onunmatch: function onunmatch() {
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

/***/ 951:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _isomorphicFetch = __webpack_require__(179);

var _isomorphicFetch2 = _interopRequireDefault(_isomorphicFetch);

var _es6Promise = __webpack_require__(469);

var _es6Promise2 = _interopRequireDefault(_es6Promise);

var _qs = __webpack_require__(249);

var _qs2 = _interopRequireDefault(_qs);

var _merge = __webpack_require__(153);

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

/***/ 952:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.inject = exports.withInjector = exports.provideInjector = undefined;

var _provideInjector = __webpack_require__(407);

var _provideInjector2 = _interopRequireDefault(_provideInjector);

var _withInjector = __webpack_require__(408);

var _withInjector2 = _interopRequireDefault(_withInjector);

var _inject = __webpack_require__(405);

var _inject2 = _interopRequireDefault(_inject);

var _Container = __webpack_require__(258);

var _Container2 = _interopRequireDefault(_Container);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.provideInjector = _provideInjector2.default;
exports.withInjector = _withInjector2.default;
exports.inject = _inject2.default;
exports.default = _Container2.default;

/***/ }),

/***/ 953:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _validator = __webpack_require__(1909);

var _validator2 = _interopRequireDefault(_validator);

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
      var message = '';

      if (typeof config.message === 'string') {
        message = config.message;
      } else {
        switch (rule) {
          case 'required':
            {
              message = '{name} is required.';
              break;
            }
          case 'equals':
            {
              message = '{name} are not equal.';
              break;
            }
          case 'numeric':
            {
              message = '{name} is not a number.';
              break;
            }
          case 'date':
            {
              message = '{name} is not a proper date format.';
              break;
            }
          case 'alphanumeric':
            {
              message = '{name} is not an alpha-numeric value.';
              break;
            }
          case 'alpha':
            {
              message = '{name} is not only letters.';
              break;
            }
          default:
            {
              message = '{name} is not a valid value.';
              break;
            }
        }
      }

      if (config.title) {
        message = message.replace('{name}', config.title);
      }

      return message;
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

/***/ 954:
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

/***/ 956:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _Injector = __webpack_require__(952);

var _Injector2 = _interopRequireDefault(_Injector);

var _getIn = __webpack_require__(744);

var _getIn2 = _interopRequireDefault(_getIn);

var _setIn = __webpack_require__(1829);

var _setIn2 = _interopRequireDefault(_setIn);

var _reduxForm = __webpack_require__(100);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var omittedActions = [_reduxForm.actionTypes.REGISTER_FIELD, _reduxForm.actionTypes.DESTROY];

var applyFormMiddleware = function applyFormMiddleware(reducer) {
  return function (getGlobalState) {
    return function (state, action) {
      var reducedState = reducer(state, action);
      if (!action.meta || !action.meta.form || omittedActions.includes(action.type)) {
        return reducedState;
      }

      var formName = action.meta.form;
      var formSchemaMiddleware = _Injector2.default.form.getSchema(formName);
      if (!formSchemaMiddleware) {
        return reducedState;
      }

      var formState = (0, _getIn2.default)(reducedState.formState, formName);
      if (!formState) {
        return reducedState;
      }

      var schemaEntry = Object.entries(reducedState.formSchemas).find(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2),
            entry = _ref2[1];

        return entry.name === formName;
      });

      if (!schemaEntry) {
        return reducedState;
      }

      var _schemaEntry = _slicedToArray(schemaEntry, 2),
          schemaKey = _schemaEntry[0],
          schema = _schemaEntry[1];

      if (!schemaKey) {
        return reducedState;
      }

      var newState = _extends({}, reducedState);
      var updates = formSchemaMiddleware(schema, getGlobalState());

      if (!updates.state || !Array.isArray(updates.state.fields)) {
        throw new Error('\n      One more calls to alterSchema did not return a properly formed schema state\n      object. Check your calls to Injector.transform() which could affect \'' + schemaKey + '\'.\n    ');
      }

      newState = (0, _setIn2.default)(newState, 'formSchemas.' + schemaKey + '.state', updates);

      return newState;
    };
  };
};

exports.default = applyFormMiddleware;

/***/ }),

/***/ 957:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _buildBaseContainer = __webpack_require__(259);

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

      var service = (_base$get = base.get).call.apply(_base$get, [this, key, context].concat(args));

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

/***/ 958:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VALIDATION_MIDDLEWARE_SERVICE = exports.SCHEMA_MIDDLEWARE_SERVICE = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _buildBaseContainer = __webpack_require__(259);

var _buildBaseContainer2 = _interopRequireDefault(_buildBaseContainer);

var _FormStateManager = __webpack_require__(1911);

var _FormStateManager2 = _interopRequireDefault(_FormStateManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

      return (_base$get = base.get).call.apply(_base$get, [this, SCHEMA_MIDDLEWARE_SERVICE, context].concat(args));
    },
    getValidation: function getValidation(context) {
      var _base$get2;

      for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        args[_key2 - 1] = arguments[_key2];
      }

      return (_base$get2 = base.get).call.apply(_base$get2, [this, VALIDATION_MIDDLEWARE_SERVICE, context].concat(args));
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
      return function (schema, globalState) {
        return factories.reduce(function (currentState, currentFactory) {
          var manager = new _FormStateManager2.default(currentState, globalState);
          var modifications = currentFactory(manager);
          return _extends({}, currentState, modifications);
        }, schema);
      };
    },
    getValidationReducer: function getValidationReducer(factories) {
      return function (values) {
        var errors = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        return factories.reduce(function (currentErrors, currentFactory) {
          var modifications = currentFactory(values, errors);
          return _extends({}, currentErrors, modifications);
        }, errors);
      };
    }
  });
};

exports.SCHEMA_MIDDLEWARE_SERVICE = SCHEMA_MIDDLEWARE_SERVICE;
exports.VALIDATION_MIDDLEWARE_SERVICE = VALIDATION_MIDDLEWARE_SERVICE;
exports.default = buildFormContainer;

/***/ }),

/***/ 959:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var buildInjectorContainer = function buildInjectorContainer() {
  return {
    services: {},

    initialised: false,

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
    }
  };
};

exports.default = buildInjectorContainer;

/***/ }),

/***/ 960:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _buildBaseContainer = __webpack_require__(259);

var _buildBaseContainer2 = _interopRequireDefault(_buildBaseContainer);

var _MiddlewareRegistry = __webpack_require__(404);

var _MiddlewareRegistry2 = _interopRequireDefault(_MiddlewareRegistry);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var buildReducerContainer = function buildReducerContainer() {
  var base = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (0, _buildBaseContainer2.default)();
  return _extends({}, base, {
    store: null,

    setStore: function setStore(store) {
      this.isProtected();

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

/***/ 961:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getFormState;
function getFormState(state) {
  return state.form && state.form.formState || {};
}

/***/ }),

/***/ 962:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _deepFreezeStrict = __webpack_require__(85);

var _deepFreezeStrict2 = _interopRequireDefault(_deepFreezeStrict);

var _BreadcrumbsActionTypes = __webpack_require__(409);

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

/***/ 963:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setConfig = setConfig;

var _ConfigActionTypes = __webpack_require__(410);

var _ConfigActionTypes2 = _interopRequireDefault(_ConfigActionTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function setConfig(config) {
  return {
    type: _ConfigActionTypes2.default.SET_CONFIG,
    payload: { config: config }
  };
}

/***/ }),

/***/ 964:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _deepFreezeStrict = __webpack_require__(85);

var _deepFreezeStrict2 = _interopRequireDefault(_deepFreezeStrict);

var _ConfigActionTypes = __webpack_require__(410);

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

/***/ 965:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _deepFreezeStrict = __webpack_require__(85);

var _deepFreezeStrict2 = _interopRequireDefault(_deepFreezeStrict);

var _MobileMenuActionTypes = __webpack_require__(411);

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

/***/ 966:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _deepFreezeStrict = __webpack_require__(85);

var _deepFreezeStrict2 = _interopRequireDefault(_deepFreezeStrict);

var _RecordsActionTypes = __webpack_require__(413);

var _RecordsActionTypes2 = _interopRequireDefault(_RecordsActionTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var initialState = {};

function recordsReducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments[1];

  var records = null;
  var recordType = null;
  var record = null;

  switch (action.type) {
    case _RecordsActionTypes2.default.CREATE_RECORD:
      return (0, _deepFreezeStrict2.default)(Object.assign({}, state, {}));

    case _RecordsActionTypes2.default.UPDATE_RECORD:
      return (0, _deepFreezeStrict2.default)(Object.assign({}, state, {}));

    case _RecordsActionTypes2.default.DELETE_RECORD:
      return (0, _deepFreezeStrict2.default)(Object.assign({}, state, {}));

    case _RecordsActionTypes2.default.FETCH_RECORDS_REQUEST:
      return state;

    case _RecordsActionTypes2.default.FETCH_RECORDS_FAILURE:
      return state;

    case _RecordsActionTypes2.default.FETCH_RECORDS_SUCCESS:
      recordType = action.payload.recordType;
      if (!recordType) {
        throw new Error('Undefined record type');
      }
      records = action.payload.data._embedded[recordType] || {};
      records = records.reduce(function (prev, val) {
        return Object.assign({}, prev, _defineProperty({}, val.ID, val));
      }, {});
      return (0, _deepFreezeStrict2.default)(Object.assign({}, state, _defineProperty({}, recordType, records)));

    case _RecordsActionTypes2.default.FETCH_RECORD_REQUEST:
      return state;

    case _RecordsActionTypes2.default.FETCH_RECORD_FAILURE:
      return state;

    case _RecordsActionTypes2.default.FETCH_RECORD_SUCCESS:
      recordType = action.payload.recordType;
      record = action.payload.data;

      if (!recordType) {
        throw new Error('Undefined record type');
      }
      return (0, _deepFreezeStrict2.default)(Object.assign({}, state, _defineProperty({}, recordType, Object.assign({}, state[recordType], _defineProperty({}, record.ID, record)))));

    case _RecordsActionTypes2.default.DELETE_RECORD_REQUEST:
      return state;

    case _RecordsActionTypes2.default.DELETE_RECORD_FAILURE:
      return state;

    case _RecordsActionTypes2.default.DELETE_RECORD_SUCCESS:
      recordType = action.payload.recordType;
      records = state[recordType];
      records = Object.keys(records).reduce(function (result, key) {
        if (parseInt(key, 10) !== parseInt(action.payload.id, 10)) {
          return Object.assign({}, result, _defineProperty({}, key, records[key]));
        }
        return result;
      }, {});

      return (0, _deepFreezeStrict2.default)(Object.assign({}, state, _defineProperty({}, recordType, records)));

    default:
      return state;
  }
}

exports.default = recordsReducer;

/***/ }),

/***/ 967:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = schemaReducer;

var _deepFreezeStrict = __webpack_require__(85);

var _deepFreezeStrict2 = _interopRequireDefault(_deepFreezeStrict);

var _SchemaActionTypes = __webpack_require__(414);

var _SchemaActionTypes2 = _interopRequireDefault(_SchemaActionTypes);

var _merge = __webpack_require__(153);

var _merge2 = _interopRequireDefault(_merge);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var initialState = (0, _deepFreezeStrict2.default)({});

function schemaReducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

  switch (action.type) {
    case _SchemaActionTypes2.default.SET_SCHEMA:
      {
        return (0, _deepFreezeStrict2.default)(Object.assign({}, state, _defineProperty({}, action.payload.id, Object.assign({}, state[action.payload.id], action.payload))));
      }

    case _SchemaActionTypes2.default.SET_SCHEMA_STATE_OVERRIDES:
      {
        var schema = state[action.payload.id];
        var stateOverride = action.payload.stateOverride;
        var fields = schema && schema.state && schema.state.fields && schema.state.fields.map(function (field) {
          var fieldOverride = stateOverride && stateOverride.fields && stateOverride.fields.find(function (override) {
            return override.name === field.name;
          });

          return fieldOverride ? _merge2.default.recursive(true, field, fieldOverride) : field;
        });

        return (0, _deepFreezeStrict2.default)(Object.assign({}, state, _defineProperty({}, action.payload.id, Object.assign({}, schema, {
          stateOverride: stateOverride,
          state: Object.assign({}, schema && schema.state, action.payload.stateOverride, { fields: fields })
        }))));
      }

    case _SchemaActionTypes2.default.SET_SCHEMA_LOADING:
      {
        return (0, _deepFreezeStrict2.default)(Object.assign({}, state, _defineProperty({}, action.payload.id, Object.assign({}, state[action.payload.id], {
          metadata: Object.assign({}, state[action.payload.id] && state[action.payload.id].metadata, { loading: action.payload.loading })
        }))));
      }

    default:
      return state;
  }
}

/***/ }),

/***/ 968:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = treeDropdownFieldReducer;

var _deepFreezeStrict = __webpack_require__(85);

var _deepFreezeStrict2 = _interopRequireDefault(_deepFreezeStrict);

var _TreeDropdownFieldActionTypes = __webpack_require__(415);

var _TreeDropdownFieldActionTypes2 = _interopRequireDefault(_TreeDropdownFieldActionTypes);

var _reduxFieldReducer = __webpack_require__(1908);

var _reduxFieldReducer2 = _interopRequireDefault(_reduxFieldReducer);

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

/***/ 969:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _deepFreezeStrict = __webpack_require__(85);

var _deepFreezeStrict2 = _interopRequireDefault(_deepFreezeStrict);

var _reduxForm = __webpack_require__(100);

var _UnsavedFormsActionTypes = __webpack_require__(417);

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

/***/ 970:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _SilverStripeComponent = __webpack_require__(13);

var _SilverStripeComponent2 = _interopRequireDefault(_SilverStripeComponent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Accordion = function (_SilverStripeComponen) {
  _inherits(Accordion, _SilverStripeComponen);

  function Accordion() {
    _classCallCheck(this, Accordion);

    return _possibleConstructorReturn(this, (Accordion.__proto__ || Object.getPrototypeOf(Accordion)).apply(this, arguments));
  }

  _createClass(Accordion, [{
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        { className: 'accordion',
          role: 'tablist',
          'aria-multiselectable': 'true'
        },
        this.props.children
      );
    }
  }]);

  return Accordion;
}(_SilverStripeComponent2.default);

exports.default = Accordion;

/***/ }),

/***/ 971:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _SilverStripeComponent = __webpack_require__(13);

var _SilverStripeComponent2 = _interopRequireDefault(_SilverStripeComponent);

__webpack_require__(1896);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AccordionBlock = function (_SilverStripeComponen) {
  _inherits(AccordionBlock, _SilverStripeComponen);

  function AccordionBlock() {
    _classCallCheck(this, AccordionBlock);

    return _possibleConstructorReturn(this, (AccordionBlock.__proto__ || Object.getPrototypeOf(AccordionBlock)).apply(this, arguments));
  }

  _createClass(AccordionBlock, [{
    key: 'render',
    value: function render() {
      var headerID = this.props.groupid + '_Header';
      var listID = this.props.groupid + '_Items';
      var listIDAttr = listID.replace(/\\/g, '_');
      var headerIDAttr = headerID.replace(/\\/g, '_');
      var href = '#' + listIDAttr;

      var groupProps = {
        id: listIDAttr,
        'aria-expanded': true,
        className: 'list-group list-group-flush collapse in',
        role: 'tabpanel',
        'aria-labelledby': headerID
      };
      return _react2.default.createElement(
        'div',
        { className: 'accordion__block' },
        _react2.default.createElement(
          'a',
          { className: 'accordion__title',
            'data-toggle': 'collapse',
            href: href,
            'aria-expanded': 'true',
            'aria-controls': listID,
            id: headerIDAttr,
            role: 'tab'
          },
          this.props.title
        ),
        _react2.default.createElement(
          'div',
          groupProps,
          this.props.children
        )
      );
    }
  }]);

  return AccordionBlock;
}(_SilverStripeComponent2.default);

exports.default = AccordionBlock;

/***/ }),

/***/ 972:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Badge = function Badge(_ref) {
  var status = _ref.status,
      message = _ref.message,
      className = _ref.className;

  if (!status) {
    return null;
  }
  return _react2.default.createElement(
    'span',
    { className: (className || '') + ' label label-' + status + ' label-pill' },
    message
  );
};

Badge.propTypes = {
  message: _react.PropTypes.node,
  status: _react.PropTypes.oneOf(['default', 'info', 'success', 'warning', 'danger', 'primary', 'secondary']),
  className: _react.PropTypes.string
};

exports.default = Badge;

/***/ }),

/***/ 973:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Breadcrumb = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _SilverStripeComponent = __webpack_require__(13);

var _SilverStripeComponent2 = _interopRequireDefault(_SilverStripeComponent);

var _reactRedux = __webpack_require__(42);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Breadcrumb = function (_SilverStripeComponen) {
  _inherits(Breadcrumb, _SilverStripeComponen);

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

      return this.props.crumbs.slice(0, -1).map(function (crumb, index) {
        return _react2.default.createElement(
          'li',
          { key: index, className: 'breadcrumb__item' },
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
          crumb.icon && _react2.default.createElement('span', { className: iconClassNames.join(' '), onClick: crumb.icon.action })
        )
      );
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        { className: 'breadcrumb__container fill-height flexbox-area-grow' },
        _react2.default.createElement(
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
}(_SilverStripeComponent2.default);

Breadcrumb.propTypes = {
  crumbs: _react2.default.PropTypes.array
};

function mapStateToProps(state) {
  return {
    crumbs: state.breadcrumbs
  };
}

exports.Breadcrumb = Breadcrumb;
exports.default = (0, _reactRedux.connect)(mapStateToProps)(Breadcrumb);

/***/ }),

/***/ 974:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _SilverStripeComponent = __webpack_require__(13);

var _SilverStripeComponent2 = _interopRequireDefault(_SilverStripeComponent);

var _reactBootstrapSs = __webpack_require__(38);

var _castStringToElement = __webpack_require__(86);

var _castStringToElement2 = _interopRequireDefault(_castStringToElement);

var _FormAlert = __webpack_require__(391);

var _FormAlert2 = _interopRequireDefault(_FormAlert);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function fieldHolder(Field) {
  var FieldHolder = function (_SilverStripeComponen) {
    _inherits(FieldHolder, _SilverStripeComponen);

    function FieldHolder() {
      _classCallCheck(this, FieldHolder);

      return _possibleConstructorReturn(this, (FieldHolder.__proto__ || Object.getPrototypeOf(FieldHolder)).apply(this, arguments));
    }

    _createClass(FieldHolder, [{
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
        var meta = this.props.meta;
        var message = meta ? meta.error : null;

        if (!message || meta && !meta.touched) {
          return null;
        }

        return _react2.default.createElement(_FormAlert2.default, _extends({ className: 'form__field-message' }, message));
      }
    }, {
      key: 'renderLeftTitle',
      value: function renderLeftTitle() {
        var labelText = this.props.leftTitle !== null ? this.props.leftTitle : this.props.title;

        if (!labelText || this.props.hideLabels) {
          return null;
        }

        return (0, _castStringToElement2.default)(_reactBootstrapSs.ControlLabel, labelText, { className: 'form__field-label' });
      }
    }, {
      key: 'renderRightTitle',
      value: function renderRightTitle() {
        if (!this.props.rightTitle || this.props.hideLabels) {
          return null;
        }

        return (0, _castStringToElement2.default)(_reactBootstrapSs.ControlLabel, this.props.rightTitle, { className: 'form__field-label' });
      }
    }, {
      key: 'getHolderProps',
      value: function getHolderProps() {
        var classNames = ['field', this.props.extraClass];
        if (this.props.readOnly) {
          classNames.push('readonly');
        }

        return {
          bsClass: this.props.bsClass,
          bsSize: this.props.bsSize,
          validationState: this.props.validationState,
          className: classNames.join(' '),
          controlId: this.props.id,
          id: this.props.holderId
        };
      }
    }, {
      key: 'renderField',
      value: function renderField() {
        var field = _react2.default.createElement(Field, this.props);
        var prefix = this.props.data.prefix;
        var suffix = this.props.data.suffix;
        if (!prefix && !suffix) {
          return field;
        }
        return _react2.default.createElement(
          _reactBootstrapSs.InputGroup,
          null,
          prefix && _react2.default.createElement(
            _reactBootstrapSs.InputGroup.Addon,
            null,
            prefix
          ),
          field,
          suffix && _react2.default.createElement(
            _reactBootstrapSs.InputGroup.Addon,
            null,
            suffix
          )
        );
      }
    }, {
      key: 'render',
      value: function render() {
        return _react2.default.createElement(
          _reactBootstrapSs.FormGroup,
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
  }(_SilverStripeComponent2.default);

  FieldHolder.propTypes = {
    leftTitle: _react.PropTypes.any,
    rightTitle: _react.PropTypes.any,
    title: _react.PropTypes.any,
    extraClass: _react.PropTypes.string,
    holderId: _react.PropTypes.string,
    id: _react.PropTypes.string,
    description: _react.PropTypes.any,
    hideLabels: _react.PropTypes.bool,
    message: _react.PropTypes.shape({
      extraClass: _react.PropTypes.string,
      value: _react.PropTypes.any,
      type: _react.PropTypes.string
    }),
    data: _react.PropTypes.oneOfType([_react.PropTypes.array, _react.PropTypes.shape({
      prefix: _react.PropTypes.string,
      suffix: _react.PropTypes.string
    })])
  };

  FieldHolder.defaultProps = {
    className: '',
    extraClass: '',
    leftTitle: null,
    rightTitle: null,
    data: {}
  };

  return FieldHolder;
}

exports.default = fieldHolder;

/***/ }),

/***/ 975:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _reactDom = __webpack_require__(26);

var _reactDom2 = _interopRequireDefault(_reactDom);

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
      var element = _reactDom2.default.findDOMNode(this);

      element.addEventListener('click', this.handleElementClick);
      document.addEventListener('click', this.handleDocumentClick);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      var element = _reactDom2.default.findDOMNode(this);
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
      return _react2.default.createElement(
        'div',
        { className: this.props.className },
        this.props.children
      );
    }
  }]);

  return Focusedzone;
}(_react.Component);

Focusedzone.propTypes = {
  children: _react.PropTypes.any,
  className: _react.PropTypes.string,
  onClickOut: _react.PropTypes.func.isRequired
};

Focusedzone.defaultProps = {
  className: ''
};

exports.default = Focusedzone;

/***/ }),

/***/ 976:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _reactDom = __webpack_require__(26);

var _reactDom2 = _interopRequireDefault(_reactDom);

var _FormAlert = __webpack_require__(391);

var _FormAlert2 = _interopRequireDefault(_FormAlert);

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

      var node = _reactDom2.default.findDOMNode(this);
      if (node) {
        var input = node.querySelector('input, select, textarea');
        if (input) {
          input.focus();
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
      var valid = this.props.valid !== false;
      var fields = this.props.mapFieldsToComponents(this.props.fields);
      var actions = this.props.mapActionsToComponents(this.props.actions);
      var messages = this.renderMessages();

      var className = ['form'];
      if (valid === false) {
        className.push('form--invalid');
      }
      if (this.props.attributes && this.props.attributes.className) {
        className.push(this.props.attributes.className);
      }
      var formProps = Object.assign({}, this.props.attributes, {
        onSubmit: this.props.handleSubmit,
        className: className.join(' ')
      });

      return _react2.default.createElement(
        'form',
        formProps,
        fields && _react2.default.createElement(
          'fieldset',
          null,
          messages,
          this.props.afterMessages,
          fields
        ),
        actions && actions.length ? _react2.default.createElement(
          'div',
          { className: 'btn-toolbar', role: 'group' },
          actions
        ) : null
      );
    }
  }]);

  return Form;
}(_react.Component);

Form.propTypes = {
  autoFocus: _react.PropTypes.bool,
  valid: _react.PropTypes.bool,
  actions: _react.PropTypes.array,
  afterMessages: _react.PropTypes.node,
  attributes: _react.PropTypes.shape({
    action: _react.PropTypes.string.isRequired,
    className: _react.PropTypes.string,
    encType: _react.PropTypes.string,
    id: _react.PropTypes.string,
    method: _react.PropTypes.string.isRequired
  }),
  fields: _react.PropTypes.array.isRequired,
  handleSubmit: _react.PropTypes.func,
  mapActionsToComponents: _react.PropTypes.func.isRequired,
  mapFieldsToComponents: _react.PropTypes.func.isRequired,
  messages: _react.PropTypes.arrayOf(_react.PropTypes.shape({
    extraClass: _react.PropTypes.string,
    value: _react.PropTypes.any,
    type: _react.PropTypes.string
  }))
};

exports.default = Form;

/***/ }),

/***/ 977:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  CSRF_HEADER: 'X-SecurityID' };

/***/ }),

/***/ 978:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _SilverStripeComponent = __webpack_require__(13);

var _SilverStripeComponent2 = _interopRequireDefault(_SilverStripeComponent);

var _castStringToElement = __webpack_require__(86);

var _castStringToElement2 = _interopRequireDefault(_castStringToElement);

var _classnames = __webpack_require__(4);

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var FormAction = function (_SilverStripeComponen) {
  _inherits(FormAction, _SilverStripeComponen);

  function FormAction(props) {
    _classCallCheck(this, FormAction);

    var _this = _possibleConstructorReturn(this, (FormAction.__proto__ || Object.getPrototypeOf(FormAction)).call(this, props));

    _this.handleClick = _this.handleClick.bind(_this);
    return _this;
  }

  _createClass(FormAction, [{
    key: 'render',
    value: function render() {
      var title = this.props.title;

      if (this.getSavedTitle() && !this.props.changed) {
        title = this.getSavedTitle();
      }
      return _react2.default.createElement(
        'button',
        this.getButtonProps(),
        this.getLoadingIcon(),
        (0, _castStringToElement2.default)('span', title)
      );
    }
  }, {
    key: 'getButtonProps',
    value: function getButtonProps() {
      return Object.assign({}, typeof this.props.attributes === 'undefined' ? {} : this.props.attributes, {
        id: this.props.id,
        name: this.props.name,
        className: this.getButtonClasses(),
        disabled: this.props.disabled,
        onClick: this.handleClick
      });
    }
  }, {
    key: 'getButtonClasses',
    value: function getButtonClasses() {
      var buttonClasses = {
        btn: true,
        'btn--no-text': typeof this.props.title !== 'string',
        'btn--loading': this.props.loading,
        disabled: this.props.disabled
      };

      var style = this.getButtonStyle();

      if (style) {
        buttonClasses['btn-' + style] = true;
      }

      var savedClasses = this.getSavedClasses();
      if (savedClasses && this.props.changed) {
        savedClasses.split(' ').forEach(function (cl) {
          buttonClasses['btn-' + cl] = true;
        });
      }

      var icon = this.getIcon();
      var savedIcon = this.getSavedIcon();
      if (this.isConstructive() && !this.props.changed && savedIcon) {
        buttonClasses['font-icon-' + savedIcon] = true;
      } else if (icon) {
        buttonClasses['font-icon-' + icon] = true;
      }

      if (typeof this.props.extraClass === 'string') {
        buttonClasses[this.props.extraClass] = true;
      }

      return (0, _classnames2.default)(buttonClasses);
    }
  }, {
    key: 'isConstructive',
    value: function isConstructive() {
      var extraClasses = this.props.extraClass.split(' ');
      return this.props.name === 'action_save' || extraClasses.find(function (className) {
        return className === 'ss-ui-action-constructive';
      });
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

      if (this.isConstructive()) {
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
    key: 'getSavedTitle',
    value: function getSavedTitle() {
      return this.props.savedTitle || this.props.data.savedTitle || null;
    }
  }, {
    key: 'getSavedIcon',
    value: function getSavedIcon() {
      return this.props.savedIcon || this.props.data.savedIcon || null;
    }
  }, {
    key: 'getSavedClasses',
    value: function getSavedClasses() {
      return this.props.savedClasses || this.props.data.savedClasses || null;
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
    key: 'handleClick',
    value: function handleClick(event) {
      if (typeof this.props.handleClick === 'function') {
        this.props.handleClick(event, this.props.name || this.props.id);
      }
    }
  }]);

  return FormAction;
}(_SilverStripeComponent2.default);

FormAction.propTypes = {
  id: _react2.default.PropTypes.string,
  name: _react2.default.PropTypes.string,
  handleClick: _react2.default.PropTypes.func,
  title: _react2.default.PropTypes.string,

  savedTitle: _react2.default.PropTypes.string,
  savedIcon: _react2.default.PropTypes.string,
  savedClasses: _react2.default.PropTypes.string,
  type: _react2.default.PropTypes.string,
  loading: _react2.default.PropTypes.bool,
  icon: _react2.default.PropTypes.string,
  disabled: _react2.default.PropTypes.bool,
  changed: _react2.default.PropTypes.bool,
  data: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.array, _react2.default.PropTypes.shape({
    buttonStyle: _react2.default.PropTypes.string
  })]),
  extraClass: _react2.default.PropTypes.string,
  attributes: _react2.default.PropTypes.object
};

FormAction.defaultProps = {
  title: '',
  savedTitle: null,
  icon: '',
  extraClass: '',
  attributes: {},
  data: {},
  disabled: false,
  changed: false
};

exports.default = FormAction;

/***/ }),

/***/ 979:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _SilverStripeComponent = __webpack_require__(13);

var _SilverStripeComponent2 = _interopRequireDefault(_SilverStripeComponent);

var _reactBootstrapSs = __webpack_require__(38);

var _castStringToElement = __webpack_require__(86);

var _castStringToElement2 = _interopRequireDefault(_castStringToElement);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var FormAlert = function (_SilverStripeComponen) {
  _inherits(FormAlert, _SilverStripeComponen);

  function FormAlert(props) {
    _classCallCheck(this, FormAlert);

    var _this = _possibleConstructorReturn(this, (FormAlert.__proto__ || Object.getPrototypeOf(FormAlert)).call(this, props));

    _this.handleDismiss = _this.handleDismiss.bind(_this);

    _this.state = {
      visible: true
    };
    return _this;
  }

  _createClass(FormAlert, [{
    key: 'handleDismiss',
    value: function handleDismiss() {
      if (typeof this.props.onDismiss === 'function') {
        this.props.onDismiss();
      } else {
        this.setState({ visible: false });
      }
    }
  }, {
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
        className: ['message-box', 'message-box--' + type, this.props.className, this.props.extraClass].join(' '),
        bsStyle: this.props.bsStyle || this.getMessageStyle(),
        bsClass: this.props.bsClass,
        onDismiss: this.props.closeLabel ? this.handleDismiss : null,
        closeLabel: this.props.closeLabel
      };
    }
  }, {
    key: 'render',
    value: function render() {
      if (typeof this.props.visible !== 'boolean' && this.state.visible || this.props.visible) {
        var body = (0, _castStringToElement2.default)('div', this.props.value);
        if (body) {
          return _react2.default.createElement(
            _reactBootstrapSs.Alert,
            this.getMessageProps(),
            body
          );
        }
      }
      return null;
    }
  }]);

  return FormAlert;
}(_SilverStripeComponent2.default);

FormAlert.propTypes = {
  extraClass: _react.PropTypes.string,
  value: _react.PropTypes.any,
  type: _react.PropTypes.string,
  onDismiss: _react.PropTypes.func,
  closeLabel: _react.PropTypes.string,
  visible: _react.PropTypes.bool
};

FormAlert.defaultProps = {
  extraClass: '',
  className: ''
};

exports.default = FormAlert;

/***/ }),

/***/ 980:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.schemaPropType = exports.basePropTypes = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _merge = __webpack_require__(153);

var _merge2 = _interopRequireDefault(_merge);

var _schemaFieldValues = __webpack_require__(767);

var _schemaFieldValues2 = _interopRequireDefault(_schemaFieldValues);

var _SilverStripeComponent = __webpack_require__(13);

var _SilverStripeComponent2 = _interopRequireDefault(_SilverStripeComponent);

var _Validator = __webpack_require__(953);

var _Validator2 = _interopRequireDefault(_Validator);

var _Backend = __webpack_require__(1895);

var _Backend2 = _interopRequireDefault(_Backend);

var _Injector = __webpack_require__(45);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var FormBuilder = function (_SilverStripeComponen) {
  _inherits(FormBuilder, _SilverStripeComponen);

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
    key: 'validateForm',
    value: function validateForm(values) {
      var _this2 = this;

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
        middlewareValidationResult = validationMiddleware(values, {}) || {};
      }

      var validator = new _Validator2.default(values);

      var validation = Object.entries(values).reduce(function (prev, curr) {
        var _curr = _slicedToArray(curr, 1),
            key = _curr[0];

        var field = (0, _schemaFieldValues.findField)(_this2.props.schema.schema.fields, key);

        var _validator$validateFi = validator.validateFieldSchema(field),
            valid = _validator$validateFi.valid,
            errors = _validator$validateFi.errors;

        var middlewareErrors = middlewareValidationResult[key];
        valid = valid && !middlewareErrors;
        if (valid) {
          return prev;
        }

        if (middlewareErrors) {
          if (!Array.isArray(middlewareErrors)) {
            middlewareErrors = [middlewareErrors];
          }
          errors = [].concat(_toConsumableArray(errors), _toConsumableArray(middlewareErrors));
        }

        var errorHtml = errors.map(function (message, index) {
          return _react2.default.createElement(
            'span',
            { key: index, className: 'form__validation-message' },
            message
          );
        });

        return _extends({}, prev, _defineProperty({}, key, {
          type: 'error',
          value: { react: errorHtml }
        }));
      }, {});

      return validation;
    }
  }, {
    key: 'handleAction',
    value: function handleAction(event) {
      if (typeof this.props.handleAction === 'function') {
        this.props.handleAction(event, this.props.values);
      }

      if (!event.isPropagationStopped()) {
        this.setState({ submittingAction: event.currentTarget.name });
      }
    }
  }, {
    key: 'handleSubmit',
    value: function handleSubmit(data) {
      var _this3 = this;

      var action = this.state.submittingAction ? this.state.submittingAction : this.props.schema.schema.actions[0].name;

      var dataWithAction = Object.assign({}, data, _defineProperty({}, action, 1));
      var requestedSchema = this.props.responseRequestedSchema.join();
      var headers = {
        'X-Formschema-Request': requestedSchema,
        'X-Requested-With': 'XMLHttpRequest'
      };

      var submitFn = function submitFn(customData) {
        return _this3.submitApi(customData || dataWithAction, headers).then(function (formSchema) {
          _this3.setState({ submittingAction: null });
          return formSchema;
        }).catch(function (reason) {
          _this3.setState({ submittingAction: null });
          throw reason;
        });
      };

      if (typeof this.props.handleSubmit === 'function') {
        return this.props.handleSubmit(dataWithAction, action, submitFn);
      }

      return submitFn();
    }
  }, {
    key: 'buildComponent',
    value: function buildComponent(props) {
      var componentProps = _extends({}, props, props.input);
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
      var _this4 = this;

      var FieldComponent = this.props.baseFieldComponent;
      return fields.map(function (field) {
        var props = field;
        if (field.children) {
          props = Object.assign({}, field, { children: _this4.mapFieldsToComponents(field.children) });
        }
        props = Object.assign({
          onAutofill: _this4.props.onAutofill,
          formid: _this4.props.form
        }, props);

        if (field.schemaType === 'Structural' || field.readOnly === true) {
          return _this4.buildComponent(props);
        }

        return _react2.default.createElement(FieldComponent, _extends({ key: props.id }, props, { component: _this4.buildComponent }));
      });
    }
  }, {
    key: 'getComponentForDataType',
    value: function getComponentForDataType(dataType, name) {
      var _this5 = this;

      var identifier = this.props.identifier;

      var get = function get(type) {
        return _this5.context.injector.get(type, identifier + '.' + name);
      };

      switch (dataType) {
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
    key: 'mapActionsToComponents',
    value: function mapActionsToComponents(actions) {
      var _this6 = this;

      return actions.map(function (action) {
        var props = Object.assign({}, action);

        if (action.children) {
          props.children = _this6.mapActionsToComponents(action.children);
        } else {
          props.handleClick = _this6.handleAction;

          if (_this6.props.submitting && _this6.state.submittingAction === action.name) {
            props.loading = true;
          }
        }

        props.changed = _this6.props.changed;
        return _this6.buildComponent(props);
      });
    }
  }, {
    key: 'normalizeFields',
    value: function normalizeFields(fields, state) {
      var _this7 = this;

      return fields.map(function (field) {
        var fieldState = state && state.fields ? state.fields.find(function (item) {
          return item.id === field.id;
        }) : {};
        var data = _merge2.default.recursive(true, (0, _schemaFieldValues.schemaMerge)(field, fieldState), {
          schemaComponent: fieldState && fieldState.component ? fieldState.component : field.component
        });
        if (field.children) {
          data.children = _this7.normalizeFields(field.children, state);
        }

        return data;
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var schema = this.props.schema.schema;
      var state = this.props.schema.state;
      var BaseFormComponent = this.props.baseFormComponent;

      var attributes = Object.assign({}, schema.attributes, {
        className: schema.attributes.class,
        encType: schema.attributes.enctype
      });
      delete attributes.class;
      delete attributes.enctype;

      var _props = this.props,
          asyncValidate = _props.asyncValidate,
          onSubmitFail = _props.onSubmitFail,
          onSubmitSuccess = _props.onSubmitSuccess,
          shouldAsyncValidate = _props.shouldAsyncValidate,
          touchOnBlur = _props.touchOnBlur,
          touchOnChange = _props.touchOnChange,
          persistentSubmitErrors = _props.persistentSubmitErrors,
          form = _props.form,
          afterMessages = _props.afterMessages,
          autoFocus = _props.autoFocus;


      var props = {
        form: form,
        afterMessages: afterMessages,
        fields: this.normalizeFields(schema.fields, state),
        actions: this.normalizeFields(schema.actions, state),
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
        changed: this.props.changed
      };

      return _react2.default.createElement(BaseFormComponent, props);
    }
  }]);

  return FormBuilder;
}(_SilverStripeComponent2.default);

var schemaPropType = _react.PropTypes.shape({
  id: _react.PropTypes.string,
  schema: _react.PropTypes.shape({
    attributes: _react.PropTypes.shape({
      class: _react.PropTypes.string,
      enctype: _react.PropTypes.string
    }),
    fields: _react.PropTypes.array.isRequired
  }),
  state: _react.PropTypes.shape({
    fields: _react.PropTypes.array
  }),
  loading: _react.PropTypes.boolean,
  stateOverride: _react.PropTypes.shape({
    fields: _react.PropTypes.array
  })
});

var basePropTypes = {
  createFn: _react.PropTypes.func,
  handleSubmit: _react.PropTypes.func,
  handleAction: _react.PropTypes.func,
  asyncValidate: _react.PropTypes.func,
  onSubmitFail: _react.PropTypes.func,
  onSubmitSuccess: _react.PropTypes.func,
  shouldAsyncValidate: _react.PropTypes.func,
  touchOnBlur: _react.PropTypes.bool,
  touchOnChange: _react.PropTypes.bool,
  persistentSubmitErrors: _react.PropTypes.bool,
  validate: _react.PropTypes.func,
  values: _react.PropTypes.object,
  submitting: _react.PropTypes.bool,
  baseFormComponent: _react.PropTypes.func.isRequired,
  baseFieldComponent: _react.PropTypes.func.isRequired,
  responseRequestedSchema: _react.PropTypes.arrayOf(_react.PropTypes.oneOf(['schema', 'state', 'errors', 'auto'])),
  identifier: function identifier(props, propName, componentName) {
    if (!/^[A-Za-z0-9_.]+$/.test(props[propName])) {
      return new Error('\n        Invalid identifier supplied to ' + componentName + '. Must be a set of\n        dot-separated alphanumeric strings.\n      ');
    }

    return null;
  }
};

FormBuilder.propTypes = Object.assign({}, basePropTypes, {
  form: _react.PropTypes.string.isRequired,
  schema: schemaPropType.isRequired,
  autoFocus: _react.PropTypes.bool,
  changed: _react.PropTypes.bool
});

FormBuilder.defaultProps = {
  responseRequestedSchema: ['auto'],
  autoFocus: false,
  changed: false
};

exports.basePropTypes = basePropTypes;
exports.schemaPropType = schemaPropType;
exports.default = (0, _Injector.withInjector)(FormBuilder);

/***/ }),

/***/ 981:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _i18n = __webpack_require__(23);

var _i18n2 = _interopRequireDefault(_i18n);

var _reactBootstrapSs = __webpack_require__(38);

var _SilverStripeComponent = __webpack_require__(13);

var _SilverStripeComponent2 = _interopRequireDefault(_SilverStripeComponent);

var _FormBuilderLoader = __webpack_require__(1899);

var _FormBuilderLoader2 = _interopRequireDefault(_FormBuilderLoader);

var _castStringToElement = __webpack_require__(86);

var _castStringToElement2 = _interopRequireDefault(_castStringToElement);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var FormBuilderModal = function (_SilverStripeComponen) {
  _inherits(FormBuilderModal, _SilverStripeComponen);

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
    key: 'handleLoadingError',
    value: function handleLoadingError(schema) {
      if (this.props.showErrorMessage) {
        var error = schema.errors && schema.errors[0];
        this.setState({
          response: error.value,
          error: true
        });
      }
      if (typeof this.props.onLoadingError === 'function') {
        this.props.onLoadingError(schema);
      }
    }
  }, {
    key: 'getForm',
    value: function getForm() {
      if (!this.props.schemaUrl) {
        return null;
      }
      return _react2.default.createElement(_FormBuilderLoader2.default, {
        schemaUrl: this.props.schemaUrl,
        handleSubmit: this.handleSubmit,
        handleAction: this.props.handleAction,
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
        className = this.props.responseClassBad || 'response error';
      } else {
        className = this.props.responseClassGood || 'response good';
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
    key: 'handleHide',
    value: function handleHide() {
      this.clearResponse();
      if (typeof this.props.handleHide === 'function') {
        this.props.handleHide();
      }
    }
  }, {
    key: 'handleSubmit',
    value: function handleSubmit(data, action, submitFn) {
      var _this2 = this;

      this.clearResponse();
      var promise = null;
      if (typeof this.props.handleSubmit === 'function') {
        promise = this.props.handleSubmit(data, action, submitFn);
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
          _reactBootstrapSs.Modal.Header,
          { closeButton: true },
          _react2.default.createElement(
            _reactBootstrapSs.Modal.Title,
            null,
            this.props.title
          )
        );
      }

      if (typeof this.props.handleHide === 'function') {
        return _react2.default.createElement(
          'button',
          {
            type: 'button',
            className: 'close form-builder-modal__close-button',
            onClick: this.handleHide,
            'aria-label': _i18n2.default._t('Admin.CLOSE', 'Close')
          },
          _react2.default.createElement(
            'span',
            { 'aria-hidden': 'true' },
            '\xD7'
          )
        );
      }

      return null;
    }
  }, {
    key: 'render',
    value: function render() {
      var form = this.getForm();
      var response = this.getResponse();

      return _react2.default.createElement(
        _reactBootstrapSs.Modal,
        {
          show: this.props.show,
          onHide: this.handleHide,
          className: this.props.className,
          dialogClassName: this.props.dialogClassName,
          bsSize: this.props.bsSize
        },
        this.renderHeader(),
        _react2.default.createElement(
          _reactBootstrapSs.Modal.Body,
          { className: this.props.bodyClassName },
          response,
          form,
          this.props.children
        )
      );
    }
  }]);

  return FormBuilderModal;
}(_SilverStripeComponent2.default);

FormBuilderModal.propTypes = {
  show: _react2.default.PropTypes.bool,
  title: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.string, _react2.default.PropTypes.bool]),
  className: _react2.default.PropTypes.string,
  bodyClassName: _react2.default.PropTypes.string,
  handleHide: _react2.default.PropTypes.func,
  schemaUrl: _react2.default.PropTypes.string,
  handleSubmit: _react2.default.PropTypes.func,
  handleAction: _react2.default.PropTypes.func,
  responseClassGood: _react2.default.PropTypes.string,
  responseClassBad: _react2.default.PropTypes.string,
  showErrorMessage: _react2.default.PropTypes.bool,
  identifier: _react2.default.PropTypes.string
};

FormBuilderModal.defaultProps = {
  show: false,
  title: null
};

exports.default = FormBuilderModal;

/***/ }),

/***/ 982:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _i18n = __webpack_require__(23);

var _i18n2 = _interopRequireDefault(_i18n);

var _redux = __webpack_require__(41);

var _reactRedux = __webpack_require__(42);

var _SilverStripeComponent = __webpack_require__(13);

var _SilverStripeComponent2 = _interopRequireDefault(_SilverStripeComponent);

var _GridFieldTable = __webpack_require__(924);

var _GridFieldTable2 = _interopRequireDefault(_GridFieldTable);

var _GridFieldHeader = __webpack_require__(922);

var _GridFieldHeader2 = _interopRequireDefault(_GridFieldHeader);

var _GridFieldHeaderCell = __webpack_require__(923);

var _GridFieldHeaderCell2 = _interopRequireDefault(_GridFieldHeaderCell);

var _GridFieldRow = __webpack_require__(256);

var _GridFieldRow2 = _interopRequireDefault(_GridFieldRow);

var _GridFieldCell = __webpack_require__(921);

var _GridFieldCell2 = _interopRequireDefault(_GridFieldCell);

var _GridFieldAction = __webpack_require__(920);

var _GridFieldAction2 = _interopRequireDefault(_GridFieldAction);

var _FormConstants = __webpack_require__(919);

var _FormConstants2 = _interopRequireDefault(_FormConstants);

var _RecordsActions = __webpack_require__(1905);

var actions = _interopRequireWildcard(_RecordsActions);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var NotYetLoaded = {};

var GridField = function (_SilverStripeComponen) {
  _inherits(GridField, _SilverStripeComponen);

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
      _get(GridField.prototype.__proto__ || Object.getPrototypeOf(GridField.prototype), 'componentDidMount', this).call(this);

      var data = this.props.data;

      this.props.actions.fetchRecords(data.recordType, data.collectionReadEndpoint.method, data.collectionReadEndpoint.url);
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      if (this.props.records === NotYetLoaded) {
        return _react2.default.createElement(
          'div',
          null,
          _i18n2.default._t('CampaignAdmin.LOADING', 'Loading...')
        );
      }

      if (!Object.getOwnPropertyNames(this.props.records).length) {
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
          { key: '' + column.name },
          column.name
        );
      });
      var header = _react2.default.createElement(
        _GridFieldHeader2.default,
        null,
        headerCells.concat(actionPlaceholder)
      );
      var rows = Object.keys(this.props.records).map(function (key) {
        return _this2.createRow(_this2.props.records[key]);
      });

      return _react2.default.createElement(_GridFieldTable2.default, { header: header, rows: rows });
    }
  }, {
    key: 'createRowActions',
    value: function createRowActions(record) {
      return _react2.default.createElement(
        _GridFieldCell2.default,
        { className: 'grid-field__cell--actions', key: 'Actions' },
        _react2.default.createElement(_GridFieldAction2.default, {
          icon: 'cog',
          handleClick: this.editRecord,
          record: record
        }),
        _react2.default.createElement(_GridFieldAction2.default, {
          icon: 'cancel',
          handleClick: this.deleteRecord,
          record: record
        })
      );
    }
  }, {
    key: 'createCell',
    value: function createCell(record, column) {
      var handleDrillDown = this.props.data.handleDrillDown;
      var cellProps = {
        className: handleDrillDown ? 'grid-field__cell--drillable' : '',
        handleDrillDown: handleDrillDown ? function (event) {
          return handleDrillDown(event, record);
        } : null,
        key: '' + column.name,
        width: column.width
      };
      var val = column.field.split('.').reduce(function (a, b) {
        return a[b];
      }, record);

      return _react2.default.createElement(
        _GridFieldCell2.default,
        cellProps,
        val
      );
    }
  }, {
    key: 'createRow',
    value: function createRow(record) {
      var _this3 = this;

      var rowProps = {
        className: this.props.data.handleDrillDown ? 'grid-field__row--drillable' : '',
        key: '' + record.ID
      };
      var cells = this.props.data.columns.map(function (column) {
        return _this3.createCell(record, column);
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

      if (typeof this.props.data === 'undefined' || typeof this.props.data.handleEditRecord === 'undefined') {
        return;
      }

      this.props.data.handleEditRecord(event, id);
    }
  }]);

  return GridField;
}(_SilverStripeComponent2.default);

GridField.propTypes = {
  data: _react2.default.PropTypes.shape({
    recordType: _react2.default.PropTypes.string.isRequired,
    headerColumns: _react2.default.PropTypes.array,
    collectionReadEndpoint: _react2.default.PropTypes.object,
    handleDrillDown: _react2.default.PropTypes.func,
    handleEditRecord: _react2.default.PropTypes.func
  })
};

function mapStateToProps(state, ownProps) {
  var recordType = ownProps.data ? ownProps.data.recordType : null;
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

/***/ 983:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _SilverStripeComponent = __webpack_require__(13);

var _SilverStripeComponent2 = _interopRequireDefault(_SilverStripeComponent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var GridFieldCell = function (_SilverStripeComponen) {
  _inherits(GridFieldCell, _SilverStripeComponen);

  function GridFieldCell(props) {
    _classCallCheck(this, GridFieldCell);

    var _this = _possibleConstructorReturn(this, (GridFieldCell.__proto__ || Object.getPrototypeOf(GridFieldCell)).call(this, props));

    _this.handleDrillDown = _this.handleDrillDown.bind(_this);
    return _this;
  }

  _createClass(GridFieldCell, [{
    key: 'render',
    value: function render() {
      var classNames = ['grid-field__cell'];

      if (typeof this.props.className !== 'undefined') {
        classNames.push(this.props.className);
      }

      var props = {
        className: classNames.join(' '),
        onClick: this.handleDrillDown
      };

      return _react2.default.createElement(
        'td',
        props,
        this.props.children
      );
    }
  }, {
    key: 'handleDrillDown',
    value: function handleDrillDown(event) {
      if (typeof this.props.handleDrillDown === 'undefined') {
        return;
      }

      this.props.handleDrillDown(event);
    }
  }]);

  return GridFieldCell;
}(_SilverStripeComponent2.default);

GridFieldCell.PropTypes = {
  className: _react2.default.PropTypes.string,
  width: _react2.default.PropTypes.number,
  handleDrillDown: _react2.default.PropTypes.func
};

exports.default = GridFieldCell;

/***/ }),

/***/ 984:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _SilverStripeComponent = __webpack_require__(13);

var _SilverStripeComponent2 = _interopRequireDefault(_SilverStripeComponent);

var _GridFieldRow = __webpack_require__(256);

var _GridFieldRow2 = _interopRequireDefault(_GridFieldRow);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var GridFieldHeader = function (_SilverStripeComponen) {
  _inherits(GridFieldHeader, _SilverStripeComponen);

  function GridFieldHeader() {
    _classCallCheck(this, GridFieldHeader);

    return _possibleConstructorReturn(this, (GridFieldHeader.__proto__ || Object.getPrototypeOf(GridFieldHeader)).apply(this, arguments));
  }

  _createClass(GridFieldHeader, [{
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        _GridFieldRow2.default,
        null,
        this.props.children
      );
    }
  }]);

  return GridFieldHeader;
}(_SilverStripeComponent2.default);

exports.default = GridFieldHeader;

/***/ }),

/***/ 985:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _SilverStripeComponent = __webpack_require__(13);

var _SilverStripeComponent2 = _interopRequireDefault(_SilverStripeComponent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var GridFieldHeaderCell = function (_SilverStripeComponen) {
  _inherits(GridFieldHeaderCell, _SilverStripeComponen);

  function GridFieldHeaderCell() {
    _classCallCheck(this, GridFieldHeaderCell);

    return _possibleConstructorReturn(this, (GridFieldHeaderCell.__proto__ || Object.getPrototypeOf(GridFieldHeaderCell)).apply(this, arguments));
  }

  _createClass(GridFieldHeaderCell, [{
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'th',
        null,
        this.props.children
      );
    }
  }]);

  return GridFieldHeaderCell;
}(_SilverStripeComponent2.default);

GridFieldHeaderCell.PropTypes = {
  width: _react2.default.PropTypes.number
};

exports.default = GridFieldHeaderCell;

/***/ }),

/***/ 986:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _SilverStripeComponent = __webpack_require__(13);

var _SilverStripeComponent2 = _interopRequireDefault(_SilverStripeComponent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var GridFieldRow = function (_SilverStripeComponen) {
  _inherits(GridFieldRow, _SilverStripeComponen);

  function GridFieldRow() {
    _classCallCheck(this, GridFieldRow);

    return _possibleConstructorReturn(this, (GridFieldRow.__proto__ || Object.getPrototypeOf(GridFieldRow)).apply(this, arguments));
  }

  _createClass(GridFieldRow, [{
    key: 'render',
    value: function render() {
      var className = 'grid-field__row ' + this.props.className;
      return _react2.default.createElement(
        'tr',
        { tabIndex: '0', className: className },
        this.props.children
      );
    }
  }]);

  return GridFieldRow;
}(_SilverStripeComponent2.default);

exports.default = GridFieldRow;

/***/ }),

/***/ 987:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _SilverStripeComponent = __webpack_require__(13);

var _SilverStripeComponent2 = _interopRequireDefault(_SilverStripeComponent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var GridFieldTable = function (_SilverStripeComponen) {
  _inherits(GridFieldTable, _SilverStripeComponen);

  function GridFieldTable() {
    _classCallCheck(this, GridFieldTable);

    return _possibleConstructorReturn(this, (GridFieldTable.__proto__ || Object.getPrototypeOf(GridFieldTable)).apply(this, arguments));
  }

  _createClass(GridFieldTable, [{
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
  }, {
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
  }]);

  return GridFieldTable;
}(_SilverStripeComponent2.default);

GridFieldTable.propTypes = {
  data: _react2.default.PropTypes.object,
  header: _react2.default.PropTypes.object,
  rows: _react2.default.PropTypes.array
};

exports.default = GridFieldTable;

/***/ }),

/***/ 988:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _SilverStripeComponent = __webpack_require__(13);

var _SilverStripeComponent2 = _interopRequireDefault(_SilverStripeComponent);

var _reactBootstrapSs = __webpack_require__(38);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var HiddenField = function (_SilverStripeComponen) {
  _inherits(HiddenField, _SilverStripeComponen);

  function HiddenField() {
    _classCallCheck(this, HiddenField);

    return _possibleConstructorReturn(this, (HiddenField.__proto__ || Object.getPrototypeOf(HiddenField)).apply(this, arguments));
  }

  _createClass(HiddenField, [{
    key: 'getInputProps',
    value: function getInputProps() {
      return {
        bsClass: this.props.bsClass,
        componentClass: 'input',
        className: this.props.className + ' ' + this.props.extraClass,
        id: this.props.id,
        name: this.props.name,
        type: 'hidden',
        value: this.props.value
      };
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(_reactBootstrapSs.FormControl, this.getInputProps());
    }
  }]);

  return HiddenField;
}(_SilverStripeComponent2.default);

HiddenField.propTypes = {
  id: _react2.default.PropTypes.string,
  extraClass: _react2.default.PropTypes.string,
  name: _react2.default.PropTypes.string.isRequired,
  value: _react2.default.PropTypes.any
};

HiddenField.defaultProps = {
  className: '',
  extraClass: '',
  value: ''
};

exports.default = HiddenField;

/***/ }),

/***/ 989:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _SilverStripeComponent = __webpack_require__(13);

var _SilverStripeComponent2 = _interopRequireDefault(_SilverStripeComponent);

var _ListGroupItem = __webpack_require__(930);

var _ListGroupItem2 = _interopRequireDefault(_ListGroupItem);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ListGroup = function (_SilverStripeComponen) {
  _inherits(ListGroup, _SilverStripeComponen);

  function ListGroup() {
    _classCallCheck(this, ListGroup);

    return _possibleConstructorReturn(this, (ListGroup.__proto__ || Object.getPrototypeOf(ListGroup)).apply(this, arguments));
  }

  _createClass(ListGroup, [{
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        { className: 'list-group' },
        this.props.items.map(function () {
          return _react2.default.createElement(_ListGroupItem2.default, null);
        })
      );
    }
  }]);

  return ListGroup;
}(_SilverStripeComponent2.default);

ListGroup.propTypes = {
  items: _react2.default.PropTypes.array
};

exports.default = ListGroup;

/***/ }),

/***/ 990:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _SilverStripeComponent = __webpack_require__(13);

var _SilverStripeComponent2 = _interopRequireDefault(_SilverStripeComponent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ListGroupItem = function (_SilverStripeComponen) {
  _inherits(ListGroupItem, _SilverStripeComponen);

  function ListGroupItem(props) {
    _classCallCheck(this, ListGroupItem);

    var _this = _possibleConstructorReturn(this, (ListGroupItem.__proto__ || Object.getPrototypeOf(ListGroupItem)).call(this, props));

    _this.handleClick = _this.handleClick.bind(_this);
    return _this;
  }

  _createClass(ListGroupItem, [{
    key: 'render',
    value: function render() {
      var className = 'list-group-item ' + this.props.className;
      return _react2.default.createElement(
        'a',
        { tabIndex: '0', className: className, onClick: this.handleClick },
        this.props.children
      );
    }
  }, {
    key: 'handleClick',
    value: function handleClick(event) {
      if (this.props.handleClick) {
        this.props.handleClick(event, this.props.handleClickArg);
      }
    }
  }]);

  return ListGroupItem;
}(_SilverStripeComponent2.default);

ListGroupItem.propTypes = {
  handleClickArg: _react2.default.PropTypes.any,
  handleClick: _react2.default.PropTypes.func
};

exports.default = ListGroupItem;

/***/ }),

/***/ 991:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _SilverStripeComponent = __webpack_require__(13);

var _SilverStripeComponent2 = _interopRequireDefault(_SilverStripeComponent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var LiteralField = function (_SilverStripeComponen) {
  _inherits(LiteralField, _SilverStripeComponen);

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
}(_SilverStripeComponent2.default);

LiteralField.propTypes = {
  id: _react2.default.PropTypes.string,
  name: _react2.default.PropTypes.string.isRequired,
  extraClass: _react2.default.PropTypes.string,
  value: _react2.default.PropTypes.string
};

LiteralField.defaultProps = {
  extraClass: '',
  className: ''
};

exports.default = LiteralField;

/***/ }),

/***/ 992:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _i18n = __webpack_require__(23);

var _i18n2 = _interopRequireDefault(_i18n);

var _SilverStripeComponent = __webpack_require__(13);

var _SilverStripeComponent2 = _interopRequireDefault(_SilverStripeComponent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Preview = function (_SilverStripeComponen) {
  _inherits(Preview, _SilverStripeComponen);

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
    key: 'render',
    value: function render() {
      var body = null;
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

      var editUrl = null;
      var editKey = 'edit';
      var toolbarButtons = [];
      if (this.props.itemLinks && this.props.itemLinks.edit) {
        editUrl = this.props.itemLinks.edit.href;
        toolbarButtons.push(_react2.default.createElement(
          'a',
          { key: editKey, href: editUrl, className: 'btn btn-secondary-outline font-icon-edit' },
          _react2.default.createElement(
            'span',
            { className: 'btn__title' },
            _i18n2.default._t('Admin.EDIT', 'Edit')
          )
        ));
      }

      if (!this.props.itemId) {
        body = _react2.default.createElement(
          'div',
          { className: 'preview__overlay' },
          _react2.default.createElement(
            'h3',
            { className: 'preview__overlay-text' },
            'No preview available.'
          )
        );
      } else if (!previewUrl) {
        body = _react2.default.createElement(
          'div',
          { className: 'preview__overlay' },
          _react2.default.createElement(
            'h3',
            { className: 'preview__overlay-text' },
            'There is no preview available for this item.'
          )
        );
      } else if (previewType && previewType.indexOf('image/') === 0) {
        body = _react2.default.createElement(
          'div',
          { className: 'preview__file-container panel--scrollable' },
          _react2.default.createElement('img', { alt: previewUrl, className: 'preview__file--fits-space', src: previewUrl })
        );
      } else {
        body = _react2.default.createElement('iframe', { className: 'flexbox-area-grow preview__iframe', src: previewUrl });
      }

      var backButton = typeof this.props.onBack === 'function' && _react2.default.createElement(
        'button',
        {
          className: 'btn btn-secondary font-icon-left-open-big toolbar__back-button hidden-lg-up',
          type: 'button',
          onClick: this.handleBackClick
        },
        'Back'
      );

      return _react2.default.createElement(
        'div',
        { className: 'flexbox-area-grow fill-height preview campaign-admin__campaign-preview' },
        body,
        _react2.default.createElement(
          'div',
          { className: 'toolbar toolbar--south' },
          backButton,
          _react2.default.createElement(
            'div',
            { className: 'btn-toolbar' },
            toolbarButtons
          )
        )
      );
    }
  }]);

  return Preview;
}(_SilverStripeComponent2.default);

Preview.propTypes = {
  itemLinks: _react2.default.PropTypes.object,
  itemId: _react2.default.PropTypes.number,
  onBack: _react2.default.PropTypes.func
};

exports.default = Preview;

/***/ }),

/***/ 993:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TextField = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _SilverStripeComponent = __webpack_require__(13);

var _SilverStripeComponent2 = _interopRequireDefault(_SilverStripeComponent);

var _FieldHolder = __webpack_require__(44);

var _FieldHolder2 = _interopRequireDefault(_FieldHolder);

var _reactBootstrapSs = __webpack_require__(38);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TextField = function (_SilverStripeComponen) {
  _inherits(TextField, _SilverStripeComponen);

  function TextField(props) {
    _classCallCheck(this, TextField);

    var _this = _possibleConstructorReturn(this, (TextField.__proto__ || Object.getPrototypeOf(TextField)).call(this, props));

    _this.handleChange = _this.handleChange.bind(_this);
    return _this;
  }

  _createClass(TextField, [{
    key: 'render',
    value: function render() {
      return _react2.default.createElement(_reactBootstrapSs.FormControl, this.getInputProps());
    }
  }, {
    key: 'getInputProps',
    value: function getInputProps() {
      var props = {
        bsClass: this.props.bsClass,
        className: this.props.className + ' ' + this.props.extraClass,
        id: this.props.id,
        name: this.props.name,
        disabled: this.props.disabled,
        readOnly: this.props.readOnly,
        value: this.props.value,
        placeholder: this.props.placeholder,
        autoFocus: this.props.autoFocus
      };

      if (this.isMultiline()) {
        Object.assign(props, {
          componentClass: 'textarea',
          rows: this.props.data.rows,
          cols: this.props.data.columns
        });
      } else {
        Object.assign(props, {
          componentClass: 'input',
          type: this.props.type ? this.props.type : null
        });
      }

      if (!this.props.readOnly) {
        Object.assign(props, {
          onChange: this.handleChange
        });
      }

      return props;
    }
  }, {
    key: 'isMultiline',
    value: function isMultiline() {
      return this.props.data && this.props.data.rows > 1;
    }
  }, {
    key: 'handleChange',
    value: function handleChange(event) {
      if (typeof this.props.onChange === 'function') {
        this.props.onChange(event, { id: this.props.id, value: event.target.value });
      }
    }
  }]);

  return TextField;
}(_SilverStripeComponent2.default);

TextField.propTypes = {
  extraClass: _react2.default.PropTypes.string,
  id: _react2.default.PropTypes.string,
  name: _react2.default.PropTypes.string.isRequired,
  onChange: _react2.default.PropTypes.func,
  value: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.string, _react2.default.PropTypes.number]),
  readOnly: _react2.default.PropTypes.bool,
  disabled: _react2.default.PropTypes.bool,
  placeholder: _react2.default.PropTypes.string,
  type: _react2.default.PropTypes.string,
  autoFocus: _react2.default.PropTypes.bool
};

TextField.defaultProps = {
  value: '',
  extraClass: '',
  className: '',
  type: 'text'
};

exports.TextField = TextField;
exports.default = (0, _FieldHolder2.default)(TextField);

/***/ }),

/***/ 994:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _SilverStripeComponent = __webpack_require__(13);

var _SilverStripeComponent2 = _interopRequireDefault(_SilverStripeComponent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Toolbar = function (_SilverStripeComponen) {
  _inherits(Toolbar, _SilverStripeComponen);

  function Toolbar(props) {
    _classCallCheck(this, Toolbar);

    var _this = _possibleConstructorReturn(this, (Toolbar.__proto__ || Object.getPrototypeOf(Toolbar)).call(this, props));

    _this.handleBackButtonClick = _this.handleBackButtonClick.bind(_this);
    return _this;
  }

  _createClass(Toolbar, [{
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
  }, {
    key: 'handleBackButtonClick',
    value: function handleBackButtonClick(event) {
      if (typeof this.props.handleBackButtonClick !== 'undefined') {
        this.props.handleBackButtonClick(event);
        return;
      }

      event.preventDefault();
    }
  }]);

  return Toolbar;
}(_SilverStripeComponent2.default);

Toolbar.propTypes = {
  handleBackButtonClick: _react2.default.PropTypes.func,
  showBackButton: _react2.default.PropTypes.bool,
  breadcrumbs: _react2.default.PropTypes.array
};

Toolbar.defaultProps = {
  showBackButton: false
};

exports.default = Toolbar;

/***/ }),

/***/ 995:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SINGLE_EMPTY_VALUE = exports.MULTI_EMPTY_VALUE = exports.ConnectedTreeDropdownField = exports.TreeDropdownField = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _reactRedux = __webpack_require__(42);

var _redux = __webpack_require__(41);

var _FieldHolder = __webpack_require__(44);

var _FieldHolder2 = _interopRequireDefault(_FieldHolder);

var _isomorphicFetch = __webpack_require__(179);

var _isomorphicFetch2 = _interopRequireDefault(_isomorphicFetch);

var _reactSelect = __webpack_require__(765);

var _reactSelect2 = _interopRequireDefault(_reactSelect);

var _TreeDropdownFieldActions = __webpack_require__(416);

var treeDropdownFieldActions = _interopRequireWildcard(_TreeDropdownFieldActions);

var _TreeDropdownFieldMenu = __webpack_require__(403);

var _TreeDropdownFieldMenu2 = _interopRequireDefault(_TreeDropdownFieldMenu);

var _TreeDropdownFieldNode = __webpack_require__(188);

var _TreeDropdownFieldNode2 = _interopRequireDefault(_TreeDropdownFieldNode);

var _url = __webpack_require__(385);

var _url2 = _interopRequireDefault(_url);

var _reactBootstrapSs = __webpack_require__(38);

var _castStringToElement = __webpack_require__(86);

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

    _this.callFetch = _this.callFetch.bind(_this);
    _this.lazyLoad = _this.lazyLoad.bind(_this);
    _this.filterOptions = _this.filterOptions.bind(_this);
    _this.findTreeByID = _this.findTreeByID.bind(_this);
    _this.findTreeByPath = _this.findTreeByPath.bind(_this);
    _this.findTreePath = _this.findTreePath.bind(_this);

    _this.searchTimer = null;
    return _this;
  }

  _createClass(TreeDropdownField, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      if (!this.props.readOnly && !this.props.disabled) {
        this.loadTree([], this.props.search).then(function (treeData) {
          if (_this2.props.data.multiple && _this2.props.value) {
            var newPath = _this2.findTreePath(treeData, _this2.props.value);
            if (newPath) {
              newPath.pop();
              _this2.props.actions.treeDropdownField.setVisible(_this2.props.id, newPath);
            }
          }
        });
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

      if (nextProps.data.cacheKey !== this.props.data.cacheKey) {
        reload = true;
      }

      if (reload) {
        this.loadTree(visible, nextProps.search);
      }
    }
  }, {
    key: 'getVisibleTree',
    value: function getVisibleTree() {
      return this.findTreeByPath(this.props.tree, this.props.visible);
    }
  }, {
    key: 'getBreadcrumbs',
    value: function getBreadcrumbs() {
      var breadcrumbs = [];

      var node = this.props.tree;
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        var _loop = function _loop() {
          var next = _step.value;

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

        for (var _iterator = this.props.visible[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _ret = _loop();

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

      if (this.props.data.hasEmptyDefault && !this.props.visible.length && !this.hasSearch()) {
        options.unshift({
          id: '',
          title: this.props.data.emptyString,
          disabled: false
        });
      }

      if (this.props.selectedValues) {
        var selectedOptions = this.props.selectedValues.filter(function (selected) {
          var selectedValue = selected.id === value || Array.isArray(value) && value.find(function (item) {
            return item === selected.id;
          });

          if (!selectedValue) {
            return false;
          }
          var option = options.find(function (item) {
            return item.id === selected.id;
          });

          return !option;
        });

        if (selectedOptions.length) {
          options = [].concat(_toConsumableArray(selectedOptions), _toConsumableArray(options));
        }
      }

      if (options.length) {
        return options;
      }

      return [{
        id: null,
        title: null,
        disabled: true
      }];
    }
  }, {
    key: 'callFetch',
    value: function callFetch(path) {
      var search = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

      var fetchURL = _url2.default.parse(this.props.data.urlTree, true);
      if (this.props.data.showSearch && search.length) {
        fetchURL.query.search = search;
        fetchURL.query.flatList = '1';
      }
      if (path.length) {
        fetchURL.query.ID = path[path.length - 1];
      }
      fetchURL.query.format = 'json';
      var fetchURLString = _url2.default.format(fetchURL);
      return (0, _isomorphicFetch2.default)(fetchURLString, {
        credentials: 'same-origin'
      }).then(function (response) {
        return response.json();
      });
    }
  }, {
    key: 'findTreeByPath',
    value: function findTreeByPath(tree, path) {
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
        return this.findTreeByPath(subTree, subPath);
      }

      return null;
    }
  }, {
    key: 'findTreeByID',
    value: function findTreeByID(tree, id) {
      if (!id || !tree || !tree.children || Object.keys(tree).length === 0) {
        return null;
      }

      if (tree.id === id) {
        return tree;
      }
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = tree.children[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var child = _step2.value;

          var found = this.findTreeByID(child, id);
          if (found !== null) {
            return found;
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
    }
  }, {
    key: 'findTreePath',
    value: function findTreePath(tree, id) {
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
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = tree.children[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var child = _step3.value;

          var childPath = this.findTreePath(child, id);

          if (childPath !== null) {
            if (tree.id) {
              childPath.unshift(tree.id);
            }
            return childPath;
          }
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return) {
            _iterator3.return();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }

      return null;
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

      var foundTree = this.findTreeByPath(this.props.tree, path);

      if (foundTree && (foundTree.count === 0 || foundTree.children.length)) {
        return Promise.resolve({});
      }

      return this.loadTree(path);
    }
  }, {
    key: 'loadTree',
    value: function loadTree(path) {
      var _this4 = this;

      var search = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

      this.props.actions.treeDropdownField.beginTreeUpdating(this.props.id, path);

      return this.callFetch(path, search).then(function (treeData) {
        _this4.props.actions.treeDropdownField.updateTree(_this4.props.id, path, treeData);

        return treeData;
      }).catch(function (error) {
        _this4.props.actions.treeDropdownField.updateTreeFailed(_this4.props.id, path);
        if (typeof _this4.props.onLoadingError === 'function') {
          return _this4.props.onLoadingError({
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
      var _this5 = this;

      var parent = this.getVisibleTree();

      return options.filter(function (option) {
        var title = option.title && option.title.toLocaleLowerCase();

        var search = _this5.props.search.toLocaleLowerCase();

        return search ? title && title.includes(search) : !parent || !option.id || parent.children.find(function (child) {
          return child.id === option.id;
        });
      });
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
      var _this6 = this;

      clearTimeout(this.searchTimer);

      this.searchTimer = setTimeout(function () {
        _this6.props.actions.treeDropdownField.setSearch(_this6.props.id, value);
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
            return value.indexOf(item) === index;
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
      event.preventDefault();

      if (this.hasSearch()) {
        return;
      }

      var path = this.findTreePath(this.props.tree, id);
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
      var value = this.props.data.multiple ? this.props.value : [this.props.value];

      return _react2.default.createElement(_TreeDropdownFieldMenu2.default, {
        loading: loading,
        failed: failed,
        tree: visibleTree,
        breadcrumbs: breadcrumbs,
        renderMenuOptions: renderMenuOptions,
        onBack: this.handleBack,
        search: this.hasSearch(),
        value: value
      });
    }
  }, {
    key: 'renderOption',
    value: function renderOption(tree) {
      var _this7 = this;

      var button = null;
      if (tree.count && !this.hasSearch()) {
        var handleNavigate = function handleNavigate(event) {
          return _this7.handleNavigate(event, tree.id);
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
      var _this8 = this;

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
          return item.id === _this8.props.value;
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
        _react2.default.createElement(_reactBootstrapSs.FormControl, _extends({
          type: 'hidden',
          name: this.props.name,
          value: this.props.value
        }, inputProps))
      );
    }
  }, {
    key: 'render',
    value: function render() {
      var _this9 = this;

      if (this.props.readOnly || this.props.disabled) {
        return this.renderReadOnly();
      }

      var inputProps = {
        id: this.props.id
      };
      var className = this.props.extraClass ? 'treedropdownfield ' + this.props.extraClass : 'treedropdownfield';
      var options = this.getDropdownOptions();
      var value = this.props.data.multiple ? this.props.selectedValues.filter(function (item) {
        return _this9.props.value.includes(item.id);
      }) : this.props.value;
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
        onOpen: this.handleSearchReset,
        onBlurResetsInput: true,
        onInputKeyDown: this.handleKeyDown,
        onInputChange: this.handleSearchChange,
        isLoading: Boolean(this.props.loading.length),
        value: value,
        resetValue: resetValue,
        ref: function ref(select) {
          _this9.selectField = select;
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
  extraClass: _react.PropTypes.string,
  id: _react.PropTypes.string,
  name: _react.PropTypes.string.isRequired,
  onChange: _react.PropTypes.func,
  value: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.number, _react.PropTypes.array]),
  readOnly: _react.PropTypes.bool,
  disabled: _react.PropTypes.bool,
  tree: _react.PropTypes.shape(_TreeDropdownFieldNode2.default.propTypes),
  visible: _react.PropTypes.array,
  loading: _react.PropTypes.array,
  failed: _react.PropTypes.array,
  selectedValues: _react.PropTypes.array,
  data: _react.PropTypes.shape({
    cacheKey: _react.PropTypes.string,
    urlTree: _react.PropTypes.string.isRequired,
    emptyString: _react.PropTypes.string,
    valueObject: _react.PropTypes.shape(_TreeDropdownFieldNode2.default.propTypes),
    valueObjects: _react.PropTypes.arrayOf(_react.PropTypes.shape(_TreeDropdownFieldNode2.default.propTypes)),
    hasEmptyDefault: _react.PropTypes.bool,
    showSearch: _react.PropTypes.bool,
    multiple: _react.PropTypes.bool
  }),
  onLoadingError: _react.PropTypes.func,
  search: _react.PropTypes.string,
  actions: _react.PropTypes.shape({
    treeDropdownField: _react.PropTypes.object
  })
};

TreeDropdownField.defaultProps = {
  value: '',
  extraClass: '',
  className: '',
  tree: {},
  visible: [],
  loading: [],
  failed: []
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

  if (!ownProps.data.multiple && ownProps.value === SINGLE_EMPTY_VALUE) {
    value = '';
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

exports.TreeDropdownField = TreeDropdownField;
exports.ConnectedTreeDropdownField = ConnectedTreeDropdownField;
exports.MULTI_EMPTY_VALUE = MULTI_EMPTY_VALUE;
exports.SINGLE_EMPTY_VALUE = SINGLE_EMPTY_VALUE;
exports.default = (0, _FieldHolder2.default)(ConnectedTreeDropdownField);

/***/ }),

/***/ 996:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _i18n = __webpack_require__(23);

var _i18n2 = _interopRequireDefault(_i18n);

var _classnames = __webpack_require__(4);

var _classnames2 = _interopRequireDefault(_classnames);

var _TreeDropdownFieldNode = __webpack_require__(188);

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
          onClick: this.handleBack
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

      var isSelected = this.props.value.includes(tree.id);
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
      if (this.props.loading) {
        return _react2.default.createElement(
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
        );
      }
      if (this.props.failed) {
        return _react2.default.createElement(
          'div',
          { className: 'Select-option' },
          _i18n2.default._t('Admin.TREEDROPDOWN_FAILED', 'Failed to load')
        );
      }
      if (this.props.tree.count === 0) {
        return _react2.default.createElement(
          'div',
          { className: 'Select-option' },
          _i18n2.default._t('Admin.TREEDROPDOWN_NO_CHILDREN', 'No children')
        );
      }

      var breadcrumbs = this.renderBreadcrumbs();
      var options = this.props.renderMenuOptions && this.props.renderMenuOptions.options;

      var children = options ? options.filter(function (option) {
        return option.title !== null;
      }).map(this.renderOption) : null;

      return _react2.default.createElement(
        'div',
        { className: 'treedropdownfield__menu' },
        breadcrumbs,
        children
      );
    }
  }]);

  return TreeDropdownFieldMenu;
}(_react.Component);

TreeDropdownFieldMenu.propTypes = {
  className: _react.PropTypes.string,
  breadcrumbs: _react.PropTypes.arrayOf(_react.PropTypes.shape(_TreeDropdownFieldNode2.default.propTypes)),
  loading: _react.PropTypes.bool,
  failed: _react.PropTypes.bool,
  tree: _react.PropTypes.shape(_TreeDropdownFieldNode2.default.propTypes),
  renderMenuOptions: _react.PropTypes.object,
  onBack: _react.PropTypes.func,
  search: _react.PropTypes.bool,
  value: _react.PropTypes.array
};

exports.default = TreeDropdownFieldMenu;

/***/ }),

/***/ 997:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = __webpack_require__(0);

var TreeDropdownFieldNode = function TreeDropdownFieldNode() {
  return null;
};

TreeDropdownFieldNode.propTypes = {
  id: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.number]),
  title: _react.PropTypes.string,
  disabled: _react.PropTypes.bool,
  parentid: _react.PropTypes.number,
  count: _react.PropTypes.number,
  depth: _react.PropTypes.number,
  expanded: _react.PropTypes.bool,
  limited: _react.PropTypes.bool,
  marked: _react.PropTypes.bool,
  opened: _react.PropTypes.bool,
  children: _react.PropTypes.array
};

exports.default = TreeDropdownFieldNode;

/***/ }),

/***/ 998:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _reactRedux = __webpack_require__(42);

var _redux = __webpack_require__(41);

var _isomorphicFetch = __webpack_require__(179);

var _isomorphicFetch2 = _interopRequireDefault(_isomorphicFetch);

var _deepFreezeStrict = __webpack_require__(85);

var _deepFreezeStrict2 = _interopRequireDefault(_deepFreezeStrict);

var _reduxForm = __webpack_require__(100);

var _schemaFieldValues = __webpack_require__(767);

var _SchemaActions = __webpack_require__(248);

var schemaActions = _interopRequireWildcard(_SchemaActions);

var _merge = __webpack_require__(153);

var _merge2 = _interopRequireDefault(_merge);

var _FormBuilder = __webpack_require__(1898);

var _FormBuilder2 = _interopRequireDefault(_FormBuilder);

var _getIn = __webpack_require__(744);

var _getIn2 = _interopRequireDefault(_getIn);

var _Injector = __webpack_require__(45);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var FormBuilderLoader = function (_Component) {
  _inherits(FormBuilderLoader, _Component);

  function FormBuilderLoader(props) {
    _classCallCheck(this, FormBuilderLoader);

    var _this = _possibleConstructorReturn(this, (FormBuilderLoader.__proto__ || Object.getPrototypeOf(FormBuilderLoader)).call(this, props));

    _this.handleSubmit = _this.handleSubmit.bind(_this);
    _this.clearSchema = _this.clearSchema.bind(_this);
    _this.reduceSchemaErrors = _this.reduceSchemaErrors.bind(_this);
    _this.handleAutofill = _this.handleAutofill.bind(_this);
    return _this;
  }

  _createClass(FormBuilderLoader, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.fetch();
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps) {
      if (this.props.schemaUrl !== prevProps.schemaUrl) {
        this.clearSchema(prevProps.schemaUrl);
        this.fetch();
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.clearSchema(this.props.schemaUrl);
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
    key: 'clearSchema',
    value: function clearSchema(schemaUrl) {
      if (schemaUrl) {
        (0, _reduxForm.destroy)(schemaUrl);
        this.props.actions.schema.setSchema(schemaUrl, null, this.props.identifier);
      }
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
            schema = _this2.reduceSchemaErrors(schema);

            _this2.props.actions.schema.setSchema(_this2.props.schemaUrl, schema, _this2.props.identifier);

            var schemaRef = schema.schema || _this2.props.schema.schema;
            if (schema.state) {
              var formData = schema.state.fields.reduce(function (tempData, state) {
                if (!schemaRef) {
                  return tempData;
                }

                var field = (0, _schemaFieldValues.findField)(schemaRef.fields, state.name);

                if (!field || field.schemaType === 'Structural' || field.readOnly === true) {
                  return tempData;
                }
                return Object.assign({}, tempData, _defineProperty({}, state.name, state.value));
              }, {});
              _this2.props.actions.reduxForm.initialize(_this2.props.identifier, formData);
            }
          }
          return schema;
        });
      };

      if (typeof this.props.handleSubmit === 'function') {
        promise = this.props.handleSubmit(data, action, newSubmitFn);
      } else {
        promise = submitFn();
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

      var reduced = Object.assign({}, schema);
      if (!reduced.state) {
        reduced = Object.assign({}, reduced, { state: this.props.schema.state });
      }

      reduced = Object.assign({}, reduced, {
        state: Object.assign({}, reduced.state, {
          fields: reduced.state.fields.map(function (field) {
            return Object.assign({}, field, {
              message: schema.errors.find(function (error) {
                return error.field === field.name;
              })
            });
          }),

          messages: schema.errors.filter(function (error) {
            return !error.field;
          })
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
        headers: { 'X-FormSchema-Request': headerValues.join(',') },
        credentials: 'same-origin'
      }).then(function (response) {
        return response.json();
      });
    }
  }, {
    key: 'fetch',
    value: function fetch() {
      var schema = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

      var _this3 = this;

      var state = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      var errors = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      var headerValues = ['auto'];

      if (schema) {
        headerValues.push('schema');
      }

      if (state) {
        headerValues.push('state');
      }

      if (errors) {
        headerValues.push('errors');
      }

      if (this.props.loading) {
        return Promise.resolve({});
      }

      this.props.actions.schema.setSchemaLoading(this.props.schemaUrl, true);

      return this.callFetch(headerValues).then(function (formSchema) {
        _this3.props.actions.schema.setSchemaLoading(_this3.props.schemaUrl, false);

        if (typeof _this3.props.onFetchingSchema === 'function') {
          _this3.props.onFetchingSchema();
        }

        if (formSchema.errors && typeof _this3.props.onLoadingError === 'function') {
          return _this3.props.onLoadingError(formSchema);
        }

        if (typeof formSchema.id !== 'undefined') {
          var overriddenSchema = Object.assign({}, formSchema, {
            id: _this3.props.schemaUrl,
            state: _this3.overrideStateData(formSchema.state)
          });
          _this3.props.actions.schema.setSchema(_this3.props.schemaUrl, overriddenSchema, _this3.props.identifier);

          return overriddenSchema;
        }
        return formSchema;
      }).catch(function (error) {
        _this3.props.actions.schema.setSchemaLoading(_this3.props.schemaUrl, false);
        if (typeof _this3.props.onLoadingError === 'function') {
          return _this3.props.onLoadingError({
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
    key: 'handleAutofill',
    value: function handleAutofill(field, value) {
      this.props.actions.reduxForm.autofill(this.props.identifier, field, value);
    }
  }, {
    key: 'render',
    value: function render() {
      if (!this.props.schema || !this.props.schema.schema || this.props.loading) {
        return null;
      }

      var props = Object.assign({}, this.props, {
        form: this.props.identifier,
        onSubmitSuccess: this.props.onSubmitSuccess,
        handleSubmit: this.handleSubmit,
        onAutofill: this.handleAutofill,
        changed: this.props.changed
      });

      return _react2.default.createElement(_FormBuilder2.default, props);
    }
  }]);

  return FormBuilderLoader;
}(_react.Component);

FormBuilderLoader.propTypes = Object.assign({}, _FormBuilder.basePropTypes, {
  actions: _react.PropTypes.shape({
    schema: _react.PropTypes.object,
    reduxFrom: _react.PropTypes.object
  }),
  identifier: _react.PropTypes.string.isRequired,
  schemaUrl: _react.PropTypes.string.isRequired,
  schema: _FormBuilder.schemaPropType,
  form: _react.PropTypes.string,
  submitting: _react.PropTypes.bool,
  onFetchingSchema: _react.PropTypes.func
});

function mapStateToProps(state, ownProps) {
  var schema = state.form.formSchemas[ownProps.schemaUrl];

  var reduxFormState = state.form && state.form.formState && (0, _getIn2.default)(state.form.formState, ownProps.identifier);
  var submitting = reduxFormState && reduxFormState.submitting;
  var values = reduxFormState && reduxFormState.values;

  var stateOverrides = schema && schema.stateOverride;
  var loading = schema && schema.metadata && schema.metadata.loading;
  var changed = !!(state.unsavedForms && state.unsavedForms.find(function (form) {
    return ownProps.identifier === form.name;
  }));
  return { schema: schema, submitting: submitting, values: values, stateOverrides: stateOverrides, loading: loading, changed: changed };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      schema: (0, _redux.bindActionCreators)(schemaActions, dispatch),
      reduxForm: (0, _redux.bindActionCreators)({ autofill: _reduxForm.autofill, initialize: _reduxForm.initialize }, dispatch)
    }
  };
}

var ConnectedFormBuilderLoader = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(FormBuilderLoader);

exports.default = (0, _Injector.inject)(['ReduxForm', 'ReduxFormField'], function (Form, Field) {
  return {
    baseFormComponent: Form,
    baseFieldComponent: Field
  };
}, function (_ref) {
  var identifier = _ref.identifier;
  return identifier;
})(ConnectedFormBuilderLoader);

/***/ }),

/***/ 999:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createInsertLinkModal = exports.InsertLinkModal = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _redux = __webpack_require__(41);

var _reactRedux = __webpack_require__(42);

var _FormBuilderModal = __webpack_require__(763);

var _FormBuilderModal2 = _interopRequireDefault(_FormBuilderModal);

var _fileSchemaModalHandler = __webpack_require__(943);

var _fileSchemaModalHandler2 = _interopRequireDefault(_fileSchemaModalHandler);

var _SchemaActions = __webpack_require__(248);

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
    if (!props.show) {
      props.setOverrides(null);
    }
    return _this;
  }

  _createClass(InsertLinkModal, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(props) {
      if (props.show && !this.props.show || !props.show && this.props.show) {
        props.setOverrides(props.show ? props : null);
      }
    }
  }, {
    key: 'getModalProps',
    value: function getModalProps() {
      var props = Object.assign({}, this.props, {
        handleSubmit: this.handleSubmit,
        handleHide: this.props.onHide
      });
      delete props.onHide;
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
            this.props.onHide();
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
  show: _react.PropTypes.bool,
  schemaUrl: _react.PropTypes.string,
  onInsert: _react.PropTypes.func.isRequired,
  onHide: _react.PropTypes.func.isRequired,
  setOverrides: _react.PropTypes.func.isRequired,
  actions: _react.PropTypes.object
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
  function mapStateToProps(state) {
    var sectionConfig = state.config.sections.find(function (section) {
      return section.name === sectionConfigKey;
    });

    var schemaUrl = '' + sectionConfig.form[formName].schemaUrl;

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

/***/ })

},[912]);
//# sourceMappingURL=bundle.js.map