import React from 'react';
import DatetimeField from 'components/DatetimeField/DatetimeField';

const props = {
  name: 'MyField',
  title: 'Field title',
  lang: 'en_NZ',
};

export default {
  title: 'Admin/DatetimeField',
  tags: ['autodocs'],
  component: DatetimeField,
  parameters: {
    docs: {
      description: {
        component: `Generates an editable date time field.
        _NOTE:_ For other properties, please refer to the [reactstrap FormControl](https://reactstrap.github.io/components/form/) documentation.`
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
      },
    },
    extraClass: {
      description: 'Extra classes the component should have.',
      table: {
        type: { summary: 'string' },
      },
    },
    name: {
      description: 'The name for the component.',
      type: {
        required: true
      },
      table: {
        type: { summary: 'string' },
      },
    },
    onChange: {
      description: 'Event handler for when the component changes.',
      table: {
        type: { summary: 'function' },
        defaultValue: { summary: '' },
      }
    },
    value: {
      description: 'The value to display for the field - localised date time format or ISO 8601 date format',
      control: 'text',
      table: {
        type: { summary: 'string' },
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
    lang: {
      description: 'Locale string. E.g. `en_NZ`.',
      control: 'text',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '' },
      }
    }
  }
};

export const Basic = () => <DatetimeField {...props} />;

export const Html5 = () => (
  <DatetimeField
    {...props}
    data={{
      html5: true,
    }}
  />
);
