import TYPES from './usedOnTypes';
import fetch from 'isomorphic-fetch';

export function saveUsedOn(identifier, usedOn) {
  return {
    type: TYPES.SAVE_USED_ON,
    payload: { identifier, usedOn },
  };
}

export function loadUsedOnFailed(identifier, error) {
  return {
    type: TYPES.LOAD_USED_ON_FAILED,
    payload: {
      identifier,
      error: error.message,
    }
  };
}

export function loadUsedOn(identifier, method, url) {
  const settings = {
    method,
    headers: {
      Accept: 'application/json',
    },
    credentials: 'same-origin',
  };
  return (dispatch) => {
    dispatch({
      type: TYPES.LOAD_USED_ON,
      payload: { identifier },
    });

    return fetch(url, settings)
      .then(response => response.json())
      .then(usedOn => {
        dispatch(saveUsedOn(identifier, usedOn));
      })
      .catch(error => {
        dispatch(loadUsedOnFailed(identifier, error));
      });
  };
}
