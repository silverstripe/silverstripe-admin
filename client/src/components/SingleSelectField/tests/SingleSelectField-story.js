import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { storiesOf } from '@storybook/react';
import SingleSelectField from 'components/SingleSelectField/SingleSelectField';

storiesOf('Admin/SingleSelectField', module)
  .add('Default', () => (
    <SingleSelectField
      name="options"
      source={[
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
      ]}
    />))
    .add('Empty default', () => (
      <SingleSelectField
        name="options"
        source={[
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
        ]}
        data={{
          hasEmptyDefault: true,
          emptyString: 'Choose an option'
        }}
      />))
    .add('Readonly', () => (
      <SingleSelectField
        readOnly
        name="options"
        value="One"
        source={[
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
            title: 'Four',
            disabled: true
          },
        ]}
      />
  ));
