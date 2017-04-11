/* global jest, describe, beforeEach, it, expect, modernizr */

jest.unmock('react');
jest.unmock('react-addons-test-utils');
jest.unmock('../DateField');

jest.mock('modernizr', () => {
  return {
    inputtypes: {
      date: false
    }
  };
});

import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';
import { DateField } from '../DateField';

describe('DateField', () => {
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
    let dateField = null;
    let inputField = null;

    beforeEach(() => {
      dateField = ReactTestUtils.renderIntoDocument(
        <DateField {...props} />
      );
      inputField = ReactTestUtils.findRenderedDOMComponentWithTag(dateField, 'input');
    });

    it('should call the onChange function on props', () => {
      ReactTestUtils.Simulate.change(inputField);
      expect(dateField.props.onChange).toBeCalled();
    });
  });

  describe('convertToIso()', () => {
    let dateField = null;
    let modProps = {};
    Object.assign(modProps, props, { lang: 'en_NZ' });

    beforeEach(() => {
      dateField = ReactTestUtils.renderIntoDocument(
        <DateField {...modProps} />
      );
    });

    it('should covert local date to iso date format', () => {
      expect(dateField.convertToIso('23/04/2017')).toBe('2017-04-23');
    });

    it('should accept iso date as an argument', () => {
      expect(dateField.convertToIso('2017-04-23')).toBe('2017-04-23');
    });

    it('should return "" the invalid date is provided', () => {
      expect(dateField.convertToIso('2017-23-3')).toBe('');
    });
  });

  describe('convertToLocalised()', () => {
    let dateField = null;
    let modProps = {};
    Object.assign(modProps, props, { lang: 'en_NZ' });

    beforeEach(() => {
      dateField = ReactTestUtils.renderIntoDocument(
        <DateField {...modProps} />
      );
    });

    it('should covert invalid iso date to ""', () => {
      expect(dateField.convertToLocalised('2017-13-12')).toBe('');
    });

    it('should covert iso date to local date format', () => {
      expect(dateField.convertToLocalised('2017-12-01')).toBe('01/12/2017');
    });

    it('should covert iso date to a differnt local date format', () => {
      modProps.lang = 'en_US';
      dateField = ReactTestUtils.renderIntoDocument(
        <DateField {...modProps} />
      );

      expect(dateField.convertToLocalised('2017-12-01')).toBe('12/01/2017');
    });
  });

  describe('getLocalisedValue()', () => {
    let dateField = null;
    let modProps = {};
    Object.assign(modProps, props, { lang: 'en_NZ', value: '2017-01-05' });

    beforeEach(() => {
      dateField = ReactTestUtils.renderIntoDocument(
        <DateField {...modProps} />
      );
    });

    it('should display local format when the browser doesn\'t support date type', () => {
      expect(dateField.getLocalisedValue()).toBe('05/01/2017');
    });

  });

  describe('Browser doesn\'t support html5 date input', () => {
    let dateField = null;
    let inputField = null;
    let modProps = {};
    Object.assign(modProps, props, {
      lang: 'en_NZ',
      value: '2017-01-05',
      onChange: jest.genMockFunction()
    });

    beforeEach(() => {
      dateField = ReactTestUtils.renderIntoDocument(
        <DateField {...modProps} />
      );

      inputField = ReactTestUtils.findRenderedDOMComponentWithTag(dateField, 'input');
    });

    it('should use localised form of date value in the input field', () => {
      expect(inputField.value).toBe('05/01/2017');
    });

    it('should pass iso format instead of localised format', () => {
      inputField.value = '05/02/2018fsdf';
      ReactTestUtils.Simulate.change(inputField);
      expect(dateField.props.onChange).toBeCalledWith('2018-02-05');
    });

    it('should pass "" if the input value is not valid', () => {
      inputField.value = 'invalid value';
      ReactTestUtils.Simulate.change(inputField);
      expect(dateField.props.onChange).toBeCalledWith('');

    });
  });
});
