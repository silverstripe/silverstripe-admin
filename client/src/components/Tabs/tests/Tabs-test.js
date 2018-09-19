/* global jest, describe, it, expect */

import React from 'react';
import { Component as Tabs } from '../Tabs';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-15.4/build/index';

Enzyme.configure({ adapter: new Adapter() });

describe('Tab', () => {
  describe('render()', () => {
    it('Renders the navigation with hideNav: false', () => {
      const wrapper = shallow(
        <Tabs
          id={'1'}
          hideNav={false}
        >
          <div title="Child One" />
          <div title="Child Two" />
        </Tabs>
    );

      expect(wrapper.find('Nav')).toHaveLength(1);
    });

    it('Doesn\'t render the navigation with hideNav: true', () => {
      const wrapper = shallow(
        <Tabs
          id={'2'}
          hideNav
        >
          <div title="Child One" />
          <div title="Child Two" />
        </Tabs>
    );

      expect(wrapper.find('Nav')).toHaveLength(0);
    });
  });
});
