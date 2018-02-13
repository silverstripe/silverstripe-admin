import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { storiesOf } from '@storybook/react';
import CheckboxSetField from 'components/CheckboxSetField/CheckboxSetField';

const props = {
    id: 'set',
    title: '',
    name: 'set',
    value: 'two',
    source: [
      { value: 'one', title: '1' },
      { value: 'two', title: '2' },
      { value: 'three', title: '3' },
      { value: 'four', title: '4' },
    ],
};

storiesOf('Admin/CheckboxSetField', module)
  .add('CheckboxSet', () => (
    <CheckboxSetField
      {...props}
    />
  ));
