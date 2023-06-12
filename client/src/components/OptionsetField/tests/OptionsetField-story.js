import React from 'react';
import OptionsetField from 'components/OptionsetField/OptionsetField';
import ValueTracker from 'stories/ValueTracker';

const props = {
  id: 'set',
  title: '',
  name: 'set',
  value: '2',
  source: [
    { value: '1', title: 'one' },
    { value: '2', title: 'two' },
    { value: '3', title: 'three' },
    { value: '4', title: 'four' },
  ],
};

export default {
  title: 'Admin/OptionsetField',

  decorators: [(storyFn) => <ValueTracker>{storyFn()}</ValueTracker>],
};

export const Optionset = () => <OptionsetField {...props} />;
