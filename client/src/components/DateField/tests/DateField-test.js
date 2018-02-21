/* global jest, describe, beforeEach, it, expect, modernizr, Event */

jest.mock('modernizr', () => ({
  inputtypes: {
    date: false,
  },
}));

import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';
import { Component as DateField } from '../DateField';

describe('DateField', () => {
  let dateField = null;
  let inputField = null;
  let props = null;

  beforeEach(() => {
    props = {
      id: 'date',
      title: '',
      name: '',
      value: '',
      data: {},
      onChange: jest.genMockFunction(),
    };
  });

  describe('onChange()', () => {
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
    beforeEach(() => {
      props = { ...props, lang: 'en_NZ' };
      dateField = ReactTestUtils.renderIntoDocument(
        <DateField {...props} />
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
    beforeEach(() => {
      props = { ...props, lang: 'en_NZ' };
      dateField = ReactTestUtils.renderIntoDocument(
        <DateField {...props} />
      );
    });

    it('should covert invalid iso date to ""', () => {
      expect(dateField.convertToLocalised('2017-13-12')).toBe('');
    });

    it('should covert iso date to local date format', () => {
      expect(dateField.convertToLocalised('2017-12-01')).toBe('01/12/2017');
    });

    it('should covert iso date to a differnt local date format', () => {
      props.lang = 'en_US';
      dateField = ReactTestUtils.renderIntoDocument(
        <DateField {...props} />
      );

      expect(dateField.convertToLocalised('2017-12-01')).toBe('12/01/2017');
    });
  });

  describe('getLocalisedValue()', () => {
    beforeEach(() => {
      props = { ...props, lang: 'en_NZ', value: '2017-01-05' };

      dateField = ReactTestUtils.renderIntoDocument(
        <DateField {...props} />
      );
    });

    it('should display local format when the browser doesn\'t support date type', () => {
      expect(dateField.getLocalisedValue()).toBe('05/01/2017');
    });
  });

  describe('Browser doesn\'t support html5 date input', () => {
    beforeEach(() => {
      props = {
        ...props,
        lang: 'en_NZ',
        value: '2017-01-05',
        data: {
          ...props.data,
          html5: true,
        },
      };

      dateField = ReactTestUtils.renderIntoDocument(
        <DateField {...props} />
      );

      inputField = ReactTestUtils.findRenderedDOMComponentWithTag(dateField, 'input');
    });

    it('should use localised format of date value in the input field', () => {
      expect(inputField.value).toBe('05/01/2017');
    });

    it('should pass iso format instead of localised format', () => {
      const value = '05/02/2018';
      const event = { target: { value } };

      dateField.handleChange(event);
      expect(dateField.props.onChange).toBeCalledWith(event, { id: 'date', value: '2018-02-05' });
    });

    it('should pass "" if the input value is not valid', () => {
      const value = 'invalid value';
      const event = { target: { value } };

      dateField.handleChange(event);
      expect(dateField.props.onChange).toBeCalledWith(event, { id: 'date', value: '' });
    });
  });

  describe('Html5 support', () => {
    beforeEach(() => {
      props = {
        ...props,
        data: {
          ...props.data,
          html5: false,
        },
      };
    });

    describe('Browser supports html5 date input', () => {
      beforeEach(() => {
        props = {
          ...props,
          lang: 'en_NZ',
          value: '2017-01-05',
        };

        dateField = ReactTestUtils.renderIntoDocument(
          <DateField {...props} />
        );

        inputField = ReactTestUtils.findRenderedDOMComponentWithTag(dateField, 'input');
      });

      it('should use iso format of date value in the input field', () => {
        expect(inputField.value).toBe('2017-01-05');
      });

      it('should pass iso format as entered in the input field', () => {
        const value = '2018-02-05';
        const event = { target: { value } };

        dateField.handleChange(event);
        expect(dateField.props.onChange).toBeCalledWith(event, { id: 'date', value: '2018-02-05' });
      });
    });

    describe('Browser supports html5 date input but user has opt-outed', () => {
      beforeEach(() => {
        props = {
          ...props,
          lang: 'en_NZ',
          value: 'Jan 1, 2017',
        };

        dateField = ReactTestUtils.renderIntoDocument(
          <DateField {...props} />
        );

        inputField = ReactTestUtils.findRenderedDOMComponentWithTag(dateField, 'input');
      });

      it('should use whatever format passed to it', () => {
        expect(inputField.value).toBe('Jan 1, 2017');
      });
    });
  });
});
