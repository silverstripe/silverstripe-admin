import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { storiesOf } from '@storybook/react';
import DatetimeField from 'components/DatetimeField/DatetimeField';
import ValueTracker from 'stories/ValueTracker';

const props = {
  name: 'MyField',
  title: 'Field title',
  lang: 'en_NZ'
};

storiesOf('Admin/DatetimeField', module)
  .addDecorator((storyFn) => (
    <ValueTracker>{storyFn()}</ValueTracker>
  ))
  .add('Basic', () => (
    <DatetimeField
      {...props}
    />))
  .add('HTML5', () => (
    <DatetimeField
      {...props}
      data={{
        html5: true
      }}
    />
  ));
