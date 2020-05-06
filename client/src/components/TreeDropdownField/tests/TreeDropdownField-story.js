import React from 'react';
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import { storiesOf } from '@storybook/react';
import { withNotes } from '@storybook/addon-notes';
import ValueTracker from 'stories/ValueTracker';

import notes from '../README.md';
import treeDropdownFieldReducer from 'state/treeDropdownField/TreeDropdownFieldReducer';
import { ConnectedTreeDropdownField as TreeDropdownField } from 'components/TreeDropdownField/TreeDropdownField';
import mockTree from './mockTree';

// TreeDropdownField depends on having a basic Redux store present to operate
const store = createStore(
  combineReducers({ treeDropdownField: treeDropdownFieldReducer }),
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

// Replaces the standard API call with a mock that returns static tree data
const fetchMock = () => Promise.resolve({ json: () => Promise.resolve(mockTree) });

const props = {
  id: 'MyField',
  name: 'MyField',
  data: {
    urlTree: '',
  },
  fetch: fetchMock,
};

storiesOf('Admin/TreeDropdownField', module)
  .addDecorator((storyFn) => (
    <div style={{ width: '400px' }}>
      <Provider store={store}>
        <ValueTracker>
          {storyFn()}
        </ValueTracker>
      </Provider>
    </div>
  ))
  .add(
    'Standard',
    withNotes(notes)(() => <TreeDropdownField {...props} />)
  );
