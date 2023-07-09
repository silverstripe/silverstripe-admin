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
/* eslint-disable-next-line no-unused-vars */
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
  component: Toast,
  decorators: [jsxDecorator],
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `Toast notifications should be used to notify the user that their action has altered the state of the application.
        They are rendered as temporary messages in the top right corner of the Admin UI. A toast notification may have 1 or 2 _actions_ attached to it.
        Use the provided toast Redux actions to push a new toast notification into the Redux store.
        Alternatively, you can use the \`jQuery.noticeAdd\` to display a toast notification in legacy Entwine-based contexts.
        By default, toast notifications are ephemeral. They should occur in response to a user action and communicate short, non-critical messages, such as confirming the success of an operation.
        Do not use them to display critical information that requires immediate action from the user, such as validation errors. Consider using form alerts or modal alerts instead.
        For notifications with a moderate importance (e.g.: warning and non-critical errors), consider disabling the toast notification timeout by setting the \`stay\` attribute to \`true\`.
        If you attach actions to a toast notification, those should be shortcuts to a natural next step and an alternative 
        way of performing that task should be available. e.g.: A toast confirming the publication of a page could offer an action to "View live page". `
      },
      canvas: {
        sourceState: 'shown',
      },
      controls: {
        sort: 'alpha',
      },
      story: {
        height: '300px'
      }
    },
  },
  argsType: {
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
  }
};

export const Single = (args) => (
  <Toast {...args} />
);
Single.args = {
  text: 'The quick brown fox jumps over the lazy dog',
  type: 'info',
  dismissed: false,
  onDismiss
};

export const List = (args) => (
  <Toasts {...args} />
);
List.args = {
  toasts,
  onDismiss,
  onPause,
  onResume,
};
