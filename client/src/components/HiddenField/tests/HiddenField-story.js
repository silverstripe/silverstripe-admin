import React from 'react';
import HiddenField from 'components/HiddenField/HiddenField';

export default {
  title: 'Admin/HiddenField',
  component: HiddenField,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `Generates a hidden input type field.
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
      control: 'text',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '' },
      }
    },
    extraClass: {
      description: 'Extra classes the component should have.',
      control: 'text',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '' },
      }
    },
    name: {
      description: 'The name for the component.',
      control: 'text',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '' },
      },
      type: {
        required: true
      }
    },
    value: {
      description: 'The value the input should hold.',
      control: 'text',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '' },
      },
    }
  }
};

export const _HiddenField = (args) => <HiddenField {...args} />;
_HiddenField.args = {
  extraClass: 'my-extra-class',
  name: 'MyName',
  value: 'MyValue',
};
