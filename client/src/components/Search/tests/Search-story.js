import React, { PropTypes } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { storiesOf } from '@storybook/react';
import Search from '../Search';
import SearchToggle from '../SearchToggle';
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
  store: createStore(combineReducers({ form: FormReducer })),
};

storiesOf('Admin/Search', module)
  .addDecorator((storyFn) => (
    <ValueTracker>{storyFn()}</ValueTracker>
  ))
  .add('Search Small Collapse', () => (
    <Search
      id="SmallNotExpanded"
      display="VISIBLE"
      showFilters={false}
      formSchemaUrl=""
      filters={{}}
      formData={{}}
      placeholder={'Search "Pages"'}
      displayBehavior={'NONE'}
      forceFilters
      {...props}
    />
  )).add('Search Small Expanded', () => (
    <Search
      id="SmallExpanded"
      display="EXPANDED"
      showFilters={false}
      formSchemaUrl=""
      forceFilters
      filters={{}}
      formData={{}}
      placeholder="Search me"
      displayBehavior={'NONE'}
      {...props}
    />
  )).add('Search hideable', () => (
    <div style={{ width: '800px' }}>
      <Search
        id="Large Hideable"
        display="VISIBLE"
        showFilters={false}
        formSchemaUrl=""
        forceFilters
        filters={{}}
        formData={{}}
        placeholder="Search me"
        displayBehavior={'HIDEABLE'}
        {...props}
      />
    </div>
  )).add('Toggeable Search', () => (
    <SearchToggle toogle={console.dir} />
  ));
