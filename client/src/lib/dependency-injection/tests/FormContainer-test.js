/* global jest, describe, beforeEach, it, pit, expect, process */
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
        (values, Validation) => {
          Validation.addError('FirstName', 'error one');
        },
        (values, Validation) => {
          Validation.addError('FirstName', 'error two');
        },
        (values, Validation) => {
          Validation.addError('Surname', 'error three');
        },
      ]);
      const result = reducer({ FirstName: 'Uncle', Surname: 'Cheese' }, {});

      expect(result.FirstName).toEqual(['error one', 'error two']);
      expect(result.Surname).toEqual(['error three']);
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
