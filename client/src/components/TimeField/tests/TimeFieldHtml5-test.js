/* global jest, describe, beforeEach, it, expect, modernizr */

jest.unmock('react');
jest.unmock('react-addons-test-utils');
jest.unmock('../TimeField');

jest.mock('modernizr', () => ({
  inputtypes: {
    time: true,
  },
}));

import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';
import { Component as TimeField } from '../TimeField';

describe('TimeField with html5 time field support', () => {
  let props = null;

  beforeEach(() => {
    props = {
      title: '',
      name: '',
      value: '',
      onChange: jest.genMockFunction(),
    };
  });

  describe('Browser supports html5 time input', () => {
    let timeField = null;
    let inputField = null;
    const modProps = {};
    Object.assign(modProps, props, {
      value: '23:01:23',
      html5: true,
      onChange: jest.genMockFunction(),
    });

    beforeEach(() => {
      timeField = ReactTestUtils.renderIntoDocument(
        <TimeField {...modProps} />
      );

      inputField = ReactTestUtils.findRenderedDOMComponentWithTag(timeField, 'input');
    });

    it('should use iso format of time value in the input field', () => {
      expect(inputField.value).toBe('23:01:23');
    });

    it('should pass iso format as entered in the input', () => {
      inputField.value = '12:22:33';
      ReactTestUtils.Simulate.change(inputField);
      expect(timeField.props.onChange).toBeCalledWith('12:22:33');
    });
  });

  describe('Browser supports html5 time input but user has opt-outed', () => {
    let timeField = null;
    let inputField = null;
    const modProps = {};
    Object.assign(modProps, props, {
      value: '11:01:23 a',
      html5: false,
      onChange: jest.genMockFunction(),
    });

    beforeEach(() => {
      timeField = ReactTestUtils.renderIntoDocument(
        <TimeField {...modProps} />
      );

      inputField = ReactTestUtils.findRenderedDOMComponentWithTag(timeField, 'input');
    });

    it('should use whatever time format passed to it', () => {
      expect(inputField.value).toBe('11:01:23 a');
    });
  });
});

