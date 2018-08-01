import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { storiesOf } from '@storybook/react';
import Tag from 'components/Tag/Tag';

storiesOf('Admin/Tag', module)
  .add('SingleTag', () => (
    <div style={{"background": 'white', 'padding': '20px'}}>
      <Tag label="Hello World" />
      <Tag label="Deletable" deletable />
    </div>
  ));
