/* global jest, describe, it, expect */

import React from 'react';
import AccordionBlock from '../AccordionBlock';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16/build/index';

Enzyme.configure({ adapter: new Adapter() });

const errorSpy = jest.spyOn(global.console, 'error');
const warnSpy = jest.spyOn(global.console, 'warn');

const props = {
  groupid: 123,
  title: 'My title'
};

describe('AccordionBlock', () => {
  describe('render()', () => {
    beforeEach(() => {
      errorSpy.mockClear();
      warnSpy.mockClear();
    });

    it('renders with children', () => {
      const reactWrapper = mount(
        <AccordionBlock {...props}>
          <p>lorem</p>
          <p>ipsum</p>
        </AccordionBlock>
      );

      expect(reactWrapper.find('div.accordion__block')).toHaveLength(1);
      expect(errorSpy).not.toHaveBeenCalled();
      expect(warnSpy).not.toHaveBeenCalled();
    });
  });
});
