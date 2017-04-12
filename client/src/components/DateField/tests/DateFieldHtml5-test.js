/* global jest, describe, beforeEach, it, expect, modernizr */

jest.unmock('react');
jest.unmock('react-addons-test-utils');
jest.unmock('../DateField');

jest.mock('modernizr', () => {
  return {
    inputtypes: {
      date: true
    }
  };
});

import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';
import { DateField } from '../DateField';

describe('DateField with html5 date field support', () => {
  let props = null;


  beforeEach(() => {
    props = {
      title: '',
      name: '',
      value: '',
      html5: true,
      onChange: jest.genMockFunction(),
    };
  });

  describe('Browser supports html5 date input', () => {
    let dateField = null;
    let inputFields = null;
    let inputField = null;
    let modProps = {};
    Object.assign(modProps, props, {
      lang: 'en_NZ',
      value: '2017-01-05',
      html5: true,
      onChange: jest.genMockFunction()
    });

    beforeEach(() => {
      dateField = ReactTestUtils.renderIntoDocument(
        <DateField {...modProps} />
      );

      inputFields = ReactTestUtils.scryRenderedDOMComponentsWithTag(dateField, 'input');
      inputField = inputFields[0];
    });

    it('should use iso format of date value in the input field', () => {
      expect(inputField.value).toBe('2017-01-05');
    });

    it('should pass iso format as entered in the input field', () => {
      inputField.value = '2018-02-05';
      ReactTestUtils.Simulate.change(inputField);
      expect(dateField.props.onChange).toBeCalledWith('2018-02-05');
    });

  });

  describe('Browser supports html5 date input but user has opt-outed', () => {
    let dateField = null;
    let inputFields = null;
    let inputField = null;
    let modProps = {};
    Object.assign(modProps, props, {
      lang: 'en_NZ',
      value: '2017-01-05',
      html5: false,
      onChange: jest.genMockFunction()
    });

    beforeEach(() => {
      dateField = ReactTestUtils.renderIntoDocument(
        <DateField {...modProps} />
      );

      inputFields = ReactTestUtils.scryRenderedDOMComponentsWithTag(dateField, 'input');
      inputField = inputFields[0];
    });

    it('should use localised format of date value in the input field', () => {
      expect(inputField.value).toBe('05/01/2017');
    });
  });
});

