/* global jest, describe, it, expect */

import React from 'react';
import SingleSelectField from '../SingleSelectField';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16/build/index';

Enzyme.configure({ adapter: new Adapter() });

const errorSpy = jest.spyOn(global.console, 'error');
const warnSpy = jest.spyOn(global.console, 'warn');

describe('HiddenField', () => {
  describe('render()', () => {
    beforeEach(() => {
      errorSpy.mockClear();
      warnSpy.mockClear();
    });

    it('readonly', () => {
      const wrapper = mount(
        <SingleSelectField value={null} readOnly name="myValue" />
      );

      const input = wrapper.find('select');
      expect(input).toHaveLength(1);
      expect(errorSpy).not.toHaveBeenCalled();
      expect(warnSpy).not.toHaveBeenCalled();
    });
  });
});
