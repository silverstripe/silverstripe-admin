import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { storiesOf } from '@storybook/react';
import Search from '../Search';
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
  onSearch: () => {},
  store: createStore(combineReducers({ form: FormReducer })),
};

storiesOf('Admin/Search', module)
  .addDecorator((storyFn) => (
    <ValueTracker>{storyFn()}</ValueTracker>
  ))
  .add('Simple Vanilla', () => (
    <Search
      id="SimpleVanillaSearch"
      display="VISIBLE"
      displayBehavior={'NONE'}
      {...props}
    />
  ))
  .add('With Filters', () => (
    <Search
      id="SmallNotExpanded"
      display="VISIBLE"
      formSchemaUrl=""
      filters={{}}
      formData={{}}
      placeholder={'Search "Pages"'}
      displayBehavior={'NONE'}
      forceFilters
      {...props}
    />
  ))
  .add('Hideable', () => (
    <Search
      id="Large Hideable"
      display="VISIBLE"
      formSchemaUrl=""
      forceFilters
      filters={{}}
      formData={{}}
      placeholder="Search me"
      displayBehavior={'HIDEABLE'}
      {...props}
    />
  ))
  .add('Toggeable', () => (
    <Search
      id="TOGGEABLE"
      display="NONE"
      displayBehavior="TOGGLABLE"
      formSchemaUrl=""
      formData={{}}
      forceFilters
      {...props}
    />
  ))
  .add('Wide', () => (
    <div style={{ width: '800px' }}>
      <Search
        id="WIDE"
        display="VISIBLE"
        displayBehavior="TOGGLABLE"
        formSchemaUrl=""
        formData={{}}
        forceFilters
        {...props}
      />
    </div>
  ));
