import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { storiesOf } from '@storybook/react';
import Tabs from 'components/Tabs/Tabs';
import TabItem from 'components/Tabs/TabItem';

storiesOf('Admin/Tabs', module)
  .add('Basic', () => (
    <Tabs defaultActiveKey="Main" id="Root">
      <TabItem name="Main" title="Main">
        My first tab content
      </TabItem>
      <TabItem name="Settings" title="Settings">
        My settings tab here
      </TabItem>
    </Tabs>
  ));
