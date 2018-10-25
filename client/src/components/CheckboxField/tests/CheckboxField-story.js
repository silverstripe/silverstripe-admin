import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { storiesOf, setAddon } from '@storybook/react';
import { withKnobs, text, select } from '@storybook/addon-knobs/react';
import JSXAddon from 'storybook-addon-jsx';

import CheckboxField from 'components/CheckboxField/CheckboxField';
import ValueTracker from 'stories/ValueTracker';

setAddon(JSXAddon);

storiesOf('Admin/CheckboxField', module)
  .addDecorator((storyFn) => (
    <ValueTracker>{storyFn()}</ValueTracker>
  ))
  .addDecorator(withKnobs)
  .addWithJSX('CheckboxField', () => (
    <CheckboxField
      title={text('title', 'a checkbox field')}
      value={text('value', '1')}
      message={{
        type: select('message type', ['', 'error'], 'error'),
        value: text('message', 'A message about the field.')
      }}
      description={text('description', 'A description of the field.')}
    />
  ));
