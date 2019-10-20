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

const importanceLevels = Object.keys(TIP_IMPORTANCE_LEVELS)
  .reduce((accumulator, key) => ({
    ...accumulator,
    [`TIP_IMPORTANCE_LEVELS.${key}`]: TIP_IMPORTANCE_LEVELS[key]
  }), {});

storiesOf('Admin/Tip', module)
  .addDecorator(withKnobs)
  .addDecorator((storyFn) => (
    <div style={{ margin: '5em', width: '30em' }}>
      <ValueTracker>{storyFn()}</ValueTracker>
    </div>
  ))
  .addWithJSX(
    'Basic Example',
    withNotes(notes)(
      () => (
        <InputGroup>
          <Input {...inputProps} />
          <InputGroupAddon addonType="append">
            <Tip
              fieldTitle={'Tip Field'}
              id={'tip-field'}
              content={text('Content', 'Example tip contents')}
              icon={selectV2('Icon (examples)', ['lamp', 'attention', 'flag'], 'lamp')}
              importance={selectV2('Importance', importanceLevels, 'normal')}
            />
          </InputGroupAddon>
        </InputGroup>
      )
    )
  );
