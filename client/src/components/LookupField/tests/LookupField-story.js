import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { storiesOf } from '@storybook/react';
import LookupField from 'components/LookupField/LookupField';
import ValueTracker from 'stories/ValueTracker';

const props = {
  name: 'plaintext',
  value: 2,
  source: [
    {
      value: 1,
      title: 'one',
    },
    {
      value: 2,
      title: 'two',
    },
    {
      value: 3,
      title: 'three',
    }
  ],
};

storiesOf('Admin/LookupField', module)
  .addDecorator((storyFn) => (
    <ValueTracker>{storyFn()}</ValueTracker>
  ))
  .add('Lookup', () => (
    <LookupField {...props} />
  ));
