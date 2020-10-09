/* global jest, describe, it, expect */

import React from 'react';
import { Component as Tabs } from '../Tabs';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16/build/index';

Enzyme.configure({ adapter: new Adapter() });

describe('Tabs', () => {
  describe('render()', () => {
    it('Renders the navigation with hideNav: false', () => {
      const wrapper = shallow(
        <Tabs
          id="1"
          className="hello"
          extraClass="world"
          hideNav={false}
        >
          <div title="Child One" />
          <div title="Child Two" />
        </Tabs>
      );

      const tabNav = wrapper.find('TabNav');
      expect(tabNav).toHaveLength(1);
      expect(wrapper.props()).toMatchObject({ id: '1', className: 'hello world' });
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
