/* global jest, describe, beforeEach, it, expect, require */

import React from 'react';
import { Component as LookupField } from '../LookupField';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16/build/index';

Enzyme.configure({ adapter: new Adapter() });

describe('LookupField', () => {
  let props = null;
  let field = null;

  beforeEach(() => {
    // Set up some mocked out file info before each test
    props = {
      id: 'set',
      name: 'set',
      value: 'two',
      source: [
        { value: 'one', title: '1' },
        { value: 'two', title: '2' },
        { value: 'three', title: '3' },
        { value: 'four', title: '4' },
      ],
    };
  });

  describe('getValueCSV()', () => {
    it('should return an empty string', () => {
      props.value = [];

      field = shallow(<LookupField {...props} />).instance();
      const value = field.getValueCSV();

      expect(value).toEqual('');
    });

    it('should return the string value', () => {
      field = shallow(<LookupField {...props} />).instance();
      const value = field.getValueCSV();

      expect(value).toEqual('2');
    });

    it('should return the string value', () => {
      props.value = ['two', 'three'];

      field = shallow(<LookupField {...props} />).instance();
      const value = field.getValueCSV();

      expect(value).toEqual('2, 3');
    });
  });
});
