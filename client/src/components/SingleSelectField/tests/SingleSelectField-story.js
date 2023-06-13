import React from 'react';
import SingleSelectField from 'components/SingleSelectField/SingleSelectField';

const props = {
  name: 'options',
  source: [
    {
      value: 1,
      title: 'One',
      description: 'One is the first number',
    },
    {
      value: 2,
      title: 'Two',
      description: 'Two is the second number',
    },
    {
      value: 3,
      title: 'Three',
      description: 'Three is the third number',
    },
    {
      value: 4,
      title: 'Four (Disabled)',
      disabled: true,
      description: 'Four is the fourth number',
    },
  ],
};

export default {
  title: 'Admin/SingleSelectField',
};

export const EmptyDefault = () => (
  <SingleSelectField
    {...props}
    data={{
      hasEmptyDefault: true,
      emptyString: 'Choose an option',
    }}
  />
);

export const Readonly = () => (
  <SingleSelectField {...props} readOnly value="One" />
);
