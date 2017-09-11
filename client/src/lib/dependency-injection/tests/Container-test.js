/* global jest, jasmine, describe, beforeEach, it, pit, expect, process */

jest.mock('../buildInjectorContainer',
  () => () => ({
    register(arg) {
      this[arg] = `registered ${arg}`;
    },
  })
);
jest.mock('../buildBaseContainer', () => () => 'base');
jest.mock('../buildComponentContainer', () => () => 'component');
jest.mock('../buildReducerContainer', () => () => 'reducer');

describe('Container', () => {
  it('should load with react service by default', () => {
    // eslint-disable-next-line global-require
    const container = require('../Container').default;

    expect(container.component).toBe('registered component');
  });

  it('should be a singleton', () => {
    // eslint-disable-next-line global-require
    const container1 = require('../Container').default;
    // eslint-disable-next-line global-require
    const container2 = require('../Container').default;

    expect(container2.bob).toBe(undefined);

    container1.register('bob');

    expect(container2.bob).toBe('registered bob');
  });
});
