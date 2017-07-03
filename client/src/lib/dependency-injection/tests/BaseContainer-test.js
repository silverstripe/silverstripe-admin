/* global jest, jasmine, describe, beforeEach, it, pit, expect, process */

import buildBaseContainer from '../buildBaseContainer';

describe('BaseContainer', () => {
  let container = null;

  beforeEach(() => {
    container = buildBaseContainer();
  });

  describe('get()', () => {
    it('should error if called before initialising', () => {
      expect(() => container.get('test', 'context.layer')).toThrow();
    });

    it('should error if the factory can not be found', () => {
      container.factories.test = jest.fn();
      container.initialised = true;

      expect(() => container.get('notregistered', 'context.under')).toThrow();
      expect(container.factories.test).not.toBeCalled();
    });

    it('should call the proper factory with the provided context', () => {
      container.factories.test = jest.fn(() => 'component');
      container.initialised = true;

      const component = container.get('test', 'context.upper');

      expect(component).toBe('component');
      expect(container.factories.test).toBeCalledWith('context.upper');
    });
  });

  describe('customise()', () => {
    it('should error if called after initialising', () => {
      container.initialised = true;

      expect(() => container.customise({ name: 'meta' }, 'test', () => 'factory')).toThrow();
    });

    it('should create a new middlewareRegistry if it does not exist', () => {
      container.customise({ name: 'meta' }, 'test', () => 'factory');
      expect(container.middlewareRegistries.test).not.toBeUndefined();

      container.customise({ name: 'meta' }, 'test2.context.under', () => 'factory');
      expect(container.middlewareRegistries.test2).not.toBeUndefined();
    });

    it('should add the given data to the registry', () => {
      container.middlewareRegistries.test = {
        add: jest.fn(),
      };
      const meta = { name: 'meta' };
      const factory = () => 'factory';

      container.customise(meta, 'test.context.upper', factory);
      expect(container.middlewareRegistries.test.add).toBeCalledWith(
        meta,
        factory,
        ['context', 'upper']
      );
    });
  });

  describe('load()', () => {
    it('should error if called after already initialising', () => {
      container.initialised = true;
      expect(() => container.load()).toThrow();
    });

    it('should wrap the service in a callback if no middleware is found', () => {
      container.services.test = 'service';

      container.load();
      expect(container.initialised).toBe(true);
      expect(typeof container.factories.test).toBe('function');
      expect(container.factories.test()).toBe('service');
    });

    it('should load the middleware with a factory call', () => {
      container.middlewareRegistries.test = {
        sort: jest.fn(() => container.middlewareRegistries.test),
        getMatchesForContext: jest.fn(() => ['match']),
      };
      container.getFactory = jest.fn(() => null);
      container.services.test = 'service';

      container.load();
      expect(container.initialised).toBe(true);
      expect(container.middlewareRegistries.test.sort).toBeCalled();

      container.factories.test('mycontext.here');
      expect(container.middlewareRegistries.test.getMatchesForContext)
        .toBeCalledWith('mycontext.here');
      expect(container.getFactory).toBeCalledWith('test', ['match']);
    });

    it('should compose factories', () => {
      const TestService = (num) => `Answer is ${num}`;
      container.register('TestService', TestService);
      container.middlewareRegistries.TestService = {
        sort: () => {},
        getMatchesForContext: () => ([
          { factory: (next) => (num) => next(1 + num) },
          { factory: (next) => (num) => next(2 + num) },
        ]),
      };
      container.load();
      const service = container.get('TestService');
      expect(service(2)).toBe('Answer is 5');
    });
  });

  describe('registerMany()', () => {
    it('should error if called after already initialising', () => {
      container.initialised = true;
      expect(() => container.registerMany({ test: 'service' })).toThrow();
    });

    it('should register new services', () => {
      const newServices = { test1: 'service', test2: 'service another' };

      expect(() => container.registerMany(newServices)).not.toThrow();

      expect(container.services.test2).toBe('service another');
      expect(container.services.test1).toBe('service');
    });

    it('should error if any new services are already existing none are registered', () => {
      container.services = { test2: 'service2' };

      const newServices = { test1: 'service', test2: 'service another' };

      expect(() => container.registerMany(newServices)).toThrow();

      expect(container.services.test1).not.toBe('service');
      expect(container.services.test2).toBe('service2');
    });

    it('should not error if new services are already existing but force flag is on', () => {
      container.services = { test2: 'service2' };

      const newServices = { test1: 'service', test2: 'service another' };

      expect(() => container.registerMany(newServices, { force: true })).not.toThrow();

      expect(container.services.test2).toBe('service another');
      expect(container.services.test1).toBe('service');
    });
  });

  describe('register()', () => {
    it('should throw if the injector is accessed before it is loaded', () => {
      const TestService = () => 'test service';

      container.register('TestService', TestService);
      expect(() => container.get('TestService')).toThrow();

      container.load();
      expect(typeof container.get('TestService')).toBe('function');
      expect(container.get('TestService')()).toBe('test service');
    });

    it('should throw if you register the same service twice unless you force', () => {
      const TestService = () => 'test service';
      const NewService = () => 'new service';

      container.register('TestService', TestService);
      expect(() => container.register('TestService', NewService)).toThrow();

      container.register('TestService', NewService, { force: true });
      container.load();
      expect(typeof container.get('TestService')).toBe('function');
      expect(container.get('TestService')()).toBe('new service');
    });

    it('should throw if you try to mutate the DI container after load', () => {
      const TestService = () => 'test service';

      container.register('TestService', TestService);
      container.load();
      expect(() => container.register('Foo', () => {})).toThrow();
    });
  });

  describe('transform()', () => {
    it('should throw if you try to transform the DI container after load', () => {
      const TestService = () => 'test service';
      container.register('TestService', TestService);
      container.load();
      expect(() => container.transform('test', () => {})).toThrow();
    });

    it('should override components but can return the original modified', () => {
      const TestComponent = jest.fn();
      TestComponent.mockReturnValue('original');
      container.register('TestComponent', TestComponent);
      const HOC = (original) => {
        expect(original).toBe(TestComponent);
        return `modified ${original()}`;
      };

      container.transform('test', update => update('TestComponent', HOC));
      container.load();

      const Service = container.get('TestComponent');
      expect(Service).toBe('modified original');
      expect(TestComponent).toBeCalled();
    });

    it('should override components completely', () => {
      const TestComponent = jest.fn();
      TestComponent.mockReturnValue('original');
      container.register('TestComponent', TestComponent);
      const HOC = jest.fn();
      HOC.mockReturnValue('HOC');

      container.transform('test', update => update('TestComponent', HOC));
      container.load();

      const Service = container.get('TestComponent');
      expect(HOC).toBeCalledWith(TestComponent);
      expect(Service).toBe('HOC');
      expect(TestComponent).not.toBeCalled();
    });
  });
});
