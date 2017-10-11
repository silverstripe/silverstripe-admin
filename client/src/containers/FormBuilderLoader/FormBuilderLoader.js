import i18n from 'i18n';
import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import fetch from 'isomorphic-fetch';
import deepFreeze from 'deep-freeze-strict';
import {
  SubmissionError,
  autofill,
  initialize,
} from 'redux-form';
import schemaFieldValues from 'lib/schemaFieldValues';
import * as schemaActions from 'state/schema/SchemaActions';
import merge from 'merge';
import FormBuilder, { basePropTypes, schemaPropType } from 'components/FormBuilder/FormBuilder';
import getIn from 'redux-form/lib/structure/plain/getIn';
import { inject } from 'lib/Injector';
import getFormState from 'lib/getFormState';

/**
 * Creates a dot-separated identifier for forms generated
 * with schemas (e.g. FormBuilderLoader)
 *
 * @param {string} identifier
 * @param {object} schema
 * @returns {string}
 */
function createFormIdentifierFromProps({ identifier, schema = {} }) {
  return [
    identifier,
    schema.schema && schema.schema.name,
  ].filter(id => id).join('.');
}

class FormBuilderLoader extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.reduceSchemaErrors = this.reduceSchemaErrors.bind(this);
    this.handleAutofill = this.handleAutofill.bind(this);
  }

  componentDidMount() {
    this.fetch();
  }

  componentDidUpdate(prevProps) {
    if (this.props.schemaUrl !== prevProps.schemaUrl) {
      this.fetch();
    }
  }

  /**
   * Get server-side validation messages returned and display them on the form.
   *
   * @param state
   * @returns {object}
   */
  getMessages(state) {
    const messages = {};

    // only error messages are collected
    // TODO define message type as standard "success", "info", "warning" and "danger"
    if (state && state.fields) {
      state.fields.forEach((field) => {
        if (field.message) {
          messages[field.name] = field.message;
        }
      });
    }
    return messages;
  }

  getIdentifier(props = this.props) {
    return createFormIdentifierFromProps(props);
  }

  /**
   * Handles updating the schema after response is received and gathering server-side validation
   * messages.
   *
   * @param {object} data
   * @param {string} action
   * @param {function} submitFn
   * @returns {Promise}
   */
  handleSubmit(data, action, submitFn) {
    let promise = null;

    // need to initialise form data and setSchema before any redirects by callbacks happen
    const newSubmitFn = () => (
      submitFn()
        .then(formSchema => {
          let schema = formSchema;
          if (schema) {
            // Before modifying schema, check if the schema state is provided explicitly
            const explicitUpdatedState = typeof schema.state !== 'undefined';

            // Merge any errors into the current state to update messages and alerts
            schema = this.reduceSchemaErrors(schema);
            this.props.actions.schema.setSchema(
              this.props.schemaUrl,
              schema,
              this.getIdentifier()
            );

            // If state is updated in server response, re-initialize redux form state
            if (explicitUpdatedState) {
              const schemaRef = schema.schema || this.props.schema.schema;
              const formData = schemaFieldValues(schemaRef, schema.state);
              this.props.actions.reduxForm.initialize(this.getIdentifier(), formData);
            }
          }
          return schema;
        })
    );

    if (typeof this.props.onSubmit === 'function') {
      promise = this.props.onSubmit(data, action, newSubmitFn);
    } else {
      promise = newSubmitFn();
    }

    if (!promise) {
      throw new Error('Promise was not returned for submitting');
    }

    return promise
      // TODO Suggest storing messages in a separate redux store rather than throw an error
      // ref: https://github.com/erikras/redux-form/issues/94#issuecomment-143398399
      .then(formSchema => {
        if (!formSchema || !formSchema.state) {
          return formSchema;
        }
        const messages = this.getMessages(formSchema.state);

        if (Object.keys(messages).length) {
          throw new SubmissionError(messages);
        }
        return formSchema;
      });
  }

  /**
   * Given a submitted schema, ensure that any errors property is merged safely into
   * the state.
   *
   * @param {Object} schema - New schema result
   * @return {Object}
   */
  reduceSchemaErrors(schema) {
    // Skip if there are no errors
    if (!schema.errors) {
      return schema;
    }

    // Inherit state from current schema if not being assigned in this request
    let reduced = Object.assign({}, schema);
    if (!reduced.state) {
      reduced = Object.assign({}, reduced, { state: this.props.schema.state });
    }

    // Modify state.fields and replace state.messages
    reduced = Object.assign({}, reduced, {
      state: Object.assign({}, reduced.state, {
        // Replace message property for each field
        fields: reduced.state.fields.map((field) => Object.assign({}, field, {
          message: schema.errors.find((error) => error.field === field.name),
        })),
        // Non-field messages
        messages: schema.errors.filter((error) => !error.field),
      }),
    });

    // Can be safely discarded
    delete reduced.errors;
    return deepFreeze(reduced);
  }

  /**
   * Checks for any state override data provided, which will take precendence over the state
   * received through fetch.
   *
   * This is important for editing a WYSIWYG item which needs the form schema and only parts of
   * the form state.
   *
   * @param {object} state
   * @returns {object}
   */
  overrideStateData(state) {
    if (!this.props.stateOverrides || !state) {
      return state;
    }
    const fieldOverrides = this.props.stateOverrides.fields;
    let fields = state.fields;
    if (fieldOverrides && fields) {
      fields = fields.map((field) => {
        const fieldOverride = fieldOverrides.find((override) => override.name === field.name);
        // need to be recursive for the unknown-sized "data" properly
        return (fieldOverride) ? merge.recursive(true, field, fieldOverride) : field;
      });
    }

    return Object.assign({},
      state,
      this.props.stateOverrides,
      { fields }
    );
  }

  /**
   * Call to make the fetching happen
   *
   * @param headerValues
   * @returns {*}
   */
  callFetch(headerValues) {
    return fetch(this.props.schemaUrl, {
      headers: {
        'X-FormSchema-Request': headerValues.join(','),
        Accept: 'application/json',
      },
      credentials: 'same-origin',
    })
      .then((response) => {
        if (response.status >= 200 && response.status < 300) {
          return response.json();
        }
        return new Promise(
          (resolve, reject) => response
            .json()
            .then((json) => {
              reject({
                status: response.status,
                statusText: response.statusText,
                json,
              });
            })
            .catch(() => {
              reject({
                status: response.status,
                statusText: response.statusText,
                json: {},
              });
            })
        );
      });
  }

  /**
   * Fetches data used to generate a form. This can be form schema and/or form state data.
   * When the response comes back the data is saved to state.
   *
   * @param {Boolean} schema If form schema data should be returned in the response.
   * @param {Boolean} state If form state data should be returned in the response.
   * @param {Boolean} errors If form errors should be returned in the response.
   * @return {Object} Promise from the AJAX request.
   */
  fetch(schema = true, state = true, errors = true) {
    if (this.props.loading) {
      return Promise.resolve({});
    }

    // Note: `errors` is only valid for submissions, not schema requests, so omitted here
    const headerValues = [
      'auto',
      schema && 'schema',
      state && 'state',
      errors && 'errors',
    ].filter(header => header);


    // using `this.state.fetching` caused race-condition issues.
    this.props.actions.schema.setSchemaLoading(this.props.schemaUrl, true);

    if (typeof this.props.onFetchingSchema === 'function') {
      this.props.onFetchingSchema();
    }

    return this.callFetch(headerValues)
      .then(formSchema => {
        this.props.actions.schema.setSchemaLoading(this.props.schemaUrl, false);

        if (formSchema.errors) {
          if (typeof this.props.onLoadingError === 'function') {
            this.props.onLoadingError(formSchema);
          }
        } else if (typeof this.props.onLoadingSuccess === 'function') {
          this.props.onLoadingSuccess();
        }

        if (typeof formSchema.id !== 'undefined' && formSchema.state) {
          const overriddenSchema = Object.assign({},
            formSchema,
            {
              state: this.overrideStateData(formSchema.state),
            }
          );

          this.props.actions.schema.setSchema(
            this.props.schemaUrl,
            overriddenSchema,
            // Mock the will-be shape of the props so that the identifier is right
            createFormIdentifierFromProps({
              ...this.props,
              schema: {
                ...this.props.schema,
                ...overriddenSchema,
              },
            })
          );

          const schemaData = formSchema.schema || this.props.schema.schema;
          const formData = schemaFieldValues(schemaData, overriddenSchema.state);

          // need to initialize the form again in case it was loaded before
          // this will re-trigger Injector.form APIs, reset values and reset pristine state as well
          this.props.actions.reduxForm.initialize(
            this.getIdentifier(),
            formData,
            false,
            { keepSubmitSucceeded: true }
          );

          return overriddenSchema;
        }
        return formSchema;
      })
      .catch((error) => {
        this.props.actions.schema.setSchemaLoading(this.props.schemaUrl, false);
        if (typeof this.props.onLoadingError === 'function') {
          return this.props.onLoadingError(this.normaliseError(error));
        }
        // Assign onLoadingError to suppress this
        throw error;
      });
  }

  /**
   * Convert error to a json object to pass to onLoadingError
   *
   * @param {Object} error
   */
  normaliseError(error) {
    // JSON result contains errors.
    // See LeftAndMain::jsonError() for format
    if (error.json && error.json.errors) {
      return error.json;
    }

    // Standard http errors
    if (error.status && error.statusText) {
      return {
        errors: [
          {
            code: error.status,
            value: error.statusText,
            type: 'error',
          },
        ],
      };
    }

    // Handle exception
    const message = error.message
      || i18n._t('Admin.UNKNOWN_ERROR', 'An unknown error has occurred.');
    return {
      errors: [
        {
          value: message,
          type: 'error',
        },
      ],
    };
  }

  /**
   * Sets the value of a field based on actions within other fields, this is a more semantic way to
   * change a field's value than calling onChange() for the target field.
   *
   * By virtue of redux-form, it also flags the field as "meta.autofilled"
   *
   * @param field
   * @param value
   */
  handleAutofill(field, value) {
    this.props.actions.reduxForm.autofill(this.getIdentifier(), field, value);
  }

  render() {
    // If the response from fetching the initial data
    // hasn't come back yet, don't render anything.
    if (!this.props.schema || !this.props.schema.schema || this.props.loading) {
      return null;
    }

    const props = Object.assign({}, this.props, {
      form: this.getIdentifier(),
      onSubmitSuccess: this.props.onSubmitSuccess,
      onSubmit: this.handleSubmit,
      onAutofill: this.handleAutofill,
    });

    return <FormBuilder {...props} />;
  }
}

FormBuilderLoader.propTypes = Object.assign({}, basePropTypes, {
  actions: PropTypes.shape({
    schema: PropTypes.object,
    reduxFrom: PropTypes.object,
  }),
  identifier: PropTypes.string.isRequired,
  schemaUrl: PropTypes.string.isRequired,
  schema: schemaPropType,
  form: PropTypes.string,
  submitting: PropTypes.bool,
  onFetchingSchema: PropTypes.func,
});

function mapStateToProps(state, ownProps) {
  const schema = state.form.formSchemas[ownProps.schemaUrl];
  const identifier = createFormIdentifierFromProps({ ...ownProps, schema });
  const reduxFormState = getIn(getFormState(state), identifier);

  const submitting = reduxFormState && reduxFormState.submitting;
  const values = reduxFormState && reduxFormState.values;

  const stateOverrides = schema && schema.stateOverride;
  const loading = schema && schema.metadata && schema.metadata.loading;
  return { schema, submitting, values, stateOverrides, loading };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      schema: bindActionCreators(schemaActions, dispatch),
      reduxForm: bindActionCreators({ autofill, initialize }, dispatch),
    },
  };
}

export { FormBuilderLoader as Component };

export default compose(
  inject(
    ['ReduxForm', 'ReduxFormField'],
    (Form, Field) => ({
      baseFormComponent: Form,
      baseFieldComponent: Field,
    }),
    ({ identifier }) => identifier
  ),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(FormBuilderLoader);
