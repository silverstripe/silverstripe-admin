/* global jest, jasmine, describe, beforeEach, it, pit, expect, process */

jest.mock('redux-form', () => ({
  isDirty: (name, getFormState) => (state) => getFormState(state)[name].dirty,
  isPristine: (name, getFormState) => (state) => !getFormState(state)[name].dirty,
  getFormValues: (name, getFormState) => (state) => getFormState(state)[name].values,
  isValid: (name, getFormState) => (state) => getFormState(state)[name].valid,
  isInvalid: (name, getFormState) => (state) => !getFormState(state)[name].valid,
}));

import FormStateManager from '../FormStateManager';

describe('FormStateManager', () => {
  let manager = null;
  let schema = null;
  let reduxFormState = null;
  beforeEach(() => {
    schema = {
      name: 'TestForm',
      state: {
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
      },
    };

    reduxFormState = {
      values: {
        test: 'yes',
        uncle: 'cheese',
      },
      dirty: true,
      valid: true,
    };

    manager = new FormStateManager(schema, reduxFormState);
  });
  it('Constructs', () => {
    expect(manager.getState()).not.toBe(schema);
    expect(manager.getState().state.fields.length).toBe(2);
    expect(manager.mockGlobalState).toEqual({
      TestForm: reduxFormState,
    });
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
    expect(manager.getState().state.fields[0].newField).toBe('test');
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
    expect(manager.getState().state.fields[1].testField).toBe('foo');
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

    const newState = manager.getState().state;
    expect(newState.fields[0].a).toBe('first');
    expect(newState.fields[1].b).toBe('second');
    expect(manager.getFieldByName('Fail')).toBeFalsy();
  });

  it('Sets field components', () => {
    manager.setFieldComponent('Field One', 'TextField');
    expect(manager.getState().state.fields[0].component).toBeTruthy();
    expect(manager.getState().state.fields[0].component).toBe('TextField');
  });

  it('Sets field classes', () => {
    const newState = manager
      .addFieldClass('Field One', 'aaron')
      .addFieldClass('Field One', 'uncle')
      .removeFieldClass('Field One', 'aaron')
      .setFieldClass('Field One', 'cheese', true)
      .setFieldClass('Field One', 'carlino', false)
      .getState();

    expect(newState.state.fields[0].extraClass).toBe('uncle cheese');
  });

  it('Uses redux-form selectors', () => {
    expect(manager.getValues()).toEqual({
      test: 'yes',
      uncle: 'cheese',
    });
    expect(manager.getValue('uncle')).toBe('cheese');
    expect(manager.getValue('nothing')).toBeUndefined();
    expect(manager.isDirty()).toBe(true);
    expect(manager.isPristine()).toBe(false);
    expect(manager.isValid()).toBe(true);
    expect(manager.isInvalid()).toBe(false);
  });
});
