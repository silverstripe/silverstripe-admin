import deepFreeze from 'deep-freeze-strict';
import ACTION_TYPES from './RecordsActionTypes';

const initialState = {};

function recordsReducer(state = initialState, action) {
  switch (action.type) {
    case ACTION_TYPES.FETCH_RECORDS_SUCCESS: {
      const recordType = action.payload.recordType;
      if (!recordType) {
        throw new Error('Undefined record type');
      }
      const records = action.payload.data._embedded[recordType] || [];
      return deepFreeze({
        ...state,
        [recordType]: records,
      });
    }

    case ACTION_TYPES.FETCH_RECORD_SUCCESS: {
      const recordType = action.payload.recordType;
      const newRecord = action.payload.data;
      if (!recordType) {
        throw new Error('Undefined record type');
      }
      if (!newRecord) {
        throw new Error('Undefined record data given');
      }
      const records = state[recordType] || [];
      // Conditionally replace or append
      if (records.find((next) => next.ID === newRecord.ID)) {
        return deepFreeze({
          ...state,
          [recordType]: records.map((next) => (next.ID === newRecord.ID ? newRecord : next)),
        });
      }
      return deepFreeze({
        ...state,
        [recordType]: [...records, newRecord],
      });
    }

    case ACTION_TYPES.DELETE_RECORD_SUCCESS: {
      const recordType = action.payload.recordType;
      if (!recordType) {
        throw new Error('Undefined record type');
      }
      const records = state[recordType]
        .filter((record) => record.ID !== action.payload.id);

      return deepFreeze({
        ...state,
        [recordType]: records,
      });
    }

    default: {
      return state;
    }
  }
}

export default recordsReducer;
