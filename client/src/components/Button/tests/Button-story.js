import React from 'react';
import { jsxDecorator } from 'storybook-addon-jsx';
import { action } from '@storybook/addon-actions';
import Button from '../Button';
import BackButton from '../BackButton';

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
  title: 'Admin/Button',
  component: Button,
  decorators: [
    jsxDecorator,
    (Story) => <div style={{ width: '100%' }}><Story/></div>
  ],
  argTypes: {
    color: {
      control: 'select',
      options: colors
    },
    size: {
      control: 'select',
      options: sizes
    },
    icon: {
      control: 'select',
      options: icons
    },
    outline: {
      control: 'boolean'
    },
    block: {
      control: 'boolean'
    },
    active: {
      control: 'boolean'
    },
    disabled: {
      control: 'boolean'
    },
    noText: {
      control: 'boolean'
    },
    className: {
      control: 'text'
    },
    children: {
      control: 'text'
    },
    onClick: { action: 'clicked' }
  }
};

export const _Button = {
  args: {
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
  }
};

export const _BackButton = (args) => (<BackButton {...args}/>);
_BackButton.args = {
  onClick,
  className: '',
  children: 'Back'
};
