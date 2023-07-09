import { jsxDecorator } from 'storybook-addon-jsx';
import CheckboxSetField from 'components/CheckboxSetField/CheckboxSetField';

const source = [
  { value: '1', title: 'one' },
  { value: '2', title: 'two' },
  { value: '3', title: 'three' },
  { value: '4', title: 'four' },
];

export default {
  title: 'Admin/CheckboxSetField',
  component: CheckboxSetField,
  decorators: [
    jsxDecorator,
  ],
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `Generates a checkbox button group.
        _NOTE:_ For other properties, please refer to the [reactstrap Radio/Checkbox](https://reactstrap.github.io/components/form/) documentation.`
      },
      canvas: {
        sourceState: 'shown',
      },
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
      description: 'Classes applicable to each item in the group. **Required**',
      control: 'text',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '' },
      }
    },
    onChange: {
      description: 'Event handler for when the component changes.',
      table: {
        type: { summary: 'function' },
        defaultValue: { summary: '' },
      }
    },
    value: {
      description: 'Whether this is checked or not, *this does not hold an explicit value*!',
      control: 'inline-radio',
      options: [1, 2, 3, 4],
      table: {
        type: { summary: 'string|number' },
        defaultValue: { summary: '' },
      }
    },
    readOnly: {
      description: 'Whether this field is read only.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
      }
    },
    disabled: {
      description: 'Whether this field is disabled.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
      }
    },
    description: { control: 'text' },
    hideLabels: { control: 'boolean' },
    title: { control: 'text' },
    rightTitle: { control: 'text' },

    message: {
      description: '`value: string`, `type: string`',
      control: 'object',
      table: {
        type: { summary: 'object' },
        defaultValue: { summary: '{}' },
      }
    },
    source: {
      description: `Array of items to appear in the list with the following properties.
      \* value (string|number): The value for item.
      \* title (any): The displayed value for item.
      \* disabled (boolean): Tells if item is disabled from selecting.`,
      control: 'object',
      options: [...source],
      table: {
        type: { summary: 'array' },
      }
    }
  }
};

export const _CheckboxSetField = {
  args: {
    id: 'FieldID',
    description: 'Field Description',
    value: 3,
    hideLabels: false,
    title: 'Field Title',
    rightTitle: 'Right Title',
    name: 'FieldName',
    message: {
      type: 'error',
      value: 'A message about the field.'
    },
    source
  }
};
