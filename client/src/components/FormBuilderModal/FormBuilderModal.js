import React, { useState } from 'react';
import FormBuilderLoader from 'containers/FormBuilderLoader/FormBuilderLoader';
import castStringToElement from 'lib/castStringToElement';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import Modal from 'components/Modal/Modal';

const noop = () => null;

/**
 * React component for displaying a Form in a Modal using a form schema URL
 */
const FormBuilderModal = ({
  children,
  FormBuilderLoaderComponent,
  onLoadingError,
  onSubmit,
  responseClassBad,
  responseClassGood,
  showErrorMessage,

  // Form builder props
  autoFocus,
  bodyClassName,
  identifier,
  onAction,
  schemaUrl,

  // Props pass to modal
  className,
  isOpen,
  modalClassName,
  ModalComponent,
  ModalHeaderComponent,
  onClosed,
  showCloseButton,
  size,
  title,
}) => {
  /** @var {string} response Message we got back from posting the form. */
  const [response, setResponse] = useState(null);
  /** @var {boolean} response Whether the response was an error or not. */
  const [error, setError] = useState(null);

  const handleLoadingError = (schema) => {
    const providesOnLoadingError = onLoadingError !== noop;
    if (showErrorMessage || !providesOnLoadingError) {
      const errorResponse = schema.errors && schema.errors[0];
      setResponse(errorResponse.value);
      setError(true);
    }
    if (providesOnLoadingError) {
      onLoadingError(schema);
    }
  };

  /**
   * Call the callback for hiding this Modal
   */
  const handleHide = () => {
    // Clear state
    setResponse(null);
    setError(false);

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
    // Clear state
    setResponse(null);
    setError(false);

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
            setResponse(successResponse.message);
            setError(false);
          }
          return successResponse;
        })
        .catch((errorPromise) => {
          errorPromise.then((errorText) => {
            setResponse(errorText);
            setError(true);
          });
        });
    } else {
      throw new Error('Promise was not returned for submitting');
    }

    return promise;
  };

  const modalProps = {
    className,
    isOpen,
    modalClassName,
    ModalComponent,
    ModalHeaderComponent,
    onClosed: handleHide,
    showCloseButton,
    size,
    title,
  };
  const formBuilderLoaderProps = {
    actionHolder: { className: 'modal-footer' },
    autoFocus,
    bodyClassName,
    fieldHolder: { className: classnames('modal-body', bodyClassName) },
    identifier,
    onAction,
    onLoadingError: handleLoadingError,
    onSubmit: handleSubmit,
    schemaUrl,
  };

  return (
    <Modal {...modalProps}>
      {response &&
        <div className={error ? responseClassBad : responseClassGood}>
          { castStringToElement('span', { html: response }) }
        </div>
      }
      {schemaUrl && <FormBuilderLoaderComponent {...formBuilderLoaderProps} />}
      {children}
    </Modal>
  );
};

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
