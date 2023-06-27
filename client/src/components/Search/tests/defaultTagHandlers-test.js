/* global jest, test, describe, it, expect, beforeEach */
import defaultTagHandlers from '../utilities/defaultTagHandlers';

const formSchema = {
  schema: {
    fields: [
      {
        name: 'SelectField',
        title: 'Select Field'
      }
    ]
  },
  state: {
    fields: [
      {
        name: 'SelectField',
        source: [
          { value: 1, title: 'one' },
          { value: 2, title: 'two' },
          { value: 3, title: 'three' },
        ]
      }
    ]
  }
};

test('defaultTagHandlers default none value', () => {
  const tag = defaultTagHandlers.default({ key: 'NoneValue' });
  expect(tag).toEqual(false);
});

test('defaultTagHandlers default some value', () => {
  const inputTag = { key: 'NoneValue', value: 1 };
  const tag = defaultTagHandlers.default(inputTag);
  expect(tag).toEqual(inputTag);
});

test('defaultTagHandlers hidden always false', () => {
  const inputTag = { key: 'NoneValue', value: 1 };
  const tag = defaultTagHandlers.Hidden(inputTag);
  expect(tag).toEqual(false);
});

test('defaultTagHandlers boolean uncheck', () => {
  const inputTag = { key: 'NoneValue', value: 0 };
  const tag = defaultTagHandlers.Boolean(inputTag);
  expect(tag).toEqual(false);
});

test('defaultTagHandlers boolean checked', () => {
  const inputTag = { key: 'NoneValue', value: 1 };
  const tag = defaultTagHandlers.Boolean(inputTag);
  expect(tag).toEqual({ key: 'NoneValue' });
});

test('defaultTagHandlers select singleSelect', () => {
  const inputTag = { key: 'SelectField', value: 1 };
  const tag = defaultTagHandlers.SingleSelect(
    inputTag,
    formSchema.schema.fields[0],
    formSchema
  );
  expect(tag).toEqual({ key: 'SelectField', value: 'one' });
});

test('defaultTagHandlers select multiSelect', () => {
  const inputTag = { key: 'SelectField', value: [1, 3] };
  const tag = defaultTagHandlers.MultiSelect(
    inputTag,
    formSchema.schema.fields[0],
    formSchema
  );
  expect(tag).toEqual({ key: 'SelectField', value: 'one, three' });
});

test('defaultTagHandlers Date and time date', () => {
  const inputTag = { key: 'DateField', value: '2018-08-21' };
  const tag = defaultTagHandlers.Date(inputTag, { lang: 'fr-ca' });
  expect(tag).toEqual({ key: 'DateField', value: '21 août 2018' });
});

test('defaultTagHandlers time', () => {
  const inputTag = { key: 'DateField', value: '2018-08-21 18:19:20' };
  const tag = defaultTagHandlers.Time(inputTag, { lang: 'en-nz' });
  expect(tag).toEqual({ key: 'DateField', value: '6:19 PM' });
});

test('defaultTagHandlers datetime', () => {
  const inputTag = { key: 'DateField', value: '2018-08-21 18:19:20' };
  const tag = defaultTagHandlers.Datetime(inputTag, { lang: 'fr-fr' });
  expect(tag).toEqual({ key: 'DateField', value: '21 août 2018 18:19' });
});
