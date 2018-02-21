import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { storiesOf } from '@storybook/react';
import TextField from 'components/TextField/TextField';
import ValueTracker from 'stories/ValueTracker';

const props = {
  name: 'MyField',
  title: 'Field title',
  placeholder: 'Placeholder text',
};

storiesOf('Admin/TextField', module)
  .addDecorator((storyFn) => (
    <ValueTracker>{storyFn()}</ValueTracker>
  ))
  .add('Textbox', () => (
    <TextField
      {...props}
    />
  ))
  .add('Textarea', () => (
    <TextField
      {...props}
      data={{ rows: 4, columns: 40 }}
    />
  ))
  .add('All titles', () => (
    <TextField
      {...props}
      value="Default text"
      rightTitle="Right title"
      description="My description"
      data={{ prefix: 'prefix', suffix: 'suffix' }}
    />
  ))
  .add('Validation failed', () => (
    <TextField
      {...props}
      value="Default text"
      description="Field description"
      message={{ value: 'Validation message', type: 'error' }}
    />
  ));
