/* global jest, describe, beforeEach, it, expect, console */
import { joinUrlPaths } from 'lib/urls';

describe('urls', () => {
  describe('joinUrlPaths()', () => {
    it('should add a slash between paths', () => {
      const value = joinUrlPaths('some', 'path');
      expect(value).toBe('some/path');
    });

    it('should only include a single slash between paths', () => {
      const value1 = joinUrlPaths('some/', 'path');
      const value2 = joinUrlPaths('some', '/path');
      const value3 = joinUrlPaths('some/', '/path');
      expect(value1).toBe('some/path');
      expect(value2).toBe('some/path');
      expect(value3).toBe('some/path');
    });

    it('should retain leading and trailing slashes', () => {
      const value = joinUrlPaths('/some', 'path/');
      expect(value).toBe('/some/path/');
    });

    it('should retain slashes in the middle of a given path', () => {
      const value = joinUrlPaths('some/path', 'another-path');
      expect(value).toBe('some/path/another-path');
    });

    it('should join an arbitrarily large number of paths', () => {
      const value = joinUrlPaths('some', 'path', 'another', 'path');
      expect(value).toBe('some/path/another/path');
    });

    it('should not alter the result if only one path is passed in', () => {
      const value1 = joinUrlPaths('some-path');
      const value2 = joinUrlPaths('/some-path/');
      expect(value1).toBe('some-path');
      expect(value2).toBe('/some-path/');
    });

    it('should allow easily ensuring a preceding or leading slash', () => {
      const value = joinUrlPaths('/', 'some-path', '/');
      expect(value).toBe('/some-path/');
    });

    it('should retain URL scheme, host, query string, and fragment identifier', () => {
      const value = joinUrlPaths('https://www.example.com/', 'some-path?arg=val#some-id');
      expect(value).toBe('https://www.example.com/some-path?arg=val#some-id');
    });

    it('should return an empty string if no path is passed in', () => {
      const value = joinUrlPaths();
      expect(value).toBe('');
    });
  });
});
