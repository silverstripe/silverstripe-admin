/* global jest, describe, it, expect */

import React from 'react';
import LiteralField from '../LiteralField';
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
  value: '<h2>My literal heading</h2><p>My literal content</p>',
};

describe('LiteralField', () => {
  describe('render()', () => {
    beforeEach(() => {
      errorSpy.mockClear();
      warnSpy.mockClear();
    });

    it('renders', () => {
      const reactWrapper = mount(
        <LiteralField {...props} />
      );

      expect(reactWrapper.find('div')).toHaveLength(1);
      expect(errorSpy).not.toHaveBeenCalled();
      expect(warnSpy).not.toHaveBeenCalled();
    });
  });
});
