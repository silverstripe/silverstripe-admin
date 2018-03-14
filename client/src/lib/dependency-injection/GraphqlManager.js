import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

const TEMPLATE_OVERRIDE = '__TEMPLATE_OVERRIDE__';

/**
 * An API for updating the query/mutation parts of a given template
 */
class GraphqlManager {
  constructor(config, templates, fragments) {
    this.config = config;
    this.templates = templates || {};
    this.fragments = fragments || {};
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

  getConfig() {
    return {
      ...this.config,
      availableFragments: {
        ...this.fragments,
      },
    };
  }

  getContainer() {
    const config = this.getConfig();
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

    return graphql(query, config);
  }
}

export default GraphqlManager;
