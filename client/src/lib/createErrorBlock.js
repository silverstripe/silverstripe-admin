import React from 'react';

/**
 * Creates the React UI portion of the error block
 *
 * @param {array} errors
 * @return {object}
 */
const createErrorHtml = (errors) => ({
  type: 'error',
  value: {
    react: errors.map((error, index) => (
      // eslint-disable-next-line react/no-array-index-key
      <span key={index} className="form__validation-message">{error}</span>
    ))
  }
});

/**
 * Given a block of fieldnames mapped to a list of errors, create UI-ready validation messages
 *
 * @param errors ( { fieldName: [ 'error one', 'error two' ] } )
 * @return {object}
 */
const createErrorBlock = (errors) =>
  Object.entries(errors).reduce((prev, curr) => {
    const [fieldName, messages] = curr;
    if (!messages || !messages.length) {
      return prev;
    }
    const messageList = (Array.isArray(messages)) ? messages : [messages];
    return {
      ...prev,
      [fieldName]: createErrorHtml(messageList)
    };
  }, {});

export default createErrorBlock;

export {
  createErrorHtml,
  createErrorBlock
};
