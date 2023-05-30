import React from 'react';
import actionListMaker from '../../../stories/actionListMaker';
import Tag from 'components/Tag/Tag';
import TagList from 'components/Tag/TagList';
import CompactTagList from 'components/Tag/CompactTagList';
import { jsxDecorator } from 'storybook-addon-jsx';

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
    decorators: [
        jsxDecorator,
        (Story) => <div style={{ background: 'white', padding: '20px' }}><Story/></div>
    ],
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
