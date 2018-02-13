import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { storiesOf } from '@storybook/react';
import CheckboxField from 'components/CheckboxField/CheckboxField';

const props = {
    title: '1',
    value: 'one',
};

storiesOf('Admin/CheckboxField', module)
  .add('Checkbox', () => (
    <CheckboxField
      {...props}
    />
  ));
