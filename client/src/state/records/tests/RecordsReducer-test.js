/* global jest, describe, beforeEach, it, expect */

jest.dontMock('deep-freeze-strict');
jest.dontMock('../RecordsReducer');
jest.dontMock('../RecordsActionTypes');

const recordsReducer = require('../RecordsReducer').default;
const ACTION_TYPES = require('../RecordsActionTypes').default;

describe('recordsReducer', () => {
  describe('FETCH_RECORD_SUCCESS', () => {
    let initialState = null;
    beforeEach(() => {
      initialState = {
        TypeA: [{ ID: 11, title: 'record a11' }, { ID: 12, title: 'record a12' }],
        TypeB: [{ ID: 11, title: 'record b11' }],
      };
    });

    it('adds a new record', () => {
      const nextState = recordsReducer(initialState, {
        type: ACTION_TYPES.FETCH_RECORD_SUCCESS,
        payload: { recordType: 'TypeA', data: { ID: 13, title: 'record a13' } },
      });
      expect(nextState.TypeA).toEqual([
        { ID: 11, title: 'record a11' },
        { ID: 12, title: 'record a12' },
        { ID: 13, title: 'record a13' },
      ]);
      expect(nextState.TypeB).toEqual([
        { ID: 11, title: 'record b11' },
      ]);
    });

    it('updates existing record', () => {
      const nextState = recordsReducer(initialState, {
        type: ACTION_TYPES.FETCH_RECORD_SUCCESS,
        payload: { recordType: 'TypeA', data: { ID: 11, title: 'record a11 updated' } },
      });
      expect(nextState.TypeA).toEqual([
        { ID: 11, title: 'record a11 updated' },
        { ID: 12, title: 'record a12' },
      ]);
      expect(nextState.TypeB).toEqual([
        { ID: 11, title: 'record b11' },
      ]);
    });
  });

  describe('DELETE_RECORD_SUCCESS', () => {
    let initialState = null;

    beforeEach(() => {
      initialState = {
        TypeA: [{ ID: 11 }, { ID: 12 }],
        TypeB: [{ ID: 11 }, { ID: 12 }],
      };
    });

    it('removes records from the declared type', () => {
      const nextState = recordsReducer(initialState, {
        type: ACTION_TYPES.DELETE_RECORD_SUCCESS,
        payload: { recordType: 'TypeA', id: 12 },
      });

      expect(nextState.TypeA).toEqual([
        { ID: 11 },
      ]);
      expect(nextState.TypeB).toEqual([
        { ID: 11 },
        { ID: 12 },
      ]);
    });
  });
});
