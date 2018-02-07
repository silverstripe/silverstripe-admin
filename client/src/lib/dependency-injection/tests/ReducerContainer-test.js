/* global jest, jasmine, describe, beforeEach, it, pit, expect, process */

jest.mock('../MiddlewareRegistry', () => () => ({ add: jest.fn() }));
import buildReducerContainer from '../buildReducerContainer';

describe('ReducerContainer', () => {
  let container = null;
  let store = null;

  beforeEach(() => {
    container = buildReducerContainer({
      middlewareRegistries: {},
      services: {},
      factories: {},
      initialised: false,
      isProtected: jest.fn(),
    });
    store = {
      getState: jest.fn(() => ({ name: 'global state' })),
    };
  });

  describe('customise()', () => {
    const meta = { name: 'testmeta' };

    beforeEach(() => {
      container.setStore(store);
    });

    it('should create a new middlewareRegistry if one is not found', () => {
      const factory = () => 'factory';

      expect(container.middlewareRegistries.newRegistry).toBeUndefined();

      container.customise(meta, 'newRegistry', factory);

      expect(container.middlewareRegistries.newRegistry).not.toBeUndefined();
    });

    it('should enhance the factory with the global state', () => {
      let checkMeta = null;
      let enhancedFactory = null;

      container.middlewareRegistries.test = {
        add: (newMeta, newFactory) => {
          checkMeta = newMeta;
          enhancedFactory = newFactory;
        },
      };

      const factory = jest.fn((service) => {
        expect(service.name).toBe('service');

        return (getGlobalState) => {
          expect(typeof getGlobalState).toBe('function');
          expect(getGlobalState().name).toBe('global state');
        };
      });

      container.customise(meta, 'test', factory);

      expect(checkMeta).toBe(meta);
      expect(enhancedFactory).not.toBe(factory);

      enhancedFactory({ name: 'service' });
      expect(factory).toBeCalled();
    });
  });

  describe('getAll()', () => {
    beforeEach(() => {
      container.services = {
        service1: 'service1',
        service2: 'service2',
      };
      container.factories = {
        factory1: jest.fn(() => 'factory1'),
        factory2: jest.fn(() => 'factory2'),
      };
    });

    it('should return a list of services if not initialised', () => {
      expect(container.initialised).toBe(false);

      const list = container.getAll();

      expect(list.service1).toBe('service1');
      expect(list.service2).toBe('service2');
      expect(list.factory1).toBeUndefined();
    });

    it('should return a list of services if not initialised', () => {
      container.initialised = true;

      const list = container.getAll();

      expect(list.factory1).toBe('factory1');
      expect(list.factory2).toBe('factory2');
      expect(list.service1).toBeUndefined();
    });
  });
});
