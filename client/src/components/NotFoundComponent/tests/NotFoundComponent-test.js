/* global jest, describe, it, expect */

import React from 'react';
import NotFoundComponent from '../NotFoundComponent';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16/build/index';

Enzyme.configure({ adapter: new Adapter() });

const errorSpy = jest.spyOn(global.console, 'error');
const warnSpy = jest.spyOn(global.console, 'warn');

const props = {
  itemName: 'MyItemName',
  name: 'MyName',
  value: 'My value'
};

describe('NotFoundComponent', () => {
  describe('render()', () => {
    beforeEach(() => {
      errorSpy.mockClear();
      warnSpy.mockClear();
    });

    it('renders', () => {
      const reactWrapper = mount(
        <NotFoundComponent {...props} />
      );

      expect(reactWrapper.find('div.not-found-component')).toHaveLength(1);
      expect(errorSpy).not.toHaveBeenCalled();
      expect(warnSpy).not.toHaveBeenCalled();
    });
  });
});
