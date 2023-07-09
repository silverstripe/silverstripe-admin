import React from 'react';
import { jsxDecorator } from 'storybook-addon-jsx';
import { action } from '@storybook/addon-actions';
import Button from '../Button';

const colors = [
  'primary',
  'secondary',
  'success',
  'info',
  'warning',
  'danger',
  'link',
];
const sizes = ['sm', 'md', 'lg'];
const icons = [
  '',
  'search',
  'sync',
  'plus-circled',
  'cancel-circled',
  'check-mark',
  'edit',
];

const onClick = (event) => {
  event.preventDefault();
  return action('onClick')(event);
};
onClick.toString = () => 'onClick';

export default {
  title: 'Admin/Buttons/Button',
  component: Button,
  decorators: [
    jsxDecorator
  ],
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `The Button wraps a regular [Reactstrap Button](https://reactstrap.github.io/components/buttons/)
         component with a few Silverstripe-specific convenience props. All the regular Reactstrap props are also available.`
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
    color: {
      description: 'Predefined style to apply to the button: `success`, `warning`, `danger`, `info`, `default`.',
      control: 'select',
      options: colors,
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'default' },
      }
    },
    size: {
      description: 'Make the button smaller or larger. Acceptable values include `sm`, `md` and `lg`.',
      control: 'select',
      options: sizes,
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'md' },
      }
    },
    icon: {
      description: 'A valid icon name to display in the button.',
      control: 'select',
      options: icons
    },
    outline: {
      description: 'Render the button border with a transparent background.',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      }
    },
    block: {
      description: 'Display the button as a block taking the full width of its container.',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      }
    },
    active: {
      description: 'Render the button in an active state. Useful for toggle buttons.',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      }
    },
    disabled: {
      description: 'Prevent the user from interacting with the button.',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      }
    },
    noText: {
      description: 'Hide the button text and display it as an `aria-label` instead. This should be use in conjunction with `icon` otherise your button will be empty.',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      }
    },
    className: {
      control: 'text',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '' },
      }
    },
    children: {
      control: 'text',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '' },
      }
    },
    onClick: {
      action: 'clicked',
      table: {
        type: { summary: 'function' },
      }
    }
  }
};

export const _Button = (args) => <Button {...args}/>;
_Button.args = {
  color: 'primary',
  size: 'md',
  icon: '',
  outline: false,
  block: false,
  active: false,
  disabled: false,
  noText: false,
  onClick,
  className: '',
  children: 'click me'
};
