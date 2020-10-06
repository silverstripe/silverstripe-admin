/* global jest, describe, it, expect */

import React from 'react';
import LabelField from '../LabelField';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16/build/index';

Enzyme.configure({ adapter: new Adapter() });

const errorSpy = jest.spyOn(global.console, 'error');
const warnSpy = jest.spyOn(global.console, 'warn');

const props = {
  id: 123,
  className: 'my-classname',
  extraClass: 'my-extra-class',
  title: 'my-title',
  data: {
    target: 'my-target'
  }
};

describe('LabelField', () => {
  describe('render()', () => {
    beforeEach(() => {
      errorSpy.mockClear();
      warnSpy.mockClear();
    });

    it('renders', () => {
      const reactWrapper = mount(
        <LabelField {...props} />
      );

      expect(reactWrapper.find('label')).toHaveLength(1);
      expect(errorSpy).not.toHaveBeenCalled();
      expect(warnSpy).not.toHaveBeenCalled();
    });
  });
});
