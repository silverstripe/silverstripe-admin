import React from 'react';
import OptionField from 'components/OptionsetField/OptionField';

export default {
  title: 'Admin/OptionField/OptionField',
  component: OptionField,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `Generates a radio button group, behaves the similarly to 'SingleSelectField'.
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
      type: {
        required: true,
      },
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '' },
      }
    },
    type: {
      description: 'The type of option component will be: `checkbox` or `radio`',
      control: 'select',
      options: ['checkbox', 'radio'],
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'radio' },
      }
    },
    leftTitle: {
      description: 'Title to display to the left (if inline) or above the field, check below NOTE about handling raw html.',
      control: 'text',
      table: {
        type: { summary: 'any' },
        defaultValue: { summary: '' },
      }
    },
    title: {
      description: 'Title to display if leftTitle is not defined, check below NOTE about handling raw html.',
      control: 'text',
      table: {
        type: { summary: 'any' },
        defaultValue: { summary: '' },
      }
    },
    value: {
      description: 'Whether this is checked or not, *this does not hold an explicit value*!',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
      }
    },
    source: {
      description: `Array of items to appear in the list with the following properties.
      * value (string|number): The value for item.
      * title (any): The displayed value for item.
      * disabled (boolean): Tells if item is disabled from selecting.`,
      control: 'object',
      table: {
        type: { summary: 'object' },
        defaultValue: { summary: '' },
      }
    },
    disabled: {
      description: 'Whether this field is disabled.',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
      }
    },
    readOnly: {
      description: 'Whether this field is read only.',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
      }
    },
    onChange: {
      description: 'Event handler for when the component changes.',
      table: {
        type: { summary: 'function' },
        defaultValue: { summary: false },
      }
    }
  }
};

export const _OptionField = (args) => <OptionField {...args} />;
_OptionField.args = {
  id: 'set',
  title: '',
  name: 'set',
  value: '2'
};
