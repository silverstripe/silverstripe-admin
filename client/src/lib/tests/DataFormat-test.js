/* global jest, jasmine, describe, beforeEach, it, pit, expect, process */


jest.unmock('isomorphic-fetch');
jest.unmock('../DataFormat');
jest.unmock('qs');
jest.unmock('merge');

import { decodeQuery, fileSize } from '../DataFormat';


describe('DataFormat', () => {
  describe('decodeQuery', () => {
    it('should decode flat keys', () => {
      expect(decodeQuery('?foo=1')).toEqual({ foo: '1' });
    });
    it('should decode nested keys (PHP style)', () => {
      expect(decodeQuery('?foo[bar]=1')).toEqual({ foo: { bar: '1' } });
    });
  });

  describe('fileSize', () => {
    it('should display the size of a 200 byte file', () => {
      expect(fileSize(200)).toEqual('200 bytes');
    });
    it('should display the rounded size of a 200 kilobyte file', () => {
      expect(fileSize(200 * 1024)).toEqual('200 KB');
    });
    it('should display the rounded size of a 2.76 megabyte file', () => {
      expect(fileSize(2.76 * 1024 * 1024)).toEqual('2.8 MB');
    });
    it('should display the rounded size of a 200 megabyte file', () => {
      expect(fileSize(200 * 1024 * 1024)).toEqual('200 MB');
    });
    it('should display the rounded size of a 2.76 gigabyte file', () => {
      expect(fileSize(2.76 * 1024 * 1024 * 1024)).toEqual('2.8 GB');
    });
  });
});
