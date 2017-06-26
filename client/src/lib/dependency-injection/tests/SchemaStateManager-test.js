/* global jest, jasmine, describe, beforeEach, it, pit, expect, process */
import SchemaStateManager from '../SchemaStateManager';

describe('SchemaStateManager', () => {
  let manager = null;
  let state = null;

  beforeEach(() => {
    state = {
      fields: [
        {
          id: 'field-1',
          name: 'Field One',
        },
        {
          id: 'field-2',
          name: 'Field Two',
        },
      ],
    };
    manager = new SchemaStateManager(state);
  });
  it('Constructs', () => {
    expect(manager.getState()).not.toBe(state);
    expect(manager.getState().fields.length).toBe(2);
  });

  it('Gets fields', () => {
    expect(manager.getFieldByName('Field One')).toBeTruthy();
    expect(manager.getFieldByName('Field One').id).toBe('field-1');
    expect(manager.getFieldByName('fail')).toBeFalsy();
  });

  it('Mutates fields by callback', () => {
    manager.mutateField('Field One', (field) => ({
      ...field,
      newField: 'test',
    }));
    expect(manager.getState().fields[0].newField).toBe('test');
    expect(manager.getFieldByName('Field One').newField).toBe('test');
    const prev = manager.getState();
    manager.mutateField('fail', (field) => ({
      ...field,
      test: 'test',
    }));
    expect(manager.getState()).toBe(prev);
  });

  it('Mutates fields by merging', () => {
    manager.updateField('Field Two', {
      testField: 'foo',
    });
    expect(manager.getState().fields[1].testField).toBe('foo');
    expect(manager.getFieldByName('Field Two').testField).toBe('foo');
  });

  it('Updates multiple fields', () => {
    manager.updateFields({
      'Field One': {
        a: 'first',
      },
      'Field Two': {
        b: 'second',
      },
      Fail: {
        fail: 'boo',
      },
    });

    const newState = manager.getState();
    expect(newState.fields[0].a).toBe('first');
    expect(newState.fields[1].b).toBe('second');
    expect(manager.getFieldByName('Fail')).toBeFalsy();
  });

  it('Sets field components', () => {
    manager.setFieldComponent('Field One', 'TextField');
    expect(manager.getState().fields[0].component).toBeTruthy();
    expect(manager.getState().fields[0].component).toBe('TextField');
  });

  it('Sets field classes', () => {
    const newState = manager
      .addFieldClass('Field One', 'aaron')
      .addFieldClass('Field One', 'uncle')
      .removeFieldClass('Field One', 'aaron')
      .setFieldClass('Field One', 'cheese', true)
      .setFieldClass('Field One', 'carlino', false)
      .getState();

    expect(newState.fields[0].extraClass).toBe('uncle cheese');
  });
});
