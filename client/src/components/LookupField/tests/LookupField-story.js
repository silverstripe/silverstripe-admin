import React from 'react';
import LookupField from 'components/LookupField/LookupField';
import ValueTracker from 'stories/ValueTracker';

const props = {
  name: 'plaintext',
  value: 2,
  source: [
    {
      value: 1,
      title: 'one',
    },
    {
      value: 2,
      title: 'two',
    },
    {
      value: 3,
      title: 'three',
    },
  ],
};

export default {
  title: 'Admin/LookupField',

  decorators: [(storyFn) => <ValueTracker>{storyFn()}</ValueTracker>],
};

export const Lookup = () => <LookupField {...props} />;
