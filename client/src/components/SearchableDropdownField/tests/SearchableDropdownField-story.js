import React from 'react';
import SearchableDropdownField from '../SearchableDropdownField';

const options = [
  { label: 'One', value: 1 },
  { label: 'Two', value: 2 },
  { label: 'Three', value: 3 },
];

export default {
  title: 'Admin/SearchableDropdownField',
  component: SearchableDropdownField,
  decorators: [],
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'The SearchableDropdownField component.'
      },
      canvas: {
        sourceState: 'shown',
      },
    }
  },
  argTypes: {
    name: {
      control: 'text',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: null },
      },
    },
    options: {
      description: 'List of tags options',
      control: 'select',
      table: {
        type: { summary: 'string' },
      },
    },
  },
  args: {
    clearable: true,
    disabled: false,
    multi: false,
    searchable: true,
    placeholder: '',
    options,
    name: 'Test',
  }
};

export const _SearchableDropdownField = (props) => {
  let value = props.value;
  const onChange = (val) => {
    value = val;
  };
  return <SearchableDropdownField
    {...props}
    onChange={onChange}
    value={value}
  />;
};
