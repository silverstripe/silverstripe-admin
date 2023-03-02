/* global jest, describe, it, expect, beforeEach */
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

describe('defaultTagHandlers', () => {
  describe('default', () => {
    it('none value', () => {
      const tag = defaultTagHandlers.default({ key: 'NoneValue' });
      expect(tag).toEqual(false);
    });

    it('some value', () => {
      const inputTag = { key: 'NoneValue', value: 1 };
      const tag = defaultTagHandlers.default(inputTag);
      expect(tag).toEqual(inputTag);
    });
  });

  describe('hidden', () => {
    it('always false', () => {
      const inputTag = { key: 'NoneValue', value: 1 };
      const tag = defaultTagHandlers.Hidden(inputTag);
      expect(tag).toEqual(false);
    });
  });

  describe('boolean', () => {
    it('uncheck', () => {
      const inputTag = { key: 'NoneValue', value: 0 };
      const tag = defaultTagHandlers.Boolean(inputTag);
      expect(tag).toEqual(false);
    });

    it('checked', () => {
      const inputTag = { key: 'NoneValue', value: 1 };
      const tag = defaultTagHandlers.Boolean(inputTag);
      expect(tag).toEqual({ key: 'NoneValue' });
    });
  });

  describe('select', () => {
    it('singleSelect', () => {
      const inputTag = { key: 'SelectField', value: 1 };
      const tag = defaultTagHandlers.SingleSelect(
        inputTag,
        formSchema.schema.fields[0],
        formSchema
      );
      expect(tag).toEqual({ key: 'SelectField', value: 'one' });
    });
    it('multiSelect', () => {
      const inputTag = { key: 'SelectField', value: [1, 3] };
      const tag = defaultTagHandlers.MultiSelect(
        inputTag,
        formSchema.schema.fields[0],
        formSchema
      );
      expect(tag).toEqual({ key: 'SelectField', value: 'one, three' });
    });
  });

  describe('Date and time', () => {
    it('date', () => {
      const inputTag = { key: 'DateField', value: '2018-08-21' };
      const tag = defaultTagHandlers.Date(inputTag, { lang: 'fr-ca' });
      expect(tag).toEqual({ key: 'DateField', value: '21 août 2018' });
    });

    it('time', () => {
      const inputTag = { key: 'DateField', value: '2018-08-21 18:19:20' };
      const tag = defaultTagHandlers.Time(inputTag, { lang: 'en-nz' });
      expect(tag).toEqual({ key: 'DateField', value: '6:19 PM' });
    });

    it('datetime', () => {
      const inputTag = { key: 'DateField', value: '2018-08-21 18:19:20' };
      const tag = defaultTagHandlers.Datetime(inputTag, { lang: 'fr-fr' });
      expect(tag).toEqual({ key: 'DateField', value: '21 août 2018 18:19' });
    });
  });
});
