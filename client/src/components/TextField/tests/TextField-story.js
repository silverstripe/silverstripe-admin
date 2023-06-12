import React from 'react';
import { jsxDecorator } from 'storybook-addon-jsx';

import TextField from 'components/TextField/TextField';
import ValueTracker from 'stories/ValueTracker';

const props = {
  name: 'MyField',
  id: 'MyField',
  title: 'Field title',
  placeholder: 'Placeholder text',
};

export default {
  title: 'Admin/TextField',
  decorators: [
    jsxDecorator,
    (Story) => <ValueTracker><Story/></ValueTracker>,
  ]
};

export const Textbox = () => <TextField {...props} />;

export const Textarea = () => (
  <TextField
    {...props}
    data={{ rows: 4, columns: 40 }}
  />
);

export const AllTitles = () => (
  <TextField
    {...props}
    value="Default text"
    rightTitle={'Right title'}
    description={'My description'}
    data={{
      prefix: 'prefix',
      suffix: 'suffix',
    }}
  />
);

export const ValidationFailed = () => (
  <TextField
    {...props}
    value="Default text"
    description={'Field description'}
    message={{
      value: 'Validation message',
      type: 'error', // This is the only type covered by our styles anyway
    }}
  />
);
