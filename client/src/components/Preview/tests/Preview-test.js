/* global jest, describe, it, expect */

import React from 'react';
import { Component as Preview } from '../Preview';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16/build/index';

Enzyme.configure({ adapter: new Adapter() });

const errorSpy = jest.spyOn(global.console, 'error');
const warnSpy = jest.spyOn(global.console, 'warn');

const props = {
  className: 'my-classname',
  itemLinks: {},
  itemId: 123,
  onBack: () => {},
  moreActions: [],
  ViewModeComponent: () => <div />,
};

describe('Preview', () => {
  describe('render()', () => {
    beforeEach(() => {
      errorSpy.mockClear();
      warnSpy.mockClear();
    });

    it('renders', () => {
      const reactWrapper = mount(
        <Preview {...props} />
      );

      expect(reactWrapper.find('div.preview')).toHaveLength(1);
      expect(errorSpy).not.toHaveBeenCalled();
      expect(warnSpy).not.toHaveBeenCalled();
    });
  });
});
