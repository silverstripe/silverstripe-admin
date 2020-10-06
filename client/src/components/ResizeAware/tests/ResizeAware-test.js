/* global jest, describe, it, expect */

import React from 'react';
import ResizeAware from '../ResizeAware';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16/build/index';

Enzyme.configure({ adapter: new Adapter() });

const errorSpy = jest.spyOn(global.console, 'error');
const warnSpy = jest.spyOn(global.console, 'warn');

const props = {
  component: 'div',
  onResize: () => {},
};

describe('ResizeAware', () => {
  describe('render()', () => {
    beforeEach(() => {
      errorSpy.mockClear();
      warnSpy.mockClear();
    });

    it('renders with children', () => {
      const reactWrapper = mount(
        <ResizeAware {...props} />
      );

      expect(reactWrapper.find('div')).toHaveLength(1);
      expect(errorSpy).not.toHaveBeenCalled();
      expect(warnSpy).not.toHaveBeenCalled();
    });
  });
});
