import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { unstable_useBlocker as useBlocker } from 'react-router-dom';

export default function NavigationBlocker({ shouldBlockFn, blockMessage }) {
  const blocker = useBlocker(shouldBlockFn);
  useEffect(() => {
    if (blocker.state === 'blocked') {
      // eslint-disable-next-line no-alert
      const canUnload = confirm(blockMessage);
      if (canUnload) {
        blocker.proceed();
      } else {
        blocker.reset();
      }
    }
  }, [blocker.state]);

  // Don't actually render anything - this component exists purely to hold the blocker
  // logic, which we put here to (hopefully) avoid rerendering the entire app when blocker
  // state changes.
  return null;
}

NavigationBlocker.propTypes = {
  shouldBlockFn: PropTypes.func.isRequired,
  blockMessage: PropTypes.string.isRequired,
};
