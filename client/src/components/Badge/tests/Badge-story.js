import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { storiesOf } from '@storybook/react';
import Badge from 'components/Badge/Badge';

storiesOf('Admin/Badge', module)
  .add('Types', () => (
    <div>
      <div>
        <Badge message="Default badge" />
      </div>
      <div>
        <Badge status="info" message="Info badge" />
      </div>
      <div>
        <Badge status="success" message="Success badge" />
      </div>
      <div>
        <Badge status="warning" message="Warning badge" />
      </div>
      <div>
        <Badge status="danger" message="Danger badge" />
      </div>
      <div>
        <Badge status="primary" message="Primary badge" />
      </div>
      <div>
        <Badge status="secondary" message="Secondary badge" />
      </div>
    </div>
  ));
