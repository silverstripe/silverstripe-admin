import React, { useState } from 'react';
import { jsxDecorator } from 'storybook-addon-jsx';
import { Component as StatelessTabs } from 'components/Tabs/Tabs';
import TabItem from 'components/Tabs/TabItem';

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

export default {
  title: 'Admin/Tabs',
  decorators: [jsxDecorator],
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
