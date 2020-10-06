/* global jest, describe, it, expect */

import React from 'react';
import MobileMenuToggle from '../MobileMenuToggle';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16/build/index';

Enzyme.configure({ adapter: new Adapter() });

const errorSpy = jest.spyOn(global.console, 'error');
const warnSpy = jest.spyOn(global.console, 'warn');

const props = {
  isOpen: false,
  onClick: () => {},
  controls: 'something',
};

describe('MobileMenuToggle', () => {
  describe('render()', () => {
    beforeEach(() => {
      errorSpy.mockClear();
      warnSpy.mockClear();
    });

    it('renders', () => {
      const reactWrapper = mount(
        <MobileMenuToggle {...props} />
      );

      expect(reactWrapper.find('button.cms-mobile-menu-toggle')).toHaveLength(1);
      expect(reactWrapper.find('button.cms-mobile-menu-toggle--open')).toHaveLength(0);
      expect(errorSpy).not.toHaveBeenCalled();
      expect(warnSpy).not.toHaveBeenCalled();
    });

    it('renders open', () => {
      const props2 = { ...props, isOpen: true };
      const reactWrapper = mount(
        <MobileMenuToggle {...props2} />
      );

      expect(reactWrapper.find('button.cms-mobile-menu-toggle')).toHaveLength(1);
      expect(reactWrapper.find('button.cms-mobile-menu-toggle--open')).toHaveLength(1);
      expect(errorSpy).not.toHaveBeenCalled();
      expect(warnSpy).not.toHaveBeenCalled();
    });
  });
});
