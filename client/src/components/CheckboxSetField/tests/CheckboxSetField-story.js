import React from 'react';
import { storiesOf, setAddon } from '@storybook/react';
import { withKnobs, text, boolean, object, select } from '@storybook/addon-knobs/react';
import JSXAddon from 'storybook-addon-jsx';
import ValueTracker from 'stories/ValueTracker';
import CheckboxSetField from 'components/CheckboxSetField/CheckboxSetField';

setAddon(JSXAddon);

const source = [
  { value: '1', title: 'one' },
  { value: '2', title: 'two' },
  { value: '3', title: 'three' },
  { value: '4', title: 'four' },
  ];

storiesOf('Admin/CheckboxSetField', module)
  .addDecorator((storyFn) => (
    <ValueTracker>{storyFn()}</ValueTracker>
  ))
  .addDecorator(withKnobs)
  .addWithJSX('CheckboxSet', () => (
    <CheckboxSetField
      id={text('id', 'FieldID')}
      description={text('description', 'Field Description')}
      value={['3']}
      source={object('source', source)}
      hideLabels={boolean('hideLabels', false)}
      title={text('title', 'Field Title')}
      rightTitle={text('rightTitle', 'Right Title')}
      name={text('name', 'FieldName')}
      message={{
        type: select('message type', ['', 'error'], 'error'),
        value: text('message', 'A message about the field.')
      }}
    />
  ));
