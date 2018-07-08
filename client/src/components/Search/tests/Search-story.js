import React, {PropTypes} from 'react';
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
  placeholder: 'Placeholder text (Defaults to "Admin.SEARCH")',
  store: createStore(combineReducers({form: FormReducer})),
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
        placeholder="Search me"
        displayBehavior={"NONE"}
        {...props}
      />
  )).add('Search Small Expanded', () => (
      <Search
        id="SmallExpanded"
        display="EXPANDED"
        showFilters={false}
        formSchemaUrl=""
        forceFilters={true}
        filters={{}}
        formData={{}}
        placeholder="Search me"
        displayBehavior={"NONE"}
        {...props}
      />
  ));



// Search.propTypes = {
//
//   id: PropTypes.string.isRequired,
//   display: PropTypes.oneOf(Object.values(display)),
//   showFilters: PropTypes.bool,
//   formSchemaUrl: PropTypes.string,
//   filters: PropTypes.object,
//   formData: PropTypes.object,
//   placeholder: PropTypes.string,
//   displayBehavior: PropTypes.oneOf(Object.values(displayBehavior)),
//   term: PropTypes.string,
// };
