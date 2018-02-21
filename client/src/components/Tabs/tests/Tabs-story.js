import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { storiesOf } from '@storybook/react';
import Tabs from 'components/Tabs/Tabs';
import TabItem from 'components/Tabs/TabItem';

storiesOf('Admin/Tabs', module)
  .add('Basic', () => (
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
  ))
  .add('Single tab instance', () => (
    <Tabs id="Root">
      <TabItem name="Main" title="Main">
        Tab content for the only tab in tabset
      </TabItem>
    </Tabs>
  ));
