import React, { PropTypes, Component } from 'react';
import { Modal } from 'react-bootstrap-ss';

class IframeDialog extends Component {
  renderHeader() {
    const title = this.props.title;
    if (title) {
      return (
        <Modal.Header><Modal.Title>{title}</Modal.Title></Modal.Header>
      );
    }
    return null;
  }

  render() {
    return (
      <Modal
        show={this.props.show}
        onHide={this.props.onHide}
        className={this.props.className}
        dialogClassName={this.props.dialogClassName}
      >
        {this.renderHeader()}
        <Modal.Body className={this.props.bodyClassName}>
          <iframe
            id={this.props.iframeId}
            className={this.props.iframeClassName}
            src={this.props.url}
            frameBorder={0}
          />
        </Modal.Body>
      </Modal>
    );
  }
}

IframeDialog.propTypes = {
  url: PropTypes.string.isRequired,
  onHide: PropTypes.func,
  show: PropTypes.bool,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  dialogClassName: PropTypes.string,
  iframeId: PropTypes.string,
  iframeClassName: PropTypes.string,
  className: PropTypes.string,
  bodyClassName: PropTypes.string,
};

IframeDialog.defaultProps = {
  show: false,
  title: null,
};

export default IframeDialog;
