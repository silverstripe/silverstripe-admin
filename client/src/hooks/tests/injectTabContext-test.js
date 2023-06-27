/* global jest, test, describe, it, expect */

import React, { useState } from 'react';
import { Component as StatelessTabs } from 'components/Tabs/Tabs';
import TabItem from 'components/Tabs/TabItem';
import { render } from '@testing-library/react';
import { injectTabContext } from '../useTabContext';

const TabContextPrinter = injectTabContext(({ tabContext }) => (
  <div className="TabContextPrinter">{JSON.stringify(tabContext)}</div>
));

const Tabs = (props) => {
  const [activeTab, activateTab] = useState();
  return <StatelessTabs {...props} activeTab={activeTab} activateTab={activateTab} />;
};

test('injectTabContext not in any tab', () => {
  const { container } = render(<TabContextPrinter />);
  expect(JSON.parse(container.querySelector('.TabContextPrinter').innerHTML)).toBe(false);
});

test('injectTabContext in active tab', () => {
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

test('injectTabContext outside active tab', () => {
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
