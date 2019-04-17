import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { storiesOf } from '@storybook/react';
import VersionedBadge from 'components/VersionedBadge/VersionedBadge';

storiesOf('Admin/Badges', module)
  .add('Versioned badge', () => (
    <div>
      <p>My Page Name <VersionedBadge message="Draft" status="draft" /></p>
      <p>Contact Us <VersionedBadge message="Modified" status="modified" /></p>
      <p>About Us <VersionedBadge message="Live" status="live" /></p>
    </div>
  ));
