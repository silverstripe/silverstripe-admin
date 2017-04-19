/* global jest, describe, beforeEach, it, expect, modernizr */

jest.unmock('react');
jest.unmock('react-addons-test-utils');
jest.unmock('../DateTimeField');

jest.mock('modernizr', () => {
  return {
    inputtypes: {
      "datetime-local": true
    }
  };
});

import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';
import { DateTimeField } from '../DateTimeField';

describe('DateTimeField with html5 date time field support', () => {
  let props = null;

  beforeEach(() => {
    props = {
      title: '',
      name: '',
      value: '',
      onChange: jest.genMockFunction(),
    };
  });

  describe('Browser supports html5 date time input', () => {
    let dateTimeField = null;
    let inputField = null;
    let modProps = {};
    Object.assign(modProps, props, {
      lang: 'en_NZ',
      value: '2017-01-05T02:23:22',
      html5: true,
      onChange: jest.genMockFunction()
    });

    beforeEach(() => {
      dateTimeField = ReactTestUtils.renderIntoDocument(
        <DateTimeField {...modProps} />
      );

      inputField = ReactTestUtils.findRenderedDOMComponentWithTag(dateTimeField, 'input');
    });

    it('should use localised format of date time value in the input field', () => {
      expect(inputField.value).toBe('2017-01-05T02:23:22');
    });

    it('should pass iso format as entered in the input field', () => {
      inputField.value = '2018-02-05T03:34:33';
      ReactTestUtils.Simulate.change(inputField);
      expect(dateTimeField.props.onChange).toBeCalledWith('2018-02-05T03:34:33');
    });
  });

  describe('Browser supports html5 date time input but user has opt-outed', () => {
    let dateTimeField = null;
    let inputFields = null;
    let inputField = null;
    let modProps = {};
    Object.assign(modProps, props, {
      lang: 'en_NZ',
      value: 'Jan 1, 2017 2:56 PM',
      html5: false,
      onChange: jest.genMockFunction()
    });

    beforeEach(() => {
      dateTimeField = ReactTestUtils.renderIntoDocument(
        <DateTimeField {...modProps} />
      );

      inputFields = ReactTestUtils.scryRenderedDOMComponentsWithTag(dateTimeField, 'input');
      inputField = inputFields[0];
    });

    it('should use whatever format passed to it', () => {
      expect(inputField.value).toBe('Jan 1, 2017 2:56 PM');
    });
  });

});
