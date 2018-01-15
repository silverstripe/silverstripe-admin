import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { storiesOf } from '@storybook/react';
// eslint-disable-next-line import/no-extraneous-dependencies
// import { action } from '@storybook/addon-actions';
// import { Component as TreeDropdownField } from 'components/TreeDropdownField/TreeDropdownField';
import ValueTracker from 'stories/ValueTracker';

// const triggerAction = action('action');
/*
const props = {
  name: 'MyField',
  selectedValues: [],
  search: '',
  data: {
    urlTree: '',
  },
  actions: {
    treeDropdownField: {
      setSearch: (...args) => triggerAction('setSearch', ...args),
      beginTreeUpdating: (...args) => triggerAction('beginTreeUpdating', ...args),
    },
  },
};
*/
storiesOf('Admin/TreeDropdownField', module)
  .addDecorator((storyFn) => (
    <ValueTracker>{storyFn()}</ValueTracker>
  ))
  .add('Plain Tree-dropdown', () => (
    <div>Work in progress - too fricken hard!</div>
    // <TreeDropdownField
    //   {...props}
    // />
  ));
