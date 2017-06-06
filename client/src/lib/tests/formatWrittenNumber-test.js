/* global describe, beforeEach, it, expect */

import formatWrittenNumber from '../formatWrittenNumber';

describe('formatWrittenNumber', () => {
  it('should return number in words when the given number is between 0 and 9', () => {
    expect(formatWrittenNumber(0)).toEqual('zero');
    expect(formatWrittenNumber(1)).toEqual('one');
    expect(formatWrittenNumber(2)).toEqual('two');
    expect(formatWrittenNumber(3)).toEqual('three');
    expect(formatWrittenNumber(4)).toEqual('four');
    expect(formatWrittenNumber(5)).toEqual('five');

    expect(formatWrittenNumber('6')).toEqual('six');
    expect(formatWrittenNumber('7')).toEqual('seven');
    expect(formatWrittenNumber('8')).toEqual('eight');
    expect(formatWrittenNumber('9')).toEqual('nine');
  });

  it('should return the same number when the given number is outside of 0 and 9', () => {
    expect(formatWrittenNumber(-1)).toEqual('-1');
    expect(formatWrittenNumber(10)).toEqual('10');
    expect(formatWrittenNumber(99)).toEqual('99');
  });

  it('should return null when the given number is not a number', () => {
    expect(formatWrittenNumber(null)).toEqual(null);
    expect(formatWrittenNumber(undefined)).toEqual(null);
    expect(formatWrittenNumber(NaN)).toEqual(null);
    expect(formatWrittenNumber('one')).toEqual(null);
    expect(formatWrittenNumber(() => {})).toEqual(null);
  });
});

