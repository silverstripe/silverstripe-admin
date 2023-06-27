import React, { Component } from 'react';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import classnames from 'classnames';
import PropTypes from 'prop-types';

class IframeDialog extends Component {
  constructor(props) {
    super(props);

    this.handleClosed = this.handleClosed.bind(this);
  }

  handleClosed() {
    if (typeof this.props.onClosed === 'function') {
      this.props.onClosed();
    }
  }

  renderHeader() {
    const title = this.props.title;
    if (title) {
      return (
        <ModalHeader toggle={this.handleClosed}>{title}</ModalHeader>
      );
    }
    return null;
  }

  render() {
    return (
      <Modal
        isOpen={this.props.isOpen}
        onClosed={this.handleClosed}
        className={classnames('iframe-dialog', this.props.className)}
        modalClassName={this.props.modalClassName}
      >
        {this.renderHeader()}
        <ModalBody className={this.props.bodyClassName}>
          <iframe
            id={this.props.iframeId}
            className={classnames('iframe-dialog__iframe', this.props.iframeClassName)}
            src={this.props.url}
            frameBorder={0}
          />
        </ModalBody>
      </Modal>
    );
  }
}

IframeDialog.propTypes = {
  url: PropTypes.string.isRequired,
  onClosed: PropTypes.func,
  isOpen: PropTypes.bool,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  modalClassName: PropTypes.string,
  iframeId: PropTypes.string,
  iframeClassName: PropTypes.string,
  className: PropTypes.string,
  bodyClassName: PropTypes.string,
};

IframeDialog.defaultProps = {
  isOpen: false,
  title: null,
};

export default IframeDialog;
