import React, { PropTypes, Component } from 'react';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';

class IframeDialog extends Component {
  renderHeader() {
    const title = this.props.title;
    if (title) {
      return (
        <ModalHeader>{title}</ModalHeader>
      );
    }
    return null;
  }

  render() {
    return (
      <Modal
        isOpen={this.props.isOpen}
        onExit={this.props.onExit}
        className={this.props.className}
        modalClassName={this.props.modalClassName}
      >
        {this.renderHeader()}
        <ModalBody className={this.props.bodyClassName}>
          <iframe
            id={this.props.iframeId}
            className={this.props.iframeClassName}
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
  onExit: PropTypes.func,
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
