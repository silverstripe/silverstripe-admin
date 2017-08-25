import { configure } from '@storybook/react';

import '../client/dist/styles/bundle.css';

function loadStories() {
  require('../client/src/stories');
}

configure(loadStories, module);
