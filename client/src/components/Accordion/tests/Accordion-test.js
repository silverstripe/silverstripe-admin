/* global jest, describe, it, expect */

import React from 'react';
import Accordion from '../Accordion';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16/build/index';

Enzyme.configure({ adapter: new Adapter() });

const errorSpy = jest.spyOn(global.console, 'error');
const warnSpy = jest.spyOn(global.console, 'warn');

describe('Accordion', () => {
  describe('render()', () => {
    beforeEach(() => {
      errorSpy.mockClear();
      warnSpy.mockClear();
    });

    it('renders with children', () => {
      const reactWrapper = mount(
        <Accordion>
          <p>lorem</p>
          <p>ipsum</p>
        </Accordion>
      );

      expect(reactWrapper.find('div')).toHaveLength(1);
      expect(errorSpy).not.toHaveBeenCalled();
      expect(warnSpy).not.toHaveBeenCalled();
    });
  });
});
