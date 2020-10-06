/* global jest, describe, it, expect */

import React from 'react';
import HiddenField from '../HiddenField';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16/build/index';

Enzyme.configure({ adapter: new Adapter() });

const errorSpy = jest.spyOn(global.console, 'error');
const warnSpy = jest.spyOn(global.console, 'warn');

const props = {
  id: 'my-id',
  extraClass: 'my-extra-class',
  name: 'MyName',
  value: 'MyValue',
};

describe('HiddenField', () => {
  describe('render()', () => {
    beforeEach(() => {
      errorSpy.mockClear();
      warnSpy.mockClear();
    });

    it('renders', () => {
      const reactWrapper = mount(
        <HiddenField {...props} />
      );

      expect(reactWrapper.find('input')).toHaveLength(1);
      expect(errorSpy).not.toHaveBeenCalled();
      expect(warnSpy).not.toHaveBeenCalled();
    });

    it('renders with a null value', () => {
      const props2 = { ...props, value: null };
      const reactWrapper = mount(
        <HiddenField {...props2} />
      );

      expect(reactWrapper.find('input')).toHaveLength(1);
      expect(errorSpy).not.toHaveBeenCalled();
      expect(warnSpy).not.toHaveBeenCalled();
    });
  });
});
