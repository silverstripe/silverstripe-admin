/* global jest, test, describe, it, expect */

import React, { useState } from 'react';
import { Component as StatelessTabs } from 'components/Tabs/Tabs';
import TabItem from 'components/Tabs/TabItem';
import { render } from '@testing-library/react';
import useTabContext from '../useTabContext';

const TabContextPrinter = () => {
  const tabContext = useTabContext();
  return <div className="TabContextPrinter">{JSON.stringify(tabContext)}</div>;
};

const Tabs = (props) => {
  const [activeTab, activateTab] = useState();
  return <StatelessTabs {...props} activeTab={activeTab} activateTab={activateTab} />;
};

test('useTabContext not in any tab', () => {
  const { container } = render(<TabContextPrinter />);
  expect(JSON.parse(container.querySelector('.TabContextPrinter').innerHTML)).toBe(false);
});

test('useTabContext in active tab', () => {
  const { container } = render(
    <Tabs id="foo">
      <TabItem name="active">
        <TabContextPrinter />
      </TabItem>
    </Tabs>
  );
  expect(JSON.parse(container.querySelector('.TabContextPrinter').innerHTML)).toMatchObject({
    activeTab: 'active',
    currentTab: 'active',
    isOnActiveTab: true
  });
});

test('useTabContext outside active tab', () => {
  const { container } = render(
    <Tabs id="foo">
      <TabItem name="active" />
      <TabItem name="not-active">
        <TabContextPrinter />
      </TabItem>
    </Tabs>
  );
  expect(JSON.parse(container.querySelector('.TabContextPrinter').innerHTML)).toMatchObject({
    activeTab: 'active',
    currentTab: 'not-active',
    isOnActiveTab: false
  });
});

test('useTabContext in nested tab', () => {
  const { container } = render(
    <Tabs id="foo">
      <TabItem name="active">
        <Tabs id="bar">
          <TabItem name="sub-active">
            <TabContextPrinter />
          </TabItem>
        </Tabs>
      </TabItem>
    </Tabs>
  );
  expect(JSON.parse(container.querySelector('.TabContextPrinter').innerHTML)).toMatchObject({
    activeTab: 'sub-active',
    currentTab: 'sub-active',
    isOnActiveTab: true
  });
});

test('useTabContext inside active tab', () => {
  const { container } = render(
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
  expect(JSON.parse(container.querySelector('.TabContextPrinter').innerHTML)).toMatchObject({
    activeTab: 'sub-active',
    currentTab: 'sub-active',
    isOnActiveTab: true
  });
});
