/* global jest, describe, beforeEach, it, expect, modernizr */

jest.unmock('react');
jest.unmock('react-addons-test-utils');
jest.unmock('../TimeField');

jest.mock('modernizr', () => ({
  inputtypes: {
    time: false,
  },
}));

import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';
import { Component as TimeField } from '../TimeField';

describe('TimeField without html5 time field support', () => {
  let timeField = null;
  let inputField = null;
  let props = null;

  beforeEach(() => {
    props = {
      id: 'time',
      title: '',
      name: '',
      value: '',
      data: {
        html5: false,
      },
      modernizr: {
        inputtypes: {
          time: false,
        },
      },
      onChange: jest.genMockFunction(),
    };
  });

  describe('onChange()', () => {
    beforeEach(() => {
      timeField = ReactTestUtils.renderIntoDocument(
        <TimeField {...props} />
      );
      inputField = ReactTestUtils.findRenderedDOMComponentWithTag(timeField, 'input');
    });

    it('should call the onChange function on props', () => {
      ReactTestUtils.Simulate.change(inputField);
      expect(timeField.props.onChange).toBeCalled();
    });
  });

  describe('convertToIso()', () => {
    beforeEach(() => {
      timeField = ReactTestUtils.renderIntoDocument(
        <TimeField {...props} />
      );
    });

    it('should covert local time to iso time format', () => {
      expect(timeField.convertToIso('03:24 AM')).toBe('03:24:00');
      expect(timeField.convertToIso('03:24 PM')).toBe('15:24:00');
    });

    it('should accept iso time as an argument', () => {
      expect(timeField.convertToIso('03:24')).toBe('03:24:00');
      expect(timeField.convertToIso('15:24')).toBe('15:24:00');
    });

    it('should return "" the invalid time is provided', () => {
      expect(timeField.convertToIso('invalid time')).toBe('');
    });
  });

  describe('convertToLocalised()', () => {
    beforeEach(() => {
      timeField = ReactTestUtils.renderIntoDocument(
        <TimeField {...props} />
      );
    });

    it('should covert invalid iso time to ""', () => {
      expect(timeField.convertToLocalised('invalid time')).toBe('');
    });

    it('should covert iso time to local time format', () => {
      expect(timeField.convertToLocalised('13:23:45')).toBe('1:23 PM');
    });
  });

  describe('getLocalisedValue()', () => {
    beforeEach(() => {
      props = {
        ...props,
        value: '04:22:39'
      };
      timeField = ReactTestUtils.renderIntoDocument(
        <TimeField {...props} />
      );
    });

    it('should display local format when the browser doesn\'t support time type', () => {
      expect(timeField.getLocalisedValue()).toBe('4:22 AM');
    });
  });

  describe('Browser doesn\'t support html5 time input', () => {
    beforeEach(() => {
      props = {
        ...props,
        value: '23:01:23',
        data: {
          ...props.data,
          html5: true, // Note: support requested but denied
        },
        modernizr: {
          inputtypes: {
            time: false,
          },
        },
      };
      timeField = ReactTestUtils.renderIntoDocument(
        <TimeField {...props} />
      );

      inputField = ReactTestUtils.findRenderedDOMComponentWithTag(timeField, 'input');
    });

    it('should know it doesn\'t support html5', () => {
      expect(timeField.props.data.html5).toBe(true);
      expect(timeField.hasNativeSupport()).toBe(false);
      expect(timeField.asHTML5()).toBe(false);
    });

    it('should use localised form of time value in the input field', () => {
      expect(inputField.type).toBe('text');
      expect(inputField.value).toBe('11:01 PM');
    });

    it('should pass iso format instead of localised format', () => {
      const value = '12:22 AM';
      const event = { target: { value } };
      timeField.handleChange(event);
      expect(timeField.props.onChange).toBeCalledWith(event, { id: 'time', value: '00:22:00' });
    });

    it('should pass "" if the input value is not valid', () => {
      const value = 'invalid value';
      const event = { target: { value } };
      timeField.handleChange(event);
      expect(timeField.props.onChange).toBeCalledWith(event, { id: 'time', value: '' });
    });
  });

  describe('Browser supports html5 date input and field opts in', () => {
    beforeEach(() => {
      props = {
        ...props,
        value: '23:01:23',
        data: {
          ...props.data,
          html5: true,
        },
        modernizr: {
          inputtypes: {
            time: true,
          },
        },
      };

      timeField = ReactTestUtils.renderIntoDocument(
        <TimeField {...props} />
      );

      inputField = ReactTestUtils.findRenderedDOMComponentWithTag(timeField, 'input');
    });

    it('should know it supports html5', () => {
      expect(timeField.props.data.html5).toBe(true);
      expect(timeField.hasNativeSupport()).toBe(true);
      expect(timeField.asHTML5()).toBe(true);
    });

    it('should use iso format of time value in the input field', () => {
      expect(inputField.type).toBe('time');
      expect(inputField.value).toBe('23:01:23');
    });

    it('should pass iso format as entered in the input', () => {
      const value = '12:22:33';
      const event = { target: { value } };
      timeField.handleChange(event);
      expect(timeField.props.onChange).toBeCalledWith(event, { id: 'time', value: '12:22:33' });
    });
  });

  describe('Browser supports html5 time input but user has opt-outed', () => {
    beforeEach(() => {
      props = {
        ...props,
        value: '23:01:23',
        data: {
          ...props.data,
          html5: false,
        },
        modernizr: {
          inputtypes: {
            time: true,
          },
        },
      };

      timeField = ReactTestUtils.renderIntoDocument(
        <TimeField {...props} />
      );

      inputField = ReactTestUtils.findRenderedDOMComponentWithTag(timeField, 'input');
    });

    it('should use localised format of date value in the input field', () => {
      expect(inputField.type).toBe('text');
      expect(inputField.value).toBe('11:01 PM');
    });

    it('should suppress HTML input even if supported', () => {
      expect(timeField.props.data.html5).toBe(false);
      expect(timeField.hasNativeSupport()).toBe(true);
      expect(timeField.asHTML5()).toBe(false);
    });
  });
});
