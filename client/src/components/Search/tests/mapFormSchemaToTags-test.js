/* global jest, test, describe, it, expect, beforeEach */
import mapFormSchemaToTags from '../utilities/mapFormSchemaToTags';

const formSchema = {
  schema: {
    fields: [
      {
        name: 'GenericFieldName',
        title: 'Generic Field Title',
        schemaType: 'Generic'
      },
      {
        name: 'FalseField',
        title: 'False Field Title',
        schemaType: 'Hidden'
      },
      {
        name: 'ValuelessField',
        title: 'Valueless Field Title',
        schemaType: 'Boolean'
      },
      {
        name: 'StructuralField',
        title: 'Structural Field Title',
        schemaType: 'Structural',
        children: [
          {
            name: 'SubGenericFieldName',
            title: 'Sub Generic Field Title',
            schemaType: 'Generic'
          }
        ]
      },
    ]
  },
  metadata: { loading: false }
};

const formData = {
  GenericFieldName: 'GenericValue',
  FormDataWithoutMatchingField: 'This should not show in tag list',
  FalseField: 'Field that is hidden and will not be showed in the tags',
  ValuelessField: '1',
  SubGenericFieldName: 'SubGenericFieldValue'
};

const expectedTags = {
  GenericFieldName: {
    key: 'GenericFieldName',
    label: 'Generic Field Title',
    value: 'GenericValue',
  },
  ValuelessField: {
    key: 'ValuelessField',
    label: 'Valueless Field Title'
  },
  StructuralField: {
    focusSelector: '[name=SubGenericFieldName]',
    key: 'StructuralField',
    label: 'Structural Field Title',
    value: 'sub generic field title SubGenericFieldValue',
    linkedFields: ['SubGenericFieldName']
  }
};

test('mapFormSchemaToTags mapping regular mapping', () => {
  const tags = mapFormSchemaToTags(formSchema, formData);

  expect(Object.keys(tags)).toHaveLength(3);
  expect(tags).toEqual(expectedTags);
});

test('mapFormSchemaToTags mapping custom tag handler', () => {
  const mockTagHandler = jest.fn();
  mockTagHandler.mockReturnValue({ key: 'GenericFieldName' });
  const tagHandlerOverrides = {
    '#GenericFieldName': mockTagHandler
  };

  const tags = mapFormSchemaToTags(formSchema, formData, tagHandlerOverrides);

  expect(Object.keys(tags)).toHaveLength(3);
  expect(tags).toEqual(
    Object.assign({}, expectedTags, { GenericFieldName: { key: 'GenericFieldName' } })
  );
  expect(mockTagHandler.mock.calls).toHaveLength(1);
  expect(mockTagHandler.mock.calls[0][0]).toEqual(expectedTags.GenericFieldName);
  expect(mockTagHandler.mock.calls[0][1]).toEqual(formSchema.schema.fields[0]);
  expect(mockTagHandler.mock.calls[0][2]).toEqual(formSchema);
  expect(mockTagHandler.mock.calls[0][3]).toEqual(formData);
});

test('mapFormSchemaToTags mapping loading', () => {
  const tags = mapFormSchemaToTags(
    Object.assign({}, formSchema, { metadata: { loading: true } }, formData)
  );
  expect(Object.keys(tags)).toHaveLength(0);
});
