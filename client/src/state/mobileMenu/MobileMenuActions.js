import ACTION_TYPES from './MobileMenuActionTypes';

export function toggleMobileMenu() {
  return {
    type: ACTION_TYPES.TOGGLE_MENU,
    payload: null,
  };
}

export function openMobileMenu() {
  return {
    type: ACTION_TYPES.OPEN_MENU,
    payload: null,
  };
}

export function closeMobileMenu() {
  return {
    type: ACTION_TYPES.CLOSE_MENU,
    payload: null,
  };
}
