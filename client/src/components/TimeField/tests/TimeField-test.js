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
  let props = null;

  beforeEach(() => {
    props = {
      title: '',
      name: '',
      value: '',
      onChange: jest.genMockFunction(),
    };
  });

  describe('onChange()', () => {
    let timeField = null;
    let inputField = null;

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
    let timeField = null;

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
    let timeField = null;

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
    let timeField = null;
    const modProps = {};
    Object.assign(modProps, props, { value: '04:22:39' });

    beforeEach(() => {
      timeField = ReactTestUtils.renderIntoDocument(
        <TimeField {...modProps} />
      );
    });

    it('should display local format when the browser doesn\'t support time type', () => {
      expect(timeField.getLocalisedValue()).toBe('4:22 AM');
    });
  });

  describe('Browser doesn\'t support html5 time input', () => {
    let timeField = null;
    let inputField = null;
    const modProps = {};
    Object.assign(modProps, props, {
      value: '23:01:23',
      onChange: jest.genMockFunction(),
      data: {
        html5: true,
      },
    });

    beforeEach(() => {
      timeField = ReactTestUtils.renderIntoDocument(
        <TimeField {...modProps} />
      );

      inputField = ReactTestUtils.findRenderedDOMComponentWithTag(timeField, 'input');
    });

    it('should use localised form of time value in the input field', () => {
      expect(inputField.value).toBe('11:01 PM');
    });

    it('should pass iso format instead of localised format', () => {
      inputField.value = '12:22 AM';
      ReactTestUtils.Simulate.change(inputField);
      expect(timeField.props.onChange).toBeCalledWith('00:22:00');
    });

    it('should pass "" if the input value is not valid', () => {
      inputField.value = 'invalid value';
      ReactTestUtils.Simulate.change(inputField);
      expect(timeField.props.onChange).toBeCalledWith('');
    });
  });
});
