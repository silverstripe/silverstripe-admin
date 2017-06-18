import cx from 'classnames';

/**
 * An API for updating schema state
 */
export default class {

  /**
   * Constructor
   * @param {object} schemaState
   */
  constructor(schemaState) {
    this.schemaState = { ...schemaState };
  }

  /**
   * Gets a field given its name attribute
   * @param {string} field
   * @return {object}
   */
  getFieldByName(field) {
    return this.schemaState.fields.find(f => f.name === field);
  }

  /**
   * Updates a field by callback
   * @param {string} fieldName
   * @param {function} updater
   * @returns {this}
   */
  mutateField(fieldName, updater) {
    const fieldList = this.schemaState.fields || [];
    const fieldIndex = fieldList.findIndex(f => f.name === fieldName);
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
   * @returns {this}
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
   * @returns {this}
   */
  updateFields(updates) {
    Object.keys(updates).forEach(k => {
      this.updateField(k, updates[k]);
    });

    return this;
  }

  /**
   * Sets a component for a field
   * @param {string} fieldName
   * @param {string} component The component as registered in Injector
   * @returns {this}
   */
  setFieldComponent(fieldName, component) {
    return this.updateField(fieldName, { component });
  }

  /**
   * Toggles a CSS class on a field
   * @param {string} fieldName
   * @param {string} className
   * @param {boolean} active
   * @returns {this}
   */
  setFieldClass(fieldName, className, active = true) {
    return this.mutateField(fieldName, (field) => {
      const classConfig = {};
      if (field.extraClass) {
        field.extraClass.split(' ').forEach(c => {
          classConfig[c.trim()] = true;
        });
      }
      classConfig[className] = active;
      return {
        ...field,
        extraClass: cx(classConfig),
      };
    });
  }

  /**
   * Adds a CSS class to a field
   * @param {string} fieldName
   * @param {string} className
   * @returns {this}
   */
  addFieldClass(fieldName, className) {
    return this.setFieldClass(fieldName, className, true);
  }

  /**
   * Removes a CSS class from a field
   * @param {string} fieldName
   * @param {string} className
   * @returns {this}
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
