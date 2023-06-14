import React from 'react';
import VersionedBadge from 'components/VersionedBadge/VersionedBadge';

export default {
  title: 'Admin/Badges/VersionedBadge',
  component: VersionedBadge,
  decorators: [
    (Story) => <div><p>Modified Page <Story/></p></div>,
  ],
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Badge component for displaying versioning states in a Bootstrap "badge" based style.'
      },
      canvas: {
        sourceState: 'hide',
      },
    }
  },
  argTypes: {
    status: {
      description: 'The status for the badge, takes versioning states e.g. `draft`, `modified`, `live`, `archived`',
      options: ['draft', 'modified', 'live', 'archived'],
      control: 'inline-radio',
      table: {
        type: { summary: 'string' },
      }
    },
    className: {
      description: 'Any extra classes to apply for the badge.',
      control: 'text',
      table: {
        type: { summary: 'string' },
      }
    }
  }
};

export const _VersionedBadge = {
  name: 'Versioned badge',
  args: { status: 'draft' }
};
