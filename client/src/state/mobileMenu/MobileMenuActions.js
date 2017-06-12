import ACTION_TYPES from './MobileMenuActionTypes';

export function toggleMobileMenu() {
  return {
    type: ACTION_TYPES.TOGGLE_MENU,
    payload: null,
  };
}
