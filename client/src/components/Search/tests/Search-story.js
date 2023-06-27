import React from 'react';
import { createStore, combineReducers } from 'redux';
import { reducer as ReduxFormReducer } from 'redux-form';
import SchemaReducer from 'state/schema/SchemaReducer';
import SearchToggle from '../SearchToggle';
import Search from '../Search';

const FormReducer = combineReducers({
  formState: ReduxFormReducer,
  formSchemas: SchemaReducer,
});

export default {
  title: 'Admin/Search',
  component: Search,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Allows users to search by term or filter results with a sub form.'
      },
      canvas: {
        sourceState: 'hide',
      },
      controls: {
        sort: 'alpha',
        exclude: ['store'],
      },
      story: {
        height: '200px'
      }
    }
  },
};

export const _Search = args => <Search {...args} />;
_Search.args = {
  name: 'MyField',
  title: 'Field title',
  onSearch: () => {},
  store: createStore(combineReducers({ form: FormReducer })),
};

export const SimpleVanilla = {
  args: {
    ..._Search.args,
    id: 'SimpleVanillaSearch',
    display: 'VISIBLE',
    displayBehavior: 'NONE'
  }
};

export const WithFilters = {
  args: {
    ..._Search.args,
    id: 'SmallNotExpanded',
    display: 'VISIBLE',
    formSchemaUrl: '',
    filters: {},
    formData: {},
    placeholder: "Search 'Pages'",
    displayBehavior: 'NONE',
    forceFilters: true
  }
};

export const Hideable = {
  args: {
    ..._Search.args,
    id: 'Large Hideable',
    display: 'VISIBLE',
    formSchemaUrl: '',
    forceFilters: true,
    filters: {},
    formData: {},
    placeholder: 'Search me',
    displayBehavior: 'HIDEABLE',
  }
};

export const Toggeable = {
  args: {
    ..._Search.args,
    id: 'TOGGEABLE',
    display: 'NONE',
    displayBehavior: 'TOGGLABLE',
    formSchemaUrl: '',
    formData: {},
    forceFilters: true
  }
};

export const Wide = {
  args: {
    ..._Search.args,
    id: 'WIDE',
    display: 'VISIBLE',
    displayBehavior: 'TOGGLABLE',
    formSchemaUrl: '',
    formData: {},
    forceFilters: true
  }
};

export const ToggleButton = () => (
  <div>
    <SearchToggle />
    <SearchToggle toggled />
  </div>
);
