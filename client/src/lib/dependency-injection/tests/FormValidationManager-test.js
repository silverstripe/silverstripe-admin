/* global jest, describe, beforeEach, it, pit, expect, process */

import FormValidationManager from '../FormValidationManager';

describe('FormValidationManager', () => {
  let manager = null;
  let values = null;
  beforeEach(() => {
    values = {
      Country: 'Bolivia',
      CapitalCity: 'Sucre',
      Population: '11M',
    };

    manager = new FormValidationManager(values);
  });
  it('Constructs', () => {
    expect(manager.getState()).not.toBe(values);
    expect(manager.getState()).toEqual({});
  });

  it('Adds errors', () => {
    manager.addError('CapitalCity', 'foo');
    expect(Array.isArray(manager.getState().CapitalCity)).toBe(true);
    expect(manager.getState().CapitalCity.length).toBe(1);
    expect(manager.getState().CapitalCity[0]).toBe('foo');
    manager.addErrors({
      Population: ['qux', 'baz'],
      CapitalCity: 'bar',
    });
    expect(Array.isArray(manager.getState().Population)).toBe(true);
    expect(manager.getState().Population.length).toBe(2);
    expect(manager.getState().Population).toEqual(['qux', 'baz']);
    expect(manager.getState().CapitalCity).toEqual(['foo', 'bar']);
    expect(() => manager.addError({
      uncle: 'cheese'
    })).toThrow();
  });

  it('Clears errors', () => {
    manager.addError('CapitalCity', 'La Paz');
    expect(manager.getState().CapitalCity[0]).toBe('La Paz');
    manager.clearErrors('CapitalCity');
    expect(manager.getState().CapitalCity).toBeUndefined();
  });

  it('Says if it has errors', () => {
    manager.addError('Population', 'Too many people');
    expect(manager.hasError('Population')).toBe(true);
    expect(manager.hasError('CapitalCity')).toBe(false);
    manager.clearErrors('Population');
    expect(manager.hasError('Population')).toBe(false);
  });

  it('Can tell if a field exists', () => {
    expect(manager.fieldExists('Country')).toBe(true);
    expect(manager.fieldExists('Sandwich')).toBe(false);
  });

  it('Gets errors', () => {
    manager.addError('Population', 'test');
    expect(manager.getErrors('Population')).toEqual(['test']);
    expect(manager.getErrors('Country')).toEqual([]);
    expect(() => manager.getErrors('Dummy')).toThrow();
  });

  it('Resets', () => {
    manager.addError('Population', 'error1');
    manager.addError('Country', 'error2');
    expect(manager.getState().Population).toBeTruthy();
    expect(manager.getState().Country).toBeTruthy();
    manager.reset();
    expect(manager.getState().Population).toBeUndefined();
    expect(manager.getState().Country).toBeUndefined();
  });
});
