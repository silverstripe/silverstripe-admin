import { configure } from '@storybook/react';

import '../client/src/styles/bundle.scss';

function loadStories() {
  require('../client/src/stories');
}

configure(loadStories, module);
