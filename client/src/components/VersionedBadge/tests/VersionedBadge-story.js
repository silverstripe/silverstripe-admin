import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { storiesOf } from '@storybook/react';
import VersionedBadge from 'components/VersionedBadge/VersionedBadge';

storiesOf('Admin/Badges', module)
  .add('Versioned badge', () => (
    <div>
      <p>My Page Name <VersionedBadge status="draft" /></p>
      <p>Contact Us <VersionedBadge status="modified" /></p>
      <p>About Us <VersionedBadge status="live" /></p>
      <p>Old Page <VersionedBadge status="archived" /></p>
    </div>
  ));
