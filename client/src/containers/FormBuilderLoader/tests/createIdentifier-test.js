/* global jest, describe, beforeEach, it, expect */

jest.unmock('../createIdentifier');

import createIdentifier from '../createIdentifier';

describe('createIdentifier', () => {
  it('concatenates the identifier prop with the schema name prop', () => {
    let props = {};
    expect(createIdentifier(props)).toBe('');
    props = { identifier: 'one' };
    expect(createIdentifier(props)).toBe('one');
    props = {
      identifier: 'one.two',
      schema: 'three',
    };
    expect(createIdentifier(props)).toBe('one.two');
    props = {
      identifier: 'one.two',
      schema: {
        schema: 'three',
      },
    };
    expect(createIdentifier(props)).toBe('one.two');
    props = {
      identifier: 'one.two',
      schema: {
        schema: {
          name: 'three',
        },
      },
    };
    expect(createIdentifier(props)).toBe('one.two.three');
  });
});
