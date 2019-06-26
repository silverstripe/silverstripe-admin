import { configure } from '@storybook/react';
import { setOptions } from '@storybook/addon-options';

import extraStoryModules from './.stories.js';

// dynamically load any `bundle.scss` or `Component-story.jsx` files
const modules = [
  require.context('../client/src', true, /(\/bundle\.scss|[A-Za-z]-story\.jsx?)$/),
  ...extraStoryModules,
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
  addonPanelInRight: false,
});
configure(loadStories, module);
