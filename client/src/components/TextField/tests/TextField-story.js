import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { setAddon, storiesOf } from '@storybook/react';
import { withKnobs, number, text } from '@storybook/addon-knobs';
import JSXAddon from 'storybook-addon-jsx';

setAddon(JSXAddon);

import TextField from 'components/TextField/TextField';
import ValueTracker from 'stories/ValueTracker';

const props = {
  name: 'MyField',
  id: 'MyField',
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
      data={{ rows: number('Rows', 4), columns: number('Columns', 40) }}
    />
  ))
  .add('All titles', () => (
    <TextField
      {...props}
      value="Default text"
      rightTitle={text('Right Title', 'Right title')}
      description={text('Description', 'My description')}
      data={{ prefix: text('Prefix', 'prefix'), suffix: text('Suffix', 'suffix') }}
    />
  ))
  .add('Validation failed', () => (
    <TextField
      {...props}
      value="Default text"
      description={text('Description', 'Field description')}
      message={{
        value: text('Validation Message', 'Validation message'),
        type: 'error' // This is the only type covered by our styles anyway
      }}
    />
  ));
