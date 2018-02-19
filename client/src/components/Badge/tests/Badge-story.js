import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { storiesOf } from '@storybook/react';
import Badge from 'components/Badge/Badge';

storiesOf('Admin/Badge', module)
  .add('Default badge', ({ story }) => (
    <Badge message={story} />
  ))
  .add('Info badge', ({ story }) => (
    <Badge status="info" message={story} />
  ))
  .add('Success badge', ({ story }) => (
    <Badge status="success" message={story} />
  ))
  .add('Warning badge', ({ story }) => (
    <Badge status="warning" message={story} />
  ))
  .add('Danger badge', ({ story }) => (
    <Badge status="danger" message={story} />
  ))
  .add('Primary badge', ({ story }) => (
    <Badge status="primary" message={story} />
  ))
  .add('Secondary badge', ({ story }) => (
    <Badge status="secondary" message={story} />
  ));
