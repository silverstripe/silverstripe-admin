import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { storiesOf } from '@storybook/react';
import Badge from 'components/Badge/Badge';

storiesOf('Admin/Badge', module)
  .add('Default badge', ({ story }) => (
    <div>
      <div style={{ background: '#555', position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }} />
      <div style={{ zIndex: 2, position: 'relative' }}>
        <Badge message={story} />
      </div>
    </div>
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
