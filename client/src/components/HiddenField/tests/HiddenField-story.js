import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { storiesOf } from '@storybook/react';
import HiddenField from 'components/HiddenField/HiddenField';

const props = {
  extraClass: 'my-extra-class',
  name: 'MyName',
  value: 'MyValue',
};

storiesOf('Admin/HiddenField', module)
  .add('Default', () => (
    <HiddenField {...props} />
  ));
