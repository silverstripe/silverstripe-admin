/* global jest, describe, beforeEach, it, expect, modernizr */

jest.unmock('react');
jest.unmock('react-addons-test-utils');
jest.unmock('../TimeField');

jest.mock('modernizr', () => {
  return {
    inputtypes: {
      time: false
    }
  };
});

import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';
import { TimeField } from '../TimeField';

describe('TimeField', () => {
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

});
