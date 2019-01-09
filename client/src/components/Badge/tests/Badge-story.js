import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { storiesOf, setAddon } from '@storybook/react';
import { withKnobs, text, boolean, select } from '@storybook/addon-knobs/react';
import JSXAddon from 'storybook-addon-jsx';

import Badge, { statuses } from 'components/Badge/Badge';


setAddon(JSXAddon);

storiesOf('Admin/Badges', module)
  .addDecorator(story => <div>{story()}</div>)
  .addDecorator(withKnobs)
  .addWithJSX('Badge', () => (
    <Badge
      message={text('message', 'Hello World')}
      status={select('status', statuses, 'default')}
      className={boolean('pill', true) ? 'badge-pill' : ''}
      inverted={boolean('inverted')}
    />
  ));
