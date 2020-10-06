/* global jest, describe, it, expect */

import React from 'react';
import Toolbar from '../Toolbar';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16/build/index';

Enzyme.configure({ adapter: new Adapter() });

const errorSpy = jest.spyOn(global.console, 'error');
const warnSpy = jest.spyOn(global.console, 'warn');

const props = {
  onBackButtonClick: () => {},
  showBackButton: false
};

describe('Toolbar', () => {
  describe('render()', () => {
    beforeEach(() => {
      errorSpy.mockClear();
      warnSpy.mockClear();
    });

    it('renders', () => {
      const reactWrapper = mount(
        <Toolbar {...props} />
      );

      expect(reactWrapper.find('div.toolbar')).toHaveLength(1);
      expect(reactWrapper.find('.back-button')).toHaveLength(0);
      expect(errorSpy).not.toHaveBeenCalled();
      expect(warnSpy).not.toHaveBeenCalled();
    });
  });
});
