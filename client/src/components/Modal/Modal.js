import React from 'react';
import { Modal as ReactStrapModal } from 'reactstrap';

import PropTypes from 'prop-types';
import ModalHeader from './ModalHeader';

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
    <ModalHeader
      onClosed={onClosed}
      title={title}
      ModalHeaderComponent={ModalHeaderComponent}
      showCloseButton={showCloseButton}
    />
    {children}
  </ModalComponent>
);

Modal.propTypes = {
  isOpen: PropTypes.bool,
  className: PropTypes.string,
  modalClassName: PropTypes.string,
  size: PropTypes.oneOf(['', 'sm', 'lg', 'xl']),
  ModalComponent: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  ...ModalHeader.propTypes
};

Modal.defaultProps = {
  isOpen: false,
  ModalComponent: ReactStrapModal,
};

export default Modal;
