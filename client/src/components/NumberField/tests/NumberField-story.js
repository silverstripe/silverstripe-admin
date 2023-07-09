import { jsxDecorator } from 'storybook-addon-jsx';

import NumberField from 'components/NumberField/NumberField';
import actionListMaker from '../../../stories/actionListMaker';

const tagActions = actionListMaker('onClick', 'onChange');

export default {
  title: 'Admin/NumberField',
  component: NumberField,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'NumberField Component description.'
      },
      canvas: {
        sourceState: 'shown',
      },
      controls: {
        sort: 'alpha',
      }
    }
  },
  decorators: [
    jsxDecorator,
  ],
  argTypes: {
    title: {
      description: '',
      control: 'text',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '' },
      }
    },
    value: {
      control: 'number',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '' },
      }
    },
    placeholder: {
      control: 'text',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '' },
      }
    },
    description: {
      control: 'text',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '' },
      }
    },
    disabled: {
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
      }
    },
    message: {
      control: 'object',
      table: {
        type: { summary: 'object' },
        defaultValue: { summary: "{ value: '', type: '' }" },
      }
    },
    onClick: {
      table: {
        type: { summary: 'function' },
      }
    },
    onChange: {
      table: {
        type: { summary: 'function' },
      }
    }
  }
};

export const _NumberField = {
  args: {
    title: 'My Number Field',
    value: '42',
    placeholder: 'What is the answer to life, the universe, and everything?',
    description: 'You can add descriptions here',
    disabled: false,
    message: {
      type: 'error',
      value: ''
    },
    ...tagActions
  }
};
