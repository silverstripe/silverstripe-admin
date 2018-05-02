import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { storiesOf } from '@storybook/react';
import Loading from 'components/Loading/Loading';

storiesOf('Admin/Loading', module)
  .add('Loading', () => (
    <Loading containerClass="" />
  ));
