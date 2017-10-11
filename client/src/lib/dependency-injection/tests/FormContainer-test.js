/* global jest, jasmine, describe, beforeEach, it, pit, expect, process */
import
  buildFormContainer,
  { SCHEMA_MIDDLEWARE_SERVICE, VALIDATION_MIDDLEWARE_SERVICE }
  from '../buildFormContainer';

describe('FormContainer', () => {
  let registry = null;

  beforeEach(() => {
    registry = buildFormContainer();
  });

  describe('registration and services', () => {
    it('should throw on registration', () => {
      expect(() => registry.register('NewService')).toThrow();
      expect(() => registry.registerMany({ NewService: 'test' })).toThrow();
    });
    it('should initialise with two services', () => {
      registry.load();
      expect(Object.keys(registry.services).length).toBe(2);
      expect(typeof registry.get(SCHEMA_MIDDLEWARE_SERVICE)).toBe('function');
      expect(typeof registry.get(VALIDATION_MIDDLEWARE_SERVICE)).toBe('function');
    });
  });

  describe('createTransformer()', () => {
    it('offers two transform methods', () => {
      const transformer = registry.createTransformer('test', { });
      expect(typeof transformer.alterSchema).toBe('function');
      expect(typeof transformer.addValidation).toBe('function');
    });
  });

  describe('reducers', () => {
    it('Creates a schema reducer', () => {
      const reducer = registry.getSchemaReducer([
        (manager) => ({ ...manager.getState(), foo: 'bar' }),
        (manager) => ({ ...manager.getState(), qux: 'baz' }),
        (manager) => ({ ...manager.getState(), testPasses: true }),
      ]);
      const result = reducer({ uncle: 'cheese', testPasses: false }, {});
      expect(result.foo).toBe('bar');
      expect(result.qux).toBe('baz');
      expect(result.testPasses).toBe(true);
      expect(result.uncle).toBe('cheese');
    });

    it('Creates a validation reducer', () => {
      const reducer = registry.getValidationReducer([
        (values, errors) => ({ ...errors, field1: 'error one' }),
        (values, errors) => ({ ...errors, field2: 'error two' }),
        (values, errors) => ({ ...errors, field3: null }),
      ]);
      const result = reducer({}, { uncle: 'cheese', field3: 'error three' });
      expect(result.field1).toBe('error one');
      expect(result.field2).toBe('error two');
      expect(result.field3).toBe(null);
      expect(result.uncle).toBe('cheese');
    });
  });

  describe('getFactory()', () => {
    it('throws on an invalid service', () => {
      expect(() => registry.getFactory('dummy', [])).toThrow();
    });
    it('creates factories for two different reducers', () => {
      const factory1 = () => 'one';
      const factory2 = () => 'two';
      const middlewareMatches = [
        { factory: factory1 },
        { factory: factory2 },
      ];
      registry.getValidationReducer = jest.fn();
      registry.getSchemaReducer = jest.fn();
      registry.getFactory(VALIDATION_MIDDLEWARE_SERVICE, middlewareMatches);
      registry.getFactory(SCHEMA_MIDDLEWARE_SERVICE, middlewareMatches);
      expect(registry.getValidationReducer).toBeCalledWith([factory1, factory2]);
      expect(registry.getSchemaReducer).toBeCalledWith([factory1, factory2]);
    });
  });
});
