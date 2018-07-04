import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { storiesOf } from '@storybook/react';
import Search from 'components/Search/Search';
import ValueTracker from 'stories/ValueTracker';
import { createStore, combineReducers } from 'redux';
import { reducer as ReduxFormReducer } from 'redux-form';
import SchemaReducer from 'state/schema/SchemaReducer';

const FormReducer = combineReducers({
  formState: ReduxFormReducer,
  formSchemas: SchemaReducer,
});

const props = {
  name: 'MyField',
  title: 'Field title',
  placeholder: 'Placeholder text (Defaults to "Admin.SEARCH")',
  store: createStore(combineReducers({form: FormReducer})),
};

storiesOf('Admin/Search', module)
  .addDecorator((storyFn) => (
    <ValueTracker>{storyFn()}</ValueTracker>
  ))
  .add('Search', () => (
    <Search
      {...props}
    />
  ));
