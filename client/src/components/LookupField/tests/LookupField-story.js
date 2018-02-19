import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { storiesOf } from '@storybook/react';
import LookupField from 'components/LookupField/LookupField';

storiesOf('Admin/LookupField', module)
  .add('Lookup', () => (
    <LookupField
      name="plaintext"
      source={[
        {
          value: 1,
          title: 'one',
        },
        {
          value: 2,
          title: 'two',
        },
        {
          value: 3,
          title: 'three',
        }
      ]}
      value={1}
    />
  ));
