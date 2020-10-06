/* global jest, describe, it, expect */

import React from 'react';
import FieldGroup from '../FieldGroup';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16/build/index';

Enzyme.configure({ adapter: new Adapter() });

const errorSpy = jest.spyOn(global.console, 'error');
const warnSpy = jest.spyOn(global.console, 'warn');

const props = {
  className: 'my-classname',
  data: {
    tag: 'fieldset',
    legend: 'my-legend'
  }
};

describe('FieldGroup', () => {
  describe('render()', () => {
    beforeEach(() => {
      errorSpy.mockClear();
      warnSpy.mockClear();
    });

    it('renders with children', () => {
      const reactWrapper = mount(
        <FieldGroup {...props}>
          <p>lorem</p>
          <p>ipsum</p>
        </FieldGroup>
      );

      expect(reactWrapper.find('fieldset')).toHaveLength(1);
      expect(errorSpy).not.toHaveBeenCalled();
      expect(warnSpy).not.toHaveBeenCalled();
    });
  });
});
