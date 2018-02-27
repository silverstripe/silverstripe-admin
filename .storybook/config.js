import { configure } from '@storybook/react';
import { setOptions } from '@storybook/addon-options';

// dynamically load any `bundle.scss` or `Component-story.jsx` files
const modules = [
  require.context('../client/src', true, /(\/bundle\.scss|[A-Za-z]-story\.jsx?)$/),
  // comment out any of these if you do not have the module installed
  require.context('../../asset-admin/client/src', true, /(\/bundle\.scss|[A-Za-z]-story\.jsx?)$/),
  require.context('../../campaign-admin/client/src', true, /(\/bundle\.scss|[A-Za-z]-story\.jsx?)$/),
  require.context('../../cms/client/src', true, /(\/bundle\.scss|[A-Za-z]-story\.jsx?)$/),
];

function loadStories() {
  modules.forEach((module) => {
    module.keys().forEach((filename) => {
      module(filename);
    });
  });
}

setOptions({
  // disabling animations fixes some animation bugs that have been occurring
  sidebarAnimations: false,
  hierarchySeparator: /\/|\./,
  hierarchyRootSeparator: /\/|\./,
});
configure(loadStories, module);
