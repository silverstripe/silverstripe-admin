import React from 'react';
import { Component as UsedOnTable } from 'components/UsedOnTable/UsedOnTable';

export default {
  title: 'Admin/UsedOnTable',
  component: UsedOnTable,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `Generates a generic table for loading a DataObject's ownership details.
        Relies on the \`SilverStripe\Admin\Forms\UsedOnTable\` FormField class on the PHP side, can be used independently if desired.`
      },
      canvas: {
        sourceState: 'shown',
      },
      controls: {
        sort: 'alpha',
      },
      story: {
        height: '300px'
      }
    },
  },
  argTypes: {
    loading: {
      description: 'Shows loadding icon.',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
      }
    },
    usedOn: {
      control: 'object',
      table: {
        type: { summary: 'array' },
      }
    },
  }
};

export const LoadingState = (args) => <UsedOnTable {...args} />;
LoadingState.args = {
  loading: true,
};

export const NoOwners = {
  args: {
    usedOn: []
  }
};

export const WithOwners = {
  args: {
    usedOn: [
      {
        id: 'a',
        title: 'Entry A item',
        type: 'Home Page',
        state: null,
        link: 'http://www.google.co.nz',
      },
      {
        id: 'b',
        title: 'Entry B parent',
        type: 'Group',
        state: 'draft',
        link: null,
      },
      {
        id: 'c',
        title: 'Entry C child',
        type: 'Gallery',
        state: 'modified',
        link: 'http://www.google.co.nz',
      },
      {
        id: 'd',
        title: 'Vrooooommmm',
        type: 'Car',
        state: 'draft',
        link: 'http://www.google.co.nz',
      },
    ]
  }
};
