import React from 'react';
import Tag from 'components/Tag/Tag';
import TagList from 'components/Tag/TagList';
import CompactTagList from 'components/Tag/CompactTagList';
import { jsxDecorator } from 'storybook-addon-jsx';
import actionListMaker from '../../../stories/actionListMaker';

const tags = [
  { key: 'justKey' },
  { key: 'KeyPair', value: '123' },
  { key: 'KeyLabel', label: 'Some label' },
  { key: 'KeyPairLabel', label: 'Some label', value: '123' },
];

const tagActions = actionListMaker(
  'onClick',
  'onDelete',
  'onDeleteKey',
  'onBackSpace',
  'onNext',
  'onPrevious'
);
const tagListActions = actionListMaker(
  'onHolderFocus',
  'onTagClick',
  'onTagDelete'
);
const compactTagListActions = actionListMaker('onSummary');

export default {
  title: 'Admin/Tag',
  component: Tag,
  decorators: [jsxDecorator],
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: '`<Tag />` can be used to visually associate a record with related topics. Tags can be used individually or as part of a `<TagList />`'
      },
      canvas: {
        sourceState: 'shown',
      },
      controls: {
        sort: 'alpha',
      }
    }
  },
};

export const _TagList = (args) => (<TagList {...args}/>);
_TagList.args = {
  deletable: false,
  focusable: true,
  tags,
  ...tagListActions
};

export const _CompactTagList = (args) => (<CompactTagList {...args}/>);
_CompactTagList.args = {
  deletable: false,
  focusable: true,
  maxSize: 200,
  tags,
  ...tagListActions,
  ...compactTagListActions
};

export const _Tag = (args) => (<Tag {...args}/>);
_Tag.args = {
  dataKey: 'HelloWorld',
  label: '',
  value: '',
  deletable: false,
  focusable: true,
  ...tagActions
};
