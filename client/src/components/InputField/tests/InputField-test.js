/* global jest, describe, it, expect */

import React from 'react';
import InputField from '../InputField';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16/build/index';

Enzyme.configure({ adapter: new Adapter() });

const errorSpy = jest.spyOn(global.console, 'error');
const warnSpy = jest.spyOn(global.console, 'warn');

const props = {
  id: 'my-id',
  name: 'MyName',
  className: 'my-classname',
  extraClass: 'my-extra-class',
  onChange: () => {},
  onBlur: () => {},
  onFocus: () => {},
  value: 'my-value',
  readOnly: false,
  disabled: false,
  placeholder: 'My placeholder',
  type: 'text',
  autoFocus: false,
  attributes: {
    'data-abc': '123',
    'data-def': '456',
  },
  title: 'My title',
};

describe('InputField', () => {
  describe('render()', () => {
    beforeEach(() => {
      errorSpy.mockClear();
      warnSpy.mockClear();
    });

    it('renders', () => {
      const reactWrapper = mount(
        <InputField {...props} />
      );

      expect(reactWrapper.find('input')).toHaveLength(1);
      expect(errorSpy).not.toHaveBeenCalled();
      expect(warnSpy).not.toHaveBeenCalled();
    });

    it('renders with a null value', () => {
      const props2 = { ...props, value: null };
      const reactWrapper = mount(
        <InputField {...props2} />
      );

      expect(reactWrapper.find('input')).toHaveLength(1);
      expect(errorSpy).not.toHaveBeenCalled();
      expect(warnSpy).not.toHaveBeenCalled();
    });
  });
});
