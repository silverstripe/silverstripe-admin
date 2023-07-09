import React from 'react';
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import ValueTracker from 'stories/ValueTracker';

import treeDropdownFieldReducer from 'state/treeDropdownField/TreeDropdownFieldReducer';
import { ConnectedTreeDropdownField as TreeDropdownField } from 'components/TreeDropdownField/TreeDropdownField';
import mockTree from './mockTree';

// TreeDropdownField depends on having a basic Redux store present to operate
const store = createStore(
  combineReducers({ treeDropdownField: treeDropdownFieldReducer }),
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

// Replaces the standard API call with a mock that returns static tree data
const fetchMock = () =>
  Promise.resolve({ json: () => Promise.resolve(mockTree) });

export default {
  title: 'Admin/TreeDropdownField',
  component: TreeDropdownField,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `A complex select field that binds to an API to allow progressive fetching of nested items. \`TreeDropdownField\` was
        originally developed for use with \`SiteTree\` and \`Folder\` objects, but can be used with any \`DataObject\` that has the
        \`Hierarchy\` extension applied.
        This React component also powers the PHP API's \`TreeMultiselectField\`, allowing multiple items to be selected, by
        setting \`multi: true\`.
        A Redux store with \`TreeDropdownFieldReducer\` installed must be provided as context if the component is used outside
        the CMS. This is used to store the API responses and general state of each \`TreeDropdownField\` instance. You can open
        the Redux Devtools panel to observe the actions and state used by the component.`
      },
      canvas: {
        sourceState: 'hide',
      },
      controls: {
        sort: 'alpha',
      },
      story: {
        height: '200px'
      }
    },
  },

  decorators: [
    (storyFn) => (
      <div style={{ width: '400px' }}>
        <Provider store={store}>
          <ValueTracker>{storyFn()}</ValueTracker>
        </Provider>
      </div>
    ),
  ],
};

export const Standard = args => <TreeDropdownField {...args} />;
Standard.args = {
  id: 'MyField',
  name: 'MyField',
  data: {
    urlTree: '',
  },
  fetch: fetchMock,
};
