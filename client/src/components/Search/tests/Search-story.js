import React from 'react';
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
    onSearch: () => {},
    store: createStore(combineReducers({ form: FormReducer })),
};

export default {
    title: 'Admin/Search',
    decorators: [(Story) => <ValueTracker><Story/></ValueTracker>],
};

export const SimpleVanilla = () => (
    <Search
      id="SimpleVanillaSearch"
      display="VISIBLE"
      displayBehavior={'NONE'}
      {...props}
    />
);

export const WithFilters = () => (
    <Search
      id="SmallNotExpanded"
      display="VISIBLE"
      formSchemaUrl=""
      filters={{}}
      formData={{}}
      placeholder={"Search 'Pages'"}
      displayBehavior={'NONE'}
      forceFilters
      {...props}
    />
);

export const Hideable = () => (
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
);

export const Toggeable = () => (
    <Search
      id="TOGGEABLE"
      display="NONE"
      displayBehavior="TOGGLABLE"
      formSchemaUrl=""
      formData={{}}
      forceFilters
      {...props}
    />
);

export const Wide = () => (
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
);

export const ToggleButton = () => (
    <div>
        <SearchToggle />
        <SearchToggle toggled />
    </div>
);

ToggleButton.story = {
    name: 'Toggle button',
};
