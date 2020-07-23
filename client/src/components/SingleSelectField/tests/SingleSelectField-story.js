import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { storiesOf } from '@storybook/react';
import { withKnobs, text, boolean, object } from '@storybook/addon-knobs/react';
import SingleSelectField from 'components/SingleSelectField/SingleSelectField';

const props = {
  name: 'options',
  source: [
    {
      value: 1,
      title: 'One',
      description: 'One is the first number'
    },
    {
      value: 2,
      title: 'Two',
      description: 'Two is the second number'
    },
    {
      value: 3,
      title: 'Three',
      description: 'Three is the third number'
    },
    {
      value: 4,
      title: 'Four (Disabled)',
      disabled: true,
      description: 'Four is the fourth number'
    },
  ],
};

storiesOf('Admin/SingleSelectField', module)
  .addDecorator(withKnobs)
  .addWithJSX('Default', () => (
    <SingleSelectField
      {...props}
      data={{
        hasEmptyDefault: boolean('hasEmptyDefault', false),
        emptyString: text('emptyString', 'Choose an option')
      }}
      value={text('value', 2)}
      readOnly={boolean('readOnly', false)}
      source={object('source', props.source)}
    />
  ))
  .add('Empty default', () => (
    <SingleSelectField
      {...props}
      data={{
        hasEmptyDefault: true,
        emptyString: 'Choose an option'
      }}
    />))
  .add('Readonly', () => (
    <SingleSelectField
      {...props}
      readOnly
      value="One"
    />
  ));
