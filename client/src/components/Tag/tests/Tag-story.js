import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { storiesOf } from '@storybook/react';
import Tag from '../Tag';
import TagList from '../TagList';
import CompactTagList from '../CompactTagList';

const tags = [
  {key: 'justKey'},
  {key: 'KeyPair', value: '123'},
  {key: 'KeyLabel', label: "Some label"},
  {key: 'KeyPairLabel', label: "Some label", value: '123'}
];

const moreTags = [
  {key: 'MoreValue', value: '123'},
  {key: 'ExtraValue', value: '123'},
  {key: 'MoreExtraValue', value: '123'},
  {key: 'ReallyALotOfValue', value: '123'},
].concat(tags);

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
    <div style={{"background": 'white', 'padding': '20px'}}>
      <TagList tags={tags} />
      <TagList tags={tags} deletable />
    </div>
  ))
  .add('CompactTagList', () => (
    <div style={{"background": 'white', 'padding': '20px'}}>
      <CompactTagList tags={tags} deletable maxSize={600} />
      <CompactTagList tags={moreTags} deletable maxSize={600} />
    </div>
  ));

