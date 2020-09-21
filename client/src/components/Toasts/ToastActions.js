import React from 'react';
import PropTypes from 'prop-types';
import Button from 'components/Button/Button';

/**
 * Display an individual toast action. Actions can be button or links.
 * When an href prop is provided, we assume the action is meant to be a link.
 */
const ToastAction = ({ label, href, onClick, dismissed, onDismiss }) => {
  const props = href ?
    { href, tag: 'a' } :
    { onClick: (e) => {
      e.preventDefault();

      // When the toast is in the process of being dismiss, suppress action
      if (!dismissed) {
        if (onClick) { onClick(); }
        // Dismiss the toast after it has fired its action
        onDismiss();
      }
    } };

  return <Button color="link" className="toast__action" {...props}>{label}</Button>;
};

/**
 * Display a list of toast actions. Up to 2 actions can be displayed.
 */
const ToastActions = ({ actions, dismissed, onDismiss }) => (
  actions.length === 0 ? null :
  <div className="toast__actions">
    {actions.slice(0, 2).map(
      (props, index) =>
        // eslint-disable-next-line react/no-array-index-key
        <ToastAction key={index} {...props} onDismiss={onDismiss} dismissed={dismissed} />
      )
    }
  </div>
);

ToastActions.propTypes = {
  dismissed: PropTypes.bool.isRequired,
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      href: PropTypes.string,
      onClick: PropTypes.func
    })
  ),
  onDismiss: PropTypes.func.isRequired
};

ToastActions.defaultProps = {
  actions: []
};

export { ToastAction, ToastActions };

export default ToastActions;
