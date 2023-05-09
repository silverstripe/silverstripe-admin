/* global jest, test, describe, beforeEach, it, expect */

import { createFormIdentifierFromProps } from '../FormBuilderLoader';

test('createFormIdentifierFromProps concatenates the identifier prop with the schema name prop', () => {
  let props = {};
  expect(createFormIdentifierFromProps(props)).toBe('');
  props = { identifier: 'one' };
  expect(createFormIdentifierFromProps(props)).toBe('one');
  props = {
    identifier: 'one.two',
    schema: 'three',
  };
  expect(createFormIdentifierFromProps(props)).toBe('one.two');
  props = {
    identifier: 'one.two',
    schema: {
      schema: 'three',
    },
  };
  expect(createFormIdentifierFromProps(props)).toBe('one.two');
  props = {
    identifier: 'one.two',
    schema: {
      schema: {
        name: 'three',
      },
    },
  };
  expect(createFormIdentifierFromProps(props)).toBe('one.two.three');
  props = {
    identifier: null,
    schema: {
      schema: {
        name: 'three',
      },
    },
  };
  expect(createFormIdentifierFromProps(props)).toBe('three');
});
