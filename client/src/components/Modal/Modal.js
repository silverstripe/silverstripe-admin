import React from 'react';
import {
  Modal as ReactStrapModal,
  ModalHeader as ReactStrapModalHeader
} from 'reactstrap';
import i18n from 'i18n';
import PropTypes from 'prop-types';

/**
 * The modal title can be pass as a string or an object with a html property.
 * This utility method parse the title back to a string.
 * @param string|object title
 * @returns string
 */
function parseTitle(title) {
  if (typeof title === 'object') {
    // FormSchema title occasionally contains html, only render text for modal title
    const doc = new DOMParser().parseFromString(title.html, 'text/html');
    return doc.body.textContent || '';
  }

  return title;
}

/**
 * Component to render a modal
 */
const Modal = ({
  children,
  className,
  isOpen,
  modalClassName,
  ModalComponent,
  ModalHeaderComponent,
  onClosed,
  showCloseButton,
  size,
  title,
}) => (
  <ModalComponent
    isOpen={isOpen}
    toggle={onClosed}
    className={className}
    modalClassName={modalClassName}
    size={size}
  >
    {title !== false && (
    <ModalHeaderComponent
      toggle={onClosed}
      title={title}
    >
      {parseTitle(title)}
    </ModalHeaderComponent>
    )}

    {title === false &&
    showCloseButton === true &&
    typeof onClosed === 'function' && (
      <button
        type="button"
        className="btn-close modal__close-button"
        onClick={onClosed}
        aria-label={i18n._t('Admin.CLOSE', 'Close')}
      />
    )}

    {children}
  </ModalComponent>
);

Modal.propTypes = {
  className: PropTypes.string,
  isOpen: PropTypes.bool,
  modalClassName: PropTypes.string,
  ModalComponent: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  ModalHeaderComponent: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  onClosed: PropTypes.func,
  size: PropTypes.oneOf(['', 'sm', 'lg', 'xl']),
  showCloseButton: PropTypes.bool,
  title: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
    PropTypes.shape({ html: PropTypes.string })
  ]),
};

Modal.defaultProps = {
  isOpen: false,
  ModalComponent: ReactStrapModal,
  ModalHeaderComponent: ReactStrapModalHeader,
  title: null,
};

export default Modal;
