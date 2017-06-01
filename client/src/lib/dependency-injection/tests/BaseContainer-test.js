/* global jest, jasmine, describe, beforeEach, it, pit, expect, process */

import buildBaseContainer from '../buildBaseContainer';

describe('BaseContainer', () => {
  let container = null;

  beforeEach(() => {
    container = buildBaseContainer();
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
