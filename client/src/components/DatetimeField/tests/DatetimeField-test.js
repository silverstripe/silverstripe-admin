/* global jest, describe, beforeEach, it, expect, modernizr */

jest.unmock('react');
jest.unmock('react-addons-test-utils');
jest.unmock('../DatetimeField');

jest.mock('modernizr', () => ({
  inputtypes: {
    'datetime-local': false,
  },
}));

import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';
import { Component as DatetimeField } from '../DatetimeField';

describe('DatetimeField without html5 date time field support', () => {
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
    let datetimeField = null;
    let inputField = null;

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
    let datetimeField = null;
    const modProps = {};
    Object.assign(modProps, props, { lang: 'en_NZ' });

    beforeEach(() => {
      datetimeField = ReactTestUtils.renderIntoDocument(
        <DatetimeField {...modProps} />
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
    let datetimeField = null;
    const modProps = {};
    Object.assign(modProps, props, { lang: 'en_NZ' });

    beforeEach(() => {
      datetimeField = ReactTestUtils.renderIntoDocument(
        <DatetimeField {...modProps} />
      );
    });

    it('should covert invalid iso date time to ""', () => {
      expect(datetimeField.convertToLocalised('2017-13-12T31:23:23')).toBe('');
    });

    it('should covert iso date to local date format', () => {
      expect(datetimeField.convertToLocalised('2017-12-01T02:32:33')).toBe('01/12/2017 2:32 AM');
    });

    it('should covert iso date to a differnt local date format', () => {
      modProps.lang = 'en_US';
      datetimeField = ReactTestUtils.renderIntoDocument(
        <DatetimeField {...modProps} />
      );

      expect(datetimeField.convertToLocalised('2017-12-01T23:02:22')).toBe('12/01/2017 11:02 PM');
    });
  });

  describe('Browser doesn\'t support html5 date time input', () => {
    let datetimeField = null;
    let inputField = null;
    const modProps = {};
    Object.assign(modProps, props, {
      lang: 'en_NZ',
      value: '2017-01-05T02:23:22',
      data: {
        html5: true,
      },
      onChange: jest.genMockFunction(),
    });

    beforeEach(() => {
      datetimeField = ReactTestUtils.renderIntoDocument(
        <DatetimeField {...modProps} />
      );

      inputField = ReactTestUtils.findRenderedDOMComponentWithTag(datetimeField, 'input');
    });

    it('should use localised format of date value in the input field', () => {
      expect(inputField.value).toBe('05/01/2017 2:23 AM');
    });

    it('should pass iso format instead of localised format', () => {
      inputField.value = '05/02/2018 3:12 PM';
      ReactTestUtils.Simulate.change(inputField);
      expect(datetimeField.props.onChange).toBeCalledWith('2018-02-05T15:12:00');
    });

    it('should pass "" if the input value is not valid', () => {
      inputField.value = 'invalid value';
      ReactTestUtils.Simulate.change(inputField);
      expect(datetimeField.props.onChange).toBeCalledWith('');
    });
  });
});
