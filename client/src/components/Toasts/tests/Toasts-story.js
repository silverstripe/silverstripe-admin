import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { setAddon, storiesOf } from '@storybook/react';
import { withKnobs, selectV2, text, boolean } from '@storybook/addon-knobs';
import { withNotes } from '@storybook/addon-notes';
import JSXAddon from 'storybook-addon-jsx';
import actionListMaker from '../../../stories/actionListMaker';

setAddon(JSXAddon);

import notes from '../README.md';
import Toasts from '../Toasts';
import Toast from '../Toast';

const { onDismiss, primaryAction, onPause, onResume } =
  actionListMaker('onDismiss', 'primaryAction', 'onPause', 'onResume');
const actions = [
  { label: 'Primary', onClick: primaryAction },
  { label: 'Secondary', href: 'https://silverstripe.com' },
];

const toasts = [
  { text: 'Notice me', type: 'notice', id: 'one', dismissed: false },
  { text: 'You have failed me for the last time, General', type: 'error', id: 'two', dismissed: false },
  { text: 'Let\'s toast to your success', type: 'success', id: 'three', dismissed: false },
  { text: 'Nice toast you\'ve got there. Would be a shame if someone dismissed it.', type: 'warning', id: 'four', dismissed: false },
];

storiesOf('Admin/Toasts', module)
  .addDecorator(withKnobs)
  .addDecorator((storyFn) => (<div>{storyFn()}</div>))
  .addWithJSX(
    'Single',
    withNotes(notes)(
      () => (
        <Toast
          text={text('text', 'The quick brown fox jumps over the lazy dog')}
          type={selectV2('type', ['info', 'success', 'warning', 'error'], 'info')}
          dismissed={boolean('dismissed', false)}
          onDismiss={onDismiss}
          actions={actions.slice(0, selectV2('actions', [0, 1, 2], 0))}
        />
      )
    )
  )
  .addWithJSX(
    'List',
    withNotes(notes)(
      () => (
        <Toasts toasts={toasts} onDismiss={onDismiss} onPause={onPause} onResume={onResume} />
      )
    )
  );
