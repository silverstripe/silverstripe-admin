import ACTION_TYPES from './InjectorActionTypes';

/**
 * Notifies injected reducers they
 * have been registered.
 *
 * @param {object} config
 */
export function notifyRegistration() {
  return {
    type: ACTION_TYPES.NOTIFY_REGISTRATION,
  };
}

