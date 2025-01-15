import { jsxDecorator } from 'storybook-addon-jsx';
import Badge, { statuses } from 'components/Badge/Badge';

export default {
  title: 'Admin/Badges/Badge',
  component: Badge,
  decorators: [
    jsxDecorator
  ],
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Badge component for displaying a message in a Bootstrap "badge" style.'
      },
      canvas: {
        sourceState: 'shown',
      },
    }
  },
  argTypes: {
    message: {
      description: 'The string to display in the badge.',
      control: 'text',
    },
    status: {
      description: "The status for the badge, takes bootstrap's values.",
      control: 'select',
      options: statuses,
      table: {
        type: { summary: 'success, warning, danger, info, default' },
        defaultValue: { summary: 'default' },
      }
    },
    inverted: {
      description: 'If the colours should be inverted.',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    className: {
      description: 'Any extra classes to apply for the badge.',
      control: 'inline-radio',
      options: {
        'Empty class name': '',
        'rounded-pill class name': 'rounded-pill'
      },
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'rounded-pill' },
      },
    }
  }
};

/** Test message */
export const _Badge = {
  args: {
    message: 'Hello World!',
    status: 'default',
    className: 'rounded-pill',
    inverted: false
  }
};
