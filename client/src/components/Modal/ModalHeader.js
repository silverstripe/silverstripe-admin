import React from 'react';
import i18n from 'i18n';
import { ModalHeader as ReactStrapModalHeader } from 'reactstrap';
import PropTypes from 'prop-types';

/**
 * Component to render a modal header.
 */
function ModalHeader({ onClosed, title, ModalHeaderComponent, showCloseButton }) {
  if (title !== false) {
    if (typeof title === 'object') {
      // FormSchema title occasionally contains html, only render text for modal title
      const doc = new DOMParser().parseFromString(title.html, 'text/html');
      title = doc.body.textContent || '';
    }
    return (
      <ModalHeaderComponent toggle={onClosed}>{title}</ModalHeaderComponent>
    );
  }

  if (showCloseButton === true && typeof onClosed === 'function') {
    return (
      <button
        type="button"
        className="close modal__close-button"
        onClick={onClosed}
        aria-label={i18n._t('Admin.CLOSE', 'Close')}
      />
    );
  }

  return null;
}
ModalHeader.propTypes = {
  title: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
    PropTypes.shape({ html: PropTypes.string })
  ]),
  showCloseButton: PropTypes.bool,
  onClosed: PropTypes.func,
  ModalHeaderComponent: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
};

ModalHeader.defaultProps = {
  isOpen: false,
  title: null,
  ModalHeaderComponent: ReactStrapModalHeader,
};

export default ModalHeader;
