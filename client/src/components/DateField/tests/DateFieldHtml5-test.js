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
      onChange: jest.genMockFunction(),
    };
  });

  describe('Browser doesn\'t support html5 date input', () => {
    let dateField = null;
    let inputFields = null;
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

      inputFields = ReactTestUtils.scryRenderedDOMComponentsWithTag(dateField, 'input');
      inputField = inputFields[0];
    });

    it('should render 2 inputs', () => {
      expect(inputFields.length).toBe(1);
      expect(inputField.type).toBe('date');
    });

    it('should use iso format in the input field', () => {
      expect(inputField.value).toBe('2017-01-05');
    });
  });
});

