import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { storiesOf } from '@storybook/react';
import CheckboxField from 'components/CheckboxField/CheckboxField';
import ValueTracker from 'stories/ValueTracker';

const props = {
  title: 'one',
  value: '1',
};

storiesOf('Admin/CheckboxField', module)
  .addDecorator((storyFn) => (
    <ValueTracker>{storyFn()}</ValueTracker>
  ))
  .add('Checkbox', () => (
    <CheckboxField
      {...props}
    />
  ))
  .add('All titles', () => (
    <CheckboxField
      {...props}
      message={{ type: 'error', value: 'My error message' }}
      description="This is a description"
    />
  ));
