/* global jest, jasmine, describe, beforeEach, it, pit, expect, process */

import buildInjectorContainer from '../buildInjectorContainer';

describe('InjectorContainer', () => {
  let container = null;
  let service = null;

  beforeEach(() => {
    container = buildInjectorContainer();
    service = {
      load: jest.fn(),
      createTransformer: jest.fn((name) => `transform-${name}`),
      get: jest.fn(),
      register: jest.fn(),
    };
  });

  describe('ready()', () => {
    it('should throw exceptions when a function is not provided', () => {
      expect(() => container.ready('bob was here')).toThrow();
      expect(() => container.ready({ callback: () => 'contained callback' })).toThrow();
      expect(() => container.ready(() => 'this is a callback')).not.toThrow();
    });

    it('should hold the function when not initialised', () => {
      const callback = jest.fn(() => 'hello');
      container.ready(callback);

      expect(callback).not.toBeCalled();
    });

    it('should trigger all callbacks registered when load completes', () => {
      const callback = jest.fn(() => 'hello');
      container.ready(callback);

      expect(callback).not.toBeCalled();

      container.load();
      expect(callback).toBeCalled();
    });

    it('should trigger a callback immediately if load has already happened', () => {
      const callback = jest.fn(() => 'hello');

      container.load();
      expect(callback).not.toBeCalled();

      container.ready(callback);
      expect(callback).toBeCalled();
    });
  });

  describe('register()', () => {
    it('should error if called after initialising', () => {
      container.initialised = true;
      expect(() => container.register('test', service)).toThrow();
    });

    it('should apply the service to the global container for direct access as well', () => {
      container.register('test', service);

      expect(container.services.test).toBe(service);
      expect(container.test).toBe(service);
    });

    it('should error if key already exists', () => {
      expect(() => container.register('test', service)).not.toThrow();

      expect(() => container.register('test', service)).toThrow();
    });

    it('should not error if key already exists but force flag is on', () => {
      expect(() => container.register('test', service)).not.toThrow();

      expect(() => container.register('test', service, { force: true })).not.toThrow();
      expect(container.services.test).toBe(service);
      expect(container.test).toBe(service);
    });

    it('should error if registering with a reserved keyword', () => {
      expect(() => container.register('load', service)).toThrow();
    });

    it('should error if registering a service which is missing a required method', () => {
      delete service.createTransformer;

      expect(() => container.register('test', service)).toThrow();
    });
  });

  describe('load()', () => {
    it('should error if called after initialising', () => {
      container.initialised = true;
      expect(() => container.load()).toThrow();
    });

    it('should call load() on each service registered', () => {
      container.services = {
        test1: { load: jest.fn() },
        testanother: { load: jest.fn() },
      };

      container.load();

      expect(container.services.test1.load).toBeCalled();
      expect(container.services.testanother.load).toBeCalled();
      expect(container.initialised).toBe(true);
    });
  });

  describe('transform', () => {
    it('should error if called after initialising', () => {
      container.initialised = true;
      expect(() => container.transform('test', () => null)).toThrow();
    });

    it('should call the callback providing each registered service update method', () => {
      container.services = {
        test1: { createTransformer: jest.fn((name) => `test1-${name}`) },
        testanother: { createTransformer: jest.fn((name) => `testanother-${name}`) },
      };
      const callback = jest.fn((update) => {
        expect(container.services.test1.createTransformer).toBeCalled();
        expect(container.services.testanother.createTransformer).toBeCalled();

        expect(update.test1).toBe('test1-testing');
        expect(update.testanother).toBe('testanother-testing');
      });

      container.transform('testing', callback);

      expect(callback).toBeCalled();
    });
  });
});
