import React from 'react';
import { storiesOf, setAddon } from '@storybook/react';
import actionListMaker from '../../../stories/actionListMaker';
import { withKnobs, text, boolean, number, object } from '@storybook/addon-knobs';
import Tag from 'components/Tag/Tag';
import TagList from 'components/Tag/TagList';
import CompactTagList from 'components/Tag/CompactTagList';
import JSXAddon from 'storybook-addon-jsx';

setAddon(JSXAddon);

const tags = [
  { key: 'justKey' },
  { key: 'KeyPair', value: '123' },
  { key: 'KeyLabel', label: 'Some label' },
  { key: 'KeyPairLabel', label: 'Some label', value: '123' }
];

const tagActions = actionListMaker('onClick', 'onDelete', 'onDeleteKey', 'onBackSpace', 'onNext', 'onPrevious');
const tagListActions = actionListMaker('onHolderFocus', 'onTagClick', 'onTagDelete');
const compactTagListActions = actionListMaker('onSummary');


storiesOf('Admin/Tag', module)
  .addDecorator(story => (
    <div style={{ background: 'white', padding: '20px' }}>
      {story()}
    </div>
  ))
  .addDecorator(withKnobs)
  .addWithJSX('Tag', () => (
    <Tag
      dataKey={text('dataKey', 'HelloWorld')}
      label={text('label', '')}
      value={text('value', '')}
      deletable={boolean('Deletable', false)}
      focusable={boolean('focusable', true)}
      {...tagActions}
    />
  ))
  .addWithJSX('TagList', () => (
    <TagList
      deletable={boolean('Deletable', false)}
      focusable={boolean('focusable', true)}
      tags={tags}
      {...tagListActions}
    />
  ))
  .addWithJSX('CompactTagList', () => (
    <CompactTagList
      deletable={boolean('Deletable', false)}
      focusable={boolean('focusable', true)}
      maxSize={number('maxSize', 200)}
      tags={object('tags', tags)}
      {...tagListActions}
      {...compactTagListActions}
    />
  ));

