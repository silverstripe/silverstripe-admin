import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { storiesOf } from '@storybook/react';
import Tag from '../Tag';
import TagList from '../TagList';

const tags = [
  {key: 'justKey'},
  {key: 'KeyPair', value: '123'},
  {key: 'KeyLabel', label: "Some label"},
  {key: 'KeyPairLabel', label: "Some label", value: '123'}
];

storiesOf('Admin/Tag', module)
  .add('Tag', () => (
    <div style={{"background": 'white', 'padding': '20px'}}>
      <Tag dataKey={"HelloWorld"} />
      <Tag label="Hello World" />
      <Tag dataKey="Deletable" deletable />
      <Tag dataKey="KeyPair" value="SomeValue123" />
      <Tag dataKey="DeletableKeyPair" value="SomeValue123" deletable />
    </div>
  ))
  .add('TagList', () => (
    <TagList tags={tags} />
  ));
