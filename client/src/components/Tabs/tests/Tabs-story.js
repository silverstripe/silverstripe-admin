import React, { useState } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { storiesOf, setAddon } from '@storybook/react';
import JSXAddon from 'storybook-addon-jsx';
import { Component as StatelessTabs } from 'components/Tabs/Tabs';
import TabItem from 'components/Tabs/TabItem';
import { withNotes } from '@storybook/addon-notes';
import notes from '../README.md';

const Tabs = (props) => {
  const [activeTab, activateTab] = useState();
  return <StatelessTabs {...props} activeTab={activeTab} activateTab={activateTab} />;
};

setAddon(JSXAddon);

storiesOf('Admin/Tabs', module)
  .addWithJSX('Basic', withNotes(notes)(() => (
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
  )))
  .addWithJSX('Single tab instance', withNotes(notes)(() => (
    <Tabs id="Root">
      <TabItem name="Main" title="Main">
        Tab content for the only tab in tabset
      </TabItem>
    </Tabs>
  )));
