import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { storiesOf } from '@storybook/react';
import HiddenField from 'components/HiddenField/HiddenField';

storiesOf('Admin/HiddenField', module)
  .add('Hidden', () => (
    <div>
      <p>[no visible field]</p>
      <HiddenField value="hidden-value" />
    </div>
  ));
