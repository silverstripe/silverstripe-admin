import React from 'react';
import { storiesOf, setAddon } from '@storybook/react';
import actionListMaker from '../../../stories/actionListMaker';
import { withKnobs, text, boolean, select, number } from '@storybook/addon-knobs/react';
import JSXAddon from 'storybook-addon-jsx';
import NumberField from 'components/NumberField/NumberField';

setAddon(JSXAddon);

const tagActions = actionListMaker('onClick', 'onChange');

storiesOf('Admin/NumberField', module)
  .addDecorator(story => (
    <div>
      {story()}
    </div>
  ))
  .addDecorator(withKnobs)
  .addWithJSX('NumberField', () => (
    <NumberField
      title={text('title', 'My Number Field')}
      value={number('value', '42')}
      placeholder={text('placeholder', 'What is the answer to life, the universe, and everything?')}
      description={text('description', 'You can add descriptions here')}
      disabled={boolean('disabled', '')}
      message={{
        type: select('message type', ['', 'error'], 'error'),
        value: text('message', '')
      }}
      {...tagActions}
    />
  ));

