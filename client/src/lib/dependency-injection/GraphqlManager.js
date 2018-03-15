import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

const TEMPLATE_OVERRIDE = '__TEMPLATE_OVERRIDE__';
const protectedConfig = ['templateName', 'fields', 'fragments'];
const deferredApolloConfig = ['options', 'props', 'variables', 'skip', 'update'];

/**
 * An API for updating the query/mutation parts of a given template
 */
class GraphqlManager {
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
      fields: [<string>],
      params: [<string>],
      pagination: <boolean>,
      templateName: <string>,
    }
   *
   * @param {object} config - default config options which we extrapolate as the "base" behaviour.
   * @param {object} templates - a key-value map of templates
   * @param {object} fragments - a key-value map of fragments
   */
  constructor(config, templates, fragments) {
    const {
      apolloConfig,
      ...otherConfig
    } = config;

    this.config = otherConfig;
    this.apolloConfigInitValues = apolloConfig;
    this.apolloConfigTransforms = {};
    this.templates = { ...templates } || {};
    this.fragments = { ...fragments } || {};
  }

  setConfig(name, value) {
    // prevent overriding functionally important configs
    if (protectedConfig.includes(name)) {
      throw new Error(`
Tried to set protected config values: '${name}', which is discouraged.
      `);
    }
    this.config = {
      ...this.config,
      [name]: value,
    };

    return this;
  }

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

  addParam(param) {
    return this.addParams([param]);
  }

  addParams(params = []) {
    const existing = this.config.params;
    this.config.params = [
      ...existing,
      ...params,
    ];

    return this;
  }

  addField(field) {
    return this.addFields([field]);
  }

  addFields(fields = []) {
    const existing = this.config.fields;
    this.config.fields = [
      ...existing,
      ...fields,
    ];

    return this;
  }

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
   * @param name
   * @return {GraphqlManager}
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

  addTempFragment(name, fragment) {
    this.fragments = {
      ...this.fragments,
      [name]: fragment,
    };

    return this.useFragment(name);
  }

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

  getRawTemplate(name) {
    return this.templates[name];
  }

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
        // null intended to be valid value
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

  reduceApolloConfig(prev, key) {
    const calculateValue = (oldValue, transform) => {
      const newValue = transform(oldValue);

      return this.coallesceData(key, oldValue, newValue);
    };
    const value = this.apolloConfigInitValues[key];
    const transforms = this.apolloConfigTransforms[key];

    if (deferredApolloConfig.includes(key)) {
      const deferredValue = (...args) => {
        const bootedTransformers = transforms.map(transform => transform(...args));

        if (key === 'update') {
          return null;
        }
        return bootedTransformers.reduce(calculateValue, value);
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

  getContainer() {
    const config = this.getConfig();
    const apolloConfig = this.getApolloConfig();
    const template = this.getRawTemplate(config.templateName);

    const expressed = template.expressions.map(expression => {
      if (typeof expression !== 'function') {
        return expression;
      }
      // process any template functions that may have been made available
      return expression(config);
    });

    const query = gql(template.strings, ...expressed);

    // can provide AST manipulation here

    return graphql(query, apolloConfig);
  }
}

export default GraphqlManager;
