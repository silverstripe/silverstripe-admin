import React from 'react';
import i18n from 'i18n';
import { Modal } from 'react-bootstrap-ss';
import SilverStripeComponent from 'lib/SilverStripeComponent';

class LoginDialog extends SilverStripeComponent {

  renderHeader() {
    const title = this.props.title || i18n._t('Admin.CMS_LOGIN_TITLE', 'Login');
    return (
      <Modal.Header><Modal.Title>{title}</Modal.Title></Modal.Header>
    );
  }

  render() {
    return (
      <Modal
        show={this.props.show}
        onHide={this.handleHide}
        className={this.props.className}
        dialogClassName={this.props.dialogClassName}
      >
        {this.renderHeader()}
        <Modal.Body className={this.props.bodyClassName}>
          <iframe id="login-dialog-iframe" className={this.props.iframeClassName}
            src={this.props.url} frameBorder={0}
          />
        </Modal.Body>
      </Modal>
    );
  }
}

LoginDialog.propTypes = {
  url: React.PropTypes.string.isRequired,
  show: React.PropTypes.bool,
  title: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.bool]),
  dialogClassName: React.PropTypes.string,
  iframeClassName: React.PropTypes.string,
  className: React.PropTypes.string,
  bodyClassName: React.PropTypes.string,
};

LoginDialog.defaultProps = {
  show: false,
  title: null,
};

export default LoginDialog;
