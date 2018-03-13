import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { storiesOf } from '@storybook/react';
import OptionsetField from 'components/OptionsetField/OptionsetField';
import ValueTracker from 'stories/ValueTracker';

const props = {
  id: 'set',
  title: '',
  name: 'set',
  value: '2',
  source: [
    { value: '1', title: 'one' },
    { value: '2', title: 'two' },
    { value: '3', title: 'three' },
    { value: '4', title: 'four' },
  ],
};

storiesOf('Admin/OptionsetField', module)
  .addDecorator((storyFn) => (
    <ValueTracker>{storyFn()}</ValueTracker>
  ))
  .add('Optionset', () => (
    <OptionsetField
      {...props}
    />
  ));
