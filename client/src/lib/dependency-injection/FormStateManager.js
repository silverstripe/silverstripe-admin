import classnames from 'classnames';
import createClassMap from '../createClassMap';
import setIn from 'redux-form/lib/structure/plain/setIn';
import {
  getFormValues,
  isDirty,
  isPristine,
  isValid,
  isInvalid,
} from 'redux-form';
import { schemaMerge, findField } from 'lib/schemaFieldValues';

const getFormState = state => state;
/**
 * An API for updating schema state
 */
class FormStateManager {
  /**
   * Constructor
   * @param {object} schema
   * @param {object} reduxFormState
   */
  constructor(schema, reduxFormState) {
    const state = schema.state || {};
    const fields = state.fields || [];

    this.schema = {
      ...schema,
      state: {
        ...state,
        fields: [
          ...fields,
        ],
      },
    };
    this.mockGlobalState = setIn({}, schema.name, reduxFormState);
  }

  /**
   * Gets a field given its name attribute
   * @param {string} fieldName
   * @return {object}
   */
  getFieldByName(fieldName) {
    const schemaForm = {
      fields: [],
      actions: [],
      ...this.schema.schema,
    };
    const fields = [...schemaForm.fields, ...schemaForm.actions];
    const schema = findField(fields, fieldName);
    const state = this.schema.state.fields.find(field => field.name === fieldName);

    return schemaMerge(schema, state);
  }

  /**
   * Updates a field by callback
   * @param {string} fieldName
   * @param {function} updater
   * @returns {FormStateManager}
   */
  mutateField(fieldName, updater) {
    const fieldList = this.schema.state.fields || [];
    const fieldIndex = fieldList.findIndex(field => field.name === fieldName);

    if (fieldIndex < 0) {
      return this;
    }

    const fields = [...fieldList];
    const field = this.getFieldByName(fieldName);
    fields[fieldIndex] = schemaMerge(field, updater(field));

    this.schema.state.fields = fields;

    return this;
  }

  /**
   * Merges properties into a field
   * @param {string} fieldName
   * @param {object} update
   * @returns {FormStateManager}
   */
  updateField(fieldName, update) {
    return this.mutateField(fieldName, (field) => ({
      ...field,
      ...update,
    }));
  }

  /**
   * Updates multiple fields given a map of fieldname
   * to mutation
   * @param {object} updates
   * @returns {FormStateManager}
   */
  updateFields(updates) {
    Object.keys(updates).forEach(key => {
      this.updateField(key, updates[key]);
    });

    return this;
  }

  /**
   * Sets a component for a field
   * @param {string} fieldName
   * @param {string} component The component as registered in Injector
   * @returns {FormStateManager}
   */
  setFieldComponent(fieldName, component) {
    return this.updateField(fieldName, { component });
  }

  /**
   * Toggles a CSS class on a field
   * @param {string} fieldName
   * @param {string} className
   * @param {boolean} active
   * @returns {FormStateManager}
   */
  setFieldClass(fieldName, className, active = true) {
    return this.mutateField(fieldName, (field) => {
      const classConfig = createClassMap(field.extraClass);
      classConfig[className] = active;
      return {
        ...field,
        extraClass: classnames(classConfig),
      };
    });
  }

  /**
   * Adds a CSS class to a field
   * @param {string} fieldName
   * @param {string} className
   * @returns {FormStateManager}
   */
  addFieldClass(fieldName, className) {
    return this.setFieldClass(fieldName, className, true);
  }

  /**
   * Removes a CSS class from a field
   * @param {string} fieldName
   * @param {string} className
   * @returns {FormStateManager}
   */
  removeFieldClass(fieldName, className) {
    return this.setFieldClass(fieldName, className, false);
  }

  /**
   * Gets a map of form field names to their values
   * @returns {object}
   */
  getValues() {
    return getFormValues(
        this.schema.name,
        getFormState
      )(this.mockGlobalState) || {};
  }

  /**
   * Gets the value of a single form field
   * @param fieldName
   * @returns {string}
   */
  getValue(fieldName) {
    return this.getValues()[fieldName];
  }

  /**
   * Returns true if any form fields have been altered from their original state
   * @returns {boolean}
   */
  isDirty() {
    return isDirty(
      this.schema.name,
      getFormState
    )(this.mockGlobalState);
  }

  /**
   * Returns true if no form fields have been altered from their original state
   * @returns {boolean}
   */
  isPristine() {
    return isPristine(
      this.schema.name,
      getFormState
    )(this.mockGlobalState);
  }

  /**
   * Returns true if the form passes all of its validation rules
   * @returns {boolean}
   */
  isValid() {
    return isValid(
      this.schema.name,
      getFormState
    )(this.mockGlobalState);
  }

  /**
   * Returns true if the form fails validation
   * @returns {boolean}
   */
  isInvalid() {
    return isInvalid(
      this.schema.name,
      getFormState
    )(this.mockGlobalState);
  }

  /**
   * Gets the mutated schema state
   * @returns {object}
   */
  getState() {
    return this.schema;
  }
}

export default FormStateManager;
