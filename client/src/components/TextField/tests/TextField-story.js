import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { setAddon, storiesOf } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';
import { withNotes } from '@storybook/addon-notes';
import JSXAddon from 'storybook-addon-jsx';

setAddon(JSXAddon);

import withTipNotes from './story-notes/with-tip.md';

import TextField from 'components/TextField/TextField';
import ValueTracker from 'stories/ValueTracker';

const props = {
  name: 'MyField',
  title: 'Field title',
  placeholder: 'Placeholder text',
};

storiesOf('Admin/TextField', module)
  .addDecorator(withKnobs)
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
  ))
  .add(
    'With tip',
    withNotes(
      withTipNotes
    )(
      () => (
        <div style={{ margin: '5em', width: '30em' }}>
          <TextField
            {...props}
            value="Default text"
            description="Field description"
            tip={{ icon: 'lamp', iconColor: 'danger', content: 'Additional information about the field', autoOpen: true }}
          />
        </div>
    )
    )
  );
