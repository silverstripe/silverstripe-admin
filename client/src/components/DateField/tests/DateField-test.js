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

  describe('convertToIsoDate()', () => {
    let dateField = null;
    let modProps = {};
    Object.assign(modProps, props, { lang: 'en_NZ' });

    beforeEach(() => {
      dateField = ReactTestUtils.renderIntoDocument(
        <DateField {...modProps} />
      );
    });

    it('should covert local date to iso date format', () => {
      expect(dateField.convertToIsoDate('23/04/2017')).toBe('2017-04-23');
    });

    it('should accept iso date as an argument', () => {
      expect(dateField.convertToIsoDate('2017-04-23')).toBe('2017-04-23');
    });

    it('should return "" the invalid date is provided', () => {
      expect(dateField.convertToIsoDate('2017-23-3')).toBe('');
    });
  });

  describe('convertToLocalDate()', () => {
    let dateField = null;
    let modProps = {};
    Object.assign(modProps, props, { lang: 'en_NZ' });

    beforeEach(() => {
      dateField = ReactTestUtils.renderIntoDocument(
        <DateField {...modProps} />
      );
    });

    it('should covert invalid iso date to ""', () => {
      expect(dateField.convertToLocalDate('2017-13-12')).toBe('');
    });

    it('should covert iso date to local date format', () => {
      expect(dateField.convertToLocalDate('2017-12-01')).toBe('01/12/2017');
    });

    it('should covert iso date to a differnt local date format', () => {
      modProps.lang = 'en_US';
      dateField = ReactTestUtils.renderIntoDocument(
        <DateField {...modProps} />
      );

      expect(dateField.convertToLocalDate('2017-12-01')).toBe('12/01/2017');
    });
  });

  describe('getDisplayValue()', () => {
    let dateField = null;
    let modProps = {};
    Object.assign(modProps, props, { lang: 'en_NZ', value: '2017-01-05' });

    beforeEach(() => {
      dateField = ReactTestUtils.renderIntoDocument(
        <DateField {...modProps} />
      );
    });

    it('should display local format when the browser doesn\'t support date type', () => {
      expect(dateField.getDisplayValue()).toBe('05/01/2017');
    });

  });
});
