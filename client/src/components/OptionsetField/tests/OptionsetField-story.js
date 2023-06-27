import React from 'react';
import OptionsetField from 'components/OptionsetField/OptionsetField';

export default {
  title: 'Admin/OptionField/OptionsetField',
  component: OptionsetField,
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
    itemClass: {
      description: 'Classes applicable to each item in the group.',
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
    value: {
      description: 'The value that matches one of the source items value.',
      table: {
        type: { summary: 'string|number' },
        defaultValue: { summary: '' },
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

export const _OptionsetField = (args) => <OptionsetField {...args} />;
_OptionsetField.args = {
  id: 'set',
  title: '',
  name: 'set',
  value: '2',
  source: [
    { value: '1', title: 'one' },
    { value: '2', title: 'two' },
    { value: '3', title: 'three' },
    { value: '4', title: 'four' },
  ],
};
