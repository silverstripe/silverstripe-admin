import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Toast, { toastPropType } from './Toast';

/**
 * Time in milliseconds to wait before we action the pause/resume calls.
 * @type {number}
 */
const debounceTime = 100;

/**
 * Display a list of toasts notifications in the top right corner.
 */
const Toasts = ({ toasts, onDismiss, onPause, onResume }) => {
  // This timeout is used to debounce the pause/resume calls
  const [timeoutRef, setTimeoutRef] = useState(undefined);

  const debounce = (fn) => (() => {
    if (timeoutRef) { clearTimeout(timeoutRef); }
    setTimeoutRef(setTimeout(fn, debounceTime));
  });

  const pause = debounce(onPause);
  const resume = debounce(onResume);

  // We want to pause and resume the dismissal of our toast when they get and loose focus
  // or are moused over/out.
  const handlers = {
    onMouseEnter: pause,
    onFocus: pause,
    onMouseLeave: resume,
    onBlur: resume,
  };

  return (
    <div className="toasts" aria-live="polite" aria-atomic="true" {...handlers}>
      <div className="toasts__wrapper">
        {toasts.map(({ id, ...toast }) =>
          <Toast key={id} onDismiss={() => onDismiss(id)} {...toast} />
        )}
      </div>
    </div>
  );
};

Toasts.propTypes = {
  toasts: PropTypes.arrayOf(PropTypes.shape(toastPropType)).isRequired,
  onDismiss: PropTypes.func.isRequired,
  onPause: PropTypes.func.isRequired,
  onResume: PropTypes.func.isRequired,
};

Toasts.defaultProps = { };

export default Toasts;
