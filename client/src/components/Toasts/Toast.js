import React from 'react';
import PropTypes from 'prop-types';
import i18n from 'i18n';
import { Toast as BsToast, ToastBody } from 'reactstrap';
import classnames from 'classnames';
import { ToastActions } from './ToastActions';
import Button from 'components/Button/Button';

/**
 * Props for an individual Toast
 */
export const toastShape = {
  text: PropTypes.string.isRequired,
  dismissed: PropTypes.bool.isRequired,
  type: PropTypes.string.isRequired,
  actions: PropTypes.arrayOf(PropTypes.shape(Button.propTypes))
};

/**
 * Display an individual toast
 */
const Toast = ({ type, text, onDismiss, dismissed, actions }) => {
  // handler for close button
  const toggle = (e) => {
    e.preventDefault();
    onDismiss();
  };

  const className = classnames('toast', `toast--${type}`, { 'toast--dismissing': dismissed });

  return (
    <BsToast className={className} isOpen>
      <ToastBody className="toast__body">
        <Button className="toast__close" icon="cancel" noText onClick={toggle} color="none">
          {i18n._t('Admin.DISMISS', 'Dismiss')}
        </Button>
        <div className="toast__content" role="alert" aria-live="assertive" aria-atomic="true">
          {text}
        </div>
      </ToastBody>
      {actions.length > 0 &&
        <ToastActions actions={actions} onDismiss={onDismiss} dismissed={dismissed} />
      }
    </BsToast>
  );
};

Toast.propTypes = {
  ...toastShape,
  onDismiss: PropTypes.func.isRequired
};

Toast.defaultProps = {
  actions: []
};


export default Toast;
