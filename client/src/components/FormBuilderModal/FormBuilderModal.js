import React, { useState } from 'react';
import FormBuilderLoader from 'containers/FormBuilderLoader/FormBuilderLoader';
import castStringToElement from 'lib/castStringToElement';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import Modal from 'components/Modal/Modal';
import pick from 'lodash/pick';

const noop = () => null;

/**
 * React component for displaying a Form in a Modal using a form schema URL
 */
function FormBuilderModal(props) {
  const {
    responseClassBad,
    responseClassGood,
    onLoadingError,
    showErrorMessage,
    onClosed,
    onSubmit,
    schemaUrl,
    bodyClassName,
    FormBuilderLoaderComponent,
    children
  } = props;

  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  // Register a success message
  const setSuccess = (message) => {
    setResponse(message);
    setError(false);
  };

  // Register a failure message
  const setFailure = (message) => {
    setResponse(message);
    setError(true);
  };

  // Clear the response
  const clearResponse = () => {
    setResponse(null);
    setError(false);
  };

  const handleLoadingError = (schema) => {
    const providesOnLoadingError = onLoadingError !== noop;
    if (showErrorMessage || !providesOnLoadingError) {
      const errorResponse = schema.errors && schema.errors[0];
      setFailure(errorResponse.value);
    }
    if (providesOnLoadingError) {
      onLoadingError(schema);
    }
  };

  /**
   * Call the callback for hiding this Modal
   */
  const handleHide = () => {
    clearResponse();
    if (typeof onClosed === 'function') {
      onClosed();
    }
  };

  /**
   * Handle submitting the form in the Modal
   *
   * @param {Object} data
   * @param {String} action
   * @param {Function} submitFn The original submit function
   * @returns {Promise}
   */
  const handleSubmit = (data, action, submitFn) => {
    clearResponse();
    let promise = null;
    if (typeof onSubmit === 'function') {
      promise = onSubmit(data, action, submitFn);
    } else {
      promise = submitFn();
    }

    if (promise) {
      // do not want this as part of the main promise chain.
      promise
        .then((successResponse) => {
          if (successResponse) {
            setSuccess(successResponse.message);
          }
          return successResponse;
        })
        .catch((errorPromise) => {
          errorPromise.then((errorText) => {
            setFailure(errorText);
          });
        });
    } else {
      throw new Error('Promise was not returned for submitting');
    }

    return promise;
  };

  const modalProps = pick(props, Object.keys(Modal.propTypes));
  const formBuilderProps = pick(props, [
    'schemaUrl', 'bodyClassName', 'autoFocus', 'onAction', 'identifier'
  ]);

  return (
    <Modal {...modalProps} onClosed={handleHide}>
      {response &&
        <div className={error ? responseClassBad : responseClassGood}>
          { castStringToElement('span', { html: response }) }
        </div>
      }
      {schemaUrl &&
        <FormBuilderLoaderComponent
          {...formBuilderProps}
          fieldHolder={{ className: classnames('modal-body', bodyClassName) }}
          actionHolder={{ className: 'modal-footer' }}
          onSubmit={handleSubmit}
          onLoadingError={handleLoadingError}
        />
      }
      {children}
    </Modal>
  );
}

FormBuilderModal.propTypes = {
  autoFocus: PropTypes.bool,
  bodyClassName: PropTypes.string,
  schemaUrl: PropTypes.string,
  onSubmit: PropTypes.func,
  onAction: PropTypes.func,
  responseClassGood: PropTypes.string,
  responseClassBad: PropTypes.string,
  identifier: PropTypes.string,
  // Ignored and assumed true if onLoadingError is unassigned
  showErrorMessage: PropTypes.bool,
  onLoadingError: PropTypes.func,
  FormBuilderLoaderComponent: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  ...Modal.propTypes,
};

FormBuilderModal.defaultProps = {
  showErrorMessage: false,
  onLoadingError: noop,
  modalClassName: 'form-builder-modal',
  responseClassGood: 'alert alert-success',
  responseClassBad: 'alert alert-danger',
  FormBuilderLoaderComponent: FormBuilderLoader,
};

export default FormBuilderModal;
