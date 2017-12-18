/**
 * An API for updating form validation
 */
class FormValidationManager {
  /**
   * Constructor
   * @param {object} values
   */
  constructor(values) {
    this.values = values;
    this.errorMap = {};
  }

  /**
   * Adds an error to a given field
   * @param {string} fieldName
   * @param {string} message
   * @returns {FormValidationManager}
   */
  addError(fieldName, message) {
    if (!this.fieldExists(fieldName)) {
      throw new Error(`Tried to add error to non-existent field: ${fieldName}`);
    }
    if (!this.errorMap[fieldName]) {
      this.errorMap[fieldName] = [];
    }

    this.errorMap[fieldName] = [
      ...this.errorMap[fieldName],
      message
    ];

    return this;
  }

  /**
   * Adds a list of errors to a field
   * @param {object} A map of field names to a list of errors
   * @returns {FormValidationManager}
   */
  addErrors(map) {
    Object.entries(map).forEach(entry => {
      const [fieldName] = entry;
      let [, messages] = entry;
      if (!Array.isArray(messages)) {
        messages = [messages];
      }
      messages.forEach(message => this.addError(fieldName, message));
    });

    return this;
  }

  /**
   * Removes all errors for a given field
   * @param {string} fieldName
   * @return {FormValidationManager}
   */
  clearErrors(fieldName) {
    if (!this.fieldExists(fieldName)) {
      throw new Error(`Tried to clear errors for non-existent field: ${fieldName}`);
    }

    delete this.errorMap[fieldName];

    return this;
  }

  /**
   * Returns true if the validator has at least one error for a given field
   * @param {string} fieldName
   * @returns {*|boolean}
   */
  hasError(fieldName) {
    return this.fieldExists(fieldName) && !!this.getErrors(fieldName).length;
  }

  /**
   * Returns true if the given field exists in the form validation
   * @param {string} field
   * @returns {boolean}
   */
  fieldExists(field) {
    return Object.keys(this.values).includes(field);
  }

  /**
   * Gets all the errors for a given field
   * @param {string} fieldName
   * @returns []
   */
  getErrors(fieldName) {
    if (!this.fieldExists(fieldName)) {
      throw new Error(`Tried to get errors for non-existent field: ${fieldName}`);
    }

    return this.errorMap[fieldName] || [];
  }

  /**
   * Clears all errors. Resets all validation
   * @return {FormValidationManager}
   */
  reset() {
    this.errorMap = {};
  }

  /**
   * Gets the validation graph
   *
   * @returns {object}
   */
  getState() {
    return this.errorMap;
  }
}

export default FormValidationManager;
