import { jsxDecorator } from 'storybook-addon-jsx';
import CheckboxField from 'components/CheckboxField/CheckboxField';

export default {
  title: 'Admin/CheckboxField',
  component: CheckboxField,
  decorators: [
    jsxDecorator,
  ],
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `Generates a single checkbox element.
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
    name: {
      description: 'The name for the component. Required',
      control: 'text',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '' },
      }
    },
    leftTitle: {
      description: 'Title to display to the left (if inline) or above the field, check above NOTE about handling raw html.',
      control: 'text',
      table: {
        type: { summary: 'any' },
        defaultValue: { summary: '' },
      }
    },
    title: {
      description: 'Title to display if leftTitle is not defined, check above NOTE about handling raw html.',
      control: 'text',
      table: {
        type: { summary: 'any' },
        defaultValue: { summary: '' },
      }
    },
    message: {
      control: 'object',
      table: {
        type: { summary: 'object' },
        defaultValue: { summary: '{}' },
      }
    },
    description: {
      control: 'text'
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
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
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
    }
  }
};

export const _CheckboxField = {
  args: {
    title: 'a checkbox field',
    value: '1',
    message: {
      type: 'error',
      value: 'A message about the field.'
    },
    description: 'A description of the field.'
  }
};
