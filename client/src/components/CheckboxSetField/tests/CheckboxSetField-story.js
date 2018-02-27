import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { storiesOf } from '@storybook/react';
import CheckboxSetField from 'components/CheckboxSetField/CheckboxSetField';
import ValueTracker from 'stories/ValueTracker';

const props = {
  id: 'set',
  title: '',
  name: 'set',
  value: ['3'],
  source: [
    { value: '1', title: 'one' },
    { value: '2', title: 'two' },
    { value: '3', title: 'three' },
    { value: '4', title: 'four' },
  ],
};

storiesOf('Admin/CheckboxSetField', module)
  .addDecorator((storyFn) => (
    <ValueTracker>{storyFn()}</ValueTracker>
  ))
  .add('CheckboxSet', () => (
    <CheckboxSetField
      {...props}
    />
  ));
