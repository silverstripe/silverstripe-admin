import React, { useState } from 'react';
import { jsxDecorator } from 'storybook-addon-jsx';
import { Component as StatelessTabs } from 'components/Tabs/Tabs';
import TabItem from 'components/Tabs/TabItem';

export default {
  title: 'Admin/Tabs',
  decorators: [jsxDecorator],
  component: TabItem,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `For separating content into tabs without the need for separate pages.
        This extends from 'reactstrap' with similar expected behaviours, only difference is that when
        there is only one tab (or none) in the Tabset, then only the content will show without the
        clickable tab.`
      },
      canvas: {
        sourceState: 'shown',
      },
      controls: {
        sort: 'alpha',
      }
    }
  },
};

const Tabs = (props) => {
  const [activeTab, activateTab] = useState();
  return (
    <StatelessTabs
      {...props}
      activeTab={activeTab}
      activateTab={activateTab}
    />
  );
};

export const Basic = () => (
  <Tabs id="Root">
    <TabItem name="Main" title="Main">
      My first tab content
    </TabItem>
    <TabItem name="Settings" title="Settings">
      My settings tab here
    </TabItem>
    <TabItem name="Disabled" title="Disabled item" disabled>
      My settings tab here
    </TabItem>
  </Tabs>
);

export const SingleTabInstance = () => (
  <Tabs id="Root">
    <TabItem name="Main" title="Main">
      Tab content for the only tab in tabset
    </TabItem>
  </Tabs>
);
