import React from 'react';
import StatusBadge, { STATUSES } from '../StatusBadge';

export default {
  title: 'Admin/Badges/StatusBadge',
  component: StatusBadge,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Badge component for displaying one status flag of a record.'
      },
    }
  },
  argTypes: {
    status: {
      description: 'The status of the record.',
      control: 'select',
      options: STATUSES,
    },
    text: {
      description: 'The text of the badge.',
      control: 'text',
    },
  },
};

export const _StatusBadge = {
  args: {
    status: 'modified',
    text: 'Modified',
  },
};

export const AllStatuses = () => (
  <>
    {STATUSES.map((status) => (
      <p key={status}>
        <StatusBadge status={status} text={status} />
      </p>
    ))}
  </>
);
