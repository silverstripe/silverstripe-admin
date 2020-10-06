import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { storiesOf } from '@storybook/react';
import Toolbar from 'components/Toolbar/Toolbar';

// Get around eslint "Value must be omitted for boolean attributes"
const t = true;
const f = false;

const noop = () => {};

storiesOf('Admin/Toolbar', module)
  .add('No back button', () => (
    <Toolbar showBackButton={f} onBackButtonClick={noop} />
  ))
  .add('Back button', () => (
    <Toolbar showBackButton={t} onBackButtonClick={noop} />
  ));
