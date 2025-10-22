import React from 'react';
import PropTypes from 'prop-types';
import Button from 'components/Button/Button';
import i18n from 'i18n';

/**
 * Close button for inside a modal header
 */
const ModalCloseButton = ({ onClosed, classNames }) => (
  <Button
    className={`btn btn-close btn--icon-xl btn--no-text modal__close-button ${classNames}`}
    onClick={onClosed}
    aria-label={i18n._t('Admin.CLOSE', 'Close')}
    title={i18n._t('Admin.CLOSE', 'Close')}
    icon="cancel"
  />
);

ModalCloseButton.propTypes = {
  classNames: PropTypes.string,
  onClosed: PropTypes.func,
};

export default ModalCloseButton;
