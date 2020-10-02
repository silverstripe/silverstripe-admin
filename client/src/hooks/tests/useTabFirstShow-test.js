/* global jest, describe, it, expect */

import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16/build/index';
import { useTabFirstShow } from '../useTabContext';
import { Component as Tabs } from 'components/Tabs/Tabs';
import TabItem from 'components/Tabs/TabItem';

Enzyme.configure({ adapter: new Adapter() });

const TabContextPrinter = ({ callback }) => {
  useTabFirstShow(callback);
  return <div />;
};

describe('useTabFirstShow', () => {
  it('Not in any tab', () => {
    const callback = jest.fn();
    mount(<TabContextPrinter callback={callback} />);
    expect(callback).toHaveBeenCalledWith(false);
  });

  it('In active tab', () => {
    const callback = jest.fn();
    mount(
      <Tabs id="foo" activeTab="active" activateTab={() => (false)}>
        <TabItem name="active">
          <TabContextPrinter callback={callback} />
        </TabItem>
      </Tabs>
    );
    expect(callback).toHaveBeenCalledWith({
      activeTab: 'active',
      currentTab: 'active',
      isOnActiveTab: true
    });
  });

  it('Outside active tab', () => {
    const callback = jest.fn();
    const wrapper = mount(
      <Tabs id="foo" activeTab="active" activateTab={() => (false)}>
        <TabItem name="active" />
        <TabItem name="secondary">
          <TabContextPrinter callback={callback} />
        </TabItem>
      </Tabs>
    );
    expect(callback).not.toHaveBeenCalled();

    wrapper.setProps({ activeTab: 'secondary' });
    expect(callback).toHaveBeenCalledWith({
      activeTab: 'secondary',
      currentTab: 'secondary',
      isOnActiveTab: true
    });

    callback.mockClear();
    wrapper.setProps({ activeTab: 'active' });
    wrapper.setProps({ activeTab: 'secondary' });
    expect(callback).not.toHaveBeenCalled();
  });

  it('active tab inside inactive tab', () => {
    const callback = jest.fn();
    const wrapper = mount(
      <Tabs id="foo" activeTab="active" activateTab={() => (false)}>
        <TabItem name="active" />
        <TabItem name="secondary">
          <Tabs id="bar" activeTab="subactive" activateTab={() => (false)}>
            <TabItem name="subactive">
              <TabContextPrinter callback={callback} />
            </TabItem>
          </Tabs>
        </TabItem>
      </Tabs>
    );
    expect(callback).not.toHaveBeenCalled();

    wrapper.setProps({ activeTab: 'secondary' });
    expect(callback).toHaveBeenCalledWith({
      activeTab: 'subactive',
      currentTab: 'subactive',
      isOnActiveTab: true
    });

    callback.mockClear();
    wrapper.setProps({ activeTab: 'active' });
    wrapper.setProps({ activeTab: 'secondary' });
    expect(callback).not.toHaveBeenCalled();
  });

  it('inactive tab inside inactive tab', () => {
    const callback = jest.fn();
    const wrapper = mount(
      <Tabs id="foo" activeTab="active" activateTab={() => (false)}>
        <TabItem name="active" />
        <TabItem name="secondary">
          <Tabs id="bar" activeTab="subactive" activateTab={() => (false)}>
            <TabItem name="subactive" />
            <TabItem name="subinactive">
              <TabContextPrinter callback={callback} />
            </TabItem>
          </Tabs>
        </TabItem>
      </Tabs>
    );
    expect(callback).not.toHaveBeenCalled();

    wrapper.setProps({ activeTab: 'secondary' });
    expect(callback).not.toHaveBeenCalled();
  });
});
