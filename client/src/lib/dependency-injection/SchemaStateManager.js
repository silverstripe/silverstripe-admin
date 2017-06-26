import classnames from 'classnames';
import createClassMap from '../createClassMap';
/**
 * An API for updating schema state
 */
class SchemaStateManager {

  /**
   * Constructor
   * @param {object} schemaState
   */
  constructor(schemaState) {
    this.schemaState = { ...schemaState };
  }

  /**
   * Gets a field given its name attribute
   * @param {string} fieldName
   * @return {object}
   */
  getFieldByName(fieldName) {
    return this.schemaState.fields.find(field => field.name === fieldName);
  }

  /**
   * Updates a field by callback
   * @param {string} fieldName
   * @param {function} updater
   * @returns {SchemaStateManager}
   */
  mutateField(fieldName, updater) {
    const fieldList = this.schemaState.fields || [];
    const fieldIndex = fieldList.findIndex(field => field.name === fieldName);
    if (fieldIndex < 0) {
      return this;
    }
    const field = fieldList[fieldIndex];
    const fields = [...fieldList];
    fields[fieldIndex] = { ...updater(field) };
    this.schemaState.fields = fields;

    return this;
  }

  /**
   * Merges properties into a field
   * @param {string} fieldName
   * @param {object} update
   * @returns {SchemaStateManager}
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
   * @returns {SchemaStateManager}
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
   * @returns {SchemaStateManager}
   */
  setFieldComponent(fieldName, component) {
    return this.updateField(fieldName, { component });
  }

  /**
   * Toggles a CSS class on a field
   * @param {string} fieldName
   * @param {string} className
   * @param {boolean} active
   * @returns {SchemaStateManager}
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
   * @returns {SchemaStateManager}
   */
  addFieldClass(fieldName, className) {
    return this.setFieldClass(fieldName, className, true);
  }

  /**
   * Removes a CSS class from a field
   * @param {string} fieldName
   * @param {string} className
   * @returns {SchemaStateManager}
   */
  removeFieldClass(fieldName, className) {
    return this.setFieldClass(fieldName, className, false);
  }

  /**
   * Gets the mutated schema state
   * @returns {object}
   */
  getState() {
    return this.schemaState;
  }
}

export default SchemaStateManager;
