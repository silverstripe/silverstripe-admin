import React from 'react';
import VersionedBadge from 'components/VersionedBadge/VersionedBadge';

export default {
  title: 'Admin/Badges',
  component: VersionedBadge,
  decorators: [
    (Story) => <div><p>Modified Page <Story/></p></div>,
  ],
  argTypes: {
    status: {
      options: ['draft', 'modified', 'live', 'archived'],
      control: 'inline-radio'
    }
  }
};

export const _VersionedBadge = {
  name: 'Versioned badge',
  args: { status: 'draft' }
};
