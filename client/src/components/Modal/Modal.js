import React from 'react';
import { Modal as ReactStrapModal } from 'reactstrap';

import PropTypes from 'prop-types';
import ModalHeader from './ModalHeader';

/**
 * Component to render a modal
 */
function Modal({
  onClosed, title, ModalHeaderComponent, showCloseButton, children,
  ModalComponent, isOpen, className, modalClassName, size
}) {
  return (
    <ModalComponent
      isOpen={isOpen}
      toggle={onClosed}
      className={className}
      modalClassName={modalClassName}
      size={size}
    >
      <ModalHeader
        onClosed={onClosed}
        title={title}
        ModalHeaderComponent={ModalHeaderComponent}
        showCloseButton={showCloseButton}
      />
      {children}
    </ModalComponent>
  );
}

Modal.propTypes = {
  isOpen: PropTypes.bool,
  className: PropTypes.string,
  modalClassName: PropTypes.string,
  size: PropTypes.string,
  ModalComponent: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  ...ModalHeader.propTypes
};

Modal.defaultProps = {
  isOpen: false,
  ModalComponent: ReactStrapModal,
};

export default Modal;
