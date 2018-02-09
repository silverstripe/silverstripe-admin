import TYPES from './usedOnTypes';

const initialState = {
  loading: [],
  usedOn: {},
  errors: {},
};

function usedOnReducer(state = initialState, action) {
  const identifier = action && action.payload && action.payload.identifier;

  if (!identifier) {
    return state;
  }

  switch (action.type) {
    case TYPES.SAVE_USED_ON: {
      const usedOn = action.payload.usedOn;

      return {
        ...state,
        loading: state.loading.filter(loading => loading !== identifier),
        usedOn: {
          ...state.usedOn,
          [identifier]: usedOn.usage,
        },
      };
    }
    case TYPES.LOAD_USED_ON: {
      if (state.loading.includes(identifier)) {
        return state;
      }
      return {
        ...state,
        loading: [
          ...state.loading,
          identifier,
        ],
        // remove any previous errors
        errors: Object.entries(state.errors).reduce((result, [key, error]) => {
          if (key === identifier) {
            return result;
          }
          return {
            ...result,
            [key]: error,
          };
        }, {}),
      };
    }
    case TYPES.LOAD_USED_ON_FAILED: {
      const error = action.payload.error;

      return {
        ...state,
        loading: state.loading.filter(loading => loading !== identifier),
        errors: {
          ...state.errors,
          [identifier]: error,
        },
      };
    }
    default: {
      return state;
    }
  }
}

export default usedOnReducer;
