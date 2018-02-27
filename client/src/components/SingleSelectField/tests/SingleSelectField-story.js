import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { storiesOf } from '@storybook/react';
import SingleSelectField from 'components/SingleSelectField/SingleSelectField';

const props = {
  name: 'options',
  source: [
    {
      value: 1,
      title: 'One'
    },
    {
      value: 2,
      title: 'Two'
    },
    {
      value: 3,
      title: 'Three'
    },
    {
      value: 4,
      title: 'Four (Disabled)',
      disabled: true
    },
  ],
};

storiesOf('Admin/SingleSelectField', module)
  .add('Default', () => (
    <SingleSelectField {...props} />
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
