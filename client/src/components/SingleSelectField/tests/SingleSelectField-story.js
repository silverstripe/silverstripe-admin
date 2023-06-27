import React from 'react';
import SingleSelectField from 'components/SingleSelectField/SingleSelectField';

export default {
  title: 'Admin/SingleSelectField',
  component: SingleSelectField,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `Generates a select/dropdown field.
        _NOTE:_ For other properties, please refer to the [reactstrap Input](https://reactstrap.github.io/components/form/) documentation.`
      },
      canvas: {
        sourceState: 'shown',
      },
      controls: {
        sort: 'alpha',
        exclude: ['store'],
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
        required: true
      },
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '' },
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
    },
    value: {
      description: 'The value that matches one of the source items value.',
      table: {
        type: { summary: 'string|number' },
        defaultValue: { summary: '' },
      }
    },
    source: {
      description: `Array of items to appear in the list with the following properties excepted.
      * value (string|number): The value for item.
      * title (string|number): The displayed value for item.
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
    data: {
      description: `Extra data that helps define this field uniquely.
      * hasEmptyDefault (boolean): Defines if this has a "blank" option.
      * emptyString (string): The title for the "blank" option.`,
      control: 'object',
      table: {
        type: { summary: 'object' },
        defaultValue: { summary: '' },
      }
    }
  }
};

export const EmptyDefault = (args) => <SingleSelectField {...args} />;

EmptyDefault.args = {
  name: 'options',
  source: [
    {
      value: 1,
      title: 'One',
      description: 'One is the first number',
    },
    {
      value: 2,
      title: 'Two',
      description: 'Two is the second number',
    },
    {
      value: 3,
      title: 'Three',
      description: 'Three is the third number',
    },
    {
      value: 4,
      title: 'Four (Disabled)',
      disabled: true,
      description: 'Four is the fourth number',
    },
  ],
  data: {
    hasEmptyDefault: true,
    emptyString: 'Choose an option',
  }
};

export const Readonly = {
  args: {
    ...EmptyDefault.args,
    readOnly: true,
    value: 'One'
  }
};
