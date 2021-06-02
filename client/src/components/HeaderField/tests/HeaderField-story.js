import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import HeaderField from 'components/HeaderField/HeaderField';
import { setAddon, storiesOf } from '@storybook/react';
import { withKnobs, selectV2, text } from '@storybook/addon-knobs';
import JSXAddon from 'storybook-addon-jsx';

setAddon(JSXAddon);

storiesOf('Admin/HeaderField', module)
  .addDecorator(withKnobs)
  .addWithJSX('Heading', () => (
    <HeaderField
      extraClass="my-extra-class"
      data={{
          title: text('title', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit'),
          headingLevel: selectV2('headingLevel', [1, 2, 3, 4, 5], 1)
        }}
    />
    )
  );
