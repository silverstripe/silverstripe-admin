import React from 'react';
import { jsxDecorator } from 'storybook-addon-jsx';
import Badge, { statuses } from 'components/Badge/Badge';

export default {
    title: 'Admin/Badges',
    component: Badge,
    decorators: [
        jsxDecorator,
        (Story) => <div><Story/></div>
    ],
    argTypes: {
        status: {
          control: 'select',
          options: statuses
        },
        inverted: {
          control: 'boolean'
        },
        className: {
          control: 'inline-radio',
          options: {
            'Empty class name': '',
            'badge-pill class name': 'badge-pill'
          }
        }
      }
  };

export const _Badge = {
    args: {
        message: 'Hello World!',
        status: 'default',
        className: 'badge-pill',
        inverted: false
    }
};
