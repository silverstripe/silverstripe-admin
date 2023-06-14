import React from 'react';
import LookupField from 'components/LookupField/LookupField';

export default {
  title: 'Admin/LookupField',
  component: LookupField,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `Generates a CSV list of values inside a Readonly styled box.
        _NOTE:_ For other properties, please refer to the [reactstrap Input](https://reactstrap.github.io/components/form/) documentation.`
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
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '' },
      }
    },
    extraClass: {
      description: 'Extra classes the component should have.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '' },
      }
    },
    name: {
      description: 'The name for the component.',
      type: {
        required: true
      },
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '' },
      }
    },
    value: {
      description: 'The values to look up in the source.',
      table: {
        type: { summary: 'string|array' },
        defaultValue: { summary: '' },
      }
    },
    source: {
      description: `Array of items to appear in the list with the following properties.
      * value (string|number): The value for item.
      * title (any): The displayed value for item.`,
      control: 'object',
      table: {
        type: { summary: 'object' },
        defaultValue: { summary: '' },
      }
    }
  }
};

export const _LookupField = (args) => <LookupField {...args} />;
_LookupField.args = {
  name: 'plaintext',
  value: 2,
  source: [
    {
      value: 1,
      title: 'one',
    },
    {
      value: 2,
      title: 'two',
    },
    {
      value: 3,
      title: 'three',
    },
  ],
};
