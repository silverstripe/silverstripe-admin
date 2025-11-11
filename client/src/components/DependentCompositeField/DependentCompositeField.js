import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { bindActionCreators, compose } from 'redux';
import { useSelector, connect } from 'react-redux';
import { getFormValues, change } from 'redux-form';
import Loading from 'components/Loading/Loading';
import backend from 'lib/Backend';
import castStringToElement from 'lib/castStringToElement';
import getFormState from 'lib/getFormState';
import * as toastsActions from 'state/toasts/ToastsActions';
import i18n from 'i18n';
import debounce from 'lodash/debounce';
import PropTypes from 'prop-types';

const DependentCompositeField = ({
  actions,
  // initialChildrenSchema represents the children schema prior to calling any dependency callbacks
  // and should not be used directly when building child components.
  childrenSchema: initialChildrenSchema,
  className = '',
  data,
  extraClass = '',
  formFieldSchemaFunctions,
  formid,
  ...props
}) => {
  const Tag = data.tag || 'div';
  // childrenSchema reprensents the children schema after calling any dependency callbacks
  // and may not always match what is passed in through props.
  const [childrenSchema, setChildrenSchema] = useState(initialChildrenSchema);
  const [loading, setLoading] = useState(false);
  const reduxState = useSelector(storedState => storedState);

  // This dependency array allows us to only update the field when message text updates for any of the child fields.
  const effectDeps = initialChildrenSchema?.map(
    childField => [childField.name, childField.message?.rawValue]
  ) ?? [];
  // This effect fires any time a child field message changes, e.g. for validation messages.
  // It adds messages from the prop schema into the state schema.
  // This is necessary because FormBuilderLoader.reduceSchemaErrors updates the state which will
  // be reflected in the prop value - but that prop may have outdated information in other respects
  // such as which component to render.
  useEffect(() => {
    // If we have no schema prop, there's no change to make.
    if (!initialChildrenSchema) {
      return;
    }
    // The logic is done in a callback so that if this happens in the same
    // cycle as the call in the change handler, we update that state rather
    // than replacing it.
    setChildrenSchema((oldSchema) => {
      const newSchema = [];
      let hasChange = false;
      for (const initialChild of initialChildrenSchema) {
        const newChild = Object.assign({}, oldSchema.find((item) => item.id === initialChild.id));
        // If the new message is different to what we have, grab the message.
        if (newChild.message?.rawValue !== initialChild.message?.rawValue) {
          newChild.message = initialChild.message;
          hasChange = true;
        }
        newSchema.push(newChild);
      }
      // Return the original state if no changes were made.
      // React won't trigger a rerender if it detects the state didn't change.
      return hasChange ? newSchema : oldSchema;
    });
  }, effectDeps);

  /**
   * Handle changes to internal field values and update the schema appropriately.
   * Using useCallback and debounce to prevent issues fetching a new schema while the user is still typing.
   */
  const handleChange = useCallback(debounce((value, state, schema, allChildrenNames) => {
    setLoading(true);
    // Call existing callback if there was one
    if (typeof schema.onChange === 'function') {
      schema.onChange(value);
    }
    // Get values from redux store and remove any entries that aren't for the child field values.
    const allValues = getFormValues(formid, getFormState)(state);
    const onlyNecessaryValues = Object.fromEntries(Object.entries(allValues).filter(
      ([key]) => allChildrenNames.includes(key)
    ));
    const body = {
      fieldName: schema.name,
      origValues: onlyNecessaryValues,
      newValue: value,
    };
    // Fetch new schema from the updateChildrenURL endpoint
    const getNewFieldSchemaApi = backend.createEndpointFetcher({
      url: data.updateChildrenURL,
      payloadFormat: 'json',
    });
    getNewFieldSchemaApi(body)
      .then(response => {
        if (!response.schema || !response.state) {
          actions.toasts.error(i18n._t('DependentCompositeField.INVALID_RESPONSE', 'Invalid response when updating child fields'));
          setLoading(false);
          return;
        }
        const normalisedFields = formFieldSchemaFunctions.normalizeFields(response.schema, response.state);
        setChildrenSchema(normalisedFields);
        // Update state in redux form to reflect new values returned from API call for all fields with updated values
        for (const fieldData of response.state.fields) {
          if (fieldData.value !== onlyNecessaryValues[fieldData.name]) {
            const valueAsNumber = Number(fieldData.value);
            if (Number.isInteger(valueAsNumber)) {
              fieldData.value = valueAsNumber;
            }
            props.meta.dispatch(change(formid, fieldData.name, fieldData.value));
          }
        }
        setLoading(false);
      })
      .catch((reason) => {
        actions.toasts.error(i18n._t('DependentCompositeField.FAILURE', 'Failed to update child fields'));
        setLoading(false);
        throw reason;
      });
  }, 300), []);

  /**
   * Builds the legend for a fieldset if it is defined
   * See CompositeField.getLegend()
   *
   * @returns {Component|null}
   */
  const getLegend = () => {
    if (data.tag === 'fieldset' && data.legend) {
      return castStringToElement('legend', data.legend);
    }
    return null;
  };

  /**
   * Update schema to include onChange handler so we can fetch dependant fields when changing field values.
   * @param {array} schemaToUpdate
   * @returns {array} The updated schema
   */
  const addOnChangeHookToSchema = (schemaToUpdate) => {
    // Set new array instead of altering the old one to avoid weird react problems with updating prop values.
    const mutableChildrenSchema = [];
    const allChildrenNames = schemaToUpdate.map(field => field.name);
    for (const schema of schemaToUpdate) {
      const mutableSchema = {
        ...schema,
        onChange: (value) => handleChange(value, reduxState, schema, allChildrenNames),
      };
      mutableChildrenSchema.push(mutableSchema);
    }
    return mutableChildrenSchema;
  };

  /**
   * Build the child components based on their schema.
   * Memoised to avoid recreating the children components every time this parent component gets rerendered.
   */
  const children = useMemo(() => {
    if (!childrenSchema) {
      return null;
    }
    const mutableChildrenSchema = addOnChangeHookToSchema(childrenSchema);
    return formFieldSchemaFunctions.mapFieldsToComponents(mutableChildrenSchema);
  }, [childrenSchema]);

  return (
    <Tag className={`dependent-composite-field__container ${className} ${extraClass}`}>
      {getLegend()}
      {children}
      {loading && <Loading />}
    </Tag>
  );
};

DependentCompositeField.propTypes = {
  data: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.shape({
      tag: PropTypes.string,
      legend: PropTypes.string,
    }),
  ]).isRequired,
  extraClass: PropTypes.string,
  childrenSchema: PropTypes.array.isRequired,
  formFieldSchemaFunctions: PropTypes.shape({
    mapFieldsToComponents: PropTypes.func.isRequired,
    normalizeFields: PropTypes.func.isRequired,
  }).isRequired,
};

// redux actions loaded into props - used to get toast notifications
const mapDispatchToProps = (dispatch) => ({
  actions: {
    toasts: bindActionCreators(toastsActions, dispatch),
  },
});

export { DependentCompositeField as Component };

export default compose(
  connect(null, mapDispatchToProps)
)(DependentCompositeField);
