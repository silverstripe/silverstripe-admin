import React from 'react';
import { jsxDecorator } from 'storybook-addon-jsx';
import TextField from 'components/TextField/TextField';

export default {
  title: 'Admin/TextField',
  component: TextField,
  decorators: [jsxDecorator],
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `Generates an editable text field.
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
      description: 'The value to display for the field, can use `defaultValue` for uncontrollable component.',
      table: {
        type: { summary: 'string|number' },
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
    type: {
      description: 'Defines the type this component will have, e.g. `email`, `tel`.',
      control: 'select',
      options: ['email', 'tel'],
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '' },
      }
    },
  }
};

export const DefaultTextField = args => <TextField {...args} />;
DefaultTextField.args = {
  name: 'MyField',
  id: 'MyField',
  title: 'Field title',
  placeholder: 'Placeholder text',
};

export const Textarea = {
  args: {
    ...DefaultTextField.args,
    data: { rows: 4, columns: 40 }
  }
};

export const AllTitles = {
  args: {
    ...DefaultTextField.args,
    value: 'Default text',
    rightTitle: 'Right title',
    description: 'My description',
    data: {
      prefix: 'prefix',
      suffix: 'suffix',
    }
  }
};

export const ValidationFailed = {
  args: {
    ...DefaultTextField.args,
    value: 'Default text',
    rightTitle: 'Right title',
    description: 'Field description',
    message: {
      value: 'Validation message',
      type: 'error',
    }
  }
};
