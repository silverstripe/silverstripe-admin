/* global jest, describe, beforeEach, it, expect */

jest.unmock('../FormBuilderLoader');

import { Component as FormBuilderLoader } from '../FormBuilderLoader';

describe('createIdentifier', () => {
  it('concatenates the identifier prop with the schema name prop', () => {
    FormBuilderLoader.propTypes = {};
    const form = new FormBuilderLoader();
    let props = {};
    expect(form.getIdentifier(props)).toBe('');
    props = { identifier: 'one' };
    expect(form.getIdentifier(props)).toBe('one');
    props = {
      identifier: 'one.two',
      schema: 'three',
    };
    expect(form.getIdentifier(props)).toBe('one.two');
    props = {
      identifier: 'one.two',
      schema: {
        schema: 'three',
      },
    };
    expect(form.getIdentifier(props)).toBe('one.two');
    props = {
      identifier: 'one.two',
      schema: {
        schema: {
          name: 'three',
        },
      },
    };
    expect(form.getIdentifier(props)).toBe('one.two.three');
    props = {
      identifier: null,
      schema: {
        schema: {
          name: 'three',
        },
      },
    };
    expect(form.getIdentifier(props)).toBe('three');
  });
});
