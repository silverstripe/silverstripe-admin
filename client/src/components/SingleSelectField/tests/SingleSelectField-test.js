/* global jest, describe, it, expect */

import React from 'react';
import SingleSelectField from '../SingleSelectField';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16/build/index';

Enzyme.configure({ adapter: new Adapter() });

const errorSpy = jest.spyOn(global.console, 'error');
const warnSpy = jest.spyOn(global.console, 'warn');

const props = {
  id: 'my-id',
  name: 'MyName',
  onChange: () => {},
  value: 'My value',
  readOnly: false,
  disabled: false,
  source: [],
  data: {
    emptyString: 'Any'
  },
};

describe('SingleSelectField', () => {
  describe('render()', () => {
    beforeEach(() => {
      errorSpy.mockClear();
      warnSpy.mockClear();
    });

    it('renders', () => {
      const reactWrapper = mount(
        <SingleSelectField {...props} />
      );

      expect(reactWrapper.find('select')).toHaveLength(1);
      expect(errorSpy).not.toHaveBeenCalled();
      expect(warnSpy).not.toHaveBeenCalled();
    });

    it('renders with a null value', () => {
      const props2 = { ...props, value: null };
      const reactWrapper = mount(
        <SingleSelectField {...props2} />
      );
      expect(reactWrapper.find('select')).toHaveLength(1);

      expect(errorSpy).not.toHaveBeenCalled();
      expect(warnSpy).not.toHaveBeenCalled();
    });

    it('renders as a p tag when readOnly', () => {
      const props2 = { ...props, readOnly: true };
      const wrapper = mount(
        <SingleSelectField {...props2} />
      );

      expect(wrapper.find('p')).toHaveLength(1);
      expect(errorSpy).not.toHaveBeenCalled();
      expect(warnSpy).not.toHaveBeenCalled();
    });

    it('renders when readOnly and null value', () => {
      const props2 = { ...props, readOnly: true, value: null };
      const wrapper = mount(
        <SingleSelectField {...props2} />
      );
      expect(wrapper.find('p')).toHaveLength(1);

      expect(errorSpy).not.toHaveBeenCalled();
      expect(warnSpy).not.toHaveBeenCalled();
    });
  });
});
