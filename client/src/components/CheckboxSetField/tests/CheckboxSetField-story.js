import React from 'react';
import { jsxDecorator } from 'storybook-addon-jsx';
import ValueTracker from 'stories/ValueTracker';
import CheckboxSetField from 'components/CheckboxSetField/CheckboxSetField';

const source = [
  { value: '1', title: 'one' },
  { value: '2', title: 'two' },
  { value: '3', title: 'three' },
  { value: '4', title: 'four' },
];

export default {
  title: 'Admin/CheckboxSetField',
  component: CheckboxSetField,
  decorators: [
    jsxDecorator,
    (Story) => <ValueTracker><Story/></ValueTracker>
  ],
  argTypes: {
    id: { control: 'text' },
    description: { control: 'text' },
    value: {
      control: 'inline-radio',
      options: [1, 2, 3, 4]
    },
    hideLabels: { control: 'boolean' },
    title: { control: 'text' },
    rightTitle: { control: 'text' },
    name: { control: 'text' },
    message: {
      type: {
        control: 'select',
        options: ['', 'error']
      },
      value: {
        control: 'text'
      }
    }
  }
};

export const _CheckboxSetField = {
  args: {
    id: 'FieldID',
    description: 'Field Description',
    value: 3,
    hideLabels: false,
    title: 'Field Title',
    rightTitle: 'Right Title',
    name: 'FieldName',
    message: {
      type: 'error',
      value: 'A message about the field.'
    },
    source
  }
};
