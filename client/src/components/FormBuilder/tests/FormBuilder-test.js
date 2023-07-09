/* global jest, test, describe, expect, it, beforeEach */

import React from 'react';
import schemaFieldValues, { findField, schemaMerge } from 'lib/schemaFieldValues';

const apiMock = jest.fn();
apiMock.mockImplementation(() => Promise.resolve({}));

function makeProps(obj = {}) {
  return {
    api: apiMock,
    form: 'MyForm',
    baseFormComponent: () => <form />,
    baseFieldComponent: (props) => {
      // eslint-disable-next-line react/prop-types
      const Component = props.component;
      return <Component {...props} />;
    },
    schema: {
      id: 'MyForm',
      schema: {
        attributes: {},
        fields: [],
        actions: [],
      },
      state: {
        fields: [],
      },
    },
    ...obj
  };
}

function makeSchema() {
  return {
    schema: {
      schema: {
        attributes: {},
        fields: [
          { id: 'fieldOne', name: 'fieldOne' },
          { id: 'fieldTwo', name: 'fieldTwo' },
        ],
        actions: [
          { id: 'actionOne', name: 'actionOne' },
          { id: 'actionTwo', name: 'actionTwo' },
        ]
      },
      state: {
        fields: [
          { id: 'fieldOne', name: 'fieldOne', value: 'valOne' },
          { id: 'fieldTwo', name: 'fieldTwo', value: null },
          { id: 'notInSchema', name: 'notInSchema', value: 'invalid' },
        ]
      }
    }
  };
}
/* eslint-disable-next-line no-unused-vars */
function makePropsWithSchema(obj = {}) {
  return makeProps({
    ...makeSchema(),
    ...obj
  });
}

test('schemaMerge() should deep merge properties on the originalobject', () => {
  const fieldStructure = {
    component: 'TextField',
    data: {
      someCustomData: {
        x: 1,
      },
    },
  };

  const fieldState = {
    data: {
      someCustomData: {
        y: 2,
      },
    },
    message: { type: 'good' },
    valid: true,
    value: 'My test field',
  };

  const field = schemaMerge(fieldStructure, fieldState);

  expect(field.component).toBe('TextField');
  expect(field.data.someCustomData.x).toBe(1);
  expect(field.data.someCustomData.y).toBe(2);
  expect(field.message.type).toBe('good');
  expect(field.valid).toBe(true);
  expect(field.value).toBe('My test field');
});

test('schemaFieldValues() should retrieve field values based on schema', () => {
  const schema = {
    fields: [
      { id: 'fieldOne', name: 'fieldOne' },
      { id: 'fieldTwo', name: 'fieldTwo' },
    ],
  };
  const state = {
    fields: [
      { id: 'fieldOne', name: 'fieldOne', value: 'valOne' },
      { id: 'fieldTwo', name: 'fieldTwo', value: null },
      { id: 'notInSchema', name: 'notInSchema', value: 'invalid' },
    ]
  };
  const fieldValues = schemaFieldValues(schema, state);
  expect(fieldValues).toEqual({
    fieldOne: 'valOne',
    fieldTwo: null,
  });
});

test('findField() should retrieve the field in the shallow fields list', () => {
  const fields = [
    { id: 'fieldOne', name: 'fieldOne' },
    { id: 'fieldTwo', name: 'fieldTwo' },
    { id: 'fieldThree', name: 'fieldThree' },
    { id: 'fieldFour', name: 'fieldFour' },
  ];
  const field = findField(fields, 'fieldThree');
  expect(field).toBeTruthy();
  expect(field.name).toBe('fieldThree');
});
