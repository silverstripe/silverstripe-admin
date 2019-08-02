import gql from 'graphql-tag';
import { ROOT_FIELD } from './graphql/helpers';
import ApolloGraphqlProxy from './ApolloGraphqlProxy';

const TEMPLATE_OVERRIDE = '__TEMPLATE_OVERRIDE__';
const protectedConfig = ['templateName', 'fields', 'params', 'fragments'];
const deferredApolloConfig = ['options', 'props', 'variables', 'skip', 'update'];
const configDefaults = {
  params: {},
  args: {},
  fields: [],
  fragments: [],
  pagination: true,
  apolloConfig: {},
};

/**
 * An API for updating the query/mutation parts of a given template
 */
class ApolloGraphqlManager {
  /**
   * @schema for the config structure
    {
      apolloConfig: {
        // additive only, will ignore removals
        options: (<originalParams>) => (<currentValue>) => <object|newValue>,

        // additive only, will ignore removals
        props: (<originalData>) => (<currentValue>) => <object|newValue>,

        // additive only, will ignore removals
        variables: (<props>) => (<currentValue) => <object|newValue>,

        // last transform returning a boolean will take precedence
        skip: (<props>) => (<currentValue>) => <boolean|newValue>,

        // additive only, will ignore removals??
        context: (currentValue) => <object|newValue>,

        // additive only, will ignore removals
        optimisticResponse: (<currentValue>) => <object|newValue>,

        // additive only, will ignore removals
        refetchQueries: (<currentValue>) => <array|newValue>,

        // last transform returning a number will take precedence
        pollInterval: (<currentValue>) => <integer|newValue>,

        // last transform returning an object or null will take precedence
        fetchPolicy: (<currentValue>) => <object|newValue>,

        // last transform returning a string will take precedence
        name: (<currentName>) => <string|newValue>,

        withRef: <anyTrue>,

        notifyOnNetworkStatusChange: <anyTrue>,

        // each transformation will be called successively no values returned between
        // each transformation
        update: (<DataProxy>, <Response>) => <noReturn>,
      },
      singularName: <string>,
      pluralName: <string>,
      fields: [<string>], - e.g. ['Title'] or nested fields ['Author', ['ID']]
      params: {<name>: <type>}, - e.g. { limit: 'Int' }
      pagination: <boolean>,
      templateName: <string>,
    }
   *
   * @param {object} config - default config options which we extrapolate as the "base" behaviour.
   * @param {object} templates - a key-value map of templates
   * @param {object} fragments - a key-value map of fragments
   */
  constructor(config, templates, fragments) {
    const mergedConfig = {
      ...configDefaults,
      ...config,
    };
    // Fields array is mutated by reference, so this has to be dereferenced from the configDefaults
    mergedConfig.fields = [
      ...mergedConfig.fields
    ];
    const {
      apolloConfig,
      ...otherConfig
    } = mergedConfig;

    this.config = otherConfig;
    this.apolloConfigInitValues = apolloConfig;
    this.apolloConfigTransforms = {};
    this.templates = { ...templates } || {};
    this.fragments = { ...fragments } || {};

    this.reduceApolloConfig = this.reduceApolloConfig.bind(this);
  }

  /**
   * Assigns a new value to a config setting
   * @param name
   * @param value
   * @returns {ApolloGraphqlManager}
   */
  setConfig(name, value) {
    // prevent overriding functionally important configs
    if (protectedConfig.includes(name)) {
      throw new Error(`Tried to set protected config values: '${name}', which is discouraged.`);
    }
    this.config = {
      ...this.config,
      [name]: value,
    };

    return this;
  }

  /**
   * Applies a decorator to the apollo config
   * @param config
   * @param callback
   * @returns {ApolloGraphqlManager}
   */
  transformApolloConfig(config, callback) {
    const transformList = this.apolloConfigTransforms[config] || [];

    this.apolloConfigTransforms = {
      ...this.apolloConfigTransforms,
      [config]: [
        ...transformList,
        callback,
      ],
    };

    return this;
  }

  /**
   * Adds a param to the query
   *
   * @param {string} name
   * @param {string} type
   * @returns {ApolloGraphqlManager}
   */
  addParam(name, type) {
    if (!name || !type) {
      throw new Error('addParam must be passed a name and type parameter');
    }
    return this.addParams({
      [name]: type
    });
  }

  /**
   * Adds multiple params to the query
   *
   * @param {object} params
   * @returns {ApolloGraphqlManager}
   */
  addParams(params = {}) {
    const existing = this.config.params;
    this.config.params = {
      ...existing,
      ...params,
    };

    return this;
  }

  /**
   * Adds an arg to the query
   *
   * @param {string} name
   * @param {string} variableName
   * @param {string} path The path to the field where the args are applied
   * @returns {ApolloGraphqlManager}
   */
  addArg(name, variableName, path = ROOT_FIELD) {
    return this.addArgs({
      [name]: variableName
    }, path);
  }

  /**
   * Adds multiple args to the query
   *
   * @param {object} args
   * @param {string} path The path to the field where the args are applied
   * @returns {ApolloGraphqlManager}
   */
  addArgs(args = {}, path = ROOT_FIELD) {
    const existing = this.config.args[path] || {};
    this.config.args[path] = {
      ...existing,
      ...args,
    };

    return this;
  }

  /**
   * Adds a field to the query
   *
   * @param {string} field
   * @param {string} path
   * @returns {ApolloGraphqlManager}}
   */
  addField(field, path = ROOT_FIELD) {
    return this.addFields([field], path);
  }

  /**
   * Adds a list of fields to the query
   *
   * @param {string[]} fields
   * @param {string} path
   * @returns {ApolloGraphqlManager}
   */
  addFields(fields = [], path = ROOT_FIELD) {
    let fieldArray = [];
    path.split('/').forEach(part => {
      if (part === ROOT_FIELD) {
        fieldArray = this.config.fields;
      } else {
        const index = fieldArray.indexOf(part);
        const next = fieldArray[index + 1];
        if (index === -1 || !Array.isArray(next)) {
          throw new Error(`Invalid path to field: ${path}`);
        }

        fieldArray = next;
      }
    });
    fields.forEach(f => fieldArray.push(f));
    return this;
  }

  /**
   * Includes a fragment in the query
   *
   * @param {string} name
   * @returns {ApolloGraphqlManager}
   */
  useFragment(name) {
    this.config.fragments = [
      ...this.config.fragments,
      name,
    ];

    return this;
  }

  /**
   * Change to another template to use
   *
   * @param {string} name
   * @returns {ApolloGraphqlManager}
   */
  useTemplate(name) {
    if (!Object.keys(this.templates).includes(name)) {
      throw new Error(`
Tried to use template '${name}', which could not be found. Please make sure that it is registered with your Injector.
      `);
    }

    this.config.templateName = name;

    return this;
  }

  /**
   *
   * @param name
   * @param fragment
   * @returns {ApolloGraphqlManager}
   */
  addTempFragment(name, fragment) {
    this.fragments = {
      ...this.fragments,
      [name]: fragment,
    };

    return this.useFragment(name);
  }

  /**
   * Use a custom template
   * @param strings
   * @param expressions
   * @returns {ApolloGraphqlManager}
   */
  setTemplate(strings, ...expressions) {
    this.config.templateName = TEMPLATE_OVERRIDE;

    this.templates = {
      ...this.templates,
      [TEMPLATE_OVERRIDE]: {
        strings,
        expressions,
      }
    };

    return this;
  }

  /**
   * Gets the template before data has been interpolated
   * @param name
   * @returns {*}
   */
  getRawTemplate(name) {
    return this.templates[name];
  }

  /**
   *
   * @param type
   * @param oldValue
   * @param newValue
   * @returns {*}
   */
  coallesceData(type, oldValue, newValue) {
    switch (type) {
      case 'options':
      case 'props':
      case 'variables':
      case 'context':
      case 'optimisticResponse':
        return {
          ...(oldValue || {}),
          ...(newValue || {}),
        };
      case 'refetchQueries':
        return [
          ...(oldValue || []),
          ...(newValue || []),
        ];
      case 'skip':
        return (typeof newValue === 'boolean')
          ? newValue
          : oldValue;
      case 'pollInterval':
        return (typeof newValue === 'number')
          ? newValue
          : oldValue;
      case 'fetchPolicy':
        // null intended to be a valid value
        return (typeof newValue === 'object')
          ? newValue
          : oldValue;
      case 'name':
        return (typeof newValue === 'string')
          ? newValue
          : oldValue;
      case 'withRef':
      case 'notifyOnNetworkStatusChange':
        return newValue || oldValue;
        // case 'update':
      default:
        return null;
    }
  }

  /**
   * Applies decorators to the config and returns a new config object
   * @param prev
   * @param key
   * @returns {Object}
   */
  reduceApolloConfig(prev, key) {
    const calculateValue = (oldValue, transform) => {
      const newValue = transform(oldValue);

      return this.coallesceData(key, oldValue, newValue);
    };
    const value = this.apolloConfigInitValues[key];
    const transforms = this.apolloConfigTransforms[key] || [];

    if (deferredApolloConfig.includes(key)) {
      const deferredValue = (...args) => {
        const oldValue = value(...args);
        const bootedTransformers = transforms.map(transform => transform(...args));

        if (key === 'update') {
          return null;
        }
        return bootedTransformers.reduce(calculateValue, oldValue);
      };

      return {
        ...prev,
        [key]: deferredValue,
      };
    }

    if (typeof value === 'undefined' || value === null) {
      return prev;
    }

    const newValue = transforms.reduce(calculateValue, value);

    return {
      ...prev,
      [key]: newValue,
    };
  }

  /**
   *
   * @returns {Object}
   */
  getConfig() {
    return {
      ...this.config,
      availableFragments: {
        ...this.fragments,
      },
    };
  }

  getApolloConfig() {
    const keys = [
      ...Object.keys(this.apolloConfigInitValues),
      ...Object.keys(this.apolloConfigTransforms),
    ]
      .filter((key, index, list) => list.indexOf(key) === index);

    return keys.reduce(this.reduceApolloConfig, {});
  }

  /**
   * Gets the AST for the interpolated string of graphql
   * @returns {Document}
   */
  getGraphqlAST() {
    const config = this.getConfig();
    const template = this.getRawTemplate(config.templateName);

    const expressed = template.expressions.map(expression => {
      if (typeof expression !== 'function') {
        return expression;
      }
      // process any template functions that may have been made available
      return expression(config);
    });

    return gql(template.strings, ...expressed);
  }

  /**
   * Creates the graphql() HOC using the dynamic query and all transforms to config
   * @returns {Function}
   */
  getContainer() {
    return new ApolloGraphqlProxy(this.getGraphqlAST(), this.getApolloConfig());
  }
}

export default ApolloGraphqlManager;
