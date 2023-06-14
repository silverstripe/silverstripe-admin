import React from 'react';
import LiteralField from 'components/LiteralField/LiteralField';

export default {
  title: 'Admin/LiteralField',
  component: LiteralField,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'LiteralField Component Description.'
      },
      canvas: {
        sourceState: 'shown',
      },
      controls: {
        sort: 'alpha',
      }
    }
  },
  argTypes: {
    id: {
      description: 'The ID for the component.',
      control: 'text',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '' },
      }
    },
    name: {
      control: 'text',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '' },
      }
    },
    className: {
      control: 'text',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '' },
      }
    },
    extraClass: {
      control: 'text',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '' },
      }
    },
    value: {
      control: 'text',
      table: {
        type: { summary: 'any' },
        defaultValue: { summary: '' },
      }
    },
  }
};

export const _LiteralField = (args) => <LiteralField {...args} />;
_LiteralField.args = {
  id: 'my-id',
  name: 'MyName',
  className: 'my-classname',
  extraClass: 'my-extra-class',
  value: '<h2>My literal heading</h2><p>My literal content</p>',
};
