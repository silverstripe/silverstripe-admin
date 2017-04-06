/* global jest, describe, beforeEach, it, expect, modernizr */

jest.unmock('react');
jest.unmock('react-addons-test-utils');
jest.unmock('../DateTimeField');

jest.mock('modernizr', () => {
  return {
    inputtypes: {
      date: false
    }
  };
});

import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';
import { DateTimeField } from '../DateTimeField';

describe('DateTimeField', () => {
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
    let dateTimeField = null;
    let inputField = null;

    beforeEach(() => {
      dateTimeField = ReactTestUtils.renderIntoDocument(
        <DateTimeField {...props} />
      );
      inputField = ReactTestUtils.findRenderedDOMComponentWithTag(dateTimeField, 'input');
    });

    it('should call the onChange function on props', () => {
      ReactTestUtils.Simulate.change(inputField);
      expect(dateTimeField.props.onChange).toBeCalled();
    });
  });

});
