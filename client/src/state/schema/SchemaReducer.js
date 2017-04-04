import deepFreeze from 'deep-freeze-strict';
import ACTION_TYPES from './SchemaActionTypes';
import merge from 'merge';

const initialState = deepFreeze({});

export default function schemaReducer(state = initialState, action = null) {
  switch (action.type) {
    case ACTION_TYPES.SET_SCHEMA: {
      return deepFreeze(Object.assign({}, state, {
        [action.payload.id]: Object.assign({}, state[action.payload.id], action.payload),
      }));
    }

    case ACTION_TYPES.SET_SCHEMA_STATE_OVERRIDES: {
      const schema = state[action.payload.id];
      const stateOverride = action.payload.stateOverride;
      const fields = schema && schema.state && schema.state.fields
        && schema.state.fields.map((field) => {
          const fieldOverride = stateOverride && stateOverride.fields
            && stateOverride.fields.find((override) => override.name === field.name);
          // need to be recursive for the unknown-sized "data" properly
          return (fieldOverride) ? merge.recursive(true, field, fieldOverride) : field;
        });

      return deepFreeze(Object.assign({}, state, {
        [action.payload.id]: Object.assign({}, schema, {
          stateOverride,
          state: Object.assign(
            {},
            schema && schema.state,
            action.payload.stateOverride,
            { fields }
          ),
        }),
      }));
    }

    case ACTION_TYPES.SET_SCHEMA_LOADING: {
      return deepFreeze(Object.assign({}, state, {
        [action.payload.id]: Object.assign({}, state[action.payload.id], {
          metadata: Object.assign({},
            state[action.payload.id] && state[action.payload.id].metadata,
            { loading: action.payload.loading }
          ),
        }),
      }));
    }

    default:
      return state;
  }
}
