import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { storiesOf } from '@storybook/react';
import { Component as UsedOnTable } from 'components/UsedOnTable/UsedOnTable';

storiesOf('Admin/UsedOnTable', module)
  .add('Loading state', () => (
    <UsedOnTable loading />
  ))
  .add('No owners', () => (
    <UsedOnTable usedOn={[]} />
  ))
  .add('With owners', () => (
    <UsedOnTable
      usedOn={[
        { id: 'a', title: 'Entry A item', type: 'Home Page', state: null, link: 'http://www.google.co.nz' },
        { id: 'b', title: 'Entry B parent', type: 'Group', state: 'draft', link: null },
        { id: 'c', title: 'Entry C child', type: 'Gallery', state: 'modified', link: 'http://www.google.co.nz' },
        { id: 'd', title: 'Vrooooommmm', type: 'Car', state: 'draft', link: 'http://www.google.co.nz' },
      ]}
    />
  ));
