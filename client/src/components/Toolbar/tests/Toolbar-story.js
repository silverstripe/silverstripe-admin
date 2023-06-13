import React from 'react';
import Toolbar from 'components/Toolbar/Toolbar';

// Get around eslint 'Value must be omitted for boolean attributes'
const t = true;
const f = false;

const noop = () => {};

export default {
  title: 'Admin/Toolbar',
};

export const NoBackButton = () => (
  <Toolbar showBackButton={f} onBackButtonClick={noop} />
);

export const BackButton = () => (
  <Toolbar showBackButton={t} onBackButtonClick={noop} />
);
