import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import merge from 'merge';
import schemaFieldValues, { schemaMerge } from 'lib/schemaFieldValues';
import { createErrorBlock } from 'lib/createErrorBlock';
import backend from 'lib/Backend';
import { withInjector, InjectorFunctionalContext } from 'lib/Injector';
import { Controller } from 'react-hook-form';
import ReactHookForm, { ReactHookFormContext } from 'containers/ReactHookForm/ReactHookForm';
import Form from 'components/Form/Form';

const FormBuilder = (props) => {
  const [submittingAction, setSubmittingAction] = useState(null);
  const { injector } = useContext(InjectorFunctionalContext);
  const schemaStructure = props.schema.schema;
  const submitApi = backend.createEndpointFetcher({
    url: schemaStructure.attributes.action,
    method: schemaStructure.attributes.method,
  });

  /**
   * Default data type to component mappings.
   * Used as a fallback when no component type is provided in the form schema.
   *
   * @param {string} dataType - The data type provided by the form schema.
   * @param {string} name - name of the field component
   * @return object|null
   */
  const getComponentForDataType = (dataType, name) => {
    const { identifier } = props;
    const get = (type) => injector.get(type, `${identifier}.${name}`);

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
  };

  const getComponent = ({ name, schemaComponent, schemaType }) => {
    const { identifier, getCustomFields } = props;

    if (getCustomFields) {
      const component = getCustomFields(schemaType, `${identifier}.${name}`);
      if (component) {
        return component;
      }
    }

    if (schemaComponent) {
      // if (schemaComponent !== null) {
      return injector.get(schemaComponent, `${identifier}.${name}`);
    }

    return getComponentForDataType(schemaType, name);
  };

  /**
   * Run validation for every field on the form and return an object which list issues while
   * validating
   *
   * @param values
   * @returns {*}
   */
  const validateForm = (values) => {
    if (typeof props.validate === 'function') {
      return props.validate(values);
    }

    const schema = props.schema && props.schema.schema;
    if (!schema) {
      return {};
    }

    const validationMiddleware = injector.validate(
      props.identifier
    );

    let middlewareValidationResult = {};
    if (validationMiddleware) {
      middlewareValidationResult = validationMiddleware(
        values,
        props.schema.schema
      ) || {};
    }

    return createErrorBlock(middlewareValidationResult);
  };

  /**
   * Common functionality for building a Field or Action from schema.
   *
   * @param {Object} propArgs Props which every form field receives. Leave it up to the
   *        schema and component to determine which props are required.
   * @returns {*}
   */
  const buildComponent = (propArgs) => {
    // Inline `input` props into main field props
    // (each component can pick and choose the props required for it's <input>
    // See http://redux-form.com/6.0.5/docs/api/Field.md/#input-props
    const inputProps = propArgs.input || {};
    const componentProps = {
      ...propArgs,
      ...propArgs.input,
      onChange: inputProps.onChange
        ? (event, payload) => {
          inputProps.onChange(payload ? payload.value : event);
        }
        : null,
    };
    delete componentProps.input;

    // 'component' key is renamed to 'schemaComponent' in normalize*() methods
    const SchemaComponent = getComponent(componentProps);

    if (SchemaComponent === null) {
      return null;
    } else if (componentProps.schemaComponent !== null && SchemaComponent === undefined) {
      throw Error(`Component not found in injector: ${componentProps.schemaComponent}`);
    }

    // Provides container components a place to hook in
    // and apply customisations to scaffolded components.
    const createFn = props.createFn;
    if (typeof createFn === 'function') {
      return createFn(SchemaComponent, componentProps);
    }
    return <SchemaComponent key={componentProps.id} {...componentProps} />;
  };

  /**
   * Maps a list of schema fields to their React Component.
   * Only top level form fields are handled here, composite fields (TabSets etc),
   * are responsible for mapping and rendering their children.
   *
   * @param {Array} fields
   * @return {Array}
   */
  const mapFieldsToComponents = (fields) => fields.map((field) => {
    let newProps = field;
    if (field.children) {
      newProps = Object.assign(
        {},
        field,
        { children: mapFieldsToComponents(field.children) }
      );
    }
    newProps = Object.assign(
      {
        onAutofill: props.onAutofill,
        formid: props.form,
      },
      newProps
    );

    // Don't wrap structural or readonly fields, since they don't need connected fields.
    // The redux-form connected fields also messed up reactstrap's tab handling.
    if (field.schemaType === 'Structural' || field.readOnly === true) {
      return buildComponent(newProps);
    }

    // This is using a context consumer rather than useContext() because this method
    // is actually called in Form.js which is a decendant of ReactHookFormContext.Provider
    // while FormBuilder.js is an ancestor of ReactHookFormContext.Provider
    return <ReactHookFormContext.Consumer>
      {(value) =>
        // https://react-hook-form.com/docs/usecontroller/controller
        <Controller
          key={newProps.id}
          name={newProps.name}
          defaultValue={newProps.value}
          control={value.control}
          render={(renderObj) => {
            // renderObj.fieldState - error, invalid, isDirty, isTouched, isValidating
            // renderObj.formState - defaultValues, dirtyFields, disabled, errors, isDirty,
            //    isLoading, isSubmitSuccessful, isSubmitted, isSubmitting, isValid,
            //    isValidating, submitCount, touchedFields, validatingFields

            const handleChange = (inputValue) => {
              // console.log(inputValue); // update redux here??
              // doing this in onChange rather than onBlur so that you can see the elemental
              // inline save button appear as soon as you start typing
              props.actions.dispatchAddFormChanged(props.identifier, props.schema);
              renderObj.field.onChange(inputValue);
            };

            const newProps2 = Object.assign(
              {
                input: {
                  // name: renderObj.field.name,
                  // ref: renderObj.field.ref,
                  // onChange: renderObj.field.onChange,
                  onChange: handleChange,
                  // onBlur: renderObj.field.onBlur,
                  value: renderObj.field.value,
                }
              },
              newProps
            );

            return buildComponent(newProps2);
          }}
        />
      }
    </ReactHookFormContext.Consumer>;
  });

  /**
   * When the action is clicked on, records which action was clicked on
   * This can allow for preventing the submit action, such as a custom action for the button
   *
   * @param {Event} event
   */
  const handleAction = (event) => {
    // Custom handlers
    if (typeof props.onAction === 'function') {
      props.onAction(event, props.values);
    }

    // Allow custom handlers to cancel event
    if (!event.isPropagationStopped()) {
      setSubmittingAction(event.currentTarget.name);
    }
  };

  /**
   * Form submission handler passed to the Form Component as a prop.
   * Provides a hook for controllers to access for state and provide custom functionality.
   *
   * @param {Object} data Processed and validated data from redux-form
   * (originally retrieved through schemaFieldValues())
   * @return {Promise|null}
   */
  const handleSubmit = (data) => {
    // Add form action data (or default to first action, same as browser behaviour)
    let action = '';
    if (submittingAction) {
      action = submittingAction;
    } else if (props.schema.schema.actions[0]) {
      action = props.schema.schema.actions[0].name;
    }

    const dataWithAction = Object.assign({}, data, action ? { [action]: 1 } : {});
    const requestedSchema = props.responseRequestedSchema.join();
    const headers = {
      'X-Formschema-Request': requestedSchema,
      'X-Requested-With': 'XMLHttpRequest',
    };

    const submitFn = (customData) =>
      submitApi(customData || dataWithAction, headers)
        .then(formSchema => {
          setSubmittingAction(null);
          return formSchema;
        })
        .catch((reason) => {
          setSubmittingAction(null);
          throw reason;
        });

    if (typeof props.onSubmit === 'function') {
      return props.onSubmit(dataWithAction, action, submitFn);
    }

    return submitFn();
  };

  /**
   * Maps a list of form actions to their React Component.
   *
   * @param {Array} actions
   * @return {Array}
   */
  const mapActionsToComponents = (actions) => actions.map((action) => {
    const newProps = Object.assign({}, action);

    if (action.children) {
      newProps.children = mapActionsToComponents(action.children);
    } else {
      newProps.onClick = handleAction;

      // Reset component loading prop
      if (props.submitting && submittingAction === action.name) {
        newProps.loading = true;
      }
    }

    return buildComponent(newProps);
  });

  /**
   * If there is structural and state data available merge those data for each field.
   * Otherwise just use the structural data. Ensure that keys don't conflict
   * with redux-form expectations.
   *
   * @param {array} fields
   * @param {Object} state Optional
   * @return {array}
   */
  const normalizeFields = (fields, state) => fields.map((field) => {
    const fieldState = (state && state.fields)
      ? state.fields.find((item) => item.id === field.id)
      : {};
    const data = merge.recursive(
      true,
      schemaMerge(field, fieldState),
      // Overlap with redux-form prop handling : createFieldProps filters out the 'component' key
      {
        schemaComponent: (fieldState && fieldState.component)
          ? fieldState.component
          : field.component,
      }
    );
    if (field.children) {
      data.children = normalizeFields(field.children, state);
    }

    return data;
  });

  const schema = props.schema.schema;
  const state = props.schema.state;
  // const BaseFormComponent = props.baseFormComponent;

  // Map form schema to React component attribute names,
  // which requires renaming some of them (by unsetting the original keys)
  const attributes = {
    ...schema.attributes,
    className: schema.attributes.class,
    encType: schema.attributes.enctype,
    // Turn off HTML5 validation to rely on validateForm as the sole validator
    noValidate: true,
  };
  delete attributes.class;
  delete attributes.enctype;

  const {
    asyncValidate,
    fieldHolder,
    actionHolder,
    onSubmitFail,
    onSubmitSuccess,
    shouldAsyncValidate,
    touchOnBlur,
    touchOnChange,
    persistentSubmitErrors,
    form,
    afterMessages,
    autoFocus,
    formTag,
  } = props;

  const newProps = {
    form, // required as redux-form identifier
    afterMessages,
    fields: normalizeFields(schema.fields, state),
    fieldHolder,
    actions: normalizeFields(schema.actions, state),
    actionHolder,
    attributes,
    data: schema.data,
    initialValues: schemaFieldValues(schema, state),
    // onSubmit: handleSubmit,
    valid: state && state.valid,
    messages: (state && Array.isArray(state.messages)) ? state.messages : [],
    mapActionsToComponents,
    mapFieldsToComponents,
    asyncValidate,
    onSubmitFail,
    onSubmitSuccess,
    shouldAsyncValidate,
    touchOnBlur,
    touchOnChange,
    persistentSubmitErrors,
    validate: validateForm,
    autoFocus,
    // todo make empty function
    // setDOM: (formDOM) => { formDOMRef = formDOM; },
    setDOM: () => {},
    formTag,
  };

  // this gets turned into an onSubmit prop on components/Form which will be used
  // by react-hook-form
  newProps.handleSubmit = (data) => {
    handleSubmit(data);
  };

  // react-hook-form - using components/Form directly
  return <ReactHookForm>
    <Form {...newProps} />
  </ReactHookForm>;
};

const schemaPropType = PropTypes.shape({
  id: PropTypes.string,
  schema: PropTypes.shape({
    attributes: PropTypes.shape({
      class: PropTypes.string,
      enctype: PropTypes.string,
    }),
    fields: PropTypes.array.isRequired,
  }),
  state: PropTypes.shape({
    fields: PropTypes.array,
  }),
  loading: PropTypes.bool,
  stateOverride: PropTypes.shape({
    fields: PropTypes.array,
  }),
});

const basePropTypes = {
  createFn: PropTypes.func,
  onSubmit: PropTypes.func,
  onAction: PropTypes.func,
  asyncValidate: PropTypes.func,
  onSubmitFail: PropTypes.func,
  onSubmitSuccess: PropTypes.func,
  shouldAsyncValidate: PropTypes.func,
  touchOnBlur: PropTypes.bool,
  touchOnChange: PropTypes.bool,
  persistentSubmitErrors: PropTypes.bool,
  validate: PropTypes.func,
  values: PropTypes.object,
  submitting: PropTypes.bool,
  getCustomFields: PropTypes.func,
  responseRequestedSchema: PropTypes.arrayOf(PropTypes.oneOf([
    'schema', 'state', 'errors', 'auto',
  ])),
  identifier(props, propName, componentName) {
    if (!/^[A-Za-z0-9_.]+$/.test(props[propName])) {
      return new Error(`
        Invalid identifier supplied to ${componentName}. Must be a set of
        dot-separated alphanumeric strings.
      `);
    }

    return null;
  },
};

FormBuilder.propTypes = Object.assign({}, basePropTypes, {
  form: PropTypes.string.isRequired,
  schema: schemaPropType.isRequired,
  autoFocus: PropTypes.bool,
});

FormBuilder.defaultProps = {
  responseRequestedSchema: ['auto'],
  autoFocus: false,
};

export {
  FormBuilder as Component,
  basePropTypes,
  schemaPropType
};
export default withInjector(FormBuilder);
