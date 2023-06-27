import React from 'react';
import { jsxDecorator } from 'storybook-addon-jsx';
import { action } from '@storybook/addon-actions';
import BackButton from '../BackButton';

const onClick = (event) => {
  event.preventDefault();
  return action('onClick')(event);
};
onClick.toString = () => 'onClick';

export default {
  title: 'Admin/Buttons/BackButton',
  component: BackButton,
  decorators: [
    jsxDecorator
  ],
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Generic Button component to allow users to return to a preview view. It displays a `<` icon and has an appropriate `aria-label.'
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
    children: {
      description: "If present, any nested content inside the button will apply to the `aria-label` attribute. Otherwise, the localised string 'Back' will be used.",
      control: 'text',
      table: {
        type: { summary: 'string' },
      },
    },
    className: {
      control: 'text',
      table: {
        type: { summary: 'string' },
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

export const _BackButton = (args) => <BackButton {...args}/>;
_BackButton.args = {
  onClick,
  className: '',
  children: 'Back'
};
