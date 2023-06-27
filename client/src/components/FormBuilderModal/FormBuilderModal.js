import React, { Component } from 'react';
import i18n from 'i18n';
import { Modal, ModalHeader } from 'reactstrap';
import FormBuilderLoader from 'containers/FormBuilderLoader/FormBuilderLoader';
import castStringToElement from 'lib/castStringToElement';
import classnames from 'classnames';
import PropTypes from 'prop-types';

const noop = () => null;

class FormBuilderModal extends Component {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleHide = this.handleHide.bind(this);
    this.clearResponse = this.clearResponse.bind(this);
    this.handleLoadingError = this.handleLoadingError.bind(this);
  }

  /**
   * Defines the form part of the Modal
   *
   * @returns {Component}
   */
  getForm() {
    const { FormBuilderLoaderComponent } = this.props;
    if (!this.props.schemaUrl) {
      return null;
    }
    return (
      <FormBuilderLoaderComponent
        fieldHolder={{ className: classnames('modal-body', this.props.bodyClassName) }}
        actionHolder={{ className: 'modal-footer' }}
        autoFocus={this.props.autoFocus}
        schemaUrl={this.props.schemaUrl}
        onSubmit={this.handleSubmit}
        onAction={this.props.onAction}
        onLoadingError={this.handleLoadingError}
        identifier={this.props.identifier}
      />
    );
  }

  /**
   * Generates the response part of the Modal
   *
   * @returns {Component}
   */
  getResponse() {
    if (!this.state || !this.state.response) {
      return null;
    }

    let className = '';

    if (this.state.error) {
      className = this.props.responseClassBad;
    } else {
      className = this.props.responseClassGood;
    }

    return (
      <div className={className}>
        { castStringToElement('span', { html: this.state.response }) }
      </div>
    );
  }

  /**
   * Removes the response from the state
   */
  clearResponse() {
    this.setState({
      response: null,
    });
  }

  handleLoadingError(schema) {
    const providesOnLoadingError = this.props.onLoadingError !== noop;
    if (this.props.showErrorMessage || !providesOnLoadingError) {
      const error = schema.errors && schema.errors[0];
      this.setState({
        response: error.value,
        error: true,
      });
    }
    if (providesOnLoadingError) {
      this.props.onLoadingError(schema);
    }
  }

  /**
   * Call the callback for hiding this Modal
   */
  handleHide() {
    this.clearResponse();
    if (typeof this.props.onClosed === 'function') {
      this.props.onClosed();
    }
  }

  /**
   * Handle submitting the form in the Modal
   *
   * @param {Object} data
   * @param {String} action
   * @param {Function} submitFn The original submit function
   * @returns {Promise}
   */
  handleSubmit(data, action, submitFn) {
    this.clearResponse();
    let promise = null;
    if (typeof this.props.onSubmit === 'function') {
      promise = this.props.onSubmit(data, action, submitFn);
    } else {
      promise = submitFn();
    }

    if (promise) {
      // do not want this as part of the main promise chain.
      promise
        .then((response) => {
          if (response) {
            this.setState({
              response: response.message,
              error: false,
            });
          }
          return response;
        })
        .catch((errorPromise) => {
          errorPromise.then((errorText) => {
            this.setState({
              response: errorText,
              error: true,
            });
          });
        });
    } else {
      throw new Error('Promise was not returned for submitting');
    }

    return promise;
  }

  renderHeader() {
    let { title } = this.props;
    const { ModalHeaderComponent } = this.props;

    if (title !== false) {
      if (typeof title === 'object') {
        // FormSchema title occasionaly contains html, only render text for modal title
        const doc = new DOMParser().parseFromString(title.html, 'text/html');
        title = doc.body.textContent || '';
      }
      return (
        <ModalHeaderComponent toggle={this.handleHide}>{title}</ModalHeaderComponent>
      );
    }

    if (this.props.showCloseButton === true && typeof this.props.onClosed === 'function') {
      return (
        <button
          type="button"
          className="close modal__close-button"
          onClick={this.handleHide}
          aria-label={i18n._t('Admin.CLOSE', 'Close')}
        />
      );
    }

    return null;
  }

  render() {
    const form = this.getForm();
    const response = this.getResponse();
    const { ModalComponent } = this.props;

    return (
      <ModalComponent
        isOpen={this.props.isOpen}
        toggle={this.handleHide}
        className={this.props.className}
        modalClassName={this.props.modalClassName}
        size={this.props.size}
      >
        {this.renderHeader()}
        {response}
        {form}
        {this.props.children}
      </ModalComponent>
    );
  }
}

FormBuilderModal.propTypes = {
  autoFocus: PropTypes.bool,
  isOpen: PropTypes.bool,
  title: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
    PropTypes.shape({ html: PropTypes.string })
  ]),
  className: PropTypes.string,
  bodyClassName: PropTypes.string,
  modalClassName: PropTypes.string,
  showCloseButton: PropTypes.bool,
  size: PropTypes.string,
  onClosed: PropTypes.func,
  schemaUrl: PropTypes.string,
  onSubmit: PropTypes.func,
  onAction: PropTypes.func,
  responseClassGood: PropTypes.string,
  responseClassBad: PropTypes.string,
  identifier: PropTypes.string,
  // Ignored and assumed true if onLoadingError is unassigned
  showErrorMessage: PropTypes.bool,
  onLoadingError: PropTypes.func,
  ModalComponent: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  ModalHeaderComponent: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  FormBuilderLoaderComponent: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
};

FormBuilderModal.defaultProps = {
  showErrorMessage: false,
  showCloseButton: true,
  onLoadingError: noop,
  isOpen: false,
  title: null,
  modalClassName: 'form-builder-modal',
  responseClassGood: 'alert alert-success',
  responseClassBad: 'alert alert-danger',
  ModalComponent: Modal,
  ModalHeaderComponent: ModalHeader,
  FormBuilderLoaderComponent: FormBuilderLoader,
};

export default FormBuilderModal;
