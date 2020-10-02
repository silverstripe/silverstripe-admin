/* global jest, describe, it, expect */

import React, { useState } from 'react';
import Enzyme, { render } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16/build/index';
import useTabContext from '../useTabContext';
import { Component as StatelessTabs } from 'components/Tabs/Tabs';
import TabItem from 'components/Tabs/TabItem';

Enzyme.configure({ adapter: new Adapter() });

const TabContextPrinter = () => {
  const tabContext = useTabContext();
  return <div className="TabContextPrinter">{JSON.stringify(tabContext)}</div>;
};

const Tabs = (props) => {
  const [activeTab, activateTab] = useState();
  return <StatelessTabs {...props} activeTab={activeTab} activateTab={activateTab} />;
};

describe('useTabContext', () => {
  it('Not in any tab', () => {
    const wrapper = render(<TabContextPrinter />);
    const tabContext = JSON.parse(wrapper.text());
    expect(tabContext).toBe(false);
  });

  it('In active tab', () => {
    const wrapper = render(
      <Tabs id="foo">
        <TabItem name="active">
          <TabContextPrinter />
        </TabItem>
      </Tabs>
    );
    const tabContext = JSON.parse(wrapper.find('.TabContextPrinter').text());
    expect(tabContext).toMatchObject({
      activeTab: 'active',
      currentTab: 'active',
      isOnActiveTab: true
    });
  });

  it('Outside active tab', () => {
    const wrapper = render(
      <Tabs id="foo">
        <TabItem name="active" />
        <TabItem name="not-active">
          <TabContextPrinter />
        </TabItem>
      </Tabs>
    );
    const tabContext = JSON.parse(wrapper.find('.TabContextPrinter').text());
    expect(tabContext).toMatchObject({
      activeTab: 'active',
      currentTab: 'not-active',
      isOnActiveTab: false
    });
  });

  it('Tab inside non active tab', () => {
    const wrapper = render(
      <Tabs id="foo">
        <TabItem name="active" />
        <TabItem name="not-active">
          <Tabs id="bar">
            <TabItem name="sub-active">
              <TabContextPrinter />
            </TabItem>
          </Tabs>
        </TabItem>
      </Tabs>
    );
    const tabContext = JSON.parse(wrapper.find('.TabContextPrinter').text());
    expect(tabContext).toMatchObject({
      activeTab: 'sub-active',
      currentTab: 'sub-active',
      isOnActiveTab: false
    });
  });


  it('Tab inside active tab', () => {
    const wrapper = render(
      <Tabs id="foo">
        <TabItem name="active">
          <Tabs id="bar">
            <TabItem name="sub-active">
              <TabContextPrinter />
            </TabItem>
          </Tabs>
        </TabItem>
        <TabItem name="not-active" />
      </Tabs>
    );

    const tabContext = JSON.parse(wrapper.find('.TabContextPrinter').text());
    expect(tabContext).toMatchObject({
      activeTab: 'sub-active',
      currentTab: 'sub-active',
      isOnActiveTab: true
    });
  });
});
