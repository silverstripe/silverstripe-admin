/* global jest, describe, it, expect */

import React from 'react';
import Focusedzone from '../Focusedzone';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16/build/index';

Enzyme.configure({ adapter: new Adapter() });

const errorSpy = jest.spyOn(global.console, 'error');
const warnSpy = jest.spyOn(global.console, 'warn');

const props = {
  className: 'my-classname',
  onClickOut: () => {}
};

describe('Focusedzone', () => {
  describe('render()', () => {
    beforeEach(() => {
      errorSpy.mockClear();
      warnSpy.mockClear();
    });

    it('renders with children', () => {
      const reactWrapper = mount(
        <Focusedzone {...props}>
          <p>lorem</p>
          <p>ipsum</p>
        </Focusedzone>
      );

      expect(reactWrapper.find('div')).toHaveLength(1);
      expect(errorSpy).not.toHaveBeenCalled();
      expect(warnSpy).not.toHaveBeenCalled();
    });
  });
});
