import deepFreeze from 'deep-freeze-strict';
import ACTION_TYPES from './SchemaActionTypes';

const initialState = deepFreeze({});

export default function schemaReducer(state = initialState, action = null) {
  switch (action.type) {
    case ACTION_TYPES.SET_SCHEMA: {
      const oldSchema = state[action.payload.id] || {};

      return deepFreeze({
        ...state,
        [action.payload.id]: { ...oldSchema, ...action.payload },
      });
    }

    // if values need to be overwritten straight away, use redux-form autoFill API
    // for setting values overwriting schema values if a new schema is loaded afterwards
    case ACTION_TYPES.SET_SCHEMA_STATE_OVERRIDES: {
      const schema = state[action.payload.id] || {};
      const stateOverride = action.payload.stateOverride;

      if (!stateOverride || !stateOverride.fields) {
        return state;
      }

      return deepFreeze({
        ...state,
        [action.payload.id]: {
          ...schema,
          stateOverride,
        },
      });
    }

    case ACTION_TYPES.SET_SCHEMA_LOADING: {
      const schema = state[action.payload.id] || {};
      const metadata = schema.metadata || {};

      return deepFreeze({
        ...state,
        [action.payload.id]: {
          ...schema,
          metadata: {
            ...metadata,
            loading: action.payload.loading,
          },
        },
      });
    }

    default:
      return state;
  }
}
