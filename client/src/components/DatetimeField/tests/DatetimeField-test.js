/* global jest, describe, beforeEach, it, expect, modernizr */

jest.mock('modernizr', () => ({
  inputtypes: {
    'datetime-local': false,
  },
}));

import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';
import { Component as DatetimeField } from '../DatetimeField';

describe('DatetimeField without html5 date time field support', () => {
  let datetimeField = null;
  let inputField = null;
  let props = null;

  beforeEach(() => {
    props = {
      id: 'datetime',
      title: '',
      name: '',
      value: '',
      data: {
        html5: false,
      },
      modernizr: {
        inputtypes: {
          'datetime-local': false,
        },
      },
      onChange: jest.fn(),
    };
  });

  describe('onChange()', () => {
    beforeEach(() => {
      datetimeField = ReactTestUtils.renderIntoDocument(
        <DatetimeField {...props} />
      );
      inputField = ReactTestUtils.findRenderedDOMComponentWithTag(datetimeField, 'input');
    });

    it('should call the onChange function on props', () => {
      ReactTestUtils.Simulate.change(inputField);
      expect(datetimeField.props.onChange).toBeCalled();
    });
  });

  describe('convertToIso()', () => {
    beforeEach(() => {
      props = {
        ...props,
        lang: 'en_NZ',
      };

      datetimeField = ReactTestUtils.renderIntoDocument(
        <DatetimeField {...props} />
      );
    });

    it('should covert local date to iso date time format', () => {
      expect(datetimeField.convertToIso('23/04/2017 1:22 PM')).toBe('2017-04-23T13:22:00');
      expect(datetimeField.convertToIso('23/04/2017')).toBe('2017-04-23T00:00:00');
    });

    it('should accept iso date time as an argument', () => {
      expect(datetimeField.convertToIso('2017-04-23T00:32:21')).toBe('2017-04-23T00:32:21');
    });

    it('should return "" the invalid date time is provided', () => {
      expect(datetimeField.convertToIso('2017-23-3T23:34:2321')).toBe('');
    });
  });

  describe('convertToLocalised()', () => {
    beforeEach(() => {
      props = {
        ...props,
        lang: 'en_NZ',
      };

      datetimeField = ReactTestUtils.renderIntoDocument(
        <DatetimeField {...props} />
      );
    });

    it('should covert invalid iso date time to ""', () => {
      expect(datetimeField.convertToLocalised('2017-13-12T31:23:23')).toBe('');
    });

    it('should covert iso date to local date format', () => {
      expect(datetimeField.convertToLocalised('2017-12-01T02:32:33')).toBe('01/12/2017 2:32 AM');
    });

    it('should covert iso date to a differnt local date format', () => {
      props.lang = 'en_US';
      datetimeField = ReactTestUtils.renderIntoDocument(
        <DatetimeField {...props} />
      );

      expect(datetimeField.convertToLocalised('2017-12-01T23:02:22')).toBe('12/01/2017 11:02 PM');
    });
  });

  describe('Browser doesn\'t support html5 date time input', () => {
    beforeEach(() => {
      props = {
        ...props,
        lang: 'en_NZ',
        value: '2017-01-05T02:23:22',
        data: {
          ...props.data,
          html5: true, // Note: support requested but denied
        },
        modernizr: {
          inputtypes: {
            'datetime-local': false,
          },
        },
      };

      datetimeField = ReactTestUtils.renderIntoDocument(
        <DatetimeField {...props} />
      );

      inputField = ReactTestUtils.findRenderedDOMComponentWithTag(datetimeField, 'input');
    });

    it('should know it doesn\'t support html5', () => {
      expect(datetimeField.props.data.html5).toBe(true);
      expect(datetimeField.hasNativeSupport()).toBe(false);
      expect(datetimeField.asHTML5()).toBe(false);
    });

    it('should use localised format of date value in the input field', () => {
      expect(inputField.type).toBe('text');
      expect(inputField.value).toBe('05/01/2017 2:23 AM');
    });

    it('should pass iso format instead of localised format', () => {
      const value = '05/02/2018 3:12 PM';
      const event = { target: { value } };
      datetimeField.handleChange(event);
      expect(datetimeField.props.onChange).toBeCalledWith(event, { id: 'datetime', value: '2018-02-05T15:12:00' });
    });

    it('should pass "" if the input value is not valid', () => {
      const value = 'invalid value';
      const event = { target: { value } };
      datetimeField.handleChange(event);
      expect(datetimeField.props.onChange).toBeCalledWith(event, { id: 'datetime', value: '' });
    });
  });

  describe('Browser supports html5 date input and field opts in', () => {
    beforeEach(() => {
      props = {
        ...props,
        lang: 'en_NZ',
        value: '2017-01-05T02:23:22',
        data: {
          ...props.data,
          html5: true,
        },
        modernizr: {
          inputtypes: {
            'datetime-local': true,
          },
        },
      };

      datetimeField = ReactTestUtils.renderIntoDocument(
        <DatetimeField {...props} />
      );

      inputField = ReactTestUtils.findRenderedDOMComponentWithTag(datetimeField, 'input');
    });

    it('should know it supports html5', () => {
      expect(datetimeField.props.data.html5).toBe(true);
      expect(datetimeField.hasNativeSupport()).toBe(true);
      expect(datetimeField.asHTML5()).toBe(true);
    });

    it('should use iso format of date value in the input field', () => {
      expect(inputField.type).toBe('datetime-local');
      expect(inputField.value).toBe('2017-01-05T02:23');
    });

    it('should pass iso format as entered in the input field', () => {
      const value = '2018-02-05T03:34:33';
      const event = { target: { value } };
      datetimeField.handleChange(event);
      expect(datetimeField.props.onChange).toBeCalledWith(event, { id: 'datetime', value: '2018-02-05T03:34:33' });
    });
  });

  describe('Browser supports html5 date time input but user has opt-outed', () => {
    beforeEach(() => {
      props = {
        ...props,
        lang: 'en_NZ',
        value: '2017-01-05T02:23:22',
        data: {
          ...props.data,
          html5: false,
        },
        modernizr: {
          inputtypes: {
            'datetime-local': true,
          },
        },
      };
      datetimeField = ReactTestUtils.renderIntoDocument(
        <DatetimeField {...props} />
      );

      inputField = ReactTestUtils.findRenderedDOMComponentWithTag(datetimeField, 'input');
    });

    it('should use localised format of date value in the input field', () => {
      expect(inputField.type).toBe('text');
      expect(inputField.value).toBe('05/01/2017 2:23 AM');
    });

    it('should suppress HTML input even if supported', () => {
      expect(datetimeField.props.data.html5).toBe(false);
      expect(datetimeField.hasNativeSupport()).toBe(true);
      expect(datetimeField.asHTML5()).toBe(false);
    });
  });
});
