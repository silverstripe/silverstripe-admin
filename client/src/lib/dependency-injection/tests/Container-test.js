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
    const container = require('../Container').default;

    expect(container.react).toBe('registered react');
  });

  it('should be a singleton', () => {
    const container1 = require('../Container').default;
    const container2 = require('../Container').default;

    expect(container2.bob).toBe(undefined);

    container1.register('bob');

    expect(container2.bob).toBe('registered bob');
  });
});
