import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { storiesOf } from '@storybook/react';
import LiteralField from 'components/LiteralField/LiteralField';

const props = {
  id: 'my-id',
  name: 'MyName',
  className: 'my-classname',
  extraClass: 'my-extra-class',
  value: '<h2>My literal heading</h2><p>My literal content</p>',
};

storiesOf('Admin/LiteralField', module)
  .add('Default', () => (
    <LiteralField {...props} />
  ));
