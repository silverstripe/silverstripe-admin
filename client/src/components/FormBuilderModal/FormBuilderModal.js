import React, { Component } from 'react';
import i18n from 'i18n';
import { Modal } from 'react-bootstrap-ss';
import FormBuilderLoader from 'containers/FormBuilderLoader/FormBuilderLoader';
import castStringToElement from 'lib/castStringToElement';

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
    if (!this.props.schemaUrl) {
      return null;
    }
    return (
      <FormBuilderLoader
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
    if (typeof this.props.onHide === 'function') {
      this.props.onHide();
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
    if (this.props.title !== false) {
      return (
        <Modal.Header closeButton><Modal.Title>{this.props.title}</Modal.Title></Modal.Header>
      );
    }

    if (typeof this.props.onHide === 'function') {
      return (
        <button
          type="button"
          className="close form-builder-modal__close-button"
          onClick={this.handleHide}
          aria-label={i18n._t('Admin.CLOSE', 'Close')}
        >
          <span aria-hidden="true">×</span>
        </button>
      );
    }

    return null;
  }

  render() {
    const form = this.getForm();
    const response = this.getResponse();

    return (
      <Modal
        show={this.props.show}
        onHide={this.handleHide}
        className={this.props.className}
        dialogClassName={this.props.dialogClassName}
        bsSize={this.props.bsSize}
      >
        {this.renderHeader()}
        <Modal.Body className={this.props.bodyClassName}>
          {response}
          {form}
          {this.props.children}
        </Modal.Body>
      </Modal>
    );
  }
}

FormBuilderModal.propTypes = {
  show: React.PropTypes.bool,
  title: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.bool]),
  className: React.PropTypes.string,
  bodyClassName: React.PropTypes.string,
  onHide: React.PropTypes.func,
  schemaUrl: React.PropTypes.string,
  onSubmit: React.PropTypes.func,
  onAction: React.PropTypes.func,
  responseClassGood: React.PropTypes.string,
  responseClassBad: React.PropTypes.string,
  identifier: React.PropTypes.string,
  // Ignored and assumed true if onLoadingError is unassigned
  showErrorMessage: React.PropTypes.bool,
  onLoadingError: React.PropTypes.func,
};

FormBuilderModal.defaultProps = {
  showErrorMessage: false,
  onLoadingError: noop,
  show: false,
  title: null,
  responseClassGood: 'alert alert-success',
  responseClassBad: 'alert alert-danger',
};

export default FormBuilderModal;
