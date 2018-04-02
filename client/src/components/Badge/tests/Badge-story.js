import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { storiesOf } from '@storybook/react';
import Badge from 'components/Badge/Badge';

storiesOf('Admin/Badge', module)
  .add('Default states', () => (
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
  ))
  .add('Non-pill states', () => (
    <div>
      <div>
        <div>
          <Badge message="Default badge" className="" />
        </div>
        <div>
          <Badge status="info" message="Info badge" className="" />
        </div>
        <div>
          <Badge status="success" message="Success badge" className="" />
        </div>
        <div>
          <Badge status="warning" message="Warning badge" className="" />
        </div>
        <div>
          <Badge status="danger" message="Danger badge" className="" />
        </div>
        <div>
          <Badge status="primary" message="Primary badge" className="" />
        </div>
        <div>
          <Badge status="secondary" message="Secondary badge" className="" />
        </div>
      </div>
    </div>
  ))
  .add('Inverted states', () => (
    <div>
      <div>
        <Badge message="Default (inverted)" inverted />
      </div>
      <div>
        <Badge status="info" message="Info badge (inverted)" inverted />
      </div>
      <div>
        <Badge status="success" message="Success badge (inverted)" inverted />
      </div>
      <div>
        <Badge status="warning" message="Warning badge (inverted)" inverted />
      </div>
      <div>
        <Badge status="danger" message="Danger badge (inverted)" inverted />
      </div>
      <div>
        <Badge status="primary" message="Primary badge (inverted)" inverted />
      </div>
      <div>
        <Badge status="secondary" message="Secondary badge (inverted)" inverted />
      </div>
    </div>
  ));
