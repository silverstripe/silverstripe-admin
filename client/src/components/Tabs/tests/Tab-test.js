/* global jest, describe, it, expect */

import React from 'react';
import Tab from '../Tab';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16/build/index';

Enzyme.configure({ adapter: new Adapter() });

describe('Tab', () => {
  it('render', () => {
    const onToggle = jest.fn();

    const wrapper = shallow(
      <Tab title="Foo bar" tabClassName="special" onToggle={onToggle} />
    );

    expect(wrapper.find('NavItem')).toHaveLength(1);

    const link = wrapper.find('NavItem').find('NavLink');
    expect(link).toHaveLength(1);
    expect(link.props()).toMatchObject({ disabled: false, className: 'special' });

    link.simulate('click');
    expect(onToggle).toHaveBeenCalled();
  });

  it('active', () => {
    const wrapper = shallow(
      <Tab title="Foo bar" active tabClassName="special" onToggle={jest.fn()} />
    );

    const link = wrapper.find('NavItem').find('NavLink');
    expect(link.props()).toMatchObject({ disabled: false, className: 'special active' });
  });

  it('disabled', () => {
    const wrapper = shallow(
      <Tab title="Foo bar" disabled tabClassName="special" onToggle={jest.fn()} />
    );

    const link = wrapper.find('NavItem').find('NavLink');
    expect(link.props()).toMatchObject({ disabled: true, className: 'special' });
  });

  it('no title', () => {
    const wrapper = shallow(
      <Tab tabClassName="special" onToggle={jest.fn()} />
    );

    expect(wrapper.find('NavItem')).toHaveLength(0);
  });
});
