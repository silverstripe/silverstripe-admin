import ACTION_TYPES from './ViewModeActionTypes';

export function selectEditMode() {
  return {
    type: ACTION_TYPES.SELECT_EDIT,
  };
}

export function selectPreviewMode() {
  return {
    type: ACTION_TYPES.SELECT_PREVIEW,
  };
}

export function selectSplitMode() {
  return {
    type: ACTION_TYPES.SELECT_SPLIT,
  };
}

export function enableOrDisableSplitMode(panelWidth) {
  return {
    type: ACTION_TYPES.SPLIT_AVAILABLE,
    payload: { panelWidth },
  };
}
