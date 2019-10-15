import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { setAddon, storiesOf } from '@storybook/react';
import { withKnobs, selectV2, text } from '@storybook/addon-knobs';
import { withNotes } from '@storybook/addon-notes';
import JSXAddon from 'storybook-addon-jsx';

setAddon(JSXAddon);

import notes from '../README.md';

import Tip, { TIP_IMPORTANCE_LEVELS } from 'components/Tip/Tip';
import ValueTracker from 'stories/ValueTracker';
import { Input, InputGroup, InputGroupAddon } from 'reactstrap';

const inputProps = {
  name: 'MyField',
  id: 'MyField',
  title: 'Field title',
  placeholder: 'Placeholder text',
};

storiesOf('Admin/Tip', module)
  .addDecorator(withKnobs)
  .addDecorator((storyFn) => (
    <ValueTracker>{storyFn()}</ValueTracker>
  ))
  .addWithJSX(
    'Basic Example',
    withNotes(notes)(
      () => (
        <div style={{ margin: '5em', width: '30em' }}>
          <InputGroup>
            <Input {...inputProps} />
            <InputGroupAddon addonType="append">
              <Tip
                content={text('Content', 'Example tip contents')}
                icon={text('Icon', 'lamp')}
                importance={selectV2('Importance', Object.values(TIP_IMPORTANCE_LEVELS), 'normal')}
              />
            </InputGroupAddon>
          </InputGroup>
        </div>
      )
    )
  );
