import React from 'react';
import { jsxDecorator } from 'storybook-addon-jsx';

import CheckboxField from 'components/CheckboxField/CheckboxField';
import ValueTracker from 'stories/ValueTracker';

export default {
  title: 'Admin/CheckboxField',
  component: CheckboxField,
  decorators: [
    jsxDecorator,
    (Story) => <ValueTracker><Story/></ValueTracker>
  ],
  argTypes: {
    title: {
      control: 'text'
    },
    value: {
      control: 'text'
    },
    message: {
      type: {
        control: 'select',
        options: ['', 'error']
      },
      value: {
        control: 'text'
      }
    },
    description: {
      control: 'text'
    }
  }
};

export const _CheckboxField = {
  args: {
    title: 'a checkbox field',
    value: '1',
    message: {
      type: 'error',
      value: 'A message about the field.'
    },
    description: 'A description of the field.'
  }
};
