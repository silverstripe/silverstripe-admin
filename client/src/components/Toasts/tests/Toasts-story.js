import React from 'react';
import { jsxDecorator } from 'storybook-addon-jsx';
import actionListMaker from '../../../stories/actionListMaker';

import Toasts from '../Toasts';
import Toast from '../Toast';

const { onDismiss, primaryAction, onPause, onResume } = actionListMaker(
  'onDismiss',
  'primaryAction',
  'onPause',
  'onResume'
);
const actions = [
  { label: 'Primary', onClick: primaryAction },
  { label: 'Secondary', href: 'https://silverstripe.com' },
];

const toasts = [
  { text: 'Notice me', type: 'notice', id: 'one', dismissed: false },
  {
    text: 'You have failed me for the last time, General',
    type: 'error',
    id: 'two',
    dismissed: false,
  },
  {
    text: 'Let\'s toast to your success',
    type: 'success',
    id: 'three',
    dismissed: false,
  },
  {
    text: 'Nice toast you\'ve got there. Would be a shame if someone dismissed it.',
    type: 'warning',
    id: 'four',
    dismissed: false,
  },
];

export default {
  title: 'Admin/Toasts',
  decorators: [
    jsxDecorator,
    (Story) => <div><Story/></div>,
  ]
};

export const Single = (args) => (
    <Toast {...args} />
);

Single.argsType = {
  text: {
    control: 'text'
  },
  type: {
    control: 'select',
    options: ['info', 'success', 'warning', 'error']
  },
  dismissed: {
    control: 'boolean'
  },
  onDismiss,
  actions: {
    control: 'select',
    options: [0, 1, 2]
  }
};

Single.args = {
  text: 'The quick brown fox jumps over the lazy dog',
  type: 'info',
  dismissed: false,
  onDismiss
};

export const List = (() => (
    <Toasts
      toasts={toasts}
      onDismiss={onDismiss}
      onPause={onPause}
      onResume={onResume}
    />
));
